// 사이트 공용 상수 — sitemap, robots, 메타데이터, JSON-LD, 프록시(도메인 분리)에서 공유
//
// ── 도메인 분리 ──
// Vercel 프로젝트에 퀴즈/계산기 도메인 두 개를 연결하고 아래 env를 설정하면
// src/proxy.ts가 접속 도메인을 보고 섹션을 분리합니다.
//   NEXT_PUBLIC_QUIZ_URL=https://퀴즈도메인
//   NEXT_PUBLIC_CALC_URL=https://calc.퀴즈도메인
// env가 없거나 잘못된 값이면 단일 도메인으로 동작합니다 (fail-open).
// env 변경 후에는 재배포해야 반영됩니다 (빌드 타임 상수).

const DEFAULT_URL = "https://my-website-nine-fawn-47.vercel.app";

// 잘못된 env(스킴 누락 등)는 무시하고 폴백 — 사이트가 죽는 것보다 분리 비활성이 낫다
function parseUrl(raw: string | undefined, fallback: string): URL {
  if (!raw) return new URL(fallback);
  try {
    return new URL(raw);
  } catch {
    return new URL(fallback);
  }
}

const quizUrl = parseUrl(process.env.NEXT_PUBLIC_QUIZ_URL, DEFAULT_URL);
const calcUrl = parseUrl(process.env.NEXT_PUBLIC_CALC_URL, quizUrl.href);

// origin으로 정규화 — 트레일링 슬래시·경로가 섞여 들어와도 안전
export const QUIZ_URL = quizUrl.origin;
export const CALC_URL = calcUrl.origin;
export const QUIZ_HOST = quizUrl.host;
export const CALC_HOST = calcUrl.host;

// 도메인 분리 활성 여부 — 문자열이 아닌 host 비교 (표기 차이로 인한 오작동 방지)
export const SPLIT = QUIZ_HOST !== CALC_HOST;

export const SITE_NAME = "상식왕 퀴즈";
// 계산기 사이트 브랜드 (moducalc.vercel.app) — 이름만 바꾸면 OG·JSON-LD·푸터에 일괄 반영
export const CALC_SITE_NAME = SPLIT ? "모두의 계산기" : SITE_NAME;

export const CONTACT_EMAIL = "developerjin0216@gmail.com";

// 기존 코드 호환용 (퀴즈 섹션이 루트 사이트)
export const BASE_URL = QUIZ_URL;
