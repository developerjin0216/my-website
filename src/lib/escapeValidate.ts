import {
  scenes,
  clues,
  puzzles,
  orderedScenes,
  type Act,
  type SceneId,
} from "@/data/escape";

// 방탈출 스토리 정합성 검증 — 서버 전용.
//
// /escape 허브 페이지가 모듈 로드 시점에 이 함수를 호출하므로, 규칙을 어기면
// `npm run build`의 정적 생성 단계에서 실패합니다. 즉 논리 구멍이 있는 스토리는
// 배포될 수 없습니다. 별도 빌드 스크립트나 의존성 없이 동작합니다.
//
// 검사하는 것:
//  - 장면 순서가 1부터 빠짐없이 이어지는가
//  - 기승전결이 순서대로 나오고 마지막이 '결'인가
//  - 모든 떡밥이 심긴 장면보다 뒤에서 회수되는가
//  - 떡밥의 payoffIn과 장면의 resolves가 양방향으로 일치하는가
//    (한쪽만 적고 잊는 사고 방지 — 회수 누락의 실제 원인은 대부분 이것)
//  - 마지막 장면에서 최소 4개가 회수되는가 (결말이 비면 기승전결이 무너짐)
//  - 모든 퍼즐의 선행 조건(needs)이 그 시점에 이미 공개돼 있는가
//    ("아직 주지 않은 정보로 풀어야 하는 퍼즐" 차단)
//  - 정답 해시·salt가 형식에 맞고 중복되지 않는가

const ACT_SEQUENCE: Act[] = ["기", "승", "전", "결"];
const MIN_FINAL_PAYOFFS = 4;

// ── 난이도 규칙 ──
// 초판은 12개 중 7개가 "그 화면만 보면 풀리는" 단독 완결 퍼즐이었고, 난이도 곡선이
// 뒤로 갈수록 낮아져 클라이맥스인 5방이 가장 쉬웠습니다. 사람의 주의력으로는 또
// 놓치므로 구조로 막습니다.
const MAX_STANDALONE_RATIO = 0.4; // 단독 완결 퍼즐 비율 상한
const LATE_SCENE_COUNT = 3; // 후반 몇 개 장면을 '연결 필수'로 볼 것인가

function fail(errors: string[]): never {
  throw new Error(
    `[escape] 스토리 정합성 검증 실패 (${errors.length}건)\n` +
      errors.map((e) => `  - ${e}`).join("\n")
  );
}

export function validateEscapeStory(): void {
  const errors: string[] = [];

  // ── 장면 ──
  const sceneIds = new Set<string>();
  for (const s of scenes) {
    if (sceneIds.has(s.id)) errors.push(`장면 id 중복: ${s.id}`);
    sceneIds.add(s.id);
  }

  orderedScenes.forEach((s, i) => {
    if (s.order !== i + 1) {
      errors.push(`장면 순서가 이어지지 않음: ${s.id}의 order=${s.order}, 기대값=${i + 1}`);
    }
  });

  // 기승전결이 순서대로 등장하고 마지막이 '결'
  const actOrder = orderedScenes.map((s) => s.act);
  let seq = 0;
  for (const act of actOrder) {
    const idx = ACT_SEQUENCE.indexOf(act);
    if (idx < 0) {
      errors.push(`알 수 없는 단계: ${act}`);
      continue;
    }
    if (idx < seq) {
      errors.push(`기승전결이 뒤로 돌아감: ${actOrder.join("→")}`);
      break;
    }
    seq = idx;
  }
  const last = orderedScenes[orderedScenes.length - 1];
  if (last && last.act !== "결") {
    errors.push(`마지막 장면(${last.id})이 '결'이 아님: ${last.act}`);
  }
  for (const act of ACT_SEQUENCE) {
    if (!actOrder.includes(act)) errors.push(`'${act}' 단계에 해당하는 장면이 없음`);
  }

  const orderOf = (id: string): number | null =>
    scenes.find((s) => s.id === id)?.order ?? null;

  // ── 떡밥 ──
  const clueIds = new Set<string>();
  for (const c of clues) {
    if (clueIds.has(c.id)) errors.push(`떡밥 id 중복: ${c.id}`);
    clueIds.add(c.id);

    const planted = orderOf(c.plantedIn);
    const payoff = orderOf(c.payoffIn);

    if (planted === null) {
      errors.push(`떡밥 ${c.id}: 존재하지 않는 장면에 심김 (${c.plantedIn})`);
      continue;
    }
    if (payoff === null) {
      errors.push(`떡밥 ${c.id}: 존재하지 않는 장면에서 회수 (${c.payoffIn})`);
      continue;
    }
    if (planted >= payoff) {
      errors.push(
        `떡밥 ${c.id}: 회수가 심기보다 앞서거나 같음 (심기 ${planted}방 → 회수 ${payoff}방). ` +
          `떡밥은 반드시 나중에 회수돼야 합니다.`
      );
    }

    // 양방향 일치 — 장면의 resolves에도 들어 있어야 함
    const payoffScene = scenes.find((s) => s.id === c.payoffIn);
    if (payoffScene && !payoffScene.resolves.includes(c.id)) {
      errors.push(
        `떡밥 ${c.id}: payoffIn은 ${c.payoffIn}인데 그 장면의 resolves에 없음 (회수 누락)`
      );
    }
  }

  // 반대 방향 — resolves에 적힌 것이 실제 떡밥이고 payoffIn이 그 장면인가
  for (const s of scenes) {
    for (const id of s.resolves) {
      const c = clues.find((x) => x.id === id);
      if (!c) {
        errors.push(`장면 ${s.id}의 resolves에 없는 떡밥 id: ${id}`);
      } else if (c.payoffIn !== s.id) {
        errors.push(
          `장면 ${s.id}가 ${id}을 회수한다고 적혀 있으나 떡밥의 payoffIn은 ${c.payoffIn}`
        );
      }
    }
  }

  // 결말 밀도
  if (last && last.resolves.length < MIN_FINAL_PAYOFFS) {
    errors.push(
      `마지막 장면 ${last.id}의 회수가 ${last.resolves.length}개 — 최소 ${MIN_FINAL_PAYOFFS}개 필요 (결말이 비면 기승전결이 성립하지 않음)`
    );
  }

  // ── 퍼즐 ──
  const puzzleIds = new Set<string>();
  const salts = new Set<string>();
  for (const p of puzzles) {
    if (puzzleIds.has(p.id)) errors.push(`퍼즐 id 중복: ${p.id}`);
    puzzleIds.add(p.id);

    if (salts.has(p.salt)) errors.push(`퍼즐 ${p.id}: salt 중복 (${p.salt}) — 같은 정답이 노출됨`);
    salts.add(p.salt);

    if (!/^[0-9a-f]{64}$/.test(p.answerHash)) {
      errors.push(`퍼즐 ${p.id}: answerHash가 sha256 16진수 64자가 아님`);
    }
    if (orderOf(p.scene) === null) {
      errors.push(`퍼즐 ${p.id}: 존재하지 않는 장면 (${p.scene})`);
    }
    if (p.hints.length !== 3) {
      errors.push(`퍼즐 ${p.id}: 힌트는 3단계여야 함 (현재 ${p.hints.length}개)`);
    }
    if (p.body.length === 0) {
      errors.push(`퍼즐 ${p.id}: 관찰 정보(body)가 비어 있음 — 풀 수 없는 퍼즐`);
    }
  }

  // 장면별 퍼즐 순서가 1부터 이어지는가
  for (const s of scenes) {
    const list = puzzles.filter((p) => p.scene === s.id).sort((a, b) => a.order - b.order);
    if (list.length === 0) {
      errors.push(`장면 ${s.id}에 퍼즐이 없음`);
    }
    list.forEach((p, i) => {
      if (p.order !== i + 1) {
        errors.push(`퍼즐 ${p.id}: 장면 내 순서가 이어지지 않음 (order=${p.order}, 기대값=${i + 1})`);
      }
    });
  }

  // ── 선행 조건 ──
  // needs의 각 항목이 이 퍼즐을 만나는 시점에 이미 공개돼 있어야 합니다.
  for (const p of puzzles) {
    const here = orderOf(p.scene);
    if (here === null) continue;

    for (const need of p.needs) {
      const dep = puzzles.find((x) => x.id === need);
      if (dep) {
        const there = orderOf(dep.scene);
        if (there === null) continue;
        if (there > here || (there === here && dep.order >= p.order)) {
          errors.push(
            `퍼즐 ${p.id}(${here}방 ${p.order}번)가 아직 풀지 않은 ${need}(${there}방 ${dep.order}번)를 요구함`
          );
        }
        continue;
      }

      const clue = clues.find((x) => x.id === need);
      if (clue) {
        const planted = orderOf(clue.plantedIn);
        if (planted !== null && planted > here) {
          errors.push(
            `퍼즐 ${p.id}(${here}방)가 아직 등장하지 않은 떡밥 ${need}(${planted}방에서 심김)를 요구함`
          );
        }
        continue;
      }

      errors.push(`퍼즐 ${p.id}: needs에 존재하지 않는 id (${need})`);
    }
  }

  // ── 난이도 구조 ──
  const standalone = puzzles.filter((p) => p.needs.length === 0);
  const ratio = puzzles.length > 0 ? standalone.length / puzzles.length : 0;
  if (ratio > MAX_STANDALONE_RATIO) {
    errors.push(
      `단독 완결 퍼즐이 ${standalone.length}/${puzzles.length}개(${Math.round(ratio * 100)}%)로 상한 ${Math.round(MAX_STANDALONE_RATIO * 100)}%를 넘음 — ` +
        `그 화면만 보면 풀리는 퍼즐이 많으면 너무 쉬워집니다 (${standalone.map((p) => p.id).join(", ")})`
    );
  }

  // 후반 장면은 난이도가 올라가야 하므로 다른 방의 정보를 반드시 요구할 것
  const lateScenes = orderedScenes.slice(-LATE_SCENE_COUNT).map((s) => s.id);
  for (const p of puzzles) {
    if (lateScenes.includes(p.scene) && p.needs.length === 0) {
      errors.push(
        `퍼즐 ${p.id}(${p.scene})는 후반 장면인데 단독 완결 — 후반부는 앞선 방의 정보를 요구해야 난이도 곡선이 유지됩니다`
      );
    }
  }

  if (errors.length > 0) fail(errors);
}

/** 허브 페이지에 노출할 요약 통계 (검증 통과를 전제로 함) */
export function escapeStats(): {
  scenes: number;
  puzzles: number;
  clues: number;
  finalPayoffs: number;
} {
  const final = orderedScenes[orderedScenes.length - 1];
  return {
    scenes: scenes.length,
    puzzles: puzzles.length,
    clues: clues.length,
    finalPayoffs: final ? final.resolves.length : 0,
  };
}

/** 장면 id → 순서 (플레이 화면에서 진행률 표시에 사용) */
export function sceneOrder(id: SceneId): number {
  return orderOf(id) ?? 0;

  function orderOf(sid: string): number | null {
    return scenes.find((s) => s.id === sid)?.order ?? null;
  }
}
