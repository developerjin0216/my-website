"use client";

import { useState } from "react";
import {
  Card,
  Field,
  NumInput,
  BigResult,
  ResultRow,
  Notice,
} from "@/components/calculators/ui";

// 대한비만학회 기준
const CATEGORIES = [
  { max: 18.5, label: "저체중", color: "#5B86E5" },
  { max: 23, label: "정상", color: "#27AE60" },
  { max: 25, label: "비만 전단계", color: "#F39C12" },
  { max: 30, label: "1단계 비만", color: "#E67E22" },
  { max: 35, label: "2단계 비만", color: "#E74C3C" },
  { max: Infinity, label: "3단계 비만", color: "#C0392B" },
];

// 게이지 표시 범위: BMI 15~40
const GAUGE_MIN = 15;
const GAUGE_MAX = 40;

export default function BmiCalcPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const h = Number(height || 0);
  const w = Number(weight || 0);
  const valid = h > 50 && w > 10;

  const hM = h / 100;
  const bmi = valid ? w / (hM * hM) : 0;
  const category = CATEGORIES.find((c) => bmi < c.max) ?? CATEGORIES[0];

  const normalMin = 18.5 * hM * hM;
  const normalMax = 22.9 * hM * hM;

  const markerPos = valid
    ? Math.min(100, Math.max(0, ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100))
    : 0;

  let diffText = "";
  if (valid) {
    if (w < normalMin) diffText = `정상 체중까지 ${(normalMin - w).toFixed(1)}kg 증량 필요`;
    else if (w > normalMax) diffText = `정상 체중까지 ${(w - normalMax).toFixed(1)}kg 감량 필요`;
    else diffText = "정상 체중 범위입니다 👍";
  }

  return (
    <>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Field label="키">
            <NumInput
              value={height}
              onChange={setHeight}
              placeholder="170"
              suffix="cm"
              comma={false}
            />
          </Field>
          <Field label="몸무게">
            <NumInput
              value={weight}
              onChange={setWeight}
              placeholder="65"
              suffix="kg"
              comma={false}
            />
          </Field>
        </div>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label="BMI (체질량지수)"
            value={bmi.toFixed(1)}
            sub={diffText}
          />
          <p
            className="text-center text-lg font-bold mb-4"
            style={{ color: category.color }}
          >
            {category.label}
          </p>

          {/* BMI 게이지 */}
          <div className="relative mb-1">
            <div className="flex h-3 rounded-full overflow-hidden">
              {CATEGORIES.map((c, i) => {
                const prev = i === 0 ? GAUGE_MIN : CATEGORIES[i - 1].max;
                const max = c.max === Infinity ? GAUGE_MAX : c.max;
                const width = ((max - prev) / (GAUGE_MAX - GAUGE_MIN)) * 100;
                return (
                  <div
                    key={c.label}
                    style={{ width: `${width}%`, backgroundColor: c.color }}
                  />
                );
              })}
            </div>
            <div
              className="absolute -top-1.5 w-1.5 h-6 bg-white rounded-full shadow"
              style={{ left: `calc(${markerPos}% - 3px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#606070] mb-4">
            <span>15</span>
            <span>18.5</span>
            <span>23</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>40</span>
          </div>

          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow
              label="정상 체중 범위 (BMI 18.5~22.9)"
              value={`${normalMin.toFixed(1)} ~ ${normalMax.toFixed(1)}kg`}
            />
            <ResultRow label="현재 체중" value={`${w}kg`} />
            <ResultRow label="판정" value={category.label} strong />
          </div>
        </Card>
      )}

      <Notice>
        대한비만학회 기준 판정입니다. BMI는 근육량·체지방을 구분하지 못하므로
        운동선수 등 근육량이 많은 경우 실제 비만도와 다를 수 있습니다.
      </Notice>
    </>
  );
}
