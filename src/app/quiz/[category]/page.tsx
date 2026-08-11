import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, quizzes } from "@/data/quizData";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

// 카테고리별 SSR 랜딩 — 1,000문제 콘텐츠 자산을 검색엔진이 읽을 수 있게 하는
// 유일한 통로 (퀴즈 플레이어는 클라이언트 컴포넌트라 크롤러에 안 보임)

const DESCRIPTIONS: Record<string, string> = {
  economy:
    "금리, 주식, 부동산, 세금까지 — 알아두면 돈이 되는 경제·재테크 상식을 퀴즈로 점검해보세요. 기초 금융 용어부터 실전 재테크 지식까지 100문제로 구성했습니다.",
  mz: "요즘 유행하는 신조어, 밈, 트렌드를 얼마나 알고 계신가요? MZ세대 필수 상식부터 최신 유행어까지, 세대 감각을 테스트하는 100문제입니다.",
  mudo: "국민 예능 무한도전의 명장면, 명대사, 멤버들의 에피소드를 담은 무도 팬 필수 퀴즈 100문제. 무도 정주행러라면 도전해보세요.",
  it: "AI, 클라우드, 프로그래밍, 네트워크까지 — 개발자 면접과 IT 교양에 도움되는 IT 용어 100문제. 중상급 난이도로 실력을 확인해보세요.",
  general:
    "국어, 문화, 시사, 생활 지식을 아우르는 일반 상식 100문제. 상식왕에 도전하는 첫 걸음으로 가장 인기 있는 카테고리입니다.",
  science:
    "물리, 화학, 생물, 지구과학, 우주까지 — 학교에서 배웠지만 가물가물한 과학 상식 100문제로 과학 지식을 다시 깨워보세요.",
  history:
    "한국사부터 세계사까지, 시대를 관통하는 역사 상식 100문제. 왕조, 전쟁, 인물, 사건 — 역사 덕후라면 만점에 도전해보세요.",
  entertainment:
    "드라마, 영화, 가요, 예능을 넘나드는 연예 상식 100문제. 대중문화에 진심인 분들을 위한 카테고리입니다.",
  sports:
    "축구, 야구, 올림픽, e스포츠까지 — 스포츠 팬이라면 놓칠 수 없는 스포츠 상식 100문제에 도전해보세요.",
  geography:
    "수도, 국기, 지형, 세계 각국의 문화까지 — 지도 위를 여행하는 지리 상식 100문제. 여행 좋아하는 분들께 추천합니다.",
  spelling:
    "되/돼, 안/않, 금세/금새, 띄어쓰기, 외래어 표기까지 — 국립국어원 규정 기준으로 검증한 헷갈리는 맞춤법 168문제. 당신의 맞춤법 실력은 몇 점인가요?",
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  if (!cat) return {};
  const count = quizzes[category]?.length ?? 100;
  return {
    title: `${cat.name} 퀴즈 - 무료 ${count}문제`,
    description: `${DESCRIPTIONS[category] ?? ""} 회원가입 없이 무료, 문제당 15초, 힌트와 해설 제공.`,
    alternates: { canonical: `${QUIZ_URL}/quiz/${category}` },
    openGraph: {
      title: `${cat.name} 퀴즈 - 무료 ${count}문제`,
      description: DESCRIPTIONS[category] ?? "",
      url: `${QUIZ_URL}/quiz/${category}`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  if (!cat) notFound();

  const samples = (quizzes[category] ?? []).slice(0, 3);
  const url = `${QUIZ_URL}/quiz/${category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: QUIZ_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${cat.name} 퀴즈`,
        item: url,
      },
    ],
  };

  return (
    <div className="max-w-lg mx-auto w-full">
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
        <h1 className="text-2xl font-bold text-accent mt-2">
          <span aria-hidden="true">{cat.icon}</span> {cat.name} 퀴즈
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          무료 {(quizzes[category] ?? []).length}문제 · 문제당 15초 · 힌트와 해설
          제공
        </p>
      </header>

      <div className="px-5 py-5 space-y-4">
        <section className="bg-card rounded-2xl p-5">
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            {DESCRIPTIONS[category]}
          </p>
        </section>

        <Link
          href={`/quiz?mode=category&category=${category}`}
          className="block w-full rounded-2xl p-5 text-center transition-transform active:scale-[0.98] bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
        >
          <p className="text-lg font-bold text-[#1a1a2e]">
            {cat.name} 퀴즈 시작하기
          </p>
          <p className="text-sm text-[#1a1a2e]/70 mt-1">
            100문제 중 랜덤 10문제 출제
          </p>
        </Link>

        {/* 맛보기 문제 — 서버 렌더링 (정답은 토글) */}
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-4 text-accent">
            맛보기 문제 3개
          </h2>
          <div className="space-y-5">
            {samples.map((q, i) => (
              <div key={i}>
                <p className="text-sm font-semibold mb-2 leading-relaxed">
                  Q{i + 1}. {q.question}
                </p>
                <ol className="space-y-1 mb-2">
                  {q.options.map((opt, oi) => (
                    <li key={oi} className="text-xs text-[#8090b0]">
                      {oi + 1}) {opt}
                    </li>
                  ))}
                </ol>
                <details className="text-xs">
                  <summary className="cursor-pointer text-accent font-semibold">
                    정답 보기
                  </summary>
                  <div className="mt-2 bg-[#162040] rounded-xl p-3 border border-[#2a3a5a]/50">
                    <p className="text-[#22C55E] font-semibold mb-1">
                      정답: {q.options[q.answer]}
                    </p>
                    {q.explanation && (
                      <p className="text-[#c0c8d8] leading-relaxed">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </details>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#606070] mt-4">
            나머지 97문제는 퀴즈에서 만나보세요 — 카테고리별 최고 점수가
            저장됩니다.
          </p>
        </section>

        {/* 문제은행 — 전체 문제·정답·해설 아카이브 */}
        <Link
          href={`/quiz-bank/${category}`}
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">📚</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">
              {cat.name} 문제은행
            </span>
            {" — "}100문제 정답·해설 전체 보기
          </span>
          <span className="text-accent text-sm shrink-0 ml-2">→</span>
        </Link>

        {/* 다른 카테고리 */}
        <section>
          <h2 className="text-base font-bold mb-3">다른 카테고리 퀴즈</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== category)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/quiz/${c.id}`}
                  className="text-xs bg-card border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
                >
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
