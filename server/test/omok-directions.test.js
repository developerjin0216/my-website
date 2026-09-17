const { io } = require("socket.io-client");
const URL = "http://localhost:3056";
const conn = () => new Promise((r) => { const s = io(URL, { transports: ["websocket"] }); s.on("connect", () => r(s)); });
const wait = (s, e) => new Promise((r) => s.once(e, r));

// 세로 / 대각선(↘) / 역대각선(↗) 승리 판정
const CASES = {
  "세로 5목": [[7,3],[7,4],[7,5],[7,6],[7,7]],
  "대각선 ↘": [[3,3],[4,4],[5,5],[6,6],[7,7]],
  "역대각선 ↗": [[3,9],[4,8],[5,7],[6,6],[7,5]],
};
(async () => {
  let pass=0, fail=0;
  for (const [name, blackMoves] of Object.entries(CASES)) {
    const a = await conn(), b = await conn();
    const room = await new Promise((r) => a.emit("omok:create", { nickname: "B"+name }, r));
    await new Promise((r) => b.emit("omok:join", { roomId: room.roomId, nickname: "W"+name }, r));
    await wait(b, "omok:room");
    const done = new Promise((r) => a.on("omok:room", (s) => s.winner && r(s)));
    for (let i = 0; i < blackMoves.length; i++) {
      a.emit("omok:place", { x: blackMoves[i][0], y: blackMoves[i][1] });
      await new Promise((r) => setTimeout(r, 50));
      if (i < blackMoves.length - 1) { b.emit("omok:place", { x: 13, y: i }); await new Promise((r) => setTimeout(r, 50)); }
    }
    const fin = await Promise.race([done, new Promise((r) => setTimeout(() => r(null), 1500))]);
    const ok = fin && fin.winner === 1 && fin.reason === "five";
    ok ? pass++ : fail++;
    console.log(`  ${ok ? "OK  " : "FAIL"} ${name}`);
    a.disconnect(); b.disconnect();
  }
  console.log(`\n통과 ${pass} / 실패 ${fail}`);
  process.exit(fail ? 1 : 0);
})();
