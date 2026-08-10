import type { NextRequest } from "next/server";
import {
  QUIZ_HOST,
  CALC_HOST,
  QUIZ_SPLIT,
  CALC_SPLIT,
  SITE_NAME,
  CALC_SITE_NAME,
  INFO_SITE_NAME,
} from "@/lib/site";

// PWA manifest — 접속 도메인에 따라 브랜딩 분기 (루트=생활안내 / 퀴즈 / 계산기)
export function GET(request: NextRequest) {
  const host = request.headers.get("host");

  let manifest;
  if (CALC_SPLIT && host === CALC_HOST) {
    manifest = {
      name: CALC_SITE_NAME,
      short_name: "모두의계산기",
      description: "연봉 실수령액·전기요금·환율 등 무료 생활 계산기",
      icons: [
        { src: "/calc-icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/calc-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  } else if (QUIZ_SPLIT && host === QUIZ_HOST) {
    manifest = {
      name: SITE_NAME,
      short_name: "상식왕",
      description: "다양한 카테고리의 상식 퀴즈를 풀어보세요!",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  } else {
    manifest = {
      name: INFO_SITE_NAME,
      short_name: "8282114",
      description: "급할 때 바로 찾는 생활 긴급 안내",
      icons: [
        { src: "/info-icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/info-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  }

  return Response.json(
    {
      ...manifest,
      start_url: "/",
      display: "standalone",
      background_color: "#1a1a2e",
      theme_color: "#1a1a2e",
    },
    { headers: { "content-type": "application/manifest+json" } }
  );
}
