import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/result"], // 쿼리 파라미터·sessionStorage 의존 페이지 — 단독 색인 가치 없음
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
