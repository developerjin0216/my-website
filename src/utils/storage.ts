const SCORES_KEY = "quiz_king_scores";
const DAILY_KEY = "quiz_king_daily";
const STREAK_KEY = "quiz_king_streak";

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
