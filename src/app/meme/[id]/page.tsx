import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import { memeCategories, memes, memesByCategory, getMeme } from "@/data/memes";
import { memeUsage } from "@/data/memeUsage";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

// 밈·신조어 상세 — "○○ 뜻" 검색 수요 대응 SSR 랜딩

export function generateStaticParams() {
  return memes.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const m = getMeme(id);
  if (!m) return {};
  const url = `${QUIZ_URL}/meme/${m.id}`;
  const title = `${m.term} 뜻 - 유래와 사용 예시`;
  return {
    title,
    description: `${m.term} 뜻: ${m.meaning} 유래와 실제 사용 예시까지 정리했습니다.`.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: m.meaning,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: `${QUIZ_URL}/api/og/meme?id=${m.id}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function MemeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = getMeme(id);
  if (!m) notFound();

  const cat = memeCategories[m.category];
  const url = `${QUIZ_URL}/meme/${m.id}`;
  const siblings = memesByCategory(m.category).filter((s) => s.id !== m.id).slice(0, 6);
  const relatedEntries = m.related
    .map((rid) => getMeme(rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: m.term,
        description: m.meaning,
        url,
        inLanguage: "ko",
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "밈·신조어 사전",
          url: `${QUIZ_URL}/meme`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "밈·신조어 사전", item: `${QUIZ_URL}/meme` },
          { "@type": "ListItem", position: 2, name: m.term, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-[#606070] mb-4">
        <Link href="/meme" className="hover:text-accent">밈·신조어 사전</Link>
        <span className="mx-1.5">›</span>
        <Link href={`/meme#${m.category}`} className="hover:text-accent">
          {cat.emoji} {cat.name}
        </Link>
      </nav>

      {/* 짤카드 — 자체 제작 비주얼 카드 (공유 시 OG 이미지도 동일 컨셉) */}
      <header
        className="rounded-2xl p-6 mb-5 text-center border"
        style={{
          background: `linear-gradient(135deg, ${cat.color}26, #16213e 70%)`,
          borderColor: `${cat.color}55`,
        }}
      >
        <p className="text-xs mb-3" style={{ color: cat.color }}>
          {cat.emoji} {cat.name} · 밈·신조어 사전
        </p>
        <h1 className="text-3xl font-bold text-accent break-keep">{m.term}</h1>
        <div className="mt-4 bg-[#1a1a2e]/70 rounded-xl px-4 py-3 border border-[#2a3a5a] text-left">
          <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">
            💬 {m.examples[0]}
          </p>
        </div>
      </header>

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-2">뜻</h2>
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">{m.meaning}</p>
      </section>

      {memeUsage[m.id] && (
        <section className="bg-card rounded-2xl p-5 mb-4">
          <h2 className="text-base font-bold text-accent mb-3">
            이런 상황에서 씁니다
          </h2>
          <ul className="flex flex-col gap-2 mb-4">
            {memeUsage[m.id].when.map((w, i) => (
              <li
                key={i}
                className="text-sm text-[#c0c8d8] leading-relaxed break-keep flex gap-2"
              >
                <span className="shrink-0 text-accent">📌</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
          <div
            className="rounded-xl px-4 py-3 border"
            style={{ backgroundColor: `${cat.color}14`, borderColor: `${cat.color}44` }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: cat.color }}>
              💡 사용 팁
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              {memeUsage[m.id].tip}
            </p>
          </div>
        </section>
      )}

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-2">유래</h2>
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">{m.origin}</p>
      </section>

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-2">이렇게 씁니다</h2>
        <div className="flex flex-col gap-2">
          {m.examples.map((ex, i) => (
            <p
              key={i}
              className="text-sm text-[#c0c8d8] leading-relaxed break-keep bg-[#16213e] rounded-xl px-4 py-3 border border-[#2a3a5a]"
            >
              💬 {ex}
            </p>
          ))}
        </div>
      </section>

      <div className="mb-4">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {relatedEntries.length > 0 && (
        <section className="bg-card rounded-2xl p-5 mb-4">
          <h2 className="text-base font-bold text-accent mb-3">같이 보면 좋은 말</h2>
          <div className="flex flex-wrap gap-1.5">
            {relatedEntries.map((r) => (
              <Link
                key={r.id}
                href={`/meme/${r.id}`}
                className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#c0c8d8] hover:text-accent hover:border-accent transition-colors"
              >
                {r.term}
              </Link>
            ))}
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold text-[#a0a0b0] mb-3">
            {cat.name}의 다른 말들
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {siblings.map((s) => (
              <Link
                key={s.id}
                href={`/meme/${s.id}`}
                className="bg-card rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-[#e8e8f0] break-keep">{s.term}</p>
                <p className="text-[11px] text-[#a0a0b0] mt-1 leading-snug break-keep line-clamp-2">
                  {s.meaning}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cross link */}
      <Link
        href="/quiz/mz"
        className="block w-full rounded-2xl p-4 text-center mb-4 transition-transform active:scale-[0.98] bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
      >
        <p className="text-base font-bold text-[#1a1a2e]">신조어 실력 테스트</p>
        <p className="text-xs text-[#1a1a2e]/70 mt-1">MZ 신조어 퀴즈 100문제 무료 도전 →</p>
      </Link>

      <p className="text-[11px] text-[#606070] leading-relaxed mb-4">
        유래가 불확실한 표현은 널리 알려진 설을 기준으로 정리했습니다. 시대와
        커뮤니티에 따라 뉘앙스가 다를 수 있으니 상황에 맞게 사용해주세요.
      </p>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
