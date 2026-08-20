"use client";

import { useState } from "react";
import { toHangul } from "./converter";

const PRESETS = [500_000, 1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000];

function Row({ label, value, note }: { label: string; value: string; note: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="bg-[#16213e] rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#a0a0b0]">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="text-xs font-semibold text-accent border border-[#2a3a5a] rounded-lg px-2.5 py-1 hover:border-accent"
        >
          {copied ? "✓ 복사됨" : "복사"}
        </button>
      </div>
      <p className="text-lg font-bold break-all">{value}</p>
      <p className="text-xs text-[#606070] mt-1">{note}</p>
    </div>
  );
}

export default function MoneyHangulPage() {
  const [raw, setRaw] = useState("5000000");
  const amount = Number(raw || 0);
  const result = toHangul(amount);
  const valid = amount > 0 && result.contract !== "";

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-5">
        <label className="block text-sm font-semibold mb-2">금액 (원)</label>
        <input
          type="text"
          inputMode="numeric"
          value={amount > 0 ? amount.toLocaleString("ko-KR") : ""}
          onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="5,000,000"
          className="w-full bg-[#16213e] border border-[#2a3a5a] rounded-xl px-4 py-3 text-xl font-bold outline-none focus:border-accent"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRaw(String(p))}
              className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent"
            >
              {p >= 100_000_000
                ? `${p / 100_000_000}억`
                : p >= 10_000
                  ? `${p / 10_000}만`
                  : p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {valid && (
        <div className="space-y-2.5">
          <Row
            label="계약서용 (붙여쓰기·일 명시)"
            value={result.contract}
            note="위변조 방지를 위해 붙여 쓰고 '일'을 살립니다 — 계약서·차용증·영수증에"
          />
          <Row
            label="갖은자 (한자 격식 표기)"
            value={result.gajeun}
            note="획을 더해 고쳐 쓰기 어렵게 만든 한자 — 수표·격식 문서에"
          />
          <Row
            label="읽기용"
            value={result.reading}
            note="자연스러운 한글 표기 — 말로 읽거나 일반 문서에"
          />
          <p className="text-xs text-[#606070] px-1">
            입력한 금액은 서버로 전송되지 않습니다. 표기 규칙은 아래 가이드를
            참고하세요.
          </p>
        </div>
      )}
    </div>
  );
}
