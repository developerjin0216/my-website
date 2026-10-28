import Link from "next/link";
import { getTool } from "@/data/tools";
import { TOOLS_URL, TOOLS_SITE_NAME, ROOT_URL, CONTACT_EMAIL } from "@/lib/site";
import { authorship, REVIEWED } from "@/lib/trust";
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
        // 발행 주체와 최종 점검일 — 도구 페이지도 누가 만들었는지 밝힙니다
        ...authorship(REVIEWED.tools),
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
          // 2단계였습니다 — /tools 허브가 빠져 도구가 루트 바로 밑에 매달린 것처럼
          // 보였습니다. /help 와 같은 이유로 허브를 거치게 합니다.
          {
            "@type": "ListItem",
            position: 2,
            name: "모두의 도구",
            item: `${ROOT_URL}/tools`,
          },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
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
        <p className="text-[11px] text-[#707080] mt-2">
          최종 점검 {REVIEWED.tools} · 파일은 브라우저 안에서만 처리되며 서버로
          전송되지 않습니다
        </p>
      </header>

      <div className="px-5 py-5 space-y-5">
        {/* 도구 본체 (클라이언트) */}
        {children}

        {/* 도구 사용 직후 — 노출·클릭 최적 지점 */}
        <CoupangBanner />

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

        {/* 이어서 볼 곳 — 도구 페이지가 막다른 길이면 크롤러도 사용자도 여기서 끝납니다 */}
        {tool.related && tool.related.length > 0 && (
          <section className="bg-card rounded-2xl p-5">
            <h2 className="text-base font-bold text-accent mb-3">
              이어서 보면 좋은 것
            </h2>
            <div className="space-y-2">
              {tool.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="block rounded-xl px-4 py-3 bg-[#16213e] border border-[#2a3a5a] hover:border-accent transition-colors"
                >
                  <p className="text-sm font-semibold text-[#e8e8f0]">
                    {r.label}
                  </p>
                  <p className="text-xs text-[#a0a0b0] mt-0.5 leading-relaxed break-keep">
                    {r.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdBanner slot="XXXXXXXXXX" format="auto" />

        {/* 푸터 */}
        <footer className="text-center text-xs text-[#606070] pb-8 space-y-2">
          <p>
            {/* CALC_URL·QUIZ_URL은 통합 후 둘 다 루트라, 예전 링크는 이름만 다르고
                셋 다 홈으로 갔습니다. 실제 경로를 씁니다. */}
            <a href={ROOT_URL} className="hover:text-accent">8282114 생활안내</a>
            {" · "}
            <Link href="/help" className="hover:text-accent">급할 때 대처법</Link>
            {" · "}
            <Link href="/calculators" className="hover:text-accent">생활 계산기</Link>
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
