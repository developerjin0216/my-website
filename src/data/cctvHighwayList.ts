// 고속도로 노선 목록만 — 스냅샷(JSON 173KB)을 import 하지 않습니다.
// 클라이언트 컴포넌트(지역별 CCTV 허브)가 노선 링크를 그릴 때 이 파일을 씁니다.
// 지점 데이터가 필요하면 data/cctvHighways.ts 를 쓰세요.
//
// 노선 선정: 지점이 80곳 이상인 20개. "OO고속도로 cctv"는 폭설·명절 귀성길에 검색이 몰리는
// 말이라, 지역 단위 페이지 하나로는 받을 수 없는 검색을 노선 단위로 받습니다.
// ITS 의 노선명("경부선")과 사람들이 검색하는 이름("경부고속도로")이 달라 name 을 따로 둡니다.

export interface Highway {
  slug: string;
  /** ITS 지점명 앞의 [노선명] */
  line: string;
  /** 사람들이 부르는 이름 */
  name: string;
}

/** 색인에 남기는 대표 노선 5개 — 사이트맵과 robots 메타가 이 목록을 봅니다(indexPolicy.ts).
 *
 * 20개 노선 페이지는 서로 문장의 절반을 공유해 "가치 없음" 판정에 기여했습니다.
 * 나머지 15개는 URL·기능 그대로 200으로 열리지만 색인에서는 뺍니다.
 * 노선을 바꾸려면 여기만 고치면 사이트맵·메타가 함께 따라옵니다. */
export const INDEXED_HIGHWAY_SLUGS: string[] = [
  "gyeongbu", // 경부고속도로 — 가장 긴 축, 명절·폭설 검색이 몰립니다
  "seohaean", // 서해안고속도로
  "yeongdong", // 영동고속도로 — 강원 방면 눈길
  "jungbu", // 중부고속도로
  "capital-ring-1", // 수도권제1순환고속도로 — 수도권 통근
];

export const HIGHWAYS: Highway[] = [
  { slug: "gyeongbu", line: "경부선", name: "경부고속도로" },
  { slug: "yeongdong", line: "영동선", name: "영동고속도로" },
  { slug: "jungbu-naeryuk", line: "중부내륙선", name: "중부내륙고속도로" },
  { slug: "namhae", line: "남해선", name: "남해고속도로" },
  { slug: "seohaean", line: "서해안선", name: "서해안고속도로" },
  { slug: "jungang", line: "중앙선", name: "중앙고속도로" },
  { slug: "donghae", line: "동해선", name: "동해고속도로" },
  { slug: "seoul-yangyang", line: "서울양양선", name: "서울양양고속도로" },
  { slug: "cheongju-yeongdeok", line: "청주영덕선", name: "청주영덕고속도로" },
  { slug: "tongyeong-daejeon", line: "통영대전선", name: "통영대전고속도로" },
  { slug: "honam", line: "호남선", name: "호남고속도로" },
  { slug: "gwangju-daegu", line: "광주대구선", name: "광주대구고속도로" },
  { slug: "capital-ring-1", line: "수도권제1순환선", name: "수도권제1순환고속도로" },
  { slug: "capital-ring-2", line: "수도권제2순환선", name: "수도권제2순환고속도로" },
  { slug: "pyeongtaek-jecheon", line: "평택제천선", name: "평택제천고속도로" },
  { slug: "jungbu", line: "중부선", name: "중부고속도로" },
  { slug: "suncheon-wanju", line: "순천완주선", name: "순천완주고속도로" },
  { slug: "sejong-pocheon", line: "세종포천선", name: "세종포천고속도로" },
  { slug: "iksan-pohang", line: "익산포항선", name: "익산포항고속도로" },
  { slug: "seobu-naeryuk", line: "서부내륙선(평택부여)", name: "서부내륙고속도로" },
];

// 색인 목록의 slug 오타는 조용히 "사이트맵에서 사라진 노선"이 됩니다. 빌드에서 잡습니다.
const unknownIndexed = INDEXED_HIGHWAY_SLUGS.filter(
  (slug) => !HIGHWAYS.some((h) => h.slug === slug)
);
if (unknownIndexed.length) {
  throw new Error(
    `INDEXED_HIGHWAY_SLUGS 에 없는 노선 slug: ${unknownIndexed.join(", ")}`
  );
}
