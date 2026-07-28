import type { NextRequest } from "next/server";
import { CALC_HOST, SPLIT, SITE_NAME, CALC_SITE_NAME } from "@/lib/site";

// PWA manifest — 접속 도메인에 따라 브랜딩 분기 (퀴즈/계산기)
// 정적 public/manifest.json 대신 라우트 핸들러를 사용해 host별로 다른 이름·아이콘 제공
export function GET(request: NextRequest) {
  const isCalc = SPLIT && request.headers.get("host") === CALC_HOST;

  const manifest = {
    name: isCalc ? CALC_SITE_NAME : SITE_NAME,
    short_name: isCalc ? "모두의계산기" : "상식왕",
    description: isCalc
      ? "연봉 실수령액·전기요금·환율 등 무료 생활 계산기"
      : "다양한 카테고리의 상식 퀴즈를 풀어보세요!",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a2e",
    theme_color: "#1a1a2e",
    icons: isCalc
      ? [
          { src: "/calc-icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/calc-icon-512.png", sizes: "512x512", type: "image/png" },
        ]
      : [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
  };

  return Response.json(manifest, {
    headers: { "content-type": "application/manifest+json" },
  });
}
