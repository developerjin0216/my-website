import { NextResponse, type NextRequest } from "next/server";
import { REGIONS, findRegion } from "@/data/cctvRegions";

// 전국 도로 CCTV 목록 — 국가교통정보센터(ITS) 오픈API를 대신 호출합니다.
//
// 서버를 거치는 이유는 하나, 인증키를 숨기기 위해서입니다. 영상 자체는 브라우저가
// CCTV 서버에서 직접 받아갑니다 (cctvsec.ktict.co.kr이 Access-Control-Allow-Origin: *
// 이고 HTTPS도 되기 때문). 그래서 영상 트래픽은 이 서버를 지나지 않습니다 —
// 프록시했다면 1Mbps짜리 스트림이 그대로 함수 대역폭이 됐을 겁니다.
//
// 영상 주소에 붙는 wmsAuthSign 토큰은 발급 후 120분간 유효합니다. 그보다 짧게
// 캐시해서, 사용자가 받은 주소가 이미 만료된 상태가 되지 않도록 합니다.

const ITS_ENDPOINT = "https://openapi.its.go.kr:9443/cctvInfo";
const CACHE_SECONDS = 60 * 50; // 토큰 수명 120분보다 넉넉히 짧게

export const revalidate = 0;

interface Cam {
  name: string;
  lat: number;
  lng: number;
  url: string;
  road: "ex" | "its";
}

/** ITS는 XML을 돌려줍니다 (getType=json을 줘도 XML이 오는 경우가 있어 XML로 고정) */
function parseCams(xml: string, road: "ex" | "its"): Cam[] {
  const out: Cam[] = [];
  for (const m of xml.matchAll(/<data>([\s\S]*?)<\/data>/g)) {
    const b = m[1];
    const get = (tag: string) =>
      (b.match(new RegExp(`<${tag}>([^<]*)</${tag}>`)) ?? [])[1] ?? "";
    const url = get("cctvurl");
    const name = get("cctvname");
    const lat = Number(get("coordy"));
    const lng = Number(get("coordx"));
    if (!url || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    // 혹시 http로 오면 https로 — 사이트가 https라 섞이면 브라우저가 막습니다
    out.push({ name, lat, lng, url: url.replace(/^http:/, "https:"), road });
  }
  return out;
}

async function fetchRoad(
  key: string,
  road: "ex" | "its",
  box: { minX: number; maxX: number; minY: number; maxY: number }
): Promise<Cam[]> {
  const qs = new URLSearchParams({
    apiKey: key,
    type: road,
    cctvType: "4", // 실시간 스트리밍(HLS, HTTPS)
    minX: String(box.minX),
    maxX: String(box.maxX),
    minY: String(box.minY),
    maxY: String(box.maxY),
    getType: "xml",
  });
  const res = await fetch(`${ITS_ENDPOINT}?${qs}`, {
    next: { revalidate: CACHE_SECONDS },
  });
  if (!res.ok) throw new Error(`ITS ${road} 응답 ${res.status}`);
  const xml = await res.text();
  const err = xml.match(/<resultMsg>([^<]*)<\/resultMsg>/);
  if (err) throw new Error(`ITS: ${err[1]}`);
  return parseCams(xml, road);
}

export async function GET(request: NextRequest) {
  const key = process.env.ITS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "설정되지 않음", detail: "ITS_API_KEY 환경변수가 없습니다." },
      { status: 503 }
    );
  }

  const regionId = request.nextUrl.searchParams.get("region") ?? "";
  const region = findRegion(regionId);
  if (!region) {
    return NextResponse.json(
      { error: "알 수 없는 지역", regions: REGIONS.map((r) => r.id) },
      { status: 400 }
    );
  }

  try {
    // 고속도로와 국도를 따로 받아 합칩니다. 한쪽이 비어도 나머지는 보여줍니다.
    const [ex, its] = await Promise.allSettled([
      fetchRoad(key, "ex", region.box),
      fetchRoad(key, "its", region.box),
    ]);
    const cams = [
      ...(ex.status === "fulfilled" ? ex.value : []),
      ...(its.status === "fulfilled" ? its.value : []),
    ];
    if (!cams.length) {
      const why =
        ex.status === "rejected"
          ? (ex.reason as Error).message
          : its.status === "rejected"
            ? (its.reason as Error).message
            : "해당 지역에 공개된 CCTV가 없습니다.";
      return NextResponse.json({ error: "불러오지 못했습니다", detail: why }, { status: 502 });
    }
    cams.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return NextResponse.json(
      { region: region.id, count: cams.length, cams },
      {
        headers: {
          // 같은 지역을 여러 사람이 봐도 ITS 호출은 한 번으로 끝납니다
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`,
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "불러오지 못했습니다", detail: (e as Error).message },
      { status: 502 }
    );
  }
}
