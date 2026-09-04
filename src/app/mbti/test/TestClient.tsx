"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mbtiTestQuestions,
  computeMbtiResult,
  getMbtiType,
  mbtiGroups,
} from "@/data/mbti";
import { QUIZ_URL } from "@/lib/site";
import AdBanner from "@/components/AdBanner";

// MBTI 간이 테스트 — 축별 5문항(동점 없음) 총 20문항.
// 상태만으로 동작 (effect 없음), 결과는 저장하지 않습니다.

export default function TestClient() {
  const [step, setStep] = useState(0); // 0..19, 20 = 결과
  const [sides, setSides] = useState<string[]>([]);

  const total = mbtiTestQuestions.length;
  const done = step >= total;

  const pick = (side: string) => {
    setSides((prev) => [...prev, side]);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setSides([]);
    setStep(0);
  };

  if (done) {
    const code = computeMbtiResult(sides);
    const t = getMbtiType(code)!;
    const group = mbtiGroups[t.group];
    const shareUrl = `${QUIZ_URL}/mbti/${code.toLowerCase()}`;

    const handleShare = async () => {
      const text = `[MBTI 간이 테스트] 나의 유형은 ${t.emoji} ${code} — ${t.name}!\n"${t.tagline}"\n너도 3분 만에 확인해봐`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "MBTI 간이 테스트", text, url: shareUrl });
        } catch {
          /* user cancelled */
        }
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
        alert("결과가 클립보드에 복사되었습니다!");
      }
    };

    return (
      <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-8">
        <div className="text-center mb-6">
          <p className="text-sm text-[#a0a0b0] mb-4">나의 MBTI 간이 테스트 결과</p>
          <div className="text-6xl mb-3 animate-bounce">{t.emoji}</div>
          <h1 className="text-4xl font-bold" style={{ color: group.color }}>
            {code}
          </h1>
          <p className="text-lg font-semibold text-[#e8e8f0] mt-2">{t.name}</p>
          <p className="text-sm text-[#a0a0b0] mt-2">{t.tagline}</p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {t.keywords.map((k) => (
              <span
                key={k}
                className="text-[11px] rounded-full px-2.5 py-1 border"
                style={{
                  color: group.color,
                  borderColor: `${group.color}55`,
                  backgroundColor: `${group.color}14`,
                }}
              >
                #{k}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 mb-6">
          <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">{t.summary}</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <Link
            href={`/mbti/${code.toLowerCase()}`}
            className="w-full py-3.5 rounded-xl bg-accent text-[#1a1a2e] font-bold text-sm text-center active:scale-[0.98] transition-transform"
          >
            {code} 특징·연애·궁합·직업 전체 보기
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3.5 rounded-xl border border-accent text-accent font-bold text-sm active:scale-[0.98] transition-transform hover:bg-accent/10"
          >
            결과 공유하기
          </button>
          <button
            type="button"
            onClick={restart}
            className="w-full py-3.5 rounded-xl border border-[#2a3a5a] text-[#a0a0b0] font-medium text-sm active:scale-[0.98] transition-transform hover:bg-[#2a3a5a]/50"
          >
            다시 테스트하기
          </button>
          <Link
            href="/mbti"
            className="w-full py-3.5 rounded-xl border border-[#2a3a5a] text-[#a0a0b0] font-medium text-sm text-center active:scale-[0.98] transition-transform hover:bg-[#2a3a5a]/50"
          >
            16가지 유형 전체 보기
          </Link>
        </div>

        <div className="mb-6">
          <AdBanner slot="XXXXXXXXXX" format="rectangle" />
        </div>

        <p className="text-[11px] text-[#606070] leading-relaxed text-center">
          20문항 간이 테스트 결과로, 정식 검사와 다를 수 있습니다.
          재미와 자기이해의 참고 자료로 활용해주세요.
        </p>
      </div>
    );
  }

  const q = mbtiTestQuestions[step];
  const progress = Math.round((step / total) * 100);

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[#a0a0b0] mb-2">
          <span>
            {step + 1} / {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-[#2a3a5a] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-lg font-bold text-center leading-relaxed break-keep mb-8">
          {q.question}
        </h1>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => pick(q.a.side)}
            className="w-full text-left px-5 py-4 rounded-2xl bg-card border border-[#2a3a5a] text-sm leading-relaxed break-keep hover:border-accent active:scale-[0.98] transition-all"
          >
            {q.a.text}
          </button>
          <button
            type="button"
            onClick={() => pick(q.b.side)}
            className="w-full text-left px-5 py-4 rounded-2xl bg-card border border-[#2a3a5a] text-sm leading-relaxed break-keep hover:border-accent active:scale-[0.98] transition-all"
          >
            {q.b.text}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-[#606070] text-center mt-8">
        너무 오래 고민하지 말고, 더 자주 그런 쪽을 골라주세요
      </p>
    </div>
  );
}
