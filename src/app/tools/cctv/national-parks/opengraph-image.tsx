import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { PARK_CAMS } from "@/data/cctvParks";

// 국립공원 CCTV OG 이미지 — 단풍·눈꽃·일출 때 공유되는 페이지라 산 이름이 보여야 합니다.
// 개수는 data/cctvParks.ts 에서 셉니다.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "국립공원 실시간 CCTV - 산 위 날씨를 영상으로 확인";

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
        <div style={{ fontSize: 56, marginBottom: 18 }}>🏔️</div>
        <div style={{ fontSize: 92, color: "#ffd700", fontWeight: 700 }}>
          국립공원 실시간 CCTV
        </div>
        <div style={{ fontSize: 42, color: "#e8e8f0", marginTop: 24 }}>
          {`${PARK_CAMS.length}곳 — 설악산 · 지리산 · 북한산 · 내장산`}
        </div>
        <div style={{ fontSize: 30, color: "#c0c8d8", marginTop: 24 }}>
          산 위 날씨를 올라가기 전에 영상으로
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
