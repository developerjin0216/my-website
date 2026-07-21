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
  fmt,
  inputCls,
} from "@/components/calculators/ui";

const DAY_MS = 86_400_000;

export default function SeveranceCalcPage() {
  const [joinDate, setJoinDate] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [monthlyPay, setMonthlyPay] = useState("");
  const [annualBonus, setAnnualBonus] = useState("");
  const [leavePay, setLeavePay] = useState("");

  const join = joinDate ? new Date(joinDate) : null;
  const leave = leaveDate ? new Date(leaveDate) : null;
  const pay = Number(monthlyPay || 0);

  let serviceDays = 0;
  let days3 = 0;
  let avgDaily = 0;
  let severance = 0;

  const valid = !!(join && leave && pay > 0 && leave > join);

  if (valid && join && leave) {
    serviceDays = Math.floor((leave.getTime() - join.getTime()) / DAY_MS) + 1;

    // 퇴직일 이전 3개월의 총 일수 (달력 기준)
    const start3 = new Date(leave);
    start3.setMonth(start3.getMonth() - 3);
    start3.setDate(start3.getDate() + 1);
    days3 = Math.floor((leave.getTime() - start3.getTime()) / DAY_MS) + 1;

    const pay3 = pay * 3;
    const bonusPortion = Number(annualBonus || 0) * (3 / 12);
    const leavePortion = Number(leavePay || 0) * (3 / 12);
    avgDaily = (pay3 + bonusPortion + leavePortion) / days3;
    severance = avgDaily * 30 * (serviceDays / 365);
  }

  const underOneYear = valid && serviceDays < 365;
  const serviceYears = serviceDays / 365;

  return (
    <>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Field label="입사일">
            <input
              type="date"
              className={inputCls}
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
            />
          </Field>
          <Field label="퇴직일 (마지막 근무일)">
            <input
              type="date"
              className={inputCls}
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
            />
          </Field>
        </div>
        <Field
          label="월급 (세전, 기본급+수당)"
          hint="퇴직 전 3개월간 월평균 임금을 입력하세요"
        >
          <NumInput
            value={monthlyPay}
            onChange={setMonthlyPay}
            placeholder="3,000,000"
            suffix="원"
          />
        </Field>
        <Field label="연간 상여금 총액 (선택)">
          <NumInput
            value={annualBonus}
            onChange={setAnnualBonus}
            placeholder="0"
            suffix="원"
          />
        </Field>
        <Field label="연차수당 (연간, 선택)">
          <NumInput
            value={leavePay}
            onChange={setLeavePay}
            placeholder="0"
            suffix="원"
          />
        </Field>
      </Card>

      {valid && underOneYear && (
        <Card className="mt-4">
          <p className="text-sm text-[#ff6b6b] text-center py-2">
            재직기간이 1년 미만({fmt(serviceDays)}일)이므로 법정 퇴직금 지급
            대상이 아닙니다.
          </p>
        </Card>
      )}

      {valid && !underOneYear && (
        <Card className="mt-4">
          <BigResult
            label="예상 퇴직금 (세전)"
            value={won(severance)}
            sub={`재직 ${serviceYears.toFixed(1)}년 기준`}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="재직일수" value={`${fmt(serviceDays)}일`} />
            <ResultRow
              label="퇴직 전 3개월 일수"
              value={`${fmt(days3)}일`}
            />
            <ResultRow label="1일 평균임금" value={won(avgDaily)} />
            <ResultRow
              label="계산식"
              value={`${won(avgDaily)} × 30 × ${fmt(serviceDays)}/365`}
            />
            <ResultRow label="예상 퇴직금" value={won(severance)} strong />
          </div>
        </Card>
      )}

      <Notice>
        평균임금 기준 약식 계산입니다. 평균임금이 통상임금보다 적으면
        통상임금으로 계산해야 하며, 퇴직소득세는 별도입니다. 정확한 금액은
        고용노동부 퇴직금 계산기 또는 회사 급여 담당자를 통해 확인하세요.
      </Notice>
    </>
  );
}
