const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ── Room State ──
const rooms = new Map();

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function broadcastRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const players = room.players.map((p) => ({
    id: p.id,
    nickname: p.nickname,
    score: p.score,
    answered: p.answered,
    isHost: p.isHost,
  }));
  io.to(roomId).emit("room-update", {
    roomId,
    players,
    state: room.state,
    currentQuestion: room.currentQuestion,
    totalQuestions: room.questions.length,
    category: room.category,
  });
}

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  // ── 방 만들기 ──
  socket.on("create-room", ({ nickname, category }, cb) => {
    let code;
    do { code = generateCode(); } while (rooms.has(code));

    const room = {
      id: code,
      category,
      state: "waiting", // waiting → playing → finished
      players: [{ id: socket.id, nickname, score: 0, answered: 0, isHost: true }],
      questions: [],
      currentQuestion: -1,
      timer: null,
      answers: {},
    };
    rooms.set(code, room);
    socket.join(code);
    socket.roomId = code;
    cb({ success: true, roomId: code });
    broadcastRoom(code);
  });

  // ── 방 참가 ──
  socket.on("join-room", ({ roomId, nickname }, cb) => {
    const code = roomId.toUpperCase();
    const room = rooms.get(code);
    if (!room) return cb({ success: false, error: "방을 찾을 수 없습니다." });
    if (room.state !== "waiting") return cb({ success: false, error: "이미 게임이 진행 중입니다." });
    if (room.players.length >= 10) return cb({ success: false, error: "방이 가득 찼습니다. (최대 10명)" });
    if (room.players.some((p) => p.nickname === nickname))
      return cb({ success: false, error: "이미 사용 중인 닉네임입니다." });

    room.players.push({ id: socket.id, nickname, score: 0, answered: 0, isHost: false });
    socket.join(code);
    socket.roomId = code;
    cb({ success: true, roomId: code });
    broadcastRoom(code);
  });

  // ── 게임 시작 (방장만) ──
  socket.on("start-game", ({ questions }) => {
    const room = rooms.get(socket.roomId);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player?.isHost) return;

    room.questions = questions;
    room.state = "playing";
    room.currentQuestion = 0;
    room.answers = {};
    room.players.forEach((p) => { p.score = 0; p.answered = 0; });

    io.to(socket.roomId).emit("game-start", {
      question: room.questions[0],
      index: 0,
      total: room.questions.length,
    });
    broadcastRoom(socket.roomId);
    startTimer(socket.roomId);
  });

  // ── 답변 제출 ──
  socket.on("submit-answer", ({ answerIndex, timeLeft }) => {
    const room = rooms.get(socket.roomId);
    if (!room || room.state !== "playing") return;

    const qi = room.currentQuestion;
    const key = `${socket.id}_${qi}`;
    if (room.answers[key]) return; // 이미 답변

    const q = room.questions[qi];
    const correct = answerIndex === q.answer;
    const points = correct ? Math.max(5, timeLeft * 2) : 0; // 빠를수록 높은 점수

    room.answers[key] = { answerIndex, correct, points };

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.score += points;
      player.answered++;
    }

    // 실시간 점수 알림
    io.to(socket.roomId).emit("score-update", {
      playerId: socket.id,
      nickname: player?.nickname,
      correct,
      points,
      totalScore: player?.score || 0,
    });

    // 모든 플레이어 답변 완료 시 다음 문제로
    const allAnswered = room.players.every((p) =>
      room.answers[`${p.id}_${qi}`]
    );
    if (allAnswered) {
      clearTimeout(room.timer);
      advanceQuestion(socket.roomId);
    }
  });

  // ── 연결 해제 ──
  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    room.players = room.players.filter((p) => p.id !== socket.id);

    if (room.players.length === 0) {
      clearTimeout(room.timer);
      rooms.delete(roomId);
      return;
    }

    // 방장이 나가면 다음 사람이 방장
    if (!room.players.some((p) => p.isHost)) {
      room.players[0].isHost = true;
    }

    broadcastRoom(roomId);
  });
});

// ── Timer & Question Advance ──
function startTimer(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.timer = setTimeout(() => {
    // 시간 초과: 미답변자 처리
    const qi = room.currentQuestion;
    room.players.forEach((p) => {
      const key = `${p.id}_${qi}`;
      if (!room.answers[key]) {
        room.answers[key] = { answerIndex: -1, correct: false, points: 0 };
      }
    });
    advanceQuestion(roomId);
  }, 16000); // 15초 + 1초 여유
}

function advanceQuestion(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  const qi = room.currentQuestion;
  const q = room.questions[qi];

  // 정답 공개
  io.to(roomId).emit("question-result", {
    index: qi,
    correctAnswer: q.answer,
    explanation: q.explanation || "",
    scores: room.players.map((p) => ({
      nickname: p.nickname,
      score: p.score,
      correct: room.answers[`${p.id}_${qi}`]?.correct || false,
    })),
  });

  // 2초 후 다음 문제 또는 종료
  setTimeout(() => {
    room.currentQuestion++;
    if (room.currentQuestion >= room.questions.length) {
      // 게임 종료
      room.state = "finished";
      const rankings = [...room.players]
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({ rank: i + 1, nickname: p.nickname, score: p.score }));
      io.to(roomId).emit("game-end", { rankings });
      broadcastRoom(roomId);

      // 5분 후 방 삭제
      setTimeout(() => rooms.delete(roomId), 300000);
    } else {
      room.answers = {};
      io.to(roomId).emit("next-question", {
        question: room.questions[room.currentQuestion],
        index: room.currentQuestion,
        total: room.questions.length,
      });
      startTimer(roomId);
    }
  }, 2500);
}

// ── Health check ──
app.get("/", (req, res) => {
  res.json({ status: "ok", rooms: rooms.size });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Quiz Battle Server running on port ${PORT}`);
});
