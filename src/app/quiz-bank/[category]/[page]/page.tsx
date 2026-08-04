import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuizBankCategory from "@/components/QuizBankCategory";
import { categories } from "@/data/quizData";
import {
  buildBankMetadata,
  getBankCategory,
  getBankPageCount,
} from "@/lib/quizBank";

// 카테고리 문제은행 2페이지 이후 (26번~) — 1페이지는 /quiz-bank/[category]가 캐노니컬

// 유효한 페이지 번호만 통과 ("1"은 상위 세그먼트와 중복이므로 404)
function parsePage(categoryId: string, raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  if (page < 2 || page > getBankPageCount(categoryId)) return null;
  return page;
}

export function generateStaticParams() {
  return categories.flatMap((c) => {
    const pageCount = getBankPageCount(c.id);
    return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
      category: c.id,
      page: String(i + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category, page: rawPage } = await params;
  if (!getBankCategory(category)) return {};
  const page = parsePage(category, rawPage);
  if (page === null) return {};
  return buildBankMetadata(category, page);
}

export default async function QuizBankCategoryPagedPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page: rawPage } = await params;
  if (!getBankCategory(category)) notFound();
  const page = parsePage(category, rawPage);
  if (page === null) notFound();

  return <QuizBankCategory categoryId={category} page={page} />;
}
