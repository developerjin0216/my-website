// 국립공원 실시간 CCTV (/tools/cctv/national-parks).
//
// 출처: 국립공원공단 홍보미디어센터 '실시간영상'
//   https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168
// 그 페이지가 쓰는 HLS 주소(live.knps.or.kr/cctv/hls/<id>.m3u8)를 그대로 씁니다.
// - 토큰이 없어 ITS 와 달리 만료되지 않습니다.
// - Access-Control-Allow-Origin: * 라 브라우저가 직접 받습니다(이 사이트를 거치지 않음).
// - 공단 누리집은 공공누리 제1유형(출처표시)입니다. 화면에 출처를 밝힙니다.
//
// id·지점 이름은 2026-10-20 공단 페이지에서 옮겼습니다. 공단이 카메라를 바꾸면 여기도 바꿔야
// 합니다(가끔 지점이 늘거나 이름이 바뀜). 그날 gaksan·jangbuljai 는 404 였는데, 공단 안내대로
// 현장 기상·통신 상황에 따른 일시 중지로 보고 목록에는 남겼습니다 — 화면이 재생 가능 여부를 따로 확인합니다.
//
// 해수욕장 영상(해양수산부 연안 CCTV)은 넣지 않았습니다. 4초마다 바뀌는 정지 사진을 공단 내부
// 프록시로 http 서버에서 받아 오는 구조라, 외부에 열어 둔 창구가 아니고 https 페이지에서 막힙니다.

export const PARK_STREAM = (id: string) => `https://live.knps.or.kr/cctv/hls/${id}.m3u8`;

export const PARK_SOURCE_URL =
  "https://www.knps.or.kr/portal/main/contents.do?menuNo=8000168";

export interface ParkCam {
  id: string;
  /** 국립공원 이름 ('국립공원' 생략) */
  park: string;
  /** 공단이 붙인 지점 이름 */
  spot: string;
  /** 국립공원이 걸쳐 있는 시·도 (지점 하나의 위치가 아니라 공원 전체) */
  region: string;
  kind: "산" | "바다";
}

export const PARK_CAMS: ParkCam[] = [
  { id: "solak", park: "설악산", spot: "울산바위", region: "강원", kind: "산" },
  { id: "zduro", park: "오대산", spot: "두로령", region: "강원", kind: "산" },
  { id: "sangwonsa", park: "치악산", spot: "상원사", region: "강원", kind: "산" },
  { id: "zchunje", park: "태백산", spot: "천제단", region: "강원·경북", kind: "산" },
  { id: "gangbuk", park: "북한산", spot: "백운대", region: "서울·경기", kind: "산" },
  { id: "sapesan", park: "북한산", spot: "사패산", region: "서울·경기", kind: "산" },
  { id: "sobak", park: "소백산", spot: "연화봉", region: "충북·경북", kind: "산" },
  { id: "sinsungbong", park: "계룡산", spot: "천황봉", region: "충남·대전", kind: "산" },
  { id: "zjulje", park: "주왕산", spot: "기암", region: "경북", kind: "산" },
  { id: "zsulchun", park: "덕유산", spot: "설천봉", region: "전북·경남", kind: "산" },
  { id: "zjangteo", park: "지리산", spot: "장터목", region: "전북·전남·경남", kind: "산" },
  { id: "jirisan", park: "지리산", spot: "천왕봉", region: "전북·전남·경남", kind: "산" },
  { id: "naejang-1", park: "내장산", spot: "108 단풍길", region: "전북·전남", kind: "산" },
  { id: "jangbuljai", park: "무등산", spot: "장불재", region: "광주·전남", kind: "산" },
  { id: "hakampo", park: "태안해안", spot: "학암포", region: "충남", kind: "바다" },
  { id: "jukmak", park: "변산반도", spot: "죽막탐방로", region: "전북", kind: "바다" },
  { id: "gaksan", park: "한려해상", spot: "각산", region: "경남·전남", kind: "바다" },
  { id: "jodo", park: "다도해해상", spot: "지리청송해변", region: "전남", kind: "바다" },
];
