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

        <div className="bg-card rounded-2xl p-5 mt-4">
          <h2 className="text-base font-bold mb-3 text-accent">점수는 이렇게 계산됩니다</h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            정답을 맞히면 10점입니다. 힌트를 열고 맞히면 5점이 됩니다. 틀리면 0점이고,
            시간 안에 답을 내지 못해도 0점 처리됩니다. 빨리 누른다고 점수가 더 붙지는
            않기 때문에, 급하게 찍기보다 15초를 온전히 쓰는 편이 유리합니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            같은 방의 모두가 답을 제출하면 남은 시간을 기다리지 않고 바로 다음 문제로
            넘어갑니다. 한 명이라도 고민 중이면 15초를 다 채웁니다. 문제 사이에는 정답과
            해설이 잠시 표시되므로, 틀린 문제도 그 자리에서 짚고 넘어갈 수 있습니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            힌트는 한 번 열면 그 문제에서는 점수가 절반이 됩니다. 확실히 모르겠는 문제에만
            쓰는 것이 순위에 유리합니다. 열 문제가 끝나면 총점 순으로 순위가 나오고,
            동점이면 같은 순위로 표시됩니다.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 mt-4">
          <h2 className="text-base font-bold mb-3 text-accent">이럴 때 쓰기 좋습니다</h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            같은 자리에 모여 있을 때보다 <strong className="text-[#c8c8d8]">떨어져
            있을 때</strong> 쓸모가 큽니다. 단톡방에 초대 코드만 던지면 각자 자기 휴대폰으로
            들어와 동시에 같은 문제를 풉니다. 화상 통화를 켜놓고 함께 하면 반응까지 볼 수
            있어 더 재미있습니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            모임 아이스브레이킹, 동아리 활동, 가족 모임처럼 나이대가 섞인 자리에서는
            카테고리 선택이 중요합니다. 특정 세대만 아는 분야를 고르면 한쪽이 일방적으로
            이겨서 금방 시들해집니다. 상식이나 속담처럼 두루 걸치는 분야가 무난합니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            혼자 연습하고 싶다면 배틀 대신 혼자 풀기 모드를 쓰는 편이 낫습니다. 같은
            문제은행에서 출제되고 시간 제한도 같아서, 배틀 전에 감을 잡아두기 좋습니다.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 mt-4">
          <h2 className="text-base font-bold mb-3 text-accent">자주 묻는 질문</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-[#e8e8f0] mb-1">
                회원가입이나 앱 설치가 필요한가요?
              </p>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">
                필요 없습니다. 닉네임만 정하면 바로 들어갑니다. 닉네임은 같은 시간대에
                접속한 사람들 사이에서 겹치지 않아야 해서, 이미 쓰는 이름이면 다른 이름을
                입력해 달라는 안내가 나옵니다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#e8e8f0] mb-1">
                몇 명까지 같이 할 수 있나요?
              </p>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">
                한 방에 최대 10명입니다. 그보다 많으면 방을 두 개로 나눠 각각 진행한 뒤
                점수를 비교하는 방법이 있습니다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#e8e8f0] mb-1">
                중간에 나가면 어떻게 되나요?
              </p>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">
                남은 사람들끼리 게임이 계속됩니다. 방을 만든 사람이 나가면 다음 사람이
                자동으로 방장이 되고, 모두 나가면 방은 사라집니다. 연결이 끊겼다가 다시
                들어오면 진행 중인 문제부터 참여할 수 있습니다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#e8e8f0] mb-1">
                문제는 매번 달라지나요?
              </p>
              <p className="text-xs text-[#a0a0b0] leading-relaxed">
                방을 만들 때마다 해당 카테고리의 문제은행에서 무작위로 열 문제를
                뽑습니다. 분야마다 100문제씩 들어 있어서 같은 조합이 연달아 나올 일은
                거의 없습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
