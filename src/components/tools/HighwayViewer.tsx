"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import HlsPlayer from "@/components/tools/HlsPlayer";
import type { Cam } from "@/data/cctvRegions";
import type { CamPoint } from "@/data/cctvHighways";

// 고속도로 노선 페이지의 지점 목록 + 영상.
//
// 목록은 스냅샷(props)으로 바로 그립니다 — 서버 렌더에도 그대로 나가서 검색엔진이 지점 이름을 봅니다.
// 영상 주소는 지점을 누를 때만 받습니다. 그 지점 좌표 ±0.003°(약 300m)만 조회하면 응답이 1~2건이라
// 휴대폰에서도 1초 남짓이면 옵니다. 노선 전체를 한 번에 받으면 경부선만 수백 KB입니다.

const CctvMap = dynamic(() => import("@/components/tools/CctvMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-[#2a3a5a] bg-[#0f1626] flex items-center justify-center" style={{ height: 340 }}>
      <p className="text-sm text-[#606070]">지도를 불러오는 중…</p>
    </div>
  ),
});

const KEY = process.env.NEXT_PUBLIC_ITS_API_KEY ?? "";

interface ItsItem {
  cctvname: string;
  cctvurl: string;
  coordx: string | number;
  coordy: string | number;
}

async function lookup([, lat, lng]: CamPoint, d: number): Promise<ItsItem[]> {
  const qs = new URLSearchParams({
    apiKey: KEY,
    type: "ex",
    cctvType: "4",
    minX: String(lng - d),
    maxX: String(lng + d),
    minY: String(lat - d),
    maxY: String(lat + d),
    getType: "json",
  });
  const r = await fetch(`https://openapi.its.go.kr:9443/cctvInfo?${qs}`);
  if (!r.ok) throw new Error(`ITS 응답 ${r.status}`);
  // 결과가 1건이면 data 가 배열이 아니라 객체로 옵니다
  const data = (await r.json())?.response?.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}

/** 지점의 현재 영상 주소 — 이름이 정확히 같은 것, 없으면 범위를 넓혀 같은 노선의 가장 가까운 것 */
async function streamFor(line: string, cam: CamPoint): Promise<string> {
  const full = `[${line}] ${cam[0]}`;
  for (const d of [0.003, 0.02]) {
    const list = await lookup(cam, d);
    const exact = list.find((x) => x.cctvname === full);
    if (exact) return exact.cctvurl;
    const same = list
      .filter((x) => x.cctvname.startsWith(`[${line}]`))
      .sort(
        (a, b) =>
          Math.hypot(+a.coordy - cam[1], +a.coordx - cam[2]) -
          Math.hypot(+b.coordy - cam[1], +b.coordx - cam[2])
      )[0];
    if (same && d > 0.003) return same.cctvurl;
  }
  throw new Error("이 지점의 영상을 찾지 못했습니다. 점검 중이거나 철거됐을 수 있습니다.");
}

export default function HighwayViewer({
  line,
  name,
  cams,
}: {
  line: string;
  name: string;
  cams: CamPoint[];
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [src, setSrc] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");

  const shown = useMemo(() => {
    const k = q.trim();
    return cams.map((c, i) => [c, i] as const).filter(([c]) => !k || c[0].includes(k));
  }, [cams, q]);

  // 지도 컴포넌트는 지역 페이지와 같은 Cam 형식을 씁니다. 영상 주소는 아직 없으므로 비워 둡니다.
  const mapCams: Cam[] = useMemo(
    () => shown.map(([c]) => ({ name: c[0], lat: c[1], lng: c[2], url: "", road: "ex" as const })),
    [shown]
  );

  const pick = async (i: number) => {
    setPicked(i);
    setSrc("");
    setErr("");
    if (!KEY) {
      setErr("인증키가 설정되지 않았습니다 (NEXT_PUBLIC_ITS_API_KEY).");
      return;
    }
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      setSrc(await streamFor(line, cams[i]));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "영상을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const cur = picked === null ? null : cams[picked];

  return (
    <div className="space-y-4">
      {cur && (
        <div className="bg-card rounded-2xl p-4">
          {src ? (
            <HlsPlayer src={src} label={`${name} ${cur[0]}`} />
          ) : (
            <div className="aspect-video rounded-xl bg-[#0f1626] flex items-center justify-center px-6 text-center">
              <p className={`text-sm ${err ? "text-[#EF4444]" : "text-[#606070]"}`}>
                {err || (loading ? `${cur[0]} 영상 주소를 받는 중…` : "")}
              </p>
            </div>
          )}
          <div className="mt-3 rounded-xl bg-[#16213e] p-3">
            <p className="text-xs font-bold text-accent mb-1.5">화면으로 날씨 읽는 법</p>
            <ul className="text-[11px] text-[#a0a0b0] leading-relaxed space-y-1">
              <li>· 노면이 검고 번들거리면 비가 왔거나 오는 중입니다</li>
              <li>· 렌즈에 물방울이 맺혀 흐릿하면 지금 내리는 중일 가능성이 큽니다</li>
              <li>· 눈은 노면보다 갓길과 중앙분리대에 먼저 쌓입니다</li>
              <li>· 밤에는 노면 반사와 전조등 번짐 말고는 알아보기 어렵습니다</li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl p-4">
        <div className="flex gap-1.5 mb-3">
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`flex-1 rounded-xl py-2 text-sm border transition-colors ${
                view === v
                  ? "border-accent text-accent font-semibold"
                  : "border-[#2a3a5a] text-[#a0a0b0] hover:border-accent"
              }`}
            >
              {v === "list" ? "목록" : "지도"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="지점 이름으로 찾기 (예: 휴게소, 터널, 분기점)"
            className="flex-1 min-w-0 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-accent"
          />
          <span className="shrink-0 text-[11px] text-[#606070]">
            {shown.length.toLocaleString("ko-KR")}곳
          </span>
        </div>

        {view === "map" && (
          <div className="mb-3">
            <CctvMap
              cams={mapCams}
              picked={cur ? { name: cur[0], lat: cur[1], lng: cur[2], url: "", road: "ex" } : null}
              onPick={(c) => {
                const i = cams.findIndex((x) => x[0] === c.name && x[1] === c.lat && x[2] === c.lng);
                if (i >= 0) void pick(i);
              }}
            />
          </div>
        )}

        {/* 지도 탭에서도 목록은 DOM 에 남깁니다 — 검색엔진이 읽는 지점 이름이 이 목록입니다 */}
        <ol className={view === "list" ? "space-y-1.5" : "hidden"}>
          {shown.map(([c, i]) => (
            <li key={`${c[0]}-${c[1]}-${c[2]}`}>
              <button
                type="button"
                onClick={() => void pick(i)}
                className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
                  picked === i
                    ? "border-accent bg-[#3d2e00]/40"
                    : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="shrink-0 w-8 text-[10px] text-[#606070] tabular-nums">{i + 1}</span>
                  <span className="text-sm text-[#e8e8f0] truncate">{c[0]}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {shown.length === 0 && (
          <p className="text-sm text-[#606070] py-6 text-center">
            이름에 &lsquo;{q}&rsquo;가 들어간 지점이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
