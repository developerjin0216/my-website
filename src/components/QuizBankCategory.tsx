import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { categories } from "@/data/quizData";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import {
  BANK_TOPICS,
  bankPath,
  getBankCategory,
  getBankPageCount,
  getBankSlice,
} from "@/lib/quizBank";

// 문제은행 카테고리 페이지 공용 뷰 (서버 컴포넌트)
// /quiz-bank/[category] (1페이지)와 /quiz-bank/[category]/[page] (2페이지~)가 공유합니다.
// 문제·정답·해설을 전부 서버 렌더링해 검색엔진이 1,000문제를 읽을 수 있게 하는 페이지.
export default function QuizBankCategory({
  categoryId,
  page,
}: {
  categoryId: string;
  page: number;
}) {
  const cat = getBankCategory(categoryId);
  if (!cat) return null;

  const { items, start, end, total } = getBankSlice(categoryId, page);
  const pageCount = getBankPageCount(categoryId);
  const url = `${QUIZ_URL}${bankPath(categoryId, page)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Google 교육 Q&A(Quiz) 마크업 — 이 페이지에 실린 문제만 등재
        "@type": "Quiz",
        name:
          page <= 1
            ? `${cat.name} 상식 퀴즈 문제은행`
            : `${cat.name} 상식 퀴즈 문제은행 ${page}페이지`,
        about: { "@type": "Thing", name: cat.name },
        inLanguage: "ko",
        url,
        hasPart: items.map((q) => ({
          "@type": "Question",
          eduQuestionType: "Multiple choice",
          learningResourceType: "Practice problem",
          name: q.question,
          text: q.question,
          suggestedAnswer: q.options
            .filter((_, oi) => oi !== q.answer)
            .map((opt) => ({ "@type": "Answer", text: opt })),
          acceptedAnswer: {
            "@type": "Answer",
            text: q.options[q.answer],
            ...(q.explanation && {
              answerExplanation: { "@type": "Comment", text: q.explanation },
            }),
          },
        })),
      },
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
          {
            "@type": "ListItem",
            position: 3,
            name: `${cat.name} 문제은행`,
            item: url,
          },
        ],
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
        <Link href="/quiz-bank" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← 퀴즈 문제은행
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">
          <span aria-hidden="true">{cat.icon}</span> {cat.name} 문제은행
          {page > 1 && ` ${page}페이지`}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          {start}~{end}번 · 총 {total}문제 · 정답과 해설 제공
        </p>
      </header>

      <div className="px-5 py-5 space-y-4">
        <section className="bg-card rounded-2xl p-5">
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            {BANK_TOPICS[categoryId] ?? cat.name}를 다루는 {cat.name} 상식 퀴즈{" "}
            {start}~{end}번입니다. 각 문제의 정답 보기를 눌러 정답과 해설을
            확인하고, 준비가 되면 실전 퀴즈로 실력을 점검해보세요.
          </p>
        </section>

        <Link
          href={`/quiz?mode=category&category=${categoryId}`}
          className="block w-full rounded-2xl p-5 text-center transition-transform active:scale-[0.98] bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
        >
          <p className="text-lg font-bold text-[#1a1a2e]">
            {cat.name} 퀴즈 시작하기
          </p>
          <p className="text-sm text-[#1a1a2e]/70 mt-1">
            {total}문제 중 랜덤 10문제 출제 · 15초 제한
          </p>
        </Link>

        <AdBanner slot="XXXXXXXXXX" format="horizontal" />

        {/* 문제 목록 — 서버 렌더링 (정답·해설은 토글, HTML에 포함되어 색인 가능) */}
        {items.map((q, i) => (
          <section key={start + i} className="bg-card rounded-2xl p-4">
            <p className="text-sm font-semibold mb-2 leading-relaxed">
              Q{start + i}. {q.question}
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
          </section>
        ))}

        {/* 페이지 이동 */}
        <nav aria-label="문제은행 페이지 이동" className="bg-card rounded-2xl p-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {page > 1 && (
              <Link
                rel="prev"
                href={bankPath(categoryId, page - 1)}
                className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
              >
                ← 이전
              </Link>
            )}
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) =>
              p === page ? (
                <span
                  key={p}
                  aria-current="page"
                  className="text-xs bg-accent text-[#1a1a2e] font-bold rounded-full px-3 py-1.5"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={bankPath(categoryId, p)}
                  className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
                >
                  {p}
                </Link>
              )
            )}
            {page < pageCount && (
              <Link
                rel="next"
                href={bankPath(categoryId, page + 1)}
                className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
              >
                다음 →
              </Link>
            )}
          </div>
          <p className="text-xs text-[#606070] text-center mt-3">
            {cat.name} 문제은행 {page} / {pageCount} 페이지
          </p>
        </nav>

        {/* 다른 카테고리 문제은행 */}
        <section>
          <h2 className="text-base font-bold mb-3">다른 카테고리 문제은행</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== categoryId)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/quiz-bank/${c.id}`}
                  className="text-xs bg-card border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
                >
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </Link>
              ))}
          </div>
        </section>

        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>
    </div>
  );
}
