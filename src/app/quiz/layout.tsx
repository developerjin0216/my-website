import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/quizData";
import { QUIZ_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "퀴즈 풀기",
  description:
    "10개 카테고리 1,000문제 중 랜덤 10문제에 도전하세요. 15초 제한 시간, 힌트 기능, 오답 해설까지 제공합니다.",
  alternates: { canonical: `${QUIZ_URL}/quiz` },
};

// 퀴즈 본체는 클라이언트 컴포넌트라 크롤러에 보이지 않으므로,
// 레이아웃에서 이용 방법·카테고리를 서버 렌더링해 색인 가능한 콘텐츠를 제공합니다.
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <section className="max-w-lg mx-auto w-full px-5 py-6 space-y-4">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            상식 퀴즈 이용 방법
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            매 판 10문제가 랜덤으로 출제되고, 문제당 15초의 제한 시간이
            있습니다. 정답은 10점, 힌트를 본 뒤 맞히면 5점입니다. 퀴즈가 끝나면
            결과 화면에서 틀린 문제의 정답과 해설을 오답 노트로 복습할 수
            있습니다.
          </p>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 오늘의 퀴즈 — 전체 카테고리에서 매일 새로운 10문제</li>
            <li>• 카테고리 퀴즈 — 원하는 주제만 골라 도전</li>
            <li>• 힌트 — 문제당 1회, 사용 시 획득 점수 절반</li>
            <li>• 최고 점수 — 카테고리별 기록이 브라우저에 저장</li>
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            퀴즈 카테고리 (총 1,000문제)
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 text-sm text-[#a0a0b0] leading-loose">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/quiz/${cat.id}`} className="hover:text-accent">
                  <span aria-hidden="true">{cat.icon}</span> {cat.name} — 100문제
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
