import { NextResponse, type NextRequest } from "next/server";
import { QUIZ_URL, CALC_URL, SPLIT } from "@/lib/site";

// 도메인 분리 프록시 (Next.js 16: middleware → proxy)
// - 계산기 도메인: 루트(/)를 계산기 허브로 rewrite, 퀴즈 경로는 퀴즈 도메인으로 308
// - 퀴즈 도메인: /calculators* 는 계산기 도메인으로 308
// - /about, /contact, /privacy, /terms 는 양쪽 도메인에서 모두 서빙 (AdSense 필수 페이지)
// - env(NEXT_PUBLIC_QUIZ_URL/CALC_URL) 미설정 시 아무것도 하지 않음

const calcHost = SPLIT ? new URL(CALC_URL).host : "";
const quizHost = SPLIT ? new URL(QUIZ_URL).host : "";

const QUIZ_ONLY_PATHS = ["/quiz", "/battle", "/result"];

export function proxy(request: NextRequest) {
  if (!SPLIT) return NextResponse.next();

  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;

  if (host === calcHost) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/calculators", request.url));
    }
    if (
      QUIZ_ONLY_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      )
    ) {
      return NextResponse.redirect(new URL(pathname + search, QUIZ_URL), 308);
    }
  }

  if (
    host === quizHost &&
    (pathname === "/calculators" || pathname.startsWith("/calculators/"))
  ) {
    return NextResponse.redirect(new URL(pathname + search, CALC_URL), 308);
  }

  return NextResponse.next();
}

export const config = {
  // 정적 에셋(_next, 확장자 있는 파일: ads.txt, sitemap.xml, favicon.ico 등)은
  // 양쪽 도메인에서 그대로 서빙되도록 프록시에서 제외
  matcher: ["/((?!_next|.*\\..*).*)"],
};
