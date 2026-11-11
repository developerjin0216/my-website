// 기준 중위소득 — 보건복지부 장관이 매년 고시하는 값.
//
// 이 숫자는 기초생활보장·차상위·각종 바우처의 수급 판정에 그대로 쓰입니다.
// 틀리면 사람이 "나는 대상이 아니구나" 하고 신청을 포기하는 실제 손해가 납니다.
// 그래서 여기에는 **정책 해석을 넣지 않습니다.** 계산기는 고시된 중위소득에
// 비율을 곱하는 산수만 하고, 실제 수급 여부는 공식 기관에서 확인하도록 안내합니다.
//
// 출처: 보건복지부 고시(중앙생활보장위원회 의결). 값 갱신 시 REVIEWED도 함께 올릴 것.
//
// 2026년 값 교차 확인(2026-09-22): 정책브리핑(korea.kr) 2027년 예산안 기사에
// "4인 가구 생계급여 월 207만 8천 원(인상 전)"이 나오는데, 생계급여는 기준
// 중위소득의 32%다. 6,494,738 × 0.32 = 2,078,316 으로 기사 금액과 일치한다.
// 같은 기사의 2027년 생계급여 221만 7천 원도 6.7% 인상분으로 계산하면 맞는다.
//
// 2027년 값과 7인 열 확인(2026-11-11): 보건복지부 누리집 기준 중위소득 표
// (mohw.go.kr menu.es?mid=a10708010900)에 2021~2027년, 1~7인 가구 금액이 그대로 나온다.
// 아래 표는 그 숫자를 옮긴 것이다. 교차 확인 두 가지:
//  - 2027년은 1~7인 모두 2026년 대비 정확히 6.70% 인상 (각 칸 × 1.067 이 원 단위로 일치).
//  - 4인 2027 × 0.32 = 2,217,563 → 위 정책브리핑 기사의 "생계급여 221만 7천 원"과 일치.
// 9월에는 인상률만 확인돼 PENDING_YEAR 로 두고 추정치를 넣지 않았다. 그 판단은 그대로
// 유지한다 — 다음 해 표가 고시되기 전에는 인상률을 곱해 넣지 않는다.
//
// **7인 가구도 고시표에 있다.** 2026-11-11 이전 코드는 "고시표는 6인까지, 7인 이상은
// 5인→6인 차액을 더한 추정"이라고 적고 그렇게 계산했는데, 틀린 전제였다. 2026년 7인
// 고시액은 9,515,150원인데 옛 추정식은 9,555,185원을 냈다. 근거: 위 표, 그리고
// 보건복지부 수급자선정기준 안내의 2026 생계급여 예시 "8인가구 3,351,791원 = 3,044,848원
// (7인기준) + 306,943원 (7인기준 – 6인기준)" — 3,044,848 ÷ 0.32 = 9,515,150.

/** 이 표를 마지막으로 확인한 날 */
export const MEDIAN_INCOME_REVIEWED = "2026-11-11";

/** 인상률만 발표되고 가구원수별 고시액이 아직 없는 해. 없으면 null.
 *  다음 해 인상률이 7월 말에 먼저 보도되면 여기에 { year, raisePercent } 로 적습니다. */
export const PENDING_YEAR: { year: number; raisePercent: number } | null = null;

export const MEDIAN_INCOME_YEARS = [2027, 2026, 2025, 2024, 2023] as const;
export type MedianIncomeYear = (typeof MEDIAN_INCOME_YEARS)[number];

/** 연도 → 가구원수(1~6인) 월 기준 중위소득(원) */
export const MEDIAN_INCOME: Record<MedianIncomeYear, number[]> = {
  2027: [2_736_042, 4_480_645, 5_718_091, 6_929_885, 8_063_019, 9_129_201, 10_152_665],
  2026: [2_564_238, 4_199_292, 5_359_036, 6_494_738, 7_556_719, 8_555_952, 9_515_150],
  2025: [2_392_013, 3_932_658, 5_025_353, 6_097_773, 7_108_192, 8_064_805, 8_988_428],
  2024: [2_228_445, 3_682_609, 4_714_657, 5_729_913, 6_695_735, 7_618_369, 8_514_994],
  2023: [2_077_892, 3_456_155, 4_434_816, 5_400_964, 6_330_688, 7_227_981, 8_107_515],
};

/** 고시표에 금액이 직접 나오는 최대 가구원 수 */
export const MAX_TABLE_SIZE = 7;

/** 새 기준은 매년 1월 1일(KST)부터 적용됩니다. 지금 적용 중인 해를 돌려줍니다 —
 *  표에 있는 해 중 현재 연도 이하로 가장 최근 해. */
export function yearInEffect(nowMs: number): MedianIncomeYear {
  const kstYear = new Date(nowMs + 9 * 3_600_000).getUTCFullYear();
  const y = MEDIAN_INCOME_YEARS.find((v) => v <= kstYear);
  return y ?? MEDIAN_INCOME_YEARS[MEDIAN_INCOME_YEARS.length - 1];
}

/** 서버 HTML 의 기본 선택 연도 — 마운트 뒤 yearInEffect(Date.now()) 로 바뀝니다.
 *  1월에 재배포할 때 올리면 첫 화면도 맞습니다. */
export const SSR_DEFAULT_YEAR: MedianIncomeYear = 2026;

// 8인 이상은 고시가 정한 산식입니다 — "1인 증가시마다 7인가구 기준과 6인가구 기준의
// 차이를 7인가구 기준에 더하여 산정" (보건복지부 수급자선정기준, LH 주거급여 안내).
// 추정이 아니라 고시 산식이므로 화면에는 '산식으로 계산'이라고만 밝힙니다.
export function medianIncome(
  year: MedianIncomeYear,
  household: number
): { amount: number; byFormula: boolean; step: number } {
  const table = MEDIAN_INCOME[year];
  const step = table[MAX_TABLE_SIZE - 1] - table[MAX_TABLE_SIZE - 2];
  if (household <= MAX_TABLE_SIZE) {
    return { amount: table[household - 1], byFormula: false, step };
  }
  return {
    amount: table[MAX_TABLE_SIZE - 1] + step * (household - MAX_TABLE_SIZE),
    byFormula: true,
    step,
  };
}

// 모듈 로드 시 검증 — 표가 어긋나면 빌드가 실패합니다.
for (const y of MEDIAN_INCOME_YEARS) {
  const row = MEDIAN_INCOME[y];
  if (row.length !== MAX_TABLE_SIZE) throw new Error(`기준 중위소득 ${y}년 표가 ${row.length}칸 (${MAX_TABLE_SIZE}칸이어야 함)`);
  for (let i = 1; i < row.length; i++) {
    if (!(row[i] > row[i - 1])) throw new Error(`기준 중위소득 ${y}년 ${i + 1}인 금액이 ${i}인 이하`);
  }
}

/** 자주 찾는 비율 — 복지 제도들이 이 구간을 기준선으로 씁니다 */
export const COMMON_RATES = [30, 32, 40, 47, 48, 50, 60, 70, 75, 80, 100, 120, 150, 180, 200];

export function atRate(base: number, ratePercent: number): number {
  // 고시 금액은 원 단위 정수라 반올림해 맞춥니다
  return Math.round((base * ratePercent) / 100);
}

export const won = (n: number) => n.toLocaleString("ko-KR");
