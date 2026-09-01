import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { categories, quizzes } from "@/data/quizData";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import { BANK_TOPICS, getBankPageCount } from "@/lib/quizBank";

// 퀴즈 문제은행 허브 — 1,000문제 정답·해설 아카이브의 진입점 (서버 렌더링)

const TOTAL_QUESTIONS = Object.values(quizzes).reduce(
  (n, list) => n + list.length,
  0
);

export const metadata: Metadata = {
  title: `퀴즈 문제은행 - 상식 퀴즈 ${TOTAL_QUESTIONS.toLocaleString()}문제 정답·해설`,
  description: `경제·맞춤법·MZ 트렌드·무한도전·IT·일반 상식·과학·역사·연예·스포츠·지리 — 11개 카테고리 ${TOTAL_QUESTIONS.toLocaleString()}문제의 정답과 해설을 무료로 열람하세요. 원하는 카테고리를 골라 실전 퀴즈에도 도전할 수 있습니다.`,
  alternates: { canonical: `${QUIZ_URL}/quiz-bank` },
  openGraph: {
    title: `퀴즈 문제은행 - 상식 퀴즈 ${TOTAL_QUESTIONS.toLocaleString()}문제 정답·해설`,
    description: `11개 카테고리 ${TOTAL_QUESTIONS.toLocaleString()}문제의 정답과 해설을 무료로 열람하세요.`,
    url: `${QUIZ_URL}/quiz-bank`,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: `${QUIZ_URL}/quiz-home/opengraph-image`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function QuizBankHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: QUIZ_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "퀴즈 문제은행",
            item: `${QUIZ_URL}/quiz-bank`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "카테고리별 퀴즈 문제은행",
        itemListElement: categories.map((cat, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${cat.name} 문제은행`,
          url: `${QUIZ_URL}/quiz-bank/${cat.id}`,
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bg-header px-5 py-6">
        <Link href="/" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← 상식왕 퀴즈 홈
        </Link>
        <h1 className="text-3xl font-bold text-accent mt-2">
          <span aria-hidden="true">📚</span> 퀴즈 문제은행
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          {TOTAL_QUESTIONS.toLocaleString()}문제 정답·해설 전체 열람
        </p>
      </header>

      <div className="px-5 py-5 flex-1 space-y-4">
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            문제은행 이용 방법
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            상식왕 퀴즈의 전체 {TOTAL_QUESTIONS.toLocaleString()}문제를
            카테고리별로 모았습니다. 문제와 보기를 먼저 읽고 정답 보기를 눌러
            정답과 해설을 확인하세요. 페이지당 25문제씩 나뉘어 있어 출퇴근길에
            틈틈이 보기 좋고, 준비가 되면 카테고리별 실전 퀴즈로 최고 점수에
            도전할 수 있습니다.
          </p>
        </section>

        {/* 카테고리 그리드 */}
        <section>
          <h2 className="text-lg font-bold mb-4">카테고리별 문제은행</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/quiz-bank/${cat.id}`}
                className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.icon}
                </div>
                <p className="font-semibold text-sm">{cat.name}</p>
                <p className="text-xs text-[#a0a0b0] mt-1">
                  {(quizzes[cat.id] ?? []).length}문제 ·{" "}
                  {getBankPageCount(cat.id)}페이지
                </p>
              </Link>
            ))}
          </div>
        </section>

        <AdBanner slot="XXXXXXXXXX" format="horizontal" />

        {/* 카테고리별 주제 소개 — 크롤러용 정적 텍스트 */}
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            어떤 문제가 있나요?
          </h2>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                • <span className="text-[#e8e8f0]">{cat.name}</span> —{" "}
                {BANK_TOPICS[cat.id]}
              </li>
            ))}
          </ul>
        </section>

        {/* 실전 퀴즈 CTA */}
        <Link
          href="/quiz?mode=daily"
          className="block w-full rounded-2xl p-5 text-center transition-transform active:scale-[0.98] bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
        >
          <p className="text-lg font-bold text-[#1a1a2e]">오늘의 퀴즈 도전하기</p>
          <p className="text-sm text-[#1a1a2e]/70 mt-1">
            전체 카테고리에서 매일 새로운 10문제
          </p>
        </Link>
      </div>

      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            홈
          </Link>
          <span className="text-xs text-[#606070]">|</span>
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
        </div>
        <p className="text-xs text-[#606070]">
          © 2026 상식왕 퀴즈. 매일 새로운 퀴즈로 상식을 넓혀보세요.
        </p>
      </footer>
    </div>
  );
}
