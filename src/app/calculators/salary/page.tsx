"use client";

import { useState } from "react";
import {
  Card,
  Field,
  NumInput,
  Segmented,
  BigResult,
  ResultRow,
  Notice,
  won,
} from "@/components/calculators/ui";

// ── 2025년 요율 기준 (변경 시 이 상수만 수정) ──
const NP_RATE = 0.045; // 국민연금
const NP_CAP = 6_370_000; // 기준소득월액 상한
const NP_FLOOR = 400_000; // 기준소득월액 하한
const HI_RATE = 0.03545; // 건강보험 (근로자 부담)
const LTC_RATE = 0.1295; // 장기요양 (건강보험료 대비)
const EI_RATE = 0.009; // 고용보험

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

export default function SalaryCalcPage() {
  const [mode, setMode] = useState<"annual" | "monthly">("annual");
  const [amount, setAmount] = useState("");
  const [sevMode, setSevMode] = useState<"separate" | "included">("separate");
  const [taxFree, setTaxFree] = useState("200000");
  const [family, setFamily] = useState("1");
  const [children, setChildren] = useState("0");

  const amt = Number(amount || 0);
  const monthlyGross =
    mode === "annual" ? amt / (sevMode === "included" ? 13 : 12) : amt;
  const taxFreeM = Math.min(Number(taxFree || 0), monthlyGross);
  const taxableM = Math.max(0, monthlyGross - taxFreeM);
  const familyN = Math.max(1, Number(family || 1));
  const childrenN = Math.max(0, Number(children || 0));

  const np = floor10(
    Math.min(Math.max(taxableM, NP_FLOOR), NP_CAP) * NP_RATE
  );
  const hi = floor10(taxableM * HI_RATE);
  const ltc = floor10(hi * LTC_RATE);
  const ei = floor10(taxableM * EI_RATE);
  const incomeTax = floor10(
    annualIncomeTax(taxableM * 12, familyN, childrenN, np * 12) / 12
  );
  const localTax = floor10(incomeTax * 0.1);

  const totalDeduction = np + hi + ltc + ei + incomeTax + localTax;
  const net = monthlyGross - totalDeduction;
  const valid = amt > 0;

  return (
    <>
      <Card>
        <Field label="급여 기준">
          <Segmented
            options={[
              { value: "annual" as const, label: "연봉" },
              { value: "monthly" as const, label: "월급" },
            ]}
            value={mode}
            onChange={setMode}
          />
        </Field>
        <Field label={mode === "annual" ? "연봉 (세전)" : "월급 (세전)"}>
          <NumInput
            value={amount}
            onChange={setAmount}
            placeholder={mode === "annual" ? "50,000,000" : "4,000,000"}
            suffix="원"
          />
        </Field>
        {mode === "annual" && (
          <Field label="퇴직금">
            <Segmented
              options={[
                { value: "separate" as const, label: "별도" },
                { value: "included" as const, label: "포함 (÷13)" },
              ]}
              value={sevMode}
              onChange={setSevMode}
            />
          </Field>
        )}
        <Field label="비과세액 (월)" hint="식대 등 월 비과세 금액 (기본 식대 20만원)">
          <NumInput value={taxFree} onChange={setTaxFree} suffix="원" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="부양가족 수 (본인 포함)">
            <NumInput value={family} onChange={setFamily} suffix="명" />
          </Field>
          <Field label="8~20세 자녀 수">
            <NumInput value={children} onChange={setChildren} suffix="명" />
          </Field>
        </div>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="월 예상 실수령액"
            value={won(net)}
            sub={`연 환산 약 ${won(net * 12)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="월 세전 급여" value={won(monthlyGross)} />
            <ResultRow label="국민연금 (4.5%)" value={`−${won(np)}`} negative />
            <ResultRow label="건강보험 (3.545%)" value={`−${won(hi)}`} negative />
            <ResultRow label="장기요양보험" value={`−${won(ltc)}`} negative />
            <ResultRow label="고용보험 (0.9%)" value={`−${won(ei)}`} negative />
            <ResultRow label="소득세" value={`−${won(incomeTax)}`} negative />
            <ResultRow label="지방소득세" value={`−${won(localTax)}`} negative />
            <ResultRow label="공제액 합계" value={`−${won(totalDeduction)}`} negative />
            <ResultRow label="월 실수령액" value={won(net)} strong />
          </div>
        </Card>
      )}

      <Notice>
        2025년 4대보험 요율 기준 예상치입니다. 소득세는 근로소득 간이세액표 대신
        약식 산출한 값으로, 실제 원천징수액·연말정산 결과와 차이가 있을 수
        있습니다.
      </Notice>
    </>
  );
}
