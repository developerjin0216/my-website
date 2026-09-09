import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import {
  slangCategories,
  slangEntries,
  slangByCategory,
  getSlang,
} from "@/data/slangEn";
import { EN_SITE_NAME } from "@/data/guidesEn";
import { ROOT_URL } from "@/lib/site";

// Per-term SSR landing — targets "<term> meaning" searches.

export function generateStaticParams() {
  return slangEntries.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const e = getSlang(id);
  if (!e) return {};
  const url = `${ROOT_URL}/en/slang/${e.id}`;
  const title = `${e.roman} (${e.hangul}) Meaning - Korean Slang Explained`;
  return {
    title: { absolute: `${title} | ${EN_SITE_NAME}` },
    description: `${e.roman} meaning: ${e.meaning}`.slice(0, 158),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: e.meaning,
      url,
      siteName: EN_SITE_NAME,
      locale: "en_US",
      type: "article",
      images: [{ url: `${ROOT_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function SlangDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = getSlang(id);
  if (!e) notFound();

  const cat = slangCategories[e.category];
  const url = `${ROOT_URL}/en/slang/${e.id}`;
  const related = e.related
    .map((rid) => getSlang(rid))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const siblings = slangByCategory(e.category)
    .filter((s) => s.id !== e.id)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: e.roman,
        alternateName: e.hangul,
        description: e.meaning,
        url,
        inLanguage: "en",
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "Korean Slang & K-Culture Dictionary",
          url: `${ROOT_URL}/en/slang`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Korean Slang Dictionary", item: `${ROOT_URL}/en/slang` },
          { "@type": "ListItem", position: 2, name: e.roman, item: url },
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

      <nav className="text-xs text-[#606070] mb-4">
        <Link href="/en/slang" className="hover:text-accent">
          Korean Slang Dictionary
        </Link>
        <span className="mx-1.5">›</span>
        <Link href={`/en/slang#${e.category}`} className="hover:text-accent">
          {cat.emoji} {cat.name}
        </Link>
      </nav>

      <header className="rounded-2xl p-6 mb-5 text-center border border-[#2a3a5a] bg-gradient-to-br from-[#16213e] to-[#1a1a2e]">
        <p className="text-xs text-[#8090b0] mb-2">
          {cat.emoji} {cat.name}
        </p>
        <h1 className="text-3xl font-bold text-accent">{e.roman}</h1>
        <p className="text-lg text-[#c0c8d8] mt-1">{e.hangul}</p>
      </header>

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-2">What it means</h2>
        <p className="text-sm text-[#c0c8d8] leading-relaxed">{e.meaning}</p>
        <p className="text-xs text-[#606070] leading-relaxed mt-3">
          Literally: {e.literal}
        </p>
      </section>

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-3">In a sentence</h2>
        <div className="bg-[#16213e] rounded-xl px-4 py-3 border border-[#2a3a5a]">
          <p className="text-sm text-[#e8e8f0] leading-relaxed">{e.example.ko}</p>
          <p className="text-xs text-[#8090b0] leading-relaxed mt-1.5 italic">
            {e.example.roman}
          </p>
          <p className="text-xs text-[#a0a0b0] leading-relaxed mt-1.5">
            → {e.example.en}
          </p>
        </div>
      </section>

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-2">
          How (and when) to use it
        </h2>
        <p className="text-sm text-[#c0c8d8] leading-relaxed">{e.usage}</p>
      </section>

      <div className="mb-4">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {related.length > 0 && (
        <section className="bg-card rounded-2xl p-5 mb-4">
          <h2 className="text-base font-bold text-accent mb-3">
            Related words
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/en/slang/${r.id}`}
                className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#c0c8d8] hover:text-accent hover:border-accent transition-colors"
              >
                {r.roman} <span className="text-[#606070]">{r.hangul}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold text-[#a0a0b0] mb-3">
            More {cat.name.toLowerCase()}
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {siblings.map((s) => (
              <Link
                key={s.id}
                href={`/en/slang/${s.id}`}
                className="bg-card rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-[#e8e8f0]">
                  {s.roman}{" "}
                  <span className="text-xs font-normal text-[#8090b0]">
                    {s.hangul}
                  </span>
                </p>
                <p className="text-[11px] text-[#a0a0b0] mt-1 leading-snug line-clamp-2">
                  {s.meaning}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-[11px] text-[#606070] leading-relaxed mb-4">
        Usage and nuance shift over time and between communities — treat this
        as a field guide, not a law book.
      </p>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
