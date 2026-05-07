import type { MetadataRoute } from "next";
import { categories } from "@/data/quizData";

const BASE_URL = "https://my-website-nine-fawn-47.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/quiz?mode=category&category=${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/quiz?mode=daily`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/battle`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...categoryPages,
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
