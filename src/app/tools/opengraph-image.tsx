import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 모두의 도구 기본 OG 이미지 — 빌드 타임 정적 생성 (satori: 다중 자식 div는 display:flex 필수)
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "모두의 도구 - 로그인 없이 쓰는 무료 웹 도구";

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
        <div style={{ fontSize: 72, marginBottom: 16 }}>🧰</div>
        <div style={{ fontSize: 96, color: "#ffd700", fontWeight: 700 }}>
          모두의 도구
        </div>
        <div style={{ fontSize: 38, color: "#c0c8d8", marginTop: 24 }}>
          인스타 언팔 확인 · 로그인 없이 · 서버 전송 없이
        </div>
        <div style={{ fontSize: 28, color: "#606070", marginTop: 18 }}>
          tools.8282114.xyz
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
