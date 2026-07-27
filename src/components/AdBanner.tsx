"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  // 광고 단위 미발급 상태(플레이스홀더 슬롯) — 유효하지 않은 push로 인한
  // 콘솔 400 에러를 막기 위해 렌더링하지 않음. 실제 슬롯 ID로 교체하면 활성화.
  const isPlaceholder = !slot || slot.startsWith("X");

  useEffect(() => {
    if (pushed.current || isPlaceholder) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ad blocker or load failure
    }
  }, [isPlaceholder]);

  if (isPlaceholder) return null;

  return (
    <div className={`flex justify-center overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3640943750342373"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
