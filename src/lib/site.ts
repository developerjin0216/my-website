// 사이트 공용 상수 — sitemap, robots, 메타데이터, JSON-LD, 프록시(도메인 분리)에서 공유
//
// ── 도메인 분리 ──
// Vercel 프로젝트에 퀴즈/계산기 도메인 두 개를 연결하고 아래 env를 설정하면
// src/proxy.ts가 접속 도메인을 보고 섹션을 분리합니다.
//   NEXT_PUBLIC_QUIZ_URL=https://퀴즈도메인
//   NEXT_PUBLIC_CALC_URL=https://계산기도메인
// env가 없으면 지금처럼 단일 도메인으로 동작합니다 (분리 비활성).
// env 변경 후에는 재배포해야 반영됩니다 (빌드 타임 상수).

const DEFAULT_URL = "https://my-website-nine-fawn-47.vercel.app";

export const QUIZ_URL = process.env.NEXT_PUBLIC_QUIZ_URL || DEFAULT_URL;
export const CALC_URL = process.env.NEXT_PUBLIC_CALC_URL || QUIZ_URL;

// 도메인 분리 활성 여부 (빌드 타임에 결정)
export const SPLIT = CALC_URL !== QUIZ_URL;

export const SITE_NAME = "상식왕 퀴즈";
// 계산기 사이트 브랜드 — 도메인 확정 시 이름만 바꾸면 OG·JSON-LD·푸터에 일괄 반영
export const CALC_SITE_NAME = SPLIT ? "생활계산기" : SITE_NAME;

export const CONTACT_EMAIL = "developerjin0216@gmail.com";

// 기존 코드 호환용 (퀴즈 섹션이 루트 사이트)
export const BASE_URL = QUIZ_URL;
