"use client";

import { useState } from "react";

// 상황별 분기 안내 — "지금 어떤 상황인가요?"를 고르면 그 상황의 행동 순서를 보여줌.
// 패닉 상태 사용자를 위한 이 사이트만의 인터랙티브 매뉴얼 장치.
export interface Branch {
  label: string;
  steps: string[];
}

export default function DecisionFlow({
  question,
  branches,
}: {
  question: string;
  branches: Branch[];
}) {
  const [selected, setSelected] = useState(0);
  const active = branches[selected];

  return (
    <div className="bg-card rounded-2xl p-5 border border-accent/30">
      <h2 className="text-base font-bold text-accent mb-3">🔀 {question}</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {branches.map((b, i) => (
          <button
            key={b.label}
            type="button"
            onClick={() => setSelected(i)}
            className={`rounded-xl px-3 py-3 text-sm font-semibold border text-left transition-colors break-keep ${
              selected === i
                ? "bg-accent text-[#1a1a2e] border-accent"
                : "bg-[#16213e] text-[#c0c8d8] border-[#2a3a5a] hover:border-accent/60"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <ol className="space-y-2.5">
        {active.steps.map((step, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed break-keep">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span
              className="text-[#e0e4ee]"
              dangerouslySetInnerHTML={{ __html: step }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
