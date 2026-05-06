const SCORES_KEY = "quiz_king_scores";
const DAILY_KEY = "quiz_king_daily";

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
    const today = new Date().toISOString().split("T")[0];
    if (parsed.date === today) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveDailyStatus(score: number, total: number): void {
  try {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify({ date: today, score, total, completed: true })
    );
  } catch {
    // silent fail
  }
}
