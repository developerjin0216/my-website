"use client";

import { sendGAEvent } from "@next/third-parties/google";

// 제휴 링크 클릭 추적 (GA4 커스텀 이벤트 affiliate_click)
//
// 왜 필요한가: 쿠팡·토스 대시보드는 "어디서 눌렀는지"를 알려주지 않습니다.
// 이 이벤트가 없으면 어느 페이지·어느 배치가 실제 매출로 이어지는지 알 수 없어
// 노출을 늘릴지 줄일지 판단할 근거가 생기지 않습니다.
//
// GA4에서 보는 법: 보고서 → 참여도 → 이벤트 → affiliate_click.
// placement·network를 맞춤 측정기준으로 등록해야 분해해서 볼 수 있습니다
// (관리 → 맞춤 정의 → 맞춤 측정기준: 이벤트 매개변수 placement, network, label).
//
// 쿠팡 캐러셀 배너(CoupangBanner)는 쿠팡이 iframe으로 렌더하므로 클릭을 감지할
// 수 없습니다 — 추적 대상에서 제외됩니다.

export type AffiliateNetwork = "coupang" | "toss";

interface AffiliateClick {
  network: AffiliateNetwork;
  /** 배치 위치 — 컴포넌트 단위로 고정된 문자열 (예: coupang_products) */
  placement: string;
  /** 상품명·키워드 등 식별용 부가 정보 */
  label?: string;
}

export function trackAffiliateClick({
  network,
  placement,
  label,
}: AffiliateClick): void {
  try {
    sendGAEvent("event", "affiliate_click", {
      network,
      placement,
      // GA4 이벤트 매개변수 값은 100자 제한 — 초과분은 잘려서 전송됩니다
      label: label ? label.slice(0, 100) : "",
      page_path: window.location.pathname,
    });
  } catch {
    // 추적 실패가 링크 이동을 막아서는 안 됩니다 (수익이 추적보다 우선)
  }
}
