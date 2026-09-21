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

// ── 2026-09 단일 도메인으로 통합 ──
// 2026-07에 퀴즈·계산기·도구를 서브도메인으로 분리했으나, 5주 동안 네 도메인
// 모두 구글 색인 0이었습니다. 검색엔진은 서브도메인을 상당 부분 별개 사이트로
// 보기 때문에, 신뢰가 없는 신규 도메인을 넷으로 쪼개면 각자 처음부터 쌓아야
// 합니다. 226페이지짜리 사이트 하나가 5주 된 사이트 네 개보다 낫다고 판단해
// 되돌립니다. 색인된 URL이 없는 지금이 이전 비용이 가장 싼 시점입니다.
//
// env는 일부러 읽지 않습니다. Vercel에 값이 남아 있어도 분리가 되살아나지
// 않도록 코드에서 확정합니다. 다시 나누려면 아래 세 줄을
//   const quizUrl = new URL(process.env.NEXT_PUBLIC_QUIZ_URL ?? DEFAULT_URL);
// 처럼 env를 읽도록 되돌리면 QUIZ_SPLIT 이하 분리 로직이 그대로 살아납니다.
// (host 비교로 판정하므로 상수만 바뀌면 canonical·사이트맵·프록시가 따라옵니다)
const rootUrl = new URL(DEFAULT_URL);
const quizUrl = rootUrl;
const calcUrl = rootUrl;
const toolsUrl = rootUrl;

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

// 분리가 하나라도 활성인지 — proxy·sitemap·robots가 공유 (env 없으면 false = 단일 도메인)
export const SPLIT_ACTIVE = QUIZ_SPLIT || CALC_SPLIT || TOOLS_SPLIT;
// 우리가 서빙하는 정식 호스트 — www·*.vercel.app 등 그 외 호스트는 루트로 이관
export const KNOWN_HOSTS = new Set([ROOT_HOST, QUIZ_HOST, CALC_HOST, TOOLS_HOST]);

// 브랜드명 — 바꾸면 OG·JSON-LD·manifest·푸터에 일괄 반영
export const INFO_SITE_NAME = "8282114 생활안내";
export const SITE_NAME = "상식왕 퀴즈";
export const CALC_SITE_NAME = CALC_SPLIT ? "모두의 계산기" : SITE_NAME;
export const TOOLS_SITE_NAME = TOOLS_SPLIT ? "모두의 도구" : INFO_SITE_NAME;

export const CONTACT_EMAIL = "developerjin0216@gmail.com";

// 기존 코드 호환용 — 공용 페이지(about/contact/privacy/terms)의 기준 도메인
export const BASE_URL = ROOT_URL;
