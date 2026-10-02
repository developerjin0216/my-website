import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { guides } from "@/data/guides";
import { getCalc } from "@/data/calculators";
import { CALC_URL, QUIZ_URL, SPLIT } from "@/lib/site";

// 허브 페이지가 링크 목록만으로 끝나면 색인되지 않습니다. 실제로 이 페이지는
// 사람이 읽는 글자가 806자뿐이라 "Crawled - currently not indexed" 후보였습니다.
// 허브가 색인되지 않으면 그 아래 글들이 가장 강한 내부 링크를 잃습니다.
// 그래서 목차 대신, 상황에서 출발해 글과 계산기로 내려보내는 안내문을 둡니다.

const SITUATIONS: { when: string; go: string; href: string; why: string }[] = [
  {
    when: "첫 월급을 받았는데 생각보다 적게 들어왔을 때",
    go: "4대보험 요율 총정리",
    href: "/guides/insurance-rates",
    why: "세전 급여에서 국민연금·건강보험·장기요양·고용보험이 먼저 빠지고, 그다음 소득세와 지방소득세가 빠집니다. 각각 몇 퍼센트인지 알면 명세서의 숫자가 맞는지 직접 검산할 수 있습니다.",
  },
  {
    when: "회사를 그만두게 됐을 때",
    go: "퇴직금 지급 기준·계산·세금",
    href: "/guides/severance",
    why: "1년 이상 일하고 주 15시간 이상 근무했다면 받을 수 있습니다. 퇴직금은 마지막 3개월 평균임금으로 계산하기 때문에, 그만두기 직전 몇 달의 수당이 금액을 꽤 바꿉니다.",
  },
  {
    when: "그만둔 뒤 실업급여를 받으려 할 때",
    go: "실업급여 신청 총정리",
    href: "/guides/unemployment-benefits",
    why: "퇴사 사유와 고용보험 가입 기간이 수급 가능 여부를 가릅니다. 신청이 늦어지면 받을 수 있는 날이 그대로 줄어들기 때문에 순서를 먼저 아는 쪽이 유리합니다.",
  },
  {
    when: "여름 전기요금 고지서를 보고 놀랐을 때",
    go: "전기요금 누진제 완전 해설",
    href: "/guides/electricity-progressive",
    why: "주택용 전기요금은 쓴 만큼 비례해 늘지 않고 구간을 넘는 순간 단가가 뜁니다. 어느 구간에서 얼마나 뛰는지 알면 어디를 줄여야 효과가 큰지 보입니다.",
  },
  {
    when: "내년 최저임금이 내 급여에 어떻게 반영되는지 궁금할 때",
    go: "2027년 최저임금 총정리",
    href: "/guides/minimum-wage-2027",
    why: "시급만 보면 놓치기 쉬운 것이 주휴수당과 월 환산액입니다. 월급제로 일해도 최저임금 위반 여부는 월 환산액으로 따집니다.",
  },
  {
    when: "연금 보험료가 오른다는 뉴스를 봤을 때",
    go: "2026 연금개혁 해설",
    href: "/guides/pension-reform",
    why: "보험료율이 단계적으로 오르면 당장 이번 달 실수령액부터 달라집니다. 몇 년에 걸쳐 얼마씩 오르는지, 내 월급에서는 얼마인지로 바꿔 봅니다.",
  },
];

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
        <div className="bg-card rounded-2xl p-5">
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            월급에서 빠져나가는 4대보험, 그만둘 때 받는 퇴직금, 여름마다 튀는
            전기요금. 모두 금액이 법령과 고시로 정해져 있는데, 정작 그 근거를
            찾아보려 하면 고시 원문이나 보도자료로 흩어져 있습니다. 여기 있는
            글들은 그 근거를 한 번 읽어서 이해되는 말로 옮기고, 실제 숫자를 넣은
            예시로 확인할 수 있게 정리한 것입니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mt-3">
            글마다 짝이 되는 계산기가 있습니다. 글에서 원리를 보고 계산기에 내
            숫자를 넣어보는 순서를 권합니다. 요율이 바뀌면 계산기와 글을 같은
            자료에서 함께 고치기 때문에, 두 곳의 숫자가 어긋나지 않습니다.
          </p>
        </div>

        {guides.map((g) => {
          const calcs = g.relatedCalcs
            .map((id) => {
              try {
                return getCalc(id);
              } catch {
                return null;
              }
            })
            .filter((c) => c !== null);
          return (
            <div key={g.id} className="bg-card rounded-2xl p-5">
              <Link
                href={`/guides/${g.id}`}
                className="block transition-transform active:scale-[0.98] hover:brightness-110"
              >
                <p className="font-bold">
                  <span aria-hidden="true">{g.icon}</span> {g.title}
                </p>
                <p className="text-sm text-[#a0a0b0] mt-1.5 leading-relaxed">
                  {g.description}
                </p>
              </Link>
              {calcs.length > 0 && (
                <p className="mt-3 pt-3 border-t border-[#2a3a5a] text-xs text-[#606070]">
                  같이 보면 좋은 계산기{" "}
                  {calcs.map((c, i) => (
                    <span key={c.id}>
                      {i > 0 && " · "}
                      <Link
                        href={`/calculators/${c.id}`}
                        className="text-[#a0a0b0] hover:text-accent"
                      >
                        {c.name}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-6">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <section className="px-5 pb-6 space-y-3">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">
            이런 상황이라면 이 글부터
          </h2>
          <div className="space-y-4">
            {SITUATIONS.map((s) => (
              <div key={s.href}>
                <p className="text-sm font-semibold text-[#e8e8f0]">{s.when}</p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed mt-1">
                  {s.why}
                </p>
                <Link
                  href={s.href}
                  className="inline-block mt-1.5 text-xs text-accent hover:underline"
                >
                  {s.go} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">
            숫자를 어떻게 관리하나
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">원 자료에서만 가져옵니다.</strong>{" "}
              요율과 금액은 보건복지부·고용노동부·국민건강보험공단 고시와 한국전력
              요금표에서 확인한 값만 씁니다. 블로그나 요약 기사에서 옮겨 적으면
              개정 전 숫자가 그대로 굳어버리기 때문입니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                계산기와 글이 같은 값을 봅니다.
              </strong>{" "}
              요율은 글이나 계산기 안이 아니라 공용 파일 한 곳에 들어 있습니다.
              그래서 개정 때 한 번만 고치면 계산기 결과, 예시 표, 글 본문이 함께
              바뀝니다. 흔한 사고인 &lsquo;계산기는 새 요율, 설명은 작년
              요율&rsquo;이 생기지 않습니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                확정 전 숫자는 추정하지 않습니다.
              </strong>{" "}
              인상률만 발표되고 구간별 표가 아직 안 나온 경우, 인상률을 곱해서
              적어두지 않고 &lsquo;아직 고시 전&rsquo;이라고 밝힙니다. 구간마다
              적용 방식이 달라 곱셈만으로는 실제 금액과 어긋나기 때문입니다.
            </p>
            <p>
              글 아래에는 마지막으로 확인한 날짜와 근거 기관을 적어둡니다. 개정이
              잦은 항목이라 날짜를 보고 최신 여부를 판단하시면 됩니다. 틀린 숫자를
              발견하면{" "}
              <Link href="/contact" className="text-accent hover:underline">
                문의
              </Link>
              로 알려주세요.
            </p>
          </div>
        </div>
      </section>

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
