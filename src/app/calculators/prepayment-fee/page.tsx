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

function PrepaymentCalc() {
  const [amount, setAmount] = useUrlState("amount", "");
  const [rate, setRate] = useUrlState("rate", "");
  const [elapsed, setElapsed] = useUrlState("elapsed", "");
  const [period, setPeriod] = useUrlState("period", "36");

  const amountN = Number(amount || 0);
  const rateN = Number(rate || 0) / 100;
  const elapsedN = Number(elapsed || 0);
  const periodN = Number(period || 36);
  const valid = amountN > 0 && rateN > 0 && periodN > 0;

  // 수수료 = 상환액 × 요율 × (잔존기간 ÷ 부과기간), 부과기간 경과 시 면제
  const remainM = Math.max(periodN - elapsedN, 0);
  const exempt = remainM === 0;
  const fee = exempt ? 0 : amountN * rateN * (remainM / periodN);
  // 면제까지 남은 기간
  const toExempt = Math.max(periodN - elapsedN, 0);

  return (
    <>
      <Card>
        <Field label="중도상환 금액">
          <NumInput
            value={amount}
            onChange={setAmount}
            placeholder="50,000,000"
            suffix="원"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="수수료율" hint="대출 약정서·은행 앱에서 확인">
            <NumInput
              value={rate}
              onChange={setRate}
              placeholder="0.6"
              suffix="%"
              comma={false}
            />
          </Field>
          <Field label="대출 후 경과 기간">
            <NumInput
              value={elapsed}
              onChange={setElapsed}
              placeholder="12"
              suffix="개월"
              comma={false}
            />
          </Field>
        </div>
        <Field label="수수료 부과 기간" hint="대부분 36개월(3년) — 약정 확인">
          <NumInput value={period} onChange={setPeriod} suffix="개월" comma={false} />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="중도상환수수료"
            value={exempt ? "면제 🎉" : won(fee)}
            sub={
              exempt
                ? `부과기간 ${periodN}개월이 지나 수수료가 없습니다`
                : `면제까지 ${toExempt}개월 남음`
            }
          />
          {!exempt && (
            <div className="border-t border-[#2a3a5a] pt-2">
              <ResultRow label="상환 금액" value={won(amountN)} />
              <ResultRow label="적용 요율" value={`${rate}%`} />
              <ResultRow
                label="잔존기간 비율"
                value={`${remainM}/${periodN}개월 (${Math.round((remainM / periodN) * 100)}%)`}
              />
              <ResultRow label="수수료" value={won(fee)} strong />
            </div>
          )}
          <ShareButton
            title="중도상환수수료 계산기"
            text={
              exempt
                ? `${won(amountN)} 중도상환 — 수수료 면제! — 모두의 계산기`
                : `${won(amountN)} 중도상환 시 수수료 ${won(fee)} — 모두의 계산기`
            }
          />
        </Card>
      )}

      <Notice>
        잔존기간 비례 방식의 약식 계산입니다. 실제 수수료는 상품 약정(면제
        한도, 고정/변동 요율 구분)에 따라 다를 수 있으니 상환 전 은행에서 정확한
        금액을 확인하세요. 갈아타기를 검토 중이라면 이 수수료와 금리 차이로
        아끼는 이자를 대출이자 계산기로 비교해 보세요.
      </Notice>
    </>
  );
}

export default function PrepaymentCalcPage() {
  return (
    <Suspense fallback={null}>
      <PrepaymentCalc />
    </Suspense>
  );
}
