"use client";

import { useState } from "react";
import {
  Card,
  Field,
  BigResult,
  ResultRow,
  Notice,
  inputCls,
} from "@/components/calculators/ui";

function fullUnitsBetween(a: Date, b: Date, unit: "year" | "month"): number {
  let n = 0;
  const cursor = new Date(a);
  for (;;) {
    if (unit === "year") cursor.setFullYear(cursor.getFullYear() + 1);
    else cursor.setMonth(cursor.getMonth() + 1);
    if (cursor <= b) n++;
    else break;
  }
  return n;
}

function annualLeaveFor(years: number): number {
  // 근속 years년차 이후 발생 연차 (근로기준법 제60조)
  return Math.min(15 + Math.floor((years - 1) / 2), 25);
}

export default function AnnualLeaveCalcPage() {
  const today = new Date().toISOString().split("T")[0];
  const [joinDate, setJoinDate] = useState("");
  const [baseDate, setBaseDate] = useState(today);

  const join = joinDate ? new Date(joinDate) : null;
  const base = baseDate ? new Date(baseDate) : null;
  const valid = !!(join && base && base > join);

  let years = 0;
  let months = 0;
  let current = 0;

  if (valid && join && base) {
    years = fullUnitsBetween(join, base, "year");
    months = fullUnitsBetween(join, base, "month");
    current = years < 1 ? Math.min(months, 11) : annualLeaveFor(years);
  }

  // 근속연수별 연차 표 (정적)
  const tableRows: { range: string; days: number }[] = [];
  for (let y = 1; y <= 21; y += 2) {
    tableRows.push({
      range: y === 21 ? "21년 이상" : `${y}~${y + 1}년`,
      days: annualLeaveFor(y),
    });
  }

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
          <Field label="기준일">
            <input
              type="date"
              className={inputCls}
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label={years < 1 ? "발생 연차 (월 단위)" : "올해 발생 연차"}
            value={`${current}일`}
            sub={
              years < 1
                ? `근속 ${months}개월 — 1개월 개근 시 1일씩 발생 (최대 11일)`
                : `근속 만 ${years}년 기준`
            }
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            {years < 1 ? (
              <>
                <ResultRow label="근속 개월 수" value={`${months}개월`} />
                <ResultRow
                  label="발생 연차 (개근 가정)"
                  value={`${current}일`}
                  strong
                />
              </>
            ) : (
              <>
                <ResultRow label="근속연수" value={`만 ${years}년`} />
                <ResultRow
                  label="기본 연차"
                  value="15일 (1년간 80% 이상 출근 시)"
                />
                <ResultRow
                  label="가산 연차"
                  value={`${current - 15}일 (2년마다 +1일)`}
                />
                <ResultRow label="올해 발생 연차" value={`${current}일`} strong />
              </>
            )}
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <h3 className="text-sm font-bold mb-3">근속연수별 연차 발생표</h3>
        <div className="grid grid-cols-2 gap-x-6">
          {tableRows.map((row) => (
            <div
              key={row.range}
              className="flex justify-between py-1.5 text-sm border-b border-[#2a3a5a]/50"
            >
              <span className="text-[#a0a0b0]">{row.range}</span>
              <span>{row.days}일</span>
            </div>
          ))}
        </div>
      </Card>

      <Notice>
        입사일 기준 계산이며 매월·매년 개근(출근율 80% 이상)을 가정합니다.
        회계연도 기준으로 연차를 관리하는 회사는 부여일수가 다를 수 있고, 5인
        미만 사업장은 연차휴가 규정이 적용되지 않습니다.
      </Notice>
    </>
  );
}
