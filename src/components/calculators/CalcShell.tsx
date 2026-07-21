import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { getCalc } from "@/data/calculators";

// 계산기 페이지 공용 셸 (서버 컴포넌트)
// 헤더 + 계산기 본문(children) + 광고 + SEO 텍스트 + 푸터
// SEO 콘텐츠가 서버 렌더링되어 애드센스 정책(크롤러가 읽을 콘텐츠)을 충족합니다.
export default function CalcShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const calc = getCalc(id);

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="bg-header px-5 py-5">
        <Link
          href="/calculators"
          className="text-sm text-[#a0a0b0] hover:text-accent"
        >
          ← 생활 계산기 모음
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">
          {calc.icon} {calc.name}
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">{calc.card}</p>
      </header>

      <main className="px-5 py-5 flex-1">{children}</main>

      <div className="px-5 pb-2">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      {/* SEO 콘텐츠 — 서버 렌더링, 크롤러가 읽을 수 있음 */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            {calc.seo.heading}
          </h2>
          {calc.seo.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-sm text-[#a0a0b0] leading-relaxed mb-3 last:mb-0"
            >
              {p}
            </p>
          ))}
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5 mt-4">
            {calc.seo.bullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex justify-center gap-3 mb-2">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            상식왕 퀴즈
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/privacy"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            개인정보처리방침
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link
            href="/terms"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            이용약관
          </Link>
        </div>
        <p className="text-xs text-[#606070]">
          계산 결과는 참고용이며 실제 금액과 다를 수 있습니다.
        </p>
      </footer>
    </div>
  );
}
