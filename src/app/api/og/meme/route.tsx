import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { getMeme, memeCategories } from "@/data/memes";

// 밈 용어별 공유용 짤카드 — /meme/[id]의 openGraph.images가 참조합니다.
// 직접 생성하는 오리지널 이미지라 저작권 문제가 없습니다.
// Node 런타임 + outputFileTracingIncludes로 폰트 포함 (og/result와 동일 패턴)
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const m = getMeme(id);

  const term = m?.term ?? "밈·신조어 사전";
  const cat = m ? memeCategories[m.category] : null;
  const meaningRaw = m?.meaning ?? "요즘 유행어의 뜻·유래·사용법 총정리";
  const meaning =
    meaningRaw.length > 46 ? `${meaningRaw.slice(0, 46)}…` : meaningRaw;

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
        <div style={{ fontSize: 32, color: "#a0a0b0", display: "flex" }}>
          {cat ? `${cat.emoji} 밈·신조어 사전 · ${cat.name}` : "😂 밈·신조어 사전"}
        </div>
        <div
          style={{
            fontSize: term.length > 8 ? 88 : 120,
            color: "#FFD700",
            fontWeight: 700,
            marginTop: 28,
            textAlign: "center",
            display: "flex",
          }}
        >
          {term}
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#e8e8f0",
            marginTop: 30,
            maxWidth: 1000,
            textAlign: "center",
            display: "flex",
          }}
        >
          {meaning}
        </div>
        <div style={{ fontSize: 26, color: "#606070", marginTop: 44, display: "flex" }}>
          이 말 무슨 뜻? · quiz.8282114.xyz/meme
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
