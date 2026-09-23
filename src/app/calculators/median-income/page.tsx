"use client";

import { useState } from "react";
import {
  Card,
  Field,
  BigResult,
  ResultRow,
  Notice,
  inputCls,
} from "@/components/calculators/ui";
import {
  MEDIAN_INCOME_YEARS,
  MEDIAN_INCOME_REVIEWED,
  COMMON_RATES,
  medianIncome,
  atRate,
  won,
  PENDING_YEAR,
  type MedianIncomeYear,
} from "@/utils/medianIncome";

// 년도별 기준 중위소득 계산기.
//
// 이 계산기는 고시된 중위소득에 비율을 곱하는 산수만 합니다. "당신은 생계급여
// 대상입니다" 같은 판정은 하지 않습니다 — 실제 수급 판정에는 소득인정액(재산의
// 소득환산, 근로소득공제, 부양의무자 등)이 들어가는데 그건 여기서 계산할 수
// 없고, 잘못 알려주면 신청을 포기하게 만드는 실제 피해가 납니다.

const HOUSEHOLD_MAX = 10;

export default function MedianIncomeCalcPage() {
  const [year, setYear] = useState<MedianIncomeYear>(MEDIAN_INCOME_YEARS[0]);
  const [household, setHousehold] = useState(1);
  const [rate, setRate] = useState(100);

  const { amount: base, estimated } = medianIncome(year, household);
  const result = atRate(base, rate);

  return (
    <>
      <Card>
        <Field label="기준 연도">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value) as MedianIncomeYear)}
            className={inputCls}
          >
            {MEDIAN_INCOME_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </Field>

        <Field label="가구원 수">
          <select
            value={household}
            onChange={(e) => setHousehold(Number(e.target.value))}
            className={inputCls}
          >
            {Array.from({ length: HOUSEHOLD_MAX }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}인 가구
              </option>
            ))}
          </select>
        </Field>

        <Field label="기준 중위소득 대비 비율">
          <select
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={inputCls}
          >
            {COMMON_RATES.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </select>
        </Field>
      </Card>

      <BigResult
        label={`${year}년 ${household}인 가구 · 중위소득 ${rate}%`}
        value={`월 ${won(result)}원`}
      />

      <Card>
        <ResultRow label="기준 중위소득 (100%)" value={`${won(base)}원`} />
        <ResultRow label={`선택한 비율 ${rate}%`} value={`${won(result)}원`} />
        <ResultRow label="연 환산 (12개월)" value={`${won(result * 12)}원`} />
      </Card>

      {estimated && (
        <Notice>
          고시표에는 6인 가구까지만 나옵니다. 7인 이상은 6인 기준에 1인 증가분을
          더해 산정하는데, 여기서는 5인→6인 차액({won(
            medianIncome(year, 6).amount - medianIncome(year, 5).amount
          )}원)을 증가분으로 본 <strong>추정값</strong>입니다. 정확한 금액은
          주민센터나 복지로에서 확인하세요.
        </Notice>
      )}

      {/* 비율별 표 — '중위소득 60%가 얼마인지'를 찾아오는 검색 의도에 바로 답합니다 */}
      <Card>
        <p className="text-sm font-bold text-[#e8e8f0] mb-3">
          {year}년 {household}인 가구 비율별 금액
        </p>
        <div className="space-y-1">
          {COMMON_RATES.map((r) => (
            <div
              key={r}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                r === rate
                  ? "bg-[#3d2e00]/40 border border-[#ffd700]/40"
                  : "bg-[#16213e]"
              }`}
            >
              <span className="text-[#a0a0b0]">중위소득 {r}%</span>
              <span
                className={
                  r === rate ? "font-bold text-accent" : "text-[#e8e8f0]"
                }
              >
                {won(atRate(base, r))}원
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 연도 비교 — '작년보다 얼마나 올랐나'도 흔한 질문입니다 */}
      <Card>
        <p className="text-sm font-bold text-[#e8e8f0] mb-3">
          {household}인 가구 연도별 기준 중위소득
        </p>
        <div className="space-y-1">
          {MEDIAN_INCOME_YEARS.map((y) => {
            const v = medianIncome(y, household).amount;
            // 표에 없는 연도(2023의 전년)를 조회하면 undefined를 읽어 터집니다.
            // 존재를 먼저 확인한 뒤에만 전년을 가져옵니다.
            const hasPrev = (MEDIAN_INCOME_YEARS as readonly number[]).includes(
              y - 1
            );
            const diff = hasPrev
              ? ((v - medianIncome((y - 1) as MedianIncomeYear, household).amount) /
                  medianIncome((y - 1) as MedianIncomeYear, household).amount) *
                100
              : null;
            return (
              <div
                key={y}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  y === year ? "bg-[#3d2e00]/40 border border-[#ffd700]/40" : "bg-[#16213e]"
                }`}
              >
                <span className="text-[#a0a0b0]">{y}년</span>
                <span className="flex items-baseline gap-2">
                  <span className={y === year ? "font-bold text-accent" : "text-[#e8e8f0]"}>
                    {won(v)}원
                  </span>
                  {diff !== null && (
                    <span className="text-[11px] text-[#22C55E]">
                      +{diff.toFixed(2)}%
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* '2027년 중위소득'으로 찾아오는 사람에게, 추정치를 지어내는 대신
          지금까지 확인된 사실만 알려줍니다. */}
      <Notice>
        <strong>{PENDING_YEAR.year}년 기준은 아직 표로 나오지 않았습니다.</strong>{" "}
        인상률 {PENDING_YEAR.raisePercent}%가 발표됐고 4인 가구 생계급여가 월 221만
        7천 원으로 오른다는 것까지 공개됐지만, 가구원 수별 고시 금액은 확정 공고를
        기다려야 합니다. 가구원 수마다 적용되는 지수가 달라 인상률만 곱하면 실제
        금액과 어긋나기 때문에, 여기서는 추정치를 넣지 않았습니다. 고시가 나오는
        대로 반영하겠습니다.
      </Notice>

      <Notice>
        여기 계산되는 값은 고시된 기준 중위소득에 비율을 곱한 것입니다.{" "}
        <strong>실제 수급 자격은 이 금액과 내 월급을 비교해서 정해지지 않습니다.</strong>{" "}
        재산의 소득환산액, 근로소득공제, 부양의무자 기준 등을 반영한
        &lsquo;소득인정액&rsquo;으로 판정하기 때문에, 월급이 기준을 넘어도 대상이
        되는 경우가 있습니다. 반드시 주민센터나 복지로 모의계산으로 확인하세요.
        <br />
        <span className="text-[11px] text-[#8a90a0]">
          표 최종 확인 {MEDIAN_INCOME_REVIEWED} · 보건복지부 고시 기준
        </span>
      </Notice>
    </>
  );
}
