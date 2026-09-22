import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import PromptCard from "@/components/PromptCard";
import {
  viralCategories,
  viralByCategory,
  type ViralCategoryId,
} from "@/data/promptsViral";
import { TOTAL_PROMPTS } from "@/data/prompts";
import { ROOT_URL, INFO_SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

// 유행 프롬프트 — 직접 만든 것이 아니라 커뮤니티·SNS에서 퍼진 것을 정리한 문서.
// 항목마다 유래와 출처 링크를 답니다. 우리가 더한 값은 수집·출처확인·분류·해설입니다.

const IDS = Object.keys(viralCategories) as ViralCategoryId[];
const isCat = (id: string): id is ViralCategoryId =>
  (IDS as string[]).includes(id);

const SEO_TITLE: Record<ViralCategoryId, string> = {
  "viral-image": "유행한 챗GPT 이미지 프롬프트 - 피규어·증명사진·하찮은 그림",
  "viral-self": "유행한 챗GPT 자기분석 프롬프트 - 팩폭·맹점·무의식 분석",
  "viral-use": "유행한 챗GPT 활용 프롬프트 - 과외 선생님·전략 조언자",
};

export function generateStaticParams() {
  return IDS.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCat(category)) return {};
  const cat = viralCategories[category];
  const list = viralByCategory(category);
  const url = `${ROOT_URL}/prompts/viral/${category}`;
  return {
    title: { absolute: `${SEO_TITLE[category]} | ${INFO_SITE_NAME}` },
    description:
      `실제로 퍼진 ${cat.name} ${list.length}개를 출처와 함께 정리했습니다. ${cat.desc}`.slice(
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

export default async function ViralCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCat(category)) notFound();

  const cat = viralCategories[category];
  const list = viralByCategory(category);
  // 프롬프트가 몇 개든 문서 가운데 한 곳에만 광고를 둡니다
  const AD_INDEX = Math.floor((list.length - 1) / 2);
  const url = `${ROOT_URL}/prompts/viral/${category}`;

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
          {cat.emoji} 온라인에서 유행한 프롬프트
        </p>
        <h1 className="text-2xl font-bold text-accent break-keep">{cat.name}</h1>
        <p className="text-sm text-[#c0c8d8] leading-relaxed mt-2 break-keep">
          {cat.desc}
        </p>
        <p className="text-[11px] text-[#8a90a0] mt-3">
          {list.length}개 · 출처 확인 완료 · 최종 확인 2026-09-22
        </p>
      </header>

      {/* 출처 표기 — 남의 프롬프트를 싣는 이상 맨 앞에 밝힙니다 */}
      <section className="rounded-2xl border border-[#2a3a5a] bg-[#16213e] p-5 mb-5">
        <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">
          여기 있는 프롬프트는{" "}
          <strong className="text-[#e8e8f0]">저희가 만든 것이 아닙니다.</strong>{" "}
          커뮤니티와 SNS에서 실제로 퍼진 것을 찾아 유래와 출처를 확인하고, 한국어가
          어색한 것은 다듬어 정리했습니다. 항목마다 어디서 시작돼 어떻게 퍼졌는지
          적어두었으니 원문도 함께 확인해 보세요.
        </p>
        <p className="text-xs text-[#8a90a0] leading-relaxed break-keep mt-3">
          탈옥·안전장치 우회, 특정인 사칭, 시험 부정행위처럼 문제 소지가 있는 것은
          유행 여부와 관계없이 수록하지 않았습니다. 출처를 끝내 확인하지 못한 것도
          뺐습니다.
        </p>
      </section>

      <nav className="bg-card rounded-2xl p-5 mb-5">
        <h2 className="text-sm font-bold text-accent mb-3">
          이 문서에 담긴 프롬프트
        </h2>
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
            {/* tip 자리에 유래를 넣습니다 — 이 목록에서는 그게 '더 알아둘 것'입니다 */}
            <PromptCard
              id={p.id}
              title={p.title}
              body={p.body}
              why={p.why}
              tip={p.origin}
              caution={p.caution}
            />

            <div className="mt-4 rounded-xl bg-[#0f1626] border border-[#2a3a5a] p-3.5">
              <p className="text-[11px] font-bold text-[#8a90a0] mb-1.5">
                어떻게 퍼졌나
              </p>
              <p className="text-[12px] text-[#a0a0b0] leading-relaxed break-keep">
                {p.popularity}
              </p>
              {p.sourceUrl && (
                <a
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener nofollow"
                  className="inline-block text-[11px] text-accent hover:underline mt-2 break-all"
                >
                  출처: {p.sourceHost} →
                </a>
              )}
            </div>
          </article>

          {/* 광고는 문서 가운데 한 곳뿐입니다. 끝에 두면 거기까지 내려오는
              사람이 거의 없고, 여러 곳에 흩으면 프롬프트를 훑는 흐름이 끊깁니다.
              카드 안이 아니라 카드 사이에 둡니다 — 펼침 버튼 바로 옆에 광고가
              있으면 오조작 클릭이 납니다. */}
          {idx === AD_INDEX && (
            <div className="mb-4 space-y-3">
              <CoupangBanner />
              <AdBanner slot="XXXXXXXXXX" format="horizontal" />
            </div>
          )}

        </div>
      ))}

      <section className="bg-card rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-accent mb-3">다른 분류도 보기</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {IDS.filter((c) => c !== category).map((c) => {
            const o = viralCategories[c];
            return (
              <Link
                key={c}
                href={`/prompts/viral/${c}`}
                className="bg-[#16213e] rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-[#e8e8f0] break-keep">
                  {o.emoji} {o.name}
                </p>
                <p className="text-[11px] text-[#a0a0b0] mt-1">
                  {viralByCategory(c).length}개
                </p>
              </Link>
            );
          })}
          <Link
            href="/prompts"
            className="bg-[#16213e] rounded-xl p-3.5 border border-[#2a3a5a] hover:border-accent transition-colors"
          >
            <p className="text-sm font-bold text-[#e8e8f0] break-keep">
              ✍️ 직접 쓴 프롬프트
            </p>
            <p className="text-[11px] text-[#a0a0b0] mt-1">{TOTAL_PROMPTS}개</p>
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-[#606070] pb-8 leading-relaxed break-keep">
        AI가 내놓은 답에는 사실과 다른 내용이 섞일 수 있습니다. 사진을 올리는
        프롬프트는 본인 사진만 쓰고, 타인의 사진은 동의 없이 올리지 마세요.
      </footer>
    </div>
  );
}
