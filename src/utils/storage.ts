const SCORES_KEY = "quiz_king_scores";
const DAILY_KEY = "quiz_king_daily";
const STREAK_KEY = "quiz_king_streak";
const ESCAPE_KEY = "quiz_king_escape";

// KST 기준 오늘 날짜 (toISOString은 UTC라 한국 오전 9시 전에 날짜가 어긋남)
function todayKST(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split("T")[0];
}

function dateOffsetKST(offsetDays: number): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000 + offsetDays * 86_400_000)
    .toISOString()
    .split("T")[0];
}

export interface CategoryScore {
  bestScore: number;
  totalPlayed: number;
  lastScore: number;
  total: number;
}

export interface DailyStatus {
  date: string;
  score: number;
  total: number;
  completed: boolean;
}

export function getHighScores(): Record<string, CategoryScore> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(SCORES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveHighScore(
  categoryId: string,
  score: number,
  total: number
): CategoryScore | null {
  try {
    const scores = getHighScores();
    const prev = scores[categoryId] || { bestScore: 0, totalPlayed: 0 };
    scores[categoryId] = {
      bestScore: Math.max(prev.bestScore, score),
      totalPlayed: prev.totalPlayed + 1,
      lastScore: score,
      total,
    };
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    return scores[categoryId];
  } catch {
    return null;
  }
}

export function getDailyStatus(): DailyStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(DAILY_KEY);
    if (!data) return null;
    const parsed: DailyStatus = JSON.parse(data);
    if (parsed.date === todayKST()) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveDailyStatus(score: number, total: number): void {
  try {
    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify({ date: todayKST(), score, total, completed: true })
    );
    recordStreakDay();
  } catch {
    // silent fail
  }
}

// ── 데일리 스트릭 — 완료한 날짜 목록(최근 400일만 보관) ──

function getStreakDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function recordStreakDay(): void {
  try {
    const dates = new Set(getStreakDates());
    dates.add(todayKST());
    const sorted = [...dates].sort().slice(-400);
    localStorage.setItem(STREAK_KEY, JSON.stringify(sorted));
  } catch {
    // silent fail
  }
}

// 연속 출석일 — 오늘(또는 아직 오늘을 안 했다면 어제)까지 이어진 일수
export function getStreak(): { count: number; doneToday: boolean } {
  const dates = new Set(getStreakDates());
  const doneToday = dates.has(todayKST());
  let count = 0;
  // 오늘을 안 했어도 어제까지의 스트릭은 살아 있는 것으로 취급
  let offset = doneToday ? 0 : -1;
  while (dates.has(dateOffsetKST(offset))) {
    count++;
    offset--;
  }
  return { count, doneToday };
}

// ── 방탈출 진행 상황 ──
// 한 편이 20~30분이라 중간 이탈이 반드시 생깁니다. 푼 퍼즐과 쓴 힌트를 보관해
// 돌아왔을 때 이어서 하게 합니다. (정답 자체는 저장하지 않습니다)

export interface EscapeProgress {
  solved: string[]; // 푼 퍼즐 id
  hints: Record<string, number>; // 퍼즐별로 연 힌트 단계 (1~3)
  completedAt?: number; // 엔딩 도달 시각
}

const EMPTY_ESCAPE: EscapeProgress = { solved: [], hints: {} };

export function getEscapeProgress(): EscapeProgress {
  if (typeof window === "undefined") return EMPTY_ESCAPE;
  try {
    const data = localStorage.getItem(ESCAPE_KEY);
    if (!data) return EMPTY_ESCAPE;
    const parsed = JSON.parse(data) as Partial<EscapeProgress>;
    return {
      solved: Array.isArray(parsed.solved) ? parsed.solved : [],
      hints:
        parsed.hints && typeof parsed.hints === "object" ? parsed.hints : {},
      completedAt: parsed.completedAt,
    };
  } catch {
    return EMPTY_ESCAPE;
  }
}

// 완료 시각 도장은 여기서 찍습니다 — 컴포넌트 안에서 Date.now()를 부르면
// react-hooks/purity 규칙에 걸립니다(렌더가 순수해야 하므로).
export function saveEscapeProgress(
  solved: string[],
  hints: Record<string, number>,
  completed = false
): void {
  try {
    const prev = getEscapeProgress();
    const next: EscapeProgress = {
      solved,
      hints,
      completedAt: completed ? Date.now() : prev.completedAt,
    };
    localStorage.setItem(ESCAPE_KEY, JSON.stringify(next));
  } catch {
    // silent fail — 저장이 안 돼도 플레이 자체는 계속됩니다
  }
}

export function resetEscapeProgress(): void {
  try {
    localStorage.removeItem(ESCAPE_KEY);
  } catch {
    // silent fail
  }
}
