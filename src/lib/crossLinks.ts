// 섹션 사이 연결 — /help ↔ /calculators ↔ /guides
//
// 2026-11-20 기준 링크 구조를 세어 보면 이랬습니다.
//   guides → calculators : 있음 (guides.ts 의 relatedCalcs)
//   calculators → guides : 있음 (CalcShell 이 relatedCalcs 를 뒤집어 찾음, 2026-11-18 추가)
//   help → help          : 있음 (topic.related)
//   help ↔ calculators·guides : **없음**
//
// 그래서 임금체불 글을 다 읽은 사람이 "그럼 얼마인지 계산해 보자"로 넘어갈 길이 없었고,
// 퇴직금 계산기를 쓰던 사람이 같은 주제의 대처법으로 갈 길도 없었습니다. 검색으로 한
// 페이지만 보고 나가는 구조라 체류시간·페이지뷰가 늘 자리에서 끊겼습니다.
//
// 이 파일은 그 연결을 한 표로 두고 양방향을 만듭니다. 표는 [도움말 글 id] 를 기준으로
// 하고, 계산기·가이드 쪽 역방향은 여기서 계산합니다(따로 관리하지 않습니다).
//
// 원칙:
// - 주제가 실제로 겹칠 때만 겁니다. "관련 있어 보이는" 링크를 늘리는 것이 목적이 아닙니다.
//   소비자 환불·분실·신고 글에는 짝이 되는 계산기가 없으므로 표에 없습니다.
// - 여기에 숫자나 법리를 새로 쓰지 않습니다. 연결만 합니다.
// - 없는 id 를 적으면 빌드가 깨집니다(모듈 로드 시 검증).

import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { helpTopics } from "@/data/help";

interface TopicPair {
  /** /help/<id> */
  help: string;
  /** 같은 상황에서 금액을 확인할 계산기 */
  calc?: string[];
  /** 같은 제도의 배경을 설명하는 가이드 */
  guide?: string[];
}

/** 편집 판단으로 정한 주제 쌍 — 2026-11-20 */
const TOPIC_PAIRS: TopicPair[] = [
  {
    // 임금체불: 미지급 임금을 계산기로 되짚는 흐름이 자연스럽습니다.
    help: "unpaid-wages",
    calc: ["severance", "overtime-pay", "annual-leave", "minimum-wage"],
    guide: ["severance"],
  },
  {
    // 정전·단수: 정전이 길어질 때 드는 걱정이 다음 달 전기요금입니다.
    help: "utility-outage",
    calc: ["electricity", "aircon"],
    guide: ["electricity-progressive"],
  },
  {
    // 전세 계약 전 확인: 복비·전월세전환·청년 버팀목대출이 같은 자리에서 나옵니다.
    help: "jeonse-check",
    calc: ["jeonse-fee", "rent-conversion", "youth-loan"],
  },
  {
    // 이사: 이사 전에 확인하는 비용이 복비와 전월세전환입니다.
    help: "moving-checklist",
    calc: ["jeonse-fee", "rent-conversion"],
  },
];

const helpIds = new Set(helpTopics.map((t) => t.id));
const calcIds = new Set(calculators.map((c) => c.id));
const guideIds = new Set(guides.map((g) => g.id));

// 콘텐츠를 추가·삭제했을 때 표가 조용히 어긋나지 않도록 모듈 로드 시 검증합니다
// (이 파일은 위 셸들이 import 하므로 위반은 곧 npm run build 실패입니다).
for (const pair of TOPIC_PAIRS) {
  if (!helpIds.has(pair.help)) {
    throw new Error(`crossLinks: 없는 도움말 id — ${pair.help}`);
  }
  for (const id of pair.calc ?? []) {
    if (!calcIds.has(id)) throw new Error(`crossLinks: 없는 계산기 id — ${pair.help} → ${id}`);
  }
  for (const id of pair.guide ?? []) {
    if (!guideIds.has(id)) throw new Error(`crossLinks: 없는 가이드 id — ${pair.help} → ${id}`);
  }
}

/** 한 도움말 글이 잇는 계산기·가이드 */
export function linksForHelp(helpId: string): { calc: string[]; guide: string[] } {
  const rows = TOPIC_PAIRS.filter((p) => p.help === helpId);
  return {
    calc: rows.flatMap((p) => p.calc ?? []),
    guide: rows.flatMap((p) => p.guide ?? []),
  };
}

/** 계산기에서 이어 볼 도움말 글 — 위 표의 역방향 */
export function helpIdsForCalc(calcId: string): string[] {
  return TOPIC_PAIRS.filter((p) => p.calc?.includes(calcId)).map((p) => p.help);
}

/** 가이드에서 이어 볼 도움말 글 — 위 표의 역방향 */
export function helpIdsForGuide(guideId: string): string[] {
  return TOPIC_PAIRS.filter((p) => p.guide?.includes(guideId)).map((p) => p.help);
}
