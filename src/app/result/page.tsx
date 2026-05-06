"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { categories } from "@/data/quizData";
import { saveHighScore, saveDailyStatus } from "@/utils/storage";
import AdBanner from "@/components/AdBanner";

interface AnswerRecord {
  question: string;
  options: string[];
  answer: number;
  selected: number;
  correct: boolean;
  explanation?: string;
}

function getGrade(percent: number) {
  if (percent >= 90) return { emoji: "🏆", text: "천재", color: "#FFD700" };
  if (percent >= 70) return { emoji: "🎉", text: "훌륭해요", color: "#22C55E" };
  if (percent >= 50) return { emoji: "👍", text: "괜찮아요", color: "#3B82F6" };
  if (percent >= 30) return { emoji: "💪", text: "조금만 더", color: "#F59E0B" };
  return { emoji: "📖", text: "공부가 필요해요", color: "#EF4444" };
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const score = parseInt(searchParams.get("score") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "10");
  const mode = searchParams.get("mode") || "daily";
  const categoryId = searchParams.get("category") || "general";

  const maxScore = total * 10;
  const percent = Math.round((score / maxScore) * 100);
  const grade = getGrade(percent);
  const category = categories.find((c) => c.id === categoryId);

  const [wrongAnswers, setWrongAnswers] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    if (mode === "daily") {
      saveDailyStatus(score, maxScore);
    }
    saveHighScore(mode === "daily" ? "daily" : categoryId, score, maxScore);

    try {
      const raw = sessionStorage.getItem("quiz_answers");
      if (raw) {
        const all: AnswerRecord[] = JSON.parse(raw);
        setWrongAnswers(all.filter((a) => !a.correct));
        sessionStorage.removeItem("quiz_answers");
      }
    } catch { /* silent */ }
  }, [mode, categoryId, score, maxScore]);

  const handleShare = async () => {
    const text = `[상식왕 퀴즈] ${mode === "daily" ? "오늘의 퀴즈" : category?.name || "퀴즈"}\n점수: ${score}/${maxScore} (${percent}%)\n등급: ${grade.emoji} ${grade.text}\n${correct}/${total} 정답!\n\nhttps://my-website-nine-fawn-47.vercel.app`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert("결과가 클립보드에 복사되었습니다!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-8">
      {/* Grade */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4 animate-bounce">{grade.emoji}</div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: grade.color }}
        >
          {grade.text}
        </h1>
        <p className="text-[#a0a0b0] text-sm">
          {mode === "daily" ? "오늘의 퀴즈" : category?.name || "퀴즈"} 결과
        </p>
      </div>

      {/* Score card */}
      <div className="bg-card rounded-2xl p-6 w-full mb-6">
        <div className="text-center mb-4">
          <p className="text-5xl font-bold text-accent">{percent}%</p>
          <p className="text-sm text-[#a0a0b0] mt-1">
            {score}/{maxScore}점
          </p>
        </div>
        <div className="h-3 bg-[#2a3a5a] rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${percent}%`,
              backgroundColor: grade.color,
            }}
          />
        </div>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xl font-bold text-[#22C55E]">{correct}</p>
            <p className="text-xs text-[#a0a0b0]">정답</p>
          </div>
          <div className="w-px bg-[#2a3a5a]" />
          <div>
            <p className="text-xl font-bold text-[#EF4444]">
              {total - correct}
            </p>
            <p className="text-xs text-[#a0a0b0]">오답</p>
          </div>
          <div className="w-px bg-[#2a3a5a]" />
          <div>
            <p className="text-xl font-bold text-accent">{score}</p>
            <p className="text-xs text-[#a0a0b0]">점수</p>
          </div>
        </div>
      </div>

      {/* Ad */}
      <div className="w-full mb-6">
        <AdBanner slot="XXXXXXXXXX" format="rectangle" />
      </div>

      {/* Wrong Answers Review */}
      {wrongAnswers.length > 0 && (
        <div className="w-full mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-[#EF4444]">✗</span> 오답 노트
            <span className="text-sm font-normal text-[#a0a0b0]">
              ({wrongAnswers.length}문제)
            </span>
          </h2>
          <div className="flex flex-col gap-4">
            {wrongAnswers.map((item, idx) => (
              <div
                key={idx}
                className="bg-card rounded-2xl p-5 border border-[#2a3a5a]"
              >
                {/* Question */}
                <p className="text-sm font-semibold mb-3 leading-relaxed">
                  Q{idx + 1}. {item.question}
                </p>

                {/* Options with marks */}
                <div className="flex flex-col gap-1.5 mb-3">
                  {item.options.map((opt, oi) => {
                    let style = "text-[#8090b0]";
                    let mark = "";
                    if (oi === item.answer) {
                      style = "text-[#22C55E] font-semibold";
                      mark = " ✓";
                    } else if (oi === item.selected) {
                      style = "text-[#EF4444] line-through";
                      mark = " ✗";
                    }
                    return (
                      <p key={oi} className={`text-xs ${style}`}>
                        {oi + 1}) {opt}{mark}
                      </p>
                    );
                  })}
                </div>

                {/* Your answer vs correct */}
                <div className="flex gap-3 text-xs mb-3">
                  <span className="text-[#EF4444]">
                    내 답: {item.selected === -1 ? "시간 초과" : item.options[item.selected]}
                  </span>
                  <span className="text-[#22C55E]">
                    정답: {item.options[item.answer]}
                  </span>
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="bg-[#162040] rounded-xl p-3 border border-[#2a3a5a]/50">
                    <p className="text-xs text-accent font-bold mb-1">풀이</p>
                    <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handleShare}
          className="w-full py-3.5 rounded-xl bg-accent text-[#1a1a2e] font-bold text-sm active:scale-[0.98] transition-transform"
        >
          결과 공유하기
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3.5 rounded-xl border border-[#2a3a5a] text-[#a0a0b0] font-medium text-sm active:scale-[0.98] transition-transform hover:bg-[#2a3a5a]/50"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-accent animate-pulse">결과 로딩 중...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
