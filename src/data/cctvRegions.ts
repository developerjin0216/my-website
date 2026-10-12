// 전국 CCTV 권역.
//
// ITS 오픈API는 시·도 이름이 아니라 위경도 사각형으로 조회합니다. 그래서 권역마다
// 사각형을 정해 두고 사용자에게는 지역 이름으로 보여줍니다.
//
// 사각형은 행정구역 경계가 아니라 조회용 범위라 가장자리가 서로 겹칩니다.
// 경계에 있는 CCTV가 두 지역에서 보이는 편이, 어느 쪽에서도 안 보이는 것보다 낫습니다.
//
// 권역을 잘게 나눈 이유: 처음엔 충청을 하나로 묶었는데 3,700대에 응답 XML이
// 1.5MB였습니다. 휴대폰으로 받기에 부담스러운 크기라 큰 곳을 쪼갰습니다.
//
// 제주는 ITS에 공개된 도로 CCTV가 없어 뺐습니다 — 눌렀는데 비어 있으면 고장으로 보입니다.

export interface CctvRegion {
  id: string;
  name: string;
  /** 목록에 함께 보여줄 대표 지명 */
  hint: string;
  box: { minX: number; maxX: number; minY: number; maxY: number };
}

export const REGIONS: CctvRegion[] = [
  {
    id: "capital",
    name: "수도권",
    hint: "서울·경기·인천",
    box: { minX: 126.6, maxX: 127.3, minY: 37.2, maxY: 37.8 },
  },
  {
    id: "gangwon",
    name: "강원",
    hint: "춘천·강릉·원주",
    box: { minX: 127.7, maxX: 129.4, minY: 37.0, maxY: 38.6 },
  },
  {
    id: "chungbuk",
    name: "충북",
    hint: "청주·충주·제천",
    box: { minX: 127.2, maxX: 128.6, minY: 36.0, maxY: 37.2 },
  },
  {
    id: "chungnam",
    name: "충남·대전",
    hint: "대전·세종·천안·당진",
    box: { minX: 126.4, maxX: 127.6, minY: 36.0, maxY: 37.1 },
  },
  {
    id: "jeonbuk",
    name: "전북",
    hint: "전주·군산·익산",
    box: { minX: 126.4, maxX: 127.9, minY: 35.4, maxY: 36.1 },
  },
  {
    id: "jeonnam",
    name: "전남·광주",
    hint: "광주·목포·여수·순천",
    box: { minX: 126.3, maxX: 127.6, minY: 34.2, maxY: 35.5 },
  },
  {
    id: "gyeongbuk",
    name: "경북·대구",
    hint: "대구·포항·안동·구미",
    box: { minX: 128.0, maxX: 129.6, minY: 35.8, maxY: 37.1 },
  },
  {
    id: "gyeongnam",
    name: "경남·부산",
    hint: "부산·울산·창원·진주",
    box: { minX: 128.0, maxX: 129.4, minY: 34.7, maxY: 35.9 },
  },
];

export function findRegion(id: string): CctvRegion | undefined {
  return REGIONS.find((r) => r.id === id);
}

// ── ITS 오픈API 직접 호출 ──
//
// 서버를 거치지 않고 브라우저가 직접 부릅니다. Vercel 함수에서는 어느 리전
// (워싱턴·싱가포르)에서도 8초 타임아웃이 났습니다 — 같은 요청이 국내에서는
// 2초인 걸 보면 ITS가 데이터센터 IP를 막거나 비표준 포트(9443)가 걸리는
// 것으로 보입니다. 사용자 브라우저에서 나가면 그 문제가 없습니다.
//
// ITS가 CORS로 우리 도메인을 허용합니다(Access-Control-Allow-Origin에 origin을
// 그대로 에코백, 프리플라이트도 GET 허용).
//
// 그 대가로 인증키가 공개 번들에 들어갑니다. 다만 영상 주소의 wmsAuthSign 토큰을
// 디코드하면 거기에 이미 키가 들어 있어서(id=...), 영상을 브라우저에서 재생하는
// 이상 노출은 피할 수 없습니다. 무료 공개데이터 키이고 한도가 소진되면 재발급하면
// 됩니다.

const ITS_ENDPOINT = "https://openapi.its.go.kr:9443/cctvInfo";

export type Road = "ex" | "its";

export interface Cam {
  name: string;
  url: string;
  road: Road;
}

export function itsUrl(region: CctvRegion, road: Road, key: string): string {
  const qs = new URLSearchParams({
    apiKey: key,
    type: road,
    cctvType: "4", // 실시간 스트리밍 (HLS, HTTPS)
    minX: String(region.box.minX),
    maxX: String(region.box.maxX),
    minY: String(region.box.minY),
    maxY: String(region.box.maxY),
    getType: "xml",
  });
  return `${ITS_ENDPOINT}?${qs}`;
}

/** ITS 응답(XML)에서 카메라 목록을 꺼냅니다. 파싱은 브라우저 DOMParser로 합니다. */
export function parseCams(xml: string, road: Road): Cam[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml");

  const msg = doc.querySelector("resultMsg")?.textContent?.trim();
  if (msg) throw new Error(msg);

  const out: Cam[] = [];
  for (const node of Array.from(doc.querySelectorAll("data"))) {
    const text = (tag: string) =>
      node.querySelector(tag)?.textContent?.trim() ?? "";
    const name = text("cctvname");
    const url = text("cctvurl");
    if (!name || !url) continue;
    // 혹시 http로 오면 https로 — 사이트가 https라 섞이면 브라우저가 막습니다
    out.push({ name, url: url.replace(/^http:/, "https:"), road });
  }
  return out;
}
