// English guides for foreigners in Korea (/en) — single source for
// hub cards, per-page metadata, hreflang pairs, and the sitemap.
// Audience: expats/travelers searching in English ("emergency number korea",
// "night pharmacy korea", "jeonse scam"). Each guide pairs with a Korean
// help topic via koId for reciprocal hreflang.

import type { Metadata } from "next";
import { ROOT_URL } from "@/lib/site";

export const EN_SITE_NAME = "Korea Life Help";

export interface EnFaq {
  q: string;
  a: string;
}

export interface EnSource {
  name: string;
  url: string;
}

export interface EnGuide {
  id: string;
  title: string; // H1 · card title
  metaTitle: string;
  description: string;
  icon: string;
  date: string; // last verified — shown on page + JSON-LD dateModified
  koId: string; // paired Korean help topic id (hreflang)
  related: string[]; // related EN guide ids
  faq: EnFaq[];
  sources: EnSource[];
}

export const enGuides: EnGuide[] = [
  {
    id: "emergency-numbers",
    title: "Emergency Numbers in Korea",
    metaTitle: "Emergency Numbers in Korea (2026) - 112, 119 & English Help Lines",
    description:
      "Every emergency number that works in Korea: 112 police, 119 fire and ambulance, plus the English-speaking help lines (1330, 1345, BBB) that interpret for you when you cannot speak Korean.",
    icon: "🚨",
    date: "2026-09-09",
    koId: "emergency-numbers",
    related: ["night-hospital", "lost-card", "scam-calls"],
    faq: [
      {
        q: "Do 112 and 119 operators speak English?",
        a: "Not always, but both services can bring an interpreter into the call (three-way interpretation). Say 'English, please' and stay on the line. If you want an English speaker from the first second, the 24-hour Korea Travel Helpline 1330 can interpret and connect you to 112/119.",
      },
      {
        q: "Is the 119 ambulance free in Korea?",
        a: "Yes — the public 119 ambulance is free for everyone, including foreigners and tourists. You only pay the hospital bill afterwards. Private inter-hospital transport ambulances do charge.",
      },
      {
        q: "What if I do not know my address?",
        a: "Describe a large landmark, read the blue-and-white building number plate on any building, or read the number printed on a utility pole. Smartphone reports (112 text or app) transmit your location automatically.",
      },
      {
        q: "Can tourists use these numbers too?",
        a: "Yes. 112, 119 and 1330 work for anyone in Korea from any phone, including phones with no SIM card, and all are toll-free.",
      },
    ],
    sources: [
      { name: "Korean National Police Agency (112)", url: "https://www.police.go.kr" },
      { name: "National Fire Agency (119)", url: "https://www.nfa.go.kr" },
      { name: "Korea Travel Helpline 1330 (VisitKorea)", url: "https://english.visitkorea.or.kr" },
      { name: "HiKorea — Immigration 1345", url: "https://www.hikorea.go.kr" },
    ],
  },
  {
    id: "night-hospital",
    title: "Sick at Night or on a Holiday in Korea",
    metaTitle: "24-Hour Hospitals & Night Pharmacies in Korea - E-Gen Guide for Foreigners",
    description:
      "How to find an open hospital, emergency room, or late-night pharmacy anywhere in Korea using the official E-Gen service, what you can buy at convenience stores, and what an ER visit costs without Korean insurance.",
    icon: "🏥",
    date: "2026-09-09",
    koId: "night-hospital",
    related: ["emergency-numbers", "lost-card"],
    faq: [
      {
        q: "Can I go to a Korean ER without Korean health insurance?",
        a: "Yes. No hospital may refuse emergency treatment. Without National Health Insurance you pay the full uninsured rate — bring your passport and, if you have one, travel insurance documents for reimbursement later.",
      },
      {
        q: "Are any pharmacies open on Sunday or late at night?",
        a: "Yes — designated duty pharmacies rotate by neighborhood. The official E-Gen site and app (www.e-gen.or.kr) list the pharmacies and clinics open right now near you. Some cities also have late-night pharmacies open past midnight.",
      },
      {
        q: "What medicine can I buy at a convenience store?",
        a: "Thirteen basic OTC items are sold 24/7 at convenience stores: acetaminophen (Tylenol), ibuprofen-type cold tablets, digestive aids, and pain-relief patches. Anything stronger requires a pharmacy.",
      },
      {
        q: "How do I find an English-speaking doctor?",
        a: "Major university hospitals (Severance, Seoul National University Hospital, Asan, Samsung) run international clinics with English-speaking staff on weekdays. For urgent advice at night, call 119 — it also handles medical consultation and can interpret.",
      },
    ],
    sources: [
      { name: "E-Gen — Emergency Medical Portal", url: "https://www.e-gen.or.kr" },
      { name: "Ministry of Health & Welfare (129)", url: "https://www.mohw.go.kr" },
      { name: "National Fire Agency — 119 medical consultation", url: "https://www.nfa.go.kr" },
    ],
  },
  {
    id: "lost-card",
    title: "Lost Wallet, Card or ARC in Korea",
    metaTitle: "Lost Your Wallet or Card in Korea - Freeze, Police Lost & Found, ARC Reissue",
    description:
      "The exact order to follow after losing a wallet in Korea: freeze every card with one call, search the national police Lost & Found portal (Lost112), and reissue your ARC or passport correctly.",
    icon: "💳",
    date: "2026-09-09",
    koId: "lost-card",
    related: ["lost-phone", "emergency-numbers", "scam-calls"],
    faq: [
      {
        q: "What are the chances of getting a lost wallet back in Korea?",
        a: "Better than almost anywhere. Found items are usually handed to police and registered on Lost112 (www.lost112.go.kr), which has an English interface. Check it daily for two weeks — items are photographed and searchable by place and date.",
      },
      {
        q: "Am I liable for fraudulent card charges?",
        a: "If you report the loss, charges made from 60 days before the report are generally the card company's responsibility under Korean law, unless you were grossly negligent (e.g., PIN written on the card). Report first, dispute after.",
      },
      {
        q: "How do I replace my ARC (residence card)?",
        a: "Apply within 14 days of loss: reserve a visit at your immigration office through HiKorea (www.hikorea.go.kr) or apply online, bring your passport and a photo, and pay the reissue fee. Losing it repeatedly can incur fines.",
      },
      {
        q: "I lost my passport — police or embassy first?",
        a: "Both, in that order. Get a police lost-property report (any station, or the Lost112 report), then apply at your embassy for a replacement or emergency travel document. Korean immigration will need the new passport to update your records.",
      },
    ],
    sources: [
      { name: "Lost112 — Police Lost & Found (English available)", url: "https://www.lost112.go.kr" },
      { name: "HiKorea — ARC reissue", url: "https://www.hikorea.go.kr" },
      { name: "Financial Supervisory Service (1332)", url: "https://www.fss.or.kr" },
    ],
  },
  {
    id: "lost-phone",
    title: "Lost Phone in Korea",
    metaTitle: "Lost Your Phone in Korea - Track, Suspend, IMEI Block & Where to Look",
    description:
      "Track it, lock it, suspend the line, and block the IMEI so the phone is a brick to anyone else — plus where lost phones actually turn up in Korea: subway lost centers, taxis, and Lost112.",
    icon: "📱",
    date: "2026-09-09",
    koId: "lost-phone",
    related: ["lost-card", "emergency-numbers"],
    faq: [
      {
        q: "Where do lost phones usually end up?",
        a: "Subway lines run their own lost-and-found centers (check the line's website for the station serving your route), taxis can be traced through your card receipt or the T-money helpline, and everything handed to police appears on Lost112 with photos.",
      },
      {
        q: "What is IMEI blocking and should I do it?",
        a: "Korea keeps a shared blacklist of lost phone serial numbers. Once your carrier registers the loss, the device cannot join any Korean network even with a new SIM — which kills its resale value and often gets it returned instead.",
      },
      {
        q: "I am a tourist with a Korean eSIM/prepaid SIM. Who do I call?",
        a: "Contact the SIM provider from their app or website to suspend the number, use Find My (Apple) or Find My Device (Google) to lock the phone remotely, and file a Lost112 report so police can match it if found.",
      },
    ],
    sources: [
      { name: "Lost112 — Police Lost & Found", url: "https://www.lost112.go.kr" },
      { name: "Korea Mobile Phone Find Center", url: "https://www.handphone.or.kr" },
    ],
  },
  {
    id: "jeonse-scam",
    title: "Renting in Korea Without Getting Scammed",
    metaTitle: "Jeonse & Rental Scams in Korea - Deposit Safety Checklist for Foreigners",
    description:
      "Korea's jeonse and wolse deposits are huge by global standards — and so are the scams. How to read the property register, verify the landlord, protect your deposit with a fixed-date stamp and insurance, and the red flags that mean walk away.",
    icon: "🏠",
    date: "2026-09-09",
    koId: "jeonse-check",
    related: ["scam-calls", "lost-card"],
    faq: [
      {
        q: "What is jeonse, in one paragraph?",
        a: "Instead of monthly rent you hand the landlord a large refundable deposit (often 50–80% of the home's value) for a 2-year lease and pay no or little rent. The landlord invests the money and must return the full deposit when you leave. The risk: if the landlord goes broke or the home is over-mortgaged, your deposit is on the line — which is why the checks on this page exist.",
      },
      {
        q: "What is the property register (deungi-bu deungbon) and how do I get it?",
        a: "It is the official record of who owns the property and what debts are secured against it. Anyone can download it for under 1,000 won at iros.go.kr using the address. Check that the owner's name matches the person signing your lease, and look for mortgages (geun-jeodang) — owner's debt plus your deposit should stay well under the market price.",
      },
      {
        q: "Can foreigners get deposit protection like Koreans do?",
        a: "Yes. Registering your residence at the address (through immigration's stay-place report, equivalent to a Korean move-in report) plus getting a fixed-date stamp (hwakjeong-ilja) on the lease at the local community center gives your deposit legal priority. HUG guarantee insurance is also open to foreigners with an ARC for eligible homes — it refunds your deposit if the landlord does not.",
      },
      {
        q: "What are the biggest red flags?",
        a: "A deposit close to or above the home's actual price, a 'representative' signing instead of the registered owner, pressure to pay before you have seen the register, a brand-new villa with no price history, and agents who discourage insurance. Any one of these is reason to walk away.",
      },
    ],
    sources: [
      { name: "Internet Registry Office (property register)", url: "https://www.iros.go.kr" },
      { name: "HUG — deposit guarantee insurance", url: "https://www.khug.or.kr" },
      { name: "Ministry of Land — jeonse fraud support", url: "https://www.molit.go.kr" },
    ],
  },
  {
    id: "scam-calls",
    title: "Scam Calls & Smishing in Korea",
    metaTitle: "Phone Scams Targeting Foreigners in Korea - Voice Phishing, Smishing, Money Mules",
    description:
      "The scripts scammers use on foreigners in Korea — fake immigration officers, delivery smishing, prosecutor impersonation — what to do in the first 10 minutes if you paid, and why 'easy money transfer jobs' can make you a criminal.",
    icon: "🎣",
    date: "2026-09-09",
    koId: "voice-phishing",
    related: ["lost-phone", "lost-card", "jeonse-scam"],
    faq: [
      {
        q: "Immigration called saying my visa has a problem and I must pay. Real?",
        a: "No. Korean immigration, police, and prosecutors never demand money, gift cards, or app installs by phone. Hang up and verify yourself through the official 1345 immigration line. Fear of visa trouble is exactly the lever scammers use on foreigners.",
      },
      {
        q: "I already transferred money. What now?",
        a: "Act in minutes, not hours: call your bank's fraud line and 112 immediately and request payment suspension (jigeup-jeongji) on the receiving account — money frozen before withdrawal can be refunded through the official process. Then file the police report.",
      },
      {
        q: "I clicked a delivery text link. Is my phone infected?",
        a: "If you only clicked, you are probably fine — but if you installed anything (an APK) or entered card details, act now: airplane mode, delete the app, change banking passwords from a different device, and consider a factory reset. KISA's 118 hotline handles smishing reports.",
      },
      {
        q: "A job offers easy pay for receiving and forwarding money. Safe?",
        a: "That is money laundering (a 'money mule'). In Korea you can be criminally charged and deported even if you claim you did not know. The same applies to renting out your bank account or ARC — never do it.",
      },
    ],
    sources: [
      { name: "Financial Supervisory Service — fraud hotline 1332", url: "https://www.fss.or.kr" },
      { name: "KISA 118 — smishing/hacking reports", url: "https://www.kisa.or.kr" },
      { name: "HiKorea — verify immigration matters (1345)", url: "https://www.hikorea.go.kr" },
    ],
  },
];

export function getEnGuide(id: string): EnGuide {
  const g = enGuides.find((x) => x.id === id);
  if (!g) throw new Error(`Unknown EN guide: ${id}`);
  return g;
}

export function buildEnMetadata(id: string): Metadata {
  const g = getEnGuide(id);
  const url = `${ROOT_URL}/en/${g.id}`;
  return {
    title: { absolute: `${g.metaTitle} | ${EN_SITE_NAME}` },
    description: g.description,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        ko: `${ROOT_URL}/help/${g.koId}`,
        "x-default": url,
      },
    },
    openGraph: {
      title: g.metaTitle,
      description: g.description,
      url,
      siteName: EN_SITE_NAME,
      locale: "en_US",
      type: "article",
      images: [
        { url: `${ROOT_URL}/opengraph-image`, width: 1200, height: 630 },
      ],
    },
  };
}
