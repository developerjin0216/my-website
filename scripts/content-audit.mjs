// 콘텐츠 품질 감사 — 빌드 산출물(.next)의 색인 페이지만 봅니다.
//
// link-audit.mjs 가 "서로 어떻게 연결돼 있는가"를 본다면, 이쪽은 심사 체크리스트입니다:
//   1. 제휴(쿠팡) 앵커에 rel="nofollow sponsored" 가 다 붙어 있는가
//   2. 법률·의료비·보상금 글에 공식 출처 블록이 있는가 (섹션별 유무)
//   3. 사이트에 적힌 전화번호 전수 — 낡은 번호를 사람이 훑어보기 위한 목록
//   4. 페이지 간 똑같은 문장 비율 — 본문 중복인지 셸·푸터 중복인지 구분해서 읽을 것
//
//   npm run build && node scripts/content-audit.mjs
//
// 종료 코드: rel 누락이 있으면 1. 나머지는 보고만 합니다(판단은 사람이).

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = ".next/server/app";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) files.push(p);
  }
})(ROOT);

const visible = (h) =>
  h
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;|&#\d+;/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const pages = [];
for (const f of files) {
  const rel = "/" + relative(ROOT, f).replace(/\\/g, "/").replace(/\.html$/, "");
  if (rel.startsWith("/_")) continue;
  const html = readFileSync(f, "utf8");
  if (/name="robots" content="noindex/.test(html)) continue;
  pages.push({ rel: rel === "/index" ? "/" : rel, html, text: visible(html) });
}
console.log(`색인 페이지 ${pages.length}개\n`);

let failed = 0;

// ── 1. 제휴 앵커 rel ────────────────────────────────────────────────
console.log("== 1. 제휴 앵커 rel (sponsored + nofollow) ==");
const relBad = [];
let relOk = 0;
for (const p of pages) {
  for (const m of p.html.matchAll(/<a\b([^>]*)href="(https?:\/\/[^"]*(?:coupang|toss)[^"]*)"([^>]*)>/gi)) {
    const rel = ((m[1] + m[3]).match(/rel="([^"]*)"/) || [])[1] || "";
    if (/sponsored/.test(rel) && /nofollow/.test(rel)) relOk++;
    else relBad.push(`${p.rel} → ${m[2].slice(0, 60)} rel="${rel}"`);
  }
}
console.log(`  정상 ${relOk}개 / 누락 ${relBad.length}개`);
if (relBad.length) {
  failed = 1;
  relBad.slice(0, 20).forEach((x) => console.log("   ✗", x));
}

// ── 2. 공식 출처 블록 ───────────────────────────────────────────────
console.log("\n== 2. 공식 출처 블록 (섹션별) ==");
const srcHeading = /공식 출처|계산 근거·공식 출처|Official sources/;
const bySection = {};
for (const p of pages) {
  const sec = p.rel.split("/")[1] || "(root)";
  (bySection[sec] ??= { has: 0, none: [] });
  if (srcHeading.test(p.text)) bySection[sec].has++;
  else bySection[sec].none.push(p.rel);
}
for (const [sec, v] of Object.entries(bySection)) {
  const none = v.none.length ? ` — 없음: ${v.none.map((r) => r.split("/").pop() || "/").join(", ")}` : "";
  console.log(`  /${sec.padEnd(12)} 있음 ${String(v.has).padStart(2)} / 없음 ${String(v.none.length).padStart(2)}${none}`);
}
console.log("  (허브·법적 페이지는 출처가 없는 것이 정상입니다)");

// ── 3. 전화번호 전수 ────────────────────────────────────────────────
console.log("\n== 3. 적혀 있는 전화번호 (고유) — 낡은 번호가 없는지 사람이 훑어볼 목록 ==");
const SHORT3 = new Set(["109", "110", "112", "113", "117", "118", "119", "120", "122", "125", "126", "129", "132", "182"]);
const UNIT = /^(원|년|만|억|kWh|건|명|개|곳|일|호|cc|%|시간|점|층|kg|m)/;
const nums = new Map();
for (const p of pages) {
  const t = p.text;
  const re = /(?<![\d,.\-])(0\d{1,2}-\d{3,4}-\d{4}|1\d{3}-\d{4}|1\d{3}|1\d{2})(?![\d,.\-])/g;
  for (const m of t.matchAll(re)) {
    const n = m[1];
    const after = t.slice(m.index + n.length, m.index + n.length + 4).trim();
    const before = t.slice(Math.max(0, m.index - 2), m.index).trim();
    if (n.length === 3 && !SHORT3.has(n)) continue;
    if (n.length === 4 && /^19\d\d$|^20\d\d$/.test(n)) continue; // 연도
    if (UNIT.test(after) || /\d$/.test(before)) continue;
    const ctx = t.slice(Math.max(0, m.index - 24), m.index + n.length + 12).replace(/\s+/g, " ");
    if (!nums.has(n)) nums.set(n, { pages: new Set(), ctx });
    nums.get(n).pages.add(p.rel);
  }
}
for (const [n, v] of [...nums].sort((a, b) => b[1].pages.size - a[1].pages.size)) {
  console.log(`  ${n.padEnd(14)} ${String(v.pages.size).padStart(3)}p  …${v.ctx}…`);
}

// ── 4. 페이지 간 문장 중복 ──────────────────────────────────────────
console.log("\n== 4. 페이지 간 똑같은 문장 (20자 이상) ==");
const sentencesOf = (t) =>
  t.split(/(?<=[.!?다요됩니다])\s+/).map((s) => s.trim()).filter((s) => s.length >= 20);
const freq = new Map();
const per = pages.map((p) => ({ rel: p.rel, sents: [...new Set(sentencesOf(p.text))] }));
for (const p of per) for (const s of p.sents) freq.set(s, (freq.get(s) || 0) + 1);
const scored = per
  .map((p) => {
    const dup = p.sents.filter((s) => freq.get(s) > 1).length;
    return { rel: p.rel, n: p.sents.length, dup, uniq: p.sents.length ? 1 - dup / p.sents.length : 1 };
  })
  .sort((a, b) => a.uniq - b.uniq);
const avg = scored.reduce((s, x) => s + x.uniq, 0) / scored.length;
console.log(`  평균 고유 문장 비율 ${(avg * 100).toFixed(1)}% — 허브·노선 페이지는 셸(푸터·면책·공통 링크) 때문에 낮게 나옵니다`);
scored.slice(0, 10).forEach((x) =>
  console.log(`   ${(x.uniq * 100).toFixed(0).padStart(3)}%  ${String(x.n).padStart(3)}문장 중 ${String(x.dup).padStart(3)} 공유  ${x.rel}`)
);
console.log("  10페이지 이상에 똑같이 나오는 문장:");
[...freq]
  .filter(([, c]) => c >= 10)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .forEach(([s, c]) => console.log(`   ${String(c).padStart(3)}p  ${s.slice(0, 72)}`));

process.exit(failed);
