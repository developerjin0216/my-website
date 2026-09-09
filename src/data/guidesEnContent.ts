// Structured body content for data-driven /en guides (the ones rendered by
// src/app/en/[id]/page.tsx). The original six guides are hand-written JSX
// pages; guides added later ship as data here — same EnShell frame, no
// per-page JSX needed. Metadata/FAQ/sources live in guidesEn.ts.

export interface EnGuideSection {
  title: string;
  body: string[]; // paragraphs (may start with "1. " style numbering)
  table?: { headers: string[]; rows: string[][] };
}

export interface EnGuideContent {
  intro: string;
  sections: EnGuideSection[];
}

// 초안 작성 + 적대적 사실검증(워크플로 wf_9b2cf1d5) 완료분
export const enGuideContent: Record<string, EnGuideContent> = {
  "medical-cost": {
    "intro": "Facing a Korean hospital bill with no money and no insurance is frightening, but you have more options than you may think. Korean law guarantees emergency treatment to foreigners regardless of ability to pay, and several government programs can defer or subsidize the cost. This guide explains exactly what to say at the hospital front desk, who to call, and what paperwork to collect.",
    "sections": [
      {
        "title": "Emergency Rooms Cannot Turn You Away",
        "body": [
          "Under Korea's Emergency Medical Service Act (응급의료에 관한 법률), Article 3, everyone has the right to emergency medical care without discrimination based on economic circumstances — and the law explicitly states that foreigners staying in Korea have the same right. Article 6 prohibits emergency medical personnel from refusing or evading emergency care without justifiable cause, with violations punishable by up to 3 years in prison or a 30 million won fine.",
          "In a real emergency, treatment comes first and payment comes later. Do not avoid calling 119 or going to the ER because you cannot pay upfront — hospitals are legally required to treat emergency patients first.",
          "One caveat: since a 2024 Ministry of Health and Welfare guideline, hospitals may lawfully redirect clearly non-urgent, mild cases (such as a common cold) to regular clinics. The legal protection applies to genuine emergency symptoms.",
          "If you cannot communicate in Korean, free phone interpretation is available. Ask hospital staff to conference in one of the hotlines below."
        ],
        "table": {
          "headers": [
            "Number",
            "Service",
            "Languages / Hours"
          ],
          "rows": [
            [
              "119",
              "Ambulance and emergency rescue",
              "24 hours"
            ],
            [
              "129",
              "Health & Welfare Call Center — emergency welfare support (긴급복지)",
              "Crisis lines 24 hours; mainly Korean, so conference in an interpreter line"
            ],
            [
              "1345",
              "Immigration Contact Center (Ministry of Justice) — living info and 3-way interpretation",
              "20 languages; weekdays 9:00–22:00 (after 18:00: Korean, English, Chinese)"
            ],
            [
              "1577-1366",
              "Danuri Call Center — marriage migrants and multicultural families",
              "13 languages, 24 hours, 365 days"
            ],
            [
              "1588-5644",
              "BBB Korea — free volunteer phone interpretation",
              "About 20 languages, 24 hours"
            ],
            [
              "1644-2000",
              "HIRA — emergency medical cost deferred payment inquiries",
              "Business hours, Korean"
            ],
            [
              "1577-1000",
              "NHIS — health insurance; foreign-language service available",
              "Business hours; English, Chinese, Vietnamese, Uzbek"
            ]
          ]
        }
      },
      {
        "title": "Option 1: Deferred Payment of Emergency Bills (응급의료비 대지급)",
        "body": [
          "If you received genuine emergency treatment and cannot pay, Korea has an official deferred-payment system: the state (via the Health Insurance Review & Assessment Service, HIRA) pays the hospital on your behalf, and you repay the government later. Government legal guidance states this system can be used by people without health insurance, including foreigners.",
          "1. Before you are discharged, tell the hospital's billing office (원무과) that you cannot pay and want to use the emergency medical cost deferred payment system (응급의료비 대지급제도).",
          "2. Fill out and sign the unpaid emergency bill form (응급진료비 미납확인서) kept at the hospital. The hospital then claims the unpaid amount from HIRA under Article 22 of the Emergency Medical Service Act.",
          "3. HIRA later sends you a payment notice. Pay at a bank or to the designated account under the patient's name, and if you cannot pay at once, you can apply to repay in installments over up to 48 months.",
          "Important limits: it only applies to treatment for genuine emergency symptoms, not every ER visit, and it cannot be used for bills you have already paid. Your spouse and immediate family (within one degree) share the repayment obligation, and if you have income or assets but refuse to repay, HIRA can pursue lawsuits or compulsory collection. Questions: HIRA at 1644-2000."
        ]
      },
      {
        "title": "Option 2: Emergency Welfare Medical Support — Dial 129 (긴급복지 의료지원)",
        "body": [
          "The Emergency Welfare Support Act (긴급복지지원법) provides fast medical cost support for people in crisis who face a serious illness or injury requiring surgery or hospitalization and cannot afford it. It works on a 'support first, verify later' basis: call 129 (Health & Welfare Call Center, 24 hours for crisis calls) or contact your city/district (시·군·구) welfare office; a third party such as a friend can also call on your behalf.",
          "Foreigners CAN qualify, but only in specific categories set by Article 5-2 of the Act and its Enforcement Decree: (1) someone married to a Korean national, (2) someone divorced from or widowed by a Korean spouse who is caring for Korean-national children or parents, (3) a recognized refugee under the Refugee Act, (4) a holder of humanitarian stay status, and (5) someone harmed by fire, crime, or natural disaster through no fault of their own. Tourists and most short-term visitors do not qualify.",
          "Timing matters: the request must be made before you leave the hospital — official guidance says the request should reach the city/district office no later than three days before discharge, and bills you have already paid are not covered. Income and asset criteria apply (verified after the initial support), and it cannot be combined with catastrophic medical expense support for the same episode.",
          "If you fall outside these categories — for example an undocumented worker or a refugee applicant — ask the hospital's social work team (사회사업팀) about the separate Medical Support Program for Foreign Workers and similar groups (외국인근로자 등 의료지원사업), which subsidizes hospitalization and surgery costs for certain foreigners who cannot join the NHIS or Medical Aid, through participating hospitals."
        ]
      },
      {
        "title": "Option 3: Catastrophic Medical Expense Support (재난적의료비) for NHIS Members",
        "body": [
          "If you are enrolled in the National Health Insurance Service (NHIS) but a large bill still overwhelms you, the catastrophic medical expense support program (재난적의료비 지원) can reimburse 50–80% of your out-of-pocket costs, including some non-covered (비급여) items. It targets households at roughly the lower 50% of income (around or below 100% of the standard median income) with property under a set threshold, and hardship cases slightly above the line can be approved through individual review.",
          "Inpatient care covers most conditions, but for treatment received on or after July 1, 2026, mild (minor) conditions are excluded; outpatient care is covered only for six severe disease groups (cancer, cerebrovascular disease, heart disease, rare diseases, severe intractable diseases, severe burns). Support covers up to 180 treatment days per year, and published annual caps vary between sources — confirm the current limit with NHIS at 1577-1000.",
          "Apply at any NHIS branch within 180 days of the final treatment date (discharge). If you are still hospitalized and want the money paid directly to the hospital, apply at least 7 days before discharge (Medical Aid recipients and near-poor reduced-copayment households: at least 3 days before discharge). Bring the application form, medical certificate, itemized bills and receipts, proof of any private insurance payouts, and your Korean bank account details."
        ]
      },
      {
        "title": "NHIS Rules Foreigners Must Know — Enrollment Is Not Optional",
        "body": [
          "Since July 16, 2019, any foreigner who stays in Korea for 6 months or more is mandatorily enrolled in the NHIS as a local (self-employed category) subscriber under Article 109 of the National Health Insurance Act. This is automatic, not a choice — and unpaid premiums accumulate as arrears that can cause disadvantages when extending your visa or re-entering Korea.",
          "If you are employed at a Korean workplace, the 6-month wait does not apply: you are enrolled as a workplace subscriber (직장가입자) from your first day of work, with your employer paying half the premium. As of 2026 the employee health insurance rate is 7.19% of salary, split evenly between you and your employer.",
          "This matters for unpaid bills because NHIS coverage typically reduces a hospital bill dramatically — without it you pay 100% of charges at rates the hospital sets. If you have been in Korea over 6 months and never sorted out your insurance, visit an NHIS branch or call 1577-1000 (foreign-language service available) to check your enrollment status and any back premiums before a bigger bill arrives."
        ]
      },
      {
        "title": "Travel Insurance Claims: Collect the Paperwork Before You Leave the Hospital",
        "body": [
          "If you are a short-term visitor with travel insurance, Korean hospitals are used to issuing claim documents — but you must ask before leaving, as requesting them from abroad later is much harder. Insurers generally require an itemized bill and receipt (진료비 계산서·영수증), a detailed statement of charges including non-covered items (진료비 세부내역서), and a medical certificate or diagnosis (진단서).",
          "1. At the billing office, ask for the receipt and the detailed itemized statement — say '진료비 세부내역서 주세요' or show the phrase in writing.",
          "2. Request a medical certificate (진단서) from the treating department; hospitals charge a document fee for this, and larger hospitals and international clinics can often issue it in English.",
          "3. Keep pharmacy receipts and prescriptions separately — outpatient medication is billed by the pharmacy, not the hospital.",
          "Check your policy's claim deadline and whether your insurer needs documents in English; if only Korean documents are available, insurers commonly accept them with a translation, but confirm with your insurer first. If you cannot pay the bill at all, combine this with Option 1 (deferred payment) and file the insurance claim to fund your repayment."
        ]
      }
    ]
  },
  "unpaid-wages": {
    "intro": "If your employer in Korea has not paid your wages, overtime, or severance, you have a clear legal path to recover the money — and it works the same whether you are an E-9 factory worker, a part-time student, or even undocumented. The process is free, does not require a lawyer, and in many cases the government pays you first and collects from the employer later. This guide walks through the hotlines, the labor office petition (jinjeong), and the free legal aid available to foreign workers.",
    "sections": [
      {
        "title": "Your Right to Be Paid Does Not Depend on Your Visa",
        "body": [
          "Korea's Labor Standards Act protects everyone who actually performs work in Korea, regardless of nationality or visa status. Courts and the Ministry of Employment and Labor (MOEL) treat the wage claim and the immigration question as separate legal issues: even if you worked without a valid visa or work permit, the wages you earned are legally owed to you, and you can file a complaint to recover them.",
          "Since November 6, 2025, the Ministry of Justice has formally exempted labor inspectors handling wage-theft complaints from the usual duty to report undocumented foreigners to immigration authorities.",
          "Act quickly: wage claims expire three years after the money became due. By law, all wages and severance must be paid within 14 days after you leave a job, and an employer who fails to pay can face criminal punishment of up to 3 years in prison or a 30 million won fine."
        ]
      },
      {
        "title": "Step 1: Gather Your Evidence",
        "body": [
          "You can win a case without a written contract, but every piece of evidence makes the labor inspector's job easier and the process faster. Collect copies before you confront your employer, in case you lose access to the workplace.",
          "1. Employment contract (근로계약서), if you have one — even a photo of it.",
          "2. Records of hours worked: timesheets, work schedules, shift tables, commute app logs, or your own daily notes with dates and hours.",
          "3. KakaoTalk, SMS, or messenger conversations with the boss about work, schedules, and pay — screenshots with dates visible.",
          "4. Bank statements showing past salary deposits (they prove the pay rate and that an employment relationship existed) and pay slips if any.",
          "5. Anything else: photos of you at the workplace, uniforms or ID badges, and names and contacts of coworkers who can confirm you worked there."
        ]
      },
      {
        "title": "Step 2: Get Advice in Your Language",
        "body": [
          "Before filing, a phone consultation helps you confirm how much you are owed and what documents you need. The MOEL customer counseling center (dial 1350, no area code) is the main labor-rights hotline; it operates primarily in Korean but can guide foreign workers to interpretation services at local labor offices.",
          "For counseling directly in your own language, call the Foreign Workforce Counseling Center (외국인력상담센터) at 1577-0071. It is run by HRD Korea under MOEL for Employment Permit System workers and employers, with native-language counselors covering the languages of the EPS sending countries (Vietnamese, Thai, Filipino, Indonesian, Khmer, Nepali, and more), plus real-time three-way interpretation. English is not on its official language list, so English speakers may get better results from the Immigration Contact Center at 1345, which offers English.",
          "For visa-side questions — for example, what a wage complaint means for your stay — the Immigration Contact Center at 1345 provides counseling in about 20 languages."
        ],
        "table": {
          "headers": [
            "Number",
            "Service",
            "Languages"
          ],
          "rows": [
            [
              "1350",
              "MOEL counseling center — wage theft, labor law",
              "Korean; can connect foreign workers to interpretation"
            ],
            [
              "1577-0071",
              "Foreign Workforce Counseling Center (HRD Korea)",
              "Korean + 17 EPS-country languages (no English), 3-way interpretation"
            ],
            [
              "1345",
              "Immigration Contact Center — visa and stay questions",
              "About 20 languages"
            ],
            [
              "132",
              "Korea Legal Aid Corporation — free lawsuits for unpaid wages",
              "Korean; bring an interpreter or ask a support center to help"
            ]
          ]
        }
      },
      {
        "title": "Step 3: File a Petition (Jinjeong) at the Labor Office",
        "body": [
          "A jinjeong (진정) is a formal complaint asking the government to make your employer pay. It is free, and you do not need a lawyer.",
          "1. File online through MOEL's civil petition service on the Labor Portal (labor.moel.go.kr — go to 민원신청 and choose the wage arrears petition, 임금체불 진정), or visit the local labor office (지방고용노동청) that covers your workplace in person. The online form is in Korean, so ask a support center or a Korean-speaking friend to help if needed.",
          "2. A labor inspector (근로감독관) is assigned, usually within about a week, and summons both you and the employer to give statements — sometimes face to face. Attend every appointment and bring all your evidence; if you miss two summonses the case is closed (though you can refile).",
          "3. The standard processing period is 25 working days, extendable if the case is complicated. Many cases end here: the inspector calculates the exact amount owed and orders the employer to pay, and employers often pay to avoid criminal referral.",
          "4. If the employer still refuses, the case is referred for criminal prosecution, and the inspector issues you a Confirmation of Unpaid Wages and Employer (체불 임금등·사업주 확인서). Keep this document safe — it is the key that unlocks the government payout and free lawsuits described below."
        ]
      },
      {
        "title": "Step 4: Get Paid by the Government First (Gani Daejigeupgeum)",
        "body": [
          "Korea has a safety net called the simplified wage arrears payment (간이대지급금): the state pays you a capped portion of confirmed unpaid wages and severance up front, then chases the employer for reimbursement itself. You apply to the Korea Workers' Compensation and Welfare Service (근로복지공단) using the confirmation document from the labor office, and foreign workers apply on the same basis as Koreans.",
          "Under current rules, the caps are up to 7 million won for unpaid wages (final 3 months) and up to 7 million won for unpaid severance (final 3 years), with a combined maximum of 10 million won; workers still employed at the business can claim the wage portion only. Caps and conditions are adjusted from time to time, so confirm the current figures with the labor inspector or at 1350 when you apply.",
          "Deadlines are strict: to qualify through the labor-office route, the petition must be filed within one year of the day you left the job, and the payout claim must then be made to the Korea Workers' Compensation and Welfare Service within six months of the confirmation document being first issued — so move promptly at every step. Any amount above the caps can still be recovered from the employer through a civil lawsuit, which for most workers is free through legal aid."
        ],
        "table": {
          "headers": [
            "Item",
            "Cap (current rules — confirm when applying)",
            "Period covered"
          ],
          "rows": [
            [
              "Unpaid wages / suspension allowance",
              "Up to 7,000,000 won",
              "Final 3 months"
            ],
            [
              "Unpaid severance pay",
              "Up to 7,000,000 won",
              "Final 3 years"
            ],
            [
              "Combined maximum",
              "10,000,000 won",
              "—"
            ]
          ]
        }
      },
      {
        "title": "Free Legal Help and Extra Protections for E-9 Workers",
        "body": [
          "The Korea Legal Aid Corporation (대한법률구조공단, dial 132) provides completely free legal aid — consultation, drafting, and full lawsuit representation — for wage-theft victims whose average monthly wage in the final three months was under 4 million won, and this explicitly includes foreign workers residing in Korea. Bring your confirmation document from the labor office and your ID to the nearest branch; the litigation costs are funded by MOEL.",
          "In-person help is also available from foreign worker support centers. The old national network was reorganized in 2024 and centers are now run with local governments, so availability varies by region — call 1577-0071 to find the nearest one, and many migrant-support NGOs and counseling desks also assist with petitions free of charge.",
          "E-9 (and H-2) workers have extra layers of protection. Employers must enroll E-9 workers in departure guarantee insurance (출국만기보험), which functions as your severance fund — and if the insurance payout is less than your legal severance, the employer must pay the difference. A separate employer-funded wage payment guarantee insurance can cover a portion of arrears (up to around 4 million won at covered workplaces), and unpaid wages are recognized grounds for an EPS workplace transfer, so ask your local job center about changing employers without penalty."
        ]
      }
    ]
  },
  "car-accident": {
    "intro": "A car accident in Korea follows a script that surprises many foreigners: insurers, not drivers, argue over fault, almost every car carries a dashcam, and cash settlements at the scene are a trap. This guide walks you through the first five minutes, the phone calls to make (with interpretation options), and what to do if you are injured, driving a rental on Jeju, or hit by an uninsured or hit-and-run driver. Every hotline and program named here is verifiable through official Korean government or agency sources.",
    "sections": [
      {
        "title": "First Moves at the Scene: Hazard Lights, 119, 112",
        "body": [
          "Korean law (Road Traffic Act, Article 54) requires drivers involved in an accident to stop immediately, help anyone injured, and exchange contact details. Secondary collisions are a real danger, especially on expressways, so make the scene safe before anything else.",
          "1. Turn on your hazard lights and stop. If both cars can still drive, take a few quick photos of the vehicles' positions, then move them to the shoulder or a safe spot so you do not cause a second crash.",
          "2. Check for injuries. If anyone is hurt, call 119 (fire and ambulance — free, 24/7). If you cannot speak Korean, say \"English, please\" and stay on the line; an interpreter is brought into the call.",
          "3. Call the police at 112 whenever someone is injured, the other driver flees, you suspect drunk driving, or there is any dispute. Police interpretation is available, though service hours for some languages may vary.",
          "4. Exchange information: name, phone number, plate number, and insurance company. Photograph the other car's plate even before talking.",
          "5. On a highway, get everyone behind the guardrail — never stand between or behind the stopped cars.",
          "A police report is legally required when someone is hurt or killed. For a pure property-damage fender-bender where you have exchanged details and cleared the road, the law does not force you to call 112 — but if the other driver is uncooperative, uninsured, or you are unsure, call the police anyway. Never simply drive away: leaving the scene without exchanging information can be treated as a hit-and-run offense."
        ],
        "table": {
          "headers": [
            "Number",
            "Service",
            "Notes for foreigners"
          ],
          "rows": [
            [
              "119",
              "Fire and ambulance",
              "Free, 24/7; three-way phone interpretation available"
            ],
            [
              "112",
              "Police",
              "24/7; interpretation available (hours may vary by language)"
            ],
            [
              "1330",
              "Korea Travel Hotline (Korea Tourism Organization)",
              "Tourist help and live interpretation; major languages around the clock"
            ],
            [
              "1544-0049",
              "Government compensation call center (hit-and-run / uninsured accidents)",
              "Korean-language line; ask 1330 or a Korean speaker to assist"
            ]
          ]
        }
      },
      {
        "title": "Call the Insurance Accident Dispatch (사고출동) — or Your Rental Company",
        "body": [
          "Every Korean auto insurer runs a 24-hour accident dispatch service (사고출동). One call brings an adjuster or dispatch agent to the scene who documents the accident, arranges towing, and afterwards negotiates directly with the other driver's insurer. If you own a car in Korea, save your insurer's accident hotline in your phone now — the number is on your policy and your windshield sticker.",
          "Driving a rental car — for example on Jeju — call the rental company's hotline first, not an insurer. The number is usually printed on the key tag, the rental agreement, or a sticker inside the car. The company coordinates the insurance response, sends roadside assistance, and can arrange a replacement vehicle; report even minor scratches immediately, because unreported damage discovered at return often leads to disputes.",
          "Rental prices in Korea include the compulsory liability insurance, but damage to the rental car itself is covered only if you purchased the collision damage waiver (자차, often sold in tiers). Partial waivers carry a deductible (면책금) and daily compensation for the days the car is out of service (휴차료) may be charged, so check your contract. If the call center has no English speaker, call 1330 and ask for three-way interpretation."
        ]
      },
      {
        "title": "Evidence: Photos, Dashcam (블랙박스), and Witnesses",
        "body": [
          "Fault in Korea is decided later from evidence, so document everything before the cars move (or immediately after moving them if traffic is dangerous). Your phone camera and dashcams do most of the work.",
          "1. Take wide shots from all four directions showing both cars, lane markings, and traffic lights or signs.",
          "2. Take close-ups of every damaged area on both vehicles, plus skid marks, scattered debris, and the other car's license plate.",
          "3. Photograph the road context: intersection layout, signals, obstructions, weather and road surface.",
          "The vast majority of cars in Korea — including most rentals — carry a dashcam, called a 블랙박스 (black box). Secure your own footage right away, since many units overwrite old recordings within hours or days; for a rental, ask the company to preserve and extract the file. Politely ask the other driver and owners of nearby parked cars for their footage too, and note witnesses' phone numbers. Police can also request CCTV from intersections and nearby buildings."
        ]
      },
      {
        "title": "Fault Ratios (과실비율): No Cash on the Spot, No Reflexive Apologies",
        "body": [
          "In Korea, fault is expressed as a percentage split (과실비율, e.g. 70:30) and is negotiated between the two insurers using standardized criteria published by the General Insurance Association of Korea. You can look up typical scenarios on the official fault-ratio portal (accident.knia.or.kr), and disputed cases go to a dedicated deliberation committee. In short: evidence and standards decide fault — not whoever argues loudest at the scene.",
          "Never settle in cash at the scene and never sign anything you do not fully understand. Injuries and hidden vehicle damage often surface days later, and an on-the-spot cash deal is very hard to unwind; the correct move is always to let the insurers handle it.",
          "A cultural note: in Korea, saying \"sorry\" repeatedly can be taken as admitting fault in later negotiations. Be polite, check whether the other person is hurt, but stick to facts and let the adjusters and dashcam footage speak. Even if the other driver insists you were at fault, you are not obliged to agree to any percentage at the scene."
        ]
      },
      {
        "title": "Hit-and-Run or Uninsured Driver: The Government Compensation Scheme",
        "body": [
          "If you are injured by a hit-and-run driver who is never identified, or by a vehicle with no compulsory insurance, Korea has a state safety net: the Guarantee of Automobile Accident Compensation program (자동차손해배상 보장사업, commonly called 정부보장사업), run by the Ministry of Land, Infrastructure and Transport under Article 30 of the Guarantee of Automobile Accident Compensation Act. Since 2022 it also covers injuries from objects that fall from unidentified vehicles.",
          "It pays for bodily injury within the compulsory-insurance limits — currently up to 150 million won for death or permanent disability and up to 30 million won for injury — and the government later recovers the money from the at-fault driver if found. It does not pay for vehicle damage.",
          "1. Report the accident to the police (112) immediately — a police accident report is mandatory for this claim.",
          "2. Get treated and keep every document: medical certificate (진단서), treatment receipts, and the police-issued accident confirmation.",
          "3. File the claim with the Traffic Accident Compensation Supervisory Service (자동차손해배상진흥원, TACSS), which has handled all claims under this program since January 2023 — call 1544-0049 (press 1) or apply through its website (tacss.or.kr). Claims are no longer filed through individual insurance companies.",
          "4. Do not wait for the driver to be caught — the claim deadline is 3 years from the accident."
        ]
      },
      {
        "title": "If You Are Injured: Same-Day Diagnosis and the 합의 (Settlement) Culture",
        "body": [
          "See a doctor on the day of the accident even if you feel fine, and get a medical certificate (진단서) stating your diagnosis and expected treatment period. Whiplash and soft-tissue injuries often appear a day or two later, and a late first visit makes it much harder to link the injury to the accident.",
          "Injury claims in Korea usually end in a 합의 — a lump-sum settlement with the at-fault driver's insurer covering treatment, lost income, and compensation. There is no need to rush: you may continue treatment first, and once you sign, the settlement is generally final. If the insurer's first offer feels premature, it is normal to decline and keep treating.",
          "There is also a criminal dimension. Under the Act on Special Cases Concerning the Settlement of Traffic Accidents, an insured driver who injures someone through ordinary negligence is generally not prosecuted if covered by comprehensive insurance or after a settlement — but this protection does not apply to serious violations such as drunk driving, running a red light, or hit-and-run.",
          "Foreigner-specific tips: your visa status does not prevent you from receiving treatment or claiming against the driver's insurer, and hospitals will accept a passport or Alien Registration Card as ID. If you are a short-term visitor leaving Korea soon, tell the insurer early and collect all records (medical certificate, receipts, police accident confirmation) before departure, since handling a claim from abroad is slower."
        ]
      }
    ]
  },
  "natural-disaster": {
    "intro": "If your phone suddenly blares a siren and shows a wall of Korean text, that is Korea's cell broadcast disaster alert (재난문자) — and it may be telling you to evacuate. This guide explains what the three alert levels mean, how to receive the same alerts in English through the government's Emergency Ready App, and what to actually do when a typhoon, flood, or earthquake hits. Everything here is based on official Ministry of the Interior and Safety (MOIS) guidance and documented disaster cases in Korea.",
    "sections": [
      {
        "title": "Those Loud Korean Phone Alerts: What They Mean and How to Get Them in English",
        "body": [
          "Korea pushes disaster alerts to every phone in an affected area via cell broadcast (CBS) — no app or SIM registration needed, which is why tourists get them too. There are three tiers, and the tier tells you how seriously to react. Since early 2024, the more urgent alerts have also begun to include a short English keyword for the disaster type (and magnitude for earthquakes), but the body of the message is still in Korean.",
          "To get full alerts in English, install the free Emergency Ready App by the Ministry of the Interior and Safety — it is the foreigner-facing version of the Korean 안전디딤돌 (Safety Stepping Stone) app, available on Google Play and the App Store. It delivers translated emergency alerts in 22 languages (expanded in June 2026 from the original five: English, Chinese, Japanese, Vietnamese, and Thai), a shelter locator, embassy contacts, and offline disaster behavior guides. Set your region in the app so you receive alerts for where you actually live.",
          "If you need a human, Seoul's 120 Dasan Call Center offers foreign-language help: dial 02-120, then 9, then 1 for English (weekdays 09:00–18:00; Chinese, Japanese, Vietnamese, and Mongolian also available). The Danuri helpline (1577-1366) supports 13 languages for migrants, and for a life-threatening emergency call 119 and say \"English\" first — the dispatcher will patch in an interpreter, so stay on the line even if there is a short silence.",
          "Rough reading guide for an alert you cannot translate in time: 대피 means evacuate, 침수 means flooding, 지진 means earthquake, 태풍 means typhoon, and 호우 means heavy rain. If the alert arrived with the loudest siren tone and your area is under heavy rain, assume it is an evacuation instruction and move away from low-lying and underground spaces first, then translate."
        ],
        "table": {
          "headers": [
            "Korean name",
            "Level",
            "Sound / opt-out",
            "Typical use"
          ],
          "rows": [
            [
              "위급재난문자 (wigeup)",
              "Emergency — highest",
              "Loud siren (60dB+); cannot be blocked",
              "Air-raid warnings, wartime situations, the most severe earthquakes"
            ],
            [
              "긴급재난문자 (gingeup)",
              "Urgent",
              "Loud alert tone; can be disabled in settings",
              "Evacuation-level events: typhoon, flooding, wildfire"
            ],
            [
              "안전안내문자 (anjeon annae)",
              "Safety advisory",
              "Normal notification sound; can be disabled",
              "Heat waves, fine dust, weather advisories, missing persons"
            ]
          ]
        }
      },
      {
        "title": "Typhoon and Heavy Rain Playbook",
        "body": [
          "1. Stay out of underground spaces when heavy rain is falling or forecast. This is the single most important rule in Korea: in August 2022, people died when their semi-basement (반지하) homes in Seoul flooded, and a month later seven people drowned in an apartment's underground parking garage in Pohang during Typhoon Hinnamnor — most were trying to move their cars. If rain is intense, do not go down to move your car.",
          "2. Avoid riversides, streams, underpasses, and construction sites. Urban streams like those feeding the Han River rise extremely fast, and riverside parks and paths are closed during heavy rain — do not go for a run or to take photos. Stay clear of construction sites and old walls, which can collapse in strong wind and saturated ground.",
          "3. About taping windows: tests by Korea's National Disaster Management Research Institute found that the famous X-shape tape or wet newspaper on the glass does little to stop windows breaking. What works is stopping the window from rattling in its frame — lock the windows, wedge cardboard or sponge into gaps between the window and frame, and tape around the edges where glass meets frame. Then stay away from windows during the storm's peak.",
          "4. Before the storm: charge your phone and a power bank, check the Emergency Ready App for your nearest shelter, and stock a day or two of water and food. If authorities issue an evacuation alert for your neighborhood, leave early — evacuating in the dark through flooded streets is far more dangerous."
        ]
      },
      {
        "title": "Flood: The Ankle Rule and When to Abandon Your Car",
        "body": [
          "1. If you live in a basement or semi-basement and water starts coming in, evacuate the moment it reaches ankle height. Once water outside a door reaches roughly knee height, water pressure can make the door impossible to open from inside — this is how the 2022 Seoul semi-basement deaths happened. Do not stay to save belongings or pets if water is rising.",
          "2. Never drive into a flooded underpass or road where you cannot see the surface. If your car stalls in rising water, abandon it immediately and move to higher ground — a car is replaceable. If the door will not open against the water, escape through a window (buses in Korea are required to carry glass-breaking hammers, but most private cars are not — keep an escape hammer in your car in advance, or strike a corner of the side window with any hard metal object, such as the steel prongs of a removed headrest).",
          "3. On foot, avoid moving through floodwater: manhole covers can be dislodged and invisible underwater, and streetlight poles or exposed wiring can carry current. If you must move, use a stick to probe the ground ahead and walk along building walls away from the road's center."
        ]
      },
      {
        "title": "Earthquake: Drop, Cover, Hold On — Then Go to an Outdoor Evacuation Site",
        "body": [
          "1. When shaking starts, drop under a sturdy table, cover your head and neck, and hold on until the shaking stops. Do not run outside during the shaking — most injuries come from falling objects and broken glass. If you are in bed, stay there and cover your head with a pillow.",
          "2. After the shaking stops, turn off gas if you can do so quickly, open a door to secure an exit, and leave the building using the stairs — never the elevator. Once outside, keep away from building walls, signs, and glass facades, and move to a wide open area.",
          "3. Korea designates official earthquake outdoor evacuation sites (지진 옥외대피장소) — usually school playgrounds and parks chosen because nothing can fall on you there. Find your nearest one in advance on the Emergency Ready App or the National Disaster and Safety Portal (safekorea.go.kr); searching 지진대피소 in Naver Map or Kakao Map also works. For a prolonged displacement, authorities open indoor relief shelters (지진 실내구호소) separately.",
          "4. Expect aftershocks and follow alert messages rather than rumors. If you are on the east coast and feel a strong quake or receive a tsunami warning (지진해일), move immediately to high ground away from the shore."
        ]
      },
      {
        "title": "Finding Shelters Before You Need Them",
        "body": [
          "The Emergency Ready App has a shelter map that shows civil defense shelters, earthquake outdoor evacuation sites, and heat/cold shelters near your current location — open it once now, while you have signal and time, and learn the two or three sites nearest your home and workplace. The app's behavior guides work offline, which matters if networks are congested during a disaster.",
          "The same data is on the National Disaster and Safety Portal (safekorea.go.kr), and major Korean map apps (Naver Map, Kakao Map, TMAP) return official shelters when you search 지진대피소 (earthquake shelter) or 민방위대피소 (civil defense shelter). Civil defense shelters are typically subway stations and large building basements — good for air-raid alerts, but the wrong place in a flood; earthquake evacuation sites are open ground. Match the shelter type to the disaster."
        ]
      },
      {
        "title": "After the Disaster: Reporting Damage and Relief Support",
        "body": [
          "If your home or property is damaged by a storm or flood, report the damage to your local district office (시·군·구청 or 주민센터) promptly — under Korea's natural disaster recovery rules, damage reports are generally expected within about 10 days of the disaster's end. Take photos before cleaning up, and keep receipts for emergency repairs.",
          "Korea operates natural disaster relief payments (재난지원금) for verified damage such as flooded or destroyed housing, and government guidance for foreigners (GOV.KR) lists foreign residents who are victims of a natural disaster among those eligible for emergency welfare support. That said, eligibility and amounts for some relief programs can depend on registration and visa status, and rules change — ask your district office or the Danuri helpline (1577-1366) about your specific case rather than assuming either way.",
          "Note that Korea also sells a government-subsidized storm, flood and earthquake insurance (풍수해·지진재해보험, renamed from 풍수해보험 in 2024) for housing and small businesses; if you own or run property here, it is worth asking about, since insured damage is generally compensated through the policy instead of the relief payment."
        ]
      }
    ]
  }
};
