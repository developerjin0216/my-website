import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "상식왕 퀴즈·생활 계산기 문의 페이지 — 오류 제보, 광고·제휴 문의를 받습니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">문의하기</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">문의 이메일</h2>
            <p>
              모든 문의는 아래 이메일로 보내주세요. 확인 후 순차적으로 답변드리며,
              보통 2~3일 이내에 회신합니다.
            </p>
            <p className="mt-3 text-center">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block bg-[#16213e] border border-[#2a3a5a] rounded-xl px-5 py-3 text-accent font-semibold hover:border-accent transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">이런 문의를 받습니다</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#a0a0b0]">
              <li>
                <strong className="text-white">오류 제보</strong> — 퀴즈 문제·해설 오류,
                계산기 요율·계산 결과 오류 (해당 페이지 주소를 함께 보내주시면
                빠르게 확인할 수 있습니다)
              </li>
              <li>
                <strong className="text-white">콘텐츠 제안</strong> — 추가되었으면 하는
                퀴즈 카테고리나 계산기
              </li>
              <li>
                <strong className="text-white">광고·제휴</strong> — 광고 게재, 콘텐츠 제휴 문의
              </li>
              <li>
                <strong className="text-white">개인정보</strong> — 개인정보 처리 관련 문의
                (자세한 내용은 개인정보처리방침 참고)
              </li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex justify-center gap-3 mb-2">
          <Link href="/about" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            소개
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/privacy" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            개인정보처리방침
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/terms" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            이용약관
          </Link>
        </div>
        <p className="text-xs text-[#606070]">© 2026 상식왕 퀴즈 · 생활 계산기</p>
      </footer>
    </div>
  );
}
