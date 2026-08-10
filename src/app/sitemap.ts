import type { MetadataRoute } from "next";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { categories } from "@/data/quizData";
import { bankPath, getBankPageCount } from "@/lib/quizBank";
import { helpTopics } from "@/data/help";
import { ROOT_URL, QUIZ_URL, CALC_URL } from "@/lib/site";

// 사이트맵에는 캐노니컬 URL만 등재합니다.
// 도메인 분리 시 계산기 URL은 CALC_URL 기준으로 생성됩니다 — 두 도메인 모두
// Search Console에 등록(소유 확인)하면 교차 도메인 사이트맵이 허용됩니다.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // 루트 — 급할때 생활안내
    {
      url: ROOT_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...helpTopics.map((topic) => ({
      url: `${ROOT_URL}/help/${topic.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // 퀴즈 (quiz 서브도메인)
    {
      url: QUIZ_URL,
      changeFrequency: "daily",
      priority: 0.9,
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
    // 카테고리별 SSR 랜딩 (경로 기반 — 캐노니컬 URL)
    ...categories.map((cat) => ({
      url: `${QUIZ_URL}/quiz/${cat.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // 퀴즈 문제은행 — 허브 + 카테고리별 페이지네이션 (문제·정답·해설 SSR)
    {
      url: `${QUIZ_URL}/quiz-bank`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categories.flatMap((cat) =>
      Array.from({ length: getBankPageCount(cat.id) }, (_, i) => ({
        url: `${QUIZ_URL}${bankPath(cat.id, i + 1)}`,
        changeFrequency: "monthly" as const,
        priority: i === 0 ? 0.7 : 0.6,
      }))
    ),
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
      url: `${CALC_URL}/guides`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...guides.map((guide) => ({
      url: `${CALC_URL}/guides/${guide.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
