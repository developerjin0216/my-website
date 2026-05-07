"use client";

import { useEffect, useState } from "react";
import { getDailyStatus, getHighScores, type CategoryScore } from "@/utils/storage";

export default function HomeClient() {
  const [scores, setScores] = useState<Record<string, CategoryScore>>({});
  const [totalPlayed, setTotalPlayed] = useState(0);

  useEffect(() => {
    const s = getHighScores();
    setScores(s);
    setTotalPlayed(Object.values(s).reduce((sum, v) => sum + v.totalPlayed, 0));
  }, []);

  return (
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
  );
}
