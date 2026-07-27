import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "사이트 소개",
  description:
    "상식왕 퀴즈와 생활 계산기 서비스 소개 — 운영 목적, 콘텐츠 기준, 정보 출처를 안내합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">사이트 소개</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">무엇을 제공하나요?</h2>
            <p>
              이 사이트는 두 가지 무료 서비스를 제공합니다. 회원가입 없이 누구나
              바로 이용할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>
                <strong className="text-white">상식왕 퀴즈</strong> — 경제·IT·역사·과학 등
                10개 카테고리 1,000문제의 상식 퀴즈와 최대 10명이 함께하는
                실시간 퀴즈 배틀
              </li>
              <li>
                <strong className="text-white">생활 계산기</strong> — 연봉 실수령액, 퇴직금,
                연차, 대출 이자, 청년 버팀목 전세대출, 부동산 복비, 전기요금,
                에어컨 전기료, 환율, BMI, 칼로리까지 11종의 생활 계산기
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">콘텐츠 기준과 출처</h2>
            <p>
              계산기는 공신력 있는 기관의 고시·법령을 기준으로 만듭니다. 요율이
              바뀌면 주기적으로 갱신하며, 각 페이지에 기준 연도를 표기합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>4대보험·소득세 — 국민연금공단·국민건강보험공단 요율, 소득세법 세율</li>
              <li>퇴직금·연차 — 근로기준법, 근로자퇴직급여 보장법</li>
              <li>전기요금 — 한국전력 주택용 전기요금표</li>
              <li>중개보수 — 국토교통부 중개보수 요율 고시</li>
              <li>버팀목 전세대출 — 주택도시기금 공고</li>
            </ul>
            <p className="mt-2">
              다만 모든 계산 결과는 참고용이며, 법적 효력이 있는 정확한 금액은
              해당 기관이나 전문가를 통해 확인하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">운영 원칙</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#a0a0b0]">
              <li>모든 계산은 브라우저 안에서 처리되며 입력값을 서버로 전송하지 않습니다</li>
              <li>Google AdSense 광고로 운영되며, 광고 정책은 개인정보처리방침에서 안내합니다</li>
              <li>오류·개선 제보를 환영합니다 — 확인 후 빠르게 반영합니다</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">운영자</h2>
            <p>
              개인 개발자가 직접 만들고 운영합니다. 콘텐츠 오류 제보, 제휴 문의는{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              또는 <Link href="/contact" className="text-accent underline">문의 페이지</Link>를
              이용해 주세요.
            </p>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex justify-center gap-3 mb-2">
          <Link href="/contact" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            문의
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
