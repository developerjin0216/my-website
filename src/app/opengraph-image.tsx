import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 퀴즈 사이트 기본 OG 이미지 (카톡·페북 등 공유 썸네일) — 빌드 타임 정적 생성
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "상식왕 퀴즈 - 무료 상식 퀴즈 1,000제 & 실시간 퀴즈 배틀";

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
        <div style={{ fontSize: 56, marginBottom: 20 }}>🏆</div>
        <div style={{ fontSize: 108, color: "#ffd700", fontWeight: 700 }}>
          상식왕 퀴즈
        </div>
        <div style={{ fontSize: 40, color: "#c0c8d8", marginTop: 28 }}>
          무료 상식 퀴즈 1,000제 · 실시간 퀴즈 배틀
        </div>
        <div
          style={{
            marginTop: 48,
            width: 160,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#ffd700",
          }}
        />
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
