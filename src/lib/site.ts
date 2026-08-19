// 사이트 공용 상수 — sitemap, robots, 메타데이터, JSON-LD, 프록시(도메인 분리)에서 공유
//
// ── 3분할 구조 ──
// 루트(8282114.xyz)      = 급할때 생활안내 (도메인 브랜드: 빨리빨리+114)
// quiz.8282114.xyz       = 상식왕 퀴즈
// calc.8282114.xyz       = 모두의 계산기
//
// env로 제어 (빌드 타임 상수 — 변경 시 재배포 필요):
//   NEXT_PUBLIC_QUIZ_URL=https://quiz.8282114.xyz
//   NEXT_PUBLIC_CALC_URL=https://calc.8282114.xyz
// env가 없거나 잘못되면 루트 도메인으로 폴백 (fail-open, 단일 도메인 동작).

const DEFAULT_URL = "https://8282114.xyz"; // 소유 도메인 (2026-08 구입, Porkbun)

// 잘못된 env(스킴 누락 등)는 무시하고 폴백 — 사이트가 죽는 것보다 분리 비활성이 낫다
function parseUrl(raw: string | undefined, fallback: string): URL {
  if (!raw) return new URL(fallback);
  try {
    return new URL(raw);
  } catch {
    return new URL(fallback);
  }
}

const rootUrl = new URL(DEFAULT_URL);
const quizUrl = parseUrl(process.env.NEXT_PUBLIC_QUIZ_URL, DEFAULT_URL);
const calcUrl = parseUrl(process.env.NEXT_PUBLIC_CALC_URL, DEFAULT_URL);
const toolsUrl = parseUrl(process.env.NEXT_PUBLIC_TOOLS_URL, DEFAULT_URL);

// origin으로 정규화 — 트레일링 슬래시·경로가 섞여 들어와도 안전
export const ROOT_URL = rootUrl.origin;
export const QUIZ_URL = quizUrl.origin;
export const CALC_URL = calcUrl.origin;
export const TOOLS_URL = toolsUrl.origin;
export const ROOT_HOST = rootUrl.host;
export const QUIZ_HOST = quizUrl.host;
export const CALC_HOST = calcUrl.host;
export const TOOLS_HOST = toolsUrl.host;

// 분리 활성 여부 — host 비교 (표기 차이로 인한 오작동 방지)
export const QUIZ_SPLIT = QUIZ_HOST !== ROOT_HOST;
export const CALC_SPLIT = CALC_HOST !== ROOT_HOST;
export const TOOLS_SPLIT = TOOLS_HOST !== ROOT_HOST;
// 기존 코드 호환: 계산기 분리 여부
export const SPLIT = CALC_SPLIT;

// 브랜드명 — 바꾸면 OG·JSON-LD·manifest·푸터에 일괄 반영
export const INFO_SITE_NAME = "8282114 생활안내";
export const SITE_NAME = "상식왕 퀴즈";
export const CALC_SITE_NAME = CALC_SPLIT ? "모두의 계산기" : SITE_NAME;
export const TOOLS_SITE_NAME = TOOLS_SPLIT ? "모두의 도구" : INFO_SITE_NAME;

export const CONTACT_EMAIL = "developerjin0216@gmail.com";

// 기존 코드 호환용 — 공용 페이지(about/contact/privacy/terms)의 기준 도메인
export const BASE_URL = ROOT_URL;
