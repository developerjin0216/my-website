"use client";

import { Suspense } from "react";
import {
  Card,
  Field,
  NumInput,
  BigResult,
  ResultRow,
  Notice,
  ShareButton,
  useUrlState,
  won,
} from "@/components/calculators/ui";
import { MIN_WAGE_2026, MIN_WAGE_2027 } from "@/data/calculators";

const WEEKS_PER_MONTH = 365 / 7 / 12; // ≈ 4.345

function MinimumWageCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [wage, setWage] = useUrlState("wage", String(MIN_WAGE_2026));
  const [hours, setHours] = useUrlState("hours", "40");

  const wageN = Number(wage || 0);
  const hoursN = Math.min(52, Number(hours || 0));
  const valid = wageN > 0 && hoursN > 0;

  // 주휴수당: 주 15시간 이상 + 개근 가정
  const hasHoliday = hoursN >= 15;
  const holidayHours = hasHoliday ? (Math.min(hoursN, 40) / 40) * 8 : 0;
  const holidayPay = wageN * holidayHours;

  const weeklyPay = wageN * hoursN + holidayPay;
  const monthlyHours = Math.round((hoursN + holidayHours) * WEEKS_PER_MONTH);
  const monthlyPay = wageN * monthlyHours;
  const yearlyPay = monthlyPay * 12;

  const belowMin = wageN > 0 && wageN < MIN_WAGE_2026;

  return (
    <>
      <Card>
        <Field label="시급">
          <NumInput
            value={wage}
            onChange={setWage}
            placeholder="10,320"
            suffix="원"
          />
        </Field>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setWage(String(MIN_WAGE_2026))}
            className={`rounded-xl px-2 py-2.5 text-sm font-semibold border transition-colors ${
              wageN === MIN_WAGE_2026
                ? "bg-accent text-[#1a1a2e] border-accent"
                : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
            }`}
          >
            2026 최저 (10,320원)
          </button>
          <button
            type="button"
            onClick={() => setWage(String(MIN_WAGE_2027))}
            className={`rounded-xl px-2 py-2.5 text-sm font-semibold border transition-colors ${
              wageN === MIN_WAGE_2027
                ? "bg-accent text-[#1a1a2e] border-accent"
                : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
            }`}
          >
            2027 최저 (10,700원)
          </button>
        </div>
        <Field
          label="주당 근무시간"
          hint="휴게시간 제외 실제 근무시간 (주 15시간 이상이면 주휴수당 발생)"
        >
          <NumInput
            value={hours}
            onChange={setHours}
            placeholder="40"
            suffix="시간"
            comma={false}
          />
        </Field>
      </Card>

      {belowMin && (
        <Card className="mt-4">
          <p className="text-sm text-[#ff6b6b] text-center py-1">
            ⚠ 입력한 시급이 2026년 최저임금(10,320원)보다 낮습니다 — 최저임금법
            위반에 해당할 수 있습니다.
          </p>
        </Card>
      )}

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="월급 (주휴수당 포함, 세전)"
            value={won(monthlyPay)}
            sub={`월 환산 ${monthlyHours}시간 × ${won(wageN)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow
              label="주휴수당"
              value={
                hasHoliday
                  ? `주 ${won(holidayPay)} (${holidayHours.toFixed(1)}시간분)`
                  : "미발생 (주 15시간 미만)"
              }
            />
            <ResultRow label="주급 (주휴 포함)" value={won(weeklyPay)} />
            <ResultRow label="월급 환산" value={won(monthlyPay)} />
            <ResultRow label="연봉 환산" value={won(yearlyPay)} strong />
          </div>
          <p className="text-xs text-[#606070] mt-3 leading-relaxed">
            세전 금액입니다. 4대보험·소득세를 뗀 실수령액은{" "}
            <a href="/calculators/salary" className="text-accent underline">
              연봉 실수령액 계산기
            </a>
            에서 확인하세요.
          </p>
          <ShareButton
            title="최저임금·주휴수당 계산기"
            text={`시급 ${won(wageN)} × 주 ${hoursN}시간 → 월 ${won(monthlyPay)} (주휴수당 포함) — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        주휴수당은 소정근로일 개근을 가정합니다. 연장·야간·휴일근로 가산수당
        (5인 이상 사업장 1.5배)은 포함되지 않으며, 실제 급여는 근로계약에 따라
        달라질 수 있습니다.
      </Notice>
    </>
  );
}

export default function MinimumWageCalcPage() {
  return (
    <Suspense fallback={null}>
      <MinimumWageCalc />
    </Suspense>
  );
}
