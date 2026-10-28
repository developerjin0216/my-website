// 검색 색인 범위 — 사이트맵·RSS·robots 메타가 모두 이 파일 하나를 봅니다.
//
// 2026-10 서치콘솔: 사이트맵 243개 중 색인 1개, 28일 노출 2회. 직접 조치는 없었고
// 나머지는 "크롤링됨 - 현재 색인이 생성되지 않음"(가져가 읽어 보고 뺌)이었습니다.
// 홈은 "급할 때 생활 긴급 안내"라고 소개하는데 URL의 3/4이 퀴즈·MBTI·밈·프롬프트·
// 영어 슬랭이었습니다. 구글은 품질을 사이트 단위로도 보므로, 도메인 이름(8282 빨리빨리
// + 114 안내)이 약속하는 주제만 색인에 남깁니다.
//
// 빠진 페이지도 그대로 열리고 링크도 따라갑니다(follow). 되돌리려면 아래 목록에서
// 지우기만 하면 사이트맵·RSS·메타가 함께 돌아옵니다.

/** 이 경로와 그 아래 전부를 색인에서 뺍니다 */
const NOINDEX_SECTIONS = [
  "/quiz",
  "/quiz-bank",
  "/quiz-home",
  "/mbti",
  "/meme",
  "/prompts",
  "/en/slang",
  "/escape",
  "/omok",
  "/battle",
  "/tools",
];

/** 위 섹션 안이지만 주제에 맞아 남기는 페이지 (폭설·폭우 때 도로 확인) */
const INDEX_EXCEPTIONS = [
  "/tools/cctv",
  // 2026-10-28 추가. /tools 를 통째로 뺀 이유는 단일 목적 도메인(ilovepdf 등)과
  // 경쟁이 안 되는 범용 유틸리티였기 때문인데, 이 하나는 성격이 다릅니다.
  // 시중 언팔 확인 앱은 인스타 비밀번호를 받아갑니다(Meta 약관 위반·계정 정지 위험).
  // 이 도구는 공식 내보내기 파일을 브라우저에서만 분석해 그 위험 자체가 없고,
  // "비번 넣는 앱 말고 안전하게 확인하는 법"은 /help/privacy-leak 과 같은 질문입니다.
  // 위성 2개(insta-hidden·insta-dm)는 얇아서 색인에 넣지 않습니다 —
  // 주제 밖 페이지를 벌크로 넣는 것이 2026-10 에 사이트를 끌어내린 바로 그 패턴입니다.
  "/tools/insta-follow-check",
];

/** 남기는 섹션 안이지만 주제 밖인 개별 페이지 (건강 계산기) */
const NOINDEX_PAGES = ["/calculators/bmi", "/calculators/calorie"];

const under = (path: string, base: string) =>
  path === base || path.startsWith(base + "/");

/** 경로(쿼리·해시 없이, 예: "/help/medical-cost")가 검색 색인 대상인지 */
export function isIndexable(path: string): boolean {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  if (INDEX_EXCEPTIONS.some((e) => under(p, e))) return true;
  if (NOINDEX_PAGES.includes(p)) return false;
  return !NOINDEX_SECTIONS.some((s) => under(p, s));
}

/** 절대 URL에서 경로만 떼어 판정합니다 (사이트맵·RSS용) */
export function isIndexableUrl(url: string): boolean {
  return isIndexable(new URL(url).pathname);
}

/** Metadata.robots 값. 섹션 layout과 메타데이터 빌더에서 씁니다 */
export function robotsFor(path: string) {
  return isIndexable(path)
    ? { index: true, follow: true }
    : { index: false, follow: true };
}
