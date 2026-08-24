import Link from "next/link";
import { getTool } from "@/data/tools";
import { TOOLS_URL, TOOLS_SITE_NAME, ROOT_URL, QUIZ_URL, CALC_URL, CONTACT_EMAIL } from "@/lib/site";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";

// 도구 페이지 공용 셸 — JSON-LD·가이드·FAQ·광고·푸터를 서버 렌더링하고
// children(클라이언트 도구 UI)을 상단에 배치합니다. CalcShell과 같은 패턴.
export default function ToolShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const tool = getTool(id);
  const url = `${TOOLS_URL}/tools/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        url,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        description: tool.metaDescription,
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: TOOLS_SITE_NAME,
            item: TOOLS_URL,
          },
          { "@type": "ListItem", position: 2, name: tool.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bg-header px-5 py-6">
        <Link href="/tools" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← {TOOLS_SITE_NAME}
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">
          <span aria-hidden="true">{tool.icon}</span> {tool.name}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">{tool.card}</p>
      </header>

      <div className="px-5 py-5 space-y-5">
        {/* 도구 본체 (클라이언트) */}
        {children}

        <AdBanner slot="XXXXXXXXXX" format="rectangle" />

        {/* 소개 */}
        <section className="bg-card rounded-2xl p-5">
          {tool.intro.map((p, i) => (
            <p
              key={i}
              className="text-sm text-[#a0a0b0] leading-relaxed break-keep [&+&]:mt-3"
            >
              {p}
            </p>
          ))}
        </section>

        {/* 이용 가이드 */}
        {tool.guide.map((sec) => (
          <section key={sec.title} className="bg-card rounded-2xl p-5">
            <h2 className="text-base font-bold text-accent mb-3">{sec.title}</h2>
            <ul className="space-y-2">
              {sec.items.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-[#c0c8d8] leading-relaxed break-keep"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* FAQ */}
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">자주 묻는 질문</h2>
          <div className="space-y-4">
            {tool.faq.map((f) => (
              <div key={f.q}>
                <p className="text-sm font-semibold mb-1">Q. {f.q}</p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed break-keep">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <AdBanner slot="XXXXXXXXXX" format="auto" />

        <CoupangBanner />

        {/* 푸터 */}
        <footer className="text-center text-xs text-[#606070] pb-8 space-y-2">
          <p>
            <a href={ROOT_URL} className="hover:text-accent">8282114 생활안내</a>
            {" · "}
            <a href={CALC_URL} className="hover:text-accent">모두의 계산기</a>
            {" · "}
            <a href={QUIZ_URL} className="hover:text-accent">상식왕 퀴즈</a>
          </p>
          <p>
            <Link href="/about" className="hover:text-accent">소개</Link>
            {" · "}
            <Link href="/contact" className="hover:text-accent">문의</Link>
            {" · "}
            <Link href="/privacy" className="hover:text-accent">개인정보처리방침</Link>
            {" · "}
            <Link href="/terms" className="hover:text-accent">이용약관</Link>
          </p>
          <p>
            © {new Date().getFullYear()} {TOOLS_SITE_NAME} ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent">
              {CONTACT_EMAIL}
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
