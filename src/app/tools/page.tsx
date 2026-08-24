import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/data/tools";
import {
  TOOLS_URL,
  TOOLS_SITE_NAME,
  ROOT_URL,
  QUIZ_URL,
  CALC_URL,
} from "@/lib/site";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";

// 모두의 도구 허브 — tools 서브도메인의 루트(/)로 rewrite되어 서빙됩니다 (src/proxy.ts)

export const metadata: Metadata = {
  title: { absolute: "모두의 도구 - 로그인 없이 쓰는 무료 웹 도구" },
  description:
    "인스타그램·쓰레드 언팔 확인(맞팔 체크)부터 — 비밀번호 입력 없이, 파일이 서버로 전송되지 않는 안전한 무료 웹 도구 모음입니다.",
  alternates: { canonical: TOOLS_URL },
  openGraph: {
    title: "모두의 도구 - 로그인 없이 쓰는 무료 웹 도구",
    description:
      "인스타 언팔 확인 등 개인정보 안전(브라우저 처리) 무료 도구 모음",
    url: TOOLS_URL,
    siteName: TOOLS_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

export default function ToolsHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: TOOLS_SITE_NAME,
    url: TOOLS_URL,
    description: "로그인 없이 브라우저에서만 동작하는 무료 웹 도구 모음",
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bg-header px-5 py-8 text-center">
        <h1 className="text-3xl font-bold text-accent">🧰 {TOOLS_SITE_NAME}</h1>
        <p className="text-sm text-[#a0a0b0] mt-2">
          로그인 없이 · 파일 전송 없이 · 브라우저에서만 동작하는 무료 도구
        </p>
      </header>

      <div className="px-5 py-5 space-y-5">
        {/* 도구 목록 */}
        <div className="space-y-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="block bg-card rounded-2xl p-5 border border-[#2a3a5a] hover:border-accent transition-colors active:scale-[0.99]"
            >
              <p className="text-base font-bold">
                <span aria-hidden="true">{tool.icon}</span> {tool.name}
              </p>
              <p className="text-sm text-[#a0a0b0] mt-1">{tool.card}</p>
            </Link>
          ))}
        </div>

        <AdBanner slot="XXXXXXXXXX" format="auto" />

        <CoupangBanner />

        {/* SEO 소개 */}
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">
            {TOOLS_SITE_NAME}는 이렇게 다릅니다
          </h2>
          <ul className="text-sm text-[#a0a0b0] leading-relaxed space-y-2 break-keep">
            <li>
              • <strong className="text-[#e8e8f0]">비밀번호를 묻지 않습니다</strong> —
              계정 연동·로그인 없이 공식 내보내기 파일만으로 동작합니다.
            </li>
            <li>
              • <strong className="text-[#e8e8f0]">파일이 서버로 가지 않습니다</strong> —
              모든 분석은 사용자의 브라우저 안에서 실행되고, 페이지를 닫으면
              사라집니다.
            </li>
            <li>
              • <strong className="text-[#e8e8f0]">무료·회원가입 없음</strong> —
              광고로 운영됩니다.
            </li>
          </ul>
        </section>

        {/* 자매 서비스 */}
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">함께 쓰면 좋은 서비스</h2>
          <div className="space-y-2 text-sm">
            <a href={ROOT_URL} className="block text-[#c0c8d8] hover:text-accent">
              🚨 8282114 생활안내 — 급할 때 바로 찾는 긴급 대처법
            </a>
            <a href={CALC_URL} className="block text-[#c0c8d8] hover:text-accent">
              🧮 모두의 계산기 — 연봉·퇴직금·자동차세 등 19종
            </a>
            <a href={QUIZ_URL} className="block text-[#c0c8d8] hover:text-accent">
              👑 상식왕 퀴즈 — 11개 카테고리 1,100여 문제
            </a>
          </div>
        </section>

        <footer className="text-center text-xs text-[#606070] pb-8">
          <Link href="/about" className="hover:text-accent">소개</Link>
          {" · "}
          <Link href="/contact" className="hover:text-accent">문의</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-accent">개인정보처리방침</Link>
          {" · "}
          <Link href="/terms" className="hover:text-accent">이용약관</Link>
        </footer>
      </div>
    </div>
  );
}
