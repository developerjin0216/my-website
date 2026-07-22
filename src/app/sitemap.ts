import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { BASE_URL } from "@/lib/site";

// 사이트맵에는 캐노니컬 URL만 등재합니다.
// 쿼리 파라미터 URL(/quiz?mode=...&category=...)은 '&' XML 이스케이프 문제와
// 중복 메타데이터 문제로 제외 — 카테고리 퀴즈는 /quiz 캐노니컬로 통합.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/quiz`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/battle`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/calculators`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...calculators.map((calc) => ({
      url: `${BASE_URL}/calculators/${calc.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
