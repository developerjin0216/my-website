import type { Metadata } from "next";
import TestClient from "./TestClient";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "MBTI 무료 간이 테스트 - 20문항 3분 완성",
  description:
    "회원가입 없이 3분이면 끝나는 MBTI 간이 테스트. 20개 질문에 답하면 16가지 유형 중 내 성격유형과 특징·궁합·직업까지 바로 확인할 수 있습니다.",
  alternates: { canonical: `${QUIZ_URL}/mbti/test` },
  openGraph: {
    title: "MBTI 무료 간이 테스트 - 20문항 3분 완성",
    description: "회원가입 없이 3분 완성, 내 유형과 특징·궁합까지 바로 확인",
    url: `${QUIZ_URL}/mbti/test`,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      { url: `${QUIZ_URL}/quiz-home/opengraph-image`, width: 1200, height: 630 },
    ],
  },
};

export default function MbtiTestPage() {
  return <TestClient />;
}
