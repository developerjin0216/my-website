import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import {
  slangCategories,
  slangEntries,
  slangByCategory,
} from "@/data/slangEn";
import { EN_SITE_NAME } from "@/data/guidesEn";
import { ROOT_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Korean Slang Dictionary - ${slangEntries.length} K-pop & K-drama Words Explained | ${EN_SITE_NAME}`,
  },
  description:
    "What does oppa mean? Daebak? Maknae? A fact-checked dictionary of Korean slang, honorifics, and K-pop fandom terms — with pronunciation, real examples, and the politeness rules dramas never explain.",
  alternates: { canonical: `${ROOT_URL}/en/slang` },
  openGraph: {
    title: "Korean Slang Dictionary - K-pop & K-drama Words Explained",
    description:
      "Oppa, daebak, maknae, nunchi — Korean slang and fandom terms with real examples and usage rules.",
    url: `${ROOT_URL}/en/slang`,
    siteName: EN_SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: `${ROOT_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

export default function SlangHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Korean Slang & K-Culture Dictionary",
    url: `${ROOT_URL}/en/slang`,
    description: `${slangEntries.length} Korean slang, honorific, and K-pop fandom terms explained in English`,
    inLanguage: "en",
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
        <Link href="/en" className="hover:text-accent">
          ← {EN_SITE_NAME}
        </Link>
      </nav>

      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-accent">
          Korean Slang Dictionary
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-2 leading-relaxed">
          {slangEntries.length} words you keep hearing in K-dramas, K-pop lives,
          and variety shows — what they mean, how to say them, and when you
          should not.
        </p>
      </header>

      {/* Category nav */}
      <nav className="flex flex-wrap gap-1.5 justify-center mb-6">
        {Object.entries(slangCategories).map(([cid, c]) => (
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

      {(Object.keys(slangCategories) as (keyof typeof slangCategories)[]).map(
        (cid, gi) => {
          const c = slangCategories[cid];
          const list = slangByCategory(cid);
          if (list.length === 0) return null;
          return (
            <section key={cid} id={cid} className="mb-6 scroll-mt-4">
              <h2 className="text-base font-bold text-accent mb-1">
                {c.emoji} {c.name}
                <span className="text-xs font-normal text-[#606070] ml-2">
                  {list.length} terms
                </span>
              </h2>
              <p className="text-xs text-[#a0a0b0] mb-3">{c.desc}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {list.map((e) => (
                  <Link
                    key={e.id}
                    href={`/en/slang/${e.id}`}
                    className="bg-card rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
                  >
                    <p className="text-sm font-bold text-[#e8e8f0]">
                      {e.roman}{" "}
                      <span className="text-xs font-normal text-[#8090b0]">
                        {e.hangul}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#a0a0b0] mt-1 leading-snug line-clamp-2">
                      {e.meaning}
                    </p>
                  </Link>
                ))}
              </div>
              {gi === 1 && (
                <div className="mt-5">
                  <AdBanner slot="XXXXXXXXXX" format="horizontal" />
                </div>
              )}
            </section>
          );
        }
      )}

      <section className="bg-card rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-accent mb-3">
          About this dictionary
        </h2>
        <p className="text-xs text-[#a0a0b0] leading-relaxed">
          Written by Korean speakers, not machine-translated. Romanizations
          follow what fans actually type (oppa, unnie, daebak), each entry
          carries a real example sentence with pronunciation, and the usage
          notes cover the politeness rules — because calling the wrong person
          ajumma is a mistake you only make once.
        </p>
      </section>

      <Link
        href="/en"
        className="flex items-center justify-between rounded-xl px-4 py-3 mb-6 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
      >
        <span className="text-sm text-[#a0a0b0]">
          🧭{" "}
          <span className="font-semibold text-[#e8e8f0]">
            Living in Korea?
          </span>
          {" — "}emergency &amp; life guides in English
        </span>
        <span className="text-accent text-sm shrink-0 ml-2">→</span>
      </Link>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
