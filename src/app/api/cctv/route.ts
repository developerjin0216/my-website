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

/**
 * 서울 리전에서 실행합니다.
 *
 * 기본 리전(미국)에서는 openapi.its.go.kr 호출이 8초 안에 끝나지 않고 그대로
 * 타임아웃이 났습니다. 같은 요청이 국내에서는 2초입니다. 한국 공공 API는
 * 해외에서 느리거나 아예 닿지 않는 경우가 흔합니다.
 *
 * Hobby 요금제에서도 리전 지정은 됩니다 — 유료로 올릴 필요가 없습니다.
 */
export const preferredRegion = ["icn1"];

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

/**
 * fetch가 실패하면 Node는 "fetch failed"만 던지고 진짜 이유는 cause에 넣습니다.
 * 그대로 두면 화면에도 로그에도 "fetch failed"만 남아 원인을 좁힐 수 없습니다.
 * DNS인지 TLS인지 타임아웃인지가 여기서 갈립니다.
 */
function describe(e: unknown): string {
  const err = e as { message?: string; cause?: { code?: string; message?: string } };
  const cause = err?.cause;
  if (!cause) return err?.message ?? String(e);
  return [err.message, cause.code, cause.message].filter(Boolean).join(" / ");
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
  let res: Response;
  try {
    res = await fetch(`${ITS_ENDPOINT}?${qs}`, {
      next: { revalidate: CACHE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    throw new Error(`ITS ${road} 연결 실패: ${describe(e)}`);
  }
  if (!res.ok) throw new Error(`ITS ${road} 응답 ${res.status}`);
  const xml = await res.text();
  const err = xml.match(/<resultMsg>([^<]*)<\/resultMsg>/);
  if (err) throw new Error(`ITS: ${err[1]}`);
  return parseCams(xml, road);
}

/**
 * 목록과 영상 주소를 나눠 보냅니다.
 *
 * 영상 주소는 토큰이 붙어 한 건에 150자가 넘습니다. 충청권은 3,700대라
 * 주소까지 다 실으면 응답이 774KB가 되는데, 그걸 휴대폰에 통째로 내려보낼
 * 이유가 없습니다 — 사용자가 실제로 여는 건 한두 지점입니다.
 * 이름과 노선만 보내면 106KB로 줄고(7분의 1), 주소는 고를 때 한 건만 받습니다.
 *
 * 목록은 서버에서 캐시되므로 두 번째 호출이 ITS를 다시 부르지는 않습니다.
 */
export async function GET(request: NextRequest) {
  const key = process.env.ITS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "설정되지 않음", detail: "ITS_API_KEY 환경변수가 없습니다." },
      { status: 503 }
    );
  }

  const sp = request.nextUrl.searchParams;
  const regionId = sp.get("region") ?? "";
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

    const headers = {
      // 같은 지역을 여러 사람이 봐도 ITS 호출은 한 번으로 끝납니다
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`,
    };

    // 지점 하나의 영상 주소만 요청한 경우
    const name = sp.get("n");
    if (name !== null) {
      const i = Number(sp.get("i"));
      // 보통은 색인으로 바로 찾고, 목록이 그사이 갱신돼 어긋났으면 이름으로 찾습니다
      const byIndex = Number.isInteger(i) ? cams[i] : undefined;
      const cam =
        byIndex && byIndex.name === name
          ? byIndex
          : cams.find((c) => c.name === name);
      if (!cam) {
        return NextResponse.json(
          { error: "지점을 찾지 못했습니다", detail: "목록이 갱신됐을 수 있습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json({ name: cam.name, url: cam.url }, { headers });
    }

    // 목록 — 주소는 빼고 이름과 노선만
    return NextResponse.json(
      {
        region: region.id,
        count: cams.length,
        cams: cams.map((c) => ({ n: c.name, r: c.road })),
      },
      { headers }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "불러오지 못했습니다", detail: describe(e) },
      { status: 502 }
    );
  }
}
