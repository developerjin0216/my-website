import Link from "next/link";
import { categories } from "@/data/quizData";
import AdBanner from "@/components/AdBanner";
import DailyQuote from "@/components/DailyQuote";
import HomeClient from "@/components/HomeClient";

// 서버 컴포넌트 — Google 크롤러가 정적 콘텐츠를 읽을 수 있음
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
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

      {/* SEO 콘텐츠 — 크롤러용 정적 텍스트 */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">상식왕 퀴즈란?</h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-4">
            상식왕 퀴즈는 경제·재테크, MZ 트렌드, 무한도전, IT용어, 일반 상식, 과학,
            역사, 연예, 스포츠, 지리까지 총 10개 카테고리 1,000문제를 제공하는 무료
            온라인 퀴즈 서비스입니다. 매일 새로운 오늘의 퀴즈에 도전하고,
            친구들과 실시간 퀴즈 배틀로 대결해보세요!
          </p>
          <h3 className="text-sm font-bold mb-2">주요 기능</h3>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 10개 카테고리, 1,000문제 — 경제, MZ, 무도, IT, 상식, 과학, 역사, 연예, 스포츠, 지리</li>
            <li>• 오늘의 퀴즈 — 매일 랜덤 10문제 도전</li>
            <li>• 퀴즈 배틀 — 최대 10명 실시간 대결</li>
            <li>• 오답 노트 — 틀린 문제 풀이 해설 제공</li>
            <li>• 오늘의 명언 — 365일 매일 새로운 명언</li>
            <li>• 모바일 최적화 — 언제 어디서든 플레이</li>
          </ul>
        </div>
      </section>

      {/* Ad - bottom */}
      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* Footer */}
      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex justify-center gap-3 mb-2">
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
