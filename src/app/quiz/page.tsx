"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { quizzes, categories, type Quiz } from "@/data/quizData";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 15;

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "daily";
  const categoryId = searchParams.get("category") || "general";

  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<
    { question: string; options: string[]; answer: number; selected: number; correct: boolean; explanation?: string }[]
  >([]);

  const category = categories.find((c) => c.id === categoryId);
  const title =
    mode === "daily" ? "오늘의 퀴즈" : category?.name || "퀴즈";

  useEffect(() => {
    let pool: Quiz[];
    if (mode === "daily") {
      pool = Object.values(quizzes).flat();
    } else {
      pool = quizzes[categoryId] || Object.values(quizzes).flat();
    }
    setQuestions(shuffleArray(pool).slice(0, TOTAL_QUESTIONS));
  }, [mode, categoryId]);

  const goToNext = useCallback(() => {
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      const finalScore = score;
      const finalCorrect = correctCount;
      try {
        sessionStorage.setItem("quiz_answers", JSON.stringify(answersRef.current));
      } catch { /* silent */ }
      router.push(
        `/result?score=${finalScore}&correct=${finalCorrect}&total=${TOTAL_QUESTIONS}&mode=${mode}&category=${categoryId}`
      );
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setTimeLeft(TIME_LIMIT);
      setHintUsed(false);
      setShowHint(false);
      setIsAnswered(false);
    }
  }, [currentIndex, score, correctCount, mode, categoryId, router]);

  // Timer
  useEffect(() => {
    if (questions.length === 0 || isAnswered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setIsAnswered(true);
          setSelectedAnswer(-1); // timeout
          const q = questions[currentIndex];
          if (q) {
            answersRef.current.push({
              question: q.question,
              options: q.options,
              answer: q.answer,
              selected: -1,
              correct: false,
              explanation: q.explanation,
            });
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions.length, isAnswered]);

  // Auto-advance after answer
  useEffect(() => {
    if (!isAnswered) return;
    const timeout = setTimeout(goToNext, 1500);
    return () => clearTimeout(timeout);
  }, [isAnswered, goToNext]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(index);
    setIsAnswered(true);

    const q = questions[currentIndex];
    const isCorrect = index === q.answer;
    if (isCorrect) {
      const points = hintUsed ? 5 : 10;
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
    }
    answersRef.current.push({
      question: q.question,
      options: q.options,
      answer: q.answer,
      selected: index,
      correct: isCorrect,
      explanation: q.explanation,
    });
  };

  const handleHint = () => {
    if (hintUsed || isAnswered) return;
    setHintUsed(true);
    setShowHint(true);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-accent animate-pulse">로딩 중...</div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const timerPercent = (timeLeft / TIME_LIMIT) * 100;
  const timerColor = timeLeft <= 5 ? "#EF4444" : timeLeft <= 10 ? "#F59E0B" : "#22C55E";

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      {/* Top bar */}
      <header className="bg-header px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#a0a0b0]">{title}</span>
          <span className="text-sm font-bold text-accent">
            {score}점
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-[#a0a0b0] shrink-0">
            {currentIndex + 1}/{TOTAL_QUESTIONS}
          </span>
          <div className="flex-1 h-2 bg-[#2a3a5a] rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="h-1.5 bg-[#2a3a5a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timerColor,
            }}
          />
        </div>
        <div className="text-right mt-1">
          <span
            className="text-xs font-bold"
            style={{ color: timerColor }}
          >
            {timeLeft}초
          </span>
        </div>
      </header>

      {/* Question */}
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="bg-card rounded-2xl p-5 mb-6">
          <p className="text-lg font-semibold leading-relaxed">
            {q.question}
          </p>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="bg-[#2a3a5a] rounded-xl p-3 mb-4 border border-accent/30">
            <p className="text-sm text-accent">
              <span className="font-bold">힌트:</span> {q.hint}
            </p>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-3 flex-1">
          {q.options.map((option, i) => {
            let optionStyle = "bg-card border-2 border-transparent";
            if (isAnswered) {
              if (i === q.answer) {
                optionStyle = "bg-[#22C55E]/20 border-2 border-[#22C55E]";
              } else if (i === selectedAnswer && i !== q.answer) {
                optionStyle = "bg-[#EF4444]/20 border-2 border-[#EF4444]";
              }
            } else if (i === selectedAnswer) {
              optionStyle = "bg-accent/20 border-2 border-accent";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={isAnswered}
                className={`w-full text-left rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] ${optionStyle} ${
                  isAnswered ? "cursor-default" : "cursor-pointer hover:brightness-110"
                }`}
              >
                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Hint button */}
        {!hintUsed && !isAnswered && (
          <button
            onClick={handleHint}
            className="mt-4 w-full py-3 rounded-xl border border-accent/40 text-accent text-sm font-medium hover:bg-accent/10 transition-colors active:scale-[0.98]"
          >
            힌트 보기 (점수 절반)
          </button>
        )}

        {/* Answer feedback */}
        {isAnswered && (
          <div className="mt-4 text-center">
            {selectedAnswer === -1 ? (
              <p className="text-[#EF4444] font-bold">시간 초과!</p>
            ) : selectedAnswer === q.answer ? (
              <p className="text-[#22C55E] font-bold">
                정답! +{hintUsed ? 5 : 10}점
              </p>
            ) : (
              <p className="text-[#EF4444] font-bold">오답!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-accent animate-pulse">로딩 중...</div>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
