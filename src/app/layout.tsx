import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BASE_URL, SITE_NAME } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NAVER_CODES = [
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION, // 퀴즈(sangsikwang)
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION_CALC, // 계산기(moducalc)
].filter((v): v is string => !!v);

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "상식왕 퀴즈 - 무료 상식 퀴즈 1,000제 & 생활 계산기 11종",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "경제·역사·과학 등 10개 카테고리 1,000문제 상식 퀴즈와 실시간 퀴즈 배틀, 그리고 연봉 실수령액·퇴직금·전기요금·환율·BMI 등 생활 계산기 11종을 무료로 이용하세요.",
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3640943750342373"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
