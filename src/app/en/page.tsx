import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { enGuides, EN_SITE_NAME } from "@/data/guidesEn";
import { ROOT_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${EN_SITE_NAME} - Practical English Guides for Living in Korea` },
  description:
    "Emergency numbers, late-night hospitals and pharmacies, lost cards and phones, rental deposit safety, and phone scams — practical, sourced guides in English for foreigners living in or visiting Korea.",
  alternates: {
    canonical: `${ROOT_URL}/en`,
    languages: {
      en: `${ROOT_URL}/en`,
      ko: ROOT_URL,
      "x-default": `${ROOT_URL}/en`,
    },
  },
  openGraph: {
    title: `${EN_SITE_NAME} - English Guides for Living in Korea`,
    description:
      "Emergency numbers, night pharmacies, lost property, rental safety, and scam defense — for foreigners in Korea.",
    url: `${ROOT_URL}/en`,
    siteName: EN_SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: `${ROOT_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

export default function EnHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: EN_SITE_NAME,
    url: `${ROOT_URL}/en`,
    description:
      "Practical English guides for emergencies and everyday problems in Korea",
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

      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-accent">{EN_SITE_NAME}</h1>
        <p className="text-sm text-[#a0a0b0] mt-2 leading-relaxed">
          When something goes wrong in Korea and every website is in Korean —
          start here. Practical, sourced, written for foreigners.
        </p>
      </header>

      {/* K-slang dictionary promo */}
      <Link
        href="/en/slang"
        className="block w-full rounded-2xl p-5 text-center mb-6 transition-transform active:scale-[0.98] bg-gradient-to-r from-[#E91E63] to-[#9B59B6]"
      >
        <p className="text-lg font-bold text-white">📖 Korean Slang Dictionary</p>
        <p className="text-sm text-white/70 mt-1">
          Oppa? Daebak? Nunchi? — K-drama &amp; K-pop words explained
        </p>
      </Link>

      <div className="flex flex-col gap-3 mb-6">
        {enGuides.map((g) => (
          <Link
            key={g.id}
            href={`/en/${g.id}`}
            className="bg-card rounded-2xl p-4 border border-[#2a3a5a] hover:border-accent transition-colors"
          >
            <p className="text-base font-bold text-[#e8e8f0]">
              {g.icon} {g.title}
            </p>
            <p className="text-xs text-[#a0a0b0] mt-1.5 leading-relaxed">
              {g.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <section className="bg-card rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-accent mb-3">
          About these guides
        </h2>
        <p className="text-xs text-[#a0a0b0] leading-relaxed mb-2">
          Each guide is written from official Korean sources — police, fire,
          immigration, financial regulators — with the phone numbers and steps
          that actually work for non-Korean speakers, verified and dated. They
          are English editions of our Korean emergency-help site, adapted for
          foreigners rather than machine-translated.
        </p>
        <p className="text-xs text-[#606070] leading-relaxed">
          Something missing or out of date? Tell us via the{" "}
          <Link href="/contact" className="underline hover:text-accent">
            contact page
          </Link>
          .
        </p>
      </section>

      <Link
        href="/"
        className="flex items-center justify-between rounded-xl px-4 py-3 mb-6 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
      >
        <span className="text-sm text-[#a0a0b0]">
          🇰🇷 <span className="font-semibold text-[#e8e8f0]">한국어 사이트</span>
          {" — "}26 guides in Korean
        </span>
        <span className="text-accent text-sm shrink-0 ml-2">→</span>
      </Link>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />
    </div>
  );
}
