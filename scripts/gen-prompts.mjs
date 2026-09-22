// 워크플로 산출물 → src/data/prompts.ts 생성
// 프롬프트 본문이 길고 따옴표·줄바꿈이 섞여 있어 손으로 옮기면 반드시 사고가 납니다.
//   node scripts/gen-prompts.mjs <workflow-output.json>

import fs from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("사용법: node scripts/gen-prompts.mjs <output.json>");
  process.exit(1);
}

const parsed = JSON.parse(fs.readFileSync(src, "utf8"));
const kept = parsed.result?.kept ?? parsed.kept;
if (!Array.isArray(kept) || kept.length === 0) {
  console.error("kept 배열을 찾지 못했습니다");
  process.exit(1);
}

// id 생성 — 한글 제목이라 slug를 만들 수 없어 분류+순번으로 안정적인 id를 부여
const counters = {};
const rows = kept.map((p) => {
  counters[p.category] = (counters[p.category] ?? 0) + 1;
  return { ...p, id: `${p.category}-${counters[p.category]}` };
});

const q = (s) => JSON.stringify(s ?? "");

const body = rows
  .map(
    (p) => `  {
    id: ${q(p.id)},
    category: ${q(p.category)},
    title: ${q(p.title)},
    body: ${q(p.body)},
    why: ${q(p.why)},
    tip: ${q(p.tip)},
    caution: ${q(p.caution || "")},
  },`
  )
  .join("\n");

const out = `// AI 추천 프롬프트 — /prompts 의 단일 데이터 소스.
//
// 직접 집필한 오리지널 프롬프트입니다. 집필 후 별도 심사를 거쳐
// 뻔한 것·작동하지 않는 것·조건이 빈약한 것·위험한 것을 걸렀습니다(49개 중 37개 생존).
//
// 페이지 구조는 밈 사전과 같은 원칙입니다 — 프롬프트 하나당 페이지를 만들지 않습니다.
// 얇은 페이지를 대량으로 만들면 색인되지 않는다는 것을 밈 용어 95개로 이미 겪었습니다.
// 분류 단위 문서에 모아 싣고, 개별 프롬프트는 앵커로 접근합니다.
//
// 생성: scripts/gen-prompts.mjs (손으로 고치지 말고 스크립트를 다시 돌릴 것)

export type PromptCategoryId =
  | "fun"
  | "self"
  | "work"
  | "study"
  | "life"
  | "create"
  | "talk";

export interface PromptEntry {
  id: string;
  category: PromptCategoryId;
  /** 결과가 뭔지 짐작되는 짧은 제목 */
  title: string;
  /** 복사해서 그대로 쓰는 프롬프트 전문. [대괄호]는 사용자가 채우는 자리 */
  body: string;
  /** 왜 해볼 만한가 */
  why: string;
  /** 응용·요령 */
  tip: string;
  /** 주의할 점. 없으면 빈 문자열 */
  caution: string;
}

export const promptCategories: Record<
  PromptCategoryId,
  { name: string; emoji: string; color: string; desc: string }
> = {
  fun: {
    name: "웃기고 공유하고 싶은 것",
    emoji: "🎭",
    color: "#E74C3C",
    desc: "결과를 캡처해서 친구에게 보내게 되는 프롬프트",
  },
  self: {
    name: "나를 들여다보는 것",
    emoji: "🪞",
    color: "#9B59B6",
    desc: "내 글·소비·대화를 재료로 나에 대해 몰랐던 걸 짚어보기",
  },
  work: {
    name: "일에서 진짜 쓰는 것",
    emoji: "💼",
    color: "#3498DB",
    desc: "보고서·회의록·거절 메일·연봉 협상 등 실무에서 시간을 아끼는 것",
  },
  study: {
    name: "공부와 학습",
    emoji: "📚",
    color: "#22C55E",
    desc: "요약이 아니라 학습 효과가 검증된 방법을 AI에게 수행시키기",
  },
  life: {
    name: "생활에서 바로 쓰는 것",
    emoji: "🏠",
    color: "#F59E0B",
    desc: "장보기·냉장고 털기·여행·정리 등 오늘 당장 쓰는 것",
  },
  create: {
    name: "만들고 쓰는 것",
    emoji: "✍️",
    color: "#E67E22",
    desc: "창작 과정의 특정 단계를 돕는 것 — 플롯 구멍 찾기, 캐릭터 인터뷰 등",
  },
  talk: {
    name: "사람과 사람 사이",
    emoji: "💬",
    color: "#E91E63",
    desc: "어려운 대화 연습, 사과문, 갈등 정리 — AI에게 상대 역할을 맡겨 연습",
  },
};

export const prompts: PromptEntry[] = [
${body}
];

export function promptsByCategory(cat: PromptCategoryId): PromptEntry[] {
  return prompts.filter((p) => p.category === cat);
}

export function getPrompt(id: string): PromptEntry | undefined {
  return prompts.find((p) => p.id === id);
}

export const TOTAL_PROMPTS = prompts.length;
`;

fs.writeFileSync("src/data/prompts.ts", out);
console.log(`✓ src/data/prompts.ts 생성 — ${rows.length}개`);
const byCat = {};
rows.forEach((r) => (byCat[r.category] = (byCat[r.category] ?? 0) + 1));
console.log(
  "  " +
    Object.entries(byCat)
      .map(([k, v]) => `${k}:${v}`)
      .join(" ")
);
