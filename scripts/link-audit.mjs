// 색인 대상 페이지의 내부 링크·메타 품질 점검 — 빌드 산출물(.next)을 읽습니다.
//
// seo-audit.mjs 와 보는 것이 다릅니다. 저쪽은 사이트맵 URL 을 HTTP 로 받아
// 색인 블로커와 본문 길이를 봅니다. 이쪽은 빌드된 HTML 을 직접 읽어
// "서로 어떻게 연결돼 있는가"를 봅니다 — CLAUDE.md 가 말하는
// "한 곳에서만 링크된 페이지는 중요하지 않게 취급된다"를 수치로 잡습니다.
//
//   npm run build && node scripts/link-audit.mjs
//
// 종료 코드: 중복 title/description, h1 누락·중복, 고아 페이지가 있으면 1.

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = ".next/server/app";

function collect(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) collect(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const pages = [];
for (const file of collect(ROOT)) {
  const rel =
    "/" + relative(ROOT, file).replace(/\\/g, "/").replace(/\.html$/, "");
  if (rel.startsWith("/_")) continue;
  const html = readFileSync(file, "utf8");
  if (/name="robots" content="noindex/.test(html)) continue; // 색인 대상만
  const h1raw = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "";
  pages.push({
    // 홈은 빌드 산출물에서 /index 로 떨어지지만 실제 경로는 "/" 입니다
    rel: rel === "/index" ? "/" : rel,
    title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "",
    desc: (html.match(/name="description" content="([^"]*)"/) || [])[1] || "",
    h1: h1raw.replace(/<[^>]*>/g, "").trim(),
    h1count: (html.match(/<h1[\s>]/g) || []).length,
    links: [
      ...new Set(
        [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1])
      ),
    ],
  });
}

let failed = 0;
const report = (label, items, fmt = (x) => x) => {
  if (!items.length) {
    console.log(`✓ ${label}: 없음`);
    return;
  }
  failed = 1;
  console.log(`✗ ${label}: ${items.length}건`);
  for (const i of items.slice(0, 10)) console.log("   ", fmt(i));
  if (items.length > 10) console.log(`    … 외 ${items.length - 10}건`);
};

console.log(`색인 대상 ${pages.length}개 점검\n`);

for (const [key, label] of [
  ["title", "중복 title"],
  ["desc", "중복 description"],
]) {
  const byValue = new Map();
  for (const p of pages) {
    if (!p[key]) continue;
    byValue.set(p[key], [...(byValue.get(p[key]) ?? []), p.rel]);
  }
  report(
    label,
    [...byValue].filter(([, v]) => v.length > 1),
    ([k, v]) => `"${k.slice(0, 50)}" → ${v.join(", ")}`
  );
}

report("h1 없음", pages.filter((p) => !p.h1), (p) => p.rel);
report("h1 2개 이상", pages.filter((p) => p.h1count > 1), (p) => `${p.rel} (${p.h1count}개)`);

// 색인 페이지끼리의 인바운드 — 홈은 모든 푸터에서 링크되므로 제외합니다
const known = new Set(pages.map((p) => p.rel));
const inbound = new Map(pages.map((p) => [p.rel, 0]));
for (const p of pages)
  for (const raw of p.links) {
    const target = raw.replace(/\/+$/, "") || "/";
    if (target !== p.rel && known.has(target))
      inbound.set(target, inbound.get(target) + 1);
  }

const scored = [...inbound].filter(([rel]) => rel !== "/");
report("인바운드 0 (고아)", scored.filter(([, n]) => n === 0), ([rel]) => rel);

const weak = scored.filter(([, n]) => n === 1).map(([rel]) => rel);
console.log(
  weak.length
    ? `\n△ 인바운드 1개뿐 (${weak.length}건) — 한 곳에서만 링크된 페이지는 중요하지 않게 취급됩니다\n    ${weak.join("\n    ")}`
    : "✓ 인바운드 1개뿐인 페이지: 없음"
);

process.exit(failed);
