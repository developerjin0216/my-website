// 배포된 번들에 ITS 키가 실제로 구워졌는지 확인합니다.
// NEXT_PUBLIC_ 값은 빌드 시점에 번들에 들어가므로, 환경변수를 바꾼 뒤
// 재배포하지 않으면 예전 번들이 그대로 서빙됩니다.
const BASE = "https://8282114.xyz";
const KEY = "1ed6d32a89f5402186b157bd5a368dfe";

const html = await (await fetch(`${BASE}/tools/cctv`)).text();
const chunks = [...new Set([...html.matchAll(/\/_next\/static\/[^"']+?\.js/g)].map((m) => m[0]))];
console.log(`JS 청크 ${chunks.length}개 확인 중…`);

let found = null;
for (const c of chunks) {
  const js = await (await fetch(BASE + c)).text();
  if (js.includes(KEY)) {
    found = c;
    break;
  }
}

if (found) {
  console.log(`✓ 키가 번들에 있습니다 — ${found}`);
} else {
  console.log("✗ 키가 번들에 없습니다 → 재배포가 필요합니다");
  console.log("  (환경변수는 빌드 때 구워져서, 저장만으로는 반영되지 않습니다)");
}

// 페이지 자체는 뜨는지
const res = await fetch(`${BASE}/tools/cctv`);
console.log(`\n/tools/cctv  ${res.status}`);
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<[^>]*>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
console.log(`서버 렌더 본문 ${text.length}자`);
console.log(`옛 서버 라우트 제거 확인: /api/cctv → ${(await fetch(`${BASE}/api/cctv?region=capital`)).status} (404면 정상)`);
