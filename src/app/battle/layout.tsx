import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "퀴즈 배틀 - 상식왕 퀴즈",
  description:
    "친구들과 실시간 퀴즈 대결! 최대 10명이 함께 플레이하며 순위를 겨루는 멀티플레이어 퀴즈 배틀입니다.",
};

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
