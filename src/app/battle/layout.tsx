import type { Metadata } from "next";
import { QUIZ_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "퀴즈 배틀",
  description:
    "친구들과 실시간 퀴즈 대결! 최대 10명이 함께 플레이하며 순위를 겨루는 멀티플레이어 퀴즈 배틀입니다.",
  alternates: { canonical: `${QUIZ_URL}/battle` },
};

// 배틀 본체는 클라이언트 컴포넌트라 크롤러에 보이지 않으므로,
// 레이아웃에서 게임 방법을 서버 렌더링해 색인 가능한 콘텐츠를 제공합니다.
export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <section className="max-w-lg mx-auto w-full px-5 py-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            퀴즈 배틀 게임 방법
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            퀴즈 배틀은 친구들과 실시간으로 같은 문제를 풀며 순위를 겨루는
            멀티플레이어 모드입니다. 닉네임만 입력하면 회원가입 없이 바로 시작할
            수 있습니다.
          </p>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 방 만들기 — 카테고리를 고르면 6자리 초대 코드가 생성됩니다</li>
            <li>• 참가하기 — 초대 코드를 입력하거나 공개 방 목록에서 입장 (최대 10명)</li>
            <li>• 진행 — 10문제를 동시에 풀고, 문제당 15초 제한</li>
            <li>• 점수 — 정답 10점, 힌트 사용 시 5점. 전원 제출 시 바로 다음 문제</li>
            <li>• 리매치 — 게임이 끝나면 같은 방에서 바로 다시 대결</li>
          </ul>
        </div>
      </section>
    </>
  );
}
