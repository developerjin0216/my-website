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

type Tone = "ref" | "deep";

// 음색 — [주파수, 세기, 감쇠 초]. 울림은 사인파, 타격은 노이즈.
//
// ref(기본): 참고 샘플(woodenfish.online/sound.mp3, 0.363s)을 2026-11-05 에 실측해 맞춘 값.
//   측정: 기음은 낮지 않고 600~655Hz 에 가까운 모드가 여럿 겹쳐 있음(655·637·596·567·548Hz),
//   1,150Hz 와 737Hz 가 -25dB, 460Hz 가 -30dB. 에너지 90% 가 400~1,500Hz, 1.5kHz 위는 6%뿐.
//   감쇠는 -20dB 33ms·-40dB 49ms 로 매우 짧은 "톡"이고, 150ms 뒤에도 633Hz 여운이 -40dB
//   아래로 남음. 어택 6ms. → 가까운 사인파 다섯을 겹쳐 두툼하게, 고역은 2.5kHz 에서 자르고,
//   포락선을 "짧은 타격 + 긴 꼬리" 두 단계로.
//   첫 판이 가볍게 들린 이유가 여기서 보입니다 — 1.8kHz 노이즈 클릭과 2.3kHz 배음이 원인.
// deep: 기음을 330Hz 로 내리고 165Hz 를 깐 무거운 음색. 참고와는 다르지만 선택지로 남깁니다.
interface ToneSpec {
  /** [Hz, 세기, 꼬리 길이 s] */
  partials: [number, number, number][];
  /** 타격 세기가 1/10 로 떨어지는 시각(s) — 참고 샘플은 0.033 */
  hit: number;
  /** 치고 난 뒤 음이 내려가는 비율 */
  drift: number;
  knock: [number, number, number];
  knockLen: number;
  edge: [number, number, number];
  lowpass: number;
  gain: number;
}

const TONES: Record<Tone, ToneSpec> = {
  ref: {
    partials: [
      [655, 1.0, 0.28],
      [637, 0.75, 0.24],
      [596, 0.7, 0.26],
      [567, 0.3, 0.16],
      [548, 0.2, 0.14],
      [460, 0.08, 0.05],
      [737, 0.07, 0.06],
      [1150, 0.06, 0.04],
    ],
    hit: 0.035,
    drift: 0.97,
    knock: [720, 1.6, 0.55],
    knockLen: 0.02,
    edge: [1300, 1, 0.07],
    lowpass: 2500,
    gain: 1.1,
  },
  deep: {
    partials: [
      [165, 0.55, 0.09],
      [330, 1.0, 0.3],
      [495, 0.55, 0.22],
      [820, 0.3, 0.12],
      [1650, 0.1, 0.05],
    ],
    hit: 0.12,
    drift: 0.92,
    knock: [520, 5, 0.9],
    knockLen: 0.035,
    edge: [1400, 1, 0.22],
    lowpass: 3800,
    gain: 1,
  },
};

function noiseBurst(ctx: AudioContext, t: number, seconds: number, [freq, q, gain]: [number, number, number], out: AudioNode) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.01);
  src.connect(bp).connect(g).connect(out);
  src.start(t);
}

function strike(ctx: AudioContext, volume: number, tone: Tone) {
  const p = TONES[tone];
  const t = ctx.currentTime;

  // 마스터 — 고역을 깎아 쇳소리를 빼고, 리미터 역할의 컴프레서로 클리핑을 막습니다
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = p.lowpass;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12;
  comp.ratio.value = 6;
  comp.attack.value = 0.001;
  comp.release.value = 0.12;
  const out = ctx.createGain();
  out.gain.value = volume * p.gain;
  lp.connect(comp).connect(out).connect(ctx.destination);

  const detune = 1 + (Math.random() - 0.5) * 0.03;
  for (const [f, g, d] of p.partials) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f * detune, t);
    o.frequency.exponentialRampToValueAtTime(f * detune * p.drift, t + d);
    const env = ctx.createGain();
    // 두 단계 포락선 — 어택 6ms → 타격(hit 시각에 1/10) → 긴 꼬리(-40dB 아래로 d 초까지)
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(g, t + 0.006);
    env.gain.exponentialRampToValueAtTime(g * 0.1, t + p.hit);
    env.gain.exponentialRampToValueAtTime(g * 0.012, t + p.hit * 2);
    env.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(env).connect(lp);
    o.start(t);
    o.stop(t + d + 0.03);
  }

  // 타격 — 나무가 울리는 "툭"(knock)과 채가 닿는 순간의 아주 짧은 "딱"(edge)
  noiseBurst(ctx, t, p.knockLen, p.knock, lp);
  noiseBurst(ctx, t, 0.005, p.edge, lp);
}

// 몸통 외곽선 — 위가 둥글고 아래가 살짝 눌린 구. clipPath 와 본체가 같은 경로를 씁니다.
const BODY =
  "M200 58 C 284 58, 338 118, 338 190 C 338 258, 288 306, 200 306 C 112 306, 62 258, 62 190 C 62 118, 116 58, 200 58 Z";

export default function MoktakClient() {
  const ctxRef = useRef<AudioContext | null>(null);
  // 모션은 CSS 가 아니라 SVG 자체 애니메이션(SMIL)으로 — SVG <g> 에 건 CSS transform 은
  // 브라우저(특히 사파리)에 따라 먹지 않습니다. beginElement() 로 매번 처음부터 재생합니다.
  const stickAnim = useRef<SVGAnimateTransformElement>(null);
  const bodyAnim = useRef<SVGAnimateTransformElement>(null);
  const [count, setCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const [tone, setTone] = useState<Tone>("ref");

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
        strike(ctx, 1, tone);
      } catch {
        /* Web Audio 미지원 — 소리 없이 동작만 */
      }
    }
    // 채가 먼저 내려치고(0.24s), 몸통은 채가 닿는 시점(≈70ms)부터 흔들립니다
    try {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        stickAnim.current?.beginElement();
        bodyAnim.current?.beginElementAt(0.07);
      }
    } catch {
      /* SMIL 미지원 — 소리와 카운트만 */
    }
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
  }, [muted, tone]);

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
        className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#c9a15a]/35 active:brightness-110 touch-manipulation"
      >
        <div>
          <svg
            viewBox="0 0 400 400"
            width="320"
            height="320"
            className="w-[min(84vw,320px)] h-auto"
            aria-hidden="true"
          >
            <defs>
              {/* 은은한 조명 — 배경 가운데만 아주 조금 밝게 */}
              <radialGradient id="mk-spot" cx="50%" cy="48%" r="50%">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.07" />
                <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.02" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              {/* 몸통 — 옻칠한 호두나무. 검정 테두리 없이 그라데이션만으로 윤곽을 만듭니다 */}
              <radialGradient id="mk-body" cx="34%" cy="28%" r="80%">
                <stop offset="0" stopColor="#b8804f" />
                <stop offset="0.22" stopColor="#8e5a31" />
                <stop offset="0.5" stopColor="#5c361a" />
                <stop offset="0.78" stopColor="#33200e" />
                <stop offset="1" stopColor="#170c05" />
              </radialGradient>
              <radialGradient id="mk-sheen" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.26" />
                <stop offset="0.55" stopColor="#fff" stopOpacity="0.06" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="mk-spec" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mk-handle" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#7a4a26" />
                <stop offset="0.5" stopColor="#4a2a12" />
                <stop offset="1" stopColor="#231207" />
              </linearGradient>
              <linearGradient id="mk-stick" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#4a2c16" />
                <stop offset="0.5" stopColor="#2a170a" />
                <stop offset="1" stopColor="#160b04" />
              </linearGradient>
              <linearGradient id="mk-brass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e2c27a" />
                <stop offset="0.5" stopColor="#a8823c" />
                <stop offset="1" stopColor="#6e5222" />
              </linearGradient>
              {/* 방석 — 짙은 자주색 비단 */}
              <radialGradient id="mk-cushion" cx="50%" cy="20%" r="80%">
                <stop offset="0" stopColor="#6a2a3a" />
                <stop offset="0.6" stopColor="#3e1522" />
                <stop offset="1" stopColor="#240a12" />
              </radialGradient>
              {/* 나뭇결 — 아주 희미하게 */}
              <filter id="mk-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.01 0.5" numOctaves="2" seed="5" result="n" />
                <feColorMatrix in="n" type="saturate" values="0" result="g" />
                <feComponentTransfer in="g">
                  <feFuncA type="table" tableValues="0 0.1" />
                </feComponentTransfer>
              </filter>
              <filter id="mk-blur-lg" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <filter id="mk-blur-md" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="mk-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
              <clipPath id="mk-clip">
                <path d={BODY} />
              </clipPath>
            </defs>

            {/* 조명 */}
            <circle cx="200" cy="196" r="196" fill="url(#mk-spot)" />

            {/* 방석 — 두께, 윗면, 금실 테두리 */}
            <ellipse cx="200" cy="352" rx="140" ry="16" fill="#000" opacity="0.55" filter="url(#mk-blur-lg)" />
            <ellipse cx="200" cy="330" rx="148" ry="26" fill="#1c0810" />
            <ellipse cx="200" cy="320" rx="148" ry="26" fill="url(#mk-cushion)" />
            <ellipse cx="200" cy="320" rx="138" ry="20" fill="none" stroke="#c9a15a" strokeWidth="1" opacity="0.35" />
            <ellipse cx="200" cy="312" rx="90" ry="9" fill="#fff" opacity="0.05" />

            {/* 몸통 — 맞으면 중심을 축으로 좌우로 흔들립니다 */}
            <g>
              <animateTransform
                ref={bodyAnim}
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                values="0 200 200; 2.6 200 200; -2 200 200; 1 200 200; -0.4 200 200; 0 200 200"
                keyTimes="0; 0.2; 0.45; 0.7; 0.88; 1"
                dur="0.36s"
                begin="indefinite"
                fill="remove"
              />
              {/* 몸통이 방석에 드리우는 그림자 */}
              <ellipse cx="206" cy="304" rx="120" ry="22" fill="#000" opacity="0.5" filter="url(#mk-blur-md)" />
              <path d={BODY} fill="url(#mk-body)" />
              <g clipPath="url(#mk-clip)">
                <rect x="62" y="58" width="276" height="248" filter="url(#mk-grain)" style={{ mixBlendMode: "multiply" }} opacity="0.7" />
                {/* 아래쪽을 어둡게 — 구의 밑면 */}
                <ellipse cx="200" cy="312" rx="160" ry="74" fill="#0d0603" opacity="0.5" filter="url(#mk-blur-lg)" />
                {/* 가장자리 안쪽을 살짝 어둡게 — 테두리 선 대신 */}
                <path d={BODY} fill="none" stroke="#0d0603" strokeWidth="10" opacity="0.35" filter="url(#mk-blur-md)" />
              </g>
              {/* 옻칠 광택 — 넓은 시인 하나, 작은 반사점 하나 */}
              <ellipse cx="150" cy="114" rx="62" ry="34" fill="url(#mk-sheen)" />
              <ellipse cx="134" cy="100" rx="16" ry="9" fill="url(#mk-spec)" />
              {/* 반대편 가장자리에 아주 희미한 반사 */}
              <path d="M316 126 A 138 136 0 0 1 270 280" fill="none" stroke="#e8c08a" strokeWidth="3" strokeLinecap="round" opacity="0.07" />

              {/* 울림 틈 — 가늘고 깊게 */}
              <path d="M98 238 Q 200 290 302 238 Q 200 256 98 238 Z" fill="#000" opacity="0.5" filter="url(#mk-blur-sm)" />
              <path d="M100 238 Q 200 286 300 238 Q 200 254 100 238 Z" fill="#070301" />
              <path d="M104 238.5 Q 200 251 296 238.5" fill="none" stroke="#d9a56a" strokeWidth="1" opacity="0.28" />

              {/* 손잡이 — 앞쪽 아래로 비스듬히. 밑동에 희미한 조각선과 고리 */}
              <g transform="rotate(26 200 296)">
                <ellipse cx="200" cy="300" rx="30" ry="9" fill="#1a0d05" opacity="0.9" />
                <path d="M172 290 q 28 -12 56 0" fill="none" stroke="#e8c08a" strokeWidth="1" opacity="0.14" />
                <rect x="183" y="298" width="34" height="62" rx="17" fill="url(#mk-handle)" />
                <rect x="179" y="302" width="42" height="9" rx="4.5" fill="#2a160a" />
                <path d="M191 318 V 348" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.1" />
              </g>
            </g>

            {/* 채 — 옻칠 막대, 황동 고리 하나. 끈 바로 아래(330,44)를 축으로 크게 휘둘러 내려칩니다 */}
            <g transform="rotate(-26 330 44)">
              <animateTransform
                ref={stickAnim}
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                values="-26 330 44; -34 330 44; 12 330 44; -26 330 44"
                keyTimes="0; 0.18; 0.42; 1"
                calcMode="spline"
                keySplines="0.4 0 0.8 0.6; 0.1 0.9 0.2 1; 0.3 0 0.5 1"
                dur="0.3s"
                begin="indefinite"
                fill="remove"
              />
              <circle cx="330" cy="32" r="8" fill="none" stroke="#c9a15a" strokeWidth="1.8" opacity="0.6" />
              <rect x="324" y="40" width="12" height="150" rx="6" fill="url(#mk-stick)" />
              <path d="M327.5 48 V 178" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.13" />
              <rect x="321" y="166" width="18" height="9" rx="3" fill="url(#mk-brass)" />
              <circle cx="330" cy="199" r="18" fill="url(#mk-body)" />
              <ellipse cx="324" cy="190" rx="6" ry="4" fill="url(#mk-spec)" />
            </g>
          </svg>
        </div>
      </button>

      <div className="text-center">
        <p className="text-3xl font-semibold text-[#e8dcc4] tabular-nums leading-none tracking-tight">
          {count.toLocaleString("ko-KR")}
        </p>
        <p className="text-[11px] text-[#8a8fa8] mt-2">번 · 이 기기에만 저장됩니다</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="rounded-full px-4 py-2 text-xs font-medium border border-[#3a3f5a] bg-transparent text-[#b8bdd0] hover:border-[#c9a15a] hover:text-[#e8dcc4] transition-colors"
        >
          {muted ? "🔇 소리 꺼짐" : "🔊 소리 켜짐"}
        </button>
        <button
          type="button"
          onClick={() => setTone((v) => (v === "ref" ? "deep" : "ref"))}
          className="rounded-full px-4 py-2 text-xs font-medium border border-[#3a3f5a] bg-transparent text-[#b8bdd0] hover:border-[#c9a15a] hover:text-[#e8dcc4] transition-colors"
          aria-label="음색 바꾸기"
        >
          {tone === "ref" ? "음색: 원음" : "음색: 묵직"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full px-4 py-2 text-xs font-medium border border-[#3a3f5a] bg-transparent text-[#8a8fa8] hover:border-[#c9a15a] hover:text-[#e8dcc4] transition-colors"
        >
          처음부터
        </button>
      </div>
    </div>
  );
}
