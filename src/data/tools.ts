// 모두의 도구(/tools) 레지스트리 — 허브 카드·메타데이터·가이드·FAQ의 단일 소스
// 새 도구 추가: 여기에 엔트리 + app/tools/<id>/layout.tsx(ToolShell) + page.tsx(클라이언트 UI)

import type { Metadata } from "next";
import { TOOLS_URL, TOOLS_SITE_NAME } from "@/lib/site";

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolGuideSection {
  title: string;
  items: string[]; // 순서 있는 단계 또는 불릿
}

export interface ToolInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  card: string; // 허브 카드 한 줄
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string[]; // 서버 렌더링 SEO 문단
  guide: ToolGuideSection[];
  faq: ToolFaq[];
}

export const tools: ToolInfo[] = [
  {
    id: "insta-follow-check",
    name: "인스타·쓰레드 맞팔 확인",
    icon: "🔍",
    color: "#E1306C",
    card: "로그인 없이 언팔·맞팔 확인 — 파일은 서버로 전송되지 않아요",
    metaTitle: "인스타 언팔 확인 - 로그인 없이 맞팔 체크 (쓰레드 지원)",
    metaDescription:
      "비밀번호 입력 없이 인스타그램·쓰레드 언팔로워를 확인하세요. 공식 '내 정보 다운로드' 파일을 브라우저에서만 분석해 맞팔이 아닌 계정을 찾아줍니다 — 서버 전송 없음, 계정 정지 걱정 없음.",
    keywords: [
      "인스타 언팔 확인",
      "인스타 맞팔 확인",
      "인스타 언팔로워 찾기",
      "쓰레드 언팔 확인",
      "인스타 팔로워 관리",
    ],
    intro: [
      "시중의 언팔 확인 앱들은 인스타그램 아이디와 비밀번호를 요구합니다. 이 방식은 Meta 약관 위반이라 계정이 일시 차단되거나 정지될 수 있고, 비밀번호가 제3자 서버로 넘어가는 보안 위험도 있습니다.",
      "이 도구는 다르게 작동합니다 — 인스타그램·쓰레드가 공식 제공하는 '내 정보 다운로드' 파일을 이용하고, 분석은 100% 지금 보고 있는 브라우저 안에서만 이루어집니다. 파일이 서버로 전송되지 않으므로 로그인도, 비밀번호도, 계정 정지 걱정도 없습니다.",
    ],
    guide: [
      {
        title: "1단계 — 내 정보 내보내기 신청 (인스타그램·쓰레드 공통 경로)",
        items: [
          "앱에서: 프로필 → 설정(⚙) → 계정 설정(계정 센터) → 내 정보 및 권한 → 내 정보 내보내기 → 내보내기 만들기",
          "'정보 맞춤 설정'에서 필요한 것만 선택하면 파일이 작고 빨리 나옵니다 — 인스타그램은 '팔로워 및 팔로잉', 쓰레드는 쓰레드(나에 관한 정보) 항목. 전부 선택해도 상관없습니다. 어차피 이 사이트는 아무 정보도 저장하지 않으니까요",
          "형식은 반드시 JSON 선택 (HTML 말고), 기간은 '전체'",
          "⚠️ 안드로이드 앱에서 다운로드 버튼이 활성화되지 않는 경우가 있습니다 — 그럴 땐 PC 브라우저로 인스타그램·쓰레드에 로그인해 같은 메뉴에서 다운로드하면 됩니다",
          "신청 후 준비되면 알림·메일이 옵니다 — 보통 몇 분에서 몇 시간, ZIP 파일로 다운로드",
          "인스타그램과 쓰레드는 계정이 연결돼 있어도 내보내기는 각각 신청해야 합니다 — 받은 ZIP은 어느 쪽이든 이 페이지가 자동 인식합니다",
        ],
      },
      {
        title: "2단계 — 받은 파일 올리기",
        items: [
          "다운로드한 ZIP 파일을 위 업로드 영역에 끌어다 놓거나 선택하세요 (압축 해제 불필요)",
          "압축을 이미 풀었다면 followers_1.json과 following.json 두 파일을 함께 선택해도 됩니다",
          "결과는 즉시 표시됩니다: 내가 팔로우하는데 나를 팔로우하지 않는 계정, 그 반대, 맞팔 목록",
        ],
      },
    ],
    faq: [
      {
        q: "정말 안전한가요? 파일이 어디로 전송되나요?",
        a: "아무 데도 전송되지 않습니다. 분석 코드는 전부 브라우저(자바스크립트)에서 실행되고, 파일 내용은 이 페이지를 닫는 순간 사라집니다. 궁금하시면 개발자 도구의 네트워크 탭을 열어두고 사용해 보세요 — 업로드 요청이 없습니다.",
      },
      {
        q: "왜 실시간 조회가 아니라 파일을 올려야 하나요?",
        a: "인스타그램·쓰레드는 팔로워 명단을 외부 서비스에 제공하는 공식 API가 없습니다. 로그인을 받아 실시간 조회를 해주는 앱들은 비공식 방식이라 약관 위반이고 계정 정지 위험이 있습니다. 공식 내보내기 파일 분석이 유일하게 안전한 방법입니다.",
      },
      {
        q: "결과가 지금 팔로워와 조금 다른데요?",
        a: "내보내기 파일은 신청 시점의 스냅샷입니다. 신청 후 팔로우 변동이 있었다면 그만큼 차이가 납니다. 최신 상태가 필요하면 내보내기를 새로 신청하세요.",
      },
      {
        q: "언팔 확인 앱에 비밀번호를 입력한 적이 있어요. 어떻게 하죠?",
        a: "지금 바로 인스타그램 비밀번호를 변경하고, 설정 → 보안 → 앱 및 웹사이트에서 수상한 연동을 해제하세요. 2단계 인증도 켜두는 것이 안전합니다.",
      },
    ],
  },
];

export function getTool(id: string): ToolInfo {
  const tool = tools.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}

// 도구 페이지 공용 메타데이터 — canonical·OG (og:image 명시 필수: 자식 openGraph가
// 부모 파일 기반 이미지를 대체하는 Next 16 shallow merge 동작 때문)
export function buildToolMetadata(id: string): Metadata {
  const tool = getTool(id);
  const url = `${TOOLS_URL}/tools/${id}`;
  return {
    title: { absolute: tool.metaTitle },
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
      siteName: TOOLS_SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${TOOLS_URL}/tools/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}
