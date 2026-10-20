"use client";

import { useEffect, useState } from "react";
import HlsPlayer from "@/components/tools/HlsPlayer";
import { PARK_CAMS, PARK_STREAM, type ParkCam } from "@/data/cctvParks";

// 국립공원 CCTV 목록 + 영상. 목록은 서버 렌더에도 그대로 나갑니다.
//
// 공단 카메라는 현장 날씨·통신 때문에 자주 쉬어서(공단 안내), 열자마자 플레이리스트를 한 번씩
// 받아 '지금 재생됨 / 잠시 멈춤'을 표시합니다. 공단 자체 페이지도 같은 식으로 확인합니다.
// 플레이리스트는 수백 바이트라 18개를 받아도 가볍습니다.

type Status = "checking" | "live" | "down";

const GROUPS: { kind: ParkCam["kind"]; title: string }[] = [
  { kind: "산", title: "산 정상·탐방로" },
  { kind: "바다", title: "바다·해안" },
];

export default function ParkViewer() {
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(PARK_CAMS.map((c) => [c.id, "checking" as Status]))
  );
  const [picked, setPicked] = useState<ParkCam | null>(null);

  useEffect(() => {
    let dead = false;
    for (const c of PARK_CAMS) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      fetch(PARK_STREAM(c.id), { signal: ctrl.signal, cache: "no-store" })
        .then(async (r) => r.ok && (await r.text()).includes("#EXTINF"))
        .catch(() => false)
        .then((ok) => {
          clearTimeout(timer);
          if (!dead) setStatus((s) => ({ ...s, [c.id]: ok ? "live" : "down" }));
        });
    }
    return () => {
      dead = true;
    };
  }, []);

  const liveCount = Object.values(status).filter((s) => s === "live").length;
  const checking = Object.values(status).some((s) => s === "checking");

  return (
    <div className="space-y-4">
      {picked && (
        <div className="bg-card rounded-2xl p-4">
          <HlsPlayer
            src={PARK_STREAM(picked.id)}
            label={`${picked.park}국립공원 ${picked.spot} — 영상: 국립공원공단`}
            failText="지금은 영상이 멈춰 있습니다. 현장 기상이나 통신 상황에 따라 잠시 중지되는 경우가 있습니다(국립공원공단 안내)."
          />
        </div>
      )}

      <div className="bg-card rounded-2xl p-4">
        <p className="text-[11px] text-[#606070] mb-3">
          {checking
            ? "재생 가능 여부를 확인하는 중…"
            : `지금 ${liveCount}곳 재생 중 · 전체 ${PARK_CAMS.length}곳`}
        </p>
        {GROUPS.map((g) => (
          <section key={g.kind} className="mb-4 last:mb-0">
            <h2 className="text-sm font-bold text-accent mb-2">{g.title}</h2>
            <ul className="space-y-1.5">
              {PARK_CAMS.filter((c) => c.kind === g.kind).map((c) => {
                const st = status[c.id];
                return (
                  <li key={c.id} id={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setPicked(c);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
                        picked?.id === c.id
                          ? "border-accent bg-[#3d2e00]/40"
                          : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm text-[#e8e8f0] truncate">
                          {c.park} · {c.spot}
                        </span>
                        <span className="ml-auto shrink-0 text-[10px] text-[#606070]">
                          {c.region}
                        </span>
                        <span
                          className={`shrink-0 text-[10px] rounded px-1.5 py-0.5 ${
                            st === "live"
                              ? "bg-[#1f3a2a] text-[#9ccc9c]"
                              : st === "down"
                                ? "bg-[#3a1f1f] text-[#e0a0a0]"
                                : "bg-[#1e2a40] text-[#606070]"
                          }`}
                        >
                          {st === "live" ? "재생 중" : st === "down" ? "잠시 멈춤" : "확인 중"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
