import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import {
  memeCategories,
  memes,
  memesByCategory,
  getMeme,
  type MemeCategoryId,
} from "@/data/memes";
import { memeUsage } from "@/data/memeUsage";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

// 밈·신조어 — 카테고리 단위 문서.
//
// 왜 용어별 페이지를 없앴는가: 용어 하나당 본문이 540자뿐이라 95개가 전부
// "크롤링됨 - 현재 색인되지 않음" 상태였습니다. '눈팅 뜻' 같은 단일 용어 검색은
// 나무위키·오픈사전이 장악한 시장이라 분량을 두 배로 늘려도 이기기 어렵습니다.
// 같은 글자수를 카테고리 7개에 모으면 8,000자짜리 문서가 되고, '요즘 신조어
// 정리'처럼 더 이길 만한 검색어를 노릴 수 있습니다.
//
// 기존 용어 URL(/meme/<용어id>)은 해당 카테고리 문서의 앵커로 308 영구 이동합니다.

const CATEGORY_IDS = Object.keys(memeCategories) as MemeCategoryId[];

// 용어 id와 카테고리 id가 겹치면 라우트가 어느 쪽인지 판단할 수 없습니다.
// 새 용어를 추가하다 실수로 겹치면 빌드가 깨지도록 여기서 막습니다.
const collision = memes.find((m) =>
  (CATEGORY_IDS as string[]).includes(m.id)
);
if (collision) {
  throw new Error(
    `[meme] 용어 id "${collision.id}"가 카테고리 id와 겹칩니다. 라우트가 충돌합니다.`
  );
}

const isCategory = (id: string): id is MemeCategoryId =>
  (CATEGORY_IDS as string[]).includes(id);

/** 카테고리별 검색어 중심 제목 */
const SEO_TITLE: Record<MemeCategoryId, string> = {
  recent: "요즘 뜨는 말 총정리 - 2026 최신 유행어·밈 뜻과 유래",
  abbr: "줄임말·신조어 뜻 정리 - 카톡·SNS에서 쓰는 말 모음",
  reaction: "리액션·감탄사 뜻 모음 - 채팅과 댓글에서 쓰는 표현",
  yamin: "야민정음 뜻과 사례 - 글자 모양 바꿔 쓰는 표기 놀이",
  broadcast: "방송·인터넷 밈 모음 - 예능·유튜브에서 나온 유행어 뜻",
  game: "게임에서 온 말 - 일상어가 된 게임 용어 뜻 정리",
  fandom: "덕질·연애 용어 정리 - 팬 활동에서 쓰는 말 뜻과 유래",
};

export function generateStaticParams() {
  // 카테고리 문서만 미리 생성합니다. 옛 용어 URL은 요청 시 308로 넘깁니다.
  return CATEGORY_IDS.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isCategory(id)) return { robots: { index: false, follow: true } };

  const cat = memeCategories[id];
  const list = memesByCategory(id);
  const url = `${QUIZ_URL}/meme/${id}`;
  const title = SEO_TITLE[id];
  const terms = list
    .slice(0, 6)
    .map((m) => m.term)
    .join(", ");

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description:
      `${cat.name} ${list.length}개를 뜻·유래·사용 예시와 함께 정리했습니다. ${terms} 등 실제 대화에서 쓰는 말만 골랐습니다.`.slice(
        0,
        160
      ),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: cat.desc,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function MemeCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 옛 용어 URL → 카테고리 문서의 해당 항목으로 영구 이동
  if (!isCategory(id)) {
    const m = getMeme(id);
    if (m) permanentRedirect(`/meme/${m.category}#${m.id}`);
    notFound();
  }

  const cat = memeCategories[id];
  const list = memesByCategory(id);
  const url = `${QUIZ_URL}/meme/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": `${url}#termset`,
        name: `${cat.name} — 밈·신조어 사전`,
        description: cat.desc,
        url,
        ...authorship("2026-09-08"),
        hasDefinedTerm: list.map((m) => ({
          "@type": "DefinedTerm",
          name: m.term,
          description: m.meaning,
          url: `${url}#${m.id}`,
          inDefinedTermSet: `${url}#termset`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: QUIZ_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "밈·신조어 사전",
            item: `${QUIZ_URL}/meme`,
          },
          { "@type": "ListItem", position: 3, name: cat.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link href="/meme" className="text-sm text-[#a0a0b0] hover:text-accent">
        ← 밈·신조어 사전
      </Link>

      <header
        className="rounded-2xl p-6 mt-3 mb-5 border"
        style={{
          background: `linear-gradient(135deg, ${cat.color}26, #16213e 70%)`,
          borderColor: `${cat.color}55`,
        }}
      >
        <p className="text-xs mb-2" style={{ color: cat.color }}>
          {cat.emoji} 밈·신조어 사전
        </p>
        <h1 className="text-2xl font-bold text-accent break-keep">{cat.name}</h1>
        <p className="text-sm text-[#c0c8d8] leading-relaxed mt-2 break-keep">
          {cat.desc}
        </p>
        <p className="text-[11px] text-[#8a90a0] mt-3">
          {list.length}개 수록 · 최종 확인 2026-09-08
        </p>
      </header>

      {/* 분류 해설 — 용어 나열만 있으면 목록 페이지로 읽힙니다 */}
      <section className="bg-card rounded-2xl p-5 mb-5">
        {cat.intro.map((para, i) => (
          <p
            key={i}
            className="text-sm text-[#c0c8d8] leading-relaxed break-keep mb-3 last:mb-0"
          >
            {para}
          </p>
        ))}
      </section>

      {/* 목차 — 긴 문서의 탐색성과 내부 앵커 확보 */}
      <nav className="bg-card rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-accent mb-3">이 문서에 담긴 말</h2>
        <div className="flex flex-wrap gap-1.5">
          {list.map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#c0c8d8] hover:text-accent hover:border-accent transition-colors"
            >
              {m.term}
            </a>
          ))}
        </div>
      </nav>

      {list.map((m, idx) => (
        <article
          key={m.id}
          id={m.id}
          className="bg-card rounded-2xl p-5 mb-4 scroll-mt-4"
        >
          <h2 className="text-xl font-bold text-accent break-keep">{m.term}</h2>

          <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep mt-3">
            {m.meaning}
          </p>

          {memeUsage[m.id] && (
            <>
              <h3 className="text-sm font-bold text-[#e8e8f0] mt-4 mb-2">
                이런 상황에서 씁니다
              </h3>
              <ul className="flex flex-col gap-1.5">
                {memeUsage[m.id].when.map((w, i) => (
                  <li
                    key={i}
                    className="text-[13px] text-[#c0c8d8] leading-relaxed break-keep flex gap-2"
                  >
                    <span className="shrink-0 text-accent">📌</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <div
                className="rounded-xl px-4 py-3 border mt-3"
                style={{
                  backgroundColor: `${cat.color}14`,
                  borderColor: `${cat.color}44`,
                }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: cat.color }}>
                  💡 사용 팁
                </p>
                <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
                  {memeUsage[m.id].tip}
                </p>
              </div>
            </>
          )}

          <h3 className="text-sm font-bold text-[#e8e8f0] mt-4 mb-2">유래</h3>
          <p className="text-[13px] text-[#c0c8d8] leading-relaxed break-keep">
            {m.origin}
          </p>

          <h3 className="text-sm font-bold text-[#e8e8f0] mt-4 mb-2">이렇게 씁니다</h3>
          <div className="flex flex-col gap-2">
            {m.examples.map((ex, i) => (
              <p
                key={i}
                className="text-[13px] text-[#c0c8d8] leading-relaxed break-keep bg-[#16213e] rounded-xl px-4 py-2.5 border border-[#2a3a5a]"
              >
                💬 {ex}
              </p>
            ))}
          </div>

          {/* 긴 문서 중간 광고 — 항목 사이라 읽기를 끊지 않는 지점 */}
          {idx === 4 && (
            <div className="mt-5">
              <AdBanner slot="XXXXXXXXXX" format="horizontal" />
            </div>
          )}
        </article>
      ))}

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-3">다른 분류도 보기</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORY_IDS.filter((c) => c !== id).map((c) => {
            const o = memeCategories[c];
            return (
              <Link
                key={c}
                href={`/meme/${c}`}
                className="bg-[#16213e] rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-[#e8e8f0] break-keep">
                  {o.emoji} {o.name}
                </p>
                <p className="text-[11px] text-[#a0a0b0] mt-1">
                  {memesByCategory(c).length}개
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="text-center text-xs text-[#606070] pb-8 space-y-2">
        <p className="leading-relaxed">
          모든 설명은 직접 작성한 것이며, 유래가 불확실한 항목은 단정하지 않고
          &ldquo;∼로 알려져 있다&rdquo;로 표기했습니다.
        </p>
        <Link href="/meme" className="inline-block hover:text-[#a0a0b0]">
          밈·신조어 사전 전체 보기 →
        </Link>
      </footer>
    </div>
  );
}
