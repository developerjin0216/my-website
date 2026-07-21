"use client";

import { useState } from "react";
import {
  Card,
  Field,
  NumInput,
  BigResult,
  ResultRow,
  Notice,
  won,
} from "@/components/calculators/ui";

// 청년전용 버팀목 전세자금대출 — 연소득 구간별 기본금리 (2025년 기준)
const MAX_LOAN = 200_000_000; // 최대 2억
const LTV = 0.8; // 보증금의 80%
const RATE_FLOOR = 1.0;

function baseRate(income: number): number {
  if (income <= 20_000_000) return 2.0;
  if (income <= 40_000_000) return 2.3;
  if (income <= 60_000_000) return 2.7;
  return 3.1;
}

const PREF_OPTIONS = [
  { key: "welfare", label: "기초생활수급자·차상위·한부모 가구", discount: 1.0 },
  { key: "disabled", label: "장애인·다문화·고령자 가구", discount: 0.2 },
  { key: "econtract", label: "부동산 전자계약 체결", discount: 0.1 },
] as const;

export default function YouthLoanCalcPage() {
  const [income, setIncome] = useState("");
  const [deposit, setDeposit] = useState("");
  const [want, setWant] = useState("");
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});

  const incomeN = Number(income || 0);
  const depositN = Number(deposit || 0);
  const wantN = Number(want || 0);
  const valid = incomeN > 0 && depositN > 0;

  const discount = PREF_OPTIONS.reduce(
    (sum, opt) => sum + (prefs[opt.key] ? opt.discount : 0),
    0
  );
  const rate = Math.max(RATE_FLOOR, baseRate(incomeN) - discount);
  const limit = Math.min(depositN * LTV, MAX_LOAN);
  const loanAmt = wantN > 0 ? Math.min(wantN, limit) : limit;
  const monthlyInterest = (loanAmt * rate) / 100 / 12;

  return (
    <>
      <Card>
        <Field label="연소득 (부부합산)" hint="세전 기준">
          <NumInput
            value={income}
            onChange={setIncome}
            placeholder="35,000,000"
            suffix="원"
          />
        </Field>
        <Field label="임차보증금 (전세금)">
          <NumInput
            value={deposit}
            onChange={setDeposit}
            placeholder="150,000,000"
            suffix="원"
          />
        </Field>
        <Field label="희망 대출금액 (선택)" hint="비워두면 최대 한도로 계산합니다">
          <NumInput value={want} onChange={setWant} suffix="원" />
        </Field>
        <Field label="우대금리 (해당 시 선택)">
          <div className="space-y-2">
            {PREF_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() =>
                  setPrefs((p) => ({ ...p, [opt.key]: !p[opt.key] }))
                }
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm border transition-colors ${
                  prefs[opt.key]
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-[#16213e] border-[#2a3a5a] text-[#a0a0b0]"
                }`}
              >
                <span className="text-left">{opt.label}</span>
                <span className="shrink-0 ml-2">−{opt.discount.toFixed(1)}%p</span>
              </button>
            ))}
          </div>
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="월 이자 (만기일시상환 기준)"
            value={won(monthlyInterest)}
            sub={`대출 ${won(loanAmt)} × 연 ${rate.toFixed(1)}%`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow
              label="대출 가능 한도"
              value={`${won(limit)} (보증금의 80%)`}
            />
            <ResultRow label="적용 예상 금리" value={`연 ${rate.toFixed(1)}%`} />
            <ResultRow label="월 이자" value={won(monthlyInterest)} />
            <ResultRow
              label="2년(기본 계약) 총 이자"
              value={won(monthlyInterest * 24)}
              strong
            />
          </div>
          {incomeN > 50_000_000 && (
            <p className="text-xs text-[#ff6b6b] mt-3 leading-relaxed">
              ⚠ 단독 세대주는 연소득 5천만원 이하만 신청 가능합니다 (신혼·2자녀
              이상 가구는 7,500만원 이하).
            </p>
          )}
          {depositN > 300_000_000 && (
            <p className="text-xs text-[#ff6b6b] mt-3 leading-relaxed">
              ⚠ 임차보증금 3억원 초과 주택은 청년전용 버팀목 대상이 아닙니다.
            </p>
          )}
        </Card>
      )}

      <Notice>
        2025년 주택도시기금 고시 기준 참고용 계산입니다. 실제 금리·한도는
        자산심사, 보증기관(HUG·HF), 은행 심사 결과에 따라 달라지며, 최신 조건은
        기금e든든(enhuf.molit.go.kr)에서 확인하세요.
      </Notice>
    </>
  );
}
