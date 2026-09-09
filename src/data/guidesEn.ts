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
  {
    "id": "medical-cost",
    "title": "Hospital Bills You Cannot Pay in Korea",
    "metaTitle": "Can't Pay Your Hospital Bill in Korea? Emergency Medical Costs Guide for Foreigners",
    "description": "No money for an ER or hospital bill in Korea? How foreigners can use deferred payment, 129 emergency welfare, NHIS rules, and travel insurance claims.",
    "icon": "💸",
    "date": "2026-09-09",
    "koId": "medical-cost",
    "related": [
      "night-hospital",
      "emergency-numbers"
    ],
    "faq": [
      {
        "q": "How much does an emergency room visit cost in Korea without insurance?",
        "a": "There is no single fixed price — without NHIS coverage you pay the full charge, which varies widely by hospital and treatment, from tens of thousands of won for a simple consultation to millions of won for surgery or an ICU stay. Ask the billing office (원무과) for an itemized estimate, and remember that in a genuine emergency the hospital must treat you first regardless of payment."
      },
      {
        "q": "Can foreigners use the emergency medical cost deferred payment system (응급의료비 대지급)?",
        "a": "Yes. The program applies to emergency patients regardless of nationality or health insurance status — Korean government guidance confirms foreigners and the uninsured can use it, as long as the treatment was for genuine emergency symptoms and you truly cannot pay at the time. You sign the unpaid-bill form at the hospital before discharge, HIRA pays the hospital, and you repay later — in installments over up to 48 months if needed."
      },
      {
        "q": "Do I have to join Korean national health insurance (NHIS) as a foreigner?",
        "a": "Yes, if you stay 6 months or more you are automatically and mandatorily enrolled as a local subscriber under Article 109 of the National Health Insurance Act (rule in force since July 16, 2019). Employees at Korean workplaces are enrolled from their first day of work regardless of the 6-month rule. Unpaid premiums can hurt future visa extensions, so check your status at any NHIS branch or via 1577-1000."
      },
      {
        "q": "What if my unpaid hospital bill has already gone to collections?",
        "a": "If it is a HIRA deferred-payment balance, contact HIRA at 1644-2000 immediately — you can request installment payment over up to 48 months, while ignoring notices can lead to lawsuits or compulsory collection if you have income or assets. If the hospital itself is pursuing the debt, negotiate directly with its billing office and ask the hospital's social work team about installment plans or charity programs; paying something and documenting hardship is far better than silence."
      },
      {
        "q": "I don't qualify for any of these programs. Is there anything else?",
        "a": "Ask the hospital's social work team (사회사업팀) — they know local charity funds and the Medical Support Program for Foreign Workers and similar groups (외국인근로자 등 의료지원사업), which helps certain foreigners excluded from NHIS and Medical Aid with hospitalization and surgery costs at participating hospitals. Marriage migrants and multicultural families can also call the 24-hour Danuri helpline (1577-1366, 13 languages) for guidance in their own language."
      }
    ],
    "sources": [
      {
        "name": "Easylaw (Ministry of Government Legislation) — Emergency Medical Cost Deferred Payment System",
        "url": "https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=906&ccfNo=2&cciNo=4&cnpClsNo=2"
      },
      {
        "name": "HIRA (Health Insurance Review & Assessment Service) — Emergency Deferred Payment Program",
        "url": "https://www.hira.or.kr/dummy.do?pgmid=HIRAA020020000005"
      },
      {
        "name": "129 Health & Welfare Call Center (Ministry of Health and Welfare)",
        "url": "https://www.129.go.kr/"
      },
      {
        "name": "NHIS — Catastrophic Medical Expense Support Program",
        "url": "https://www.nhis.or.kr/static/html/wbma/c/wbmac0222.html"
      },
      {
        "name": "Ministry of Justice — Immigration Contact Center 1345",
        "url": "https://www.moj.go.kr/moj/196/subview.do"
      }
    ]
  },
  {
    "id": "unpaid-wages",
    "title": "Unpaid Wages in Korea",
    "metaTitle": "Unpaid Wages in Korea: How Foreign Workers Get Paid (2026 Guide)",
    "description": "Employer not paying you in Korea? How foreign workers — including E-9 and part-timers — file a labor complaint, get free help, and recover unpaid wages.",
    "icon": "💼",
    "date": "2026-09-09",
    "koId": "unpaid-wages",
    "related": [
      "scam-calls",
      "medical-cost"
    ],
    "faq": [
      {
        "q": "Can undocumented workers really file a complaint and get their money?",
        "a": "Yes. The Labor Standards Act protects anyone who actually worked, and labor offices accept and process petitions from undocumented workers. Since November 6, 2025, officials handling wage-theft complaints are formally exempt from the duty to report undocumented status to immigration, so the complaint itself is not supposed to trigger deportation proceedings — though it is still smart to consult a migrant worker support center before filing if your status is irregular."
      },
      {
        "q": "How long does the whole process take?",
        "a": "The labor office aims to process a petition within 25 working days, extendable for complex cases, so straightforward cases often resolve in one to three months when the employer pays after the inspector's order. If the employer refuses, add time for the government arrears payment application or a civil suit. Attending every inspector appointment and bringing complete evidence is the best way to keep it fast."
      },
      {
        "q": "I worked more than a year — do I get severance pay too?",
        "a": "Yes. Any worker — foreign or Korean, full-time or part-time — who worked one year or more, averaging 15 or more hours per week, is entitled to severance pay, due within 14 days of leaving the job. For E-9 workers, the departure guarantee insurance payout counts toward this, but if it is less than the legal severance amount (calculated on your full average wage including overtime), the employer must pay the shortfall."
      },
      {
        "q": "My employer threatens to report me to immigration or cancel my visa if I complain. What should I do?",
        "a": "The wage debt does not disappear because of threats — your right to be paid is separate from your visa status, and an employer cannot 'cancel' your right to file. Save the threatening messages as evidence, then call 1577-0071 or 1350. For E-9 workers, unpaid wages are recognized grounds to transfer to a new workplace through the job center, so you do not have to stay with a non-paying employer to keep your visa."
      },
      {
        "q": "I never signed a written contract. Can I still claim unpaid wages?",
        "a": "Yes. The employment relationship can be proven with bank deposit records, KakaoTalk messages about shifts and pay, work schedules, and coworker statements. Note that failing to issue a written contract is itself a violation by the employer — it weakens their position, not yours."
      }
    ],
    "sources": [
      {
        "name": "Ministry of Employment and Labor — How to Resolve Unpaid Wages (노동포털)",
        "url": "https://labor.moel.go.kr/minwonSysInfo/wagesolway.do"
      },
      {
        "name": "Easy Law (법제처 찾기쉬운 생활법령정보) — Wage Arrears Payment (대지급금)",
        "url": "https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1694&ccfNo=3&cciNo=3&cnpClsNo=1"
      },
      {
        "name": "Korea Policy Briefing (korea.kr) — Reporting-Duty Exemption for Wage-Theft Victim Foreigners (effective Nov 6, 2025)",
        "url": "https://www.korea.kr/news/policyNewsView.do?newsId=148954167"
      },
      {
        "name": "HRD Korea — Foreign Workforce Counseling Center (1577-0071)",
        "url": "https://www.hrdkorea.or.kr/1/3/3/4"
      },
      {
        "name": "Gov24 — Free Legal Aid for Workers with Unpaid Wages (대한법률구조공단 132)",
        "url": "https://www.gov.kr/portal/service/serviceInfo/PTR000051328"
      }
    ]
  },
  {
    "id": "car-accident",
    "title": "Car Accident in Korea",
    "metaTitle": "Car Accident in Korea: What to Do — Step-by-Step Guide for Foreigners",
    "description": "What to do after a car accident in Korea: 112/119 calls, insurer dispatch, dashcam evidence, Jeju rental cars, fault ratios, and hit-and-run compensation.",
    "icon": "🚗",
    "date": "2026-09-09",
    "koId": "car-accident",
    "related": [
      "emergency-numbers",
      "natural-disaster"
    ],
    "faq": [
      {
        "q": "Is my international driving permit (IDP) valid in Korea?",
        "a": "Yes, if it was issued under the 1949 Geneva Convention (IDPs from Vienna Convention countries are also accepted) and you carry it together with your home-country license and passport. It is valid for a maximum of one year from your date of entry into Korea and cannot be renewed locally, and rental companies will check all three documents. Note that Korea does not accept ordinary licenses from China alone, and online \"international driving license\" cards that are not official IDPs are rejected."
      },
      {
        "q": "What if I have no Korean car insurance?",
        "a": "If you are driving a rental, the compulsory liability insurance is already included in the rental price — but coverage for damage to the rental car itself depends on the waiver (자차) you selected. If you borrow a friend's car, confirm that the owner's policy covers additional drivers; many Korean policies restrict coverage to named family members, and driving outside the policy leaves you personally liable. If you are the victim, the at-fault driver's insurance pays you regardless of whether you have any Korean insurance."
      },
      {
        "q": "I was hit by a car as a pedestrian. What should I do?",
        "a": "Call 119 if you are hurt and 112 to report the accident, get the driver's name, plate number and insurance company, and see a doctor the same day for a medical certificate (진단서). The driver's compulsory liability insurance covers injured pedestrians regardless of your nationality or visa status. If the driver flees or turns out to be uninsured, file a police report and claim through the government compensation scheme (call center 1544-0049) within 3 years."
      },
      {
        "q": "How strict is drunk driving in Korea?",
        "a": "Very strict: the legal limit is a blood alcohol concentration of 0.03% under the Road Traffic Act, low enough that a single drink can put you over. Penalties include criminal fines or imprisonment and license suspension or revocation, police run random checkpoints, and a DUI accident removes the usual insurance protection against criminal prosecution. Morning-after driving is a common way to fail, so allow generous recovery time."
      },
      {
        "q": "Will reporting an accident affect my visa status?",
        "a": "Simply reporting an accident or making an insurance claim has no effect on your immigration status — police and emergency services respond regardless of visa type, and tourists can claim against insurers just like residents. Criminal convictions arising from an accident (for example drunk driving or hit-and-run) are a different matter and can affect your stay, which is one more reason to remain at the scene and follow the legal steps."
      }
    ],
    "sources": [
      {
        "name": "Easy to Find, Practical Law (Korea Legislation Research Institute) — Traffic and Driving (English)",
        "url": "https://m.easylaw.go.kr/MOM/SubCsmOvRetrieve.laf?langCd=700101&csmSeq=740&ccfNo=4&cciNo=1&cnpClsNo=1"
      },
      {
        "name": "Ministry of Land, Infrastructure and Transport — Guarantee of Automobile Accident Compensation program (정부보장사업)",
        "url": "https://www.molit.go.kr/USR/policyData/m_34681/dtl?id=370"
      },
      {
        "name": "Korea Legislation Research Institute — Road Traffic Act (English translation)",
        "url": "https://elaw.klri.re.kr/eng_mobile/viewer.do?hseq=64085&type=part&key=11"
      },
      {
        "name": "General Insurance Association of Korea — Fault Ratio Information Portal (과실비율정보포털)",
        "url": "https://accident.knia.or.kr/"
      },
      {
        "name": "Korea Tourism Organization — 1330 Korea Travel Helpline",
        "url": "https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140632"
      }
    ]
  },
  {
    "id": "natural-disaster",
    "title": "Typhoons, Floods & Earthquakes in Korea",
    "metaTitle": "Korea Emergency Alerts in English: Typhoon, Flood & Earthquake Guide for Foreigners",
    "description": "How to get Korea's emergency alerts in English, what the alert levels mean, and exactly what to do in a typhoon, flood, or earthquake as a foreigner.",
    "icon": "🌊",
    "date": "2026-09-09",
    "koId": "natural-disaster",
    "related": [
      "emergency-numbers",
      "night-hospital"
    ],
    "faq": [
      {
        "q": "Why is my phone suddenly blaring a siren with a message in Korean?",
        "a": "Korea broadcasts disaster alerts to every phone in an affected area via cell broadcast, so any device on a Korean network receives them automatically. The loudest, unblockable tier (위급재난문자) is for the most severe events; the urgent tier (긴급재난문자) covers evacuation-level situations like typhoons and floods; the quieter safety advisories (안전안내문자) cover things like heat waves. Install the free Emergency Ready App from the Ministry of the Interior and Safety to receive translated alerts in English."
      },
      {
        "q": "Are typhoons dangerous in Seoul, or mostly on the south coast?",
        "a": "Typhoons usually hit Jeju and the southern and southeastern coasts hardest — Typhoon Hinnamnor in 2022 did its worst damage around Pohang — and often weaken before reaching Seoul. But Seoul's biggest killer is intense rainfall rather than wind: the record August 2022 downpours flooded semi-basement homes and roads in the capital with deadly results. So in Seoul, treat heavy-rain alerts as seriously as typhoon alerts, and stay out of underground spaces."
      },
      {
        "q": "Does travel insurance cover typhoons and earthquakes in Korea?",
        "a": "It depends entirely on your policy — many travel policies cover medical treatment and trip disruption caused by natural disasters, but some exclude natural catastrophes or require you to have bought the policy before the storm was named or forecast. Check your policy's natural disaster clause and keep documentation (alert messages, airline notices, receipts) if you make a claim. Korea's government relief payments are aimed at residents with verified property damage, not at travelers."
      },
      {
        "q": "Is there tsunami risk on Korea's east coast?",
        "a": "It is rare but real. A 1983 earthquake off Japan sent a tsunami into Korea's east coast that left three people dead or missing around Imwon and Donghae, and a 1993 event damaged boats along the same coast, which is why the Korea Meteorological Administration runs a dedicated tsunami warning system. If you are on the east coast and feel strong shaking or receive a 지진해일 (tsunami) alert, move to high ground immediately and stay there until the all-clear."
      },
      {
        "q": "Can I call someone in English during a disaster?",
        "a": "Yes. For life-threatening emergencies call 119 and say \"English\" first — an interpreter will be conferenced in, so do not hang up during the brief silence. For non-emergency help in Seoul, call 02-120 then 9 then 1 for the Dasan Call Center's English line (weekdays 09:00–18:00), and the 24-hour 1330 Korea Travel Hotline can interpret or contact 119 on your behalf."
      }
    ],
    "sources": [
      {
        "name": "National Disaster and Safety Portal (국민재난안전포털) — Ministry of the Interior and Safety",
        "url": "https://www.safekorea.go.kr"
      },
      {
        "name": "Ministry of the Interior and Safety (행정안전부) — Safety Stepping Stone / Emergency Ready App",
        "url": "https://www.mois.go.kr/frt/sub/a06/b11/safetyStep/screen.do"
      },
      {
        "name": "Seoul Metropolitan Government — Emergency Ready App guide (English)",
        "url": "https://english.seoul.go.kr/service/living/disaster-evacuation-tips-citizens/emergency-ready-app/"
      },
      {
        "name": "Korea Meteorological Administration (기상청) — English portal (earthquake and tsunami information)",
        "url": "https://www.kma.go.kr/neng/index.do"
      },
      {
        "name": "GOV.KR — Services for Foreigners (emergency support eligibility)",
        "url": "https://www.gov.kr/portal/foreigner/en/m030303"
      }
    ]
  }
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
