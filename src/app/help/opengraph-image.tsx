import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { helpTopics } from "@/data/help";

// /help 섹션 OG 이미지 — 허브와 그 아래 안내 글이 함께 씁니다.
// 숫자는 data/help.ts 에서 셉니다 (CLAUDE.md: 개수는 타이핑하지 않고 데이터에서).

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "급할 때 생활안내 - 상황별 대처법과 어디에 전화해야 하는지";

export default async function Image() {
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
        <div style={{ fontSize: 56, marginBottom: 18 }}>🚨</div>
        <div style={{ fontSize: 96, color: "#ffd700", fontWeight: 700 }}>
          급할 때 생활안내
        </div>
        <div style={{ fontSize: 40, color: "#e8e8f0", marginTop: 24 }}>
          {`상황별 대처법 ${helpTopics.length}가지`}
        </div>
        <div style={{ fontSize: 30, color: "#c0c8d8", marginTop: 24 }}>
          분실 · 사기 · 야간 병원 · 체불 · 동파 · 환불
        </div>
        <div style={{ fontSize: 26, color: "#606070", marginTop: 32 }}>
          8282114.xyz
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: fontData, weight: 700, style: "normal" },
      ],
    }
  );
}
