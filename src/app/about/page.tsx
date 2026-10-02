import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, INFO_SITE_NAME, ROOT_URL } from "@/lib/site";
import { publisher } from "@/lib/trust";
import { CALC_COUNT } from "@/data/calculators";
import { helpTopics } from "@/data/help";
import { tools } from "@/data/tools";
import { categories, quizzes } from "@/data/quizData";

// 섹션 규모는 데이터에서 셉니다. 손으로 적어 두면 "계산기 19종"(실제 20종),
// "대처 매뉴얼 18편"(실제 27편)처럼 소개글이 조용히 사실과 어긋납니다.
const TOTAL_QUESTIONS = Object.values(quizzes).reduce(
  (n, list) => n + list.length,
  0
);

export const metadata: Metadata = {
  title: { absolute: "사이트 소개 - 8282114" },
  description:
    "8282114 생활안내·모두의 계산기·모두의 도구·상식왕 퀴즈 소개 — 운영 목적, 콘텐츠 작성 기준, 정보 출처와 갱신 원칙을 안내합니다.",
  alternates: { canonical: "/about" },
};

// 사이트 소개는 E-E-A-T의 뿌리입니다. 누가 어떤 기준으로 만드는지가
// 구조화 데이터로도 드러나야 합니다 (기존에는 스키마가 전혀 없었습니다).
const OPERATOR = "뚱피바라";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${ROOT_URL}/about#page`,
      url: `${ROOT_URL}/about`,
      name: `${INFO_SITE_NAME} 사이트 소개`,
      inLanguage: "ko-KR",
      about: { "@id": `${ROOT_URL}/#organization` },
    },
    {
      ...publisher,
      "@id": `${ROOT_URL}/#organization`,
      founder: {
        "@type": "Person",
        name: OPERATOR,
        jobTitle: "개발자",
        email: CONTACT_EMAIL,
      },
      foundingDate: "2026",
      knowsAbout: [
        "생활 긴급 대처",
        "4대보험·급여 계산",
        "전기요금",
        "한국 생활 정보",
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
          }}
        />
        <h1 className="text-2xl font-bold text-accent">사이트 소개</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">무엇을 하는 사이트인가요?</h2>
            <p>
              8282114는 <strong className="text-white">&ldquo;급할 때(8282) 바로
              찾는 안내(114)&rdquo;</strong>라는 이름 그대로, 갑작스러운 상황에서
              헤매지 않도록 돕는 무료 서비스 묶음입니다. 회원가입 없이 누구나
              바로 이용할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>
                <Link href="/help" className="text-white font-bold hover:text-accent">
                  급할 때 생활안내
                </Link>{" "}
                — 보이스피싱·분실·교통사고·의료비 등 긴급상황 실전 대처 안내{" "}
                {helpTopics.length}편
              </li>
              <li>
                <Link
                  href="/calculators"
                  className="text-white font-bold hover:text-accent"
                >
                  생활 계산기
                </Link>{" "}
                — 연봉 실수령액·퇴직금·자동차세·실업급여 등 {CALC_COUNT}종과{" "}
                <Link href="/guides" className="hover:text-accent">
                  제도 가이드
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-white font-bold hover:text-accent">
                  생활 도구
                </Link>{" "}
                — 인스타 언팔 확인, 카톡 대화 분석, PDF·이미지 도구 등{" "}
                {tools.length}종. 파일이 서버로 전송되지 않는 브라우저 완결형
              </li>
              <li>
                <Link
                  href="/quiz-home"
                  className="text-white font-bold hover:text-accent"
                >
                  상식왕 퀴즈
                </Link>{" "}
                — {categories.length}개 카테고리 {TOTAL_QUESTIONS.toLocaleString()}
                문제와 실시간 퀴즈 배틀
              </li>
              <li>
                <Link href="/en" className="text-white font-bold hover:text-accent">
                  English guides
                </Link>{" "}
                — 한국에 사는 외국인을 위한 생활 안내 영문판
              </li>
            </ul>
            <p className="mt-3 text-xs text-[#8a90a0]">
              2026년 9월까지는 계산기·도구·퀴즈를 각각 다른 서브도메인에서
              운영했습니다. 지금은 모두 8282114.xyz 한 곳으로 합쳤고, 옛 주소는
              해당 페이지로 자동 연결됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">콘텐츠 작성 기준</h2>
            <p>
              모든 안내·계산은 공신력 있는 기관의 법령·고시·공식 안내를 근거로
              작성하고, 그 출처를 각 페이지 하단 &lsquo;공식 출처·참고&rsquo;
              섹션에 링크로 명시합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>생활안내 — 국가법령정보센터·정부24·금융감독원·경찰청·소방청 등 공식 자료를 확인한 사실만 게재하고, 확인되지 않는 수치는 싣지 않습니다</li>
              <li>계산기 — 4대보험 요율, 소득세법, 근로기준법, 한전 요금표, 국토부 고시 등 해당 연도 고시 기준 (페이지에 기준 연도 표기)</li>
              <li>각 안내 페이지 상단에 최종 확인·업데이트 날짜를 표시하고, 제도가 바뀌면 갱신합니다</li>
            </ul>
            <p className="mt-2">
              다만 모든 내용은 일반 정보 제공이며 법률·의료·세무 자문이
              아닙니다. 법적 효력이 필요한 판단은 해당 기관·전문가를 통해
              확인하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">운영 원칙</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#a0a0b0]">
              <li>계산기 입력값과 도구에 올린 파일은 서버로 전송하지 않습니다 — 브라우저 안에서만 처리됩니다</li>
              <li>Google AdSense 광고와 쿠팡 파트너스 제휴로 운영되며, 제휴 배너에는 수수료 수령 사실을 표시합니다</li>
              <li>광고·제휴는 콘텐츠 열람을 방해하지 않는 위치에만 배치합니다</li>
              <li>오류·개선 제보를 환영하며, 확인 후 빠르게 반영합니다</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">운영자</h2>
            <p>
              <strong className="text-white">뚱피바라</strong>(개발자, 필명)가
              2026년부터 혼자 만들고 운영합니다. 기획·집필·개발·검수를 모두 직접
              합니다. 급한 상황에서 검색하다 광고성 글에 시간을 뺏겨본 경험이
              이 사이트의 출발점입니다 — 그래서 &ldquo;공식 출처, 행동 순서,
              군더더기 없이&rdquo;를 원칙으로 삼습니다. 콘텐츠 오류 제보, 제휴
              문의는{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              또는 <Link href="/contact" className="text-accent underline">문의 페이지</Link>를
              이용해 주세요.
            </p>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex justify-center gap-3 mb-2">
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
        <p className="text-xs text-[#606070]">© 2026 8282114 — 생활안내 · 계산기 · 도구 · 퀴즈</p>
      </footer>
    </div>
  );
}
