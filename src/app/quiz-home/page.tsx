import type { Metadata } from "next";
import Link from "next/link";
import { categories, quizzes } from "@/data/quizData";
import { CALC_COUNT } from "@/data/calculators";
import AdBanner from "@/components/AdBanner";
import DailyQuote from "@/components/DailyQuote";
import HomeClient from "@/components/HomeClient";
import DailyStreak from "@/components/quiz/DailyStreak";
import { QUIZ_URL, SITE_NAME, QUIZ_SPLIT, ROOT_URL, ROOT_SITE_NAME } from "@/lib/site";
import { authorship, REVIEWED } from "@/lib/trust";

// 상식왕 퀴즈 홈 — 통합 전에는 quiz 서브도메인의 루트였고 지금은 /quiz-home 입니다.
// QUIZ_URL은 이제 ROOT_URL과 같으므로 이 페이지를 가리킬 땐 반드시 경로를 붙입니다.

const QUIZ_HOME = QUIZ_SPLIT ? QUIZ_URL : `${QUIZ_URL}/quiz-home`;

// 문제 수는 세어서 씁니다. "1,000문제"·"1,100여 문제"·"10개 카테고리"가 한 파일
// 안에서 제각각이었고 전부 틀렸습니다(실제 11개 카테고리 1,168문제).
const TOTAL_QUESTIONS = Object.values(quizzes).reduce(
  (n, list) => n + list.length,
  0
);
const Q = TOTAL_QUESTIONS.toLocaleString();
const C = categories.length;

export const metadata: Metadata = {
  title: {
    absolute: `상식왕 퀴즈 - 무료 상식 퀴즈 ${Q}문제 & 실시간 퀴즈 배틀`,
  },
  description: `경제·맞춤법·역사·과학·MZ 등 ${C}개 카테고리 ${Q}문제 상식 퀴즈, 매일 새로운 오늘의 퀴즈, 최대 10명 실시간 퀴즈 배틀까지 무료로 즐기세요.`,
  alternates: { canonical: QUIZ_HOME },
  openGraph: {
    title: `상식왕 퀴즈 - 무료 상식 퀴즈 ${Q}문제`,
    description: `${C}개 카테고리 ${Q}문제, 오늘의 퀴즈, 실시간 퀴즈 배틀`,
    url: QUIZ_HOME,
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
  // 루트 레이아웃이 이미 WebSite를 싣습니다. 여기서 또 WebSite를, 그것도
  // 루트 주소로 선언하면 사이트가 둘로 보이고 홈과 주체가 겹칩니다.
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: SITE_NAME,
        url: QUIZ_HOME,
        description: `${C}개 카테고리 ${Q}문제의 무료 상식 퀴즈와 실시간 퀴즈 배틀`,
        ...authorship(REVIEWED.calculators),
      },
      {
        "@type": "ItemList",
        name: "퀴즈 카테고리",
        itemListElement: categories.map((cat, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cat.name,
          url: `${ROOT_URL}/quiz/${cat.id}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ROOT_SITE_NAME, item: ROOT_URL },
          { "@type": "ListItem", position: 2, name: SITE_NAME, item: QUIZ_HOME },
        ],
      },
    ],
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

      {/* AI 프롬프트 — 검색 수요가 있는 코너로 내부 링크를 늘립니다 */}
      <div className="px-5 pb-4">
        <Link
          href="/prompts"
          className="block rounded-2xl p-4 transition-transform active:scale-[0.99] bg-gradient-to-br from-[#5B4B8A] to-[#8E7CC3] border border-[#a99ad6]"
        >
          <p className="text-base font-bold text-white">🤖 AI 프롬프트 모음</p>
          <p className="text-[11px] text-white/80 mt-1">
            복사해서 바로 쓰는 챗GPT 질문 78개 — 재미·자기분석·일·공부
          </p>
        </Link>
      </div>

      {/* 1:1 오목 — 친구 초대형 콘텐츠 */}
      <div className="px-5 pb-4">
        <Link
          href="/omok"
          className="block rounded-2xl p-4 transition-transform active:scale-[0.99] bg-gradient-to-br from-[#8B5E34] to-[#c9a063] border border-[#d8bb8a]"
        >
          <p className="text-base font-bold text-white">⚫ 1:1 온라인 오목</p>
          <p className="text-[11px] text-white/80 mt-1">
            초대 코드만 보내면 바로 대국 — 가입·설치 없음
          </p>
        </Link>
      </div>

      {/* 웹 방탈출 — 체류·공유형 콘텐츠 (검색 유입보다 바이럴을 노린 자리) */}
      <div className="px-5 pb-4">
        <Link
          href="/escape"
          className="block rounded-2xl p-4 transition-transform active:scale-[0.99] bg-gradient-to-br from-[#2C3E50] to-[#4A6572] border border-[#5a6a7a]"
        >
          <p className="text-base font-bold text-white">🔦 웹 방탈출 · 한빛사진관</p>
          <p className="text-[11px] text-white/70 mt-1">
            방 6개, 떡밥 8개를 회수하는 추리 방탈출 — 설치 없이 바로 시작
          </p>
        </Link>
      </div>

      {/* Calculators — 별도 사이트 링크라 퀴즈 CTA보다 작게 (컴팩트 배너)
          절대주소 사용: 상대경로면 quiz 호스트에서 308을 거쳐 크롤 낭비 */}
      <div className="px-5 pb-4">
        <a
          href="/calculators"
          className="flex items-center justify-between rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-[#27AE60] transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">🧮</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">생활 계산기</span>
            {" — "}실수령액·전기요금 등 {CALC_COUNT}종
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
              <p className="text-xs text-[#a0a0b0] mt-1">
                {(quizzes[cat.id] ?? []).length}문제
              </p>
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
            {" — "}{Q}문제 정답·해설 모아보기
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
            과학, 역사, 연예, 스포츠, 지리까지 총 {C}개 카테고리 {Q}문제를 제공하는
            무료 온라인 퀴즈 서비스입니다. 매일 새로운 오늘의 퀴즈에 도전하고,
            친구들과 실시간 퀴즈 배틀로 대결해보세요!
          </p>
          <h3 className="text-sm font-bold mb-2">주요 기능</h3>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• {C}개 카테고리, {Q}문제 — 경제, 맞춤법, MZ, 무도, IT, 상식, 과학, 역사, 연예, 스포츠, 지리</li>
            <li>• 오늘의 퀴즈 — 매일 랜덤 10문제 도전</li>
            <li>• 퀴즈 배틀 — 최대 10명 실시간 대결</li>
            <li>• 오답 노트 — 틀린 문제 풀이 해설 제공</li>
            <li>• 퀴즈 문제은행 — 전체 {Q}문제 정답·해설 열람</li>
            <li>• MBTI 백과 — 16가지 성격유형 특징·연애·궁합·직업 + 무료 간이 테스트</li>
            <li>• 밈·신조어 사전 — 요즘 유행어 뜻·유래·사용 예시 정리</li>
            <li>• 오늘의 명언 — 365일 매일 새로운 명언</li>
            <li>• 생활 계산기 — 연봉 실수령액, 퇴직금, 전기요금, 환율 등 {CALC_COUNT}종</li>
            <li>• 모바일 최적화 — 언제 어디서든 플레이</li>
          </ul>

          <h3 className="text-sm font-bold mb-2 mt-4">인기 계산기 바로가기</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CALCS.map((c) => (
              <Link
                key={c.id}
                href={`/calculators/${c.id}`}
                className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#a0a0b0] hover:text-accent hover:border-accent transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 어디로 들어갈지 고르는 안내 — 입구가 네 개라 처음 온 사람은 헷갈립니다 */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            어디부터 하면 되나요
          </h2>
          <div className="space-y-3.5 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <Link
                href="/quiz?mode=daily"
                className="font-semibold text-[#e8e8f0] hover:text-accent"
              >
                오늘의 퀴즈
              </Link>{" "}
              — 처음이라면 여기부터. {C}개 카테고리 전체에서 10문제가 섞여 나와서
              어느 분야가 약한지 한 판이면 드러납니다. 하루에 한 번 기록이 남습니다.
            </p>
            <p>
              <Link
                href="/quiz"
                className="font-semibold text-[#e8e8f0] hover:text-accent"
              >
                카테고리 퀴즈
              </Link>{" "}
              — 약한 분야를 찾았으면 그 주제만 반복합니다. 카테고리마다 최고 점수가
              따로 저장돼서 늘고 있는지 눈에 보입니다.
            </p>
            <p>
              <Link
                href="/quiz-bank"
                className="font-semibold text-[#e8e8f0] hover:text-accent"
              >
                문제은행
              </Link>{" "}
              — 시간 제한 없이 {Q}문제의 정답과 해설을 그냥 읽는 곳입니다. 점수가
              안 오를 때는 더 푸는 것보다 여기서 한 바퀴 읽는 쪽이 빠릅니다.
            </p>
            <p>
              <Link
                href="/battle"
                className="font-semibold text-[#e8e8f0] hover:text-accent"
              >
                퀴즈 배틀
              </Link>{" "}
              — 같은 문제로 여러 명이 동시에 겨룹니다. 방을 만들어 코드를 보내면
              되고, 가입은 필요 없습니다.
            </p>
          </div>
          <p className="text-xs text-[#8a90a0] leading-relaxed mt-4">
            점수와 기록은 전부 사용하는 브라우저 안에만 저장됩니다. 서버로 보내지
            않으므로 가입할 것이 없고, 대신 브라우저 데이터를 지우거나 다른 기기로
            옮기면 기록은 남지 않습니다.
          </p>
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            문제는 어떻게 만드나
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              문제마다 정답과 함께 해설을 답니다. 상식 퀴즈에서 답만 외우면 보기
              순서가 바뀌거나 비슷한 문제가 나왔을 때 그대로 무너지기 때문입니다.
              틀렸을 때 왜 틀렸는지 알 수 없는 문제는 내지 않으려고 합니다.
            </p>
            <p>
              시간이 지나면 답이 달라지는 문제가 있습니다. 기록이 깨지거나 제도가
              바뀌는 경우입니다. 그런 문제를 발견하시면{" "}
              <Link href="/contact" className="text-accent hover:underline">
                문의
              </Link>
              로 알려주세요. 확인하고 고칩니다.
            </p>
            <p>
              맞춤법 카테고리만 문제 수가 다른 것은, 헷갈리는 표기가 다른 주제보다
              훨씬 많아서 추가로 모았기 때문입니다.
            </p>
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
