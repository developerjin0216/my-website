"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getSocket, disconnectSocket } from "@/utils/socket";

// 1:1 온라인 오목 — 퀴즈 배틀과 같은 Socket.IO 서버를 쓰되 이벤트는 omok: 접두사로 분리.
// 서버가 Render 무료 플랜이라 유휴 후 첫 접속에 20~60초가 걸립니다. 그동안 빈 화면을
// 보여주면 고장으로 오해하므로 연결 단계를 따로 둡니다.

const SIZE = 15;

interface Player {
  nickname: string;
  stone: 1 | 2;
  wins: number;
}
interface Room {
  id: string;
  status: "waiting" | "playing" | "ended";
  board: number[][];
  turn: 1 | 2;
  lastMove: { x: number; y: number; stone: number } | null;
  winner: 0 | 1 | 2 | null;
  reason: "five" | "resign" | "left" | "draw" | null;
  moveCount: number;
  players: Player[];
}
interface WaitingRoom {
  id: string;
  host: string;
}

type View = "connecting" | "lobby" | "room";

export default function OmokClient() {
  const [view, setView] = useState<View>("connecting");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [rooms, setRooms] = useState<WaitingRoom[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const myStone = useRef<1 | 2 | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const onConnect = () => {
      setView((v) => (v === "connecting" ? "lobby" : v));
      socket.emit("omok:lobby");
    };
    const onList = (list: WaitingRoom[]) => setRooms(list);
    const onRoom = (r: Room) => {
      setRoom(r);
      setView("room");
    };

    socket.on("connect", onConnect);
    socket.on("omok:list", onList);
    socket.on("omok:room", onRoom);

    // 20초 넘게 안 붙으면 서버가 깨는 중이라고 알려줍니다
    const slowTimer = setTimeout(() => setSlow(true), 8000);

    return () => {
      clearTimeout(slowTimer);
      socket.off("connect", onConnect);
      socket.off("omok:list", onList);
      socket.off("omok:room", onRoom);
      socket.emit("omok:leave");
      disconnectSocket();
    };
  }, []);

  const create = () => {
    setError("");
    getSocket().emit(
      "omok:create",
      { nickname },
      (res: { roomId?: string; error?: string }) => {
        if (res?.error) setError(res.error);
        else myStone.current = 1;
      }
    );
  };

  const join = (roomId: string) => {
    setError("");
    getSocket().emit(
      "omok:join",
      { roomId, nickname },
      (res: { roomId?: string; error?: string }) => {
        if (res?.error) setError(res.error);
      }
    );
  };

  const place = (x: number, y: number) => {
    if (!room || room.status !== "playing") return;
    const me = room.players.find((p) => p.nickname === nickname);
    if (!me || me.stone !== room.turn) return;
    if (room.board[y][x] !== 0) return;
    getSocket().emit("omok:place", { x, y });
  };

  const leave = () => {
    getSocket().emit("omok:leave");
    setRoom(null);
    setView("lobby");
    getSocket().emit("omok:lobby");
  };

  // ── 연결 중 ──
  if (view === "connecting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto w-full px-5 text-center">
        <div className="text-5xl mb-6 animate-bounce">⚫</div>
        <h1 className="text-xl font-bold text-accent mb-3">서버 연결 중…</h1>
        <p className="text-sm text-[#a0a0b0] leading-relaxed">
          {slow ? (
            <>
              서버가 잠들어 있어 깨우는 중입니다.
              <br />
              처음 접속은 최대 1분까지 걸릴 수 있습니다.
            </>
          ) : (
            <>잠시만 기다려 주세요.</>
          )}
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── 로비 ──
  if (view === "lobby" || !room) {
    return (
      <div className="max-w-lg mx-auto w-full px-5 py-6">
        <h1 className="text-2xl font-bold text-accent mb-1">1:1 오목</h1>
        <p className="text-sm text-[#a0a0b0] mb-5">
          가입 없이 닉네임만 정하면 바로 둘 수 있습니다.
        </p>

        <div className="bg-card rounded-2xl p-5 mb-4">
          <label className="block text-xs text-[#a0a0b0] mb-1.5">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 12))}
            placeholder="2~12자"
            className="w-full rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={create}
            disabled={!nickname.trim()}
            className="w-full mt-3 rounded-xl bg-accent text-[#1a1a2e] font-bold py-3 disabled:opacity-40 active:scale-[0.99] transition-transform"
          >
            방 만들기
          </button>
        </div>

        <div className="bg-card rounded-2xl p-5 mb-4">
          <label className="block text-xs text-[#a0a0b0] mb-1.5">
            초대 코드로 참가
          </label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="6자리"
              className="flex-1 min-w-0 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent tracking-widest"
            />
            <button
              type="button"
              onClick={() => join(code)}
              disabled={!nickname.trim() || code.length !== 6}
              className="shrink-0 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#c8c8d8] font-semibold px-5 text-sm disabled:opacity-40"
            >
              참가
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-sm font-bold text-accent mb-3">
            기다리는 방 {rooms.length}개
          </h2>
          {rooms.length === 0 ? (
            <p className="text-xs text-[#606070]">
              지금은 빈 방이 없습니다. 방을 만들고 친구에게 코드를 보내세요.
            </p>
          ) : (
            <div className="space-y-2">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => join(r.id)}
                  disabled={!nickname.trim()}
                  className="w-full flex items-center justify-between rounded-xl bg-[#16213e] border border-[#2a3a5a] px-4 py-3 disabled:opacity-40"
                >
                  <span className="text-sm text-[#e8e8f0]">{r.host}</span>
                  <span className="text-xs text-accent font-mono">{r.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-[#EF4444] mt-3">{error}</p>}
      </div>
    );
  }

  // ── 대국 ──
  const me = room.players.find((p) => p.nickname === nickname);
  const opp = room.players.find((p) => p.nickname !== nickname);
  const myTurn = !!me && room.status === "playing" && me.stone === room.turn;

  const resultText = () => {
    if (room.winner === 0) return "무승부입니다";
    if (!me) return "대국이 끝났습니다";
    const won = room.winner === me.stone;
    if (room.reason === "resign") return won ? "상대가 기권했습니다" : "기권했습니다";
    if (room.reason === "left") return "상대가 나갔습니다 — 승리";
    return won ? "5목 완성 — 승리!" : "졌습니다";
  };

  return (
    <div className="max-w-lg mx-auto w-full px-5 py-6">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={leave}
          className="text-xs text-[#606070] hover:text-[#a0a0b0]"
        >
          ← 나가기
        </button>
        <span className="text-xs text-[#606070] font-mono">
          초대 코드 {room.id}
        </span>
      </div>

      {/* 대국자 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[me, opp].map((p, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2.5 border ${
              p && room.status === "playing" && p.stone === room.turn
                ? "border-accent bg-[#3d2e00]/30"
                : "border-[#2a3a5a] bg-[#16213e]"
            }`}
          >
            <p className="text-[11px] text-[#606070]">{i === 0 ? "나" : "상대"}</p>
            <p className="text-sm font-bold text-[#e8e8f0] truncate">
              {p ? (
                <>
                  <span className="mr-1">{p.stone === 1 ? "⚫" : "⚪"}</span>
                  {p.nickname}
                </>
              ) : (
                <span className="text-[#606070]">기다리는 중…</span>
              )}
            </p>
            {p && <p className="text-[11px] text-[#a0a0b0]">{p.wins}승</p>}
          </div>
        ))}
      </div>

      {/* 상태 줄 */}
      <p className="text-center text-sm mb-3">
        {room.status === "waiting" ? (
          <span className="text-[#a0a0b0]">
            상대를 기다리는 중 — 초대 코드 <b className="text-accent">{room.id}</b>
          </span>
        ) : room.status === "ended" ? (
          <span className="font-bold text-accent">{resultText()}</span>
        ) : myTurn ? (
          <span className="font-bold text-accent">내 차례입니다</span>
        ) : (
          <span className="text-[#a0a0b0]">상대가 두는 중…</span>
        )}
      </p>

      {/* 판 */}
      <div className="bg-[#c9a063] rounded-xl p-2 mb-4 select-none">
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        >
          {room.board.map((row, y) =>
            row.map((cell, x) => {
              const isLast =
                room.lastMove && room.lastMove.x === x && room.lastMove.y === y;
              return (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  onClick={() => place(x, y)}
                  disabled={!myTurn || cell !== 0}
                  aria-label={`${x + 1}열 ${y + 1}행`}
                  className="relative aspect-square flex items-center justify-center"
                  style={{
                    boxShadow: "inset 0 0 0 0.5px rgba(70,45,10,0.55)",
                  }}
                >
                  {cell !== 0 && (
                    <span
                      className={`block rounded-full ${
                        cell === 1
                          ? "bg-[#1a1a1a]"
                          : "bg-[#f5f5f5] ring-1 ring-[#999]"
                      }`}
                      style={{
                        width: "82%",
                        height: "82%",
                        outline: isLast ? "2px solid #ef4444" : "none",
                        outlineOffset: "-1px",
                      }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 조작 */}
      {room.status === "playing" && (
        <button
          type="button"
          onClick={() => {
            if (confirm("기권하시겠습니까?")) getSocket().emit("omok:resign");
          }}
          className="w-full rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] font-semibold py-3"
        >
          기권
        </button>
      )}

      {room.status === "ended" && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => getSocket().emit("omok:rematch")}
            disabled={room.players.length < 2}
            className="flex-1 rounded-xl bg-accent text-[#1a1a2e] font-bold py-3 disabled:opacity-40"
          >
            한 판 더
          </button>
          <button
            type="button"
            onClick={leave}
            className="flex-1 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] font-semibold py-3"
          >
            로비로
          </button>
        </div>
      )}

      {room.status === "ended" && room.players.length === 2 && (
        <p className="text-[11px] text-[#606070] text-center mt-2">
          다음 판은 돌 색과 선공이 바뀝니다
        </p>
      )}

      <p className="text-center mt-5">
        <Link href="/battle" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
          퀴즈 배틀도 해보기 →
        </Link>
      </p>
    </div>
  );
}
