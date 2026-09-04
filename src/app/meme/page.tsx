import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { memeCategories, memes, memesByCategory } from "@/data/memes";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `밈·신조어 사전 - 요즘 유행어 ${memes.length}개 뜻·유래 총정리`,
  description:
    "럭키비키, 추구미, 중꺾마, 알잘딱깔센… 요즘 밈과 신조어의 뜻·유래·사용 예시를 한 곳에 정리했습니다. 카테고리별로 찾아보는 무료 밈 사전.",
  alternates: { canonical: `${QUIZ_URL}/meme` },
  openGraph: {
    title: `밈·신조어 사전 - 요즘 유행어 ${memes.length}개 뜻·유래 총정리`,
    description: "요즘 밈·신조어의 뜻과 유래, 사용 예시까지 한눈에",
    url: `${QUIZ_URL}/meme`,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      { url: `${QUIZ_URL}/quiz-home/opengraph-image`, width: 1200, height: 630 },
    ],
  },
};

export default function MemeHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "밈·신조어 사전",
    url: `${QUIZ_URL}/meme`,
    description: `요즘 밈과 신조어 ${memes.length}개의 뜻·유래·사용 예시 정리`,
    inLanguage: "ko",
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-accent">밈·신조어 사전</h1>
        <p className="text-sm text-[#a0a0b0] mt-2 leading-relaxed">
          그 말이 무슨 뜻이지? — 요즘 유행어 {memes.length}개의
          <br />뜻·유래·사용법을 정리했습니다
        </p>
      </header>

      {/* Category nav */}
      <nav className="flex flex-wrap gap-1.5 justify-center mb-6">
        {Object.entries(memeCategories).map(([cid, c]) => (
          <a
            key={cid}
            href={`#${cid}`}
            className="text-xs bg-card border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
          >
            {c.emoji} {c.name}
          </a>
        ))}
      </nav>

      <div className="mb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* Entries by category */}
      {(Object.keys(memeCategories) as (keyof typeof memeCategories)[]).map(
        (cid, gi) => {
          const c = memeCategories[cid];
          const list = memesByCategory(cid);
          return (
            <section key={cid} id={cid} className="mb-6 scroll-mt-4">
              <h2 className="text-base font-bold text-accent mb-1">
                {c.emoji} {c.name}
                <span className="text-xs font-normal text-[#606070] ml-2">
                  {list.length}개
                </span>
              </h2>
              <p className="text-xs text-[#a0a0b0] mb-3">{c.desc}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {list.map((m) => (
                  <Link
                    key={m.id}
                    href={`/meme/${m.id}`}
                    className="bg-card rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
                  >
                    <p className="text-sm font-bold text-[#e8e8f0] break-keep">
                      {m.term}
                    </p>
                    <p className="text-[11px] text-[#a0a0b0] mt-1 leading-snug break-keep line-clamp-2">
                      {m.meaning}
                    </p>
                  </Link>
                ))}
              </div>
              {gi === 2 && (
                <div className="mt-5">
                  <AdBanner slot="XXXXXXXXXX" format="horizontal" />
                </div>
              )}
            </section>
          );
        }
      )}

      {/* SEO text + 고지 */}
      <section className="bg-card rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-accent mb-3">이 사전은요</h2>
        <p className="text-xs text-[#a0a0b0] leading-relaxed mb-2">
          유행어는 태어나고 사라지는 속도가 빠릅니다. 이 사전은 일상 대화, 방송
          자막, 커뮤니티와 SNS에서 실제로 자주 쓰이는 말을 골라 뜻과 유래, 실제
          사용 예시까지 직접 정리합니다. 새 유행어는 계속 추가됩니다.
        </p>
        <p className="text-xs text-[#606070] leading-relaxed">
          유래가 불확실한 항목은 단정하지 않고 널리 알려진 설을 기준으로
          표기했습니다. 일부 표현은 어원에 비속어가 포함되거나 상대를 불쾌하게
          할 수 있으니, 상황과 상대를 살펴 사용해주세요.
        </p>
      </section>

      {/* Cross links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/quiz/mz"
          className="bg-card rounded-xl px-4 py-3 border border-[#2a3a5a] hover:border-accent transition-colors text-center"
        >
          <p className="text-sm font-semibold text-[#e8e8f0]">🔥 MZ 신조어 퀴즈</p>
          <p className="text-[11px] text-[#a0a0b0] mt-0.5">배운 밈, 퀴즈로 확인</p>
        </Link>
        <Link
          href="/mbti"
          className="bg-card rounded-xl px-4 py-3 border border-[#2a3a5a] hover:border-accent transition-colors text-center"
        >
          <p className="text-sm font-semibold text-[#e8e8f0]">🔮 MBTI 백과</p>
          <p className="text-[11px] text-[#a0a0b0] mt-0.5">16유형 특징·궁합</p>
        </Link>
      </div>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
