import { NextResponse, type NextRequest } from "next/server";
import {
  ROOT_URL,
  QUIZ_URL,
  CALC_URL,
  TOOLS_URL,
  QUIZ_HOST,
  CALC_HOST,
  TOOLS_HOST,
  KNOWN_HOSTS,
  SPLIT_ACTIVE,
} from "@/lib/site";

// 호스트별 robots.txt — 각 도메인이 자기 사이트맵을 가리키도록 분리.
// (구 robots.ts는 모든 호스트에서 루트 도메인 사이트맵을 가리켜 네이버가
// 서브도메인 사이트맵을 수집하지 못했음)
// /result는 disallow하지 않음 — robots 차단 시 크롤러가 페이지의 noindex를
// 읽지 못해 URL만 색인될 수 있음. 크롤 허용 + meta noindex 조합 유지.

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");

  // 정식 호스트가 아니면(www, *.vercel.app 등) 루트 robots로 308 — sitemap.xml과 동일 규칙
  if (SPLIT_ACTIVE && host && !KNOWN_HOSTS.has(host)) {
    return NextResponse.redirect(new URL("/robots.txt", ROOT_URL), 308);
  }

  const base =
    host === QUIZ_HOST
      ? QUIZ_URL
      : host === CALC_HOST
        ? CALC_URL
        : host === TOOLS_HOST
          ? TOOLS_URL
          : ROOT_URL;

  const body = `User-Agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
