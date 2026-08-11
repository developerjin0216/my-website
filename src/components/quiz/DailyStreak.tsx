"use client";

import { useEffect, useState } from "react";
import { getStreak } from "@/utils/storage";

// 데일리 퀴즈 연속 출석 배지 — localStorage 기반이라 클라이언트에서만 렌더
export default function DailyStreak() {
  const [streak, setStreak] = useState<{ count: number; doneToday: boolean } | null>(null);

  useEffect(() => {
    // localStorage 읽기는 마운트 후 태스크로 지연 (동기 setState 캐스케이드 방지)
    const t = setTimeout(() => setStreak(getStreak()), 0);
    return () => clearTimeout(t);
  }, []);

  if (!streak || streak.count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ffd700] bg-[#ffd700]/10 rounded-full px-2.5 py-1">
      🔥 {streak.count}일 연속
      {!streak.doneToday && (
        <span className="text-[#ff6b6b] font-semibold">· 오늘 도전 전!</span>
      )}
    </span>
  );
}
