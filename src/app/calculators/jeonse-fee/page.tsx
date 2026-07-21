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

type DealType = "jeonse" | "monthly" | "sale";

interface Bracket {
  max: number;
  rate: number;
  cap?: number;
}

// 주택 중개보수 상한요율 (국토교통부 고시, 전국 공통)
const LEASE_BRACKETS: Bracket[] = [
  { max: 50_000_000, rate: 0.005, cap: 200_000 },
  { max: 100_000_000, rate: 0.004, cap: 300_000 },
  { max: 600_000_000, rate: 0.003 },
  { max: 1_200_000_000, rate: 0.004 },
  { max: 1_500_000_000, rate: 0.005 },
  { max: Infinity, rate: 0.006 },
];

const SALE_BRACKETS: Bracket[] = [
  { max: 50_000_000, rate: 0.006, cap: 250_000 },
  { max: 200_000_000, rate: 0.005, cap: 800_000 },
  { max: 900_000_000, rate: 0.004 },
  { max: 1_200_000_000, rate: 0.005 },
  { max: 1_500_000_000, rate: 0.006 },
  { max: Infinity, rate: 0.007 },
];

export default function JeonseFeeCalcPage() {
  const [dealType, setDealType] = useState<DealType>("jeonse");
  const [deposit, setDeposit] = useState("");
  const [rent, setRent] = useState("");

  const depositN = Number(deposit || 0);
  const rentN = Number(rent || 0);

  // 거래금액 환산
  let amount = depositN;
  if (dealType === "monthly") {
    amount = depositN + rentN * 100;
    if (amount < 50_000_000) amount = depositN + rentN * 70;
  }

  const brackets = dealType === "sale" ? SALE_BRACKETS : LEASE_BRACKETS;
  const bracket = brackets.find((b) => amount < b.max) ?? brackets[brackets.length - 1];
  const rawFee = amount * bracket.rate;
  const fee = bracket.cap ? Math.min(rawFee, bracket.cap) : rawFee;

  const valid =
    depositN > 0 && (dealType !== "monthly" || rentN > 0);

  return (
    <>
      <Card>
        <Field label="거래 유형">
          <Segmented
            options={[
              { value: "jeonse" as const, label: "전세" },
              { value: "monthly" as const, label: "월세" },
              { value: "sale" as const, label: "매매" },
            ]}
            value={dealType}
            onChange={setDealType}
          />
        </Field>
        <Field
          label={
            dealType === "sale"
              ? "매매가격"
              : dealType === "jeonse"
                ? "전세보증금"
                : "보증금"
          }
        >
          <NumInput
            value={deposit}
            onChange={setDeposit}
            placeholder={dealType === "sale" ? "500,000,000" : "300,000,000"}
            suffix="원"
          />
        </Field>
        {dealType === "monthly" && (
          <Field label="월세">
            <NumInput
              value={rent}
              onChange={setRent}
              placeholder="500,000"
              suffix="원"
            />
          </Field>
        )}
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="최대 중개보수 (VAT 별도)"
            value={won(fee)}
            sub={`부가세 10% 포함 시 ${won(fee * 1.1)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            {dealType === "monthly" && (
              <ResultRow
                label="환산 거래금액"
                value={`${won(amount)} (보증금+월세×${amount === depositN + rentN * 70 ? 70 : 100})`}
              />
            )}
            <ResultRow
              label="상한요율"
              value={`${(bracket.rate * 100).toFixed(1)}%`}
            />
            {bracket.cap && (
              <ResultRow label="한도액" value={won(bracket.cap)} />
            )}
            <ResultRow label="최대 중개보수" value={won(fee)} strong />
          </div>
        </Card>
      )}

      <Notice>
        주택 기준 상한요율입니다. 중개보수는 상한 내에서 협의로 결정되며,
        오피스텔(주거용 0.4~0.5%)·상가(0.9% 이내)는 요율이 다릅니다. 중개사가
        일반과세자인 경우 부가세 10%가 추가됩니다.
      </Notice>
    </>
  );
}
