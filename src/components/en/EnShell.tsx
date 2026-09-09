import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { enGuides, getEnGuide, EN_SITE_NAME } from "@/data/guidesEn";
import { ROOT_URL } from "@/lib/site";

// Shared frame for /en guides — English counterpart of HelpShell.
// Renders header/date, body, FAQ (+FAQPage JSON-LD), official sources,
// Korean-version link (visible hreflang pair), related guides, ads.

export default function EnShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const g = getEnGuide(id);
  const url = `${ROOT_URL}/en/${g.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.metaTitle,
        description: g.description,
        url,
        inLanguage: "en",
        dateModified: g.date,
        author: { "@type": "Organization", name: EN_SITE_NAME },
      },
      {
        "@type": "FAQPage",
        mainEntity: g.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: EN_SITE_NAME, item: `${ROOT_URL}/en` },
          { "@type": "ListItem", position: 2, name: g.title, item: url },
        ],
      },
    ],
  };

  const related = g.related
    .map((rid) => enGuides.find((x) => x.id === rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav className="text-xs text-[#606070] mb-4">
        <Link href="/en" className="hover:text-accent">
          ← {EN_SITE_NAME}
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-accent break-keep">
          {g.icon} {g.title}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-2 leading-relaxed">
          {g.description}
        </p>
        <p className="text-xs text-[#606070] mt-2">
          Last verified &amp; updated: {g.date}
        </p>
      </header>

      <div className="flex flex-col gap-4">{children}</div>

      <div className="my-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* FAQ */}
      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-3">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-4">
          {g.faq.map((f) => (
            <div key={f.q}>
              <p className="text-sm font-semibold text-[#e8e8f0] mb-1">
                Q. {f.q}
              </p>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-3">
          Official sources
        </h2>
        <ul className="flex flex-col gap-2">
          {g.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8090b0] underline hover:text-accent break-all"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Korean version — visible pair for hreflang */}
      <Link
        href={`/help/${g.koId}`}
        className="flex items-center justify-between rounded-xl px-4 py-3 mb-4 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
      >
        <span className="text-sm text-[#a0a0b0]">
          🇰🇷 <span className="font-semibold text-[#e8e8f0]">한국어로 보기</span>
          {" — "}Korean version of this guide
        </span>
        <span className="text-accent text-sm shrink-0 ml-2">→</span>
      </Link>

      {related.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold text-[#a0a0b0] mb-3">
            Related guides
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/en/${r.id}`}
                className="bg-card rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-[#e8e8f0] break-keep">
                  {r.icon} {r.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-[11px] text-[#606070] leading-relaxed mb-4">
        Phone numbers, fees, and procedures can change. Treat this page as a
        starting point and confirm details with the official sources above.
      </p>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
