// 기준 중위소득 — 보건복지부 장관이 매년 고시하는 값.
//
// 이 숫자는 기초생활보장·차상위·각종 바우처의 수급 판정에 그대로 쓰입니다.
// 틀리면 사람이 "나는 대상이 아니구나" 하고 신청을 포기하는 실제 손해가 납니다.
// 그래서 여기에는 **정책 해석을 넣지 않습니다.** 계산기는 고시된 중위소득에
// 비율을 곱하는 산수만 하고, 실제 수급 여부는 공식 기관에서 확인하도록 안내합니다.
//
// 출처: 보건복지부 고시(중앙생활보장위원회 의결). 값 갱신 시 REVIEWED도 함께 올릴 것.
// 교차 확인 권장: 복지로(bokjiro.go.kr) → 복지서비스 모의계산

/** 이 표를 마지막으로 확인한 날 */
export const MEDIAN_INCOME_REVIEWED = "2026-09-22";

export const MEDIAN_INCOME_YEARS = [2026, 2025, 2024, 2023] as const;
export type MedianIncomeYear = (typeof MEDIAN_INCOME_YEARS)[number];

/** 연도 → 가구원수(1~6인) 월 기준 중위소득(원) */
export const MEDIAN_INCOME: Record<MedianIncomeYear, number[]> = {
  2026: [2_564_238, 4_199_292, 5_359_036, 6_494_738, 7_556_719, 8_555_952],
  2025: [2_392_013, 3_932_658, 5_025_353, 6_097_773, 7_108_192, 8_064_805],
  2024: [2_228_445, 3_682_609, 4_714_657, 5_729_913, 6_695_735, 7_618_369],
  2023: [2_077_892, 3_456_155, 4_434_816, 5_400_964, 6_330_688, 7_227_981],
};

export const MAX_TABLE_SIZE = 6;

// 7인 이상은 고시에 표로 나오지 않고 "6인 가구 기준에 1인 증가당 일정액을 더한다"는
// 방식으로 정해집니다. 그 증가액은 5인→6인 차액을 쓰는 것이 관행입니다.
// 추정값이므로 화면에서 반드시 '추정'이라고 표시해야 합니다.
export function medianIncome(
  year: MedianIncomeYear,
  household: number
): { amount: number; estimated: boolean } {
  const table = MEDIAN_INCOME[year];
  if (household <= MAX_TABLE_SIZE) {
    return { amount: table[household - 1], estimated: false };
  }
  const step = table[MAX_TABLE_SIZE - 1] - table[MAX_TABLE_SIZE - 2];
  return {
    amount: table[MAX_TABLE_SIZE - 1] + step * (household - MAX_TABLE_SIZE),
    estimated: true,
  };
}

/** 자주 찾는 비율 — 복지 제도들이 이 구간을 기준선으로 씁니다 */
export const COMMON_RATES = [30, 32, 40, 47, 48, 50, 60, 70, 75, 80, 100, 120, 150, 180, 200];

export function atRate(base: number, ratePercent: number): number {
  // 고시 금액은 원 단위 정수라 반올림해 맞춥니다
  return Math.round((base * ratePercent) / 100);
}

export const won = (n: number) => n.toLocaleString("ko-KR");
