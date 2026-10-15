import type { Metadata } from "next";
import { robotsFor } from "@/lib/indexPolicy";

// 섹션 전체의 색인 여부. 범위는 lib/indexPolicy.ts 한 곳에서 정합니다.
export const metadata: Metadata = { robots: robotsFor("/mbti") };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
