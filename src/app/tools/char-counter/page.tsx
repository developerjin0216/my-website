"use client";

import { useMemo, useState } from "react";
import {
  count,
  truncateTo,
  LIMIT_LABELS,
  type LimitBasis,
} from "./counter";

// 자주 쓰는 제한값 — 기준이 제각각이라 기준까지 같이 넣어둡니다
const PRESETS: { label: string; limit: number; basis: LimitBasis }[] = [
  { label: "자소서 500자", limit: 500, basis: "charsWithSpace" },
  { label: "자소서 1,000자", limit: 1000, basis: "charsWithSpace" },
  { label: "자소서 1,500자", limit: 1500, basis: "charsWithSpace" },
  { label: "1,000바이트", limit: 1000, basis: "bytes2WithSpace" },
  { label: "2,000바이트", limit: 2000, basis: "bytes2WithSpace" },
];

function Stat({
  label,
  value,
  unit = "",
  note,
  strong = false,
}: {
  label: string;
  value: number;
  unit?: string;
  note?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        strong ? "bg-[#3d2e00]/40 border border-[#ffd700]/40" : "bg-[#16213e]"
      }`}
    >
      <p className="text-[11px] text-[#a0a0b0]">{label}</p>
      <p
        className={`font-bold tabular-nums ${
          strong ? "text-xl text-accent" : "text-base text-[#e8e8f0]"
        }`}
      >
        {value.toLocaleString("ko-KR")}
        <span className="text-[11px] font-normal text-[#8a90a0] ml-0.5">
          {unit}
        </span>
      </p>
      {note && <p className="text-[10px] text-[#606070] mt-0.5">{note}</p>}
    </div>
  );
}

export default function CharCounterPage() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState<number | "">("");
  const [basis, setBasis] = useState<LimitBasis>("charsWithSpace");
  const [copied, setCopied] = useState(false);

  const r = useMemo(() => count(text), [text]);

  const limitN = typeof limit === "number" ? limit : 0;
  const used = r[basis];
  const left = limitN - used;
  const over = limitN > 0 && left < 0;

  const applyTruncate = () => {
    if (limitN <= 0) return;
    setText(truncateTo(text, limitN, basis));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 붙여넣으세요. 입력하는 동안 바로 계산됩니다."
          rows={10}
          className="w-full rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent resize-y leading-relaxed"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => setText("")}
            disabled={!text}
            className="flex-1 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] text-sm font-semibold py-2.5 disabled:opacity-40"
          >
            지우기
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!text}
            className="flex-1 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] text-sm font-semibold py-2.5 disabled:opacity-40"
          >
            {copied ? "✓ 복사됨" : "본문 복사"}
          </button>
        </div>
        <p className="text-[11px] text-[#606070] mt-2 leading-relaxed">
          입력한 글은 브라우저 안에서만 계산되고 서버로 전송되지 않습니다.
        </p>
      </div>

      {/* 기준별 숫자 — 이 도구의 핵심. 공고에 적힌 제한이 어느 기준인지 몰라서
          헤매는 경우가 대부분입니다 */}
      <div className="bg-card rounded-2xl p-4">
        <h2 className="text-sm font-bold text-accent mb-3">기준별 글자수</h2>
        <div className="grid grid-cols-2 gap-2">
          <Stat
            label="공백 포함"
            value={r.charsWithSpace}
            unit="자"
            note="채용 입력창 대부분"
            strong
          />
          <Stat label="공백 제외" value={r.charsNoSpace} unit="자" />
          <Stat
            label="줄바꿈 제외"
            value={r.charsHwp}
            unit="자"
            note="한글(HWP) 문서 통계"
          />
          <Stat label="원고지" value={r.manuscript} unit="매" note="200자 기준" />
        </div>

        <h2 className="text-sm font-bold text-accent mt-4 mb-3">바이트</h2>
        <div className="grid grid-cols-2 gap-2">
          <Stat
            label="2바이트 · 공백 포함"
            value={r.bytes2WithSpace}
            unit="B"
            note="기업 채용 시스템"
            strong
          />
          <Stat
            label="2바이트 · 공백 제외"
            value={r.bytes2NoSpace}
            unit="B"
          />
          <Stat
            label="UTF-8 실제"
            value={r.bytesUtf8}
            unit="B"
            note="한글 3바이트"
          />
          <Stat label="단어" value={r.words} unit="개" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Stat label="줄" value={r.lines} unit="줄" />
          <Stat label="문장" value={r.sentences} unit="개" />
        </div>

        {r.hasCombining && (
          <p className="text-[11px] text-[#d8c98a] leading-relaxed mt-3">
            이모지나 조합형 문자가 섞여 있습니다. 여기서는 <strong>눈에 보이는
            대로</strong> 셉니다. 사이트에 따라 이런 문자를 2~4글자로 세는 곳이
            있어서, 제한에 아슬아슬하면 실제 입력창에서 다시 확인하세요.
          </p>
        )}
      </div>

      {/* 제한 확인 */}
      <div className="bg-card rounded-2xl p-4">
        <h2 className="text-sm font-bold text-accent mb-3">제한 확인</h2>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setLimit(p.limit);
                setBasis(p.basis);
              }}
              className={`text-[11px] rounded-full px-2.5 py-1.5 border transition-colors ${
                limit === p.limit && basis === p.basis
                  ? "border-accent text-accent"
                  : "border-[#2a3a5a] text-[#a0a0b0] hover:border-accent"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={limit}
            onChange={(e) =>
              setLimit(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="제한값"
            className="w-28 shrink-0 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent"
          />
          <select
            value={basis}
            onChange={(e) => setBasis(e.target.value as LimitBasis)}
            className="flex-1 min-w-0 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent"
          >
            {(Object.keys(LIMIT_LABELS) as LimitBasis[]).map((k) => (
              <option key={k} value={k}>
                {LIMIT_LABELS[k]}
              </option>
            ))}
          </select>
        </div>

        {limitN > 0 && (
          <div className="mt-3">
            <div className="h-2 rounded-full bg-[#0f1626] overflow-hidden">
              <div
                className={`h-full transition-[width] ${
                  over ? "bg-[#EF4444]" : "bg-accent"
                }`}
                style={{
                  width: `${Math.min(100, (used / limitN) * 100).toFixed(1)}%`,
                }}
              />
            </div>
            <p className="text-sm mt-2">
              {over ? (
                <>
                  <span className="text-[#EF4444] font-bold">
                    {Math.abs(left).toLocaleString("ko-KR")} 초과
                  </span>
                  <span className="text-[#a0a0b0]">
                    {" "}
                    — {used.toLocaleString("ko-KR")} / {limitN.toLocaleString("ko-KR")}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-accent font-bold">
                    {left.toLocaleString("ko-KR")} 남음
                  </span>
                  <span className="text-[#a0a0b0]">
                    {" "}
                    — {used.toLocaleString("ko-KR")} / {limitN.toLocaleString("ko-KR")}
                  </span>
                </>
              )}
            </p>
            {over && (
              <button
                type="button"
                onClick={applyTruncate}
                className="w-full mt-2 rounded-xl bg-accent text-[#1a1a2e] font-bold py-2.5 text-sm active:scale-[0.99] transition-transform"
              >
                제한에 맞게 잘라내기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
