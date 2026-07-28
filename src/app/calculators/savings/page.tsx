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

const TAX_OPTIONS = [
  { value: "normal", label: "일반 15.4%", rate: 0.154 },
  { value: "reduced", label: "우대 9.5%", rate: 0.095 },
  { value: "coop", label: "예탁금 1.4%", rate: 0.014 }, // 상호금융 조합원 (농특세만)
  { value: "free", label: "비과세", rate: 0 },
] as const;

function SavingsCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [mode, setMode] = useUrlState("mode", "deposit"); // 적금 or 예금
  const [amount, setAmount] = useUrlState("amount", "");
  const [rate, setRate] = useUrlState("rate", "");
  const [months, setMonths] = useUrlState("months", "12");
  const [compound, setCompound] = useUrlState("compound", "simple");
  const [tax, setTax] = useUrlState("tax", "normal");

  const isInstallment = mode === "deposit"; // deposit = 적금(월 적립)
  const amountN = Number(amount || 0);
  const r = Number(rate || 0) / 100;
  const n = Number(months || 0);
  const taxRate = TAX_OPTIONS.find((t) => t.value === tax)?.rate ?? 0.154;
  const valid = amountN > 0 && r >= 0 && n > 0;

  // 원금과 세전 이자
  let principal = 0;
  let interest = 0;
  if (valid) {
    const i = r / 12;
    if (isInstallment) {
      principal = amountN * n;
      if (compound === "compound" && i > 0) {
        // 월복리 (기수불: 매월 초 납입)
        const fv = amountN * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        interest = fv - principal;
      } else {
        // 단리: 매월 납입금의 잔여 개월 수만큼 이자
        interest = amountN * i * ((n * (n + 1)) / 2);
      }
    } else {
      principal = amountN;
      interest =
        compound === "compound"
          ? amountN * Math.pow(1 + i, n) - amountN
          : amountN * r * (n / 12);
    }
  }

  const taxAmount = interest * taxRate;
  const afterTax = interest - taxAmount;
  const totalReceive = principal + afterTax;

  return (
    <>
      <Card>
        <Field label="상품 종류">
          <Segmented
            options={[
              { value: "deposit", label: "적금 (월 적립)" },
              { value: "lump", label: "예금 (목돈 거치)" },
            ]}
            value={mode}
            onChange={setMode}
          />
        </Field>
        <Field label={isInstallment ? "월 납입액" : "예치 금액"}>
          <NumInput
            value={amount}
            onChange={setAmount}
            placeholder={isInstallment ? "500,000" : "10,000,000"}
            suffix="원"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="연 금리">
            <NumInput
              value={rate}
              onChange={setRate}
              placeholder="3.5"
              suffix="%"
              comma={false}
            />
          </Field>
          <Field label="기간">
            <NumInput value={months} onChange={setMonths} suffix="개월" />
          </Field>
        </div>
        <Field label="이자 방식">
          <Segmented
            options={[
              { value: "simple", label: "단리" },
              { value: "compound", label: "월복리" },
            ]}
            value={compound}
            onChange={setCompound}
          />
        </Field>
        <Field label="과세 유형">
          <Segmented
            options={TAX_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
            value={tax}
            onChange={setTax}
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="만기 수령액 (세후)"
            value={won(totalReceive)}
            sub={`원금 ${won(principal)} + 세후 이자 ${won(afterTax)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="원금 합계" value={won(principal)} />
            <ResultRow label="세전 이자" value={won(interest)} />
            <ResultRow
              label={`이자 과세 (${(taxRate * 100).toFixed(1)}%)`}
              value={`−${won(taxAmount)}`}
              negative
            />
            <ResultRow label="세후 수령액" value={won(totalReceive)} strong />
          </div>
          <ShareButton
            title="예금·적금 이자 계산기"
            text={`${isInstallment ? `월 ${won(amountN)} 적금` : `${won(amountN)} 예금`} ${n}개월(연 ${rate}%) → 세후 ${won(totalReceive)} — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        이자는 만기 일시 지급 기준 약식 계산입니다. 실제 상품은 이자 계산
        주기·납입일에 따라 소액의 차이가 있을 수 있으며, 중도 해지 시 약정
        금리보다 낮은 중도해지 금리가 적용됩니다.
      </Notice>
    </>
  );
}

export default function SavingsCalcPage() {
  return (
    <Suspense fallback={null}>
      <SavingsCalc />
    </Suspense>
  );
}
