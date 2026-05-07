import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퀴즈 결과 - 상식왕 퀴즈",
  description:
    "퀴즈 결과를 확인하고 오답 노트로 틀린 문제를 복습하세요. 결과를 친구에게 공유할 수도 있습니다.",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
