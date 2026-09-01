import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { guides } from "@/data/guides";
import { CALC_URL, QUIZ_URL, SPLIT } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "생활 가이드 - 모두의 계산기" },
  description:
    "4대보험 요율, 전기요금 누진제, 퇴직금 지급 기준까지 — 생활 계산기와 함께 보는 알기 쉬운 생활 정보 가이드입니다.",
  alternates: { canonical: `${CALC_URL}/guides` },
};

export default function GuidesPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-6">
        <Link
          href="/calculators"
          className="text-sm text-[#a0a0b0] hover:text-accent"
        >
          ← 생활 계산기 모음
        </Link>
        <h1 className="text-3xl font-bold text-accent mt-2">생활 가이드</h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          계산기 뒤에 숨은 제도와 요율, 알기 쉽게 풀었습니다
        </p>
      </header>

      <div className="px-5 py-4 flex-1 space-y-3">
        {guides.map((g) => (
          <Link
            key={g.id}
            href={`/guides/${g.id}`}
            className="block bg-card rounded-2xl p-5 transition-transform active:scale-[0.98] hover:brightness-110"
          >
            <p className="font-bold">
              <span aria-hidden="true">{g.icon}</span> {g.title}
            </p>
            <p className="text-sm text-[#a0a0b0] mt-1.5 leading-relaxed">
              {g.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <a
            href={SPLIT ? QUIZ_URL : "/"}
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            상식왕 퀴즈
          </a>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/about"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            소개
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/contact"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            문의
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/privacy"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            개인정보처리방침
          </Link>
        </div>
        <p className="text-xs text-[#606070]">
          법령·고시 개정에 따라 내용이 달라질 수 있으니 참고용으로 활용하세요.
        </p>
      </footer>
    </div>
  );
}
