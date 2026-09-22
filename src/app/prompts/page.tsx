import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import CopyButton from "@/components/CopyButton";
import {
  promptCategories,
  prompts,
  promptsByCategory,
  TOTAL_PROMPTS,
  type PromptCategoryId,
} from "@/data/prompts";
import { ROOT_URL, INFO_SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

const url = `${ROOT_URL}/prompts`;
const CATEGORY_IDS = Object.keys(promptCategories) as PromptCategoryId[];

export const metadata: Metadata = {
  title: {
    absolute: `AI 프롬프트 모음 ${TOTAL_PROMPTS}개 - 복사해서 바로 쓰는 챗GPT 질문 | ${INFO_SITE_NAME}`,
  },
  description: `한 번쯤 해볼 만한 AI 프롬프트 ${TOTAL_PROMPTS}개를 분류별로 정리했습니다. 복사해서 그대로 붙여넣으면 되고, ChatGPT·Claude·Gemini 어디서든 씁니다.`,
  alternates: { canonical: url },
  openGraph: {
    title: `AI 프롬프트 모음 ${TOTAL_PROMPTS}개 - 복사해서 바로 쓰는 챗GPT 질문`,
    description:
      "웃기고 공유하고 싶은 것부터 일·공부·생활까지. 조건이 박힌 완성형 프롬프트만 골랐습니다.",
    url,
    siteName: INFO_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

/** 수록된 프롬프트들에서 실제로 관찰되는 공통 원리 */
const HOWTO = [
  {
    t: "역할을 낯설게 준다",
    d: "'너는 전문가야'는 아무 효과가 없습니다. '퇴사를 결심한 담당 직원', '4500년 후의 고고학자'처럼 구체적이고 예상 밖인 배역일수록 문장이 달라집니다.",
  },
  {
    t: "내 데이터를 재료로 넣는다",
    d: "내가 쓴 메시지, 결제 내역, 방에 있는 물건 같은 것을 붙여넣으면 남과 같은 결과가 나올 수 없습니다. 개인화의 가장 확실한 방법입니다.",
  },
  {
    t: "출력 형식을 못박는다",
    d: "'퇴사 사유서', '발굴조사 보고서', '공문'처럼 정해진 문서 형식을 지정하면 AI가 그 형식의 관습을 따라가면서 밀도가 올라갑니다.",
  },
  {
    t: "반드시 포함할 항목을 번호로 지정한다",
    d: "조건이 세 개 미만이면 결과가 뭉개집니다. 다섯 개쯤 박아두면 빈약한 답이 나올 수가 없습니다.",
  },
  {
    t: "근거를 요구하고 추측을 표시하게 한다",
    d: "'근거가 없으면 추측이라고 적어줘'를 붙이면 AI가 단정하는 것을 막을 수 있습니다. 특히 나를 분석하게 시킬 때 중요합니다.",
  },
];

export default function PromptsHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `AI 프롬프트 모음 ${TOTAL_PROMPTS}개`,
        description:
          "복사해서 바로 쓰는 AI 프롬프트를 분류별로 정리한 모음",
        url,
        ...authorship("2026-09-22"),
      },
      {
        "@type": "ItemList",
        itemListElement: CATEGORY_IDS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: promptCategories[c].name,
          url: `${url}/${c}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: INFO_SITE_NAME, item: ROOT_URL },
          { "@type": "ListItem", position: 2, name: "AI 프롬프트", item: url },
        ],
      },
    ],
  };

  // 허브에서 맛보기로 보여줄 것 — 분류마다 첫 번째
  const teasers = CATEGORY_IDS.map((c) => promptsByCategory(c)[0]).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="px-5 pt-8 pb-4">
        <Link href="/" className="text-xs font-bold text-accent">
          {INFO_SITE_NAME}
        </Link>
        <h1 className="text-2xl font-bold leading-snug mt-3">
          한 번쯤 해볼 만한
          <br />
          <span className="text-accent">AI 프롬프트 {TOTAL_PROMPTS}개</span>
        </h1>
        <p className="text-sm text-[#a0a0b0] leading-relaxed mt-3 break-keep">
          복사해서 그대로 붙여넣으면 됩니다. ChatGPT·Claude·Gemini 어디서든 대체로
          작동하고, 대괄호 자리만 내 얘기로 채우면 남과 다른 결과가 나옵니다.
        </p>
      </header>

      <section className="px-5 pb-5">
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORY_IDS.map((c) => {
            const cat = promptCategories[c];
            return (
              <Link
                key={c}
                href={`/prompts/${c}`}
                className="rounded-xl p-3.5 border transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}22, #16213e 75%)`,
                  borderColor: `${cat.color}44`,
                }}
              >
                <p className="text-sm font-bold text-[#e8e8f0] break-keep">
                  {cat.emoji} {cat.name}
                </p>
                <p className="text-[11px] text-[#a0a0b0] mt-1">
                  {promptsByCategory(c).length}개
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            프롬프트 잘 쓰는 법 5가지
          </h2>
          <p className="text-xs text-[#606070] leading-relaxed mb-4 break-keep">
            여기 실린 프롬프트들에서 실제로 반복되는 원리입니다. 직접 만들어 쓸 때도
            그대로 적용됩니다.
          </p>
          <div className="space-y-3">
            {HOWTO.map((h, i) => (
              <div key={h.t}>
                <p className="text-sm font-semibold text-[#e8e8f0] break-keep">
                  {i + 1}. {h.t}
                </p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed mt-1 break-keep">
                  {h.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />

      <section className="px-5 py-6">
        <h2 className="text-lg font-bold mb-1">맛보기</h2>
        <p className="text-xs text-[#606070] mb-4">분류마다 하나씩 — 바로 복사해서 써보세요</p>
        <div className="space-y-3">
          {teasers.map((p, i) => (
            <div key={p.id}>
            <div className="bg-card rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-[#606070]">
                    {promptCategories[p.category].emoji}{" "}
                    {promptCategories[p.category].name}
                  </p>
                  <p className="text-sm font-bold text-accent break-keep mt-0.5">
                    {p.title}
                  </p>
                </div>
                <CopyButton text={p.body} label={p.title} />
              </div>
              <p className="text-[12px] leading-relaxed text-[#8a8a9a] break-keep">
                {p.why}
              </p>
              <Link
                href={`/prompts/${p.category}#${p.id}`}
                className="inline-block text-xs font-semibold text-accent hover:underline mt-2"
              >
                프롬프트 전문 보기 →
              </Link>
            </div>
            {i === 3 && (
              <div className="mt-3">
                <CoupangBanner />
              </div>
            )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">읽기 전에</h2>
          <div className="space-y-2.5 text-xs text-[#a0a0b0] leading-relaxed break-keep">
            <p>
              여기 있는 프롬프트는 직접 쓴 것이며, 집필 후 별도 심사를 거쳐 뻔한 것과
              작동하지 않는 것, 조건이 빈약한 것을 걸렀습니다. {prompts.length}개가
              남았습니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">AI 답변을 그대로 믿지 마세요.</strong>{" "}
              사실과 다른 내용을 그럴듯하게 말하는 일이 자주 있습니다. 특히 건강·법률·
              세금·투자에 관한 답은 반드시 해당 분야 전문가나 공식 기관 안내로 확인해야
              합니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">개인정보는 빼고 넣으세요.</strong>{" "}
              주민등록번호, 카드·계좌번호, 주소, 타인의 연락처는 붙여넣지 마세요.
              회사 자료는 사내 정책을 먼저 확인하는 게 안전합니다.
            </p>
            <p>
              자기 이해를 돕는 프롬프트는 관찰 도구일 뿐 상담이나 진단을 대신하지
              않습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="flex justify-center gap-4">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            홈
          </Link>
          <Link href="/tools" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            웹 도구
          </Link>
          <Link href="/help" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            생활 안내
          </Link>
        </div>
      </section>
    </div>
  );
}
