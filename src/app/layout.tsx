import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { BASE_URL, ROOT_SITE_NAME } from "@/lib/site";
import { CALC_COUNT } from "@/data/calculators";
import { siteJsonLd } from "@/lib/trust";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NAVER_CODES = [
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION, // 루트(8282114.xyz)
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_CALC, // 계산기(calc.8282114.xyz)
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_QUIZ, // 퀴즈(quiz.8282114.xyz)
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_TOOLS, // 도구(tools.8282114.xyz)
].filter((v): v is string => !!v);

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "8282114 - 급할 때 바로 찾는 생활 긴급 안내",
    // 사이트 이름은 8282114 하나입니다(2026-11-18 브랜드 통일). 섹션 이름을 따로 두지 않으므로
    // 제목 접미사와 og:site_name 이 서로 다른 사이트를 자칭하는 일이 없습니다.
    template: `%s | ${ROOT_SITE_NAME}`,
  },
  description:
    `긴급 전화번호, 카드·휴대폰 분실 대처, 보이스피싱 대응, 야간 병원 찾기, 병원비·임금체불 — 급할 때 필요한 대처법과 실업급여·퇴직금 등 생활 계산기 ${CALC_COUNT}종.`,
  manifest: "/site.webmanifest",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    siteName: ROOT_SITE_NAME,
    locale: "ko_KR",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  // Search Console·네이버 서치어드바이저 소유 확인 — Vercel env에 코드만 넣으면 됨
  // 네이버는 사이트(도메인)마다 코드가 달라서 퀴즈/계산기 코드를 모두 렌더링
  // (각 확인 절차는 자기 코드만 찾으므로 두 태그가 함께 있어도 무방)
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
    ...(NAVER_CODES.length > 0 && {
      other: { "naver-site-verification": NAVER_CODES },
    }),
  },
  // 애드센스 계정 소유권 확인 (head 스크립트·ads.txt와 함께 3중 확인 수단)
  other: {
    "google-adsense-account": "ca-pub-3640943750342373",
  },
};

// 확대 금지(maximumScale/userScalable)를 뺐습니다 — WCAG 1.4.4 위반이고,
// 작은 글씨를 읽어야 하는 안내 사이트에서 확대를 막을 이유가 없습니다.
// 애드센스 심사도 접근성 문제를 감점 요소로 봅니다.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        {/* 발행 주체·사이트 정보 — 전 페이지 공통.
            개별 페이지의 Article·WebApplication 스키마가 publisher를 @id로
            참조하므로, 사이트 전체가 하나의 발행 주체로 묶입니다. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3640943750342373"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
      {/* GA4 — hydration 후 로드 (성능 영향 최소) */}
      <GoogleAnalytics gaId="G-GSBLNMJLNC" />
    </html>
  );
}
