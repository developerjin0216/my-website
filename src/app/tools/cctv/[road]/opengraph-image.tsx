import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { HIGHWAYS, camsOf, getHighway } from "@/data/cctvHighways";

// 노선별 OG 이미지 — 빌드 타임에 20장 정적 생성.
//
// 공용 이미지 대신 노선 이름을 박는 이유: 이 페이지들이 공유되는 상황이 폭설·귀성길이고,
// 그때 카톡방에 떨어지는 카드에 "경부고속도로"가 보이느냐 "8282114"가 보이느냐가
// 눌리는지를 가릅니다. 네이버 웹문서 썸네일도 같은 이미지를 씁니다.
//
// 숫자는 커밋된 스냅샷(data/cctvHighways.json)에서 세므로 페이지 본문과 항상 같습니다.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return HIGHWAYS.map((h) => ({ road: h.slug }));
}

export default async function Image({ params }: { params: { road: string } }) {
  const fontData = await readFile(
    join(process.cwd(), "src/assets/fonts/Pretendard-Bold.otf")
  );
  const h = getHighway(params.road);
  const name = h ? h.name : "고속도로";
  const count = h ? camsOf(h).length : 0;

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
        <div style={{ fontSize: 56, marginBottom: 18 }}>📹</div>
        <div
          style={{
            fontSize: name.length > 8 ? 84 : 104,
            color: "#ffd700",
            fontWeight: 700,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 44, color: "#e8e8f0", marginTop: 22 }}>
          {`실시간 CCTV ${count}곳`}
        </div>
        <div style={{ fontSize: 30, color: "#c0c8d8", marginTop: 26 }}>
          눈·비·귀성길 — 가는 길 노면을 영상으로 확인
        </div>
        <div style={{ fontSize: 26, color: "#606070", marginTop: 34 }}>
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
