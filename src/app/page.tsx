"use client";

import { useEffect, useState } from "react";
import { categories } from "@/data/quizData";
import { getDailyStatus, getHighScores, type CategoryScore } from "@/utils/storage";
import Link from "next/link";

export default function Home() {
  const [dailyDone, setDailyDone] = useState(false);
  const [scores, setScores] = useState<Record<string, CategoryScore>>({});
  const [totalPlayed, setTotalPlayed] = useState(0);

  useEffect(() => {
    const daily = getDailyStatus();
    setDailyDone(daily?.completed ?? false);

    const s = getHighScores();
    setScores(s);
    const total = Object.values(s).reduce((sum, v) => sum + v.totalPlayed, 0);
    setTotalPlayed(total);
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      {/* Header */}
      <header className="bg-header px-5 py-6 text-center">
        <h1 className="text-3xl font-bold text-accent">상식왕 퀴즈</h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          당신의 상식을 테스트해보세요!
        </p>
      </header>

      {/* Stats */}
      <div className="px-5 py-4">
        <div className="bg-card rounded-2xl p-4 flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-accent">{totalPlayed}</p>
            <p className="text-xs text-[#a0a0b0]">총 플레이</p>
          </div>
          <div className="w-px bg-[#2a3a5a]" />
          <div>
            <p className="text-2xl font-bold text-accent">
              {Object.keys(scores).length}
            </p>
            <p className="text-xs text-[#a0a0b0]">도전한 카테고리</p>
          </div>
          <div className="w-px bg-[#2a3a5a]" />
          <div>
            <p className="text-2xl font-bold text-accent">
              {Object.values(scores).length > 0
                ? Math.max(...Object.values(scores).map((s) => s.bestScore))
                : 0}
            </p>
            <p className="text-xs text-[#a0a0b0]">최고 점수</p>
          </div>
        </div>
      </div>

      {/* Daily Quiz */}
      <div className="px-5 pb-4">
        <Link
          href={dailyDone ? "#" : "/quiz?mode=daily"}
          className={`block w-full rounded-2xl p-5 text-center transition-transform active:scale-[0.98] ${
            dailyDone
              ? "bg-[#2a3a5a] opacity-60 pointer-events-none"
              : "bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
          }`}
        >
          <p className="text-lg font-bold text-[#1a1a2e]">
            {dailyDone ? "오늘의 퀴즈 완료!" : "오늘의 퀴즈"}
          </p>
          <p className="text-sm text-[#1a1a2e]/70 mt-1">
            {dailyDone
              ? "내일 다시 도전하세요"
              : "매일 새로운 10문제에 도전하세요"}
          </p>
        </Link>
      </div>

      {/* Categories */}
      <div className="px-5 pb-8 flex-1">
        <h2 className="text-lg font-bold mb-4">카테고리별 퀴즈</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const catScore = scores[cat.id];
            return (
              <Link
                key={cat.id}
                href={`/quiz?mode=category&category=${cat.id}`}
                className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon}
                </div>
                <p className="font-semibold text-sm">{cat.name}</p>
                {catScore ? (
                  <p className="text-xs text-[#a0a0b0] mt-1">
                    최고 {catScore.bestScore}점 / {catScore.totalPlayed}회
                  </p>
                ) : (
                  <p className="text-xs text-[#a0a0b0] mt-1">도전해보세요!</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
