import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 - 상식왕 퀴즈",
  description: "상식왕 퀴즈 서비스 이용약관 안내 페이지입니다.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">이용약관</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 상식왕 퀴즈(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여
              서비스 제공자와 이용자 간의 권리, 의무 및 기타 필요한 사항을 규정함을
              목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제2조 (서비스 내용)</h2>
            <p>서비스는 다음과 같은 기능을 무료로 제공합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>10개 카테고리, 1,000문제의 상식 퀴즈</li>
              <li>매일 새로운 오늘의 퀴즈</li>
              <li>실시간 퀴즈 배틀 (최대 10명)</li>
              <li>오답 노트 및 풀이 해설</li>
              <li>오늘의 명언</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제3조 (이용 조건)</h2>
            <p>
              서비스는 별도의 회원가입 없이 누구나 이용할 수 있습니다. 퀴즈 배틀
              이용 시 닉네임을 입력해야 하며, 해당 닉네임은 게임 세션 동안에만
              사용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제4조 (이용자의 의무)</h2>
            <p>이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>타인에게 불쾌감을 주는 닉네임 사용</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>서비스를 이용한 영리 목적의 활동</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제5조 (서비스의 변경 및 중단)</h2>
            <p>
              서비스 제공자는 운영상 또는 기술상의 필요에 따라 서비스의 전부 또는
              일부를 변경하거나 중단할 수 있습니다. 이 경우 사전에 서비스 내
              공지사항을 통해 안내합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제6조 (면책 조항)</h2>
            <p>
              서비스에서 제공하는 퀴즈 문제와 해설은 참고용이며, 정보의 정확성을
              보장하지 않습니다. 서비스 이용으로 발생하는 문제에 대해 서비스
              제공자는 법적 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제7조 (약관의 변경)</h2>
            <p>
              본 약관은 2026년 5월 7일부터 시행됩니다. 약관이 변경될 경우 본
              페이지를 통해 공지하며, 변경된 약관은 공지 후 7일이 경과한 시점부터
              효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제8조 (문의)</h2>
            <p>
              서비스 이용 관련 문의:{" "}
              <a href="mailto:developerjin0216@gmail.com" className="text-accent underline">
                developerjin0216@gmail.com
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
