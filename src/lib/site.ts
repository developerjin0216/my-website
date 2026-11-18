// 사이트 공용 상수 — sitemap, robots, 메타데이터, JSON-LD, 프록시(도메인 분리)에서 공유
//
// ── 3분할 구조 (2026-07~09 에 쓰고 되돌린 구조 — 지금은 호스트 판정에만 남음) ──
// 루트(8282114.xyz)      = 급할 때 생활안내 (도메인 브랜드: 빨리빨리+114)
// quiz.8282114.xyz       = (종료) 2026-11-17 퀴즈 삭제, 410
// calc.8282114.xyz       = 지금은 /calculators 경로
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

// ── 브랜드명 — 바꾸면 OG·JSON-LD·manifest·제목·공유 문구에 일괄 반영 ──
//
// 2026-11 애드센스 '가치 없음' 대응으로 이름을 8282114 하나로 통일했습니다.
// 그전에는 섹션마다 다른 이름(상식왕 퀴즈·모두의 계산기·모두의 도구)을 썼고, 그 이름이
// 제목·푸터·OPG·공유 문구에 남아 사이트가 한 서비스가 아니라 서너 개 서비스의 모음처럼
// 읽혔습니다. 심사자는 사이트 전체를 보므로 이름부터 하나여야 합니다.
// 퀴즈는 2026-11-17 삭제되어(410) 그 이름을 쓰는 페이지가 없습니다.
export const INFO_SITE_NAME = "8282114 생활안내";
/** 화면과 제목에서 사이트를 부르는 짧은 이름 */
export const BRAND = "8282114";
// 아래 셋은 분리 시절 이름 자리입니다. 분리를 되살려도 이름은 하나로 둡니다 —
// 사이트가 하나의 브랜드로 읽히는 편이 색인·심사에 유리합니다.
export const SITE_NAME = INFO_SITE_NAME;
export const CALC_SITE_NAME = INFO_SITE_NAME;
export const TOOLS_SITE_NAME = INFO_SITE_NAME;

// 루트(/)를 가리키는 이름 — 빵부스러기 1번 항목이 주소(ROOT_URL)와 같은 이름을 쓰도록 합니다.
export const ROOT_SITE_NAME = INFO_SITE_NAME;

export const CONTACT_EMAIL = "developerjin0216@gmail.com";

// 기존 코드 호환용 — 공용 페이지(about/contact/privacy/terms)의 기준 도메인
export const BASE_URL = ROOT_URL;
