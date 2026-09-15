"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick, type AffiliateNetwork } from "@/utils/analytics";

// 클릭이 추적되는 제휴 링크 — 서버 컴포넌트 안에서도 쓸 수 있도록 분리했습니다.
// (onClick 핸들러 때문에 링크만 클라이언트 컴포넌트로 떼어낸 것)

export default function AffiliateLink({
  href,
  network,
  placement,
  label,
  className,
  children,
}: {
  href: string;
  network: AffiliateNetwork;
  placement: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      onClick={() => trackAffiliateClick({ network, placement, label })}
      className={className}
    >
      {children}
    </a>
  );
}
