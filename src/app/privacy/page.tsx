import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 - 상식왕 퀴즈",
  description: "상식왕 퀴즈 개인정보처리방침 안내 페이지입니다.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">개인정보처리방침</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. 개인정보의 수집 및 이용 목적</h2>
            <p>
              상식왕 퀴즈(이하 &ldquo;서비스&rdquo;)는 별도의 회원가입 없이 이용할 수
              있으며, 사용자의 개인정보를 직접 수집하지 않습니다. 다만 서비스 이용
              과정에서 아래와 같은 정보가 자동으로 생성·수집될 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>퀴즈 점수 및 플레이 기록 (브라우저 로컬 스토리지에 저장, 서버 전송 없음)</li>
              <li>퀴즈 배틀 이용 시 입력한 닉네임 (게임 세션 동안만 서버에 보관)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. 쿠키 및 광고</h2>
            <p>
              본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google 및 제3자
              광고 네트워크는 쿠키를 사용하여 이전 방문 기록을 기반으로 적절한 광고를
              표시할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>
                Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  Google 광고 정책
                </a>
                에서 확인할 수 있습니다.
              </li>
              <li>
                사용자는{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  Google 광고 설정
                </a>
                에서 맞춤 광고를 비활성화할 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. 개인정보의 보관 및 파기</h2>
            <p>
              퀴즈 점수 등 이용 기록은 사용자의 브라우저 로컬 스토리지에만 저장되며,
              브라우저 데이터를 삭제하면 함께 제거됩니다. 퀴즈 배틀에서 사용한 닉네임은
              게임 세션 종료 시 서버에서 즉시 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. 이용자의 권리</h2>
            <p>
              사용자는 언제든지 브라우저의 로컬 스토리지를 삭제하여 저장된 퀴즈 기록을
              제거할 수 있습니다. 서비스 이용에 관한 문의 사항은 아래 연락처로
              문의해 주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">5. 개인정보처리방침의 변경</h2>
            <p>
              본 방침은 2026년 5월 7일부터 시행됩니다. 법령이나 서비스 변경에 따라
              내용이 추가·삭제·수정될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">6. 문의</h2>
            <p>
              개인정보 관련 문의:{" "}
              <a href="mailto:hjkwon@megastudy.net" className="text-accent underline">
                hjkwon@megastudy.net
              </a>
            </p>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <p className="text-xs text-[#606070]">
          © 2026 상식왕 퀴즈
        </p>
      </footer>
    </div>
  );
}
