"use client";

import { useEffect, useState } from "react";
import { trackAffiliateClick } from "@/utils/analytics";

// 쿠팡파트너스 프로모션 배너 — 평소에는 골드박스(오늘의 특가),
// 기간 한정 행사가 있으면 그 기간 동안만 행사 배너로 바뀝니다.
//
// 링크는 파트너스 대시보드 → 링크 생성 → 이벤트/프로모션에서 발급받은
// link.coupang.com 단축링크입니다. (빈 문자열이면 아무것도 렌더링하지 않음)
//
// 2026-11 디자인 — 눌리게 만드는 세 가지만 넣었습니다: 마감(D-day 배지), 왜 지금인지
// 한 줄(sub), 분명한 버튼. 움직이는 효과는 넣지 않았습니다 — 애드센스 심사관 눈에
// 광고 농장처럼 보이고, 급한 일로 들어온 사람에게는 방해입니다.

const GOLDBOX_URL = "https://link.coupang.com/a/gE3FnczeLc";

// 기간 한정 행사 — 아래 목록이 비거나 url 이 비면 평소 골드박스가 나갑니다.
// until 이 지나면 마운트 직후 자동으로 골드박스로 돌아가므로 원복을 잊어도
// 끝난 링크가 살아남지 않습니다. 다만 정적 HTML 에는 재배포 전까지 행사 내용이
// 남아 첫 페인트에 잠깐 보이니, 끝나면 그 항목을 지우고 배포하세요.
// (첫 렌더 값이 서버·클라이언트에서 같아야 하므로 만료 판정과 D-day 계산은
//  useEffect 뒤에만 합니다 — 하이드레이션 불일치 방지. 서버 HTML 에는 badge 문구가,
//  마운트 뒤에는 D-5 같은 남은 날짜가 보입니다.)
//
// only = 이 행사를 띄울 자리. 비우면 전부.
//   이 컴포넌트가 들어가는 자리는 네 종류입니다:
//     home        홈
//     calculators /calculators 허브
//     tools       /tools 허브
//     help_promo  /help 중 상황 맞춤 상품도 위기 주제도 아닌 나머지
//
//   **주제와 이어지지 않는 상품 행사는 help_promo 에 넣지 마세요.**
//   "카드 분실했을 때" 페이지에 노트북 광고가 뜨는 건 애드센스 심사에서 가장 비싼
//   실수이고, 급한 일로 들어온 사람에게 팔리지도 않습니다. 와우멤버십데이는
//   "비상용품 미리 채워두기"로 묶이니 /help 에 둘 수 있지만, 맥북 사전예약처럼
//   묶을 각도가 없는 행사는 홈·도구 쪽으로만 좁힙니다.
//
//   위에서부터 먼저 맞는 항목 하나가 선택되므로, 자리가 겹치면 순서가 우선순위입니다.
interface Campaign {
  /** GA4 placement 접미사 — 어느 행사가 팔렸는지 구분 */
  key: string;
  /** 파트너스 → 링크 생성 → 이벤트/프로모션에서 발급한 link.coupang.com */
  url: string;
  /** 행사 종료 다음날 0시 (KST) */
  until: string;
  /** 왼쪽 타일에 들어가는 이모지 하나 */
  emoji: string;
  /** 제목 위 작은 라벨 — 누구 대상인지 */
  eyebrow: string;
  /** 마감 배지의 서버 렌더 문구. 마운트 뒤에는 D-day 로 바뀝니다 */
  badge: string;
  title: string;
  sub: string;
  cta: string;
  only?: string[];
}

const CAMPAIGNS: Campaign[] = [
  {
    key: "wowday",
    // 쿠팡 파트너스 프로모션 딥링크. lptag=AF1870954 가 우리 트래킹 코드입니다.
    // 확인(2026-11-02): link.coupang.com/re/AFPROMO10 → 쿠팡 MLP 랜딩(landingId=5508).
    // 랜딩 내용 자체는 확인하지 못했습니다 — 쿠팡이 데이터센터 IP 를 403 으로 막습니다
    // (CLAUDE.md 의 ITS 건과 같은 이유). 사용자가 파트너스에서 받은 와멤데 링크입니다.
    url: "https://link.coupang.com/re/AFPROMO10?lptag=AF1870954",
    // 11/8 종료 (사장님 확인, 2026-11-03) → 다음날 0시까지 노출.
    // 이 시각이 지나면 마운트 직후 평소 골드박스로 돌아갑니다. 다만 정적 HTML 에는
    // 재배포 전까지 남으니, 9일에 이 항목을 지우고 배포하는 편이 깔끔합니다.
    until: "2026-11-09T00:00:00+09:00",
    emoji: "🧰",
    eyebrow: "쿠팡 와우멤버십데이 · 와우회원 전용",
    badge: "11/8까지",
    title: "비상용품, 급할 때 사면 제일 비쌉니다",
    sub: "손전등 · 보조배터리 · 건전지 · 핫팩 — 한파 오기 전에 할인가로 채워두세요",
    cta: "할인가 보기",
    // only 없음 = 네 자리 전부. 와멤데는 '비상용품' 각도로 /help 까지 묶입니다.
    // 맥북 사전예약 링크가 오면 이 위에 only: ["home","tools"] 로 넣으세요 —
    // 위에서부터 먼저 맞는 항목이 이기므로 홈·도구만 맥북으로 갈립니다.
  },
];

const GOLDBOX = {
  emoji: "⚡",
  eyebrow: "쿠팡 골드박스 · 오늘의 특가",
  badge: "매일 07시 갱신",
  title: "오늘만 이 가격",
  sub: "매일 아침 7시 갱신되는 초특가 상품 모음",
  cta: "오늘 특가 보기",
};

const DAY_MS = 86_400_000;

export default function CoupangGoldbox({
  className = "",
  /** GA4 affiliate_click 의 placement — 어느 페이지 자리가 팔리는지 구분 */
  placement = "coupang_goldbox",
}: {
  className?: string;
  placement?: string;
}) {
  // 0 = 아직 모름(서버 렌더와 첫 클라이언트 렌더). 마운트 후에만 만료를 따집니다.
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (CAMPAIGNS.length === 0) return;
    // 동기 setState 캐스케이드 방지를 위해 태스크로 지연 (CoupangBanner 와 같은 패턴)
    const t = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(t);
  }, []);

  const campaign = CAMPAIGNS.find(
    (c) =>
      c.url &&
      (!c.only || c.only.includes(placement)) &&
      (now === 0 || now < Date.parse(c.until))
  );

  const url = campaign ? campaign.url : GOLDBOX_URL;
  if (!url) return null;

  const view = campaign ?? GOLDBOX;

  // 남은 날짜 — 마운트 뒤에만. until 은 종료 다음날 0시라 floor 가 "마감일까지 며칠"이 됩니다.
  let badge = view.badge;
  if (campaign && now) {
    const daysLeft = Math.floor((Date.parse(campaign.until) - now) / DAY_MS);
    badge = daysLeft >= 2 ? `D-${daysLeft}` : daysLeft === 1 ? "내일 마감" : "오늘 마감";
  }

  return (
    <div className={className}>
      <a
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener"
        referrerPolicy="unsafe-url"
        aria-label={`${view.eyebrow} — ${view.title}. ${view.cta}`}
        onClick={() =>
          trackAffiliateClick({
            network: "coupang",
            // 행사분은 접미사를 달아 평소 골드박스와, 행사끼리도 갈라 봅니다
            placement: campaign ? `${placement}_${campaign.key}` : placement,
          })
        }
        className="group relative block overflow-hidden rounded-2xl border border-[#ffd700]/45 bg-gradient-to-br from-[#1c2444] via-[#2a2518] to-[#4d3b00] p-4 transition-all hover:border-[#ffd700] hover:shadow-[0_0_28px_rgba(255,215,0,0.22)] active:scale-[0.99]"
      >
        {/* 오른쪽 위 금빛 번짐 — 장식, 클릭 방해 안 함 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.30),transparent_65%)]"
        />

        <div className="relative flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-bold tracking-wide text-[#ffd700]/85">
            {view.eyebrow}
          </span>
          <span className="shrink-0 rounded-full bg-[#ffd700] px-2 py-0.5 text-[10px] font-extrabold text-[#1a1a2e]">
            {badge}
          </span>
        </div>

        <div className="relative mt-2.5 flex items-center gap-3.5">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ffd700]/30 bg-[#ffd700]/10 text-3xl leading-none transition-transform group-hover:scale-105"
          >
            {view.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold leading-snug text-[#fff3c4] break-keep">
              {view.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#d9cc90] break-keep">
              {view.sub}
            </p>
          </div>
        </div>

        <div className="relative mt-3.5 flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#a89a5a]">쿠팡으로 이동합니다</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#ffd700] px-4 py-2 text-xs font-extrabold text-[#1a1a2e] shadow-[0_2px_12px_rgba(255,215,0,0.35)] transition-transform group-hover:translate-x-0.5">
            {view.cta}
            <span aria-hidden="true">→</span>
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
