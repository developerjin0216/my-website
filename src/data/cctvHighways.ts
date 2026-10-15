import snapshot from "./cctvHighways.json";
import { HIGHWAYS, type Highway } from "./cctvHighwayList";

export { HIGHWAYS, type Highway };

// 고속도로 노선별 CCTV 페이지 (/tools/cctv/<slug>).
//
// 지점 목록은 scripts/gen-cctv-highways.mjs 가 만든 스냅샷입니다(이름·좌표만).
// 영상 주소는 방문자가 지점을 누를 때 브라우저가 받습니다 — components/tools/HighwayViewer.tsx.
// 노선 목록 자체는 data/cctvHighwayList.ts (JSON 없이 클라이언트에서 쓰기 위해 분리).

export type CamPoint = [name: string, lat: number, lng: number];

// JSON import 는 튜플을 (string | number)[] 로 넓혀 추론합니다. 형태는 생성 스크립트가 보장합니다.
const lines = snapshot.lines as unknown as Record<string, CamPoint[]>;

/** 스냅샷을 받은 날 */
export const SNAPSHOT_DATE: string = snapshot.generated;

export function getHighway(slug: string): Highway | undefined {
  return HIGHWAYS.find((h) => h.slug === slug);
}

export function camsOf(h: Highway): CamPoint[] {
  return lines[h.line] ?? [];
}

// 스냅샷을 다시 받았는데 노선명이 바뀌었거나 사라졌으면 빈 페이지가 생깁니다. 빌드에서 막습니다.
const empty = HIGHWAYS.filter((h) => (lines[h.line]?.length ?? 0) < 20).map((h) => h.line);
if (empty.length) {
  throw new Error(`cctvHighways: 스냅샷에 지점이 거의 없는 노선 — ${empty.join(", ")}`);
}
