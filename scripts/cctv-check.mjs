// 배포본을 브라우저와 같은 조건으로 점검합니다.
// 번들에서 키를 꺼내 → ITS 목록 호출 → 영상 주소 → m3u8 까지 따라갑니다.
const BASE = "https://8282114.xyz";
const ORIGIN = { Origin: BASE, Referer: `${BASE}/tools/cctv` };

const html = await (await fetch(`${BASE}/tools/cctv`)).text();
const chunks = [...new Set([...html.matchAll(/\/_next\/static\/[^"']+?\.js/g)].map((m) => m[0]))];

let key = null;
for (const c of chunks) {
  const js = await (await fetch(BASE + c)).text();
  const m = js.match(/NEXT_PUBLIC_ITS_API_KEY["']?\s*[:=]\s*["']([a-f0-9]{32})["']/) ?? js.match(/["']([a-f0-9]{32})["']/);
  if (m) { key = m[1]; break; }
}
if (!key) { console.log("✗ 번들에서 키를 찾지 못했습니다"); process.exit(1); }
console.log(`키 확인 ${key.slice(0, 8)}…\n`);

const REGIONS = [
  ["수도권", 126.6, 127.3, 37.2, 37.8],
  ["강원", 127.7, 129.4, 37.0, 38.6],
  ["경남·부산", 128.0, 129.4, 34.7, 35.9],
];

let firstUrl = null;
for (const [name, minX, maxX, minY, maxY] of REGIONS) {
  const counts = [];
  for (const road of ["ex", "its"]) {
    const qs = new URLSearchParams({
      apiKey: key, type: road, cctvType: "4",
      minX: String(minX), maxX: String(maxX), minY: String(minY), maxY: String(maxY),
      getType: "xml",
    });
    const t0 = Date.now();
    const res = await fetch(`https://openapi.its.go.kr:9443/cctvInfo?${qs}`, { headers: ORIGIN });
    const xml = await res.text();
    const n = (xml.match(/<data>/g) ?? []).length;
    counts.push(`${road === "ex" ? "고속" : "국도"} ${n}대 ${(Date.now() - t0) / 1000}s`);
    const cors = res.headers.get("access-control-allow-origin");
    if (!firstUrl) firstUrl = (xml.match(/<cctvurl>([^<]*)<\/cctvurl>/) ?? [])[1];
    if (road === "ex") counts.push(`CORS:${cors ?? "없음"}`);
  }
  console.log(`${name.padEnd(10)} ${counts.join("  ")}`);
}

console.log("\n영상 체인 확인");
const r1 = await fetch(firstUrl, { headers: ORIGIN, redirect: "manual" });
console.log(`  1) 영상 주소     ${r1.status} ${r1.status === 302 ? "→ 리다이렉트" : ""}`);
const playlist = r1.headers.get("location");
const r2 = await fetch(playlist, { headers: ORIGIN });
const body = await r2.text();
console.log(`  2) m3u8          ${r2.status} ${r2.headers.get("content-type")}`);
console.log(`  3) 스트림 정보   ${(body.match(/RESOLUTION=([\dx]+)/) ?? [])[1] ?? "?"} · ${body.includes("#EXTM3U") ? "유효한 플레이리스트 ✓" : "형식 이상 ✗"}`);
