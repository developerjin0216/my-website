// 급여 공제 계산 (2026년 요율 기준 — 변경 시 이 상수만 수정)
// 실수령액 계산기 페이지와 서버 렌더링 예시 표(src/data/calculators.ts)에서 공유합니다.
// 출처: 보건복지부 고시 — 국민연금 총 9.5%(연금개혁, 2033년 13%까지 매년 0.5%p 인상),
// 건강보험 7.19%, 장기요양 0.9448%(건보료 대비 13.14%)

export const NP_RATE = 0.0475; // 국민연금 (근로자 부담)
export const NP_CAP = 6_590_000; // 기준소득월액 상한 (2026.7~2027.6)
export const NP_FLOOR = 410_000; // 기준소득월액 하한
export const HI_RATE = 0.03595; // 건강보험 (근로자 부담, 총 7.19%)
export const LTC_RATE = 0.1314; // 장기요양 (건강보험료 대비)
export const EI_RATE = 0.009; // 고용보험

const floor10 = (n: number) => Math.floor(n / 10) * 10;

function earnedIncomeDeduction(g: number): number {
  let d: number;
  if (g <= 5_000_000) d = g * 0.7;
  else if (g <= 15_000_000) d = 3_500_000 + (g - 5_000_000) * 0.4;
  else if (g <= 45_000_000) d = 7_500_000 + (g - 15_000_000) * 0.15;
  else if (g <= 100_000_000) d = 12_000_000 + (g - 45_000_000) * 0.05;
  else d = 14_750_000 + (g - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000);
}

const BRACKETS: [number, number, number][] = [
  [14_000_000, 0.06, 0],
  [50_000_000, 0.15, 1_260_000],
  [88_000_000, 0.24, 5_760_000],
  [150_000_000, 0.35, 15_440_000],
  [300_000_000, 0.38, 19_940_000],
  [500_000_000, 0.4, 25_940_000],
  [1_000_000_000, 0.42, 35_940_000],
  [Infinity, 0.45, 65_940_000],
];

function progressiveTax(base: number): number {
  for (const [max, rate, sub] of BRACKETS) {
    if (base <= max) return base * rate - sub;
  }
  return 0;
}

function taxCreditCap(gross: number): number {
  if (gross <= 33_000_000) return 740_000;
  if (gross <= 70_000_000)
    return Math.max(660_000, 740_000 - (gross - 33_000_000) * 0.008);
  if (gross <= 120_000_000)
    return Math.max(500_000, 660_000 - (gross - 70_000_000) * 0.5);
  return Math.max(200_000, 500_000 - (gross - 120_000_000) * 0.5);
}

function childTaxCredit(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 250_000;
  return 550_000 + (n - 2) * 400_000;
}

function annualIncomeTax(
  grossTaxable: number,
  family: number,
  children: number,
  npAnnual: number
): number {
  const base =
    grossTaxable -
    earnedIncomeDeduction(grossTaxable) -
    family * 1_500_000 -
    npAnnual;
  if (base <= 0) return 0;
  const calc = progressiveTax(base);
  let credit =
    calc <= 1_300_000 ? calc * 0.55 : 715_000 + (calc - 1_300_000) * 0.3;
  credit = Math.min(credit, taxCreditCap(grossTaxable));
  return Math.max(0, calc - credit - childTaxCredit(children));
}

export interface SalaryDeductions {
  np: number; // 국민연금
  hi: number; // 건강보험
  ltc: number; // 장기요양
  ei: number; // 고용보험
  incomeTax: number; // 소득세
  localTax: number; // 지방소득세
  total: number; // 공제 합계
  net: number; // 월 실수령액
}

export function calcMonthlyDeductions(
  monthlyGross: number,
  taxFreeMonthly: number,
  family: number,
  children: number
): SalaryDeductions {
  const taxFreeM = Math.min(taxFreeMonthly, monthlyGross);
  const taxableM = Math.max(0, monthlyGross - taxFreeM);
  const familyN = Math.max(1, family);
  const childrenN = Math.max(0, children);

  const np = floor10(Math.min(Math.max(taxableM, NP_FLOOR), NP_CAP) * NP_RATE);
  const hi = floor10(taxableM * HI_RATE);
  const ltc = floor10(hi * LTC_RATE);
  const ei = floor10(taxableM * EI_RATE);
  const incomeTax = floor10(
    annualIncomeTax(taxableM * 12, familyN, childrenN, np * 12) / 12
  );
  const localTax = floor10(incomeTax * 0.1);

  const total = np + hi + ltc + ei + incomeTax + localTax;
  return { np, hi, ltc, ei, incomeTax, localTax, total, net: monthlyGross - total };
}
