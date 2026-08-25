import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /result는 disallow하지 않음 — robots 차단 시 크롤러가 페이지의 noindex를
    // 읽지 못해 'robots에 의해 차단됨' 상태로 URL만 색인될 수 있음.
    // 크롤 허용 + meta noindex 조합이 '공유는 되지만 색인 안 됨'을 보장.
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
