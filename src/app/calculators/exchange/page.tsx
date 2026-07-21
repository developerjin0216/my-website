"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Field,
  NumInput,
  Segmented,
  BigResult,
  ResultRow,
  Notice,
  fmt,
  inputCls,
} from "@/components/calculators/ui";

const CURRENCIES = [
  { code: "USD", name: "미국 달러", unit: 1, flag: "🇺🇸" },
  { code: "JPY", name: "일본 엔", unit: 100, flag: "🇯🇵" },
  { code: "EUR", name: "유로", unit: 1, flag: "🇪🇺" },
  { code: "CNY", name: "중국 위안", unit: 1, flag: "🇨🇳" },
  { code: "GBP", name: "영국 파운드", unit: 1, flag: "🇬🇧" },
  { code: "AUD", name: "호주 달러", unit: 1, flag: "🇦🇺" },
  { code: "CAD", name: "캐나다 달러", unit: 1, flag: "🇨🇦" },
  { code: "HKD", name: "홍콩 달러", unit: 1, flag: "🇭🇰" },
  { code: "SGD", name: "싱가포르 달러", unit: 1, flag: "🇸🇬" },
  { code: "TWD", name: "대만 달러", unit: 1, flag: "🇹🇼" },
  { code: "THB", name: "태국 바트", unit: 1, flag: "🇹🇭" },
  { code: "VND", name: "베트남 동", unit: 100, flag: "🇻🇳" },
];

const RATE_API = "https://open.er-api.com/v6/latest/USD";

export default function ExchangeCalcPage() {
  const [code, setCode] = useState("USD");
  const [manualRate, setManualRate] = useState<string | null>(null); // 사용자가 직접 수정한 환율
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"toKrw" | "toForeign">("toKrw");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [fetchFailed, setFetchFailed] = useState(false);

  const cur = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

  // 실시간 환율(통화 unit당 원화) — 직접 입력값이 있으면 그것을 우선 사용
  const autoRate =
    rates && rates[code] && rates.KRW
      ? ((rates.KRW / rates[code]) * cur.unit).toFixed(2)
      : "";
  const rate = manualRate ?? autoRate;

  useEffect(() => {
    fetch(RATE_API)
      .then((r) => r.json())
      .then((data) => {
        if (data?.result === "success" && data.rates?.KRW) {
          setRates(data.rates);
          setUpdatedAt(
            new Date(data.time_last_update_unix * 1000).toLocaleString("ko-KR")
          );
        } else {
          setFetchFailed(true);
        }
      })
      .catch(() => setFetchFailed(true));
  }, []);

  const rateN = Number(rate || 0);
  const amountN = Number(amount || 0);
  const valid = rateN > 0 && amountN > 0;

  const converted =
    direction === "toKrw"
      ? (amountN / cur.unit) * rateN
      : (amountN / rateN) * cur.unit;

  const convertedText =
    direction === "toKrw"
      ? `${fmt(converted)}원`
      : `${converted.toLocaleString("ko-KR", { maximumFractionDigits: 2 })} ${cur.code}`;

  return (
    <>
      <Card>
        <Field label="통화 선택">
          <select
            className={inputCls}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setManualRate(null); // 통화 변경 시 실시간 환율로 복원
            }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={`환율 (${cur.unit === 100 ? "100 " : ""}${cur.code} 기준)`}
          hint={
            fetchFailed
              ? "실시간 환율을 불러오지 못했습니다. 환율을 직접 입력하세요."
              : updatedAt
                ? `실시간 환율 자동 입력됨 (${updatedAt} 기준) — 직접 수정 가능`
                : "실시간 환율 불러오는 중..."
          }
        >
          <NumInput
            value={rate}
            onChange={setManualRate}
            placeholder="1,380.50"
            suffix="원"
            comma={false}
          />
        </Field>
        <Field label="변환 방향">
          <Segmented
            options={[
              { value: "toKrw" as const, label: `${cur.code} → 원화` },
              { value: "toForeign" as const, label: `원화 → ${cur.code}` },
            ]}
            value={direction}
            onChange={setDirection}
          />
        </Field>
        <Field label={direction === "toKrw" ? `금액 (${cur.code})` : "금액 (원)"}>
          <NumInput
            value={amount}
            onChange={setAmount}
            placeholder={direction === "toKrw" ? "100" : "1,000,000"}
            suffix={direction === "toKrw" ? cur.code : "원"}
            comma={direction !== "toKrw"}
          />
        </Field>
      </Card>

      {valid && (
        <Card className="mt-4">
          <BigResult
            label={
              direction === "toKrw"
                ? `${amountN.toLocaleString("ko-KR")} ${cur.code} =`
                : `${fmt(amountN)}원 =`
            }
            value={convertedText}
          />
          <div className="border-t border-[#2a3a5a] pt-2">
            <ResultRow
              label="적용 환율"
              value={`${cur.unit === 100 ? "100 " : "1 "}${cur.code} = ${Number(rate).toLocaleString("ko-KR")}원`}
            />
            {updatedAt && <ResultRow label="환율 기준 시각" value={updatedAt} />}
          </div>
        </Card>
      )}

      <Notice>
        표시 환율은 시장 매매기준율에 해당하는 참고용 시세입니다. 실제 환전
        금액은 은행·환전소의 살 때/팔 때 환율과 우대율에 따라 달라집니다.
      </Notice>
    </>
  );
}
