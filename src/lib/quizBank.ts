// 퀴즈 문제은행 공용 헬퍼 — 페이지 분할 기준(25문제/페이지)을
// 라우트(/quiz-bank/*)와 sitemap이 공유하는 단일 소스입니다.
import type { Metadata } from "next";
import { categories, quizzes, type Quiz } from "@/data/quizData";
import { SITE_NAME, QUIZ_URL } from "@/lib/site";

export const BANK_PAGE_SIZE = 25;

// 카테고리별 핵심 주제어 — 메타 설명·본문 인트로에 사용 (페이지마다 문구가 겹치지 않게)
export const BANK_TOPICS: Record<string, string> = {
  economy: "금리·주식·부동산·세금",
  spelling: "되/돼·띄어쓰기·외래어 표기·헷갈리는 맞춤법",
  mz: "신조어·밈·유행어",
  mudo: "무한도전 명장면·명대사",
  it: "AI·클라우드·프로그래밍·네트워크",
  general: "국어·문화·시사·생활 지식",
  science: "물리·화학·생물·우주",
  history: "한국사·세계사",
  entertainment: "드라마·영화·가요·예능",
  sports: "축구·야구·올림픽·e스포츠",
  geography: "수도·국기·지형·세계 문화",
};

export function getBankCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getBankPageCount(categoryId: string): number {
  const total = quizzes[categoryId]?.length ?? 0;
  return Math.max(1, Math.ceil(total / BANK_PAGE_SIZE));
}

// 해당 페이지의 문제들 + 전체 기준 시작 번호(1-base)
export function getBankSlice(
  categoryId: string,
  page: number
): { items: Quiz[]; start: number; end: number; total: number } {
  const all = quizzes[categoryId] ?? [];
  const start = (page - 1) * BANK_PAGE_SIZE + 1;
  const items = all.slice(start - 1, start - 1 + BANK_PAGE_SIZE);
  return { items, start, end: start - 1 + items.length, total: all.length };
}

// 1페이지는 /quiz-bank/<id>, 2페이지부터 /quiz-bank/<id>/<page> (중복 URL 방지)
export function bankPath(categoryId: string, page: number): string {
  return page <= 1 ? `/quiz-bank/${categoryId}` : `/quiz-bank/${categoryId}/${page}`;
}

export function buildBankMetadata(categoryId: string, page: number): Metadata {
  const cat = getBankCategory(categoryId);
  if (!cat) return {};
  const { start, end, total } = getBankSlice(categoryId, page);
  const path = bankPath(categoryId, page);

  const title =
    page <= 1
      ? `${cat.name} 퀴즈 문제은행 - ${total}문제 정답·해설`
      : `${cat.name} 퀴즈 문제은행 ${page}페이지 - ${start}~${end}번 정답·해설`;
  const description = `${BANK_TOPICS[categoryId] ?? cat.name} — ${cat.name} 상식 퀴즈 ${start}~${end}번 문제와 정답, 해설을 한 페이지에서 확인하세요. 사지선다 총 ${total}문제, 회원가입 없이 무료입니다.`;

  return {
    title,
    description,
    alternates: { canonical: `${QUIZ_URL}${path}` },
    openGraph: {
      title,
      description,
      url: `${QUIZ_URL}${path}`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${QUIZ_URL}/quiz-home/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
