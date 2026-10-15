#!/usr/bin/env node
// 고속도로 CCTV 지점 스냅샷 → src/data/cctvHighways.json (손으로 고치지 마세요)
//
//   node scripts/gen-cctv-highways.mjs
//
// 노선별 페이지(/tools/cctv/<노선>)가 지점 목록과 지도를 서버에서 그리려면 지점 데이터가
// 빌드 시점에 있어야 합니다. 그런데 Vercel 에서는 ITS 호출이 막혀 있어(CLAUDE.md 참고)
// 빌드 중에 받을 수 없습니다. 그래서 국내에서 이 스크립트로 받아 저장소에 넣습니다.
//
// 담는 것은 이름과 좌표뿐입니다. 영상 주소(cctvurl)의 토큰은 120분이면 만료되므로,
// 영상은 방문자가 지점을 누를 때 브라우저가 그 지점 주변만 작게 조회해 받습니다.
//
// 지점은 자주 바뀌지 않지만 신설·철거가 있으니 몇 달에 한 번 다시 돌리세요.
// 키: NEXT_PUBLIC_ITS_API_KEY (환경변수 또는 .env.local)

import { readFileSync, writeFileSync } from "node:fs";

const key =
  process.env.NEXT_PUBLIC_ITS_API_KEY ||
  (readFileSync(".env.local", "utf8").match(/^NEXT_PUBLIC_ITS_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!key) throw new Error("NEXT_PUBLIC_ITS_API_KEY 가 없습니다");

const url =
  "https://openapi.its.go.kr:9443/cctvInfo?" +
  new URLSearchParams({
    apiKey: key,
    type: "ex",
    cctvType: "4",
    minX: "124",
    maxX: "132",
    minY: "33",
    maxY: "39",
    getType: "json",
  });

const res = await fetch(url);
if (!res.ok) throw new Error(`ITS 응답 ${res.status}`);
const data = (await res.json())?.response?.data ?? [];
if (data.length < 1000) throw new Error(`지점이 ${data.length}개뿐 — 응답이 이상합니다`);

const round = (n) => Math.round(n * 1e5) / 1e5;
const lines = {};
for (const d of data) {
  const m = String(d.cctvname).match(/^\[([^\]]+)\]\s*(.*)$/);
  const lat = Number(d.coordy), lng = Number(d.coordx);
  if (!m || !(lat > 32 && lat < 40 && lng > 124 && lng < 132)) continue;
  const [, line, name] = m;
  (lines[line] ??= []).push([name.trim(), round(lat), round(lng)]);
}

// 노선 순서대로 정렬 — 순환선은 중심 기준 각도, 나머지는 주성분 축에 투영한 위치.
// 경위도를 그대로 쓰면 남북 노선과 동서 노선의 축이 섞이므로 경도에 cos(위도)를 곱해 맞춥니다.
function order(points, ring) {
  const k = Math.cos((36 * Math.PI) / 180);
  const xs = points.map((p) => p[2] * k), ys = points.map((p) => p[1]);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let key;
  if (ring) {
    key = (i) => Math.atan2(ys[i] - my, xs[i] - mx);
  } else {
    let sxx = 0, syy = 0, sxy = 0;
    xs.forEach((x, i) => { const dx = x - mx, dy = ys[i] - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; });
    const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    const ux = Math.cos(theta), uy = Math.sin(theta);
    key = (i) => (xs[i] - mx) * ux + (ys[i] - my) * uy;
  }
  return points.map((p, i) => [key(i), p]).sort((a, b) => a[0] - b[0]).map(([, p]) => p);
}

const out = {};
for (const [line, pts] of Object.entries(lines)) {
  const seen = new Set();
  const uniq = pts.filter((p) => { const s = p.join("|"); return seen.has(s) ? false : (seen.add(s), true); });
  out[line] = order(uniq, line.includes("순환"));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  "src/data/cctvHighways.json",
  JSON.stringify({ generated: today, total: data.length, lines: out }) + "\n"
);
const top = Object.entries(out).sort((a, b) => b[1].length - a[1].length);
console.log(`${today} · 전체 ${data.length}개 · 노선 ${top.length}개`);
console.log(top.slice(0, 25).map(([l, p]) => `${l}:${p.length}`).join("  "));
