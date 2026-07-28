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
  inputCls,
} from "@/components/calculators/ui";
import { UNEMP_DAILY_MAX, UNEMP_DAILY_MIN } from "@/data/calculators";

// 소정급여일수 (고용보험법) — [가입기간 구간][50세 미만 / 50세 이상·장애인]
const BENEFIT_DAYS: { label: string; under50: number; over50: number }[] = [
  { label: "1년 미만", under50: 120, over50: 120 },
  { label: "1년 ~ 3년", under50: 150, over50: 180 },
  { label: "3년 ~ 5년", under50: 180, over50: 210 },
  { label: "5년 ~ 10년", under50: 210, over50: 240 },
  { label: "10년 이상", under50: 240, over50: 270 },
];

function UnemploymentCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [age, setAge] = useUrlState("age", "under50");
  const [period, setPeriod] = useUrlState("period", "1");
  const [salary, setSalary] = useUrlState("salary", "");

  const salaryN = Number(salary || 0);
  const periodIdx = Math.min(
    BENEFIT_DAYS.length - 1,
    Math.max(0, Number(period) || 0)
  );
  const valid = salaryN > 0;

  // 1일 평균임금 (퇴직 전 3개월, 평균 91.25일 약식) → 60% + 상·하한 보정
  const avgDaily = (salaryN * 3) / 91.25;
  const rawBenefit = avgDaily * 0.6;
  const dailyBenefit = Math.min(
    UNEMP_DAILY_MAX,
    Math.max(UNEMP_DAILY_MIN, rawBenefit)
  );
  const capped =
    rawBenefit > UNEMP_DAILY_MAX
      ? "상한 적용"
      : rawBenefit < UNEMP_DAILY_MIN
        ? "하한 적용"
        : "평균임금의 60%";

  const row = BENEFIT_DAYS[periodIdx];
  const days = age === "over50" ? row.over50 : row.under50;
  const total = dailyBenefit * days;

  return (
    <>
      <Card>
        <Field label="이직일(퇴사일) 기준 나이">
          <Segmented
            options={[
              { value: "under50", label: "50세 미만" },
              { value: "over50", label: "50세 이상·장애인" },
            ]}
            value={age}
            onChange={setAge}
          />
        </Field>
        <Field label="고용보험 가입기간">
          <select
            className={inputCls}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {BENEFIT_DAYS.map((b, i) => (
              <option key={b.label} value={String(i)}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="퇴직 전 3개월 월평균 급여 (세전)"
          hint="기본급 + 고정수당 기준"
        >
          <NumInput
            value={salary}
            onChange={setSalary}
            placeholder="3,000,000"
            suffix="원"
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="총 예상 수령액 (세전)"
            value={won(total)}
            sub={`1일 ${won(dailyBenefit)} × ${days}일`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow
              label="1일 지급액"
              value={`${won(dailyBenefit)} (${capped})`}
            />
            <ResultRow label="소정급여일수" value={`${days}일`} />
            <ResultRow label="월 환산 (30일 기준)" value={won(dailyBenefit * 30)} />
            <ResultRow label="총 예상 수령액" value={won(total)} strong />
          </div>
          <p className="text-xs text-[#606070] mt-3 leading-relaxed">
            2026년 이직자 기준 (상한 {won(UNEMP_DAILY_MAX)} / 하한{" "}
            {won(UNEMP_DAILY_MIN)}). 수급하려면 비자발적 이직 + 이직 전 18개월 중
            피보험 단위기간 180일 이상이어야 합니다.
          </p>
          <ShareButton
            title="실업급여 계산기"
            text={`실업급여 예상: 1일 ${won(dailyBenefit)} × ${days}일 = 총 ${won(total)} — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        약식 계산입니다. 실제 수급자격·지급액은 고용센터 심사로 확정되며,
        반복수급 감액, 조기재취업수당 등은 반영되지 않습니다. 정확한 내용은
        고용24(work24.go.kr) 또는 고용센터(1350)에서 확인하세요.
      </Notice>
    </>
  );
}

export default function UnemploymentCalcPage() {
  return (
    <Suspense fallback={null}>
      <UnemploymentCalc />
    </Suspense>
  );
}
