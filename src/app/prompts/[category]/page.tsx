import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import PromptCard from "@/components/PromptCard";
import {
  promptCategories,
  promptsByCategory,
  type PromptCategoryId,
} from "@/data/prompts";
import { ROOT_URL, INFO_SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

// AI 프롬프트 — 분류 단위 문서.
// 프롬프트 하나당 페이지를 만들지 않습니다. 밈 용어 95개를 각 540자짜리 페이지로
// 만들었다가 전부 색인에서 무시당해 카테고리 문서로 합친 게 바로 지난주 일입니다.

const CATEGORY_IDS = Object.keys(promptCategories) as PromptCategoryId[];

const isCategory = (id: string): id is PromptCategoryId =>
  (CATEGORY_IDS as string[]).includes(id);

/** 분류별 검색어 중심 제목 */
const SEO_TITLE: Record<PromptCategoryId, string> = {
  fun: "챗GPT 재밌는 질문 모음 - 결과 캡처해서 공유하는 프롬프트",
  self: "챗GPT 자기분석 프롬프트 - 내 말투·소비·대화로 나를 읽기",
  work: "직장인 챗GPT 프롬프트 - 보고서·회의록·거절 메일·연봉 협상",
  study: "공부용 챗GPT 프롬프트 - 백지 복습·파인만 기법·문답식 학습",
  life: "생활 챗GPT 프롬프트 - 냉장고 털기·여행 계획·집 정리",
  create: "글쓰기 챗GPT 프롬프트 - 플롯 구멍 찾기·캐릭터 인터뷰·문체 교정",
  talk: "대화 연습 챗GPT 프롬프트 - 사과문·갈등 정리·어려운 대화",
};

/** 분류별 도입 해설 — 목록만 있으면 문서가 아니라 리스트로 읽힙니다 */
const INTRO: Record<PromptCategoryId, string[]> = {
  fun: [
    "AI에게 낯선 배역을 주면 평소와 전혀 다른 글이 나옵니다. 여기 모은 것들은 결과를 캡처해서 누군가에게 보내고 싶어지는 프롬프트입니다.",
    "공통점은 '내 것'을 재료로 쓴다는 점입니다. 내 방에 있는 물건, 내가 잘하는 하찮은 특기, 지금까지 나눈 대화 같은 것들이요. 그래서 남과 같은 결과가 나오지 않습니다.",
    "결과가 밋밋하면 대개 재료가 부족해서입니다. 대괄호 자리를 성의 있게 채울수록 훨씬 웃깁니다.",
  ],
  self: [
    "자기 이해를 돕는 프롬프트를 모았습니다. 성격 유형을 찍어주는 식이 아니라, 내가 실제로 쓴 글이나 남긴 기록을 재료로 삼아 패턴을 짚는 방식입니다.",
    "그래서 붙여넣을 자료가 필요합니다. 내가 보낸 메시지, 카드 결제 내역, 최근에 짜증 났던 일 같은 것들이요. 자료가 구체적일수록 결과가 정확해집니다.",
    "각 프롬프트에 '근거 없는 해석은 추측이라고 표시하라'는 지시를 넣어뒀습니다. 점집처럼 단정하는 답을 막기 위해서입니다.",
    "다만 이건 자기 관찰을 돕는 도구일 뿐 상담이나 진단을 대신하지 않습니다. 마음이 많이 힘든 상태라면 전문가와 이야기하는 편이 맞습니다.",
  ],
  work: [
    "직장에서 실제로 시간이 줄어드는 프롬프트만 골랐습니다. '이메일 써줘' 수준이 아니라, 한국 직장의 맥락이 들어간 것들입니다.",
    "돌려 말해야 하는 거절, 윗사람을 설득해야 하는 보고, 책임 소재가 걸린 회의록처럼 문장 하나로 분위기가 달라지는 상황을 다룹니다.",
    "회사 내부 자료를 붙여넣을 때는 고객명·계약금액·개인정보를 지우고 넣으세요. 회사 정책상 외부 AI 서비스 사용이 제한되는 경우도 있으니 먼저 확인하는 게 안전합니다.",
  ],
  study: [
    "요약을 시키는 프롬프트는 넣지 않았습니다. 요약본을 읽는 것은 공부가 아니라 읽기이기 때문입니다.",
    "대신 학습 효과가 알려진 방법들을 AI에게 수행시키는 쪽으로 구성했습니다. 백지에 떠올려 적기, 설명해보게 하기, 틀린 지점을 되묻기 같은 것입니다.",
    "AI가 틀린 정보를 사실처럼 말하는 일이 있습니다. 시험 범위나 자격증 내용은 반드시 교재·기출과 대조하세요.",
  ],
  life: [
    "오늘 당장 쓰는 것들입니다. 냉장고에 남은 재료로 저녁 정하기, 여행 일정 짜기, 집 정리 순서 정하기 같은.",
    "한국 생활 맥락을 넣었습니다. 배달과 편의점, 아파트 구조, 명절과 경조사처럼 번역된 프롬프트로는 잘 안 되는 부분입니다.",
    "건강·의료·법률·투자 판단이 필요한 일은 여기 넣지 않았습니다. AI 답변을 근거로 결정할 영역이 아닙니다.",
  ],
  create: [
    "'소설 써줘'는 넣지 않았습니다. AI가 통째로 써준 글은 대개 쓸 수 없고, 무엇보다 재미가 없습니다.",
    "대신 창작 과정의 특정 단계를 돕는 것들을 모았습니다. 플롯의 구멍 찾기, 캐릭터에게 직접 질문하기, 첫 문장 후보를 잔뜩 뽑기, 내 문체를 흉내 내지 말고 진단하기 같은.",
    "AI가 만든 결과물의 저작권과 이용 범위는 서비스마다 다릅니다. 상업적으로 쓸 계획이면 해당 서비스의 약관을 먼저 확인하세요.",
  ],
  talk: [
    "사람 사이의 일을 다루는 프롬프트입니다. 대부분 AI에게 상대 역할을 맡겨 미리 연습해보는 형태입니다.",
    "실제 대화 전에 한 번 굴려보면, 내가 무슨 말을 하려는지가 정리되고 상대가 어디서 발끈할지도 미리 보입니다.",
    "상대를 설득하거나 이기는 기술이 아니라, 내 말을 정확하게 전하기 위한 연습으로 쓰는 것을 권합니다. 남을 조종하거나 속이는 용도로는 쓰지 마세요.",
  ],
};

// 광고 위치를 고정합니다. 'N개마다'로 두면 긴 문서(유행 이미지 26개)에 배너가
// 9개씩 붙어서 읽기가 끊기고 애드센스 심사에서도 광고 과다로 잡힙니다.
const AD_SLOTS = [2, 8, 14];

export function generateStaticParams() {
  return CATEGORY_IDS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};

  const cat = promptCategories[category];
  const list = promptsByCategory(category);
  const url = `${ROOT_URL}/prompts/${category}`;

  return {
    title: { absolute: `${SEO_TITLE[category]} | ${INFO_SITE_NAME}` },
    description:
      `${cat.name} 프롬프트 ${list.length}개를 복사해서 바로 쓸 수 있게 정리했습니다. ${cat.desc}`.slice(
        0,
        160
      ),
    alternates: { canonical: url },
    openGraph: {
      title: SEO_TITLE[category],
      description: cat.desc,
      url,
      siteName: INFO_SITE_NAME,
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function PromptCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const cat = promptCategories[category];
  const list = promptsByCategory(category);
  const url = `${ROOT_URL}/prompts/${category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: SEO_TITLE[category],
        description: cat.desc,
        url,
        ...authorship("2026-09-22"),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: INFO_SITE_NAME, item: ROOT_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "AI 프롬프트",
            item: `${ROOT_URL}/prompts`,
          },
          { "@type": "ListItem", position: 3, name: cat.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link href="/prompts" className="text-sm text-[#a0a0b0] hover:text-accent">
        ← AI 프롬프트 모음
      </Link>

      <header
        className="rounded-2xl p-6 mt-3 mb-5 border"
        style={{
          background: `linear-gradient(135deg, ${cat.color}26, #16213e 70%)`,
          borderColor: `${cat.color}55`,
        }}
      >
        <p className="text-xs mb-2" style={{ color: cat.color }}>
          {cat.emoji} AI 프롬프트
        </p>
        <h1 className="text-2xl font-bold text-accent break-keep">{cat.name}</h1>
        <p className="text-sm text-[#c0c8d8] leading-relaxed mt-2 break-keep">
          {cat.desc}
        </p>
        <p className="text-[11px] text-[#8a90a0] mt-3">
          {list.length}개 · 복사해서 바로 사용 · 최종 확인 2026-09-22
        </p>
      </header>

      <section className="bg-card rounded-2xl p-5 mb-5">
        {INTRO[category].map((para, i) => (
          <p
            key={i}
            className="text-sm text-[#c0c8d8] leading-relaxed break-keep mb-3 last:mb-0"
          >
            {para}
          </p>
        ))}
      </section>

      <nav className="bg-card rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-accent mb-3">이 문서에 담긴 프롬프트</h2>
        <div className="flex flex-wrap gap-1.5">
          {list.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5 text-[#c0c8d8] hover:text-accent hover:border-accent transition-colors"
            >
              {p.title}
            </a>
          ))}
        </div>
      </nav>

      {list.map((p, idx) => (
        <div key={p.id}>
          <article id={p.id} className="bg-card rounded-2xl p-5 mb-4 scroll-mt-4">
            <PromptCard
              id={p.id}
              title={p.title}
              body={p.body}
              why={p.why}
              tip={p.tip}
              caution={p.caution}
            />
          </article>

          {/* 광고는 프롬프트 3개마다 한 번. 카드 안이 아니라 사이에 둡니다 —
              펼침 버튼 바로 옆에 광고가 있으면 오조작 클릭이 납니다.
              애드센스는 승인 전이라 AdBanner가 null을 반환합니다. 지금 실제로
              보이는 건 쿠팡뿐이라 그 자리를 쿠팡으로 채우고, 애드센스 슬롯은
              승인 뒤 자동으로 함께 뜨도록 아래에 같이 둡니다. */}
          {AD_SLOTS.includes(idx) && idx < list.length - 1 && (
            <div className="mb-4 space-y-3">
              <CoupangBanner />
              <AdBanner slot="XXXXXXXXXX" format="horizontal" />
            </div>
          )}
        </div>
      ))}

      <div className="mb-4">
        <CoupangBanner />
      </div>

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-3">다른 분류도 보기</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORY_IDS.filter((c) => c !== category).map((c) => {
            const o = promptCategories[c];
            return (
              <Link
                key={c}
                href={`/prompts/${c}`}
                className="bg-[#16213e] rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-[#e8e8f0] break-keep">
                  {o.emoji} {o.name}
                </p>
                <p className="text-[11px] text-[#a0a0b0] mt-1">
                  {promptsByCategory(c).length}개
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="text-center text-xs text-[#606070] pb-8 space-y-2">
        <p className="leading-relaxed break-keep">
          AI가 내놓은 답에는 사실과 다른 내용이 섞일 수 있습니다. 건강·법률·금전에
          관한 판단은 반드시 해당 분야 전문가나 공식 기관 안내를 함께 확인하세요.
        </p>
        <Link href="/prompts" className="inline-block hover:text-[#a0a0b0]">
          AI 프롬프트 모음 전체 보기 →
        </Link>
      </footer>
    </div>
  );
}
