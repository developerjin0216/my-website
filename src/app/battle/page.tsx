"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSocket, disconnectSocket } from "@/utils/socket";
import { quizzes, categories, type Quiz } from "@/data/quizData";
import Link from "next/link";

type GameState = "lobby" | "waiting" | "playing" | "finished";

interface Player {
  id: string;
  nickname: string;
  score: number;
  answered: number;
  isHost: boolean;
}

interface RoomInfo {
  roomId: string;
  category: string;
  hostNickname: string;
  playerCount: number;
  maxPlayers: number;
}

interface Ranking {
  rank: number;
  nickname: string;
  score: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCategoryInfo(id: string) {
  return categories.find((c) => c.id === id) || { icon: "❓", name: id, color: "#888" };
}

export default function BattlePage() {
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomCategory, setRoomCategory] = useState("general");
  const [category, setCategory] = useState("general");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState("");
  const [roomList, setRoomList] = useState<RoomInfo[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  // Quiz state
  const [question, setQuestion] = useState<Quiz | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [rankings, setRankings] = useState<Ranking[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(15);

  // ── Socket setup ──
  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    socket.emit("join-lobby");

    socket.on("room-list", (list: RoomInfo[]) => {
      setRoomList(list);
    });

    socket.on("room-update", (data) => {
      setPlayers(data.players);
      setRoomId(data.roomId);
      setRoomCategory(data.category);
    });

    socket.on("game-start", (data) => {
      setGameState("playing");
      setQuestion(data.question);
      setQuestionIndex(data.index);
      setTotalQuestions(data.total);
      resetQuestionState();
    });

    socket.on("next-question", (data) => {
      setQuestion(data.question);
      setQuestionIndex(data.index);
      resetQuestionState();
    });

    socket.on("score-update", (data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === data.playerId ? { ...p, score: data.totalScore } : p
        )
      );
    });

    socket.on("question-result", (data) => {
      setCorrectAnswer(data.correctAnswer);
      setExplanation(data.explanation);
      setShowResult(true);
    });

    socket.on("game-end", (data) => {
      setGameState("finished");
      setRankings(data.rankings);
    });

    return () => {
      socket.off("room-list");
      socket.off("room-update");
      socket.off("game-start");
      socket.off("next-question");
      socket.off("score-update");
      socket.off("question-result");
      socket.off("game-end");
      disconnectSocket();
    };
  }, []);

  function resetQuestionState() {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswer(null);
    setShowResult(false);
    setExplanation("");
    setTimeLeft(15);
    timeLeftRef.current = 15;
  }

  // ── Timer ──
  useEffect(() => {
    if (gameState !== "playing" || showResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current!);
        if (!isAnswered) {
          setIsAnswered(true);
          getSocket().emit("submit-answer", { answerIndex: -1, timeLeft: 0 });
        }
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, questionIndex, showResult, isAnswered]);

  // ── Actions ──
  const createRoom = useCallback(() => {
    if (!nickname.trim()) return setError("닉네임을 입력해주세요.");
    setError("");
    getSocket().emit("create-room", { nickname: nickname.trim(), category }, (res: { success: boolean; roomId?: string; error?: string }) => {
      if (res.success) {
        setRoomId(res.roomId!);
        setRoomCategory(category);
        setIsHost(true);
        setGameState("waiting");
      } else setError(res.error || "방 생성 실패");
    });
  }, [nickname, category]);

  const joinRoom = useCallback(
    (targetRoomId: string) => {
      if (!nickname.trim()) return setError("닉네임을 먼저 입력해주세요.");
      setError("");
      getSocket().emit("join-room", { roomId: targetRoomId, nickname: nickname.trim() }, (res: { success: boolean; roomId?: string; category?: string; error?: string }) => {
        if (res.success) {
          setRoomId(res.roomId!);
          setRoomCategory(res.category || "general");
          setIsHost(false);
          setGameState("waiting");
        } else setError(res.error || "참가 실패");
      });
    },
    [nickname]
  );

  const startGame = useCallback(() => {
    const pool = quizzes[roomCategory] || Object.values(quizzes).flat();
    const selected = shuffleArray(pool).slice(0, 10);
    getSocket().emit("start-game", { questions: selected });
  }, [roomCategory]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (isAnswered) return;
      setSelectedAnswer(index);
      setIsAnswered(true);
      if (timerRef.current) clearInterval(timerRef.current);
      getSocket().emit("submit-answer", {
        answerIndex: index,
        timeLeft: timeLeftRef.current,
      });
    },
    [isAnswered]
  );

  const backToLobby = useCallback(() => {
    disconnectSocket();
    setGameState("lobby");
    setPlayers([]);
    setRankings([]);
    setShowCreate(false);
    setError("");
    // 재접속
    setTimeout(() => {
      const s = getSocket();
      s.connect();
      s.emit("join-lobby");
    }, 100);
  }, []);

  // ── LOBBY ──
  if (gameState === "lobby") {
    const catInfo = getCategoryInfo(category);

    return (
      <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
        <header className="bg-header px-5 py-5 text-center">
          <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
            ← 홈으로
          </Link>
          <h1 className="text-2xl font-bold text-accent">퀴즈 배틀</h1>
          <p className="text-sm text-[#a0a0b0] mt-1">
            친구들과 실시간 퀴즈 대결!
          </p>
        </header>

        <div className="flex-1 px-5 py-5 flex flex-col gap-4">
          {/* Nickname */}
          <div>
            <label className="text-sm font-medium text-[#a0a0b0] mb-1.5 block">
              닉네임
            </label>
            <input
              type="text"
              maxLength={8}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력 (최대 8자)"
              className="w-full px-4 py-3 rounded-xl bg-card text-white border border-[#2a3a5a] focus:border-accent outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-[#EF4444] text-sm text-center">{error}</p>
          )}

          {/* Room List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">대기 중인 방</h2>
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="text-xs px-3 py-1.5 rounded-lg bg-accent text-[#1a1a2e] font-bold"
              >
                + 방 만들기
              </button>
            </div>

            {roomList.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 text-center">
                <p className="text-[#606070] text-sm">
                  대기 중인 방이 없습니다
                </p>
                <p className="text-[#404050] text-xs mt-1">
                  새로운 방을 만들어보세요!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {roomList.map((room) => {
                  const cat = getCategoryInfo(room.category);
                  return (
                    <button
                      key={room.roomId}
                      onClick={() => joinRoom(room.roomId)}
                      className="bg-card rounded-xl px-4 py-3.5 flex items-center justify-between transition-all active:scale-[0.98] hover:brightness-110 text-left w-full"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <p className="text-sm font-semibold">
                            {room.hostNickname}의 방
                          </p>
                          <p className="text-xs text-[#a0a0b0]">
                            {cat.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-accent">
                          {room.playerCount}/{room.maxPlayers}
                        </p>
                        <p className="text-[10px] text-[#a0a0b0]">참가</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Create Room Panel */}
          {showCreate && (
            <div className="bg-card rounded-2xl p-5">
              <h2 className="font-bold mb-3">새 방 만들기</h2>
              <label className="text-xs text-[#a0a0b0] mb-2 block">
                카테고리 선택
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`text-xs py-2 px-2 rounded-lg transition-all ${
                      category === cat.id
                        ? "bg-accent text-[#1a1a2e] font-bold"
                        : "bg-[#2a3a5a] text-[#a0a0b0] hover:brightness-110"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              <button
                onClick={createRoom}
                className="w-full py-3 rounded-xl bg-accent text-[#1a1a2e] font-bold text-sm active:scale-[0.98] transition-transform"
              >
                방 만들기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── WAITING ROOM ──
  if (gameState === "waiting") {
    const cat = getCategoryInfo(roomCategory);

    return (
      <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
        <header className="bg-header px-5 py-5 text-center">
          <h1 className="text-2xl font-bold text-accent">대기실</h1>
          <div className="mt-3 bg-[#2a3a5a] rounded-xl py-3 px-4 inline-block">
            <p className="text-xs text-[#a0a0b0] mb-1">방 코드</p>
            <p className="text-3xl font-mono font-bold tracking-[0.3em] text-white">
              {roomId}
            </p>
          </div>
        </header>

        <div className="flex-1 px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">
              참가자 ({players.length}/10)
            </h2>
            <span
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: cat.color + "20", color: cat.color }}
            >
              {cat.icon} {cat.name}
            </span>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            {players.map((p, i) => (
              <div
                key={p.id || i}
                className="bg-card rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.isHost ? "👑" : "👤"}</span>
                  <span className="font-medium text-sm">{p.nickname}</span>
                </div>
                {p.isHost && (
                  <span className="text-xs text-accent">방장</span>
                )}
              </div>
            ))}
          </div>

          {isHost ? (
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                players.length >= 2
                  ? "bg-accent text-[#1a1a2e]"
                  : "bg-[#2a3a5a] text-[#606070] cursor-not-allowed"
              }`}
            >
              {players.length < 2
                ? "2명 이상 필요합니다"
                : `게임 시작! (${players.length}명)`}
            </button>
          ) : (
            <div className="text-center text-[#a0a0b0] text-sm animate-pulse">
              방장이 게임을 시작할 때까지 기다리는 중...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  if (gameState === "playing" && question) {
    const timerPercent = (timeLeft / 15) * 100;
    const timerColor =
      timeLeft <= 5 ? "#EF4444" : timeLeft <= 10 ? "#F59E0B" : "#22C55E";

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
      <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
        {/* Top bar */}
        <header className="bg-header px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#a0a0b0]">
              {questionIndex + 1}/{totalQuestions}
            </span>
            <span className="text-xs font-bold text-accent">배틀 모드</span>
          </div>
          <div className="h-1.5 bg-[#2a3a5a] rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold" style={{ color: timerColor }}>
              {timeLeft}초
            </span>
            <div className="flex gap-2">
              {sortedPlayers.slice(0, 3).map((p, i) => (
                <span key={p.nickname} className="text-[10px] text-[#a0a0b0]">
                  {["🥇", "🥈", "🥉"][i]} {p.nickname} {p.score}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Question */}
        <div className="flex-1 px-5 py-5 flex flex-col">
          <div className="bg-card rounded-2xl p-5 mb-5">
            <p className="text-base font-semibold leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 flex-1">
            {question.options.map((opt, i) => {
              let style = "bg-card border-2 border-transparent";
              if (showResult) {
                if (i === correctAnswer) {
                  style = "bg-[#22C55E]/20 border-2 border-[#22C55E]";
                } else if (i === selectedAnswer && i !== correctAnswer) {
                  style = "bg-[#EF4444]/20 border-2 border-[#EF4444]";
                }
              } else if (isAnswered && i === selectedAnswer) {
                style = "bg-accent/20 border-2 border-accent";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  className={`w-full text-left rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] ${style} ${
                    isAnswered ? "cursor-default" : "cursor-pointer hover:brightness-110"
                  }`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation after result */}
          {showResult && explanation && (
            <div className="mt-4 bg-[#162040] rounded-xl p-3 border border-[#2a3a5a]/50">
              <p className="text-xs text-accent font-bold mb-1">풀이</p>
              <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── FINISHED ──
  if (gameState === "finished") {
    return (
      <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full items-center justify-center px-5">
        <h1 className="text-3xl font-bold text-accent mb-8">최종 순위</h1>

        <div className="w-full flex flex-col gap-3 mb-8">
          {rankings.map((r) => (
            <div
              key={r.nickname}
              className={`bg-card rounded-2xl px-5 py-4 flex items-center justify-between ${
                r.rank === 1 ? "border-2 border-accent" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `${r.rank}위`}
                </span>
                <span className={`font-bold ${r.rank === 1 ? "text-accent text-lg" : "text-sm"}`}>
                  {r.nickname}
                </span>
              </div>
              <span className={`font-bold ${r.rank === 1 ? "text-accent text-xl" : "text-[#a0a0b0]"}`}>
                {r.score}점
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={backToLobby}
            className="w-full py-3.5 rounded-xl bg-accent text-[#1a1a2e] font-bold text-sm active:scale-[0.98]"
          >
            새 게임
          </button>
          <Link
            href="/"
            className="w-full py-3.5 rounded-xl border border-[#2a3a5a] text-[#a0a0b0] font-medium text-sm text-center active:scale-[0.98] hover:bg-[#2a3a5a]/50"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
