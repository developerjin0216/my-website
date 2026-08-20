"use client";

import { useEffect, useRef, useState } from "react";

export default function WebcamTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const [camOn, setCamOn] = useState(false);
  const [camInfo, setCamInfo] = useState("");
  const [camError, setCamError] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micError, setMicError] = useState("");
  const [recState, setRecState] = useState<"idle" | "recording" | "ready">("idle");
  const [recUrl, setRecUrl] = useState<string | null>(null);

  // 페이지 이탈 시 모든 장치 해제
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggleCam = async () => {
    setCamError("");
    if (camOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCamOn(false);
      setCamInfo("");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const s = stream.getVideoTracks()[0].getSettings();
      setCamInfo(`${s.width}×${s.height}${s.frameRate ? ` · ${Math.round(s.frameRate)}fps` : ""}`);
      setCamOn(true);
    } catch (e) {
      setCamError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "권한이 차단됐습니다 — 주소창 자물쇠 아이콘에서 카메라를 허용하고 새로고침하세요."
          : "카메라를 열 수 없습니다. 다른 앱(줌 등)이 사용 중인지 확인하세요."
      );
    }
  };

  const toggleMic = async () => {
    setMicError("");
    if (micOn) {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      cancelAnimationFrame(rafRef.current);
      setMicOn(false);
      setMicLevel(0);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      await ctx.resume();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
        setMicLevel(Math.min(100, Math.round((peak / 128) * 160)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      setMicOn(true);
    } catch (e) {
      setMicError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "권한이 차단됐습니다 — 주소창 자물쇠 아이콘에서 마이크를 허용하세요."
          : "마이크를 열 수 없습니다."
      );
    }
  };

  const record3s = async () => {
    if (!micStreamRef.current) await toggleMic();
    const stream = micStreamRef.current;
    if (!stream) return;
    if (recUrl) URL.revokeObjectURL(recUrl);
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = () => {
      setRecUrl(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
      setRecState("ready");
    };
    recorderRef.current = rec;
    rec.start();
    setRecState("recording");
    setTimeout(() => rec.state === "recording" && rec.stop(), 3000);
  };

  const beep = async (side: "left" | "right") => {
    const ctx = audioCtxRef.current ?? new AudioContext();
    audioCtxRef.current = ctx;
    await ctx.resume();
    const osc = ctx.createOscillator();
    const pan = new StereoPannerNode(ctx, { pan: side === "left" ? -1 : 1 });
    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    osc.frequency.value = side === "left" ? 440 : 660;
    osc.connect(gain).connect(pan).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  };

  const btn =
    "w-full py-3 rounded-xl text-sm font-bold active:scale-[0.98] transition-transform";

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">영상·음성은 전송·저장되지 않습니다.</strong>{" "}
        이 화면에서 재생만 되고, 페이지를 닫으면 즉시 꺼집니다.
      </div>

      {/* ① 카메라 */}
      <div className="bg-card rounded-2xl p-5">
        <h2 className="text-sm font-bold text-accent mb-3">① 카메라 테스트</h2>
        <div className="rounded-xl overflow-hidden bg-black aspect-video mb-3 relative">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {camOn && camInfo && (
            <span className="absolute top-2 right-2 text-xs bg-black/60 text-white rounded-lg px-2 py-1">
              {camInfo}
            </span>
          )}
          {!camOn && (
            <p className="absolute inset-0 flex items-center justify-center text-xs text-[#606070]">
              카메라가 꺼져 있습니다
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={toggleCam}
          className={`${btn} ${camOn ? "bg-[#16213e] border border-[#2a3a5a] text-[#ff6b6b]" : "bg-accent text-[#1a1a2e]"}`}
        >
          {camOn ? "카메라 끄기" : "📷 카메라 켜기"}
        </button>
        {camError && <p className="text-xs text-[#ffb0b0] mt-2">⚠️ {camError}</p>}
      </div>

      {/* ② 마이크 */}
      <div className="bg-card rounded-2xl p-5">
        <h2 className="text-sm font-bold text-accent mb-3">② 마이크 테스트</h2>
        <div className="h-4 bg-[#2a3a5a] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-[width] duration-75"
            style={{
              width: `${micLevel}%`,
              backgroundColor: micLevel > 70 ? "#EF4444" : micLevel > 5 ? "#22C55E" : "#606070",
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={`${btn} ${micOn ? "bg-[#16213e] border border-[#2a3a5a] text-[#ff6b6b]" : "bg-accent text-[#1a1a2e]"}`}
          >
            {micOn ? "마이크 끄기" : "🎙️ 마이크 켜기"}
          </button>
          <button
            type="button"
            onClick={record3s}
            disabled={recState === "recording"}
            className={`${btn} bg-[#16213e] border border-[#2a3a5a] text-accent disabled:opacity-60`}
          >
            {recState === "recording" ? "녹음 중… (3초)" : "3초 녹음해서 들어보기"}
          </button>
        </div>
        {micOn && micLevel <= 2 && (
          <p className="text-xs text-[#a0a0b0] mt-2">
            말해보세요 — 게이지가 안 움직이면 입력 장치를 확인하세요.
          </p>
        )}
        {recState === "ready" && recUrl && (
          <audio controls src={recUrl} className="w-full mt-3 h-10" />
        )}
        {micError && <p className="text-xs text-[#ffb0b0] mt-2">⚠️ {micError}</p>}
      </div>

      {/* ③ 스피커 */}
      <div className="bg-card rounded-2xl p-5">
        <h2 className="text-sm font-bold text-accent mb-3">③ 스피커 테스트</h2>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => beep("left")} className={`${btn} bg-[#16213e] border border-[#2a3a5a] text-accent`}>
            🔈 왼쪽
          </button>
          <button type="button" onClick={() => beep("right")} className={`${btn} bg-[#16213e] border border-[#2a3a5a] text-accent`}>
            오른쪽 🔊
          </button>
        </div>
        <p className="text-xs text-[#606070] mt-2">
          이어폰이라면 좌우가 바뀌지 않았는지도 확인하세요. (iPhone은 무음
          스위치를 해제해야 들립니다)
        </p>
      </div>
    </div>
  );
}
