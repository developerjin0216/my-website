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
  fmt,
  inputCls,
} from "@/components/calculators/ui";
import { calcResidentialBill, type Contract } from "@/utils/electricity";

export default function ElectricityCalcPage() {
  const [kwh, setKwh] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [contract, setContract] = useState<Contract>("low");

  const usage = Number(kwh || 0);
  const valid = usage > 0;
  const bill = calcResidentialBill(usage, month, contract);
  const summer = month === 7 || month === 8;

  return (
    <>
      <Card>
        <Field label="월 사용량" hint="한전 고지서 또는 파워플래너 앱에서 확인할 수 있어요">
          <NumInput
            value={kwh}
            onChange={setKwh}
            placeholder="350"
            suffix="kWh"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="사용 월">
            <select
              className={inputCls}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}월{m === 7 || m === 8 ? " (하계)" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="계약 종류">
            <Segmented
              options={[
                { value: "low" as const, label: "저압" },
                { value: "high" as const, label: "고압" },
              ]}
              value={contract}
              onChange={setContract}
            />
          </Field>
        </div>
        <p className="text-xs text-[#606070] leading-relaxed">
          일반 주택·빌라는 대부분 저압, 아파트는 관리사무소 계약에 따라 고압인
          경우가 많습니다.
        </p>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="예상 청구액"
            value={won(bill.total)}
            sub={`${fmt(usage)}kWh · 누진 ${bill.tier}단계 (${summer ? "하계" : "기타계절"} 구간)`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="기본요금" value={won(bill.baseFee)} />
            <ResultRow label="전력량요금" value={won(bill.energyFee)} />
            <ResultRow label="기후환경요금 (9원/kWh)" value={won(bill.climateFee)} />
            <ResultRow label="연료비조정요금 (5원/kWh)" value={won(bill.fuelFee)} />
            <ResultRow label="전기요금계" value={won(bill.subtotal)} />
            <ResultRow label="부가가치세 (10%)" value={won(bill.vat)} />
            <ResultRow label="전력산업기반기금 (2.7%)" value={won(bill.fund)} />
            <ResultRow label="청구금액" value={won(bill.total)} strong />
          </div>
          {bill.tier === 3 && (
            <p className="text-xs text-[#ff6b6b] mt-3 leading-relaxed">
              ⚠ 누진 3단계 구간입니다. 사용량을{" "}
              {fmt(summer ? 450 : 400)}kWh 이하로 줄이면 단가가 크게 낮아집니다.
            </p>
          )}
        </Card>
      )}

      <Notice>
        한국전력 주택용 요금표 기준 참고용 계산입니다. 복지할인, TV수신료,
        연료비조정단가 변동은 반영되지 않으며 실제 청구액과 다를 수 있습니다.
      </Notice>
    </>
  );
}
