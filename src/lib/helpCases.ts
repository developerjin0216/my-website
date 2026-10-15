import { helpCases, type HelpCase } from "@/data/helpCases";
import { helpTopics } from "@/data/help";

// 사례 데이터의 구조 검사 — HelpShell 이 불러오는 순간(빌드 때) 실행되어, 어긋나면 빌드가 실패합니다.
// 출처 원문과의 대조는 네트워크가 필요해 빌드에서 하지 않고 scripts/check-help-cases.mjs 가 맡습니다.

const topicIds = new Set(helpTopics.map((t) => t.id));
const problems: string[] = [];
for (const c of helpCases) {
  const where = `[${c.topic}] ${c.title}`;
  if (!topicIds.has(c.topic)) problems.push(`${where}: data/help.ts 에 없는 주제`);
  if (c.evidence.length < 2) problems.push(`${where}: evidence 가 2개 미만`);
  if (!c.what.trim() || !c.result.trim()) problems.push(`${where}: what/result 비어 있음`);
  if (!/^https:\/\//.test(c.source.url)) problems.push(`${where}: 출처 URL이 https 가 아님`);
}
if (problems.length) {
  throw new Error(`helpCases 검사 실패\n- ${problems.join("\n- ")}`);
}

export function casesFor(topicId: string): HelpCase[] {
  return helpCases.filter((c) => c.topic === topicId);
}
