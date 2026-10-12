"use client";

import { useEffect, useMemo, useState } from "react";
import HlsPlayer from "@/components/tools/HlsPlayer";
import { REGIONS } from "@/data/cctvRegions";

interface Cam {
  name: string;
  lat: number;
  lng: number;
  url: string;
  road: "ex" | "its";
}

const SHOW = 50; // 지역당 수백~천 대라 한 번에 다 그리면 휴대폰에서 버벅입니다

export default function CctvPage() {
  const [region, setRegion] = useState(REGIONS[0].id);
  const [cams, setCams] = useState<Cam[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [detail, setDetail] = useState("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(SHOW);
  const [picked, setPicked] = useState<Cam | null>(null);

  // 지역을 바꿀 때의 초기화는 이벤트 쪽에서 합니다. effect 안에서 동기로
  // setState를 부르면 렌더가 연쇄로 일어납니다.
  const chooseRegion = (id: string) => {
    if (id === region) return;
    setRegion(id);
    setState("loading");
    setPicked(null);
    setQ("");
    setLimit(SHOW);
  };

  // reload는 같은 지역을 다시 불러올 때만 씁니다
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let dead = false;
    fetch(`/api/cctv?region=${region}`)
      .then(async (r) => {
        const j = await r.json();
        if (dead) return;
        if (!r.ok) {
          setState("error");
          setDetail(j.detail || j.error || "불러오지 못했습니다.");
          return;
        }
        setCams(j.cams);
        setState("ok");
      })
      .catch(() => {
        if (!dead) {
          setState("error");
          setDetail("연결에 실패했습니다.");
        }
      });
    return () => {
      dead = true;
    };
  }, [region, reload]);

  const filtered = useMemo(() => {
    const k = q.trim();
    if (!k) return cams;
    return cams.filter((c) => c.name.includes(k));
  }, [cams, q]);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4">
        <p className="text-xs text-[#a0a0b0] mb-2">지역</p>
        <div className="grid grid-cols-3 gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => chooseRegion(r.id)}
              className={`rounded-xl py-2.5 px-1 border text-center transition-colors ${
                region === r.id
                  ? "border-accent bg-[#3d2e00]/40"
                  : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
              }`}
            >
              <span
                className={`block text-sm ${region === r.id ? "text-accent font-semibold" : "text-[#e8e8f0]"}`}
              >
                {r.name}
              </span>
              <span className="block text-[10px] text-[#606070] mt-0.5 truncate">
                {r.hint}
              </span>
            </button>
          ))}
        </div>
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
              <li>· 밤에는 노면 반사와 전조등 번짐 말고는 알아보기 어렵습니다</li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl p-4">
        {state === "loading" && (
          <p className="text-sm text-[#a0a0b0] py-6 text-center">
            지점 목록을 불러오는 중…
          </p>
        )}

        {state === "error" && (
          <div className="py-5 text-center">
            <p className="text-sm text-[#EF4444] mb-1">불러오지 못했습니다</p>
            <p className="text-xs text-[#606070] leading-relaxed">{detail}</p>
            <button
              type="button"
              onClick={() => {
                setState("loading");
                setReload((n) => n + 1);
              }}
              className="mt-3 text-xs rounded-lg border border-[#2a3a5a] px-3 py-1.5 text-[#a0a0b0] hover:border-accent"
            >
              다시 시도
            </button>
          </div>
        )}

        {state === "ok" && (
          <>
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
                {filtered.length.toLocaleString("ko-KR")}대
              </span>
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-[#606070] py-6 text-center">
                이름에 &lsquo;{q}&rsquo;가 들어간 지점이 없습니다.
              </p>
            ) : (
              <>
                <div className="space-y-1.5">
                  {filtered.slice(0, limit).map((c) => (
                    <button
                      key={c.url}
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
                {filtered.length > limit && (
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
          </>
        )}
      </div>

      <p className="text-[11px] text-[#606070] leading-relaxed px-1">
        영상 출처: 국토교통부 국가교통정보센터(ITS) 공개 CCTV. 영상은 이 사이트를
        거치지 않고 제공처에서 직접 재생됩니다. 지점에 따라 점검·장애로 재생되지
        않을 수 있습니다.
      </p>
    </div>
  );
}
