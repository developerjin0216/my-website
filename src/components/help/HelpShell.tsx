import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import { getHelp } from "@/data/help";
import { ROOT_URL, INFO_SITE_NAME } from "@/lib/site";

// 급할때 생활안내 공용 셸 (서버 컴포넌트)
// 헤더 + 본문(children) + 광고 + 관련 안내 + 푸터, Article JSON-LD 포함
export default function HelpShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const topic = getHelp(id);
  const url = `${ROOT_URL}/help/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: topic.title,
        description: topic.description,
        url,
        datePublished: topic.date,
        dateModified: topic.date,
        inLanguage: "ko",
        author: { "@type": "Organization", name: INFO_SITE_NAME },
        publisher: { "@type": "Organization", name: INFO_SITE_NAME },
        mainEntityOfPage: url,
      },
      // FAQ가 있는 페이지는 FAQPage 구조화 데이터 함께 출력
      ...(topic.faq && topic.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: topic.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: INFO_SITE_NAME, item: ROOT_URL },
          { "@type": "ListItem", position: 2, name: topic.title, item: url },
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
        <Link href="/" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← 급할때 생활안내
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">
          <span aria-hidden="true">{topic.icon}</span> {topic.title}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">{topic.description}</p>
        <p className="text-xs text-[#606070] mt-2">
          최종 확인·업데이트: {topic.date} · 공식기관 안내 기준
        </p>
      </header>

      <main className="px-5 py-5 flex-1 space-y-4">{children}</main>

      {/* FAQ — 실제로 많이 묻는 질문 (FAQPage 구조화 데이터와 1:1) */}
      {topic.faq && topic.faq.length > 0 && (
        <section className="px-5 pb-4">
          <div className="bg-card rounded-2xl p-5">
            <h2 className="text-base font-bold text-accent mb-4">
              🙋 자주 묻는 질문
            </h2>
            <div className="space-y-4">
              {topic.faq.map((f) => (
                <div key={f.q}>
                  <p className="text-sm font-semibold mb-1 break-keep">
                    Q. {f.q}
                  </p>
                  <p className="text-xs text-[#a0a0b0] leading-relaxed break-keep">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 공식 출처 — 본문 근거 (E-E-A-T) */}
      {topic.sources && topic.sources.length > 0 && (
        <section className="px-5 pb-4">
          <div className="bg-[#16213e] rounded-2xl px-5 py-4">
            <h2 className="text-sm font-bold mb-2">🏛 공식 출처·참고</h2>
            <ul className="space-y-1">
              {topic.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#8fa8d0] hover:text-accent underline break-all"
                  >
                    {s.name} ↗
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#606070] mt-2">
              본문 내용은 위 공식 자료를 기준으로 작성했으며, 제도 변경 시
              업데이트합니다.
            </p>
          </div>
        </section>
      )}

      <div className="px-5 pb-4">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* 관련 안내 — 내부 링크 */}
      <section className="px-5 pb-4">
        <h2 className="text-base font-bold mb-3">이런 상황도 준비하세요</h2>
        <div className="grid grid-cols-1 gap-2">
          {topic.related.map((rid) => {
            const rel = getHelp(rid);
            return (
              <Link
                key={rid}
                href={`/help/${rid}`}
                className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <span className="text-sm text-[#e8e8f0] font-semibold">
                  <span aria-hidden="true">{rel.icon}</span> {rel.title}
                </span>
                <span className="text-accent text-sm shrink-0 ml-2">→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 광고·제휴는 콘텐츠가 끝난 뒤에 — 애드센스 심사 대비 배치 */}
      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
        <CoupangBanner className="mt-4" />
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            급할때 생활안내
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
          기관 번호·제도는 변경될 수 있으니 긴급 상황에서는 112·119를 우선
          이용하세요.
        </p>
      </footer>
    </div>
  );
}
