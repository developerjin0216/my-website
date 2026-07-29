// 생활 가이드(정보성 콘텐츠) 레지스트리 — 목록·sitemap·메타데이터의 단일 소스
// 본문은 각 src/app/guides/<id>/page.tsx 에 서버 렌더링 JSX로 작성합니다.

import type { Metadata } from "next";
import { CALC_URL, CALC_SITE_NAME } from "@/lib/site";

export interface GuideInfo {
  id: string;
  title: string; // H1 · 카드 제목
  metaTitle: string;
  description: string;
  icon: string;
  date: string; // 최초 발행일 (Article JSON-LD)
  keywords: string[];
  relatedCalcs: string[]; // 관련 계산기 id
}

export const guides: GuideInfo[] = [
  {
    id: "insurance-rates",
    title: "4대보험 요율 총정리",
    metaTitle: "2026 4대보험 요율 총정리 - 국민연금·건강보험·고용보험·산재보험",
    description:
      "국민연금 4.75%, 건강보험 3.595%, 장기요양, 고용보험 0.9%까지 — 내 월급에서 빠지는 2026년 4대보험 요율과 회사 부담분, 상한·하한 기준을 표로 정리했습니다.",
    icon: "📋",
    date: "2026-07-28",
    keywords: ["4대보험 요율", "국민연금 요율", "건강보험 요율", "고용보험 요율", "4대보험 계산"],
    relatedCalcs: ["salary", "severance"],
  },
  {
    id: "electricity-progressive",
    title: "전기요금 누진제 완전 해설",
    metaTitle: "전기요금 누진제 완전 해설 - 구간·단가·절약 방법",
    description:
      "주택용 전기요금 누진제 3단계 구간과 단가, 여름철 완화 구간, 슈퍼유저 요금까지 — 누진제 원리와 전기세 절약 방법을 알기 쉽게 정리했습니다.",
    icon: "💡",
    date: "2026-07-28",
    keywords: ["전기요금 누진제", "누진세 구간", "전기세 절약", "주택용 전기요금", "하계 누진구간"],
    relatedCalcs: ["electricity", "aircon"],
  },
  {
    id: "minimum-wage-2027",
    title: "2027년 최저임금 총정리",
    metaTitle: "2027 최저임금 10,700원 확정 - 월급·주휴수당·인상률 총정리",
    description:
      "2027년 최저임금 시급 10,700원(3.7% 인상) 확정 — 월급 환산 2,236,300원, 주휴수당 포함 실질 시급, 연도별 인상 추이, 수습 감액까지 한 번에 정리했습니다.",
    icon: "💵",
    date: "2026-07-29",
    keywords: ["2027 최저임금", "최저임금 10700", "2027 최저시급 월급", "최저임금 인상률", "주휴수당"],
    relatedCalcs: ["minimum-wage", "salary", "annual-leave"],
  },
  {
    id: "unemployment-benefits",
    title: "실업급여 신청 총정리",
    metaTitle: "실업급여 조건·신청 방법 총정리 - 2026 상한액 68,100원",
    description:
      "실업급여(구직급여) 받는 조건, 신청 절차, 지급액과 기간을 정리했습니다. 2026년 상한 68,100원 인상, 반복수급 감액 등 바뀐 제도까지 확인하세요.",
    icon: "🗂️",
    date: "2026-07-29",
    keywords: ["실업급여 조건", "실업급여 신청방법", "구직급여", "실업급여 상한액", "자발적 퇴사 실업급여"],
    relatedCalcs: ["unemployment", "severance", "annual-leave"],
  },
  {
    id: "pension-reform",
    title: "2026 연금개혁, 내 월급에서 얼마나 더 나가나",
    metaTitle: "2026 연금개혁 총정리 - 국민연금 보험료 인상 일정과 월급 영향",
    description:
      "국민연금 보험료율이 2026년부터 매년 0.5%p씩 올라 2033년 13%가 됩니다. 연도별 인상 일정, 내 월급 기준 추가 부담액, 소득대체율 43% 변화를 정리했습니다.",
    icon: "🏛️",
    date: "2026-07-29",
    keywords: ["연금개혁", "국민연금 보험료 인상", "국민연금 요율", "소득대체율 43", "국민연금 개혁 내용"],
    relatedCalcs: ["salary", "severance"],
  },
  {
    id: "severance",
    title: "퇴직금 지급 기준·계산·세금 총정리",
    metaTitle: "퇴직금 지급 기준 총정리 - 계산 방법·지급기한·퇴직소득세",
    description:
      "퇴직금 받을 수 있는 조건(1년·주15시간), 평균임금 계산법, 14일 지급기한과 지연이자, IRP 지급 의무, 퇴직소득세까지 한 번에 정리했습니다.",
    icon: "📑",
    date: "2026-07-28",
    keywords: ["퇴직금 지급기준", "퇴직금 계산방법", "퇴직금 지급기한", "퇴직소득세", "퇴직금 IRP"],
    relatedCalcs: ["severance", "annual-leave", "salary"],
  },
];

export function getGuide(id: string): GuideInfo {
  const guide = guides.find((g) => g.id === id);
  if (!guide) throw new Error(`Unknown guide: ${id}`);
  return guide;
}

// 가이드 페이지 공용 메타데이터 — canonical·OG 포함 (계산기 도메인 기준)
export function buildGuideMetadata(id: string): Metadata {
  const guide = getGuide(id);
  const url = `${CALC_URL}/guides/${id}`;
  return {
    title: { absolute: guide.metaTitle },
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url,
      siteName: CALC_SITE_NAME,
      locale: "ko_KR",
      type: "article",
      // 자식 세그먼트의 openGraph가 부모의 파일 기반 이미지를 대체하므로 명시 지정
      images: [
        {
          url: `${CALC_URL}/guides/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
