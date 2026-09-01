import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "개인정보처리방침 - 8282114" },
  description:
    "8282114 생활안내·모두의 계산기·모두의 도구·상식왕 퀴즈 공통 개인정보처리방침입니다.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">개인정보처리방침</h1>
        <p className="text-xs text-[#606070] mt-1">시행일 2026-05-07 · 개정 2026-08-25</p>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">0. 적용 범위</h2>
            <p>
              본 방침은 아래 4개 서비스(이하 &ldquo;서비스&rdquo;)에 공통으로
              적용됩니다. 모든 서비스는 동일 운영자가 운영합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>8282114 생활안내 (8282114.xyz) — 긴급상황·생활 정보</li>
              <li>모두의 계산기 (calc.8282114.xyz) — 생활 계산기</li>
              <li>모두의 도구 (tools.8282114.xyz) — 웹 도구</li>
              <li>상식왕 퀴즈 (quiz.8282114.xyz) — 상식 퀴즈·배틀</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">1. 개인정보의 수집 및 이용</h2>
            <p>
              서비스는 회원가입 없이 이용할 수 있으며, 이름·연락처 등 개인정보를
              직접 수집하지 않습니다. 이용 과정에서 다루어지는 정보는 다음과
              같습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>퀴즈 점수·출석 기록: 이용자의 브라우저(로컬 스토리지)에만 저장되며 서버로 전송되지 않습니다</li>
              <li>퀴즈 배틀 닉네임: 게임 세션 동안만 서버에 보관 후 즉시 삭제됩니다</li>
              <li>계산기 입력값(연봉·금액 등): 서버로 전송·저장되지 않습니다</li>
              <li>
                <strong className="text-white">도구에 올리는 파일(사진·PDF·대화 내보내기·SNS 데이터
                등): 서버로 전송되지 않고 100% 이용자의 브라우저 안에서만
                처리됩니다.</strong> 페이지를 닫으면 사라지며, 운영자는 파일
                내용에 접근할 수 없습니다
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. 쿠키 및 광고</h2>
            <p>
              서비스는 Google AdSense 광고와 쿠팡 파트너스 제휴 배너를
              게재합니다. Google 및 제3자 광고 네트워크는 쿠키를 사용하여 이전
              방문 기록 기반의 맞춤 광고를 표시할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>
                Google 광고 쿠키:{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  Google 광고 정책
                </a>{" "}
                참고,{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  광고 설정
                </a>
                에서 맞춤 광고 비활성화 가능
              </li>
              <li>
                쿠팡 파트너스: 서비스는 쿠팡 파트너스 활동의 일환으로 일정액의
                수수료를 제공받으며, 해당 배너에는 그 사실을 함께 표시합니다
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. 방문 통계 수집</h2>
            <p>
              서비스는 Google Analytics로 방문 통계(페이지뷰, 유입 경로,
              기기·브라우저 정보)를 수집합니다. 이 정보는 개인을 식별하지 않으며
              서비스 개선 목적으로만 사용됩니다.{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                GA 차단 부가기능
              </a>
              으로 수집을 거부할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. 보관 및 파기</h2>
            <p>
              브라우저에 저장되는 기록(퀴즈 점수 등)은 이용자가 브라우저
              데이터를 삭제하면 함께 제거됩니다. 서버에 저장되는 개인정보는
              없으며, 배틀 닉네임은 세션 종료 시 즉시 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">5. 이용자의 권리와 문의</h2>
            <p>
              이용자는 언제든지 브라우저 저장 데이터를 삭제할 수 있습니다.
              개인정보 관련 문의:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">6. 방침의 변경</h2>
            <p>
              본 방침은 2026년 5월 7일 시행되었고, 2026년 8월 25일 4개 서비스
              공통 방침으로 개정되었습니다. 변경 시 본 페이지를 통해 공지합니다.
            </p>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <Link href="/about" className="text-xs text-[#606070] hover:text-[#a0a0b0]">소개</Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/contact" className="text-xs text-[#606070] hover:text-[#a0a0b0]">문의</Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/terms" className="text-xs text-[#606070] hover:text-[#a0a0b0]">이용약관</Link>
        </div>
        <p className="text-xs text-[#606070]">© 2026 8282114</p>
      </footer>
    </div>
  );
}
