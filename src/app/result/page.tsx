import type { Metadata } from "next";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import ResultClient from "./ResultClient";

// 서버 래퍼 — 공유된 결과 URL(쿼리 포함)이 카톡·SNS에서 점수 OG 카드로
// 펼쳐지도록 generateMetadata에서 동적 이미지를 지정합니다.
// 결과 페이지 자체는 검색 색인 대상이 아니므로 noindex.

type SP = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined, fallback: string): string {
  return (Array.isArray(v) ? v[0] : v) ?? fallback;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  const score = first(sp.score, "0");
  const correct = first(sp.correct, "0");
  const total = first(sp.total, "10");
  const mode = first(sp.mode, "daily");
  const category = first(sp.category, "general");

  const maxScore = Number(total) * 10 || 100;
  const percent = Math.round((Number(score) / maxScore) * 100);

  const og = new URLSearchParams({ score, correct, total, mode, category });
  const title = `퀴즈 결과 ${percent}점 - ${SITE_NAME}`;
  const description = `${correct}/${total} 정답, ${percent}점! 상식왕 퀴즈에서 당신의 상식을 시험해보세요 — 11개 카테고리 1,100여 문제 무료.`;

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: QUIZ_URL },
    openGraph: {
      title,
      description,
      url: `${QUIZ_URL}/result`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${QUIZ_URL}/api/og/result?${og.toString()}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function ResultPage() {
  return <ResultClient />;
}
