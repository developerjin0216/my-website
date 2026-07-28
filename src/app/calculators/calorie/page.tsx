"use client";

import { useState } from "react";
import {
  Card,
  Field,
  NumInput,
  Segmented,
  ResultRow,
  Notice,
  fmt,
  inputCls,
} from "@/components/calculators/ui";

const ACTIVITY_LEVELS = [
  { factor: 1.2, label: "거의 없음 — 좌식 생활" },
  { factor: 1.375, label: "가벼움 — 주 1~3회 운동" },
  { factor: 1.55, label: "보통 — 주 3~5회 운동" },
  { factor: 1.725, label: "활발함 — 주 6~7회 운동" },
  { factor: 1.9, label: "매우 활발 — 육체노동·하루 2회 운동" },
];

export default function CalorieCalcPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState(1.375);

  const ageN = Number(age || 0);
  const h = Number(height || 0);
  const w = Number(weight || 0);
  const valid = ageN > 0 && h > 50 && w > 10;

  // Mifflin-St Jeor 공식
  const bmr = valid
    ? 10 * w + 6.25 * h - 5 * ageN + (gender === "male" ? 5 : -161)
    : 0;
  const tdee = bmr * activity;
  const cutCal = Math.max(tdee - 500, 0);

  const goals = [
    { label: "감량", value: cutCal, desc: "주 약 0.5kg 감량", color: "#5B86E5" },
    { label: "유지", value: tdee, desc: "현재 체중 유지", color: "#27AE60" },
    { label: "증량", value: tdee + 500, desc: "주 약 0.5kg 증량", color: "#F39C12" },
  ];

  return (
    <>
      <Card>
        <Field label="성별">
          <Segmented
            options={[
              { value: "male" as const, label: "남성" },
              { value: "female" as const, label: "여성" },
            ]}
            value={gender}
            onChange={setGender}
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="나이">
            <NumInput value={age} onChange={setAge} placeholder="30" suffix="세" />
          </Field>
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
        <Field label="활동량">
          <select
            className={inputCls}
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
          >
            {ACTIVITY_LEVELS.map((lv) => (
              <option key={lv.factor} value={lv.factor}>
                {lv.label}
              </option>
            ))}
          </select>
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {goals.map((g) => (
              <div
                key={g.label}
                className="bg-[#16213e] rounded-xl p-3 text-center"
              >
                <p className="text-xs font-semibold" style={{ color: g.color }}>
                  {g.label}
                </p>
                <p className="text-lg font-bold mt-1">{fmt(g.value)}</p>
                <p className="text-[10px] text-[#606070]">kcal/일</p>
                <p className="text-[10px] text-[#a0a0b0] mt-1">{g.desc}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow label="기초대사량 (BMR)" value={`${fmt(bmr)} kcal`} />
            <ResultRow
              label="하루 총 소비 칼로리 (TDEE)"
              value={`${fmt(tdee)} kcal`}
              strong
            />
          </div>
          {cutCal < bmr && cutCal > 0 && (
            <p className="text-xs text-[#ff6b6b] mt-3 leading-relaxed">
              ⚠ 감량 목표 칼로리가 기초대사량보다 낮습니다. 장기간 유지 시
              근손실·대사 저하 위험이 있으니 감량 폭을 줄이는 것을 권장합니다.
            </p>
          )}
        </Card>
      )}

      <Notice>
        Mifflin-St Jeor 공식 기준 추정치입니다. 개인의 근육량, 대사 상태에 따라
        실제 소비 칼로리는 달라질 수 있습니다.
      </Notice>
    </>
  );
}
