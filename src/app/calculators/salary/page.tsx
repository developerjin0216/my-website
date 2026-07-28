"use client";

import { Suspense } from "react";
import {
  Card,
  Field,
  NumInput,
  Segmented,
  BigResult,
  ResultRow,
  Notice,
  ShareButton,
  useUrlState,
  won,
} from "@/components/calculators/ui";
import { calcMonthlyDeductions } from "@/utils/salary";

function SalaryCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [mode, setMode] = useUrlState("mode", "annual");
  const [amount, setAmount] = useUrlState("amount", "");
  const [sevMode, setSevMode] = useUrlState("sev", "separate");
  const [taxFree, setTaxFree] = useUrlState("taxfree", "200000");
  const [family, setFamily] = useUrlState("family", "1");
  const [children, setChildren] = useUrlState("children", "0");

  const amt = Number(amount || 0);
  const monthlyGross =
    mode === "annual" ? amt / (sevMode === "included" ? 13 : 12) : amt;

  const d = calcMonthlyDeductions(
    monthlyGross,
    Number(taxFree || 0),
    Number(family || 1),
    Number(children || 0)
  );
  const valid = amt > 0;

  return (
    <>
      <Card>
        <Field label="급여 기준">
          <Segmented
            options={[
              { value: "annual", label: "연봉" },
              { value: "monthly", label: "월급" },
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
                { value: "separate", label: "별도" },
                { value: "included", label: "포함 (÷13)" },
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
            value={won(d.net)}
            sub={`연 환산 약 ${won(d.net * 12)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="월 세전 급여" value={won(monthlyGross)} />
            <ResultRow label="국민연금 (4.75%)" value={`−${won(d.np)}`} negative />
            <ResultRow label="건강보험 (3.595%)" value={`−${won(d.hi)}`} negative />
            <ResultRow label="장기요양보험" value={`−${won(d.ltc)}`} negative />
            <ResultRow label="고용보험 (0.9%)" value={`−${won(d.ei)}`} negative />
            <ResultRow label="소득세" value={`−${won(d.incomeTax)}`} negative />
            <ResultRow label="지방소득세" value={`−${won(d.localTax)}`} negative />
            <ResultRow label="공제액 합계" value={`−${won(d.total)}`} negative />
            <ResultRow label="월 실수령액" value={won(d.net)} strong />
          </div>
          <ShareButton
            title="연봉 실수령액 계산기"
            text={`연봉 실수령액 계산: 월 ${won(d.net)} (세전 ${won(monthlyGross)}) — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        2026년 4대보험 요율 기준 예상치입니다. 소득세는 근로소득 간이세액표 대신
        약식 산출한 값으로, 실제 원천징수액·연말정산 결과와 차이가 있을 수
        있습니다.
      </Notice>
    </>
  );
}

export default function SalaryCalcPage() {
  return (
    <Suspense fallback={null}>
      <SalaryCalc />
    </Suspense>
  );
}
