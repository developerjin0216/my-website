import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퀴즈 풀기 - 상식왕 퀴즈",
  description:
    "10개 카테고리 1,000문제 중 랜덤 10문제에 도전하세요. 15초 제한 시간, 힌트 기능, 오답 해설까지 제공합니다.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
