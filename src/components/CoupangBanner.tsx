"use client";

import { useEffect, useRef, useState } from "react";

// 쿠팡파트너스 캐러셀 배너 — 공식 위젯 스크립트(PartnersCoupang.G)가 만드는
// iframe을 직접 렌더합니다. SPA 라우팅에서도 안정적이고 SSR과 충돌하지 않으며,
// 컨테이너 폭에 맞춰 위젯 폭을 결정합니다(최대 680px).
// 대가성 문구는 공정위 심사지침상 필수라 컴포넌트에 고정 포함.

const PARTNER_ID = 1021406;
const TRACKING_CODE = "AF1870954";
const HEIGHT = 140;

export default function CoupangBanner({ className = "" }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 마운트 후 컨테이너 실측 (동기 setState 캐스케이드 방지를 위해 태스크로 지연)
    const t = setTimeout(() => {
      const w = boxRef.current?.clientWidth ?? 0;
      setWidth(Math.min(680, Math.max(300, Math.floor(w))));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const src =
    `https://ads-partners.coupang.com/widgets.html?id=${PARTNER_ID}` +
    `&template=carousel&trackingCode=${TRACKING_CODE}&subId=&width=${width}&height=${HEIGHT}`;

  return (
    <div ref={boxRef} className={className}>
      {width > 0 && (
        <iframe
          src={src}
          width={width}
          height={HEIGHT}
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 추천 상품"
          className="mx-auto block rounded-xl"
        />
      )}
      <p className="text-[10px] leading-relaxed text-[#606070] text-center mt-1.5">
        이 광고는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </p>
    </div>
  );
}
