import { NextResponse, type NextRequest } from "next/server";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { categories } from "@/data/quizData";
import { bankPath, getBankPageCount } from "@/lib/quizBank";
import { helpTopics } from "@/data/help";
import { tools } from "@/data/tools";
import { mbtiTypes } from "@/data/mbti";
import { memes } from "@/data/memes";
import { enGuides } from "@/data/guidesEn";
import { slangEntries } from "@/data/slangEn";
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

// 호스트별 사이트맵 — 접속한 도메인의 URL만 내보냅니다 (feed.xml과 동일 원칙).
// 네이버 서치어드바이저는 사이트맵에 다른 호스트 URL이 섞이면 수집하지 않으므로
// 정적 단일 사이트맵(구 sitemap.ts)에서 동적 분리로 전환했습니다.
// 구글은 GSC 속성별로 자기 호스트 사이트맵을 제출하면 되므로 손해가 없습니다.

const MBTI_MEME_LAUNCH = "2026-09-08"; // MBTI 백과·밈 사전 공개일 (실제 lastmod)
const ESCAPE_LAUNCH = "2026-09-14"; // 웹 방탈출 1편 공개일

interface Entry {
  url: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
}

function rootEntries(): Entry[] {
  return [
    { url: ROOT_URL, changefreq: "weekly", priority: 1 },
    ...helpTopics.map((t) => ({
      url: `${ROOT_URL}/help/${t.id}`,
      lastmod: t.date,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
    // 외국인용 영문 가이드
    { url: `${ROOT_URL}/en`, changefreq: "weekly", priority: 0.8 },
    ...enGuides.map((g) => ({
      url: `${ROOT_URL}/en/${g.id}`,
      lastmod: g.date,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
    // K-슬랭 사전 (영문)
    ...(slangEntries.length > 0
      ? [
          { url: `${ROOT_URL}/en/slang`, changefreq: "weekly" as const, priority: 0.8 },
          ...slangEntries.map((e) => ({
            url: `${ROOT_URL}/en/slang/${e.id}`,
            lastmod: "2026-09-09",
            changefreq: "monthly" as const,
            priority: 0.7,
          })),
        ]
      : []),
    // TODO: 토스쇼핑 쉐어링크 연동이 켜지면 `${ROOT_URL}/deals` 추가.
    // 지금은 예시 카드만 있어 페이지가 noindex 상태이므로 사이트맵에 넣지 않습니다.
    // (사이트맵 생성이 토스 API 응답을 기다리게 만들면 GSC 수집이 느려질 수 있어
    //  일부러 자동 판정하지 않고 수동 한 줄로 남겨둡니다)
    { url: `${ROOT_URL}/about`, changefreq: "yearly", priority: 0.4 },
    { url: `${ROOT_URL}/contact`, changefreq: "yearly", priority: 0.4 },
    { url: `${ROOT_URL}/privacy`, changefreq: "yearly", priority: 0.3 },
    { url: `${ROOT_URL}/terms`, changefreq: "yearly", priority: 0.3 },
  ];
}

function quizEntries(): Entry[] {
  return [
    { url: QUIZ_URL, changefreq: "daily", priority: 1 },
    { url: `${QUIZ_URL}/quiz`, changefreq: "daily", priority: 0.9 },
    { url: `${QUIZ_URL}/battle`, changefreq: "monthly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${QUIZ_URL}/quiz/${c.id}`,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${QUIZ_URL}/quiz-bank`, changefreq: "weekly", priority: 0.8 },
    ...categories.flatMap((cat) =>
      Array.from({ length: getBankPageCount(cat.id) }, (_, i) => ({
        url: `${QUIZ_URL}${bankPath(cat.id, i + 1)}`,
        changefreq: "monthly" as const,
        priority: i === 0 ? 0.7 : 0.6,
      }))
    ),
    { url: `${QUIZ_URL}/mbti`, lastmod: MBTI_MEME_LAUNCH, changefreq: "weekly", priority: 0.9 },
    { url: `${QUIZ_URL}/mbti/test`, lastmod: MBTI_MEME_LAUNCH, changefreq: "monthly", priority: 0.8 },
    ...mbtiTypes.map((t) => ({
      url: `${QUIZ_URL}/mbti/${t.code.toLowerCase()}`,
      lastmod: MBTI_MEME_LAUNCH,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
    // 방탈출 — 플레이 화면(/escape/play)은 정답·결말이 노출되므로 색인 제외(noindex)
    { url: `${QUIZ_URL}/escape`, lastmod: ESCAPE_LAUNCH, changefreq: "monthly", priority: 0.9 },
    { url: `${QUIZ_URL}/meme`, lastmod: MBTI_MEME_LAUNCH, changefreq: "weekly", priority: 0.9 },
    ...memes.map((m) => ({
      url: `${QUIZ_URL}/meme/${m.id}`,
      lastmod: MBTI_MEME_LAUNCH,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

function calcEntries(): Entry[] {
  return [
    { url: `${CALC_URL}/calculators`, changefreq: "weekly", priority: 1 },
    ...calculators.map((c) => ({
      url: `${CALC_URL}/calculators/${c.id}`,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${CALC_URL}/guides`, changefreq: "monthly", priority: 0.6 },
    ...guides.map((g) => ({
      url: `${CALC_URL}/guides/${g.id}`,
      lastmod: g.date,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

function toolsEntries(): Entry[] {
  return [
    { url: TOOLS_URL, changefreq: "weekly", priority: 1 },
    ...tools.map((t) => ({
      url: `${TOOLS_URL}/tools/${t.id}`,
      changefreq: "monthly" as const,
      priority: 0.9,
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

  // 정식 호스트가 아니면(www, *.vercel.app 등) 루트 사이트맵으로 308.
  // 그냥 200으로 서빙하면 같은 사이트맵이 여러 호스트에 노출된다.
  // proxy.ts와 동일하게 분리 비활성(로컬 dev)일 때는 그대로 서빙.
  if (SPLIT_ACTIVE && host && !KNOWN_HOSTS.has(host)) {
    return NextResponse.redirect(new URL("/sitemap.xml", ROOT_URL), 308);
  }

  let entries: Entry[];
  if (host === QUIZ_HOST) entries = quizEntries();
  else if (host === CALC_HOST) entries = calcEntries();
  else if (host === TOOLS_HOST) entries = toolsEntries();
  else entries = rootEntries();

  return new Response(render(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
