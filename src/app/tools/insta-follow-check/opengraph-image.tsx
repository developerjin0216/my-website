import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 맞팔 확인 전용 OG 이미지 — 이 페이지는 "이걸로 해봐" 하고 링크로 건네지는
// 쓰임이라, 공유 카드에 '모두의 도구'가 아니라 도구가 하는 일이 보여야 합니다.
// 카드에서 가장 중요한 건 비밀번호를 안 받는다는 점입니다 — 경쟁 앱과 갈리는 지점.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "인스타 언팔 확인 - 로그인 없이 맞팔 체크";

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
        <div style={{ fontSize: 56, marginBottom: 18 }}>🔍</div>
        <div style={{ fontSize: 96, color: "#ffd700", fontWeight: 700 }}>
          인스타 언팔 확인
        </div>
        <div style={{ fontSize: 42, color: "#e8e8f0", marginTop: 24 }}>
          비밀번호 없이, 맞팔만 골라서
        </div>
        <div style={{ fontSize: 30, color: "#c0c8d8", marginTop: 24 }}>
          공식 내보내기 파일을 브라우저에서만 분석 · 쓰레드 지원
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
