// 배포본 색인 가능성 점검.
//
//   node scripts/seo-audit.mjs              # 운영 도메인
//   node scripts/seo-audit.mjs http://localhost:3000
//
// 사이트맵을 받아 모든 URL을 실제로 긁은 뒤 두 가지를 봅니다.
//
// 1. 기술적 차단 — 비200, noindex(meta/헤더), canonical 불일치, h1 없음
// 2. 본문 글자 수 — "Crawled - currently not indexed"의 실제 원인은 대부분 이쪽입니다
//
// 글자 수는 <script>/<style>/<noscript>/주석을 지운 뒤 태그를 벗겨서 셉니다.
// RSC 페이로드를 안 지우면 글자 수가 두 배로 부풀어 얇은 페이지를 놓치고,
// 태그를 안 벗기면 Tailwind 클래스 문자열이 본문으로 잡힙니다. 실제로
// /quiz는 HTML 22KB인데 사람이 읽는 글자는 464자뿐이었습니다.

const BASE = (process.argv[2] ?? "https://8282114.xyz").replace(/\/$/, "");
const CONCURRENCY = 10;

// 임계값은 구글이 공표한 적 없습니다. 이 사이트에서 색인된 페이지와 거부된
// 페이지를 비교해 얻은 경험칙이라, 절대 기준이 아니라 우선순위용입니다.
const BUCKETS = [
  ["<1000   거의 확실히 거부", (c) => c >= 0 && c < 1000],
  ["1000~1799  위태로움", (c) => c >= 1000 && c < 1800],
  ["1800~2999  경계선", (c) => c >= 1800 && c < 3000],
  [">=3000  충분", (c) => c >= 3000],
];

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript\s*>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;|&#\d+;/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function check(url) {
  try {
    const r = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
    });
    const html = r.status === 200 ? await r.text() : "";
    const meta = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
    const xr = r.headers.get("x-robots-tag") ?? "";

    const issues = [];
    if (r.status !== 200) issues.push(`status=${r.status}`);
    if (/noindex/i.test(meta)) issues.push("meta-noindex");
    if (/noindex/i.test(xr)) issues.push("x-robots-noindex");
    // canonical은 언제나 운영 절대 URL이므로, 로컬 점검일 때는 호스트를 떼고
    // 경로만 비교합니다. 안 그러면 모든 페이지가 불일치로 잡혀 노이즈만 남습니다.
    const canonKey = canon.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
    const urlKey = url.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
    if (!canon) issues.push("canonical 없음");
    else if (canonKey !== urlKey) issues.push(`canonical->${canon}`);
    if (r.status === 200 && !visibleText(h1)) issues.push("h1 없음");

    return { url, chars: visibleText(html).length, issues };
  } catch (e) {
    return { url, chars: -1, issues: [`FETCH ${e.message}`] };
  }
}

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  // 로컬 점검일 때도 사이트맵은 운영 URL을 내보내므로 호스트를 바꿔 끼웁니다
  m[1].replace(/^https?:\/\/[^/]+/, BASE)
);
if (!urls.length) {
  console.error(`사이트맵에서 URL을 찾지 못했습니다: ${BASE}/sitemap.xml`);
  process.exit(1);
}

const rows = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) rows.push(await check(queue.pop()));
  })
);
rows.sort((a, b) => a.chars - b.chars);

const broken = rows.filter((r) => r.issues.length);
console.log(`${BASE} · ${rows.length}개 점검 · 기술적 문제 ${broken.length}건`);
for (const r of broken) console.log(`  ! ${r.url} :: ${r.issues.join(", ")}`);

console.log("\n본문 글자 수");
for (const [label, f] of BUCKETS) {
  const n = rows.filter((r) => f(r.chars)).length;
  console.log(`  ${String(n).padStart(4)}  ${label}`);
}

const thin = rows.filter((r) => r.chars >= 0 && r.chars < 1800);
console.log(`\n보강 대상 ${thin.length}개 (얇은 순)`);
for (const r of thin)
  console.log(
    `  ${String(r.chars).padStart(6)}  ${r.url.replace(BASE, "") || "/"}`
  );

process.exitCode = broken.length ? 1 : 0;
