import type { Metadata } from "next";
import PlayClient from "./PlayClient";

// 플레이 화면은 색인하지 않습니다 — 서버 렌더 텍스트가 거의 없고, 색인되면
// 검색 결과에 퍼즐 정답과 결말이 노출됩니다. SEO는 허브(/escape)가 담당합니다.
export const metadata: Metadata = {
  title: "한빛사진관 · 플레이",
  robots: { index: false, follow: true },
};

export default function EscapePlayPage() {
  return <PlayClient />;
}
