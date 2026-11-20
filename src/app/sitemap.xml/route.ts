import { NextResponse, type NextRequest } from "next/server";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { helpTopics } from "@/data/help";
import { tools } from "@/data/tools";
import { enGuides } from "@/data/guidesEn";
import { isIndexableUrl } from "@/lib/indexPolicy";
import { REVIEWED, calcReviewedDate } from "@/lib/trust";
import { HIGHWAYS, SNAPSHOT_DATE } from "@/data/cctvHighways";
import {
  ROOT_URL,
  ROOT_HOST,
  QUIZ_URL,
  CALC_URL,
  TOOLS_URL,
  QUIZ_HOST,
  CALC_HOST,
  TOOLS_HOST,
  KNOWN_HOSTS,
  SPLIT_ACTIVE,
} from "@/lib/site";

// 호스트별 사이트맵 — 접속한 도메인의 URL만 내보냅니다 (feed.xml과 동일 원칙).
// 네이버 서치어드바이저는 사이트맵에 다른 호스트 URL이 섞이면 수집하지 않으므로
// 정적 단일 사이트맵(구 sitemap.ts)에서 동적 분리로 전환했습니다.
// 구글은 GSC 속성별로 자기 호스트 사이트맵을 제출하면 되므로 손해가 없습니다.

const OMOK_LAUNCH = "2026-09-15"; // 1:1 온라인 오목 공개일

/** 가이드 허브의 lastmod — 가장 최근에 손본 글의 수정일 */
function latestGuideDate(): string {
  return guides.map((g) => g.updated).sort().at(-1) ?? REVIEWED.calculators;
}

/** 영문 가이드 허브의 lastmod — 개별 글 date 의 최대값 */
function latestEnDate(): string {
  return enGuides.map((g) => g.date).sort().at(-1) ?? REVIEWED.help;
}

// 섹션 홈. 서브도메인 시절에는 그 호스트의 루트가 곧 섹션 홈이었지만,
// 단일 도메인으로 합친 뒤에는 경로가 따로 생겼습니다(proxy.ts의 LEGACY_HOME과 같은 쌍).
// 이걸 갱신하지 않아 /tools와 /quiz-home 두 허브가 사이트맵에서 빠져 있었습니다 —
// 둘 다 200으로 살아 있는데 사이트맵에는 ROOT_URL이 중복으로 들어가 있었습니다.
const TOOLS_HOME = SPLIT_ACTIVE ? TOOLS_URL : `${ROOT_URL}/tools`;

interface Entry {
  url: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
}

function rootEntries(): Entry[] {
  return [
    // 홈·허브도 lastmod 를 갖습니다 — "이 사이트가 언제 바뀌었나"를 구글이
    // 사이트맵만 보고 알 수 있게. 값은 그 섹션 데이터의 마지막 갱신일입니다.
    { url: ROOT_URL, lastmod: REVIEWED.help, changefreq: "weekly", priority: 1 },
    { url: `${ROOT_URL}/help`, lastmod: REVIEWED.help, changefreq: "weekly", priority: 0.9 },
    ...helpTopics.map((t) => ({
      url: `${ROOT_URL}/help/${t.id}`,
      lastmod: t.date,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
    // 외국인용 영문 가이드
    { url: `${ROOT_URL}/en`, lastmod: latestEnDate(), changefreq: "weekly", priority: 0.8 },
    ...enGuides.map((g) => ({
      url: `${ROOT_URL}/en/${g.id}`,
      lastmod: g.date,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${ROOT_URL}/about`, lastmod: REVIEWED.trustPages, changefreq: "yearly", priority: 0.4 },
    { url: `${ROOT_URL}/contact`, lastmod: REVIEWED.trustPages, changefreq: "yearly", priority: 0.4 },
    { url: `${ROOT_URL}/privacy`, lastmod: REVIEWED.trustPages, changefreq: "yearly", priority: 0.3 },
    { url: `${ROOT_URL}/terms`, lastmod: REVIEWED.trustPages, changefreq: "yearly", priority: 0.3 },
  ];
}

// 퀴즈·MBTI·밈 등은 2026-11-17 삭제(lib/indexPolicy.ts GONE_SECTIONS). 남은 것은 오목뿐이고
// 색인 제외라 아래 필터에서 빠지지만, 정책을 되돌리면 바로 실리도록 항목은 둡니다.
function quizEntries(): Entry[] {
  return [
    { url: `${QUIZ_URL}/omok`, lastmod: OMOK_LAUNCH, changefreq: "monthly", priority: 0.8 },
  ];
}

function calcEntries(): Entry[] {
  return [
    { url: `${CALC_URL}/calculators`, lastmod: REVIEWED.calculators, changefreq: "weekly", priority: 1 },
    ...calculators.map((c) => ({
      url: `${CALC_URL}/calculators/${c.id}`,
      // 2026-11-20 까지 계산기 URL 에는 lastmod 가 아예 없었습니다. 사이트맵에서
      // 날짜가 빠지면 구글은 크롤 주기를 추측으로 정합니다. 값은 그 계산기의
      // 요율·내용을 마지막으로 대조한 날입니다(rate 기반이면 그 요율 파일의 날짜).
      lastmod: calcReviewedDate(c.id),
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${CALC_URL}/guides`, lastmod: latestGuideDate(), changefreq: "monthly", priority: 0.6 },
    ...guides.map((g) => ({
      url: `${CALC_URL}/guides/${g.id}`,
      lastmod: g.updated,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

function toolsEntries(): Entry[] {
  return [
    { url: TOOLS_HOME, changefreq: "weekly", priority: 1 },
    ...tools.map((t) => ({
      url: `${TOOLS_URL}/tools/${t.id}`,
      // 색인되는 것은 /tools/cctv 뿐이라 나머지는 필터에서 빠집니다(그래도 값을 답니다).
      // CCTV 허브는 지점 스냅샷을 다시 받은 날이 곧 내용이 바뀠 날입니다.
      lastmod: t.id === "cctv" ? SNAPSHOT_DATE : REVIEWED.tools,
      changefreq: "monthly" as const,
      priority: 0.9,
    })),
    // 국립공원 CCTV — 목록은 data/cctvParks.ts (2026-10-20 공단 페이지 기준)
    {
      url: `${TOOLS_URL}/tools/cctv/national-parks`,
      lastmod: "2026-10-20",
      changefreq: "monthly" as const,
      priority: 0.8,
    },
    // 고속도로 노선별 CCTV — lastmod 는 지점 스냅샷을 받은 날
    ...HIGHWAYS.map((h) => ({
      url: `${TOOLS_URL}/tools/cctv/${h.slug}`,
      lastmod: SNAPSHOT_DATE,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

function render(entries: Entry[]): string {
  const items = entries
    .map((e) => {
      const parts = [`<loc>${e.url}</loc>`];
      if (e.lastmod) parts.push(`<lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`<changefreq>${e.changefreq}</changefreq>`);
      if (e.priority !== undefined) parts.push(`<priority>${e.priority}</priority>`);
      return `  <url>\n    ${parts.join("\n    ")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");

  // 단일 도메인 통합 후: 정식 호스트는 루트 하나뿐이므로 옛 서브도메인으로 온
  // 사이트맵 요청은 루트로 넘긴다. (분리 시절엔 호스트별로 다른 사이트맵을
  // 내보냈다 — 다시 나누면 SPLIT_ACTIVE 분기가 그 동작을 되살린다)
  if (!SPLIT_ACTIVE && host && host !== ROOT_HOST && !host.startsWith("localhost")) {
    return NextResponse.redirect(new URL("/sitemap.xml", ROOT_URL), 308);
  }
  if (SPLIT_ACTIVE && host && !KNOWN_HOSTS.has(host)) {
    return NextResponse.redirect(new URL("/sitemap.xml", ROOT_URL), 308);
  }

  let entries: Entry[];
  if (!SPLIT_ACTIVE) {
    // 통합 상태 — 모든 섹션을 한 사이트맵에. 호스트가 전부 같아져서
    // 아래 호스트 분기를 그대로 두면 첫 조건에 걸려 퀴즈 URL만 나간다.
    const seen = new Set<string>();
    entries = [
      ...rootEntries(),
      ...quizEntries(),
      ...calcEntries(),
      ...toolsEntries(),
    ].filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
  } else if (host === QUIZ_HOST) entries = quizEntries();
  else if (host === CALC_HOST) entries = calcEntries();
  else if (host === TOOLS_HOST) entries = toolsEntries();
  else entries = rootEntries();

  // noindex 페이지를 사이트맵에 남기면 "제출됐는데 noindex" 경고가 쌓입니다.
  // 아래 생성 함수는 그대로 두고 여기서만 걸러서, 정책을 되돌리면 바로 복구됩니다.
  entries = entries.filter((e) => isIndexableUrl(e.url));

  return new Response(render(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
