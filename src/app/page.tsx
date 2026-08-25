import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import { helpTopics } from "@/data/help";
import { ROOT_URL, QUIZ_URL, CALC_URL, TOOLS_URL, INFO_SITE_NAME } from "@/lib/site";

// 루트(8282114.xyz) 홈 — 급할때 생활안내 허브
// 도메인 자체가 브랜드: 8282(빨리빨리) + 114(안내)

export const metadata: Metadata = {
  title: { absolute: "8282114 - 급할 때 바로 찾는 생활 긴급 안내" },
  description:
    "카드 분실, 보이스피싱, 야간 병원·약국, 정전·가스 신고까지 — 급할 때 필요한 전화번호와 대처법을 한 곳에 모았습니다. 생활 계산기 15종과 상식 퀴즈도 함께 이용하세요.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "8282114 - 급할 때 바로 찾는 생활 긴급 안내",
    description:
      "긴급 전화번호, 분실·사기 대처법, 야간 병원 찾기 — 급할 때 필요한 정보 총정리",
    url: "/",
    siteName: INFO_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

// 첫 화면 긴급번호 퀵 그리드
const QUICK_NUMBERS = [
  { num: "112", label: "경찰·범죄 신고", color: "#5B86E5" },
  { num: "119", label: "화재·구급", color: "#E74C3C" },
  { num: "110", label: "정부 민원", color: "#27AE60" },
  { num: "1332", label: "보이스피싱·금융", color: "#F39C12" },
  { num: "123", label: "한전 (정전)", color: "#FFD700" },
  { num: "129", label: "보건복지 상담", color: "#8E44AD" },
];

export default function InfoHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: INFO_SITE_NAME,
    url: ROOT_URL,
    inLanguage: "ko",
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <header className="bg-header px-5 py-6 text-center">
        <h1 className="text-3xl font-bold text-accent">8282114</h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          빨리빨리(8282) 찾는 생활 안내(114) — 급할 때 이 페이지 하나면 됩니다
        </p>
      </header>

      {/* 긴급번호 퀵 그리드 — 서버 렌더링 */}
      <div className="px-5 pt-5 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {QUICK_NUMBERS.map((q) => (
            <a
              key={q.num}
              href={`tel:${q.num}`}
              className="bg-card rounded-xl p-3 text-center border border-[#2a3a5a] active:scale-[0.97] transition-transform"
            >
              <p className="text-xl font-bold" style={{ color: q.color }}>
                {q.num}
              </p>
              <p className="text-[10px] text-[#a0a0b0] mt-0.5">{q.label}</p>
            </a>
          ))}
        </div>
        <p className="text-[10px] text-[#606070] mt-1.5 text-center">
          휴대폰에서 누르면 바로 전화가 연결됩니다
        </p>
      </div>

      {/* 상황별 안내 카드 */}
      <div className="px-5 pb-4 flex-1">
        <h2 className="text-lg font-bold mb-3">상황별 대처 안내</h2>
        <div className="space-y-2.5">
          {helpTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/help/${topic.id}`}
              className="block bg-card rounded-2xl p-4 transition-transform active:scale-[0.98] hover:brightness-110"
            >
              <p className="font-semibold text-sm">
                <span aria-hidden="true">{topic.icon}</span> {topic.title}
              </p>
              <p className="text-xs text-[#a0a0b0] mt-1 leading-relaxed">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad */}
      <div className="px-5 pb-4">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* 자매 서비스 */}
      <div className="px-5 pb-4 space-y-2.5">
        <h2 className="text-lg font-bold">함께 쓰는 서비스</h2>
        <a
          href={`${CALC_URL}/calculators`}
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-[#27AE60] transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">🧮</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">모두의 계산기</span>
            {" — "}실수령액·자동차세·실업급여 등 19종
          </span>
          <span className="text-[#27AE60] text-sm shrink-0 ml-2">→</span>
        </a>
        <a
          href={`${TOOLS_URL}/tools`}
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-[#E1306C] transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">🧰</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">모두의 도구</span>
            {" — "}인스타 언팔 확인 (로그인 없이)
          </span>
          <span className="text-[#E1306C] text-sm shrink-0 ml-2">→</span>
        </a>
        <a
          href={QUIZ_URL}
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">🏆</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">상식왕 퀴즈</span>
            {" — "}11개 카테고리 1,100여 문제·실시간 배틀
          </span>
          <span className="text-accent text-sm shrink-0 ml-2">→</span>
        </a>
      </div>

      {/* SEO 콘텐츠 — 크롤러용 정적 텍스트 */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            8282114는 어떤 사이트인가요?
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-4">
            급한 일이 생겼을 때 어디에 전화해야 할지, 무엇부터 해야 할지
            헤매지 않도록 — 긴급 전화번호와 상황별 대처법을 검증된 공공기관
            정보 기준으로 정리한 생활 안내 서비스입니다. 카드 분실, 보이스피싱,
            야간 병원 찾기, 정전·가스 신고까지 상황별 페이지를 북마크해두세요.
          </p>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 긴급 전화번호 총정리 — 신고·상담·민원 번호 한 페이지에</li>
            <li>• 상황별 대처 안내 — 분실·사기·응급·시설 고장 시 행동 순서</li>
            <li>• 생활 계산기 15종 — 연봉 실수령액부터 전기요금까지</li>
            <li>• 상식왕 퀴즈 — 1,000문제 무료 상식 퀴즈</li>
          </ul>
        </div>
      </section>

      {/* Ad - bottom (제휴 배너는 콘텐츠 이후 최하단) */}
      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
        <CoupangBanner className="mt-4" />
      </div>

      {/* Footer */}
      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <Link href="/about" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            소개
          </Link>
          <span className="text-xs text-[#606070]">|</span>
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
        <p className="text-xs text-[#606070]">
          © 2026 8282114 — 기관 번호·제도는 변경될 수 있으니 참고용으로
          활용하세요.
        </p>
      </footer>
    </div>
  );
}
