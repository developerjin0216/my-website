import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 생활 가이드 섹션 공용 OG 이미지
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "생활 가이드 - 4대보험·전기요금 누진제·퇴직금 총정리";

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
        <div style={{ fontSize: 56, marginBottom: 20 }}>📚</div>
        <div style={{ fontSize: 100, color: "#ffd700", fontWeight: 700 }}>
          생활 가이드
        </div>
        <div style={{ fontSize: 38, color: "#c0c8d8", marginTop: 28 }}>
          4대보험 · 전기요금 누진제 · 퇴직금, 알기 쉽게
        </div>
        <div style={{ fontSize: 30, color: "#606070", marginTop: 20 }}>
          모두의 계산기
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
