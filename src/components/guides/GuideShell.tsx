import { Children, isValidElement } from "react";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { getGuide } from "@/data/guides";
import { getCalc } from "@/data/calculators";
import {
  CALC_URL,
  CALC_SITE_NAME,
  CALC_SPLIT,
  ROOT_URL,
  ROOT_SITE_NAME,
} from "@/lib/site";

/**
 * 섹션 제목 → 앵커 id.
 *
 * 한 페이지가 하위 주제 여럿을 다루는데 각각에 주소가 없으면, 검색엔진이 보기엔
 * 그 주제들이 따로 존재하지 않습니다. /help/medical-cost 가 '병원비 없을 때'로는
 * 뜨는데 그 안에서 다루는 '응급실 대지급 제도'로는 안 뜨는 것이 그 증상입니다
 * (2026-11 실측). 밈을 카테고리 문서로 합칠 때 쓴 '문서 + 앵커' 방식을 여기에도
 * 적용합니다 — 페이지를 쪼개는 것은 이 저장소가 이미 실패한 길입니다.
 *
 * 이모지·문장부호는 버리고 한글·영숫자만 남깁니다. 제목을 바꾸면 앵커도 바뀝니다.
 */
export function secSlug(title: string): string {
  return (
    title
      .replace(/[^0-9a-zA-Z가-힣\s]/g, " ")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase() || "section"
  );
}

// 가이드 본문 섹션 (h2 + 프로즈)
export function Sec({
  title,
  id,
  children,
}: {
  title: string;
  /** 생략하면 제목에서 만듭니다 */
  id?: string;
  children: React.ReactNode;
}) {
  const anchor = id ?? secSlug(title);
  return (
    <section id={anchor} className="bg-card rounded-2xl p-5 scroll-mt-4">
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

  // 본문 Sec 제목으로 목차 — HelpShell 과 같은 이유입니다(하위 주제에 주소 주기).
  const sections = Children.toArray(children)
    .filter(
      (c): c is React.ReactElement<{ title: string; id?: string }> =>
        isValidElement(c) && c.type === Sec
    )
    .map((c) => ({
      title: c.props.title,
      anchor: c.props.id ?? secSlug(c.props.title),
    }));

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
        // 1번 항목의 이름과 주소가 서로 맞아야 합니다. 예전에는 이름이
        // CALC_SITE_NAME(단일 도메인에서는 '상식왕 퀴즈')인데 주소는
        // /calculators라 둘이 어긋나 있었습니다.
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: CALC_SPLIT ? CALC_SITE_NAME : ROOT_SITE_NAME,
            item: CALC_SPLIT ? `${CALC_URL}/calculators` : ROOT_URL,
          },
          ...(CALC_SPLIT
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "생활 계산기 모음",
                  item: `${CALC_URL}/calculators`,
                },
              ]),
          {
            "@type": "ListItem",
            position: CALC_SPLIT ? 2 : 3,
            name: "생활 가이드",
            item: `${CALC_URL}/guides`,
          },
          {
            "@type": "ListItem",
            position: CALC_SPLIT ? 3 : 4,
            name: guide.title,
            item: url,
          },
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
        <p className="text-[11px] text-[#707080] mt-2">
          최종 확인·업데이트 {guide.date}
        </p>
      </header>

      <main className="px-5 py-5 flex-1 space-y-4">
        {sections.length > 2 && (
          <nav aria-label="이 글의 차례" className="bg-card rounded-2xl p-5">
            <h2 className="text-sm font-bold text-accent mb-2.5">이 글의 차례</h2>
            <ul className="space-y-1.5">
              {sections.map((s) => (
                <li key={s.anchor}>
                  <a
                    href={`#${s.anchor}`}
                    className="text-sm text-[#c0c8d8] hover:text-accent leading-relaxed break-keep"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {children}
      </main>

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
