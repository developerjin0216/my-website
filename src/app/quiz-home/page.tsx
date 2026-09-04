import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/quizData";
import AdBanner from "@/components/AdBanner";
import DailyQuote from "@/components/DailyQuote";
import HomeClient from "@/components/HomeClient";
import DailyStreak from "@/components/quiz/DailyStreak";
import { QUIZ_URL, CALC_URL, SITE_NAME } from "@/lib/site";

// 상식왕 퀴즈 홈 — quiz 서브도메인의 루트(/)로 rewrite되어 서빙됩니다 (src/proxy.ts)

export const metadata: Metadata = {
  title: { absolute: "상식왕 퀴즈 - 무료 상식 퀴즈 1,100문제 & 실시간 퀴즈 배틀" },
  description:
    "경제·맞춤법·역사·과학·MZ 등 11개 카테고리 1,100문제 상식 퀴즈, 매일 새로운 오늘의 퀴즈, 최대 10명 실시간 퀴즈 배틀까지 무료로 즐기세요.",
  alternates: { canonical: QUIZ_URL },
  openGraph: {
    title: "상식왕 퀴즈 - 무료 상식 퀴즈 1,000문제",
    description: "10개 카테고리 1,000문제, 오늘의 퀴즈, 실시간 퀴즈 배틀",
    url: QUIZ_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

// 홈에서 검색 수요가 높은 계산기 바로가기 (내부 링크 깊이 단축)
const POPULAR_CALCS = [
  { id: "salary", label: "연봉 실수령액 계산기" },
  { id: "electricity", label: "전기요금 계산기" },
  { id: "severance", label: "퇴직금 계산기" },
  { id: "bmi", label: "BMI 계산기" },
  { id: "exchange", label: "환율 계산기" },
];

// 서버 컴포넌트 — Google 크롤러가 정적 콘텐츠를 읽을 수 있음
export default function QuizHome() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: QUIZ_URL,
    inLanguage: "ko",
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Header */}
      <header className="bg-header px-5 py-6 text-center">
        <h1 className="text-3xl font-bold text-accent">상식왕 퀴즈</h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          다양한 카테고리의 상식 퀴즈를 풀고 지식을 넓혀보세요!
        </p>
      </header>

      {/* Daily Quote (client) */}
      <DailyQuote />

      {/* Stats (client) */}
      <HomeClient />

      {/* Battle Mode */}
      <div className="px-5 pb-3">
        <Link
          href="/battle"
          className="block w-full rounded-2xl p-5 text-center transition-transform active:scale-[0.98] bg-gradient-to-r from-[#5B86E5] to-[#36D1DC]"
        >
          <p className="text-lg font-bold text-white">퀴즈 배틀</p>
          <p className="text-sm text-white/70 mt-1">
            친구들과 실시간 퀴즈 대결! (최대 10명)
          </p>
        </Link>
      </div>

      {/* Daily Quiz */}
      <div className="px-5 pb-4">
        <Link
          href="/quiz?mode=daily"
          className="block w-full rounded-2xl p-5 text-center transition-transform active:scale-[0.98] bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
        >
          <p className="text-lg font-bold text-[#1a1a2e]">오늘의 퀴즈</p>
          <p className="text-sm text-[#1a1a2e]/70 mt-1">
            매일 새로운 10문제에 도전하세요
          </p>
        </Link>
        <div className="text-center mt-2">
          <DailyStreak />
        </div>
      </div>

      {/* MBTI 백과 & 밈 사전 — 바이럴·SEO 콘텐츠 */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <Link
          href="/mbti"
          className="rounded-2xl p-4 text-center transition-transform active:scale-[0.97] bg-gradient-to-br from-[#9B59B6] to-[#5B86E5]"
        >
          <p className="text-base font-bold text-white">🔮 MBTI 백과</p>
          <p className="text-[11px] text-white/70 mt-1">
            16유형 특징·궁합 + 3분 테스트
          </p>
        </Link>
        <Link
          href="/meme"
          className="rounded-2xl p-4 text-center transition-transform active:scale-[0.97] bg-gradient-to-br from-[#E67E22] to-[#E74C3C]"
        >
          <p className="text-base font-bold text-white">😂 밈·신조어 사전</p>
          <p className="text-[11px] text-white/70 mt-1">
            요즘 말 뜻·유래 총정리
          </p>
        </Link>
      </div>

      {/* Calculators — 별도 사이트 링크라 퀴즈 CTA보다 작게 (컴팩트 배너)
          절대주소 사용: 상대경로면 quiz 호스트에서 308을 거쳐 크롤 낭비 */}
      <div className="px-5 pb-4">
        <a
          href={`${CALC_URL}/calculators`}
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-[#27AE60] transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">🧮</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">생활 계산기</span>
            {" — "}실수령액·전기요금 등 19종
          </span>
          <span className="text-[#27AE60] text-sm shrink-0 ml-2">바로가기 →</span>
        </a>
      </div>

      {/* Ad */}
      <div className="px-5 pb-2">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* Categories — 서버 렌더링, 크롤러가 읽을 수 있음 */}
      <div className="px-5 pb-4 flex-1">
        <h2 className="text-lg font-bold mb-4">카테고리별 퀴즈</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/quiz?mode=category&category=${cat.id}`}
              className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: cat.color + "20" }}
              >
                {cat.icon}
              </div>
              <p className="font-semibold text-sm">{cat.name}</p>
              <p className="text-xs text-[#a0a0b0] mt-1">100문제</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quiz Bank — 문제은행 (전체 문제·해설 아카이브, SEO 허브) */}
      <div className="px-5 pb-4">
        <Link
          href="/quiz-bank"
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">📚</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">퀴즈 문제은행</span>
            {" — "}1,000문제 정답·해설 모아보기
          </span>
          <span className="text-accent text-sm shrink-0 ml-2">바로가기 →</span>
        </Link>
      </div>

      {/* SEO 콘텐츠 — 크롤러용 정적 텍스트 */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">상식왕 퀴즈란?</h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-4">
            상식왕 퀴즈는 경제·재테크, 맞춤법, MZ 트렌드, 무한도전, IT용어, 일반 상식,
            과학, 역사, 연예, 스포츠, 지리까지 총 11개 카테고리 1,100여 문제를 제공하는
            무료 온라인 퀴즈 서비스입니다. 매일 새로운 오늘의 퀴즈에 도전하고,
            친구들과 실시간 퀴즈 배틀로 대결해보세요!
          </p>
          <h3 className="text-sm font-bold mb-2">주요 기능</h3>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 11개 카테고리, 1,100여 문제 — 경제, 맞춤법, MZ, 무도, IT, 상식, 과학, 역사, 연예, 스포츠, 지리</li>
            <li>• 오늘의 퀴즈 — 매일 랜덤 10문제 도전</li>
            <li>• 퀴즈 배틀 — 최대 10명 실시간 대결</li>
            <li>• 오답 노트 — 틀린 문제 풀이 해설 제공</li>
            <li>• 퀴즈 문제은행 — 전체 1,000문제 정답·해설 열람</li>
            <li>• MBTI 백과 — 16가지 성격유형 특징·연애·궁합·직업 + 무료 간이 테스트</li>
            <li>• 밈·신조어 사전 — 요즘 유행어 뜻·유래·사용 예시 정리</li>
            <li>• 오늘의 명언 — 365일 매일 새로운 명언</li>
            <li>• 생활 계산기 — 연봉 실수령액, 퇴직금, 전기요금, 환율 등 19종</li>
            <li>• 모바일 최적화 — 언제 어디서든 플레이</li>
          </ul>

          <h3 className="text-sm font-bold mb-2 mt-4">인기 계산기 바로가기</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CALCS.map((c) => (
              <a
                key={c.id}
                href={`${CALC_URL}/calculators/${c.id}`}
                className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Ad - bottom */}
      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
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
          © 2026 상식왕 퀴즈. 매일 새로운 퀴즈로 상식을 넓혀보세요.
        </p>
      </footer>
    </div>
  );
}
