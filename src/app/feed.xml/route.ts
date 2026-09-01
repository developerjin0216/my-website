import { helpTopics } from "@/data/help";
import { guides } from "@/data/guides";
import { ROOT_URL, CALC_URL, INFO_SITE_NAME } from "@/lib/site";

// RSS 2.0 피드 — 검색엔진(구글·네이버)의 신규 콘텐츠 발견 경로.
// 네이버 서치어드바이저는 사이트맵과 별개로 RSS 제출을 지원합니다.

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items = [
    ...helpTopics.map((t) => ({
      title: t.title,
      link: `${ROOT_URL}/help/${t.id}`,
      description: t.description,
      date: t.date,
    })),
    ...guides.map((g) => ({
      title: g.title,
      link: `${CALC_URL}/guides/${g.id}`,
      description: g.description,
      date: g.date,
    })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <description>${escapeXml(i.description)}</description>
      <pubDate>${new Date(`${i.date}T09:00:00+09:00`).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(INFO_SITE_NAME)} - 급할 때 바로 찾는 생활 안내</title>
    <link>${ROOT_URL}</link>
    <description>긴급상황 대처법과 몰라서 못 받는 돈·권리 — 공식 출처 기반 실전 매뉴얼</description>
    <language>ko</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
