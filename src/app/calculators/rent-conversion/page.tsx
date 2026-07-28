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
import { LEGAL_CONVERSION_CAP } from "@/data/calculators";

function RentConversionCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [direction, setDirection] = useUrlState("dir", "toMonthly");
  const [jeonse, setJeonse] = useUrlState("jeonse", ""); // 전세금 (전세→월세)
  const [deposit, setDeposit] = useUrlState("deposit", ""); // 월세 보증금
  const [monthlyRent, setMonthlyRent] = useUrlState("rent", ""); // 월세 (월세→전세)
  const [convRate, setConvRate] = useUrlState(
    "cr",
    String(LEGAL_CONVERSION_CAP)
  );

  const toMonthly = direction === "toMonthly";
  const jeonseN = Number(jeonse || 0);
  const depositN = Number(deposit || 0);
  const rentN = Number(monthlyRent || 0);
  const rateN = Number(convRate || 0) / 100;

  // 전세→월세: (전세금 − 보증금) × 전환율 ÷ 12
  const calcMonthly =
    jeonseN > depositN ? ((jeonseN - depositN) * rateN) / 12 : 0;
  // 월세→전세: 보증금 + 월세 × 12 ÷ 전환율
  const calcJeonse = rateN > 0 ? depositN + (rentN * 12) / rateN : 0;

  const valid = toMonthly
    ? jeonseN > 0 && depositN >= 0 && jeonseN > depositN && rateN > 0
    : depositN >= 0 && rentN > 0 && rateN > 0;

  const overCap = rateN * 100 > LEGAL_CONVERSION_CAP;

  return (
    <>
      <Card>
        <Field label="변환 방향">
          <Segmented
            options={[
              { value: "toMonthly", label: "전세 → 월세" },
              { value: "toJeonse", label: "월세 → 전세" },
            ]}
            value={direction}
            onChange={setDirection}
          />
        </Field>
        {toMonthly ? (
          <>
            <Field label="현재 전세보증금">
              <NumInput
                value={jeonse}
                onChange={setJeonse}
                placeholder="300,000,000"
                suffix="원"
              />
            </Field>
            <Field label="전환 후 월세 보증금">
              <NumInput
                value={deposit}
                onChange={setDeposit}
                placeholder="50,000,000"
                suffix="원"
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="월세 보증금">
              <NumInput
                value={deposit}
                onChange={setDeposit}
                placeholder="50,000,000"
                suffix="원"
              />
            </Field>
            <Field label="월세">
              <NumInput
                value={monthlyRent}
                onChange={setMonthlyRent}
                placeholder="1,000,000"
                suffix="원"
              />
            </Field>
          </>
        )}
        <Field
          label="전환율 (연)"
          hint={`법정 상한 ${LEGAL_CONVERSION_CAP.toFixed(2)}% (기준금리 2.75% + 2%p, 기존 계약 내 전환 시) — 신규 계약은 시장 전환율(통상 5~6%)`}
        >
          <NumInput
            value={convRate}
            onChange={setConvRate}
            placeholder="4.75"
            suffix="%"
            comma={false}
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          {toMonthly ? (
            <>
              <BigResult
                label="환산 월세"
                value={won(calcMonthly)}
                sub={`보증금 ${won(depositN)} + 월세 (전환율 ${convRate}%)`}
              />
              <div className="border-t border-[#2a3a5a] pt-2">
                <ResultRow label="전환 대상 보증금" value={won(jeonseN - depositN)} />
                <ResultRow label="연간 월세 총액" value={won(calcMonthly * 12)} />
                <ResultRow label="월세" value={won(calcMonthly)} strong />
              </div>
            </>
          ) : (
            <>
              <BigResult
                label="환산 전세보증금"
                value={won(calcJeonse)}
                sub={`보증금 ${won(depositN)} + 월세 ${won(rentN)} 환산 (전환율 ${convRate}%)`}
              />
              <div className="border-t border-[#2a3a5a] pt-2">
                <ResultRow label="월세의 보증금 환산액" value={won(calcJeonse - depositN)} />
                <ResultRow label="환산 전세금" value={won(calcJeonse)} strong />
              </div>
            </>
          )}
          {overCap && (
            <p className="text-xs text-[#ff6b6b] mt-3 leading-relaxed">
              ⚠ 입력한 전환율이 법정 상한({LEGAL_CONVERSION_CAP.toFixed(2)}%)을
              초과합니다 — 기존 계약에서 전환(계약 중·갱신)할 때는 상한을 넘는
              전환이 제한됩니다.
            </p>
          )}
          <ShareButton
            title="전월세 전환율 계산기"
            text={
              toMonthly
                ? `전세 ${won(jeonseN)} → 보증금 ${won(depositN)} + 월세 ${won(calcMonthly)} (전환율 ${convRate}%) — 모두의 계산기`
                : `보증금 ${won(depositN)} + 월세 ${won(rentN)} → 전세 환산 ${won(calcJeonse)} — 모두의 계산기`
            }
          />
        </Card>
      )}

      <Notice>
        법정 상한(기준금리+2%p)은 한국은행 기준금리 변동에 따라 달라집니다.
        지역별 실제 시세는 한국부동산원 전월세전환율 통계를 참고하세요.
      </Notice>
    </>
  );
}

export default function RentConversionCalcPage() {
  return (
    <Suspense fallback={null}>
      <RentConversionCalc />
    </Suspense>
  );
}
