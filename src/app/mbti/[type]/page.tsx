import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import { mbtiGroups, mbtiTypes, mbtiLetters, getMbtiType } from "@/data/mbti";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

// MBTI 유형 상세 — 16개 SSR 랜딩 ("INFP 특징" 등 검색 수요 대응)

export function generateStaticParams() {
  return mbtiTypes.map((t) => ({ type: t.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const t = getMbtiType(type);
  if (!t) return {};
  const url = `${QUIZ_URL}/mbti/${t.code.toLowerCase()}`;
  const title = `${t.code} 특징 총정리 - ${t.name}의 성격·연애·궁합·직업`;
  const description = `${t.code}(${t.name})의 성격 특징, 장점과 단점, 연애 스타일, 잘 맞는 유형과 어려운 유형, 어울리는 직업, 스트레스 신호까지. ${t.tagline}.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "article",
      images: [
        { url: `${QUIZ_URL}/quiz-home/opengraph-image`, width: 1200, height: 630 },
      ],
    },
  };
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-2xl p-5 mb-4">
      <h2 className="text-base font-bold text-accent mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default async function MbtiTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const t = getMbtiType(type);
  if (!t) notFound();

  const group = mbtiGroups[t.group];
  const url = `${QUIZ_URL}/mbti/${t.code.toLowerCase()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${t.code} 특징 총정리 - ${t.name}`,
        description: t.tagline,
        url,
        inLanguage: "ko",
        author: { "@type": "Organization", name: SITE_NAME },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MBTI 백과", item: `${QUIZ_URL}/mbti` },
          { "@type": "ListItem", position: 2, name: t.code, item: url },
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
        <Link href="/mbti" className="hover:text-accent">MBTI 백과</Link>
        <span className="mx-1.5">›</span>
        <span className="text-[#a0a0b0]">{t.code}</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-6">
        <div className="text-5xl mb-3">{t.emoji}</div>
        <h1 className="text-3xl font-bold" style={{ color: group.color }}>
          {t.code}
        </h1>
        <p className="text-base font-semibold text-[#e8e8f0] mt-1">{t.name}</p>
        <p className="text-sm text-[#a0a0b0] mt-2">{t.tagline}</p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {t.keywords.map((k) => (
            <span
              key={k}
              className="text-[11px] rounded-full px-2.5 py-1 border"
              style={{ color: group.color, borderColor: `${group.color}55`, backgroundColor: `${group.color}14` }}
            >
              #{k}
            </span>
          ))}
        </div>
      </header>

      <Sec title={`${t.code}는 어떤 사람일까?`}>
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep mb-3">{t.summary}</p>
        <p className="text-xs text-[#606070] leading-relaxed">
          {group.emoji} {group.name}({t.group}) 그룹 · {t.ratio}
        </p>
      </Sec>

      <Sec title="성격 특징">
        <ul className="flex flex-col gap-2.5">
          {t.traits.map((tr, i) => (
            <li key={i} className="text-sm text-[#c0c8d8] leading-relaxed break-keep flex gap-2">
              <span className="shrink-0 text-accent font-bold">{i + 1}.</span>
              <span>{tr}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title="장점과 단점">
        <p className="text-xs font-bold text-[#22C55E] mb-2">💪 이런 점이 강해요</p>
        <ul className="flex flex-col gap-1.5 mb-4">
          {t.strengths.map((s, i) => (
            <li key={i} className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              • {s}
            </li>
          ))}
        </ul>
        <p className="text-xs font-bold text-[#EF4444] mb-2">🚧 이런 점은 조심</p>
        <ul className="flex flex-col gap-1.5">
          {t.weaknesses.map((w, i) => (
            <li key={i} className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              • {w}
            </li>
          ))}
        </ul>
      </Sec>

      <div className="mb-4">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <Sec title="연애 스타일">
        <ul className="flex flex-col gap-2.5">
          {t.love.map((l, i) => (
            <li key={i} className="text-sm text-[#c0c8d8] leading-relaxed break-keep flex gap-2">
              <span className="shrink-0">💘</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title="궁합 — 잘 맞는 유형 vs 노력이 필요한 유형">
        <p className="text-xs font-bold text-[#22C55E] mb-2">잘 맞는 유형</p>
        <div className="flex flex-col gap-2 mb-4">
          {t.bestMatch.map((m) => {
            const mt = getMbtiType(m.code)!;
            return (
              <Link
                key={m.code}
                href={`/mbti/${m.code.toLowerCase()}`}
                className="bg-[#16213e] rounded-xl p-3 border border-[#22C55E]/30 hover:border-[#22C55E] transition-colors"
              >
                <p className="text-sm font-bold text-[#22C55E]">
                  {mt.emoji} {m.code} <span className="text-xs font-normal text-[#a0a0b0]">{mt.name}</span>
                </p>
                <p className="text-xs text-[#c0c8d8] leading-relaxed mt-1 break-keep">{m.reason}</p>
              </Link>
            );
          })}
        </div>
        <p className="text-xs font-bold text-[#F59E0B] mb-2">노력이 필요한 유형</p>
        <div className="flex flex-col gap-2 mb-3">
          {t.toughMatch.map((m) => {
            const mt = getMbtiType(m.code)!;
            return (
              <Link
                key={m.code}
                href={`/mbti/${m.code.toLowerCase()}`}
                className="bg-[#16213e] rounded-xl p-3 border border-[#F59E0B]/30 hover:border-[#F59E0B] transition-colors"
              >
                <p className="text-sm font-bold text-[#F59E0B]">
                  {mt.emoji} {m.code} <span className="text-xs font-normal text-[#a0a0b0]">{mt.name}</span>
                </p>
                <p className="text-xs text-[#c0c8d8] leading-relaxed mt-1 break-keep">{m.reason}</p>
              </Link>
            );
          })}
        </div>
        <p className="text-[11px] text-[#606070] leading-relaxed">
          궁합은 공식 이론이 아닌 대중적 통설입니다. 실제 관계는 유형보다 서로의
          노력이 훨씬 크게 좌우합니다.
        </p>
      </Sec>

      <Sec title="어울리는 직업·진로">
        <div className="flex flex-wrap gap-1.5">
          {t.jobs.map((j) => (
            <span
              key={j}
              className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#c0c8d8]"
            >
              {j}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-[#606070] leading-relaxed mt-3">
          유형은 선호 경향일 뿐, 직업 적합성을 결정하지 않습니다. 진로는 흥미·능력·
          경험을 종합해 판단하세요.
        </p>
      </Sec>

      <Sec title="스트레스 신호와 회복법">
        <p className="text-xs font-bold text-[#e8e8f0] mb-1">😣 언제 힘들어할까</p>
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep mb-3">{t.stress.triggers}</p>
        <p className="text-xs font-bold text-[#e8e8f0] mb-1">🚨 이런 신호가 보이면</p>
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep mb-3">{t.stress.signs}</p>
        <p className="text-xs font-bold text-[#e8e8f0] mb-1">🌱 회복하는 법</p>
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">{t.stress.recovery}</p>
      </Sec>

      <Sec title={`${t.code} 특 모음`}>
        <ul className="flex flex-col gap-2">
          {t.meme.map((m, i) => (
            <li key={i} className="text-sm text-[#c0c8d8] leading-relaxed break-keep flex gap-2">
              <span className="shrink-0 text-accent">✔</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title={`${t.code} 네 글자 해석`}>
        <div className="flex flex-col gap-2.5">
          {t.code.split("").map((letter) => (
            <div key={letter} className="flex gap-3 items-start">
              <span
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ color: group.color, backgroundColor: `${group.color}14`, border: `1px solid ${group.color}55` }}
              >
                {letter}
              </span>
              <div>
                <p className="text-xs font-semibold text-[#e8e8f0]">
                  {mbtiLetters[letter].name}
                </p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed">
                  {mbtiLetters[letter].desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Test CTA */}
      <Link
        href="/mbti/test"
        className="block w-full rounded-2xl p-4 text-center mb-4 transition-transform active:scale-[0.98] bg-gradient-to-r from-[#9B59B6] to-[#5B86E5]"
      >
        <p className="text-base font-bold text-white">내 유형이 궁금하다면?</p>
        <p className="text-xs text-white/70 mt-1">3분 무료 간이 테스트 →</p>
      </Link>

      {/* 다른 유형 */}
      <section className="mb-4">
        <h2 className="text-sm font-bold text-[#a0a0b0] mb-3">다른 유형 보기</h2>
        <div className="grid grid-cols-4 gap-2">
          {mbtiTypes.map((o) => (
            <Link
              key={o.code}
              href={`/mbti/${o.code.toLowerCase()}`}
              className={`text-center text-xs font-bold rounded-lg py-2 border transition-colors ${
                o.code === t.code
                  ? "text-[#1a1a2e] bg-accent border-accent"
                  : "text-[#a0a0b0] bg-card border-[#2a3a5a] hover:border-accent hover:text-accent"
              }`}
            >
              {o.code}
            </Link>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-[#606070] leading-relaxed mb-4">
        이 설명은 통용되는 MBTI 이론과 대중적 통설을 정리한 참고 자료로, 전문
        심리검사를 대체하지 않습니다.
      </p>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
