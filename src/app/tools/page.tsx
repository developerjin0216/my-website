import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/data/tools";
import { CALC_COUNT } from "@/data/calculators";
import { helpTopics } from "@/data/help";
import { categories, quizzes } from "@/data/quizData";
import {
  TOOLS_URL,
  TOOLS_SPLIT,
  TOOLS_SITE_NAME,
  ROOT_URL,
  ROOT_SITE_NAME,
} from "@/lib/site";
import { authorship, REVIEWED } from "@/lib/trust";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import CoupangGoldbox from "@/components/CoupangGoldbox";

// 생활 도구 허브.
// 통합 전에는 tools 서브도메인의 루트였고 지금은 /tools 입니다. TOOLS_URL은
// 이제 ROOT_URL과 같으므로, 이 페이지를 가리킬 때는 반드시 경로를 붙여야 합니다.

const TOOLS_HOME = TOOLS_SPLIT ? TOOLS_URL : `${TOOLS_URL}/tools`;

const TOTAL_QUESTIONS = Object.values(quizzes).reduce(
  (n, list) => n + list.length,
  0
);

const FAQ = [
  {
    q: "정말 파일이 서버로 안 가나요?",
    a: "가지 않습니다. 확인하고 싶다면 도구 페이지를 연 뒤 인터넷 연결을 끊고 파일을 올려보세요. 그대로 동작하면 서버와 주고받는 것이 없다는 뜻입니다. 브라우저 개발자 도구의 네트워크 탭을 열어둬도 파일이 올라가는 요청이 잡히지 않습니다.",
  },
  {
    q: "인스타그램 비밀번호를 입력해야 하나요?",
    a: "아닙니다. 계정 연동이나 로그인을 요구하는 도구는 하나도 없습니다. 인스타그램이 공식으로 제공하는 '내 정보 다운로드' 파일을 받아서 올리는 방식입니다. 비밀번호를 묻는 언팔 확인 서비스는 계정을 통째로 넘기는 것과 같으니 쓰지 마세요.",
  },
  {
    q: "올린 파일이 나중에 남아 있나요?",
    a: "페이지를 닫거나 새로고침하면 사라집니다. 저장하는 곳이 없기 때문입니다. 결과를 남기고 싶으면 화면을 캡처하거나 내려받아 두세요.",
  },
  {
    q: "큰 파일도 되나요?",
    a: "되지만 기기 성능을 탑니다. 처리를 전부 사용자 기기에서 하기 때문에, 수백 MB짜리 파일은 휴대폰에서 버거울 수 있습니다. 그럴 때는 PC 브라우저에서 시도하는 편이 빠릅니다.",
  },
  {
    q: "회원가입이나 결제가 있나요?",
    a: "없습니다. 전부 무료이고 광고로 운영합니다. 사용 횟수 제한이나 유료 전환도 없습니다.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "모두의 도구 - 로그인 없이 쓰는 무료 웹 도구" },
  description:
    "인스타그램·쓰레드 언팔 확인(맞팔 체크)부터 — 비밀번호 입력 없이, 파일이 서버로 전송되지 않는 안전한 무료 웹 도구 모음입니다.",
  alternates: { canonical: TOOLS_HOME },
  openGraph: {
    title: "모두의 도구 - 로그인 없이 쓰는 무료 웹 도구",
    description:
      "인스타 언팔 확인 등 개인정보 안전(브라우저 처리) 무료 도구 모음",
    // TOOLS_URL 그대로 쓰면 og:url이 홈을 가리킵니다
    url: TOOLS_HOME,
    siteName: TOOLS_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

export default function ToolsHubPage() {
  // 루트 레이아웃이 이미 WebSite 스키마를 싣습니다. 하위 페이지가 또 WebSite를
  // 선언하면 사이트가 둘인 것처럼 보이므로 CollectionPage로 둡니다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: TOOLS_SITE_NAME,
        url: TOOLS_HOME,
        description:
          "로그인 없이 브라우저에서만 동작하는 무료 웹 도구 모음. 파일이 서버로 전송되지 않습니다.",
        ...authorship(REVIEWED.tools),
      },
      {
        "@type": "ItemList",
        name: "도구 목록",
        itemListElement: tools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `${ROOT_URL}/tools/${t.id}`,
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
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ROOT_SITE_NAME, item: ROOT_URL },
          { "@type": "ListItem", position: 2, name: "생활 도구", item: TOOLS_HOME },
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

        {/* 도구를 찾아온 사람은 'AI로 뭘 할 수 있나'에도 관심이 있습니다.
            새 코너로 가는 내부 링크가 홈 하나뿐이면 크롤러가 중요하게 보지 않습니다. */}
        <Link
          href="/prompts"
          className="flex items-center justify-between rounded-xl px-4 py-3 mb-3 bg-card border border-[#2a3a5a] hover:border-[#8E7CC3] transition-colors"
        >
          <span className="text-sm text-[#a0a0b0]">
            <span aria-hidden="true">🤖</span>{" "}
            <span className="font-semibold text-[#e8e8f0]">AI 프롬프트 모음</span>
            {" — "}복사해서 바로 쓰는 챗GPT 질문 78개
          </span>
          <span className="text-[#8E7CC3] text-sm shrink-0 ml-2">→</span>
        </Link>

        <AdBanner slot="XXXXXXXXXX" format="auto" />

        <CoupangGoldbox />

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
          {/* 단일 도메인에서 CALC_URL·QUIZ_URL은 둘 다 ROOT_URL이라,
              여기 세 링크가 전부 홈으로 가고 있었습니다. 경로로 적습니다. */}
          <div className="space-y-2 text-sm">
            <Link href="/help" className="block text-[#c0c8d8] hover:text-accent">
              🚨 급할 때 생활안내 — 분실·사고·체불 상황별 대처 {helpTopics.length}편
            </Link>
            <Link
              href="/calculators"
              className="block text-[#c0c8d8] hover:text-accent"
            >
              🧮 생활 계산기 — 연봉·퇴직금·자동차세 등 {CALC_COUNT}종
            </Link>
            <Link
              href="/quiz-home"
              className="block text-[#c0c8d8] hover:text-accent"
            >
              👑 상식왕 퀴즈 — {categories.length}개 카테고리{" "}
              {TOTAL_QUESTIONS.toLocaleString()}문제
            </Link>
          </div>
        </section>

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">
            왜 브라우저 안에서만 처리하나
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed break-keep">
            <p>
              여기 있는 도구는 파일을 서버로 올리지 않습니다. 선택한 파일은 브라우저
              메모리에서 읽고 바로 거기서 처리한 뒤, 결과만 내려받습니다. 네트워크
              연결을 끊어도 대부분 그대로 동작하는 이유가 그것입니다.
            </p>
            <p>
              카톡 대화 내보내기 파일에는 대화 상대의 이름과 나눈 말이 전부 들어
              있습니다. 인스타 내보내기에는 팔로워 목록이 들어 있고, 사진에는 찍은
              위치가 좌표로 박혀 있는 경우가 많습니다. 이런 파일을 분석해 주겠다며
              서버로 받아가는 서비스는, 받아간 다음 무엇을 하는지 이용자가 확인할
              방법이 없습니다.
            </p>
            <p>
              서버로 보내지 않으면 보관 정책이나 삭제 약속을 믿어야 할 이유 자체가
              사라집니다. 대신 큰 파일은 기기 성능에 따라 느릴 수 있고, 처리 결과가
              저장되지 않아 새로고침하면 다시 올려야 합니다. 그 불편을 감수하는
              대신 파일이 어디로도 가지 않는 쪽을 택했습니다.
            </p>
          </div>
        </section>

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q}>
                <p className="text-sm font-semibold text-[#e8e8f0] mb-1">{f.q}</p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed break-keep">
                  {f.a}
                </p>
              </div>
            ))}
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
