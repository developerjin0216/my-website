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

const FAQ = [
  {
    q: "문제은행과 실전 퀴즈는 뭐가 다른가요?",
    a: "문제은행은 정답과 해설을 바로 펼쳐 보는 열람용입니다. 시간 제한도 점수도 없어서 처음 보는 주제를 훑을 때 좋습니다. 실전 퀴즈는 같은 문제 중 10개가 무작위로 나오고 문제당 15초 제한이 걸립니다. 먼저 문제은행으로 한 바퀴 읽고, 외워졌는지 확인할 때 실전 퀴즈를 쓰는 순서를 권합니다.",
  },
  {
    q: "로그인이나 결제가 필요한가요?",
    a: "필요 없습니다. 모든 문제와 해설은 가입 없이 전부 열람할 수 있습니다. 최고 점수와 오늘의 퀴즈 완료 여부만 브라우저 안에 저장되고, 서버로는 보내지 않습니다. 브라우저 데이터를 지우면 기록도 함께 사라집니다.",
  },
  {
    q: "문제는 몇 개이고 어떻게 나뉘어 있나요?",
    a: `전체 ${TOTAL_QUESTIONS.toLocaleString()}문제이고 11개 카테고리에 100문제씩 들어 있습니다. 한 페이지에 25문제씩 끊어 두어서, 카테고리마다 네 페이지 정도를 보면 한 바퀴가 끝납니다.`,
  },
  {
    q: "해설이 틀린 것 같은데 어떻게 알리나요?",
    a: "문의 페이지로 해당 문제가 있는 페이지 주소와 함께 보내주시면 확인하고 고칩니다. 바뀐 제도나 갱신된 기록 때문에 정답이 달라지는 문제가 있어서, 제보가 들어오면 원 자료를 다시 확인한 뒤 수정합니다.",
  },
  {
    q: "모바일에서도 볼 수 있나요?",
    a: "네. 화면 너비에 맞춰 한 줄로 배치되도록 만들어 두어 휴대폰에서 보기 편합니다. 설치할 앱은 없고 브라우저만 있으면 됩니다.",
  },
];

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
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
          <p className="text-sm text-[#a0a0b0] leading-relaxed mt-3">
            문제마다 왜 그 답이 맞는지 해설을 붙였습니다. 상식 문제는 답만
            외우면 보기 순서가 바뀌거나 비슷한 문제가 나왔을 때 그대로
            무너집니다. 해설까지 읽어야 다음에 변형된 문제가 나와도 풀립니다.
          </p>
        </section>

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            기억에 남기는 순서
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">
                먼저 답을 떠올려 보고 펼치세요.
              </strong>{" "}
              정답을 바로 보면 &lsquo;아 그거&rsquo; 하고 넘어가게 되는데, 그건
              아는 게 아니라 알아본 것뿐입니다. 틀려도 좋으니 머릿속으로 답을
              정한 다음 펼치면 같은 시간을 써도 훨씬 오래 남습니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                한 번에 다 보지 말고 끊어 보세요.
              </strong>{" "}
              100문제를 하루에 몰아보는 것보다 25문제씩 나눠 며칠에 걸쳐 보는
              쪽이 기억에 오래 남습니다. 페이지를 25문제로 끊어 둔 것도 그래서
              입니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                틀린 문제만 다시 보세요.
              </strong>{" "}
              실전 퀴즈를 풀면 결과 화면에 틀린 문제의 정답과 해설이 모입니다.
              맞힌 문제를 또 보는 건 시간 낭비에 가깝고, 틀린 문제만 다시 보는
              것이 점수를 가장 빨리 올립니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                며칠 뒤에 한 번 더 확인하세요.
              </strong>{" "}
              본 직후에는 다 아는 것 같지만 사흘쯤 지나면 절반쯤 흐려집니다. 그때
              같은 카테고리의 실전 퀴즈를 한 판 돌려보면 무엇이 남았고 무엇이
              빠졌는지 바로 드러납니다.
            </p>
          </div>
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

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q}>
                <p className="text-sm font-semibold text-[#e8e8f0] mb-1">{f.q}</p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
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
