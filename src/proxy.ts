import { NextResponse, type NextRequest } from "next/server";
import { ROOT_URL, ROOT_HOST, SPLIT_ACTIVE } from "@/lib/site";
import { isGonePath } from "@/lib/indexPolicy";

// 단일 도메인 통합 프록시 (Next.js 16: middleware → proxy)
//
// 2026-07에 quiz·calc·tools를 서브도메인으로 분리했다가 2026-09에 되돌렸습니다.
// 이유는 lib/site.ts 주석 참고. 이 파일이 하는 일은 이제 두 가지뿐입니다.
//  1) 옛 서브도메인으로 들어온 요청을 루트의 같은 경로로 308 영구 이동
//  2) 그 외(루트·로컬)는 그대로 통과
//
// 서브도메인 루트(/)는 각 섹션 홈으로 보냅니다. 루트 도메인의 /는 '급할때
// 생활안내' 홈이라, 그냥 /로 넘기면 퀴즈를 찾아온 사람이 엉뚱한 데 떨어집니다.

const LEGACY_HOME: Record<string, string> = {
  "quiz.8282114.xyz": "/", // 퀴즈 홈은 2026-11-17 삭제
  "calc.8282114.xyz": "/calculators",
  "tools.8282114.xyz": "/tools",
};

// www도 같이 정리 — 정식 호스트는 8282114.xyz 하나입니다
const LEGACY_HOSTS = new Set([...Object.keys(LEGACY_HOME), "www.8282114.xyz"]);

// 삭제한 섹션(lib/indexPolicy.ts GONE_SECTIONS)의 응답. 사람에게는 갈 곳을 알려 주고,
// 검색엔진에는 410 과 noindex 로 영구 삭제를 알립니다.
const GONE_HTML = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>정리된 페이지 | 8282114 생활안내</title></head><body style="font-family:system-ui,sans-serif;background:#1a1a2e;color:#e8e8f0;max-width:32rem;margin:0 auto;padding:3rem 1.25rem;line-height:1.7"><h1 style="color:#ffd700;font-size:1.4rem">이 페이지는 정리되었습니다</h1><p>사이트 주제를 &lsquo;급할 때 생활 안내&rsquo;로 좁히면서 퀴즈·MBTI·밈·AI 프롬프트·영어 슬랭 페이지를 2026년 11월에 내렸습니다.</p><p><a href="/" style="color:#ffd700">홈으로</a> · <a href="/help" style="color:#ffd700">급할 때 대처법</a> · <a href="/calculators" style="color:#ffd700">생활 계산기</a> · <a href="/omok" style="color:#ffd700">오목</a></p></body></html>`;

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host) return NextResponse.next();

  if (isGonePath(request.nextUrl.pathname)) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  // 통합 후에는 정식 호스트가 하나뿐이라 SPLIT_ACTIVE는 항상 false입니다.
  // 다시 분리하게 되면 이 가드가 옛 동작을 되살릴 자리입니다.
  if (SPLIT_ACTIVE) return NextResponse.next();

  if (host === ROOT_HOST) return NextResponse.next();

  if (LEGACY_HOSTS.has(host)) {
    const { pathname, search } = request.nextUrl;
    const target = pathname === "/" ? (LEGACY_HOME[host] ?? "/") : pathname;
    return NextResponse.redirect(new URL(target + search, ROOT_URL), 308);
  }

  // Vercel 기본 도메인(moducalc.vercel.app 등)도 본 도메인으로 — 2026-11 추가.
  // 그 주소가 살아서 사이트 전체를 200으로 내보내고 있었고, 거기로 들어오는 사람이
  // 실제로 있었습니다. 검색엔진에는 중복 사이트이고, 사람에게는 주소가 둘인 셈입니다.
  // 프로덕션 배포에서만 겁니다 — 프리뷰 배포(브랜치별 *.vercel.app)는 테스트용이라
  // 건드리면 미리보기가 전부 본 도메인으로 튀어 버립니다. VERCEL_ENV 는 Vercel 이
  // 런타임에 넣어 주는 값이고 로컬·프리뷰에서는 "production" 이 아닙니다.
  //
  // 301 인 이유(2026-11-12): 사이트는 5~8월에 sangsikwang.vercel.app·moducalc.vercel.app 에서
  // 운영됐고, 구글 서치콘솔은 아직 그 사본들을 새 주소의 '참조 페이지'로 기억합니다. 서치콘솔
  // '주소 변경' 도구는 옛 홈페이지가 301 로 넘어가야 한다고만 적고 있어(308 언급 없음), 그
  // 도구를 쓸 수 있게 여기만 301 로 둡니다. 검색엔진에는 둘 다 영구 이전입니다.
  if (
    host.endsWith(".vercel.app") &&
    process.env.VERCEL_ENV === "production"
  ) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(new URL(pathname + search, ROOT_URL), 301);
  }

  // 로컬 개발(localhost 등)은 건드리지 않습니다
  return NextResponse.next();
}

export const config = {
  // 정적 에셋(_next, 확장자 있는 파일)은 프록시를 타지 않습니다.
  // sitemap.xml·robots.txt는 각 라우트에서 자체적으로 호스트를 판별합니다.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
