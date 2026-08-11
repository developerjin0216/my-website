import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 퀴즈 결과 공유용 동적 OG 카드 — /result의 generateMetadata가 참조합니다.
// Node 런타임 + next.config outputFileTracingIncludes로 폰트를 번들에 포함
// (edge 런타임은 1.5MB 폰트가 함수 크기 제한을 초과해 배포 실패했음)
export const dynamic = "force-dynamic";

const CATEGORY_NAMES: Record<string, string> = {
  economy: "경제·재테크",
  spelling: "맞춤법",
  mz: "MZ 트렌드",
  mudo: "무도퀴즈",
  it: "IT용어",
  general: "일반 상식",
  science: "과학",
  history: "역사",
  entertainment: "연예",
  sports: "스포츠",
  geography: "지리",
};

function getGrade(percent: number) {
  if (percent >= 90) return { emoji: "🏆", text: "천재", color: "#FFD700" };
  if (percent >= 70) return { emoji: "🎉", text: "훌륭해요", color: "#22C55E" };
  if (percent >= 50) return { emoji: "👍", text: "괜찮아요", color: "#3B82F6" };
  if (percent >= 30) return { emoji: "💪", text: "조금만 더", color: "#F59E0B" };
  return { emoji: "📖", text: "공부가 필요해요", color: "#EF4444" };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clamp = (n: number, lo: number, hi: number) =>
    Math.min(Math.max(Number.isFinite(n) ? n : lo, lo), hi);

  const total = clamp(Number(searchParams.get("total") ?? 10), 1, 50);
  const score = clamp(Number(searchParams.get("score") ?? 0), 0, total * 10);
  const correct = clamp(Number(searchParams.get("correct") ?? 0), 0, total);
  const mode = searchParams.get("mode") ?? "daily";
  const categoryId = searchParams.get("category") ?? "general";

  const percent = Math.round((score / (total * 10)) * 100);
  const grade = getGrade(percent);
  const quizName =
    mode === "daily"
      ? "오늘의 퀴즈"
      : (CATEGORY_NAMES[categoryId] ?? "상식") + " 퀴즈";

  const fontData = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Bold.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ fontSize: 34, color: "#a0a0b0" }}>
          상식왕 퀴즈 · {quizName}
        </div>
        <div style={{ fontSize: 72, marginTop: 24 }}>{grade.emoji}</div>
        <div
          style={{
            fontSize: 140,
            color: grade.color,
            fontWeight: 700,
            marginTop: 4,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          {percent}
          <span style={{ fontSize: 60, marginLeft: 6 }}>점</span>
        </div>
        <div style={{ fontSize: 44, color: "#e8e8f0", marginTop: 8 }}>
          {grade.text} — {correct}/{total} 정답
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#606070",
            marginTop: 36,
            display: "flex",
          }}
        >
          너도 도전해봐 · quiz.8282114.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Pretendard", data: fontData, weight: 700, style: "normal" },
      ],
    }
  );
}
