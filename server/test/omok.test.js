// 오목 서버 통합 검증 — 실제 소켓 클라이언트 두 개로 대국을 진행합니다.
// 실행: 서버를 띄운 뒤 `node server/test/omok.test.js` (레포 루트에서)
const { io } = require("socket.io-client");
const URL = "http://localhost:3055";

const wait = (sock, ev) =>
  new Promise((res) => sock.once(ev, res));

function connect() {
  return new Promise((res) => {
    const s = io(URL, { transports: ["websocket"] });
    s.on("connect", () => res(s));
  });
}

(async () => {
  const a = await connect();
  const b = await connect();
  let pass = 0;
  let fail = 0;
  const check = (cond, name) => {
    if (cond) {
      pass++;
      console.log("  OK   " + name);
    } else {
      fail++;
      console.log("  FAIL " + name);
    }
  };

  // 방 생성 / 참가
  const created = await new Promise((r) =>
    a.emit("omok:create", { nickname: "흑돌" }, r)
  );
  check(!!created.roomId, "방 생성");

  const joined = await new Promise((r) =>
    b.emit("omok:join", { roomId: created.roomId, nickname: "백돌" }, r)
  );
  check(!joined.error, "방 참가");

  let state = await wait(b, "omok:room");
  check(state.status === "playing", "두 명 모이면 바로 시작");
  check(state.turn === 1, "흑 선공");
  check(state.players.length === 2, "플레이어 2명");

  // 차례가 아닌 사람이 두면 무시돼야 함
  b.emit("omok:place", { x: 5, y: 5 });
  await new Promise((r) => setTimeout(r, 120));
  check(state.moveCount === 0, "차례가 아니면 착수 무시");

  // 같은 자리 중복 착수 방지
  a.emit("omok:place", { x: 7, y: 7 });
  state = await wait(b, "omok:room");
  check(state.moveCount === 1, "흑 착수 반영");
  b.emit("omok:place", { x: 7, y: 7 });
  await new Promise((r) => setTimeout(r, 120));
  check(state.moveCount === 1, "이미 놓인 자리 거부");

  // 판 밖 좌표 거부
  b.emit("omok:place", { x: 99, y: 3 });
  await new Promise((r) => setTimeout(r, 120));
  check(state.moveCount === 1, "판 밖 좌표 거부");

  // 흑이 가로 5목 완성 (7,7)은 이미 둠 → (8,7)(9,7)(10,7)(11,7)
  const ended = new Promise((r) => a.on("omok:room", (s) => s.winner && r(s)));
  const moves = [
    [b, 0, 0],
    [a, 8, 7],
    [b, 0, 1],
    [a, 9, 7],
    [b, 0, 2],
    [a, 10, 7],
    [b, 0, 3],
    [a, 11, 7],
  ];
  for (const [sock, x, y] of moves) {
    sock.emit("omok:place", { x, y });
    await new Promise((r) => setTimeout(r, 60));
  }
  const fin = await Promise.race([
    ended,
    new Promise((r) => setTimeout(() => r(null), 2000)),
  ]);
  check(fin && fin.winner === 1, "가로 5목 흑 승리 판정");
  check(fin && fin.reason === "five", "승리 사유 five");
  check(fin && fin.status === "ended", "상태 ended");

  // 재대국 — 선공과 돌 색이 바뀌어야 함
  const beforeStones = fin.players.map((p) => p.stone).join(",");
  a.emit("omok:rematch");
  const re = await wait(b, "omok:room");
  check(re.status === "playing" && re.moveCount === 0, "재대국 시작");
  check(re.players.map((p) => p.stone).join(",") !== beforeStones, "돌 색 교대");
  check(re.turn === 2, "선공 교대 (2번째 판은 백이 선공)");

  // 기권
  a.emit("omok:resign");
  const rs = await wait(b, "omok:room");
  check(rs.reason === "resign", "기권 처리");

  // 대국 중 이탈 → 남은 사람 승
  a.emit("omok:rematch");
  await wait(b, "omok:room");
  b.disconnect();
  const left = await Promise.race([
    wait(a, "omok:room"),
    new Promise((r) => setTimeout(() => r(null), 2000)),
  ]);
  check(left && left.reason === "left", "이탈 시 남은 사람 승");

  a.disconnect();
  console.log(`\n통과 ${pass} / 실패 ${fail}`);
  process.exit(fail ? 1 : 0);
})();
