"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 사이버 목탁 — 터치하면 채가 내려치고 목탁이 살짝 흔들리며 "똑" 소리가 납니다.
//
// 소리 파일이 없습니다. Web Audio 로 합성합니다: 나무 울림(사인파 세 개, 빠른 감쇠,
// 치고 나서 음이 살짝 내려가는 것까지)에 타격 순간의 아주 짧은 노이즈를 얹습니다.
// 매번 ±2% 안에서 음높이를 흔들어 기계 소리처럼 들리지 않게 했습니다.
// AudioContext 는 첫 터치에서 만듭니다 — 브라우저 자동재생 정책상 그 전엔 못 만듭니다.
//
// 그림도 파일이 없습니다. SVG 하나입니다 — 구형 몸통의 광택(방사 그라데이션 + 시인),
// feTurbulence 로 만든 나뭇결, 비늘 조각 패턴, 울림 틈의 안쪽 그림자, 손잡이 밑 물고기
// 머리 조각, 끈 달린 채, 바닥 그림자. 벡터라 어느 해상도에서도 선명합니다.

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

// 몸통 외곽선 — 위가 둥글고 아래가 살짝 눌린 구. clipPath 와 본체가 같은 경로를 씁니다.
const BODY =
  "M200 58 C 284 58, 338 118, 338 190 C 338 258, 288 306, 200 306 C 112 306, 62 258, 62 190 C 62 118, 116 58, 200 58 Z";

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
            viewBox="0 0 400 400"
            width="320"
            height="320"
            className="w-[min(84vw,320px)] h-auto"
            aria-hidden="true"
          >
            <defs>
              {/* 몸통 — 왼쪽 위에서 빛이 오는 광택 나무 */}
              <radialGradient id="mk-body" cx="36%" cy="30%" r="78%">
                <stop offset="0" stopColor="#edb77c" />
                <stop offset="0.3" stopColor="#c27a40" />
                <stop offset="0.62" stopColor="#8a4d24" />
                <stop offset="0.86" stopColor="#4f2b12" />
                <stop offset="1" stopColor="#2b170a" />
              </radialGradient>
              <radialGradient id="mk-sheen" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
                <stop offset="0.6" stopColor="#fff" stopOpacity="0.08" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mk-handle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#a4663a" />
                <stop offset="0.45" stopColor="#6c3e1c" />
                <stop offset="1" stopColor="#371e0e" />
              </linearGradient>
              <linearGradient id="mk-stick" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#dca66c" />
                <stop offset="1" stopColor="#6a3f20" />
              </linearGradient>
              <linearGradient id="mk-slit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#090402" />
                <stop offset="1" stopColor="#2a160a" />
              </linearGradient>
              {/* 나뭇결 — 가로로 길게 늘인 노이즈 */}
              <filter id="mk-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.42" numOctaves="3" seed="11" result="n" />
                <feColorMatrix in="n" type="saturate" values="0" result="g" />
                <feComponentTransfer in="g">
                  <feFuncA type="table" tableValues="0 0.28" />
                </feComponentTransfer>
              </filter>
              <filter id="mk-blur-lg" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
              <filter id="mk-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              {/* 비늘 조각 — 목탁 몸통의 전통 문양 */}
              <pattern id="mk-scales" width="30" height="24" patternUnits="userSpaceOnUse">
                <path d="M0 24 a15 15 0 0 1 30 0" fill="none" stroke="#2a1608" strokeWidth="1.2" />
                <path d="M-15 12 a15 15 0 0 1 30 0 M15 12 a15 15 0 0 1 30 0" fill="none" stroke="#2a1608" strokeWidth="1.2" />
              </pattern>
              <clipPath id="mk-clip">
                <path d={BODY} />
              </clipPath>
            </defs>

            {/* 바닥 그림자 */}
            <ellipse cx="200" cy="372" rx="118" ry="13" fill="#000" opacity="0.5" filter="url(#mk-blur-lg)" />

            {/* 몸통 */}
            <g className="moktak-body">
              <path d={BODY} fill="url(#mk-body)" stroke="#20110a" strokeWidth="2.5" />
              {/* 나뭇결 + 비늘 — 몸통 안에만 */}
              <g clipPath="url(#mk-clip)">
                <rect x="62" y="58" width="276" height="248" filter="url(#mk-grain)" style={{ mixBlendMode: "multiply" }} opacity="0.75" />
                <rect x="62" y="130" width="276" height="176" fill="url(#mk-scales)" opacity="0.22" />
                {/* 아래쪽을 어둡게 — 구의 밑면 */}
                <ellipse cx="200" cy="300" rx="150" ry="70" fill="#1a0d05" opacity="0.45" filter="url(#mk-blur-lg)" />
              </g>
              {/* 광택 — 왼쪽 위 */}
              <ellipse cx="148" cy="112" rx="64" ry="36" fill="url(#mk-sheen)" />
              {/* 가장자리 반사광 — 오른쪽 아래 */}
              <path d="M312 118 A 140 136 0 0 1 262 282" fill="none" stroke="#ffd59a" strokeWidth="5" strokeLinecap="round" opacity="0.16" />

              {/* 울림 틈 — 입 */}
              <path d="M78 232 Q 200 318 322 232 Q 200 262 78 232 Z" fill="#000" opacity="0.6" filter="url(#mk-blur-sm)" />
              <path d="M82 232 Q 200 312 318 232 Q 200 258 82 232 Z" fill="url(#mk-slit)" />
              <path d="M86 233 Q 200 256 314 233" fill="none" stroke="#f1c28a" strokeWidth="1.8" opacity="0.5" />
              <path d="M94 240 Q 200 302 306 240" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.6" />

              {/* 손잡이 밑 물고기 머리 조각 — 좌우 한 쌍 */}
              <g opacity="0.95">
                <path d="M150 294 C 150 280, 170 276, 182 288 L 182 304 C 168 310, 152 306, 150 294 Z" fill="#6c3e1c" stroke="#20110a" strokeWidth="1.5" />
                <circle cx="163" cy="291" r="4.2" fill="#140903" />
                <circle cx="164.5" cy="289.8" r="1.3" fill="#f1c28a" opacity="0.8" />
                <path d="M171 300 q 5 -3 9 1" fill="none" stroke="#20110a" strokeWidth="1.2" />
                <path d="M250 294 C 250 280, 230 276, 218 288 L 218 304 C 232 310, 248 306, 250 294 Z" fill="#6c3e1c" stroke="#20110a" strokeWidth="1.5" />
                <circle cx="237" cy="291" r="4.2" fill="#140903" />
                <circle cx="238.5" cy="289.8" r="1.3" fill="#f1c28a" opacity="0.8" />
                <path d="M229 300 q -5 -3 -9 1" fill="none" stroke="#20110a" strokeWidth="1.2" />
              </g>

              {/* 손잡이 */}
              <rect x="176" y="300" width="48" height="68" rx="20" fill="url(#mk-handle)" stroke="#20110a" strokeWidth="2.5" />
              <rect x="168" y="306" width="64" height="13" rx="6.5" fill="#4a2a12" stroke="#20110a" strokeWidth="1.5" />
              <path d="M187 326 V 356" stroke="#f1c28a" strokeWidth="4" strokeLinecap="round" opacity="0.22" />
            </g>

            {/* 채 — 터치하면 내려칩니다. 회전축은 끈 바로 아래(330,44) */}
            <g className="moktak-stick">
              <circle cx="330" cy="30" r="10" fill="none" stroke="#b07a42" strokeWidth="3" />
              <rect x="322" y="38" width="16" height="152" rx="8" fill="url(#mk-stick)" stroke="#20110a" strokeWidth="2" />
              <rect x="320" y="62" width="20" height="44" rx="5" fill="#4e2d14" opacity="0.85" />
              <path d="M324 66 h12 M324 76 h12 M324 86 h12 M324 96 h12" stroke="#2a1608" strokeWidth="1.2" opacity="0.7" />
              <circle cx="330" cy="200" r="21" fill="url(#mk-stick)" stroke="#20110a" strokeWidth="2" />
              <ellipse cx="322" cy="191" rx="7" ry="5" fill="#fff" opacity="0.28" />
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
