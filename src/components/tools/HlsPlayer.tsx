"use client";

import { useEffect, useRef, useState } from "react";

// 도로 CCTV 재생기 — HLS(m3u8) 스트림을 그대로 받아 보여줍니다.
//
// 영상은 우리 서버를 거치지 않습니다. cctvsec.ktict.co.kr이 HTTPS를 지원하고
// Access-Control-Allow-Origin: * 이라 브라우저가 직접 받아갑니다. 프록시했다면
// 1Mbps짜리 스트림이 그대로 서버 대역폭이 됐을 겁니다.
//
// 사파리(iOS 포함)는 <video>가 m3u8을 그대로 재생합니다. 그 외 브라우저만
// hls.js를 씁니다 — 필요할 때만 동적으로 불러와 첫 로딩에 얹지 않습니다.

type State = "idle" | "loading" | "playing" | "error";

export default function HlsPlayer({
  src,
  label,
  failText = "영상을 불러오지 못했습니다. 주소가 만료됐을 수 있습니다.",
}: {
  src: string;
  label: string;
  /** 스트림을 못 받았을 때 문구 — 출처마다 흔한 원인이 다릅니다 */
  failText?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<State>("idle");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hls: any = null;
    setState("loading");
    setDetail("");

    const fail = (msg: string) => {
      if (disposed) return;
      setState("error");
      setDetail(msg);
    };

    const native = video.canPlayType("application/vnd.apple.mpegurl");
    if (native) {
      video.src = src;
      video.play().catch(() => {
        /* 자동재생이 막히면 사용자가 누르면 됩니다 */
      });
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (disposed) return;
          if (!Hls.isSupported()) {
            fail("이 브라우저는 실시간 영상을 재생하지 못합니다.");
            return;
          }
          hls = new Hls({ liveDurationInfinity: true, lowLatencyMode: false });
          hls.on(Hls.Events.ERROR, (_e: unknown, data: { fatal: boolean }) => {
            if (data.fatal) fail(failText);
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        })
        .catch(() => fail("재생기를 불러오지 못했습니다."));
    }

    const onPlaying = () => !disposed && setState("playing");
    const onError = () => fail("영상이 끊겼습니다. 다른 지점을 골라 보세요.");
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    return () => {
      disposed = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);
      if (hls) hls.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, failText]);

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden bg-black border border-[#2a3a5a] aspect-video">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          controls
          className="w-full h-full object-contain"
        />
        {state !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f1626]/90 px-5 text-center">
            <p className="text-sm text-[#a0a0b0] leading-relaxed">
              {state === "loading" && "연결 중…"}
              {state === "error" && detail}
              {state === "idle" && "지점을 고르면 재생됩니다."}
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-[#a0a0b0] mt-2 leading-relaxed">{label}</p>
    </div>
  );
}
