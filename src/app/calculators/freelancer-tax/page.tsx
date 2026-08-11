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

const RATE = 0.033; // 소득세 3% + 지방소득세 0.3%

function FreelancerCalc() {
  const [dir, setDir] = useUrlState("dir", "forward"); // forward: 세전→실수령
  const [amount, setAmount] = useUrlState("amount", "");

  const amountN = Number(amount || 0);
  const valid = amountN > 0;
  const isForward = dir === "forward";

  // 정계산: 세전 × 0.967 / 역계산: 실수령 ÷ 0.967
  const gross = isForward ? amountN : amountN / (1 - RATE);
  const tax = gross * RATE;
  const net = gross - tax;

  return (
    <>
      <Card>
        <Field label="계산 방향">
          <Segmented
            options={[
              { value: "forward", label: "계약금액 → 실수령" },
              { value: "reverse", label: "실수령 → 세전" },
            ]}
            value={dir}
            onChange={setDir}
          />
        </Field>
        <Field
          label={isForward ? "계약 금액 (세전)" : "실수령액 (통장에 들어온 돈)"}
          hint={
            isForward
              ? undefined
              : "'실수령 기준 100만원' 계약이 세전으로 얼마인지 역산합니다"
          }
        >
          <NumInput
            value={amount}
            onChange={setAmount}
            placeholder="1,000,000"
            suffix="원"
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label={isForward ? "실수령액" : "세전 계약 금액"}
            value={won(isForward ? net : gross)}
            sub={`원천징수 3.3% = ${won(tax)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="세전 금액" value={won(gross)} />
            <ResultRow label="소득세 3%" value={`−${won(gross * 0.03)}`} negative />
            <ResultRow label="지방소득세 0.3%" value={`−${won(gross * 0.003)}`} negative />
            <ResultRow label="실수령액" value={won(net)} strong />
          </div>
          <ShareButton
            title="프리랜서 3.3% 계산기"
            text={`세전 ${won(gross)} → 3.3% 공제 후 ${won(net)} — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        인적용역 사업소득 원천징수(3.3%) 기준입니다. 이 세금은 예납이며 다음
        해 5월 종합소득세 신고로 정산됩니다 — 경비·공제에 따라 환급받는 경우가
        많으니 홈택스 모두채움 안내문을 꼭 확인하세요. 일시적 소득이라
        8.8%(기타소득)를 뗀 경우는 계산이 다릅니다.
      </Notice>
    </>
  );
}

export default function FreelancerCalcPage() {
  return (
    <Suspense fallback={null}>
      <FreelancerCalc />
    </Suspense>
  );
}
