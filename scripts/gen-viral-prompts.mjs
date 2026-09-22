// 유행 프롬프트 조사 결과 → src/data/promptsViral.ts
// 5개 각도로 병렬 조사해서 같은 프롬프트가 여러 번 잡힙니다. 본문 유사도로 묶고
// 출처가 확인된 것을 대표로 남깁니다.
//   node scripts/gen-viral-prompts.mjs <output.json>

import fs from "node:fs";

const src = process.argv[2];
const kept = JSON.parse(fs.readFileSync(src, "utf8")).result.kept;

// 비교용 정규화 — 공백·문장부호·대괄호 안내문 제거 후 앞 60자
const norm = (s) =>
  s
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[\s.,!?·…'"“”‘’\-—~]/g, "")
    .slice(0, 60);

// 앞부분 문자열 일치만으로는 못 잡습니다. 같은 프롬프트가 각도마다 다른 번역·
// 표현으로 수집되기 때문입니다. 글자 2-gram 자카드 유사도로 묶습니다.
const bigrams = (s) => {
  const t = norm(s);
  const out = new Set();
  for (let i = 0; i < t.length - 1; i++) out.add(t.slice(i, i + 2));
  return out;
};
const sim = (A, B) => {
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const uni = A.size + B.size - inter;
  return uni === 0 ? 0 : inter / uni;
};

const SIM_THRESHOLD = 0.45;
const groups = [];
for (const p of kept) {
  const sig = bigrams(p.body + " " + p.title);
  const hit = groups.find((g) => sim(g.sig, sig) >= SIM_THRESHOLD);
  if (hit) hit.items.push(p);
  else groups.push({ sig, items: [p] });
}

// 대표 선정: 출처 확인된 것 > 유행 근거가 긴 것(조사가 충실한 것)
const picked = groups.map((g) =>
  g.items.sort(
    (a, b) =>
      Number(b.sourceVerified) - Number(a.sourceVerified) ||
      (b.popularity?.length ?? 0) - (a.popularity?.length ?? 0)
  )[0]
);

// 출처가 끝내 확인되지 않은 것은 싣지 않습니다.
// 남의 프롬프트를 옮기면서 출처를 못 대면 그냥 베끼는 것이 됩니다.
const verified = picked.filter((p) => p.sourceVerified);
const unverified = picked.filter((p) => !p.sourceVerified);

const IMG = /이미지|사진|그려|그림|피규어|포스터|폴라로이드|화보|프사|증명사진|인포그래픽|캐릭터|명화|스냅/;
const SELF = /분석|맹점|무의식|팩폭|나를|나에 대해|내가 너를|감정|성향|평가|나도 모르는|보는 나/;

const catOf = (p) => {
  const t = `${p.title} ${p.body}`;
  if (IMG.test(t)) return "viral-image";
  if (SELF.test(t)) return "viral-self";
  return "viral-use";
};

const counters = {};
const rows = verified.map((p) => {
  const category = catOf(p);
  counters[category] = (counters[category] ?? 0) + 1;
  return { ...p, category, id: `${category}-${counters[category]}` };
});

// source 필드에 여러 URL이 " / "로 묶여 오는 경우가 있어 첫 번째만 씁니다
const firstUrl = (s) => {
  const m = String(s ?? "").match(/https?:\/\/[^\s/]+[^\s]*/);
  return m ? m[0].replace(/[),.]+$/, "") : "";
};
const hostOf = (u) => {
  try {
    return new URL(u).host.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const q = (s) => JSON.stringify(s ?? "");

const body = rows
  .map(
    (p) => `  {
    id: ${q(p.id)},
    category: ${q(p.category)},
    title: ${q(p.title)},
    body: ${q(p.body)},
    why: ${q(p.why)},
    origin: ${q(p.origin)},
    popularity: ${q(p.popularity)},
    sourceUrl: ${q(firstUrl(p.source))},
    sourceHost: ${q(hostOf(firstUrl(p.source)))},
    caution: ${q(p.caution || "")},
  },`
  )
  .join("\n");

const out = `// 온라인에서 유행한 AI 프롬프트 — /prompts/viral-* 의 데이터 소스.
//
// **직접 만든 것이 아닙니다.** 커뮤니티·SNS에서 실제로 퍼진 것을 찾아 정리한
// 것이고, 각 항목에 유래와 출처 링크를 답니다. 출처를 끝내 확인하지 못한 것은
// 싣지 않았습니다 — 남의 프롬프트를 옮기면서 출처를 못 대면 그냥 베끼는 것입니다.
//
// 수집 시 제외한 것: 탈옥·안전장치 우회(DAN 등), 특정인 사칭·딥페이크,
// 의료·법률·투자를 단정하게 만드는 것, 시험 부정행위, 성인물.
// 유행했다는 이유만으로는 싣지 않았습니다.
//
// 생성: scripts/gen-viral-prompts.mjs (손으로 고치지 말 것)

import type { PromptCategoryId } from "@/data/prompts";

export type ViralCategoryId = "viral-image" | "viral-self" | "viral-use";

export interface ViralPrompt {
  id: string;
  category: ViralCategoryId;
  title: string;
  body: string;
  why: string;
  /** 어디서 시작됐는지, 원문 언어 */
  origin: string;
  /** 유행의 근거 — 어디서 언제 어떻게 퍼졌나 */
  popularity: string;
  sourceUrl: string;
  sourceHost: string;
  caution: string;
}

export const viralCategories: Record<
  ViralCategoryId,
  { name: string; emoji: string; color: string; desc: string }
> = {
  "viral-image": {
    name: "유행한 이미지 프롬프트",
    emoji: "🖼️",
    color: "#EC4899",
    desc: "사진을 바꾸거나 나를 그리게 하는, SNS에서 실제로 퍼진 것들",
  },
  "viral-self": {
    name: "유행한 자기분석 프롬프트",
    emoji: "🔍",
    color: "#8B5CF6",
    desc: "'팩폭해줘', '내 맹점 알려줘' 등 커뮤니티에서 돌던 자기분석 계열",
  },
  "viral-use": {
    name: "유행한 활용 프롬프트",
    emoji: "⚡",
    color: "#06B6D4",
    desc: "해외에서 먼저 퍼진 실전 활용형 — 과외 선생님, 전략 조언자 등",
  },
};

export const viralPrompts: ViralPrompt[] = [
${body}
];

export function viralByCategory(cat: ViralCategoryId): ViralPrompt[] {
  return viralPrompts.filter((p) => p.category === cat);
}

export const TOTAL_VIRAL = viralPrompts.length;

/** 프롬프트 허브에서 두 종류를 함께 다루기 위한 합집합 타입 */
export type AnyPromptCategoryId = PromptCategoryId | ViralCategoryId;
`;

fs.writeFileSync("src/data/promptsViral.ts", out);

console.log(`원본 ${kept.length}개 → 중복 제거 ${picked.length}개 → 출처 확인 ${rows.length}개`);
const merged = groups.filter((g) => g.items.length > 1);
if (merged.length) {
  console.log(`  병합된 묶음 ${merged.length}개:`);
  merged.forEach((g) =>
    console.log("    · " + g.items.map((x) => x.title).join("  ≡  "))
  );
}
console.log(
  "  분류: " +
    Object.entries(counters)
      .map(([k, v]) => `${k}:${v}`)
      .join(" ")
);
if (unverified.length) {
  console.log(`  출처 미확인으로 제외 ${unverified.length}개:`);
  unverified.forEach((p) => console.log(`    - ${p.title}`));
}
