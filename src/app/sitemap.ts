import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { QUIZ_URL, CALC_URL } from "@/lib/site";

// 사이트맵에는 캐노니컬 URL만 등재합니다.
// 도메인 분리 시 계산기 URL은 CALC_URL 기준으로 생성됩니다 — 두 도메인 모두
// Search Console에 등록(소유 확인)하면 교차 도메인 사이트맵이 허용됩니다.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: QUIZ_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${QUIZ_URL}/quiz`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${QUIZ_URL}/battle`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${CALC_URL}/calculators`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...calculators.map((calc) => ({
      url: `${CALC_URL}/calculators/${calc.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${QUIZ_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${QUIZ_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${QUIZ_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${QUIZ_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
