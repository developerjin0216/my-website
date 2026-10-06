import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { helpTopics, HELP_GROUPS } from "@/data/help";
import { ROOT_URL, INFO_SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

// /help 허브.
//
// 글 27개가 먼저 생기고 허브가 없었습니다. /prompts가 /help를 링크하는데 404라
// 내부 링크 하나가 끊겨 있었고, 27개 글은 홈에서 몇 개만 꽂혀 있을 뿐 공통 부모가
// 없었습니다. 허브가 없으면 크롤러가 섹션 전체를 한 덩어리로 보지 못합니다.
//
// 목록만 늘어놓은 허브는 색인되지 않습니다(이 사이트의 /guides가 806자로 그랬습니다).
// 그래서 "지금 무슨 일이 났는지"에서 출발해 글로 내려보내는 구성으로 씁니다.

const url = `${ROOT_URL}/help`;

// 묶음 정의는 data/help.ts의 HELP_GROUPS — 홈과 같은 순서를 써야 합니다.

// 글을 새로 추가하고 묶음에 넣는 걸 잊으면 허브에서 조용히 사라집니다.
// 빌드가 깨지게 해서 그 일이 생기지 않게 합니다.
const assigned = HELP_GROUPS.flatMap((g) => g.ids);
const missing = helpTopics.filter((t) => !assigned.includes(t.id)).map((t) => t.id);
const unknown = assigned.filter((id) => !helpTopics.some((t) => t.id === id));
const duplicated = assigned.filter((id, i) => assigned.indexOf(id) !== i);
if (missing.length || unknown.length || duplicated.length) {
  throw new Error(
    [
      "/help 허브 묶음이 데이터와 어긋납니다.",
      missing.length && `  묶음에 빠진 글: ${missing.join(", ")}`,
      unknown.length && `  존재하지 않는 id: ${unknown.join(", ")}`,
      duplicated.length && `  중복된 id: ${duplicated.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n")
  );
}

const byId = new Map(helpTopics.map((t) => [t.id, t]));

export const metadata: Metadata = {
  title: { absolute: `급할 때 생활안내 — 상황별 대처법 ${helpTopics.length}가지 | ${INFO_SITE_NAME}` },
  description: `카드 분실, 교통사고, 임금체불, 전세사기, 야간 진료, 환불 거절까지 — 당장 뭘 해야 하는지와 어디에 전화해야 하는지를 상황별로 정리한 ${helpTopics.length}개 안내입니다.`,
  alternates: { canonical: url },
  openGraph: {
    title: `급할 때 생활안내 — 상황별 대처법 ${helpTopics.length}가지`,
    description:
      "당장 뭘 해야 하는지, 어디에 전화해야 하는지. 상황에서 바로 찾아 들어가세요.",
    url,
    siteName: INFO_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

export default function HelpHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "급할 때 생활안내",
        url,
        description:
          "상황별로 당장 할 일과 연락처를 정리한 생활 대처 안내 모음입니다.",
        ...authorship("2026-10-02"),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: INFO_SITE_NAME, item: ROOT_URL },
          { "@type": "ListItem", position: 2, name: "급할 때 생활안내", item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: "상황별 대처 안내",
        itemListElement: helpTopics.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.title,
          url: `${ROOT_URL}/help/${t.id}`,
        })),
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
        <Link href="/" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← 홈
        </Link>
        <h1 className="text-3xl font-bold text-accent mt-2">
          <span aria-hidden="true">🚨</span> 급할 때 생활안내
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1">
          상황별 대처법 {helpTopics.length}가지
        </p>
      </header>

      <div className="px-5 py-5 flex-1 space-y-5">
        <section className="bg-card rounded-2xl p-5">
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            사고가 나거나 돈을 떼였을 때 가장 먼저 막히는 건 &lsquo;어디에
            전화해야 하는지&rsquo;입니다. 검색하면 법 조문이나 보도자료가 나오는데,
            급한 사람에게 필요한 건 조문이 아니라 지금 누를 번호와 다음 한 걸음
            입니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mt-3">
            그래서 글마다 맨 위에 <strong className="text-[#e8e8f0]">지금 할 일</strong>
            과 <strong className="text-[#e8e8f0]">연락처</strong>를 먼저 놓고, 설명은
            그 아래에 뒀습니다. 숫자와 절차는 소관 기관 자료에서만 가져오고 글
            아래에 출처와 확인한 날짜를 적어 둡니다. 제도가 자주 바뀌는 분야라
            날짜를 함께 보세요.
          </p>
          <p className="text-xs text-[#8a90a0] leading-relaxed mt-3">
            여기 있는 글은 일반적인 안내입니다. 실제 처분이나 보상은 개별 사정에
            따라 달라지므로, 중요한 결정 전에는 해당 기관에 직접 확인하세요.
          </p>
        </section>

        {HELP_GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="text-lg font-bold mb-1">{g.title}</h2>
            <p className="text-xs text-[#a0a0b0] leading-relaxed mb-3">{g.lead}</p>
            <div className="space-y-2.5">
              {g.ids.map((id) => {
                const t = byId.get(id)!;
                return (
                  <Link
                    key={id}
                    href={`/help/${id}`}
                    className="block bg-card rounded-2xl p-4 transition-transform active:scale-[0.98] hover:brightness-110"
                  >
                    <p className="font-semibold text-sm text-[#e8e8f0]">
                      <span aria-hidden="true">{t.icon}</span> {t.title}
                    </p>
                    <p className="text-xs text-[#a0a0b0] mt-1.5 leading-relaxed line-clamp-3">
                      {t.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <AdBanner slot="XXXXXXXXXX" format="horizontal" />

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            급한 일이 생기기 전에 해두면 좋은 것
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">
                분실 신고 번호를 미리 저장해 두세요.
              </strong>{" "}
              카드나 휴대폰을 잃어버린 순간은 번호를 찾아볼 여유가 가장 없는
              때입니다. 카드사 대표번호와 통신사 고객센터를 연락처에 넣어두면
              그때 몇 분을 벌 수 있습니다.{" "}
              <Link href="/help/lost-card" className="text-accent hover:underline">
                카드·지갑 분실
              </Link>
              ,{" "}
              <Link href="/help/lost-phone" className="text-accent hover:underline">
                휴대폰 분실
              </Link>
            </p>
            <p>
              <strong className="text-[#e8e8f0]">계약서는 사진으로 남기세요.</strong>{" "}
              전월세, 헬스장, 통신 약정 모두 분쟁이 생기면 결국 계약서 문구로
              갈립니다. 서명한 날 바로 찍어두면 나중에 원본을 못 찾아 포기하는 일이
              없습니다.{" "}
              <Link href="/help/rental-repair" className="text-accent hover:underline">
                전월세 집수리
              </Link>
              ,{" "}
              <Link href="/help/gym-refund" className="text-accent hover:underline">
                헬스장 환불
              </Link>
            </p>
            <p>
              <strong className="text-[#e8e8f0]">기한을 먼저 확인하세요.</strong>{" "}
              온라인 구매 청약철회는 7일, 임금체불 진정은 퇴직 후 기간 제한이
              있습니다. 억울해서 미루는 사이에 받을 수 있던 권리가 사라지는 일이
              가장 흔합니다.{" "}
              <Link href="/help/online-refund" className="text-accent hover:underline">
                온라인쇼핑 환불
              </Link>
              ,{" "}
              <Link href="/help/unpaid-wages" className="text-accent hover:underline">
                임금체불
              </Link>
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                받을 수 있는 돈이 있는지 한 번은 확인하세요.
              </strong>{" "}
              휴면예금, 미청구 보험금, 환급 세금처럼 신청해야만 주는 돈이 꽤
              있습니다. 한 번 훑는 데 10분이면 됩니다.{" "}
              <Link href="/help/hidden-money" className="text-accent hover:underline">
                숨은 내 돈 찾기
              </Link>
            </p>
          </div>
        </section>

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">함께 보면 좋은 곳</h2>
          <div className="space-y-2 text-sm">
            <p>
              <Link href="/calculators" className="text-accent hover:underline">
                생활 계산기
              </Link>{" "}
              <span className="text-[#a0a0b0]">
                — 퇴직금, 실업급여, 전기요금처럼 금액이 궁금할 때
              </span>
            </p>
            <p>
              <Link href="/guides" className="text-accent hover:underline">
                생활 가이드
              </Link>{" "}
              <span className="text-[#a0a0b0]">
                — 4대보험 요율, 누진제처럼 제도 자체가 궁금할 때
              </span>
            </p>
            <p>
              <Link href="/en" className="text-accent hover:underline">
                English guides
              </Link>{" "}
              <span className="text-[#a0a0b0]">
                — 한국 생활 안내 영문판 (for foreigners in Korea)
              </span>
            </p>
          </div>
        </section>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            홈
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/about" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            소개
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/contact" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            문의
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/privacy" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            개인정보처리방침
          </Link>
        </div>
        <p className="text-xs text-[#606070]">
          일반적인 안내이며 법률·의료 자문이 아닙니다. 중요한 결정 전에는 해당
          기관에 확인하세요.
        </p>
      </footer>
    </div>
  );
}
