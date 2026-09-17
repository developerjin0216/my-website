// 1:1 온라인 오목 — 퀴즈 배틀과 같은 Socket.IO 서버에 얹되 방 저장소는 분리합니다.
// 이벤트 이름에 모두 omok: 접두사를 붙여 퀴즈 이벤트와 섞이지 않게 했습니다.
//
// 규칙: 자유룰(free-style). 가로·세로·대각선으로 돌 5개 이상이 이어지면 이깁니다.
// 렌주룰의 흑 금수(3-3, 4-4, 장목)는 적용하지 않습니다 — 초보자가 영문도 모르고
// 지는 일이 많고, 판정 로직이 복잡해 버그가 나면 대국이 깨지기 때문입니다.
// 대신 흑이 유리한 것을 감안해 매판 선공을 번갈아 잡도록 했습니다.

const SIZE = 15; // 15x15 정규 판
const WIN = 5;

/** roomId -> room */
const omokRooms = new Map();

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); // 0=빈칸 1=흑 2=백
}

function makeCode(exists) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 0·O·1·I 제외
  let code;
  do {
    code = "";
    for (let i = 0; i < 6; i++)
      code += chars[Math.floor(Math.random() * chars.length)];
  } while (exists(code));
  return code;
}

/** 마지막 착수점에서 네 방향만 검사 — 전체 판을 훑을 필요가 없습니다 */
function isWin(board, x, y, stone) {
  const dirs = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  for (const [dx, dy] of dirs) {
    let count = 1;
    for (const sign of [1, -1]) {
      let nx = x + dx * sign;
      let ny = y + dy * sign;
      while (
        nx >= 0 &&
        nx < SIZE &&
        ny >= 0 &&
        ny < SIZE &&
        board[ny][nx] === stone
      ) {
        count++;
        nx += dx * sign;
        ny += dy * sign;
      }
    }
    if (count >= WIN) return true;
  }
  return false;
}

function publicRoom(room) {
  return {
    id: room.id,
    status: room.status, // waiting | playing | ended
    board: room.board,
    turn: room.turn, // 1=흑 2=백
    lastMove: room.lastMove,
    winner: room.winner, // null | 1 | 2 | 0(무승부)
    reason: room.reason, // null | "five" | "resign" | "left" | "draw"
    moveCount: room.moveCount,
    players: room.players.map((p) => ({
      nickname: p.nickname,
      stone: p.stone,
      wins: p.wins,
    })),
  };
}

function broadcast(io, room) {
  io.to(`omok:${room.id}`).emit("omok:room", publicRoom(room));
}

function listWaiting() {
  const out = [];
  for (const room of omokRooms.values()) {
    if (room.status === "waiting" && room.players.length === 1) {
      out.push({ id: room.id, host: room.players[0].nickname });
    }
  }
  return out;
}

function finish(io, room, winner, reason) {
  room.status = "ended";
  room.winner = winner;
  room.reason = reason;
  if (winner === 1 || winner === 2) {
    const p = room.players.find((x) => x.stone === winner);
    if (p) p.wins += 1;
  }
  broadcast(io, room);
}

function leaveRoom(io, socket) {
  const roomId = socket.data.omokRoom;
  if (!roomId) return;
  const room = omokRooms.get(roomId);
  socket.data.omokRoom = null;
  socket.leave(`omok:${roomId}`);
  if (!room) return;

  const idx = room.players.findIndex((p) => p.socketId === socket.id);
  if (idx === -1) return;
  room.players.splice(idx, 1);

  if (room.players.length === 0) {
    omokRooms.delete(roomId);
  } else if (room.status === "playing") {
    // 대국 중 이탈 — 남은 사람 승
    finish(io, room, room.players[0].stone, "left");
  } else {
    room.status = "waiting";
    broadcast(io, room);
  }
  io.to("omok:lobby").emit("omok:list", listWaiting());
}

function register(io, socket) {
  socket.on("omok:lobby", () => {
    socket.join("omok:lobby");
    socket.emit("omok:list", listWaiting());
  });

  socket.on("omok:leave-lobby", () => socket.leave("omok:lobby"));

  socket.on("omok:create", ({ nickname }, cb) => {
    const name = String(nickname || "").trim().slice(0, 12);
    if (!name) return cb?.({ error: "닉네임을 입력해 주세요." });

    const id = makeCode((c) => omokRooms.has(c));
    const room = {
      id,
      status: "waiting",
      board: emptyBoard(),
      turn: 1,
      lastMove: null,
      winner: null,
      reason: null,
      moveCount: 0,
      firstStone: 1, // 다음 판 선공 (매판 번갈아)
      players: [{ socketId: socket.id, nickname: name, stone: 1, wins: 0 }],
    };
    omokRooms.set(id, room);
    socket.join(`omok:${id}`);
    socket.data.omokRoom = id;
    cb?.({ roomId: id });
    broadcast(io, room);
    io.to("omok:lobby").emit("omok:list", listWaiting());
  });

  socket.on("omok:join", ({ roomId, nickname }, cb) => {
    const id = String(roomId || "").trim().toUpperCase();
    const name = String(nickname || "").trim().slice(0, 12);
    const room = omokRooms.get(id);
    if (!room) return cb?.({ error: "방을 찾을 수 없습니다." });
    if (room.players.length >= 2) return cb?.({ error: "이미 두 명이 차 있습니다." });
    if (!name) return cb?.({ error: "닉네임을 입력해 주세요." });
    if (room.players.some((p) => p.nickname === name))
      return cb?.({ error: "같은 방에 같은 닉네임이 있습니다." });

    const taken = room.players[0].stone;
    room.players.push({
      socketId: socket.id,
      nickname: name,
      stone: taken === 1 ? 2 : 1,
      wins: 0,
    });
    socket.join(`omok:${id}`);
    socket.data.omokRoom = id;

    // 두 명이 모이면 바로 시작
    room.status = "playing";
    room.board = emptyBoard();
    room.turn = room.firstStone;
    room.lastMove = null;
    room.winner = null;
    room.reason = null;
    room.moveCount = 0;

    cb?.({ roomId: id });
    broadcast(io, room);
    io.to("omok:lobby").emit("omok:list", listWaiting());
  });

  socket.on("omok:place", ({ x, y }) => {
    const room = omokRooms.get(socket.data.omokRoom);
    if (!room || room.status !== "playing") return;
    const me = room.players.find((p) => p.socketId === socket.id);
    if (!me || me.stone !== room.turn) return; // 내 차례가 아님

    const cx = Number(x);
    const cy = Number(y);
    if (!Number.isInteger(cx) || !Number.isInteger(cy)) return;
    if (cx < 0 || cx >= SIZE || cy < 0 || cy >= SIZE) return;
    if (room.board[cy][cx] !== 0) return; // 이미 돌이 있음

    room.board[cy][cx] = me.stone;
    room.lastMove = { x: cx, y: cy, stone: me.stone };
    room.moveCount += 1;

    if (isWin(room.board, cx, cy, me.stone)) {
      return finish(io, room, me.stone, "five");
    }
    if (room.moveCount >= SIZE * SIZE) {
      return finish(io, room, 0, "draw");
    }

    room.turn = me.stone === 1 ? 2 : 1;
    broadcast(io, room);
  });

  socket.on("omok:resign", () => {
    const room = omokRooms.get(socket.data.omokRoom);
    if (!room || room.status !== "playing") return;
    const me = room.players.find((p) => p.socketId === socket.id);
    if (!me) return;
    finish(io, room, me.stone === 1 ? 2 : 1, "resign");
  });

  socket.on("omok:rematch", () => {
    const room = omokRooms.get(socket.data.omokRoom);
    if (!room || room.status !== "ended" || room.players.length !== 2) return;

    // 선공을 번갈아 — 흑이 유리한 자유룰의 불균형을 보정
    room.firstStone = room.firstStone === 1 ? 2 : 1;
    for (const p of room.players) p.stone = p.stone === 1 ? 2 : 1;

    room.status = "playing";
    room.board = emptyBoard();
    room.turn = room.firstStone;
    room.lastMove = null;
    room.winner = null;
    room.reason = null;
    room.moveCount = 0;
    broadcast(io, room);
  });

  socket.on("omok:leave", () => leaveRoom(io, socket));
  socket.on("disconnect", () => leaveRoom(io, socket));
}

module.exports = { register, omokRooms };
