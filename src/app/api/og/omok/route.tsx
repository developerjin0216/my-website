import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 오목 초대 링크용 동적 OG 카드.
//
// 카톡·디스코드에 초대 링크를 붙여넣었을 때 "누가 무엇을 신청했는지"가 펼쳐져야
// 상대가 누릅니다. 링크만 덜렁 가면 대부분 무시됩니다. 이 게임이 퍼질 유일한
// 경로가 사람 손으로 보내는 링크라, 미리보기 카드가 사실상 광고 소재입니다.
//
// Node 런타임 + next.config의 outputFileTracingIncludes로 폰트를 번들에 포함
// (edge 런타임은 폰트 크기 때문에 배포가 실패합니다 — result 카드와 같은 이유)
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 닉네임은 그대로 이미지에 그려지므로 길이를 자르고 줄바꿈 문자를 제거합니다
  const host = (searchParams.get("n") ?? "")
    .replace(/[\r\n\t]/g, " ")
    .trim()
    .slice(0, 12);
  const code = (searchParams.get("r") ?? "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 6);

  const fontData = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Bold.otf")
  );

  const title = host ? `${host}님이` : "친구가";

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
          background: "linear-gradient(135deg, #1a1a2e 0%, #2b2438 55%, #3d3020 100%)",
          fontFamily: "Pretendard",
          padding: 60,
        }}
      >
        {/* 오목판 한 귀퉁이 — 돌 다섯이 이어진 모양 */}
        <div style={{ display: "flex", gap: 14, marginBottom: 44 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                background: i % 2 === 0 ? "#1a1a1a" : "#f5f5f5",
                border: i % 2 === 0 ? "3px solid #444" : "3px solid #bbb",
                display: "flex",
              }}
            />
          ))}
        </div>

        <div style={{ fontSize: 60, color: "#ffd700", display: "flex" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 60,
            color: "#e8e8f0",
            marginTop: 8,
            display: "flex",
          }}
        >
          오목 한 판 신청했습니다
        </div>

        {code && (
          <div
            style={{
              fontSize: 34,
              color: "#c9a063",
              marginTop: 36,
              padding: "14px 34px",
              border: "3px solid #c9a063",
              borderRadius: 18,
              display: "flex",
              letterSpacing: 6,
            }}
          >
            {code}
          </div>
        )}

        <div
          style={{
            fontSize: 30,
            color: "#8a8a9a",
            marginTop: 40,
            display: "flex",
          }}
        >
          설치·가입 없이 링크 하나로 · 8282114.xyz
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
