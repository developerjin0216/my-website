import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { getGuide } from "@/data/guides";
import { getCalc } from "@/data/calculators";
import { CALC_URL, CALC_SITE_NAME } from "@/lib/site";

// 가이드 본문 섹션 (h2 + 프로즈)
export function Sec({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-2xl p-5">
      <h2 className="text-base font-bold mb-3 text-accent">{title}</h2>
      <div className="text-sm text-[#a0a0b0] leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

// 가이드 본문 표
export function GuideTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="w-full text-sm my-1">
      <thead>
        <tr className="border-b border-[#2a3a5a]">
          {headers.map((h, i) => (
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
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[#2a3a5a]/50">
            {row.map((cell, j) => (
              <td
                key={j}
                className={`py-2 ${
                  j === 0 ? "text-left" : "text-right text-[#e8e8f0]"
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 생활 가이드 공용 셸 (서버 컴포넌트)
// 헤더 + 본문(children) + 광고 + 관련 계산기 + 푸터, Article JSON-LD 포함
export default function GuideShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const guide = getGuide(id);
  const url = `${CALC_URL}/guides/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        url,
        datePublished: guide.date,
        dateModified: guide.date,
        inLanguage: "ko",
        author: { "@type": "Organization", name: CALC_SITE_NAME },
        publisher: { "@type": "Organization", name: CALC_SITE_NAME },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: CALC_SITE_NAME,
            item: `${CALC_URL}/calculators`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "생활 가이드",
            item: `${CALC_URL}/guides`,
          },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
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
          href="/guides"
          className="text-sm text-[#a0a0b0] hover:text-accent"
        >
          ← 생활 가이드
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">
          <span aria-hidden="true">{guide.icon}</span> {guide.title}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">{guide.description}</p>
      </header>

      <main className="px-5 py-5 flex-1 space-y-4">{children}</main>

      <div className="px-5 pb-4">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* 관련 계산기 — 내부 링크 */}
      <section className="px-5 pb-4">
        <h2 className="text-base font-bold mb-3">바로 계산해보기</h2>
        <div className="grid grid-cols-2 gap-3">
          {guide.relatedCalcs.map((cid) => {
            const calc = getCalc(cid);
            return (
              <Link
                key={cid}
                href={`/calculators/${cid}`}
                className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110"
              >
                <span aria-hidden="true" className="text-xl">
                  {calc.icon}
                </span>
                <p className="font-semibold text-sm mt-2">{calc.name}</p>
                <p className="text-xs text-[#a0a0b0] mt-1">{calc.card}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <Link
            href="/calculators"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            계산기 모음
          </Link>
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
        </div>
        <p className="text-xs text-[#606070]">
          법령·고시 개정에 따라 내용이 달라질 수 있으니 참고용으로 활용하세요.
        </p>
      </footer>
    </div>
  );
}
