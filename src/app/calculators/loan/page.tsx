"use client";

import { Suspense, useState } from "react";
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

type Method = "equalTotal" | "equalPrincipal" | "bullet";

interface ScheduleRow {
  i: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function buildSchedule(P: number, annualRate: number, n: number, method: Method) {
  const r = annualRate / 100 / 12;
  const rows: ScheduleRow[] = [];
  let balance = P;
  let totalInterest = 0;

  if (method === "equalTotal") {
    const M =
      r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = i === n ? balance : M - interest;
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
      rows.push({ i, payment: principal + interest, principal, interest, balance });
    }
  } else if (method === "equalPrincipal") {
    const pr = P / n;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = i === n ? balance : pr;
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
      rows.push({ i, payment: principal + interest, principal, interest, balance });
    }
  } else {
    const interest = P * r;
    for (let i = 1; i <= n; i++) {
      const principal = i === n ? P : 0;
      balance = i === n ? 0 : P;
      totalInterest += interest;
      rows.push({ i, payment: principal + interest, principal, interest, balance });
    }
  }

  return { rows, totalInterest };
}

function LoanCalc() {
  // URL 쿼리와 동기화 — 계산 결과를 링크로 공유 가능
  const [amount, setAmount] = useUrlState("amount", "");
  const [rate, setRate] = useUrlState("rate", "");
  const [term, setTerm] = useUrlState("term", "");
  const [termUnit, setTermUnit] = useUrlState("unit", "year");
  const [method, setMethod] = useUrlState("method", "equalTotal");
  const [showAll, setShowAll] = useState(false);

  const P = Number(amount || 0);
  const annualRate = Number(rate || 0);
  const n = termUnit === "year" ? Number(term || 0) * 12 : Number(term || 0);
  const valid = P > 0 && annualRate >= 0 && n > 0;

  const { rows, totalInterest } = valid
    ? buildSchedule(P, annualRate, n, method as Method)
    : { rows: [] as ScheduleRow[], totalInterest: 0 };

  const bigLabel =
    method === "equalTotal"
      ? "월 상환액"
      : method === "equalPrincipal"
        ? "첫 달 상환액 (매월 감소)"
        : "월 이자";
  const bigValue = rows.length > 0 ? won(rows[0].payment) : "";

  const visibleRows = showAll ? rows : rows.slice(0, 12);

  return (
    <>
      <Card>
        <Field label="대출금액">
          <NumInput
            value={amount}
            onChange={setAmount}
            placeholder="100,000,000"
            suffix="원"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="연 이자율">
            <NumInput
              value={rate}
              onChange={setRate}
              placeholder="4.5"
              suffix="%"
              comma={false}
            />
          </Field>
          <Field label={`대출기간 (${termUnit === "year" ? "년" : "개월"})`}>
            <NumInput
              value={term}
              onChange={setTerm}
              placeholder={termUnit === "year" ? "30" : "360"}
              suffix={termUnit === "year" ? "년" : "개월"}
            />
          </Field>
        </div>
        <Field label="기간 단위">
          <Segmented
            options={[
              { value: "year", label: "년" },
              { value: "month", label: "개월" },
            ]}
            value={termUnit}
            onChange={setTermUnit}
          />
        </Field>
        <Field label="상환방식">
          <Segmented
            options={[
              { value: "equalTotal", label: "원리금균등" },
              { value: "equalPrincipal", label: "원금균등" },
              { value: "bullet", label: "만기일시" },
            ]}
            value={method}
            onChange={setMethod}
          />
        </Field>
      </Card>

      {valid && rows.length > 0 && (
        <>
          <Card className="mt-4">
            <BigResult
              label={bigLabel}
              value={bigValue}
              sub={`총 ${fmt(n)}회 납부`}
            />
            <div className="border-t border-[#2a3a5a] pt-2">
              <ResultRow label="대출원금" value={won(P)} />
              <ResultRow label="총 이자" value={won(totalInterest)} negative />
              <ResultRow label="총 상환액" value={won(P + totalInterest)} strong />
            </div>
            <ShareButton
              title="대출 이자 계산기"
              text={`대출 이자 계산: ${won(P)} · 연 ${annualRate}% → 월 ${bigValue}, 총 이자 ${won(totalInterest)} — 모두의 계산기`}
            />
          </Card>

          <Card className="mt-4">
            <h3 className="text-sm font-bold mb-3">회차별 상환 스케줄</h3>
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-3 text-xs">
              <span className="text-[#606070] pb-2">회차</span>
              <span className="text-[#606070] pb-2 text-right">상환금</span>
              <span className="text-[#606070] pb-2 text-right">이자</span>
              <span className="text-[#606070] pb-2 text-right">잔액</span>
              {visibleRows.map((row) => (
                <div key={row.i} className="contents">
                  <span className="py-1 text-[#a0a0b0]">{row.i}</span>
                  <span className="py-1 text-right">{fmt(row.payment)}</span>
                  <span className="py-1 text-right text-[#a0a0b0]">
                    {fmt(row.interest)}
                  </span>
                  <span className="py-1 text-right text-[#a0a0b0]">
                    {fmt(row.balance)}
                  </span>
                </div>
              ))}
            </div>
            {rows.length > 12 && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-3 py-2.5 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-sm text-[#a0a0b0] hover:brightness-110"
              >
                {showAll ? "접기" : `전체 ${fmt(rows.length)}회 보기`}
              </button>
            )}
          </Card>
        </>
      )}

      <Notice>
        이자는 월 단위 계산 기준이며 실제 대출은 일할 계산, 중도상환수수료,
        금리 변동 등에 따라 달라질 수 있습니다.
      </Notice>
    </>
  );
}

export default function LoanCalcPage() {
  return (
    <Suspense fallback={null}>
      <LoanCalc />
    </Suspense>
  );
}
