// 급할때 생활안내(/help) 레지스트리 — 목록·sitemap·메타데이터의 단일 소스
// 본문은 각 src/app/help/<id>/page.tsx 에 서버 렌더링 JSX로 작성합니다.

import type { Metadata } from "next";
import { ROOT_URL, INFO_SITE_NAME } from "@/lib/site";

export interface HelpInfo {
  id: string;
  title: string; // H1 · 카드 제목
  metaTitle: string;
  description: string;
  icon: string;
  date: string;
  keywords: string[];
  related: string[]; // 관련 help id
}

export const helpTopics: HelpInfo[] = [
  {
    id: "emergency-numbers",
    title: "긴급 전화번호 총정리",
    metaTitle: "긴급 전화번호 총정리 - 112·119부터 상황별 신고·상담 번호까지",
    description:
      "경찰 112, 소방·구급 119는 물론 실종신고 182, 보이스피싱 1332, 자살예방 109까지 — 급할 때 바로 찾는 상황별 긴급 전화번호를 한 페이지에 정리했습니다.",
    icon: "📞",
    date: "2026-08-10",
    keywords: ["긴급 전화번호", "신고 전화번호", "112 119", "상담 전화번호", "정부 민원 전화"],
    related: ["voice-phishing", "night-hospital", "utility-outage"],
  },
  {
    id: "lost-card",
    title: "카드·지갑 분실했을 때",
    metaTitle: "카드 분실 신고 방법 - 일괄신고·부정사용 보상·신분증 재발급",
    description:
      "카드를 잃어버렸을 때 해야 할 일 순서대로 — 카드사 일괄 분실신고, 부정사용 보상 기준, 신분증·운전면허증 재발급 방법까지 정리했습니다.",
    icon: "💳",
    date: "2026-08-10",
    keywords: ["카드 분실 신고", "카드 일괄신고", "지갑 분실", "신분증 재발급", "카드 부정사용 보상"],
    related: ["voice-phishing", "lost-phone", "emergency-numbers"],
  },
  {
    id: "lost-phone",
    title: "휴대폰 분실했을 때",
    metaTitle: "휴대폰 분실 대처법 - 위치찾기·회선정지·명의도용 차단",
    description:
      "휴대폰을 잃어버렸을 때 순서대로 — 원격 위치찾기·잠금, 통신사 분실신고, 명의도용 차단(엠세이퍼), 유실물 조회(로스트112)까지 정리했습니다.",
    icon: "📱",
    date: "2026-08-10",
    keywords: ["휴대폰 분실", "폰 분실 신고", "휴대폰 위치찾기", "엠세이퍼", "lost112"],
    related: ["lost-card", "voice-phishing", "emergency-numbers"],
  },
  {
    id: "night-hospital",
    title: "야간·휴일에 아플 때 (병원·약국 찾기)",
    metaTitle: "야간·휴일 병원 약국 찾는 법 - 응급의료포털·달빛어린이병원",
    description:
      "밤이나 주말에 갑자기 아플 때 — 지금 문 연 병원·당번 약국 찾는 법(응급의료포털 E-Gen), 달빛어린이병원, 119 상담 활용법을 정리했습니다.",
    icon: "🏥",
    date: "2026-08-10",
    keywords: ["야간 병원", "휴일 약국", "당번 약국", "응급의료포털", "달빛어린이병원"],
    related: ["medical-cost", "emergency-numbers", "utility-outage"],
  },
  {
    id: "medical-cost",
    title: "병원비가 없을 때 (의료비 지원제도)",
    metaTitle: "병원비 없을 때 지원받는 법 - 응급실 대지급·긴급복지 129·재난적의료비",
    description:
      "응급실 갈 돈이 없어도 진료받을 수 있습니다 — 응급의료비 대지급제도(원무과 신청), 긴급복지 의료지원(129, 300만원), 재난적의료비 지원(최대 3천만원)까지 상황별로 정리했습니다.",
    icon: "💊",
    date: "2026-08-10",
    keywords: ["병원비 지원", "응급의료비 대지급", "긴급복지 의료지원", "재난적의료비", "129 의료비"],
    related: ["night-hospital", "emergency-numbers", "voice-phishing"],
  },
  {
    id: "voice-phishing",
    title: "보이스피싱 당했을 때",
    metaTitle: "보이스피싱 대처법 - 지급정지 신청·112 신고·피해금 환급",
    description:
      "돈을 이체했거나 개인정보를 알려줬다면 1분이 아깝습니다 — 즉시 지급정지(112·은행), 금감원 1332, 개인정보 노출 등록, 피해금 환급 절차까지 순서대로 정리했습니다.",
    icon: "🚨",
    date: "2026-08-10",
    keywords: ["보이스피싱 신고", "지급정지 신청", "보이스피싱 대처", "1332", "피싱 피해 환급"],
    related: ["lost-card", "lost-phone", "emergency-numbers"],
  },
  {
    id: "utility-outage",
    title: "정전·단수·가스 문제 생겼을 때",
    metaTitle: "정전·단수·가스 고장 신고 - 한전 123·수도사업소·가스안전공사",
    description:
      "갑자기 전기가 나갔거나 물이 안 나올 때, 가스 냄새가 날 때 — 어디에 신고하고 무엇부터 확인해야 하는지 상황별로 정리했습니다.",
    icon: "🔌",
    date: "2026-08-10",
    keywords: ["정전 신고", "한전 123", "단수 신고", "가스 냄새 신고", "도시가스 고장"],
    related: ["emergency-numbers", "night-hospital"],
  },
];

export function getHelp(id: string): HelpInfo {
  const topic = helpTopics.find((h) => h.id === id);
  if (!topic) throw new Error(`Unknown help topic: ${id}`);
  return topic;
}

// help 페이지 공용 메타데이터 — canonical·OG (루트 도메인 기준)
export function buildHelpMetadata(id: string): Metadata {
  const topic = getHelp(id);
  const url = `${ROOT_URL}/help/${id}`;
  return {
    title: { absolute: topic.metaTitle },
    description: topic.description,
    keywords: topic.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: topic.metaTitle,
      description: topic.description,
      url,
      siteName: INFO_SITE_NAME,
      locale: "ko_KR",
      type: "article",
    },
  };
}
