// 도구 페이지 상세 설명(src/data/toolsDetail.ts)의 근거가 아직 소스 코드에 있는지 확인합니다.
//
//   node --experimental-strip-types scripts/check-tool-claims.mjs
//
// toolsDetail.ts 의 문장은 2026-11-17 에 각 도구의 소스에서만 뽑았고, 문장마다 근거가 된
// 코드 조각(evidence.quote)을 함께 저장했습니다. 도구 코드를 고치면 이 스크립트를 돌리세요.
// 조각이 사라졌다면 그 근거로 쓴 문장이 더는 사실이 아닐 수 있으니, 실패한 도구의 문장을
// 다시 읽고 고치거나 지운 뒤 evidence 도 맞춰 주세요. 실패가 있으면 종료 코드 1.

import fs from "node:fs";
import { toolDetails } from "../src/data/toolsDetail.ts";

const norm = (s) => s.split("\r\n").join("\n");
let failed = 0;
let total = 0;

for (const [id, d] of Object.entries(toolDetails)) {
  const misses = [];
  for (const e of d.evidence) {
    total++;
    let src = "";
    try {
      src = norm(fs.readFileSync(e.file, "utf8"));
    } catch {
      misses.push(`파일 없음: ${e.file}`);
      continue;
    }
    if (!src.includes(norm(e.quote))) misses.push(`${e.file} — ${e.quote.slice(0, 80)}`);
  }
  failed += misses.length;
  console.log(`${misses.length ? "✗" : "✓"} ${id.padEnd(16)} 근거 ${d.evidence.length}개${misses.length ? `, 사라짐 ${misses.length}개` : ""}`);
  for (const m of misses) console.log(`    ${m}`);
}

console.log(`\n근거 ${total}개 중 ${total - failed}개 확인${failed ? `, ${failed}개 사라짐` : ""}`);
process.exit(failed ? 1 : 0);
