import type { NextRequest } from "next/server";
import { helpTopics } from "@/data/help";
import { guides } from "@/data/guides";
import { tools } from "@/data/tools";
import { categories } from "@/data/quizData";
import {
  ROOT_URL,
  CALC_URL,
  QUIZ_URL,
  TOOLS_URL,
  CALC_HOST,
  QUIZ_HOST,
  TOOLS_HOST,
  INFO_SITE_NAME,
  CALC_SITE_NAME,
  SITE_NAME,
  TOOLS_SITE_NAME,
} from "@/lib/site";

// RSS 2.0 피드 — 접속 도메인별로 '그 사이트의 글만' 내보냅니다.
// 네이버 서치어드바이저는 제출 사이트와 다른 도메인 항목이 섞이면
// 형식 오류로 거부하므로, 각 속성(사이트)에 자기 피드를 제출하세요.

interface FeedItem {
  title: string;
  link: string;
  description: string;
  date?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFeed(
  channel: { title: string; link: string; description: string },
  items: FeedItem[]
): string {
  const body = items
    .map((i) => {
      const pubDate = i.date
        ? `\n      <pubDate>${new Date(`${i.date}T09:00:00+09:00`).toUTCString()}</pubDate>`
        : "";
      return `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <description>${escapeXml(i.description)}</description>${pubDate}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${channel.link}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>ko</language>
${body}
  </channel>
</rss>`;
}

export function GET(request: NextRequest) {
  const host = request.headers.get("host");

  let xml: string;
  if (host === CALC_HOST) {
    xml = renderFeed(
      {
        title: `${CALC_SITE_NAME} - 생활 가이드`,
        link: CALC_URL,
        description: "최저임금·4대보험·실업급여 등 생활 제도 가이드와 계산기",
      },
      guides
        .map((g) => ({
          title: g.title,
          link: `${CALC_URL}/guides/${g.id}`,
          description: g.description,
          date: g.date,
        }))
        .sort((a, b) => (a.date! < b.date! ? 1 : -1))
    );
  } else if (host === TOOLS_HOST) {
    xml = renderFeed(
      {
        title: `${TOOLS_SITE_NAME} - 무료 웹 도구`,
        link: TOOLS_URL,
        description: "로그인 없이 브라우저에서만 동작하는 무료 도구 모음",
      },
      tools.map((t) => ({
        title: t.name,
        link: `${TOOLS_URL}/tools/${t.id}`,
        description: t.metaDescription,
      }))
    );
  } else if (host === QUIZ_HOST) {
    xml = renderFeed(
      {
        title: `${SITE_NAME} - 카테고리별 퀴즈`,
        link: QUIZ_URL,
        description: "11개 카테고리 1,100여 문제 무료 상식 퀴즈",
      },
      categories.map((c) => ({
        title: `${c.name} 퀴즈`,
        link: `${QUIZ_URL}/quiz/${c.id}`,
        description: `${c.name} 카테고리 무료 상식 퀴즈 — 문제은행 해설 포함`,
      }))
    );
  } else {
    // 루트(기본): 급할때 생활안내
    xml = renderFeed(
      {
        title: `${INFO_SITE_NAME} - 급할 때 바로 찾는 생활 안내`,
        link: ROOT_URL,
        description:
          "긴급상황 대처법과 몰라서 못 받는 돈·권리 — 공식 출처 기반 실전 매뉴얼",
      },
      helpTopics
        .map((t) => ({
          title: t.title,
          link: `${ROOT_URL}/help/${t.id}`,
          description: t.description,
          date: t.date,
        }))
        .sort((a, b) => (a.date! < b.date! ? 1 : -1))
    );
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
