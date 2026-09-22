"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import CopyButton from "@/components/CopyButton";

// 프롬프트 카드 — 본문은 버튼을 눌러야 펼쳐집니다.
//
// 중요: 본문을 조건부 렌더링(펼쳤을 때만 <p>를 만드는 것)하면 안 됩니다.
// 서버 렌더 HTML에서 프롬프트 전문이 통째로 빠져버리고, 이 페이지는 프롬프트
// 텍스트 자체가 콘텐츠라 색인할 게 없어집니다. 그래서 DOM에는 항상 넣고
// CSS(hidden)로만 감춥니다. 접힌 아코디언 안의 텍스트는 검색엔진이 정상적으로
// 읽습니다.
//
// 펼침을 GA로 셉니다. 스크롤하다 지나간 것과 실제로 관심을 보인 것을 구분하는
// 유일한 방법이고, 복사까지 간 비율을 보면 어떤 프롬프트가 기대에 못 미쳤는지도
// 드러납니다.

export default function PromptCard({
  id,
  title,
  body,
  why,
  tip,
  caution,
}: {
  id: string;
  title: string;
  body: string;
  why: string;
  tip: string;
  caution: string;
}) {
  const [open, setOpen] = useState(false);
  const [counted, setCounted] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !counted) {
      setCounted(true);
      try {
        sendGAEvent("event", "prompt_open", { label: title.slice(0, 100) });
      } catch {
        // 추적 실패가 펼침을 막아선 안 됩니다
      }
    }
  };

  const panelId = `prompt-body-${id}`;

  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-lg font-bold text-accent break-keep">{title}</h2>
        <CopyButton text={body} label={title} />
      </div>

      <p className="text-[13px] text-[#a0a0b0] leading-relaxed break-keep mb-3">
        <span className="font-bold text-[#e8e8f0]">왜 해볼 만한가 </span>
        {why}
      </p>

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full rounded-xl border border-[#2a3a5a] bg-[#16213e] px-4 py-3 text-sm font-semibold text-[#c8c8d8] hover:border-accent transition-colors flex items-center justify-between gap-2"
      >
        <span>{open ? "프롬프트 접기" : "프롬프트 전문 보기"}</span>
        <span className="text-[#606070] text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* hidden 속성으로만 감춥니다 — DOM에는 항상 있어야 색인됩니다 */}
      <div id={panelId} hidden={!open} className="mt-3">
        <div className="rounded-xl bg-[#0f1626] border border-[#2a3a5a] p-4">
          <p className="text-[13px] leading-relaxed text-[#d8dce8] break-keep whitespace-pre-wrap select-all">
            {body}
          </p>
        </div>

        <p className="text-[13px] text-[#a0a0b0] leading-relaxed break-keep mt-3">
          <span className="font-bold text-[#e8e8f0]">더 잘 뽑으려면 </span>
          {tip}
        </p>

        {caution && (
          <p className="text-xs text-[#d8c98a] leading-relaxed break-keep mt-3 rounded-lg bg-[#3d2e00]/30 border border-[#ffd700]/25 px-3 py-2">
            ⚠ {caution}
          </p>
        )}

        <div className="mt-3 flex justify-end">
          <CopyButton text={body} label={title} />
        </div>
      </div>
    </>
  );
}
