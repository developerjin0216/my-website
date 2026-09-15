import type { ReactElement } from "react";

// 예시 상품 카드의 썸네일 — 인라인 SVG로 직접 그립니다.
//
// 실제 상품 사진을 가져다 쓰면 저작권 문제가 생기고, 외부 이미지를 핫링크하면
// 연동 전 화면이 깨집니다. 도형만으로 품목을 알아볼 수 있게 그려두면 심사용
// 화면으로도 충분하고, 실제 연동이 켜지면 이 컴포넌트는 쓰이지 않습니다.

export type ThumbKind =
  | "earbuds"
  | "tumbler"
  | "blanket"
  | "filter"
  | "charger"
  | "coffee";

const BG = "#1b2540";
const LINE = "#6b84b8";
const FILL = "#33456d";
const HI = "#8fa8d8";

function Box({ children }: { children: ReactElement }) {
  return (
    <svg viewBox="0 0 120 120" role="img" className="w-full h-auto bg-[#131c33]">
      <rect width="120" height="120" fill={BG} />
      {children}
    </svg>
  );
}

const SHAPES: Record<ThumbKind, ReactElement> = {
  earbuds: (
    <g stroke={LINE} strokeWidth="2.4" fill={FILL}>
      <path d="M40 44 a11 11 0 1 1 0 22 a11 11 0 1 1 0 -22" />
      <path d="M40 60 q2 18 -4 26" fill="none" strokeLinecap="round" />
      <path d="M80 44 a11 11 0 1 1 0 22 a11 11 0 1 1 0 -22" />
      <path d="M80 60 q2 18 -4 26" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="55" r="3.4" fill={HI} stroke="none" />
      <circle cx="80" cy="55" r="3.4" fill={HI} stroke="none" />
    </g>
  ),
  tumbler: (
    <g stroke={LINE} strokeWidth="2.4" fill={FILL}>
      <path d="M44 30 h32 l-4 62 h-24 z" />
      <rect x="42" y="22" width="36" height="10" rx="3" fill={HI} />
      <line x1="48" y1="52" x2="72" y2="52" strokeWidth="1.6" />
      <line x1="49" y1="66" x2="71" y2="66" strokeWidth="1.6" />
    </g>
  ),
  blanket: (
    <g stroke={LINE} strokeWidth="2.4" fill={FILL}>
      <path d="M26 44 q14 -12 30 0 q14 12 28 0 v40 q-14 12 -28 0 q-16 -12 -30 0 z" />
      <path d="M26 60 q14 -12 30 0 q14 12 28 0" fill="none" strokeWidth="1.6" />
      <path d="M26 72 q14 -12 30 0 q14 12 28 0" fill="none" strokeWidth="1.6" />
    </g>
  ),
  filter: (
    <g stroke={LINE} strokeWidth="2.4" fill={FILL}>
      <rect x="32" y="28" width="56" height="64" rx="5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={40 + i * 10} y1="36" x2={40 + i * 10} y2="84" strokeWidth="1.6" />
      ))}
      <rect x="32" y="28" width="56" height="10" fill={HI} stroke="none" />
    </g>
  ),
  charger: (
    <g stroke={LINE} strokeWidth="2.4" fill={FILL}>
      <rect x="38" y="24" width="44" height="66" rx="6" />
      <rect x="44" y="32" width="32" height="44" rx="3" fill={HI} stroke="none" opacity="0.5" />
      <path d="M62 40 l-8 16 h7 l-3 12 l10 -18 h-7 z" fill={HI} stroke="none" />
      <path d="M32 92 h56" strokeLinecap="round" />
    </g>
  ),
  coffee: (
    <g stroke={LINE} strokeWidth="2.4" fill={FILL}>
      <path d="M32 26 h56 v30 h-56 z" />
      <path d="M40 56 h40 v34 h-40 z" />
      <rect x="52" y="64" width="16" height="18" rx="2" fill={HI} stroke="none" />
      <line x1="60" y1="56" x2="60" y2="64" strokeWidth="1.8" />
      <circle cx="78" cy="38" r="4" fill={HI} stroke="none" />
    </g>
  ),
};

export default function SampleThumb({ kind }: { kind: ThumbKind }): ReactElement {
  return <Box>{SHAPES[kind]}</Box>;
}
