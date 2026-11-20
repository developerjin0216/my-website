import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CoupangGoldbox from "@/components/CoupangGoldbox";
import { calculators, calcGroups, CALC_COUNT } from "@/data/calculators";
import { guides } from "@/data/guides";
import { RATE_BASED } from "@/lib/trust";
import { CALC_URL, SPLIT, CALC_SITE_NAME, BRAND } from "@/lib/site";

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
        description: `연봉 실수령액, 퇴직금, 연차, 대출 이자, 전기요금, 환율, BMI 등 무료 생활 계산기 ${CALC_COUNT}종`,
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
    <div className="flex flex-col min-h-screen page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="bg-header px-5 py-6">
        {/* 분리 시절에는 이 자리에 "퀴즈 →" 링크가 있었습니다. 퀴즈는 2026-11-17 삭제(410)되어
            갈 곳이 없으므로, 어느 모드에서든 홈으로 돌아갑니다. */}
        <Link href="/" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← {BRAND} 홈
        </Link>
        <h1 className="text-3xl font-bold text-accent mt-2">생활 계산기 모음</h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          월급부터 전기요금까지, 일상에 필요한 계산기를 무료로 이용하세요
        </p>
      </header>

      <div className="px-5 pt-4 pb-2">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
        <CoupangGoldbox className="mt-3" placement="calculators" />
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

        {/* 요율 기준일 — 이 허브에서 "내 숫자가 최신인가"에 답하는 표.
            계산기 페이지마다 따로 보여주던 기준일을 한자리에 모았습니다.
            금액이 법령·고시로 정해지는 계산기만 올라옵니다(환율·BMI 등 제외). */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">고시 요율을 쓰는 계산기</h2>
          <p className="text-xs text-[#a0a0b0] leading-relaxed mb-3 break-keep">
            아래 계산기는 결과가 공식 요율·금액에 따라 달라지므로, 페이지마다
            마지막으로 공식 자료와 대조한 날짜를 적어 둡니다. 요율이 개정되면
            계산식과 설명글을 같은 자료를 보고 함께 고칩니다.
          </p>
          <ul className="bg-card rounded-2xl divide-y divide-[#2a3a5a]">
            {Object.entries(RATE_BASED).map(([id, asOf]) => {
              const c = calculators.find((x) => x.id === id);
              if (!c) return null;
              return (
                <li key={id}>
                  <Link
                    href={`/calculators/${id}`}
                    className="flex items-baseline justify-between gap-3 px-4 py-2.5 hover:bg-[#16213e] transition-colors"
                  >
                    <span className="text-sm text-[#c0c8d8]">
                      <span aria-hidden="true">{c.icon}</span> {c.name}
                    </span>
                    <time dateTime={asOf} className="text-[11px] text-[#707080] shrink-0">
                      {asOf}
                    </time>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 생활 가이드 — 정보성 콘텐츠 */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">생활 가이드</h2>
          <div className="card-grid">
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
            찾는 계산기 {CALC_COUNT}종을 한 곳에 모았습니다. 회원가입 없이 무료로 이용할 수
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
          <Link
            href="/help"
            className="text-xs text-[#606070] hover:text-[#a0a0b0]"
          >
            급할 때 대처법
          </Link>
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
