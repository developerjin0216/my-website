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
    related: ["car-accident", "missing-person", "voice-phishing"],
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
    related: ["medical-cost", "outdoor-injury", "emergency-numbers"],
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
    related: ["secondhand-scam", "lost-card", "lost-phone"],
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
    related: ["locked-out", "emergency-numbers", "night-hospital"],
  },
  {
    id: "locked-out",
    title: "문 잠겼을 때 (도어락·열쇠)",
    metaTitle: "문 잠겼을 때 여는 법 - 도어락 건전지 방전·열쇠 출장비·바가지 방지",
    description:
      "방문은 공구 없이 열 수 있고, 도어락 방전은 9V 건전지면 됩니다 — 스스로 여는 법부터 열쇠업체 부르기 전 확인할 것, 출장비 바가지 방지 요령까지 순서대로 정리했습니다.",
    icon: "🔑",
    date: "2026-08-11",
    keywords: ["문 잠겼을 때", "도어락 건전지 방전", "열쇠 출장비", "도어락 9V 건전지", "방문 잠김"],
    related: ["utility-outage", "lost-card", "emergency-numbers"],
  },
  {
    id: "secondhand-scam",
    title: "중고거래 사기 당했을 때",
    metaTitle: "중고거래 사기 신고 방법 - 더치트 조회·ECRM 온라인 신고·피해 대응",
    description:
      "당근·번개장터에서 돈만 보내고 물건을 못 받았다면 — 증거 확보, 더치트 등록, 경찰청 ECRM 온라인 신고, 피해금 회수 방법까지 순서대로 정리했습니다.",
    icon: "🛒",
    date: "2026-08-11",
    keywords: ["중고거래 사기 신고", "더치트 조회", "ECRM 신고", "당근 사기", "사기 계좌 조회"],
    related: ["voice-phishing", "lost-card", "emergency-numbers"],
  },
  {
    id: "car-accident",
    title: "교통사고 났을 때 (1분 체크리스트)",
    metaTitle: "교통사고 났을 때 대처 순서 - 사고 직후 체크리스트·대인접수·무료 견인",
    description:
      "사고 직후 해야 할 일을 순서대로 — 법적 의무(구호·신고), 2차사고 예방, 사진 찍는 법, 상대 정보 확인, 대인접수, 사설 렉카 거절 요령까지 한 페이지에 정리했습니다.",
    icon: "🚗",
    date: "2026-08-11",
    keywords: ["교통사고 대처", "교통사고 났을 때", "대인접수", "교통사고 사진", "보험사 견인"],
    related: ["emergency-numbers", "medical-cost", "night-hospital"],
  },
  {
    id: "unpaid-wages",
    title: "월급을 못 받았을 때 (임금체불)",
    metaTitle: "임금체불 신고 방법 - 노동청 온라인 진정·대지급금·상담 1350",
    description:
      "월급이 안 들어올 때 — 노동포털 온라인 진정 접수, 근로계약서 없어도 되는 증거, 국가가 대신 주는 대지급금 제도, 무료 상담 1350까지 절차대로 정리했습니다.",
    icon: "💰",
    date: "2026-08-11",
    keywords: ["임금체불 신고", "월급 안 줄 때", "노동청 진정", "대지급금", "임금체불 상담"],
    related: ["medical-cost", "emergency-numbers"],
  },
  {
    id: "noise-complaint",
    title: "층간소음 참기 힘들 때",
    metaTitle: "층간소음 신고 방법 - 이웃사이센터 1661-2642·112 신고 기준",
    description:
      "당장 시끄러울 때 할 수 있는 일 순서대로 — 관리사무소, 이웃사이센터 1661-2642, 112 신고 기준, 그리고 절대 하면 안 되는 것(보복소음·직접 항의)까지 정리했습니다.",
    icon: "🔇",
    date: "2026-08-11",
    keywords: ["층간소음 신고", "이웃사이센터", "층간소음 경찰", "층간소음 기준", "보복소음"],
    related: ["emergency-numbers", "utility-outage"],
  },
  {
    id: "outdoor-injury",
    title: "벌 쏘임·뱀 물림·개 물림 대처",
    metaTitle: "벌 쏘였을 때·뱀 물렸을 때·개 물렸을 때 - 응급처치와 배상 절차",
    description:
      "벌초·나들이 사고 응급대처 — 벌침 제거와 아나필락시스 징후, 뱀 물림에서 하면 안 되는 것, 개 물림 상처 처치와 견주 배상 청구까지 공공기관 기준으로 정리했습니다.",
    icon: "🐝",
    date: "2026-08-11",
    keywords: ["벌 쏘였을 때", "말벌 대처", "뱀 물렸을 때", "개 물림 배상", "벌집 신고 119"],
    related: ["night-hospital", "medical-cost", "emergency-numbers"],
  },
  {
    id: "urgent-passport",
    title: "여권이 급히 필요할 때",
    metaTitle: "여권 급히 필요할 때 - 긴급여권 당일 발급·인천공항 발급처·수수료",
    description:
      "출국이 코앞인데 여권이 없다면 — 인천공항 긴급여권 당일 발급, 필요 서류와 수수료, 긴급여권으로 못 가는 나라, 일반 여권 최단 발급까지 비교해 정리했습니다.",
    icon: "🛂",
    date: "2026-08-11",
    keywords: ["긴급여권", "여권 당일 발급", "인천공항 여권", "여권 빨리 발급", "긴급여권 미국"],
    related: ["lost-card", "lost-phone"],
  },
  {
    id: "missing-person",
    title: "아이·어르신이 사라졌을 때 (실종)",
    metaTitle: "실종신고 방법 - 182 즉시 신고·지문 사전등록·치매 배회감지기",
    description:
      "실종은 신고에 기다림이 필요 없습니다 — 182 즉시 신고 요령, 안전Dream 온라인 신고, 지문 사전등록, 치매 어르신 배회감지기 지원까지 골든타임 순서로 정리했습니다.",
    icon: "🧭",
    date: "2026-08-11",
    keywords: ["실종신고 방법", "182 실종신고", "지문 사전등록", "치매노인 실종", "배회감지기"],
    related: ["emergency-numbers", "lost-phone"],
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
