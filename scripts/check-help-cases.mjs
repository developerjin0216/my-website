#!/usr/bin/env node
// /help "실제로 있었던 일" 사례를 출처 원문과 다시 대조합니다.
//
//   node --experimental-strip-types scripts/check-help-cases.mjs
//
// 확인하는 것
//   ① evidence 의 각 구절이 출처 원문에 실제로 있는지 (공백·문장부호 무시)
//   ② 화면에 나가는 문구(title·what·result·takeaway·when)의 숫자가 evidence·게시일에 있는지
//      — "1,200만 원" ↔ "12백만원"처럼 단위 표기가 달라도 금액으로 환산해 비교합니다
//
// 금감원 사례는 본문이 첨부(hwpx·pdf)에만 있어 첨부까지 받아 읽습니다.
// PDF는 pdftotext(Git for Windows·poppler에 포함)가 필요합니다. 없으면 그 출처는 '확인 불가'로 표시합니다.
//
// 국내 기관 사이트는 해외 IP를 막는 곳이 있어, 국내에서 돌리는 것을 전제로 합니다.

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateRawSync } from "node:zlib";
import { helpCases } from "../src/data/helpCases.ts";

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36" };
const work = mkdtempSync(join(tmpdir(), "help-cases-"));

const ENT = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'", nbsp: " ", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", middot: "·", hellip: "…", rarr: "→" };
const decode = (s) =>
  s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const htmlText = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
/** 비교용 — 한글·영숫자·% 만 남깁니다. 따옴표·가운뎃점·줄바꿈 차이를 없앱니다. */
const norm = (s) => decode(s).toLowerCase().replace(/[^가-힣a-z0-9%]/g, "");

/** zip(hwpx)의 Contents/section*.xml 본문 */
function hwpxText(buf) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = [];
  for (let k = 0; k < n; k++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const lho = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nlen).toString();
    p += 46 + nlen + elen + clen;
    if (!/Contents\/section\d+\.xml$/.test(name)) continue;
    const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28);
    const data = buf.slice(start, start + csize);
    out.push((method === 8 ? inflateRawSync(data) : data).toString("utf8").replace(/<[^>]+>/g, " "));
  }
  return decode(out.join("\n"));
}

let pdfOk = true;
function pdfText(buf, tag) {
  const f = join(work, `${tag}.pdf`);
  writeFileSync(f, buf);
  try {
    execFileSync("pdftotext", ["-enc", "UTF-8", f, f + ".txt"], { stdio: "ignore" });
    return readFileSync(f + ".txt", "utf8");
  } catch {
    pdfOk = false;
    return "";
  }
}

const cache = new Map();
async function sourceText(url) {
  if (cache.has(url)) return cache.get(url);
  const job = (async () => {
    const r = await fetch(url, { headers: UA, redirect: "follow" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    let html = buf.toString("utf8");
    if (/charset=["']?(euc-kr|ks_c_5601)/i.test(html.slice(0, 3000))) html = new TextDecoder("euc-kr").decode(buf);
    let text = htmlText(html);
    // 금감원 게시판은 본문 대부분이 첨부 파일에 있습니다
    if (new URL(url).hostname.endsWith("fss.or.kr")) {
      const hrefs = [...new Set([...html.matchAll(/href="([^"]*fileDown\.do[^"]*)"/g)].map((m) => decode(m[1])))];
      for (const [i, href] of hrefs.entries()) {
        const a = await fetch(new URL(href, url), { headers: UA, redirect: "follow" });
        const b = Buffer.from(await a.arrayBuffer());
        if (b.slice(0, 2).toString() === "PK") text += "\n" + hwpxText(b);
        else if (b.slice(0, 4).toString() === "%PDF") text += "\n" + pdfText(b, `a${cache.size}-${i}`);
      }
    }
    return text;
  })();
  cache.set(url, job);
  return job;
}

// ── 숫자 대조 ──
const SMALL = { 천: 1000, 백: 100, 십: 10 };
function small(s) {
  let v = 0;
  for (const m of s.matchAll(/(\d+)(천|백|십)?/g)) v += +m[1] * (SMALL[m[2]] ?? 1);
  return v;
}
/** "2억6천여만", "1천5백만", "12백만", "1,200만", "262,498천", "72,464" → 원 */
function won(phrase) {
  let s = phrase.replace(/[,\s여]/g, "").replace(/원$/, "");
  let total = 0;
  for (const [u, mult] of [["억", 1e8], ["만", 1e4]]) {
    const i = s.indexOf(u);
    if (i >= 0) {
      total += small(s.slice(0, i)) * mult;
      s = s.slice(i + 1);
    }
  }
  return total + small(s);
}
const MONEY = /\d[\d,억천백십만여\s]*원/g;
const moneyIn = (s) => [...s.matchAll(MONEY)].map((m) => won(m[0]));
// 게시일 "2025-04-29"의 "04"가 화면의 "4월"과 맞도록 앞자리 0을 뗀 형태도 넣습니다
const digitsIn = (s) =>
  new Set([...s.matchAll(/\d+(?:[.,]\d+)*/g)].flatMap((m) => {
    const parts = m[0].split(/[.,]/);
    return [m[0].replace(/,/g, ""), ...parts, ...parts.map((p) => String(+p))];
  }));

function numberProblems(c) {
  const shown = [c.title, c.when ?? "", c.what, c.result, c.takeaway ?? ""].join("\n");
  const basis = c.evidence.join("\n") + "\n" + (c.source.published ?? "");
  const basisMoney = new Set(moneyIn(basis));
  const basisDigits = digitsIn(basis);
  const bad = [];
  // 금액은 환산값으로, 안 맞으면 숫자 자체라도 원문에 있는지 (PDF 추출이 단위와 숫자를 떼어 놓는 경우)
  const rest = shown.replace(MONEY, (m) => {
    const ok = basisMoney.has(won(m)) || [...m.matchAll(/\d+(?:,\d+)*/g)].every((d) => basisDigits.has(d[0].replace(/,/g, "")));
    if (!ok) bad.push(m.trim());
    return " ";
  });
  for (const m of rest.matchAll(/\d+(?:[.,]\d+)*/g)) {
    if (!basisDigits.has(m[0].replace(/,/g, ""))) bad.push(m[0]);
  }
  return bad;
}

// ── 실행 ──
let failed = 0;
const byTopic = {};
for (const c of helpCases) {
  byTopic[c.topic] = (byTopic[c.topic] ?? 0) + 1;
  let src;
  try {
    src = norm(await sourceText(c.source.url));
  } catch (e) {
    failed++;
    console.log(`✗ [${c.topic}] ${c.title}\n    출처를 받지 못함: ${e.message} — ${c.source.url}`);
    continue;
  }
  const missing = c.evidence.filter((q) => !src.includes(norm(q)));
  const nums = numberProblems(c);
  const tooFew = c.evidence.length < 2;
  if (missing.length || nums.length || tooFew) {
    failed++;
    console.log(`✗ [${c.topic}] ${c.title}`);
    for (const q of missing) console.log(`    원문에 없음: "${q.slice(0, 70)}"`);
    for (const n of nums) console.log(`    근거 없는 숫자: ${n}`);
    if (tooFew) console.log("    evidence 가 2개 미만");
  } else {
    console.log(`✓ [${c.topic}] ${c.title}`);
  }
}
rmSync(work, { recursive: true, force: true });
console.log(`\n사례 ${helpCases.length}건 · 주제 ${Object.keys(byTopic).length}개 · 실패 ${failed}건`);
if (!pdfOk) console.log("※ pdftotext 를 찾지 못해 PDF 첨부를 읽지 못했습니다. PDF 출처 사례는 실패로 나올 수 있습니다.");
process.exit(failed ? 1 : 0);
