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

/** 콘텐츠 영역별 최종 점검일 — 화면의 "최종 점검 / 요율 기준"과 JSON-LD dateModified 에 쓰입니다.
 *
 *  두 가지 의미가 섞여 있어서 값마다 어느 쪽인지 적어 둡니다.
 *  - 데이터 파일이 마지막으로 바뀐 날: git log -1 --format=%ad --date=short -- <파일>
 *  - 요율의 기준일: 그 숫자를 마지막으로 공식 출처와 대조한 날(파일이 안 바뀌어도 바뀝니다)
 *  화면에 보이는 날짜는 사용자가 "내 숫자가 최신인가"를 판단하는 근거라서,
 *  확인하지 않은 날짜로 앞당기지 마세요.
 */
export const REVIEWED = {
  calculators: "2026-11-11", // src/data/calculators.ts
  // 4대보험 요율·국민연금 상하한을 2026-11-20 에 공식 출처와 다시 맞춰 봤습니다.
  //   4insure.or.kr(4대사회보험 정보연계센터) — 국민연금 9.5%(근로자 4.75%),
  //   건강보험 7.19%(3.595%), 장기요양 0.9448%(건보료의 13.14%), 고용보험 실업급여 1.8%(0.9%)
  //   기준소득월액 2026.7~2027.6 하한 41만 / 상한 659만
  //   nhis.or.kr 2026년도 보험료율 인상 안내 — 7.19%·0.9448% 동일
  //   값은 하나도 바뀌지 않았습니다(7월 값이 그대로 2026년 값).
  //   이 날짜에 다시 보지 않은 것: 소득세 누진세율·세액공제 한도(간이세액표 근사).
  //   요율이 아닌 세금 표라 적용 연도가 바뀌는 2027년 초에 따로 확인해야 합니다.
  salaryRates: "2026-11-20", // src/utils/salary.ts (4대보험·세율)
  // 2026-11-20 확인: 한국전력 2026년 4분기(10~12월) 요금 동결 발표(9/21) 기준으로
  // 기본요금 910·1,600·7,300원, 전력량요금 120.0·214.6·307.3원, 고압 730·1,260·6,060원 /
  // 105.0·174.0·242.3원, 슈퍼유저 736.2·601.3원, 기후환경 9.0원, 연료비조정 +5.0원,
  // 기금 2.7% 를 대조했습니다. 값 변경 없음.
  electricityRates: "2026-11-20", // src/utils/electricity.ts (전기요금)
  cardDeduction: "2026-10-15", // src/utils/cardDeduction.ts — 국회예산정책처 2025 개정세법 보고서와 대조
  tools: "2026-11-18", // src/data/tools.ts — 11-17~18 에 도구 11개 설명을 코드 근거로 보강
  help: "2026-11-18", // src/data/help.ts
  // about·contact·privacy·terms 를 실제 서비스 기준으로 다시 쓴 날(2026-11-18).
  // 사이트맵 lastmod 로 씁니다 — 이 네 페이지는 지금까지 날짜가 아예 없었습니다.
  trustPages: "2026-11-18",
} as const;

// 가이드는 이 표에 없습니다. 글마다 발행일·수정일이 달라서(6편이 서로 다른 날짜에
// 생겼고 11-18 에 출처 블록을 함께 손봤습니다) data/guides.ts 가 각 글의
// date(발행)·updated(최종 수정)·rateAsOf(요율 기준일)를 직접 갖습니다.
// 예전에 있던 REVIEWED.guides 는 아무도 읽지 않는 채 7월 날짜로 남아 있었습니다.

/** 운영자를 확인할 수 있는 외부 프로필 — 구조화 데이터 sameAs.
 *
 * 애드센스·검색엔진은 "이 사이트를 누가 쓰는가"를 사이트 밖에서도 확인하려 합니다.
 * 개인 운영 사이트에서 확인 가능한 것은 이 두 주소이고, 둘 다 실제로 운영자가 쓰는
 * 곳입니다(블로그·GitHub). 없는 프로필을 지어내지 마세요.
 */
export const AUTHOR_SAMEAS = [
  "https://developerjin.tistory.com",
  "https://github.com/developerjin0216",
];

/** 검증 절차 — /about 본문과 구조화 데이터가 같은 원칙을 말하게 한 곳에 둡니다.
 *
 * 1350·1332 같은 번호는 이 사이트가 실제로 안내하는 상담 창구입니다. 번호가
 * 바뀌면 한 곳만 고치면 됩니다. */
export const VERIFICATION_POLICY =
  "공공기관·법령 원문을 먼저 확인하고, 1350(고용노동부)·1332(금융감독원)·국세청 등 소관 기관의 안내와 대조한 뒤 씁니다. 확인되지 않은 수치는 싣지 않으며, 이 사이트의 글은 법률·의료·세무 자문이 아닙니다.";

/** 모든 페이지가 공유하는 발행 주체 */
export const publisher = {
  "@type": "Organization" as const,
  name: INFO_SITE_NAME,
  url: ROOT_URL,
  email: CONTACT_EMAIL,
  sameAs: AUTHOR_SAMEAS,
  // 편집·검증 원칙을 밝힌 페이지 — CreativeWork/Organization 공통 속성
  publishingPrinciples: `${ROOT_URL}/about`,
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
          "급할 때 필요한 전화번호와 상황별 대처법, 실업급여·퇴직금 같은 생활 계산기를 제공하는 개인 운영 생활정보 사이트입니다.",
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
    author: {
      "@type": "Organization" as const,
      name: INFO_SITE_NAME,
      url: ROOT_URL,
      sameAs: AUTHOR_SAMEAS,
    },
    publisher: { "@id": `${ROOT_URL}/#organization` },
    dateModified,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    // 어떤 원칙으로 검증했는지 — 문장을 구조화 데이터에도 넣습니다
    publishingPrinciples: `${ROOT_URL}/about`,
  };
}

export interface SourceLink {
  name: string;
  url: string;
}

/** 계산기별 근거 기관 — 실제 소관 기관만 적습니다 */
export const CALC_SOURCES: Record<string, SourceLink[]> = {
  "card-deduction": [
    { name: "국세청 — 근로소득 연말정산 종합안내", url: "https://www.nts.go.kr" },
    { name: "홈택스 — 연말정산 미리보기", url: "https://www.hometax.go.kr" },
    {
      name: "국회예산정책처 — 2025년 개정세법 심의 결과 및 주요 내용 (적용기한 연장·자녀 수별 한도)",
      url: "https://www.nabo.go.kr/board/file/bulkDown.do?idx=9022&bid=19",
    },
  ],
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
  "card-deduction": REVIEWED.cardDeduction,
};

export function calcReviewedDate(id: string): string {
  return RATE_BASED[id] ?? REVIEWED.calculators;
}
