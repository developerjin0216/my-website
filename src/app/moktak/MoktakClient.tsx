"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 사이버 목탁 — 터치하면 채가 내려치고 목탁이 살짝 흔들리며 "똑" 소리가 납니다.
//
// 소리 파일이 없습니다. Web Audio 로 합성합니다: 나무 울림(사인파 세 개, 빠른 감쇠,
// 치고 나서 음이 살짝 내려가는 것까지)에 타격 순간의 아주 짧은 노이즈를 얹습니다.
// 매번 ±2% 안에서 음높이를 흔들어 기계 소리처럼 들리지 않게 했습니다.
// AudioContext 는 첫 터치에서 만듭니다 — 브라우저 자동재생 정책상 그 전엔 못 만듭니다.

const STORAGE_KEY = "moktak_count";

function strike(ctx: AudioContext, volume: number) {
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = volume;
  out.connect(ctx.destination);

  const detune = 1 + (Math.random() - 0.5) * 0.04;
  const partials: [number, number, number][] = [
    [690, 0.9, 0.16],
    [1140, 0.45, 0.1],
    [2300, 0.2, 0.05],
  ];
  for (const [f, g, d] of partials) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f * detune, t);
    o.frequency.exponentialRampToValueAtTime(f * detune * 0.88, t + d);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(g, t + 0.003);
    env.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(env).connect(out);
    o.start(t);
    o.stop(t + d + 0.02);
  }

  // 타격음 — 12ms 노이즈를 밴드패스로
  const len = Math.floor(ctx.sampleRate * 0.012);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1800;
  bp.Q.value = 0.8;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.5, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  src.connect(bp).connect(ng).connect(out);
  src.start(t);
}

export default function MoktakClient() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [count, setCount] = useState(0);
  const [hitKey, setHitKey] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // 저장된 타수 복원 — 동기 setState 캐스케이드 방지를 위해 태스크로 지연 (CoupangBanner 와 같은 패턴)
    const t = setTimeout(() => {
      try {
        const saved = Number(localStorage.getItem(STORAGE_KEY) ?? "0");
        if (Number.isFinite(saved) && saved > 0) setCount(saved);
      } catch {
        /* 저장소 없음 — 0부터 */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const hit = useCallback(() => {
    if (!muted) {
      try {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        strike(ctx, 0.8);
      } catch {
        /* Web Audio 미지원 — 소리 없이 동작만 */
      }
    }
    setHitKey(Date.now());
    setCount((c) => {
      const next = c + 1;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* silent */
      }
      return next;
    });
    try {
      navigator.vibrate?.(12);
    } catch {
      /* silent */
    }
  }, [muted]);

  const reset = () => {
    setCount(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          hit();
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            hit();
          }
        }}
        aria-label="목탁 치기"
        className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#ffd700]/40 active:brightness-110 touch-manipulation"
      >
        {/* key 가 바뀌면 다시 마운트돼 애니메이션이 처음부터 재생됩니다 */}
        <div key={hitKey} className={hitKey ? "moktak-hit" : ""}>
          <svg
            viewBox="0 0 360 360"
            width="300"
            height="300"
            className="w-[min(80vw,300px)] h-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="moktak-wood" cx="38%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#d49a5a" />
                <stop offset="45%" stopColor="#9c6132" />
                <stop offset="100%" stopColor="#4e2d14" />
              </radialGradient>
              <linearGradient id="moktak-stick" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c48c58" />
                <stop offset="100%" stopColor="#6b4120" />
              </linearGradient>
              <linearGradient id="moktak-handle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8a5530" />
                <stop offset="50%" stopColor="#5e3718" />
                <stop offset="100%" stopColor="#3d2410" />
              </linearGradient>
            </defs>

            {/* 몸통 */}
            <g className="moktak-body">
              <path
                d="M180 62 C 262 62, 304 126, 304 190 C 304 254, 248 292, 180 292 C 112 292, 56 254, 56 190 C 56 126, 98 62, 180 62 Z"
                fill="url(#moktak-wood)"
                stroke="#2d1a0b"
                strokeWidth="3"
              />
              {/* 나뭇결 */}
              <path d="M90 150 Q 180 128 270 150" stroke="#6a4020" strokeWidth="2" fill="none" opacity="0.45" />
              <path d="M84 178 Q 180 156 276 178" stroke="#6a4020" strokeWidth="2" fill="none" opacity="0.35" />
              {/* 광택 */}
              <ellipse cx="138" cy="122" rx="42" ry="22" fill="#fff" opacity="0.13" />
              {/* 물고기 눈 조각 */}
              <circle cx="132" cy="166" r="7" fill="#3b2412" />
              <circle cx="228" cy="166" r="7" fill="#3b2412" />
              <circle cx="134" cy="164" r="2.5" fill="#1a0e06" />
              <circle cx="230" cy="164" r="2.5" fill="#1a0e06" />
              {/* 울림 틈 */}
              <path d="M92 214 Q 180 252 268 214" stroke="#2a160a" strokeWidth="11" strokeLinecap="round" fill="none" />
              <path d="M104 217 Q 180 247 256 217" stroke="#120803" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* 손잡이 */}
              <rect x="160" y="286" width="40" height="58" rx="14" fill="url(#moktak-handle)" stroke="#2d1a0b" strokeWidth="3" />
            </g>

            {/* 채 — 터치하면 내려칩니다 */}
            <g className="moktak-stick">
              <rect x="300" y="34" width="14" height="128" rx="7" fill="url(#moktak-stick)" stroke="#2d1a0b" strokeWidth="2" />
              <circle cx="307" cy="166" r="17" fill="url(#moktak-stick)" stroke="#2d1a0b" strokeWidth="2" />
              <ellipse cx="302" cy="160" rx="6" ry="4" fill="#fff" opacity="0.18" />
            </g>
          </svg>
        </div>
      </button>

      <div className="text-center">
        <p className="text-4xl font-black text-[#ffd700] tabular-nums leading-none">
          {count.toLocaleString("ko-KR")}
        </p>
        <p className="text-xs text-[#a0a0b0] mt-1.5">번 쳤습니다 · 이 기기에만 저장됩니다</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="rounded-full px-4 py-2 text-xs font-semibold border border-[#2a3a5a] bg-[#16213e] text-[#c0c8d8] hover:border-accent"
        >
          {muted ? "🔇 소리 꺼짐" : "🔊 소리 켜짐"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full px-4 py-2 text-xs font-semibold border border-[#2a3a5a] bg-[#16213e] text-[#a0a0b0] hover:border-accent"
        >
          처음부터
        </button>
      </div>
    </div>
  );
}
