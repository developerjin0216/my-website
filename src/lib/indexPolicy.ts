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
const INDEX_EXCEPTIONS = ["/tools/cctv"];

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
