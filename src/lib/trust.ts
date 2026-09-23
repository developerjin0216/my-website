// 사이트 신뢰 신호(E-E-A-T) 공용 소스.
//
// 왜 필요한가: help 페이지 27개만 author·publisher·dateModified·출처를 갖추고
// 있었고, 계산기 20개·도구 12개·밈 96개는 발행 주체가 누구인지도 드러나지
// 않았습니다. 병원비·퇴직금·전세처럼 돈과 생활에 직결되는 주제를 다루면서
// 근거와 책임 주체가 없으면 검색엔진이 색인을 미룹니다.
//
// 날짜는 지어내지 않습니다. 각 콘텐츠 데이터 파일이 실제로 마지막으로 바뀐
// 날(git 기준)을 씁니다. 요율을 갱신하면 이 상수도 함께 올려야 합니다.

import { CONTACT_EMAIL, INFO_SITE_NAME, ROOT_URL } from "@/lib/site";

/** 콘텐츠 영역별 최종 점검일 — 데이터 파일이 마지막으로 갱신된 날 */
export const REVIEWED = {
  calculators: "2026-08-11", // src/data/calculators.ts
  salaryRates: "2026-07-28", // src/utils/salary.ts (4대보험·세율)
  electricityRates: "2026-07-21", // src/utils/electricity.ts (전기요금)
  tools: "2026-08-20", // src/data/tools.ts
  guides: "2026-07-29", // src/data/guides.ts
} as const;

/** 모든 페이지가 공유하는 발행 주체 */
export const publisher = {
  "@type": "Organization" as const,
  name: INFO_SITE_NAME,
  url: ROOT_URL,
  email: CONTACT_EMAIL,
  logo: {
    "@type": "ImageObject" as const,
    url: `${ROOT_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
};

/** 루트 레이아웃에서 전 페이지에 싣는 조직·사이트 스키마 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...publisher,
        "@id": `${ROOT_URL}/#organization`,
        description:
          "급할 때 필요한 전화번호와 대처법, 생활 계산기, 상식 퀴즈를 제공하는 개인 운영 생활정보 사이트입니다.",
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          contactType: "customer support",
          availableLanguage: ["ko", "en"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${ROOT_URL}/#website`,
        url: ROOT_URL,
        name: INFO_SITE_NAME,
        inLanguage: "ko-KR",
        publisher: { "@id": `${ROOT_URL}/#organization` },
      },
    ],
  };
}

/** 계산기·도구·가이드 스키마에 공통으로 붙이는 저작·발행 정보 */
export function authorship(dateModified: string) {
  return {
    author: { "@type": "Organization" as const, name: INFO_SITE_NAME, url: ROOT_URL },
    publisher: { "@id": `${ROOT_URL}/#organization` },
    dateModified,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
  };
}

export interface SourceLink {
  name: string;
  url: string;
}

/** 계산기별 근거 기관 — 실제 소관 기관만 적습니다 */
export const CALC_SOURCES: Record<string, SourceLink[]> = {
  salary: [
    { name: "국민연금공단 — 연금보험료", url: "https://www.nps.or.kr" },
    { name: "국민건강보험공단 — 보험료율", url: "https://www.nhis.or.kr" },
    { name: "국세청 — 근로소득 간이세액표", url: "https://www.nts.go.kr" },
  ],
  "minimum-wage": [
    { name: "최저임금위원회", url: "https://www.minimumwage.go.kr" },
    { name: "고용노동부", url: "https://www.moel.go.kr" },
  ],
  severance: [{ name: "고용노동부 — 퇴직금 제도", url: "https://www.moel.go.kr" }],
  unemployment: [
    { name: "고용24 — 실업급여", url: "https://www.work24.go.kr" },
    { name: "고용노동부", url: "https://www.moel.go.kr" },
  ],
  "annual-leave": [{ name: "고용노동부 — 연차유급휴가", url: "https://www.moel.go.kr" }],
  "overtime-pay": [{ name: "고용노동부 — 연장·야간·휴일근로", url: "https://www.moel.go.kr" }],
  loan: [
    { name: "금융감독원 금융상품통합비교공시", url: "https://finlife.fss.or.kr" },
  ],
  savings: [
    { name: "금융감독원 금융상품통합비교공시", url: "https://finlife.fss.or.kr" },
  ],
  "prepayment-fee": [{ name: "금융감독원", url: "https://www.fss.or.kr" }],
  "youth-loan": [{ name: "주택도시기금", url: "https://nhuf.molit.go.kr" }],
  "jeonse-fee": [{ name: "국토교통부", url: "https://www.molit.go.kr" }],
  "rent-conversion": [
    { name: "국토교통부 — 전월세전환율", url: "https://www.molit.go.kr" },
  ],
  electricity: [{ name: "한국전력공사 — 전기요금표", url: "https://cyber.kepco.co.kr" }],
  aircon: [{ name: "한국전력공사 — 전기요금표", url: "https://cyber.kepco.co.kr" }],
  exchange: [{ name: "한국수출입은행 — 환율", url: "https://www.koreaexim.go.kr" }],
  bmi: [{ name: "질병관리청 국가건강정보포털", url: "https://health.kdca.go.kr" }],
  calorie: [{ name: "질병관리청 국가건강정보포털", url: "https://health.kdca.go.kr" }],
  "car-tax": [
    { name: "위택스 — 자동차세", url: "https://www.wetax.go.kr" },
    { name: "행정안전부", url: "https://www.mois.go.kr" },
  ],
  "freelancer-tax": [{ name: "국세청 — 원천징수", url: "https://www.nts.go.kr" }],
  "median-income": [
    { name: "보건복지부 — 기준 중위소득 고시", url: "https://www.mohw.go.kr" },
    { name: "복지로 — 복지서비스 모의계산", url: "https://www.bokjiro.go.kr" },
  ],
};

/** 요율이 바뀌면 값이 달라지는 계산기 — 기준일을 함께 표기합니다 */
export const RATE_BASED: Record<string, string> = {
  salary: REVIEWED.salaryRates,
  "minimum-wage": REVIEWED.calculators,
  severance: REVIEWED.salaryRates,
  unemployment: REVIEWED.calculators,
  "freelancer-tax": REVIEWED.salaryRates,
  electricity: REVIEWED.electricityRates,
  aircon: REVIEWED.electricityRates,
  "car-tax": REVIEWED.calculators,
};

export function calcReviewedDate(id: string): string {
  return RATE_BASED[id] ?? REVIEWED.calculators;
}
