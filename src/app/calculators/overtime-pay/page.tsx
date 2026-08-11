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

function OvertimeCalc() {
  const [payType, setPayType] = useUrlState("type", "hourly"); // hourly | monthly
  const [pay, setPay] = useUrlState("pay", "");
  const [otH, setOtH] = useUrlState("ot", ""); // 연장
  const [nightH, setNightH] = useUrlState("night", ""); // 야간 (가산만)
  const [holH, setHolH] = useUrlState("hol", ""); // 휴일
  const [small, setSmall] = useUrlState("small", "no"); // 5인 미만

  const payN = Number(pay || 0);
  // 통상시급: 월급제는 ÷209시간 (주 40시간 관행 기준)
  const hourly = payType === "monthly" ? payN / 209 : payN;
  const ot = Number(otH || 0);
  const night = Number(nightH || 0);
  const hol = Number(holH || 0);
  const isSmall = small === "yes";
  const valid = hourly > 0 && ot + night + hol > 0;

  // 근로기준법 제56조 — 5인 미만은 가산 없음(본래 임금 1.0배만)
  const otPay = hourly * ot * (isSmall ? 1.0 : 1.5);
  // 야간은 '가산분(0.5배)'만 계산 — 기본 근로분은 이미 급여에 포함됐다고 가정
  const nightPay = isSmall ? 0 : hourly * night * 0.5;
  const holWithin = Math.min(hol, 8);
  const holOver = Math.max(hol - 8, 0);
  const holPay = isSmall
    ? hourly * hol * 1.0
    : hourly * holWithin * 1.5 + hourly * holOver * 2.0;
  const total = otPay + nightPay + holPay;

  return (
    <>
      <Card>
        <Field label="급여 기준">
          <Segmented
            options={[
              { value: "hourly", label: "시급으로 입력" },
              { value: "monthly", label: "월급으로 입력" },
            ]}
            value={payType}
            onChange={setPayType}
          />
        </Field>
        <Field
          label={payType === "monthly" ? "월 통상임금 (기본급+고정수당)" : "통상시급"}
          hint={payType === "monthly" ? "통상시급 = 월 통상임금 ÷ 209시간" : undefined}
        >
          <NumInput
            value={pay}
            onChange={setPay}
            placeholder={payType === "monthly" ? "2,800,000" : "12,000"}
            suffix="원"
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="연장근로">
            <NumInput value={otH} onChange={setOtH} placeholder="0" suffix="h" comma={false} />
          </Field>
          <Field label="야간근로">
            <NumInput value={nightH} onChange={setNightH} placeholder="0" suffix="h" comma={false} />
          </Field>
          <Field label="휴일근로">
            <NumInput value={holH} onChange={setHolH} placeholder="0" suffix="h" comma={false} />
          </Field>
        </div>
        <p className="text-xs text-[#606070] -mt-2 mb-3">
          야간(22~06시)은 연장·휴일과 겹쳐도 각각 입력하세요 — 가산이 중복
          적용됩니다.
        </p>
        <Field label="사업장 규모">
          <Segmented
            options={[
              { value: "no", label: "5인 이상" },
              { value: "yes", label: "5인 미만" },
            ]}
            value={small}
            onChange={setSmall}
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label={isSmall ? "초과근로 임금 (가산 미적용)" : "가산수당 합계"}
            value={won(total)}
            sub={`통상시급 ${won(hourly)} 기준`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            {ot > 0 && (
              <ResultRow
                label={`연장 ${ot}h × ${isSmall ? "1.0" : "1.5"}배`}
                value={won(otPay)}
              />
            )}
            {night > 0 && (
              <ResultRow
                label={`야간 가산 ${night}h × 0.5배`}
                value={isSmall ? "적용 없음" : won(nightPay)}
              />
            )}
            {hol > 0 && (
              <ResultRow
                label={
                  isSmall
                    ? `휴일 ${hol}h × 1.0배`
                    : holOver > 0
                      ? `휴일 ${holWithin}h×1.5배 + ${holOver}h×2.0배`
                      : `휴일 ${hol}h × 1.5배`
                }
                value={won(holPay)}
              />
            )}
            <ResultRow label="합계" value={won(total)} strong />
          </div>
          <ShareButton
            title="연장·야간·휴일수당 계산기"
            text={`연장 ${ot}h·야간 ${night}h·휴일 ${hol}h → 수당 ${won(total)} — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        근로기준법 제56조 기준 약식 계산입니다. 야간수당은 가산분(0.5배)만
        표시하며 해당 시간의 기본 임금은 급여에 포함된 것으로 가정합니다. 5인
        미만 사업장은 가산 규정이 적용되지 않지만 일한 시간의 임금(1배)은
        전액 지급 대상입니다. 포괄임금 약정이 있어도 약정 초과분은 청구할 수
        있습니다.
      </Notice>
    </>
  );
}

export default function OvertimeCalcPage() {
  return (
    <Suspense fallback={null}>
      <OvertimeCalc />
    </Suspense>
  );
}
