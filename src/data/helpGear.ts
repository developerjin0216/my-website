import { helpTopics } from "@/data/help";

// /help 하단 쇼핑 블록 — 그 상황에 실제로 쓰이는 물건만, 쿠팡 상품 검색 API로 보여줍니다.
//
// 원칙
// - 본문이 이미 말하는 물건을 우선합니다(문 잠김 → 9V 건전지는 본문이 사라고 안내함).
//   본문과 상관없는 '이참에 사세요'식 상품은 넣지 않습니다.
// - note 에는 효능·법적 의무 같은 주장을 쓰지 않습니다. 왜 이 상황과 관련 있는지만 씁니다.
// - 약은 넣지 않습니다(일반의약품은 온라인 판매 대상이 아님).
// - 의료기기(체온계 등)도 넣지 않습니다. 파트너스 검색 API가 결과를 주지 않고 엉뚱한 상품을 돌려줍니다.
// - 키워드를 바꾸면 실제 검색 결과를 확인하세요. lib/coupang.ts 의 relevant() 가 무관한 상품을 거르지만
//   전부 걸러지면 블록 자체가 사라집니다.
// - 실종 아동·치매 어르신은 정부가 GPS 배회감지기를 무상 지원하므로(본문) 위치추적 상품을 팔지 않습니다.
//
// 페이지당 쇼핑 블록은 하나 — 여기 있는 주제는 범용 쿠팡 배너 대신 이 블록이 나갑니다.

export interface GearItem {
  /** 쿠팡 검색어 = 탭 이름 */
  keyword: string;
  /** 이 상황과 왜 관련 있는지 한두 문장 */
  note: string;
  /** 상품명에 반드시 있어야 하는 단어 — 검색 결과에 섞이는 다른 규격을 거릅니다 */
  must?: string[];
}

export const helpGear: Record<string, GearItem[]> = {
  "locked-out": [
    {
      keyword: "9V 알카라인 건전지",
      must: ["알카라인"],
      note: "도어락 건전지가 방전됐을 때 바깥쪽 비상전원 단자에 9V 건전지를 대고 비밀번호를 누르면 열립니다(본문 ②). 집 밖, 가방이나 차에 있어야 쓸 수 있습니다.",
    },
    {
      keyword: "AA 알카라인 건전지",
      note: "도어락에서 건전지 교체 경고음이 나면 그때 바로 갈아 두는 게 가장 확실한 예방입니다.",
    },
  ],
  "car-accident": [
    {
      keyword: "블랙박스",
      note: "본문처럼 주차 중 긁혔을 때는 내 블랙박스 주차녹화가 첫 번째 증거입니다. 상대가 말을 바꿀 때도 영상이 기준이 됩니다.",
    },
    {
      keyword: "블랙박스 메모리카드",
      note: "메모리카드는 계속 덮어쓰는 소모품이라, 오래 쓰면 정작 필요할 때 녹화가 안 돼 있을 수 있습니다.",
    },
  ],
  "utility-outage": [
    {
      keyword: "LED 랜턴",
      note: "동네 전체 정전이면 한전 복구를 기다려야 합니다. 휴대폰 손전등은 배터리를 빨리 씁니다.",
    },
    {
      keyword: "보조배터리",
      note: "정전 중에도 한전 123 복구 안내와 재난문자를 받으려면 휴대폰이 켜져 있어야 합니다.",
    },
    {
      keyword: "생수 2L",
      note: "단수 안내가 나오면 마실 물부터 확보해야 합니다.",
    },
  ],
  "frozen-pipes": [
    {
      keyword: "수도계량기 보온덮개",
      note: "본문의 '채우기' — 계량기함을 마른 보온재로 채우고 뚜껑을 덮어 찬 공기를 막습니다. 서울시는 아파트·연립주택에 보온덮개를 나눠 주기도 합니다.",
    },
    {
      keyword: "배관 보온재",
      note: "노출된 수도관과 보일러 배관도 보온재로 감싸라는 것이 서울시 안내입니다.",
    },
  ],
  "natural-disaster": [
    {
      keyword: "재난 생존가방",
      note: "본문대로 대피할 때는 짐 챙길 시간이 없습니다. 가져갈 수 있는 건 미리 꾸려 둔 가방 하나입니다.",
    },
    {
      keyword: "LED 랜턴",
      note: "밤중 대피와 정전이 겹칠 때 손이 자유로운 조명이 필요합니다.",
    },
    {
      keyword: "보조배터리",
      note: "재난문자와 대피 안내를 계속 받으려면 휴대폰 배터리가 버텨야 합니다.",
    },
  ],
  "noise-complaint": [
    {
      keyword: "수면 귀마개",
      note: "윗집에 직접 올라가 항의하면 오히려 처벌받을 수 있습니다(본문 1). 절차를 밟는 동안 잠이라도 지키는 용도입니다.",
    },
  ],
  "moving-checklist": [
    {
      keyword: "에어캡",
      note: "깨지기 쉬운 물건은 따로 감싸 두세요. 아래 사례처럼 이사 중 파손은 배상을 받아도 수리비에 한참 못 미칠 수 있습니다.",
    },
    {
      keyword: "이사 박스",
      note: "포장이사가 아니라면 박스부터 필요합니다.",
    },
    {
      keyword: "서류 파우치",
      note: "본문 D-1 체크리스트처럼 귀중품과 서류는 이삿짐과 따로 챙기세요.",
    },
  ],
  "outdoor-injury": [
    {
      keyword: "휴대용 구급함",
      note: "산이나 캠핑장에서 상처 소독과 지혈을 바로 할 수 있게 챙겨 두는 용도입니다.",
    },
  ],
};

/** 쇼핑 블록을 아예 두지 않는 주제 — 돈을 잃었거나 위기에 놓인 사람이 보는 페이지입니다.
 *  여기에 무작위 상품 배너를 붙이면 신뢰를 잃고, 팔리지도 않습니다. */
export const NO_SHOPPING = new Set([
  "medical-cost",
  "voice-phishing",
  "unpaid-wages",
  "missing-person",
  "jeonse-check",
  "privacy-leak",
  "secondhand-scam",
]);

// 빌드 때 검사 — 오타 난 주제 id 는 조용히 무시되므로 여기서 막습니다.
const known = new Set(helpTopics.map((t) => t.id));
const bad = [...Object.keys(helpGear), ...NO_SHOPPING].filter((id) => !known.has(id));
const both = Object.keys(helpGear).filter((id) => NO_SHOPPING.has(id));
if (bad.length || both.length) {
  throw new Error(
    `helpGear 검사 실패 — 없는 주제: ${bad.join(", ") || "없음"} / 양쪽에 다 있음: ${both.join(", ") || "없음"}`
  );
}
