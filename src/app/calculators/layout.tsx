import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "생활 계산기 모음",
  description:
    "연봉 실수령액, 퇴직금, 연차, 대출 이자, 청년 버팀목 전세대출, 복비, 전기요금, 에어컨 전기료, 환율, BMI, 칼로리까지 일상에 필요한 무료 계산기 11종을 한 곳에서 이용하세요.",
  keywords: [
    "계산기 모음",
    "실수령액 계산기",
    "퇴직금 계산기",
    "전기요금 계산기",
    "환율 계산기",
    "BMI 계산기",
  ],
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: "생활 계산기 모음",
    description:
      "연봉 실수령액·퇴직금·전기요금·환율·BMI 등 무료 생활 계산기 11종",
    url: "/calculators",
    siteName: "상식왕 퀴즈",
    locale: "ko_KR",
    type: "website",
  },
};

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
