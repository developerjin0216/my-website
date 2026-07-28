import { NextResponse, type NextRequest } from "next/server";
import { QUIZ_URL, CALC_URL, QUIZ_HOST, CALC_HOST, SPLIT } from "@/lib/site";

// 도메인 분리 프록시 (Next.js 16: middleware → proxy)
// - 계산기 도메인: 루트(/)를 계산기 허브로 rewrite, 퀴즈 경로는 퀴즈 도메인으로 308
// - 퀴즈 도메인: /calculators* 는 계산기 도메인으로 308
// - 그 외 호스트(기존 vercel.app 기본 도메인 등): 정식 도메인으로 308 —
//   같은 콘텐츠가 여러 도메인에 남아 중복 색인·AdSense 중복 사이트 판정되는 것 방지
// - /about, /contact, /privacy, /terms 는 양쪽 도메인에서 모두 서빙 (AdSense 필수 페이지)
// - env(NEXT_PUBLIC_QUIZ_URL/CALC_URL) 미설정·오설정 시 아무것도 하지 않음 (fail-open)
//
// 루프 안전성: SPLIT은 host 비교로 판정되므로(QUIZ_HOST ≠ CALC_HOST 보장)
// redirect 대상은 항상 요청 host와 다른 호스트입니다.

const QUIZ_ONLY_PATHS = ["/quiz", "/battle", "/result"];

export function proxy(request: NextRequest) {
  if (!SPLIT) return NextResponse.next();

  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;
  // 계산기 섹션 경로: 계산기 + 생활 가이드(정보성 콘텐츠)
  const isCalcPath =
    pathname === "/calculators" ||
    pathname.startsWith("/calculators/") ||
    pathname === "/guides" ||
    pathname.startsWith("/guides/");

  if (host === CALC_HOST) {
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL(`/calculators${search}`, request.url)
      );
    }
    if (
      QUIZ_ONLY_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      )
    ) {
      return NextResponse.redirect(new URL(pathname + search, QUIZ_URL), 308);
    }
    return NextResponse.next();
  }

  if (host === QUIZ_HOST) {
    if (isCalcPath) {
      // 계산기·가이드는 계산기 도메인으로 이관
      return NextResponse.redirect(new URL(pathname + search, CALC_URL), 308);
    }
    return NextResponse.next();
  }

  // 알 수 없는 호스트 → 섹션에 맞는 정식 도메인으로 이관
  return NextResponse.redirect(
    new URL(pathname + search, isCalcPath ? CALC_URL : QUIZ_URL),
    308
  );
}

export const config = {
  // 정적 에셋(_next, 확장자 있는 파일: ads.txt, sitemap.xml, favicon.ico 등)은
  // 양쪽 도메인에서 그대로 서빙되도록 프록시에서 제외
  matcher: ["/((?!_next|.*\\..*).*)"],
};
