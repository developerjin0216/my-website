import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuizBankCategory from "@/components/QuizBankCategory";
import { categories } from "@/data/quizData";
import { buildBankMetadata, getBankCategory } from "@/lib/quizBank";

// 카테고리 문제은행 1페이지 (1~25번) — 2페이지부터는 [page] 세그먼트에서 서빙

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return buildBankMetadata(category, 1);
}

export default async function QuizBankCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getBankCategory(category)) notFound();

  return <QuizBankCategory categoryId={category} page={1} />;
}
