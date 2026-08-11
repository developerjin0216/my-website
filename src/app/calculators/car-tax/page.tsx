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

// 연납 신청 월별 공제 대상 잔여일수 (신청월 다음 달 1일 ~ 12/31)
const PREPAY_MONTHS = [
  { value: "1", label: "1월", days: 334 },
  { value: "3", label: "3월", days: 275 },
  { value: "6", label: "6월", days: 184 },
  { value: "9", label: "9월", days: 92 },
] as const;

function CarTaxCalc() {
  const [fuel, setFuel] = useUrlState("fuel", "ice"); // ice | ev
  const [cc, setCc] = useUrlState("cc", "");
  const [age, setAge] = useUrlState("age", "1");
  const [payMonth, setPayMonth] = useUrlState("m", "1");
  const [prepayRate, setPrepayRate] = useUrlState("r", "3");

  const isEv = fuel === "ev";
  const ccN = Number(cc || 0);
  const ageN = Math.max(Number(age || 1), 1);
  const valid = isEv || ccN > 0;

  // 본세: cc당 세율 (지방세법 제127조, 비영업용 승용) / 전기·수소차 정액 10만원
  let baseTax = 0;
  let discountPct = 0;
  if (valid) {
    if (isEv) {
      baseTax = 100_000;
    } else {
      const perCc = ccN <= 1000 ? 80 : ccN <= 1600 ? 140 : 200;
      // 차령 3년차부터 5%씩, 최대 50% 경감 (전기차는 경감 없음)
      discountPct = ageN >= 3 ? Math.min(5 * (Math.min(ageN, 12) - 2), 50) : 0;
      baseTax = ccN * perCc * (1 - discountPct / 100);
    }
  }
  const eduTax = baseTax * 0.3;
  const annual = Math.floor(baseTax + eduTax);
  const half = Math.floor(annual / 2);

  const monthInfo =
    PREPAY_MONTHS.find((m) => m.value === payMonth) ?? PREPAY_MONTHS[0];
  const rate = Number(prepayRate) / 100;
  const discount = Math.floor(annual * rate * (monthInfo.days / 365));
  const prepayTotal = annual - discount;

  return (
    <>
      <Card>
        <Field label="차량 종류">
          <Segmented
            options={[
              { value: "ice", label: "휘발유·경유·LPG" },
              { value: "ev", label: "전기·수소차" },
            ]}
            value={fuel}
            onChange={setFuel}
          />
        </Field>
        {!isEv && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="배기량" hint="자동차등록증에 기재된 cc">
              <NumInput value={cc} onChange={setCc} placeholder="1,598" suffix="cc" />
            </Field>
            <Field label="차령 (몇 년차)" hint="최초 등록 연도가 1년차">
              <NumInput value={age} onChange={setAge} suffix="년차" />
            </Field>
          </div>
        )}
        <Field label="연납 신청 월">
          <Segmented
            options={PREPAY_MONTHS.map((m) => ({ value: m.value, label: m.label }))}
            value={payMonth}
            onChange={setPayMonth}
          />
        </Field>
        <Field
          label="연납 공제율"
          hint="법정 스케줄은 3%, 고시로 5%가 유지된 해도 있음 — 위택스에서 올해 확정율 확인"
        >
          <Segmented
            options={[
              { value: "3", label: "3%" },
              { value: "5", label: "5%" },
            ]}
            value={prepayRate}
            onChange={setPrepayRate}
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="연간 자동차세 (교육세 포함)"
            value={won(annual)}
            sub={`6월·12월 각 ${won(half)}씩 분납 기준`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="본세 (자동차세)" value={won(Math.floor(baseTax))} />
            {discountPct > 0 && (
              <ResultRow label={`차령 경감 (${discountPct}%)`} value="반영됨" />
            )}
            <ResultRow label="지방교육세 (30%)" value={won(Math.floor(eduTax))} />
            <ResultRow
              label={`${monthInfo.label} 연납 공제 (${prepayRate}%)`}
              value={`−${won(discount)}`}
              negative
            />
            <ResultRow label="연납 시 납부액" value={won(prepayTotal)} strong />
          </div>
          <ShareButton
            title="자동차세 계산기"
            text={`${isEv ? "전기차" : `${ccN.toLocaleString()}cc ${ageN}년차`} 자동차세 연 ${won(annual)}, ${monthInfo.label} 연납 시 ${won(prepayTotal)} — 모두의 계산기`}
          />
        </Card>
      )}

      <Notice>
        비영업용 승용차 기준 약식 계산입니다. 승합·화물·영업용은 세율 체계가
        다르고, 연납 공제율·기간은 매년 행정안전부 고시로 확정되니 신청 전
        위택스(wetax.go.kr)에서 확인하세요. 연중 취득·이전 시에는 소유 기간만큼
        일할 계산됩니다.
      </Notice>
    </>
  );
}

export default function CarTaxCalcPage() {
  return (
    <Suspense fallback={null}>
      <CarTaxCalc />
    </Suspense>
  );
}
