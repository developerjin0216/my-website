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

import { INDEXED_HIGHWAY_SLUGS } from "@/data/cctvHighwayList";

/** 이 경로와 그 아래 전부를 색인에서 뺍니다 */
const NOINDEX_SECTIONS = [
  "/omok",
  "/tools",
  "/moktak", // 사이버 목탁 — 별도 서비스, 주제 밖
];

/** 2026-11-17 삭제한 섹션 — proxy.ts 가 이 경로와 그 아래 전부에 410 Gone 을 돌려줍니다.
 *
 * 10월에 색인에서 빼고도 한 달 뒤 구글 색인은 여전히 1개였고, 서치콘솔은 "가치가 낮아 색인하지
 * 않음"으로 판단했습니다. 색인 제외 페이지도 구글은 계속 읽고 사이트 성격을 볼 때 함께 보며,
 * 애드센스 심사는 사이트 전체를 봅니다. 그래서 사장님 결정으로 주제 밖 콘텐츠(퀴즈·퀴즈 은행·
 * MBTI·밈·프롬프트·영어 슬랭·퀴즈 배틀, 약 150페이지)를 내렸습니다. 웹 도구·오목·목탁은 남김.
 * 코드는 git 기록에 있습니다(되살리려면 해당 커밋을 되돌리고 이 목록에서 빼면 됩니다).
 * 404 가 아니라 410 인 이유: "잠시 없음"이 아니라 "영구 삭제"라고 알려야 목록에서 빨리 빠집니다. */
export const GONE_SECTIONS = [
  "/quiz",
  "/quiz-bank",
  "/quiz-home",
  "/mbti",
  "/meme",
  "/prompts",
  "/en/slang",
  "/battle",
  "/result",
];

export function isGonePath(pathname: string): boolean {
  return GONE_SECTIONS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/** 위 섹션 안이지만 주제에 맞아 남기는 페이지 (폭설·폭우 때 도로 확인) */
const INDEX_EXCEPTIONS = ["/tools/cctv"];

// 2026-11-18: /tools/insta-follow-check 를 색인 예외에서 뺐습니다.
// 2026-10-28 에 "비밀번호를 받는 언팔 앱 대신"이라는 이유로 유일한 색인 도구로 남겼지만,
// 애드센스 심사는 사이트 전체를 보고 이 도구는 사이트 주제(급할 때 생활 안내)와
// SNS 계정 관리 사이에 걸쳐 있습니다. SNS·대화 분석 도구 4종(숨은기록·카톡 분석·
// DM 분석·맞팔 확인)을 함께 색인에서 빼고, 탐색(푸터·/about·/tools 목록)에서도 내렸습니다.
// URL 은 그대로 200 으로 열립니다 — 쓰던 사람이 주소로 들어오면 동작합니다.

/** /tools/cctv 아래에서 색인에 남기는 노선 — 나머지 노선은 200 이지만 색인 제외 */
const CCTV_INDEXED_ROADS = new Set(INDEXED_HIGHWAY_SLUGS);

/** 남기는 섹션 안이지만 주제 밖인 개별 페이지 (건강 계산기) */
const NOINDEX_PAGES = ["/calculators/bmi", "/calculators/calorie"];

const under = (path: string, base: string) =>
  path === base || path.startsWith(base + "/");

/** 경로(쿼리·해시 없이, 예: "/help/medical-cost")가 검색 색인 대상인지 */
export function isIndexable(path: string): boolean {
  const p = path.length > 1 ? path.replace(/\/+$/, "") : path;
  // 고속도로 노선 페이지는 대표 5개만 색인합니다(국립공원은 아래 예외로 남습니다).
  const road = p.match(/^\/tools\/cctv\/([^/]+)$/);
  if (road && road[1] !== "national-parks") {
    return CCTV_INDEXED_ROADS.has(road[1]);
  }
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
