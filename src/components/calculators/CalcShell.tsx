import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import { getCalc } from "@/data/calculators";
import {
  QUIZ_URL,
  CALC_URL,
  SPLIT,
  SITE_NAME,
  CALC_SITE_NAME,
} from "@/lib/site";

// 계산기 페이지 공용 셸 (서버 컴포넌트)
// 헤더 + 계산기 본문(children) + 광고 + SEO 텍스트 + 예시 표 + FAQ + 관련 계산기 + 푸터
// 설명·표·FAQ가 모두 서버 렌더링되어 크롤러가 읽을 수 있고 애드센스 콘텐츠 정책을 충족합니다.
export default function CalcShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const calc = getCalc(id);
  const url = `${CALC_URL}/calculators/${id}`;

  // 도메인 분리 시: 계산기 허브가 사이트 홈 역할 (2단계 경로)
  const breadcrumb = SPLIT
    ? [
        {
          "@type": "ListItem",
          position: 1,
          name: CALC_SITE_NAME,
          item: `${CALC_URL}/calculators`,
        },
        { "@type": "ListItem", position: 2, name: calc.name, item: url },
      ]
    : [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: QUIZ_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "생활 계산기 모음",
          item: `${CALC_URL}/calculators`,
        },
        { "@type": "ListItem", position: 3, name: calc.name, item: url },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: calc.name,
        url,
        description: calc.metaDescription,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        inLanguage: "ko",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bg-header px-5 py-5">
        <Link
          href="/calculators"
          className="text-sm text-[#a0a0b0] hover:text-accent"
        >
          ← 생활 계산기 모음
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">
          <span aria-hidden="true">{calc.icon}</span> {calc.name}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">{calc.card}</p>
      </header>

      <main className="px-5 py-5">{children}</main>

      {/* 계산 결과 확인 직후 — 노출·클릭 최적 지점 */}
      <div className="px-5 pb-2">
        <CoupangBanner className="mb-3" />
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* SEO 콘텐츠 — 서버 렌더링, 크롤러가 읽을 수 있음 */}
      <section className="px-5 pb-4">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            {calc.seo.heading}
          </h2>
          {calc.seo.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-sm text-[#a0a0b0] leading-relaxed mb-3 last:mb-0"
            >
              {p}
            </p>
          ))}
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5 mt-4">
            {calc.seo.bullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 계산 예시 표 — 서버 렌더링 */}
      {calc.table && (
        <section className="px-5 pb-4">
          <div className="bg-card rounded-2xl p-5">
            <h2 className="text-base font-bold mb-3 text-accent">
              {calc.table.title}
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a3a5a]">
                  {calc.table.headers.map((h, i) => (
                    <th
                      key={i}
                      className={`py-2 font-semibold text-[#a0a0b0] ${
                        i === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calc.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-[#2a3a5a]/50">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-2 ${
                          j === 0 ? "text-left text-[#a0a0b0]" : "text-right"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {calc.table.note && (
              <p className="text-xs text-[#606070] mt-3 leading-relaxed">
                {calc.table.note}
              </p>
            )}
          </div>
        </section>
      )}

      {/* FAQ — 서버 렌더링 */}
      <section className="px-5 pb-4">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-4 text-accent">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {calc.faq.map((f, i) => (
              <div key={i}>
                <h3 className="text-sm font-bold mb-1.5">Q. {f.q}</h3>
                <p className="text-sm text-[#a0a0b0] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 관련 계산기 — 내부 링크 */}
      {calc.related.length > 0 && (
        <section className="px-5 pb-4">
          <h2 className="text-base font-bold mb-3">관련 계산기</h2>
          <div className="grid grid-cols-2 gap-3">
            {calc.related.map((rid) => {
              const rel = getCalc(rid);
              return (
                <Link
                  key={rid}
                  href={`/calculators/${rid}`}
                  className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110"
                >
                  <span aria-hidden="true" className="text-xl">
                    {rel.icon}
                  </span>
                  <p className="font-semibold text-sm mt-2">{rel.name}</p>
                  <p className="text-xs text-[#a0a0b0] mt-1">{rel.card}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <a
            href={SPLIT ? QUIZ_URL : "/"}
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            상식왕 퀴즈
          </a>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/about"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            소개
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/contact"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            문의
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/privacy"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            개인정보처리방침
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/terms"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            이용약관
          </Link>
        </div>
        <p className="text-xs text-[#606070]">
          계산 결과는 참고용이며 실제 금액과 다를 수 있습니다.
        </p>
      </footer>
    </div>
  );
}
