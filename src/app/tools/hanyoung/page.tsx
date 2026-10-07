"use client";

import { useMemo, useState } from "react";
import { koToEn, enToKo, guessDirection } from "./convert";

type Dir = "auto" | "koToEn" | "enToKo";

const SAMPLES = [
  "dkssudgktpdy",
  "rkatkgkqslek",
  "안녕하세요",
  "ㅅㄷㄴㅅ",
];

export default function HanyoungPage() {
  const [text, setText] = useState("");
  const [dir, setDir] = useState<Dir>("auto");
  const [copied, setCopied] = useState(false);

  const effective = dir === "auto" ? guessDirection(text) : dir;
  const result = useMemo(() => {
    if (!text) return "";
    return effective === "koToEn" ? koToEn(text) : enToKo(text);
  }, [text, effective]);

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const swap = () => {
    if (!result) return;
    setText(result);
    setDir(effective === "koToEn" ? "enToKo" : "koToEn");
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4">
        <div className="flex gap-1.5 mb-3">
          {(
            [
              ["auto", "자동"],
              ["enToKo", "영타 → 한글"],
              ["koToEn", "한글 → 영타"],
            ] as [Dir, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setDir(k)}
              className={`flex-1 text-xs rounded-xl py-2 border transition-colors ${
                dir === k
                  ? "border-accent text-accent font-semibold"
                  : "border-[#2a3a5a] text-[#a0a0b0] hover:border-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="자판을 바꾸지 않고 친 글자를 붙여넣으세요"
          rows={4}
          className="w-full rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent resize-y leading-relaxed"
        />

        {dir === "auto" && text && (
          <p className="text-[11px] text-[#606070] mt-1.5">
            {effective === "koToEn"
              ? "한글이 있어서 → 영타로 바꿉니다"
              : "영문만 있어서 → 한글로 바꿉니다"}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setText(s);
                setDir("auto");
              }}
              className="text-[11px] rounded-full border border-[#2a3a5a] text-[#a0a0b0] px-2.5 py-1.5 hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#a0a0b0]">
            {effective === "koToEn" ? "영타" : "한글"}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={swap}
              disabled={!result}
              className="text-xs font-semibold text-[#a0a0b0] border border-[#2a3a5a] rounded-lg px-2.5 py-1 hover:border-accent disabled:opacity-40"
            >
              ⇅ 되돌리기
            </button>
            <button
              type="button"
              onClick={copy}
              disabled={!result}
              className="text-xs font-semibold text-accent border border-[#2a3a5a] rounded-lg px-2.5 py-1 hover:border-accent disabled:opacity-40"
            >
              {copied ? "✓ 복사됨" : "복사"}
            </button>
          </div>
        </div>
        <div className="rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 min-h-[88px]">
          <p className="text-sm text-[#e8e8f0] leading-relaxed whitespace-pre-wrap break-all">
            {result || (
              <span className="text-[#606070]">여기에 결과가 나옵니다</span>
            )}
          </p>
        </div>
        <p className="text-[11px] text-[#606070] mt-2 leading-relaxed">
          변환은 브라우저 안에서만 일어나고 입력한 글은 서버로 전송되지 않습니다.
        </p>
      </div>
    </div>
  );
}
