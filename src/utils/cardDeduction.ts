// 신용카드 등 사용금액 소득공제 — '최저사용금액(총급여 25%)'과 결제수단 전략만 계산합니다.
//
// 환급액까지 계산하지 않는 이유:
// 공제 한도는 기본 한도 외에 전통시장·대중교통·문화비 추가 한도가 붙는데, 조사해 본
// 2차 출처들이 서로 다른 금액을 적고 있었습니다(전통시장 100만+도서공연 100만이라는 곳,
// 총급여 7천 이하 300만이라는 곳). 법령 원문(조세특례제한법 제126조의2)은 law.go.kr이
// JS로 그려져 받아오지 못했습니다. 확인되지 않은 한도로 환급액을 내면 사람이 그 숫자를
// 믿고 소비 계획을 세웁니다. 그래서 여기서는 '공제 대상 금액'까지만 내고, 금액 확정은
// 홈택스 연말정산 미리보기로 넘깁니다.
//
// 아래 상수는 조사한 출처 전부가 일치한 항목만 담았습니다. 한 곳이라도 다르게 적은
// 값은 넣지 않았습니다.
//   · 최저사용금액 = 총급여액의 25%
//   · 공제율 신용카드 15% / 체크·직불·선불·현금영수증 30% / 전통시장·대중교통 40%
//   · 최저사용금액은 공제율이 낮은 결제수단부터 차감 (신용카드 → 체크·현금 → 전통시장·대중교통)
// 확인일 2026-10-08. 매년 세법 개정으로 바뀌므로 귀속연도 공식 안내와 함께 보세요.

export const THRESHOLD_RATE = 0.25;

export type PayKind = "credit" | "check" | "market" | "transit";

/** 공제율 — 낮은 순서대로 둡니다. 최저사용금액 차감 순서가 이 순서입니다. */
export const DEDUCTION_RATES: { kind: PayKind; label: string; rate: number }[] = [
  { kind: "credit", label: "신용카드", rate: 0.15 },
  { kind: "check", label: "체크·현금영수증", rate: 0.3 },
  { kind: "market", label: "전통시장", rate: 0.4 },
  { kind: "transit", label: "대중교통", rate: 0.4 },
];

export type Spend = Record<PayKind, number>;

export interface CardResult {
  /** 총급여 × 25% */
  threshold: number;
  /** 지금까지 쓴 금액 합계 */
  total: number;
  /** 문턱까지 남은 금액 (넘었으면 0) */
  remaining: number;
  /** 문턱을 넘었는지 */
  passed: boolean;
  /** 결제수단별 공제 대상이 된 금액과 그 공제액 */
  breakdown: {
    kind: PayKind;
    label: string;
    rate: number;
    spent: number;
    /** 최저사용금액 차감 후 공제 대상으로 남은 금액 */
    counted: number;
    /** counted × rate */
    deduction: number;
  }[];
  /** 공제 대상 금액 합계 (한도 적용 전) */
  deductionBeforeLimit: number;
  /** 지금부터 1만원 더 쓸 때 공제가 가장 많이 늘어나는 수단 */
  bestNext: { kind: PayKind; label: string; perManwon: number };
}

/**
 * 최저사용금액은 공제율이 낮은 결제수단부터 차감합니다. 그래서 신용카드로 문턱을
 * 채우고 그 뒤를 체크카드로 쓰는 쪽이 유리합니다 — 실제 결제 순서와는 무관하게
 * 연말에 이 순서로 계산되기 때문입니다.
 */
export function calcCardDeduction(grossPay: number, spend: Spend): CardResult {
  const threshold = Math.floor(grossPay * THRESHOLD_RATE);
  const total = DEDUCTION_RATES.reduce((n, r) => n + (spend[r.kind] || 0), 0);

  let left = threshold;
  const breakdown = DEDUCTION_RATES.map((r) => {
    const spent = spend[r.kind] || 0;
    const absorbed = Math.min(spent, left);
    left -= absorbed;
    const counted = spent - absorbed;
    return {
      kind: r.kind,
      label: r.label,
      rate: r.rate,
      spent,
      counted,
      deduction: Math.floor(counted * r.rate),
    };
  });

  const passed = total >= threshold;
  // 문턱을 넘기 전에는 어떤 수단으로 써도 공제가 0이라, 혜택이 좋은 신용카드가 낫습니다.
  // 넘은 뒤에는 공제율이 가장 높은 수단이 유리합니다.
  const best = passed
    ? [...DEDUCTION_RATES].sort((a, b) => b.rate - a.rate)[0]
    : DEDUCTION_RATES[0];

  return {
    threshold,
    total,
    remaining: Math.max(0, threshold - total),
    passed,
    breakdown,
    deductionBeforeLimit: breakdown.reduce((n, b) => n + b.deduction, 0),
    bestNext: {
      kind: best.kind,
      label: best.label,
      perManwon: passed ? Math.floor(10_000 * best.rate) : 0,
    },
  };
}

export const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

/** 만원 단위로 읽기 쉽게 — 큰 금액은 '1,250만원'이 '12,500,000원'보다 빨리 읽힙니다 */
export function manwon(n: number): string {
  if (n === 0) return "0원";
  if (n % 10_000 === 0 && n >= 10_000)
    return `${(n / 10_000).toLocaleString("ko-KR")}만원`;
  return won(n);
}
