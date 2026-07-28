import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 계산기 섹션 공용 OG 이미지 — /calculators 하위 전체에 적용 (세그먼트 상속)
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "모두의 계산기 - 연봉 실수령액·전기요금·환율 등 무료 생활 계산기";

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
        <div style={{ fontSize: 56, marginBottom: 20 }}>🧮</div>
        <div style={{ fontSize: 104, color: "#ffd700", fontWeight: 700 }}>
          모두의 계산기
        </div>
        <div style={{ fontSize: 38, color: "#c0c8d8", marginTop: 28 }}>
          연봉 실수령액 · 퇴직금 · 전기요금 · 환율 · BMI
        </div>
        <div style={{ fontSize: 30, color: "#606070", marginTop: 20 }}>
          회원가입 없이 무료로 바로 계산
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
