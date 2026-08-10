import { NextResponse, type NextRequest } from "next/server";
import {
  ROOT_URL,
  QUIZ_URL,
  CALC_URL,
  ROOT_HOST,
  QUIZ_HOST,
  CALC_HOST,
  QUIZ_SPLIT,
  CALC_SPLIT,
} from "@/lib/site";

// 3분할 프록시 (Next.js 16: middleware → proxy)
// - 루트(8282114.xyz): 급할때 생활안내 홈(/ + /help/*) — 퀴즈·계산기 경로는 각 서브도메인으로 308
// - quiz 서브도메인: /를 /quiz-home으로 rewrite, 퀴즈 경로 서빙 — 그 외는 해당 도메인으로 308
// - calc 서브도메인: /를 /calculators로 rewrite (기존과 동일)
// - /about, /contact, /privacy, /terms 는 모든 도메인에서 서빙 (AdSense 필수 페이지)
// - 같은 호스트로의 redirect는 절대 발생하지 않도록 host 비교 후에만 308 (루프 방지)

const QUIZ_PATHS = ["/quiz", "/quiz-home", "/quiz-bank", "/battle", "/result"];
const CALC_PATHS = ["/calculators", "/guides"];
const HELP_PATHS = ["/help"];

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function proxy(request: NextRequest) {
  if (!QUIZ_SPLIT && !CALC_SPLIT) return NextResponse.next();

  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;

  const isQuizPath = matches(pathname, QUIZ_PATHS);
  const isCalcPath = matches(pathname, CALC_PATHS);
  const isHelpPath = matches(pathname, HELP_PATHS);

  // 경로가 속한 정식 도메인
  const targetUrl = isCalcPath
    ? CALC_URL
    : isQuizPath
      ? QUIZ_URL
      : ROOT_URL; // help 및 기타 공용 경로의 기준은 루트

  if (host === CALC_HOST && CALC_SPLIT) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/calculators${search}`, request.url));
    }
    if ((isQuizPath || isHelpPath) && new URL(targetUrl).host !== host) {
      return NextResponse.redirect(new URL(pathname + search, targetUrl), 308);
    }
    return NextResponse.next();
  }

  if (host === QUIZ_HOST && QUIZ_SPLIT) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/quiz-home${search}`, request.url));
    }
    if ((isCalcPath || isHelpPath) && new URL(targetUrl).host !== host) {
      return NextResponse.redirect(new URL(pathname + search, targetUrl), 308);
    }
    return NextResponse.next();
  }

  if (host === ROOT_HOST) {
    if ((isQuizPath || isCalcPath) && new URL(targetUrl).host !== host) {
      return NextResponse.redirect(new URL(pathname + search, targetUrl), 308);
    }
    return NextResponse.next();
  }

  // 알 수 없는 호스트(구 vercel.app 주소 등) → 경로에 맞는 정식 도메인으로 이관
  return NextResponse.redirect(new URL(pathname + search, targetUrl), 308);
}

export const config = {
  // 정적 에셋(_next, 확장자 있는 파일: ads.txt, sitemap.xml 등)은 모든 도메인에서 그대로 서빙
  matcher: ["/((?!_next|.*\\..*).*)"],
};
