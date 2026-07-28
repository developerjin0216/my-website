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
  fmt,
} from "@/components/calculators/ui";
import { calcResidentialBill, type Contract } from "@/utils/electricity";

const SUMMER_MONTH = 8; // 하계 요금 기준

function AirconCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [watts, setWatts] = useUrlState("watts", "1800");
  const [hours, setHours] = useUrlState("hours", "8");
  const [days, setDays] = useUrlState("days", "30");
  const [duty, setDuty] = useUrlState("duty", "70");
  const [baseKwh, setBaseKwh] = useUrlState("base", "300");
  const [contract, setContract] = useUrlState("contract", "low");

  const wattsN = Number(watts || 0);
  const hoursN = Number(hours || 0);
  const daysN = Number(days || 0);
  const dutyN = Math.min(100, Number(duty || 0));
  const baseN = Number(baseKwh || 0);

  const airconKwh = (wattsN / 1000) * hoursN * daysN * (dutyN / 100);
  const valid = wattsN > 0 && hoursN > 0 && daysN > 0;

  const withAircon = calcResidentialBill(
    baseN + airconKwh,
    SUMMER_MONTH,
    contract as Contract
  );
  const baseBill = calcResidentialBill(baseN, SUMMER_MONTH, contract as Contract);
  const extra = withAircon.total - baseBill.total;
  const perHour = hoursN * daysN > 0 ? extra / (hoursN * daysN) : 0;

  return (
    <>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Field label="정격 소비전력">
            <NumInput
              value={watts}
              onChange={setWatts}
              placeholder="1,800"
              suffix="W"
            />
          </Field>
          <Field label="하루 사용시간">
            <NumInput
              value={hours}
              onChange={setHours}
              placeholder="8"
              suffix="시간"
              comma={false}
            />
          </Field>
          <Field label="월 사용일수">
            <NumInput value={days} onChange={setDays} suffix="일" />
          </Field>
          <Field label="실제 가동률">
            <NumInput value={duty} onChange={setDuty} suffix="%" />
          </Field>
        </div>
        <p className="text-xs text-[#606070] leading-relaxed mb-4">
          인버터형은 설정 온도 도달 후 소비전력이 줄어 40~70%, 구형 정속형은
          80~100%를 권장합니다. 소비전력은 실외기 라벨이나 제품 스펙에서 확인할
          수 있어요.
        </p>
        <Field
          label="에어컨 제외 월 기본 사용량"
          hint="평소 여름 이전 달의 사용량 (누진 구간 판정에 사용됩니다)"
        >
          <NumInput
            value={baseKwh}
            onChange={setBaseKwh}
            placeholder="300"
            suffix="kWh"
          />
        </Field>
        <Field label="계약 종류">
          <Segmented
            options={[
              { value: "low", label: "저압 (일반주택)" },
              { value: "high", label: "고압 (아파트)" },
            ]}
            value={contract}
            onChange={setContract}
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="에어컨 추가 전기료 (월)"
            value={won(extra)}
            sub={`에어컨 사용량 약 ${fmt(airconKwh)}kWh · 시간당 약 ${won(perHour)}`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow
              label="기존 요금 (에어컨 제외)"
              value={won(baseBill.total)}
            />
            <ResultRow label="에어컨 추가 요금" value={`+${won(extra)}`} negative />
            <ResultRow
              label="총 예상 청구액"
              value={won(withAircon.total)}
              strong
            />
          </div>
          {withAircon.tier === 3 && (
            <p className="text-xs text-[#ff6b6b] mt-3 leading-relaxed">
              ⚠ 총 사용량 {fmt(baseN + airconKwh)}kWh — 누진 3단계(하계 450kWh
              초과) 구간입니다. 에어컨 사용량의 상당 부분이 307.3원/kWh 최고
              단가로 계산됩니다.
            </p>
          )}
          <ShareButton
            title="에어컨 전기세 계산기"
            text={`에어컨 전기세: 하루 ${hoursN}시간 × ${daysN}일 → 월 추가 약 ${won(extra)} — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        하계(7~8월) 주택용 요금 기준입니다. 실제 소비전력은 설정 온도, 실외
        온도, 단열 상태에 따라 달라지므로 결과는 참고용으로만 활용하세요.
      </Notice>
    </>
  );
}

export default function AirconCalcPage() {
  return (
    <Suspense fallback={null}>
      <AirconCalc />
    </Suspense>
  );
}
