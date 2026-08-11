import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OG 카드 라우트(Node 런타임)가 런타임에 읽는 폰트를 서버리스 번들에 포함
  // (미지정 시 Vercel 함수에 파일이 누락되어 readFile이 ENOENT → 500)
  outputFileTracingIncludes: {
    "/api/og/result": ["./src/assets/fonts/*"],
  },
};

export default nextConfig;
