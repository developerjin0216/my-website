"use client";

// 쿠팡파트너스 골드박스(오늘의 특가) 프로모션 배너
// GOLDBOX_URL: 파트너스 대시보드 → 링크 생성 → 이벤트/프로모션 → 골드박스에서
// 발급받은 link.coupang.com 단축링크를 넣으면 배너가 활성화됩니다.
// (빈 문자열이면 아무것도 렌더링하지 않음 — 안전 배포용)

const GOLDBOX_URL = "";

export default function CoupangGoldbox({ className = "" }: { className?: string }) {
  if (!GOLDBOX_URL) return null;

  return (
    <div className={className}>
      <a
        href={GOLDBOX_URL}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="block rounded-2xl p-4 bg-gradient-to-r from-[#3d2e00] to-[#5a4500] border border-[#ffd700]/40 hover:border-[#ffd700] transition-colors active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#ffd700]">
              ⚡ 쿠팡 골드박스 — 오늘만 이 가격
            </p>
            <p className="text-xs text-[#d8c98a] mt-0.5">
              매일 아침 7시 갱신되는 초특가 상품 모음
            </p>
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
