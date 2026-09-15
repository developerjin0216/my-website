import type { Metadata } from "next";
import PlayClient from "./PlayClient";
import { QUIZ_URL } from "@/lib/site";

// 플레이 화면은 색인하지 않습니다 — 서버 렌더 텍스트가 거의 없고, 색인되면
// 검색 결과에 퍼즐 정답과 결말이 노출됩니다. SEO는 허브(/escape)가 담당합니다.
//
// canonical을 자기 자신으로 고정하는 이유: 지정하지 않으면 루트 레이아웃의
// `alternates: { canonical: "/" }`를 물려받아, 퀴즈 도메인 페이지가 루트 도메인
// 홈을 정식 주소로 선언하게 됩니다. noindex와 '다른 URL을 가리키는 canonical'이
// 겹치면 구글이 noindex를 그 대상에 적용할 수 있어 위험합니다.
export const metadata: Metadata = {
  title: "한빛사진관 · 플레이",
  robots: { index: false, follow: true },
  alternates: { canonical: `${QUIZ_URL}/escape/play` },
};

export default function EscapePlayPage() {
  return <PlayClient />;
}
