"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import HlsPlayer from "@/components/tools/HlsPlayer";
import {
  REGIONS,
  findRegion,
  itsUrl,
  parseCams,
  type Cam,
  type Road,
} from "@/data/cctvRegions";

// Leaflet은 window를 쓰므로 서버 렌더를 끄고, 지도 탭을 열 때만 받아옵니다
const CctvMap = dynamic(() => import("@/components/tools/CctvMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-[#2a3a5a] bg-[#0f1626] flex items-center justify-center" style={{ height: 340 }}>
      <p className="text-sm text-[#606070]">지도를 불러오는 중…</p>
    </div>
  ),
});

const KEY = process.env.NEXT_PUBLIC_ITS_API_KEY ?? "";
const SHOW = 50; // 지역당 수백~2,000대라 한 번에 다 그리면 휴대폰에서 버벅입니다

export default function CctvPage() {
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [cams, setCams] = useState<Cam[]>([]);
  // effect 안에서 동기로 setState 하면 렌더가 연쇄로 일어납니다.
  // 처음부터 '둘 다 불러오는 중'으로 두고 끝날 때만 비웁니다.
  const [loading, setLoading] = useState<Road[]>(["ex", "its"]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(SHOW);
  const [picked, setPicked] = useState<Cam | null>(null);
  const [nonce, setNonce] = useState(0);
  const [view, setView] = useState<"list" | "map">("list");

  const choose = (id: string) => {
    if (id === regionId) return;
    setRegionId(id);
    setCams([]);
    setPicked(null);
    setErr("");
    setQ("");
    setLimit(SHOW);
    setLoading(["ex", "its"]);
  };

  const retry = useCallback(() => {
    setCams([]);
    setPicked(null);
    setErr("");
    setLoading(["ex", "its"]);
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    const region = findRegion(regionId);
    if (!region) return;
    if (!KEY) return;

    let dead = false;
    const roads: Road[] = ["ex", "its"];

    // 고속도로가 보통 더 빨리 오므로 도착하는 대로 화면에 더합니다.
    // 둘 다 기다리면 큰 지역에서 몇 초씩 빈 화면이 됩니다.
    const jobs = roads.map((road) =>
      fetch(itsUrl(region, road, KEY))
        .then((r) => {
          if (!r.ok) throw new Error(`ITS 응답 ${r.status}`);
          return r.text();
        })
        .then((xml) => {
          if (dead) return;
          const got = parseCams(xml, road);
          setCams((prev) =>
            [...prev, ...got].sort((a, b) => a.name.localeCompare(b.name, "ko"))
          );
        })
        .catch((e: Error) => {
          if (!dead) setErr(e.message);
        })
        .finally(() => {
          if (!dead) setLoading((prev) => prev.filter((r) => r !== road));
        })
    );

    void Promise.allSettled(jobs);
    return () => {
      dead = true;
    };
  }, [regionId, nonce]);

  const filtered = useMemo(() => {
    const k = q.trim();
    return k ? cams.filter((c) => c.name.includes(k)) : cams;
  }, [cams, q]);

  const busy = loading.length > 0 && !!KEY;
  // 빌드 시점에 정해지는 값이라 state로 둘 필요가 없습니다
  const problem = KEY ? err : "인증키가 설정되지 않았습니다 (NEXT_PUBLIC_ITS_API_KEY).";

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4">
        <p className="text-xs text-[#a0a0b0] mb-2">지역</p>
        <div className="grid grid-cols-4 gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => choose(r.id)}
              className={`rounded-xl py-2.5 px-1 border text-center transition-colors ${
                regionId === r.id
                  ? "border-accent bg-[#3d2e00]/40"
                  : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
              }`}
            >
              <span
                className={`block text-[13px] ${regionId === r.id ? "text-accent font-semibold" : "text-[#e8e8f0]"}`}
              >
                {r.name}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#606070] mt-2">
          {findRegion(regionId)?.hint}
        </p>
      </div>

      {picked && (
        <div className="bg-card rounded-2xl p-4">
          <HlsPlayer src={picked.url} label={picked.name} />
          <div className="mt-3 rounded-xl bg-[#16213e] p-3">
            <p className="text-xs font-bold text-accent mb-1.5">
              화면으로 날씨 읽는 법
            </p>
            <ul className="text-[11px] text-[#a0a0b0] leading-relaxed space-y-1">
              <li>· 노면이 검고 번들거리면 비가 왔거나 오는 중입니다</li>
              <li>· 렌즈에 물방울이 맺혀 흐릿하면 지금 내리는 중일 가능성이 큽니다</li>
              <li>· 차들이 와이퍼를 쓰는지, 전조등을 켰는지도 단서입니다</li>
              <li>· 눈은 노면보다 갓길과 중앙분리대에 먼저 쌓입니다</li>
              <li>· 밤에는 노면 반사와 전조등 번짐 말고는 알아보기 어렵습니다</li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl p-4">
        {problem && cams.length === 0 ? (
          <div className="py-5 text-center">
            <p className="text-sm text-[#EF4444] mb-1">불러오지 못했습니다</p>
            <p className="text-xs text-[#606070] leading-relaxed">{problem}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-3 text-xs rounded-lg border border-[#2a3a5a] px-3 py-1.5 text-[#a0a0b0] hover:border-accent"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <>
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

            {view === "map" && cams.length > 0 && (
              <div className="mb-3">
                <CctvMap
                  cams={filtered}
                  picked={picked}
                  onPick={(c) => {
                    setPicked(c);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setLimit(SHOW);
                }}
                placeholder="지점 이름으로 찾기 (예: 판교, 강릉)"
                className="flex-1 min-w-0 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-accent"
              />
              <span className="shrink-0 text-[11px] text-[#606070]">
                {busy && cams.length === 0
                  ? "불러오는 중"
                  : `${filtered.length.toLocaleString("ko-KR")}대`}
              </span>
            </div>

            {busy && (
              <p className="text-[11px] text-[#606070] mb-2">
                {cams.length > 0
                  ? `${cams.length.toLocaleString("ko-KR")}대 표시 중 — 나머지를 더 불러오고 있습니다`
                  : "지점 목록을 불러오는 중…"}
              </p>
            )}

            {!busy && filtered.length === 0 && cams.length > 0 && (
              <p className="text-sm text-[#606070] py-6 text-center">
                이름에 &lsquo;{q}&rsquo;가 들어간 지점이 없습니다.
              </p>
            )}

            <div className={view === "list" ? "space-y-1.5" : "hidden"}>
              {filtered.slice(0, limit).map((c) => (
                <button
                  key={c.road + c.name + c.url.slice(-10)}
                  type="button"
                  onClick={() => {
                    setPicked(c);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
                    picked?.url === c.url
                      ? "border-accent bg-[#3d2e00]/40"
                      : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`shrink-0 text-[10px] rounded px-1.5 py-0.5 ${
                        c.road === "ex"
                          ? "bg-[#1e3a5f] text-[#8ab4f8]"
                          : "bg-[#2a3a2a] text-[#9ccc9c]"
                      }`}
                    >
                      {c.road === "ex" ? "고속" : "국도"}
                    </span>
                    <span className="text-sm text-[#e8e8f0] truncate">
                      {c.name}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {view === "list" && filtered.length > limit && (
              <button
                type="button"
                onClick={() => setLimit((n) => n + SHOW * 4)}
                className="w-full mt-3 rounded-xl border border-[#2a3a5a] py-2.5 text-sm text-[#a0a0b0] hover:border-accent"
              >
                더 보기 ({(filtered.length - limit).toLocaleString("ko-KR")}대 남음)
              </button>
            )}
          </>
        )}
      </div>

      <p className="text-[11px] text-[#606070] leading-relaxed px-1">
        영상 출처: 국토교통부 국가교통정보센터(ITS) 공개 CCTV. 목록과 영상 모두
        제공처에서 브라우저로 바로 받아오며 이 사이트를 거치지 않습니다. 지점에
        따라 점검·장애로 재생되지 않을 수 있습니다.
      </p>
    </div>
  );
}
