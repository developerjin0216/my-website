"use client";

import { useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// 복사 버튼 — 프롬프트처럼 '가져가서 쓰는' 콘텐츠에 붙입니다.
//
// 어떤 프롬프트가 실제로 복사되는지가 이 페이지의 유일한 성과 지표입니다.
// 조회수는 스크롤만 해도 오르지만, 복사는 쓰겠다는 의사 표시라 훨씬 정직합니다.
// GA4에서 보려면 관리 → 맞춤 정의에 매개변수 label을 등록해야 합니다.

export default function CopyButton({
  text,
  label,
  className = "",
}: {
  text: string;
  /** 무엇을 복사했는지 — GA 이벤트에 실립니다 */
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 언마운트 시 타이머 정리 — 사라진 컴포넌트에 setState 하면 경고가 납니다
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
      try {
        sendGAEvent("event", "prompt_copy", { label: label.slice(0, 100) });
      } catch {
        // 추적 실패가 복사를 막아선 안 됩니다
      }
    } catch {
      // clipboard API는 보안 컨텍스트(HTTPS·localhost)에서만 동작합니다.
      // 실패하면 사용자가 직접 드래그해 복사할 수 있도록 안내만 바꿉니다.
      setCopied(false);
      alert("복사에 실패했습니다. 프롬프트를 길게 눌러 직접 복사해 주세요.");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} 프롬프트 복사`}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
        copied
          ? "bg-[#22C55E] text-[#0f1626]"
          : "bg-accent text-[#1a1a2e] active:scale-[0.97]"
      } ${className}`}
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}
