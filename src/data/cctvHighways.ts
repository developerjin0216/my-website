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

// ITS 목록 끝에 다른 노선 카메라가 섞여 오는 경우가 있습니다. 2026-10-15 스냅샷의 중부선은
// 남이육교(북위 36.60)에서 끝나야 하는데, 그 뒤에 125km 떨어진 백천2교·매촌1교·진주분기점2
// (통영대전고속도로 구간, 노선번호 35를 같이 씀)가 붙어 있었습니다. 그대로 두면 중부 페이지가
// "반대쪽 끝 진주분기점2"라고 쓰고, 남해 페이지가 "진주분기점에서 중부고속도로와 만난다"고
// 잘못 씁니다. 목록 양 끝에서 100km 넘게 떨어진 3대 이하 묶음만 잘라냅니다 — 동해(114km 뒤
// 100대)·중앙·익산포항처럼 실제로 구간이 나뉜 노선은 묶음이 커서 건드리지 않습니다.
const STRAY_GAP_KM = 100;
const STRAY_MAX_RUN = 3;

function km(a: CamPoint, b: CamPoint): number {
  const r = (x: number) => (x * Math.PI) / 180;
  const dLat = r(b[1] - a[1]);
  const dLng = r(b[2] - a[2]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

function trimStrays(cams: CamPoint[]): CamPoint[] {
  let start = 0;
  let end = cams.length;
  for (let i = 1; i <= STRAY_MAX_RUN && i < cams.length; i++) {
    if (km(cams[i - 1], cams[i]) > STRAY_GAP_KM) start = i;
  }
  for (let i = cams.length - 1; i >= cams.length - STRAY_MAX_RUN && i > 0; i--) {
    if (km(cams[i - 1], cams[i]) > STRAY_GAP_KM) end = i;
  }
  return cams.slice(start, end);
}

const trimmed = new Map<string, CamPoint[]>();

export function camsOf(h: Highway): CamPoint[] {
  let c = trimmed.get(h.line);
  if (!c) {
    c = trimStrays(lines[h.line] ?? []);
    trimmed.set(h.line, c);
  }
  return c;
}

// ── 노선 페이지마다 다른 본문 (2026-11-17) ─────────────────────────────────────
// 노선 페이지 20개가 같은 틀에 카메라 이름 목록만 달라서, 문장의 절반가량이 서로 겹쳤습니다
// (scripts/content-audit.mjs). 아래 두 함수는 **지점 이름에서만** 노선별 내용을 뽑습니다.
// 지도·좌표로 지역이나 방향을 추론하지 않습니다 — 지어낸 지리 정보가 되기 때문입니다.

/** "호법분기점1" → "호법", "곤지암JCT" → "곤지암". 분기점이 아니면 null */
function junctionBase(name: string): string | null {
  const m = name.replace(/\s/g, "").match(/^(.+?)(분기점|JCT|JC)/i);
  if (!m || m[1].length < 2) return null;
  return m[1].replace(/[0-9]+$/, "");
}

export interface Junction {
  /** 화면 이름, 예: "호법분기점" */
  label: string;
  /** 같은 이름의 분기점이 지점 목록에 있는 다른 노선 = 여기서 만나는 고속도로 */
  meets: Highway[];
}

/** 이 노선의 분기점(노선 순서)과, 같은 분기점 이름이 다른 노선 목록에도 있으면 그 노선 */
export function junctionsOf(h: Highway): Junction[] {
  const bases = [...new Set(camsOf(h).map((c) => junctionBase(c[0])).filter((b): b is string => !!b))];
  return bases.map((b) => ({
    label: `${b}분기점`,
    meets: HIGHWAYS.filter(
      (o) => o.slug !== h.slug && camsOf(o).some((c) => junctionBase(c[0]) === b)
    ),
  }));
}

/** 이름에 휴게소·졸음쉼터가 들어간 지점(노선 순서, 중복 제거) */
export function stopsOf(h: Highway): { rest: string[]; shelters: string[] } {
  const pick = (re: RegExp) => [
    ...new Set(
      camsOf(h)
        .map((c) => c[0].replace(/\(/g, " ").replace(/\s+/g, " ").match(re)?.[1]?.trim())
        .filter((x): x is string => !!x)
    ),
  ];
  return { rest: pick(/^(.+?휴게소)/), shelters: pick(/^(.+?졸음쉼터)/) };
}

// 스냅샷을 다시 받았는데 노선명이 바뀌었거나 사라졌으면 빈 페이지가 생깁니다. 빌드에서 막습니다.
const empty = HIGHWAYS.filter((h) => (lines[h.line]?.length ?? 0) < 20).map((h) => h.line);
if (empty.length) {
  throw new Error(`cctvHighways: 스냅샷에 지점이 거의 없는 노선 — ${empty.join(", ")}`);
}
