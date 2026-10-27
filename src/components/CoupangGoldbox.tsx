"use client";

import { useEffect, useState } from "react";
import { trackAffiliateClick } from "@/utils/analytics";

// 쿠팡파트너스 프로모션 배너 — 평소에는 골드박스(오늘의 특가),
// 기간 한정 행사가 있으면 그 기간 동안만 행사 배너로 바뀝니다.
//
// 링크는 파트너스 대시보드 → 링크 생성 → 이벤트/프로모션에서 발급받은
// link.coupang.com 단축링크입니다. (빈 문자열이면 아무것도 렌더링하지 않음)

const GOLDBOX_URL = "https://link.coupang.com/a/gE3FnczeLc";

// 기간 한정 행사 — url 을 비우면 평소 골드박스로 돌아갑니다.
// until 이 지나면 마운트 직후 자동으로 골드박스로 전환되므로, 원복 배포를
// 잊어도 끝난 행사 링크가 남지 않습니다. (첫 렌더 값은 서버·클라이언트가
// 같아야 하므로 expired 판정은 useEffect 에서만 합니다 — 하이드레이션 불일치 방지)
const WOW = {
  /** 와우멤버십데이 (~2026. 11. 01.) */
  url: "https://link.coupang.com/a/ibaCJeJJSe",
  /** 행사 종료 다음날 0시 (KST) */
  until: "2026-11-02T00:00:00+09:00",
  title: "🧰 쿠팡 와우멤버십데이 — 비상용품 미리 채워두기",
  sub: "손전등·보조배터리·건전지는 급할 때 사면 비쌉니다 (와우회원 전용, 11/1까지)",
};

export default function CoupangGoldbox({
  className = "",
  /** GA4 affiliate_click 의 placement — 어느 페이지 자리가 팔리는지 구분 */
  placement = "coupang_goldbox",
}: {
  className?: string;
  placement?: string;
}) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!WOW.url) return;
    // 동기 setState 캐스케이드 방지를 위해 태스크로 지연 (CoupangBanner 와 같은 패턴)
    const t = setTimeout(() => setExpired(Date.now() >= Date.parse(WOW.until)), 0);
    return () => clearTimeout(t);
  }, []);

  const wow = Boolean(WOW.url) && !expired;
  const url = wow ? WOW.url : GOLDBOX_URL;
  if (!url) return null;

  const title = wow ? WOW.title : "⚡ 쿠팡 골드박스 — 오늘만 이 가격";
  const sub = wow ? WOW.sub : "매일 아침 7시 갱신되는 초특가 상품 모음";

  return (
    <div className={className}>
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        referrerPolicy="unsafe-url"
        onClick={() =>
          trackAffiliateClick({
            network: "coupang",
            placement: wow ? `${placement}_wowday` : placement,
          })
        }
        className="block rounded-2xl p-4 bg-gradient-to-r from-[#3d2e00] to-[#5a4500] border border-[#ffd700]/40 hover:border-[#ffd700] transition-colors active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#ffd700]">{title}</p>
            <p className="text-xs text-[#d8c98a] mt-0.5">{sub}</p>
          </div>
          <span className="shrink-0 text-xs font-bold text-[#1a1a2e] bg-[#ffd700] rounded-full px-3 py-1.5">
            보러가기 →
          </span>
        </div>
      </a>
      <p className="text-[10px] leading-relaxed text-[#606070] text-center mt-1.5">
        이 광고는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </p>
    </div>
  );
}
