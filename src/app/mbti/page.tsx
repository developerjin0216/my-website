import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { mbtiGroups, mbtiTypes, mbtiLetters } from "@/data/mbti";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "MBTI 유형별 특징 총정리 - 16가지 성격유형·궁합·무료 테스트",
  description:
    "MBTI 16가지 성격유형의 특징, 장단점, 연애 스타일, 궁합, 어울리는 직업까지 한눈에. 3분 무료 간이 테스트로 내 유형도 확인해보세요.",
  alternates: { canonical: `${QUIZ_URL}/mbti` },
  openGraph: {
    title: "MBTI 유형별 특징 총정리 - 16가지 성격유형·궁합·무료 테스트",
    description:
      "16가지 성격유형의 특징·장단점·연애·궁합·직업 총정리 + 3분 무료 테스트",
    url: `${QUIZ_URL}/mbti`,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      { url: `${QUIZ_URL}/quiz-home/opengraph-image`, width: 1200, height: 630 },
    ],
  },
};

const FAQ = [
  {
    q: "MBTI란 무엇인가요?",
    a: "칼 융의 심리 유형 이론을 바탕으로 만들어진 자기보고식 성격 분류 도구입니다. 에너지 방향(E/I), 인식 방식(S/N), 판단 기준(T/F), 생활 양식(J/P) 네 가지 지표를 조합해 16가지 유형으로 나눕니다.",
  },
  {
    q: "MBTI는 과학적으로 정확한가요?",
    a: "심리학계에서는 재검사 시 유형이 바뀌는 낮은 신뢰도, 사람을 이분법으로 나누는 구조의 한계를 지적합니다. 재미와 자기이해의 출발점으로는 유용하지만, 채용·연애·중요한 결정의 근거로 삼는 것은 적절하지 않습니다.",
  },
  {
    q: "유형이 검사할 때마다 바뀌는데 왜 그런가요?",
    a: "지표 점수가 중간에 가까운 사람은 그날의 기분·상황에 따라 결과가 달라지기 쉽습니다. 유형이 자주 바뀐다면 두 유형의 설명을 모두 참고하면 됩니다.",
  },
  {
    q: "MBTI 궁합은 믿을 만한가요?",
    a: "궁합은 공식 이론이 아니라 팬들이 만든 통설로, 통계적 근거는 부족합니다. 실제 관계의 만족도는 유형보다 소통 방식과 노력의 영향이 훨씬 큽니다. 재미로 참고하세요.",
  },
];

export default function MbtiHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "MBTI 유형별 특징 총정리",
        url: `${QUIZ_URL}/mbti`,
        description:
          "MBTI 16가지 성격유형의 특징, 장단점, 연애, 궁합, 직업 총정리",
        inLanguage: "ko",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
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

      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-accent">MBTI 유형별 특징 총정리</h1>
        <p className="text-sm text-[#a0a0b0] mt-2 leading-relaxed">
          16가지 성격유형의 특징·장단점·연애·궁합·직업을
          <br />한 페이지씩 깊게 정리했습니다
        </p>
      </header>

      {/* Test CTA */}
      <Link
        href="/mbti/test"
        className="block w-full rounded-2xl p-5 text-center mb-6 transition-transform active:scale-[0.98] bg-gradient-to-r from-[#9B59B6] to-[#5B86E5]"
      >
        <p className="text-lg font-bold text-white">3분 무료 MBTI 간이 테스트</p>
        <p className="text-sm text-white/70 mt-1">
          20개 질문으로 내 유형 바로 확인 (회원가입 없음)
        </p>
      </Link>

      {/* 16 types by group */}
      {(Object.keys(mbtiGroups) as (keyof typeof mbtiGroups)[]).map((gid) => {
        const g = mbtiGroups[gid];
        return (
          <section key={gid} className="mb-6">
            <h2 className="text-base font-bold mb-1" style={{ color: g.color }}>
              {g.emoji} {g.name} <span className="text-xs font-normal text-[#606070]">({gid})</span>
            </h2>
            <p className="text-xs text-[#a0a0b0] mb-3">{g.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              {g.types.map((code) => {
                const t = mbtiTypes.find((x) => x.code === code)!;
                return (
                  <Link
                    key={code}
                    href={`/mbti/${code.toLowerCase()}`}
                    className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110 border border-[#2a3a5a]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xl">{t.emoji}</span>
                      <span className="font-bold text-sm" style={{ color: g.color }}>
                        {t.code}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#e8e8f0]">{t.name}</p>
                    <p className="text-[11px] text-[#a0a0b0] mt-1 leading-snug">
                      {t.tagline}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Ad */}
      <div className="mb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* MBTI 설명 */}
      <section className="bg-card rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-accent mb-3">
          MBTI 네 글자는 무슨 뜻일까?
        </h2>
        <p className="text-sm text-[#a0a0b0] leading-relaxed mb-4">
          MBTI는 네 가지 질문에 대한 답의 조합입니다. 에너지를 어디서 얻는지(E/I),
          정보를 어떻게 받아들이는지(S/N), 무엇으로 판단하는지(T/F), 어떤 생활
          방식이 편한지(J/P) — 각 지표에서 한 글자씩 뽑아 16가지 유형이 만들어집니다.
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(mbtiLetters).map(([letter, info]) => (
            <div key={letter} className="flex gap-3 items-start">
              <span className="shrink-0 w-7 h-7 rounded-lg bg-[#16213e] border border-[#2a3a5a] flex items-center justify-center text-accent font-bold text-sm">
                {letter}
              </span>
              <div>
                <p className="text-xs font-semibold text-[#e8e8f0]">{info.name}</p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed">{info.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-accent mb-3">자주 묻는 질문</h2>
        <div className="flex flex-col gap-4">
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="text-sm font-semibold text-[#e8e8f0] mb-1">Q. {f.q}</p>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 한계 고지 */}
      <p className="text-[11px] text-[#606070] leading-relaxed mb-6">
        이 페이지의 유형 설명과 궁합은 통용되는 MBTI 이론과 대중적 통설을 정리한
        것으로, 과학적 진단이나 전문 심리검사를 대체하지 않습니다. 사람은 16가지
        유형보다 훨씬 복잡합니다 — 재미와 자기이해의 참고 자료로 활용해주세요.
      </p>

      {/* Cross links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/meme"
          className="bg-card rounded-xl px-4 py-3 border border-[#2a3a5a] hover:border-accent transition-colors text-center"
        >
          <p className="text-sm font-semibold text-[#e8e8f0]">😂 밈·신조어 사전</p>
          <p className="text-[11px] text-[#a0a0b0] mt-0.5">요즘 말 뜻 총정리</p>
        </Link>
        <Link
          href="/quiz/mz"
          className="bg-card rounded-xl px-4 py-3 border border-[#2a3a5a] hover:border-accent transition-colors text-center"
        >
          <p className="text-sm font-semibold text-[#e8e8f0]">🔥 MZ 신조어 퀴즈</p>
          <p className="text-[11px] text-[#a0a0b0] mt-0.5">100문제 무료 도전</p>
        </Link>
      </div>

      <div className="mb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>
    </div>
  );
}
