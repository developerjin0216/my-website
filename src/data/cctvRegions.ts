// 전국 CCTV 권역 — API 라우트와 화면이 같은 목록을 씁니다.
//
// ITS 오픈API는 시·도 이름이 아니라 위경도 사각형으로 조회합니다. 그래서 권역마다
// 사각형을 정해 두고, 사용자에게는 지역 이름으로 보여줍니다.
//
// 사각형은 행정구역 경계가 아니라 조회용 범위라 가장자리가 서로 겹칩니다.
// 경계에 있는 CCTV가 두 지역에서 보이는 편이, 어느 쪽에서도 안 보이는 것보다 낫습니다.
//
// 2026-10 기준 실제 조회 결과(고속도로 + 국도): 전국 약 11,300대.
// 제주는 ITS에 공개된 도로 CCTV가 없어 목록에서 뺐습니다 — 눌렀는데 비어 있으면
// 고장으로 보입니다.

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
    id: "chungcheong",
    name: "충청",
    hint: "대전·세종·청주·천안",
    box: { minX: 126.4, maxX: 128.6, minY: 36.0, maxY: 37.2 },
  },
  {
    id: "jeolla",
    name: "전라",
    hint: "광주·전주·목포·여수",
    box: { minX: 126.3, maxX: 127.9, minY: 34.7, maxY: 36.1 },
  },
  {
    id: "gyeongbuk",
    name: "경북·대구",
    hint: "대구·포항·안동·구미",
    box: { minX: 128.0, maxX: 129.6, minY: 35.6, maxY: 37.1 },
  },
  {
    id: "gyeongnam",
    name: "경남·부산",
    hint: "부산·울산·창원·진주",
    box: { minX: 128.0, maxX: 129.4, minY: 34.7, maxY: 35.6 },
  },
];

export function findRegion(id: string): CctvRegion | undefined {
  return REGIONS.find((r) => r.id === id);
}
