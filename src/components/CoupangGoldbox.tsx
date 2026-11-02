"use client";

import { useEffect, useState } from "react";
import { trackAffiliateClick } from "@/utils/analytics";

// 쿠팡파트너스 프로모션 배너 — 평소에는 골드박스(오늘의 특가),
// 기간 한정 행사가 있으면 그 기간 동안만 행사 배너로 바뀝니다.
//
// 링크는 파트너스 대시보드 → 링크 생성 → 이벤트/프로모션에서 발급받은
// link.coupang.com 단축링크입니다. (빈 문자열이면 아무것도 렌더링하지 않음)

const GOLDBOX_URL = "https://link.coupang.com/a/gE3FnczeLc";

// 기간 한정 행사 — 아래 목록이 비거나 url 이 비면 평소 골드박스가 나갑니다.
// until 이 지나면 마운트 직후 자동으로 골드박스로 돌아가므로 원복을 잊어도
// 끝난 링크가 살아남지 않습니다. 다만 정적 HTML 에는 재배포 전까지 행사 내용이
// 남아 첫 페인트에 잠깐 보이니, 끝나면 그 항목을 지우고 배포하세요.
// (첫 렌더 값이 서버·클라이언트에서 같아야 하므로 만료 판정은 useEffect 에서만
//  합니다 — 하이드레이션 불일치 방지)
//
// only = 이 행사를 띄울 자리. 비우면 전부.
//   이 컴포넌트가 들어가는 자리는 네 종류입니다:
//     home        홈
//     calculators /calculators 허브
//     tools       /tools 허브
//     help_promo  /help 11편 (상황 맞춤 상품도 위기 주제도 아닌 나머지)
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
  title: string;
  sub: string;
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
    // ⚠️ 임시값 — 실제 종료일을 받으면 바꿔야 합니다. 내부 안전장치일 뿐이고
    //    화면에는 날짜를 쓰지 않으므로, 틀려도 사용자에게 거짓 날짜가 보이진 않습니다.
    until: "2026-11-16T00:00:00+09:00",
    // 문구에 "11/X까지"를 쓰지 않는 이유: 종료일을 모르는 채로 날짜를 쓰면
    // 그게 곧 지어낸 숫자입니다. 기간은 쿠팡 랜딩이 알려 줍니다.
    title: "🧰 쿠팡 와우멤버십데이 — 비상용품 미리 채워두기",
    sub: "손전등·보조배터리·건전지는 급할 때 사면 비쌉니다 (와우회원 전용)",
    // only 없음 = 네 자리 전부. 와멤데는 '비상용품' 각도로 /help 까지 묶입니다.
    // 맥북 사전예약 링크가 오면 이 위에 only: ["home","tools"] 로 넣으세요 —
    // 위에서부터 먼저 맞는 항목이 이기므로 홈·도구만 맥북으로 갈립니다.
  },
];

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

  const title = campaign ? campaign.title : "⚡ 쿠팡 골드박스 — 오늘만 이 가격";
  const sub = campaign ? campaign.sub : "매일 아침 7시 갱신되는 초특가 상품 모음";

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
            // 행사분은 접미사를 달아 평소 골드박스와, 행사끼리도 갈라 봅니다
            placement: campaign ? `${placement}_${campaign.key}` : placement,
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
