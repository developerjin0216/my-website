import type { NextRequest } from "next/server";
import {
  QUIZ_HOST,
  CALC_HOST,
  TOOLS_HOST,
  QUIZ_SPLIT,
  CALC_SPLIT,
  TOOLS_SPLIT,
  SITE_NAME,
  CALC_SITE_NAME,
  TOOLS_SITE_NAME,
  INFO_SITE_NAME,
  BRAND,
} from "@/lib/site";

// PWA manifest — 접속 도메인에 따라 브랜딩 분기 (루트=생활안내 / 퀴즈 / 계산기)
export function GET(request: NextRequest) {
  const host = request.headers.get("host");

  let manifest;
  if (CALC_SPLIT && host === CALC_HOST) {
    manifest = {
      name: CALC_SITE_NAME,
      short_name: BRAND,
      description: "연봉 실수령액·전기요금·환율 등 무료 생활 계산기",
      icons: [
        { src: "/calc-icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/calc-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  } else if (TOOLS_SPLIT && host === TOOLS_HOST) {
    manifest = {
      name: TOOLS_SITE_NAME,
      short_name: BRAND,
      description: "사진·PDF·서류를 브라우저 안에서만 처리하는 무료 도구",
      icons: [
        { src: "/info-icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/info-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  } else if (QUIZ_SPLIT && host === QUIZ_HOST) {
    manifest = {
      name: SITE_NAME,
      short_name: BRAND,
      description: "급할 때 바로 찾는 생활 긴급 안내",
      // 이 분기는 2026-11-17 퀴즈 삭제로 실제로는 쓰이지 않습니다. 분리를 되살릴 때를 위해 남깁니다.
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  } else {
    manifest = {
      name: INFO_SITE_NAME,
      short_name: BRAND,
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
