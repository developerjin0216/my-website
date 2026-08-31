import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CoupangGoldbox from "@/components/CoupangGoldbox";
import { calculators, calcGroups } from "@/data/calculators";
import { guides } from "@/data/guides";
import { QUIZ_URL, CALC_URL, SPLIT, CALC_SITE_NAME } from "@/lib/site";

// 서버 컴포넌트 — 계산기 허브. 크롤러가 읽을 수 있는 정적 콘텐츠 포함
// 도메인 분리 시 계산기 도메인의 홈 역할을 겸합니다 (proxy가 / 를 여기로 rewrite)
export default function CalculatorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // 분리 시 계산기 도메인의 사이트 이름 신호
      ...(SPLIT
        ? [
            {
              "@type": "WebSite",
              name: CALC_SITE_NAME,
              url: CALC_URL,
              inLanguage: "ko",
            },
          ]
        : []),
      {
        "@type": "CollectionPage",
        name: "생활 계산기 모음",
        description:
          "연봉 실수령액, 퇴직금, 연차, 대출 이자, 전기요금, 환율, BMI 등 무료 생활 계산기 15종",
        url: `${CALC_URL}/calculators`,
        inLanguage: "ko",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: calculators.length,
          itemListElement: calculators.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            url: `${CALC_URL}/calculators/${c.id}`,
          })),
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="bg-header px-5 py-6">
        {SPLIT ? (
          <a
            href={QUIZ_URL}
            className="text-sm text-[#a0a0b0] hover:text-accent"
          >
            상식왕 퀴즈 →
          </a>
        ) : (
          <Link href="/" className="text-sm text-[#a0a0b0] hover:text-accent">
            ← 상식왕 퀴즈 홈
          </Link>
        )}
        <h1 className="text-3xl font-bold text-accent mt-2">생활 계산기 모음</h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          월급부터 전기요금까지, 일상에 필요한 계산기를 무료로 이용하세요
        </p>
      </header>

      <div className="px-5 pt-4 pb-2">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
        <CoupangGoldbox className="mt-3" />
      </div>

      {/* 계산기 그리드 — 서버 렌더링 */}
      <div className="px-5 pb-4 flex-1">
        {calcGroups.map((group) => (
          <section key={group} className="mb-6">
            <h2 className="text-lg font-bold mb-3">{group}</h2>
            <div className="grid grid-cols-2 gap-3">
              {calculators
                .filter((c) => c.group === group)
                .map((calc) => (
                  <Link
                    key={calc.id}
                    href={`/calculators/${calc.id}`}
                    className="bg-card rounded-2xl p-4 transition-transform active:scale-[0.97] hover:brightness-110"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                      style={{ backgroundColor: calc.color + "20" }}
                    >
                      {calc.icon}
                    </div>
                    <p className="font-semibold text-sm">{calc.name}</p>
                    <p className="text-xs text-[#a0a0b0] mt-1 leading-relaxed">
                      {calc.card}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        {/* 생활 가이드 — 정보성 콘텐츠 */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">생활 가이드</h2>
          <div className="space-y-3">
            {guides.map((g) => (
              <Link
                key={g.id}
                href={`/guides/${g.id}`}
                className="block bg-card rounded-2xl p-4 transition-transform active:scale-[0.98] hover:brightness-110"
              >
                <p className="font-semibold text-sm">
                  <span aria-hidden="true">{g.icon}</span> {g.title}
                </p>
                <p className="text-xs text-[#a0a0b0] mt-1 leading-relaxed">
                  {g.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* SEO 콘텐츠 — 크롤러용 정적 텍스트 */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            생활 계산기 모음이란?
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-4">
            연봉 실수령액, 퇴직금, 연차, 대출 이자, 청년 버팀목 전세대출, 부동산
            복비, 전기요금, 에어컨 전기료, 환율, BMI, 칼로리까지 — 일상에서 자주
            찾는 계산기 15종을 한 곳에 모았습니다. 회원가입 없이 무료로 이용할 수
            있으며, 모든 계산은 브라우저에서 즉시 처리되어 입력한 정보가 서버로
            전송되지 않습니다.
          </p>
          <h3 className="text-sm font-bold mb-2">이런 분들께 유용해요</h3>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 이직·연봉협상 전 세후 월급이 궁금한 직장인</li>
            <li>• 퇴사를 앞두고 퇴직금과 남은 연차를 확인하고 싶은 분</li>
            <li>• 전세 계약 전 대출 이자와 복비를 미리 계산하려는 분</li>
            <li>• 여름철 에어컨 전기료가 걱정되는 분</li>
            <li>• 다이어트 목표 칼로리를 세우고 싶은 분</li>
          </ul>
        </div>
      </section>

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
