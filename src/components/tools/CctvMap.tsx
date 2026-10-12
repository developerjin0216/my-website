"use client";

import { useEffect, useRef } from "react";
// 타일 정렬·확대 버튼이 깨지지 않으려면 Leaflet 기본 CSS가 필요합니다.
// 여기서 import하면 지도를 열 때만 함께 받아옵니다.
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, CircleMarker } from "leaflet";
import type { Cam } from "@/data/cctvRegions";

// CCTV 위치 지도 — Leaflet + OpenStreetMap.
//
// 카카오·네이버 지도가 한글 표기는 낫지만 앱 키 발급과 도메인 등록이 필요합니다.
// OSM은 키 없이 바로 되고, 국내 도로·지명 표기도 쓸 만합니다.
//
// 지역당 최대 2,000개 가까운 점을 찍어야 해서 기본 마커(이미지 + DOM 엘리먼트)를
// 쓰면 브라우저가 멈춥니다. preferCanvas로 캔버스에 원을 그리면 같은 수를 부드럽게
// 다룹니다. 그래서 Marker가 아니라 CircleMarker를 씁니다.

const ROAD_COLOR = { ex: "#8ab4f8", its: "#9ccc9c" } as const;

export default function CctvMap({
  cams,
  picked,
  onPick,
}: {
  cams: Cam[];
  picked: Cam | null;
  onPick: (c: Cam) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<CircleMarker[]>([]);
  // 최신 onPick을 effect 재실행 없이 쓰기 위한 보관함.
  // 렌더 중에 ref를 건드리면 안 되므로 effect에서 갱신합니다.
  const pickRef = useRef(onPick);
  useEffect(() => {
    pickRef.current = onPick;
  }, [onPick]);

  // 지도 생성 (한 번만)
  useEffect(() => {
    let dead = false;
    let map: LeafletMap | null = null;

    import("leaflet").then((L) => {
      if (dead || !boxRef.current || mapRef.current) return;
      map = L.map(boxRef.current, {
        preferCanvas: true,
        attributionControl: true,
      }).setView([36.5, 127.8], 7);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      mapRef.current = map;
    });

    return () => {
      dead = true;
      map?.remove();
      mapRef.current = null;
      layerRef.current = [];
    };
  }, []);

  // 카메라 목록이 바뀌면 점을 다시 찍습니다
  useEffect(() => {
    let dead = false;
    import("leaflet").then((L) => {
      const map = mapRef.current;
      if (dead || !map) return;

      for (const m of layerRef.current) m.remove();
      layerRef.current = [];
      if (!cams.length) return;

      for (const cam of cams) {
        const dot = L.circleMarker([cam.lat, cam.lng], {
          radius: 4,
          weight: 1,
          color: "#0f1626",
          fillColor: ROAD_COLOR[cam.road],
          fillOpacity: 0.9,
        })
          .bindTooltip(cam.name, { direction: "top" })
          .on("click", () => pickRef.current(cam));
        dot.addTo(map);
        layerRef.current.push(dot);
      }

      // 받은 지점이 모두 보이도록 화면을 맞춥니다
      const bounds = L.latLngBounds(cams.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [24, 24] });
    });
    return () => {
      dead = true;
    };
  }, [cams]);

  // 고른 지점 강조
  useEffect(() => {
    layerRef.current.forEach((dot, i) => {
      const cam = cams[i];
      if (!cam) return;
      const on = picked?.url === cam.url;
      dot.setStyle({
        radius: on ? 8 : 4,
        fillColor: on ? "#ffd700" : ROAD_COLOR[cam.road],
        weight: on ? 2 : 1,
        color: on ? "#1a1a2e" : "#0f1626",
      });
      if (on) dot.bringToFront();
    });
  }, [picked, cams]);

  return (
    <div>
      <div
        ref={boxRef}
        className="w-full rounded-xl overflow-hidden border border-[#2a3a5a]"
        style={{ height: 340 }}
      />
      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#606070]">
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: ROAD_COLOR.ex }}
          />
          고속도로
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: ROAD_COLOR.its }}
          />
          국도
        </span>
        <span className="ml-auto">점을 누르면 영상이 열립니다</span>
      </div>
    </div>
  );
}
