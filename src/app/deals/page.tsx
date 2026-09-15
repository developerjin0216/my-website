import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import AffiliateLink from "@/components/AffiliateLink";
import SampleThumb, { type ThumbKind } from "@/components/deals/SampleThumb";
import { getBestSelling, getTodayDeals, type TossProduct } from "@/lib/toss";
import { INFO_SITE_NAME, ROOT_URL } from "@/lib/site";

// 토스쇼핑 쉐어링크 · 오늘의 특가
//
// 두 가지 상태를 가집니다.
//  (1) 연동 전 — API 키가 없거나 승인 전이면 상품이 비어 옵니다. 이때는 실제 상품이
//      노출될 자리를 보여주는 예시 카드를 렌더합니다. 토스 쉐어링크 심사에 제출할
//      화면이 필요한데, 빈 화면을 보낼 수는 없기 때문입니다.
//  (2) 연동 후 — 키가 들어오면 같은 자리에 실제 특가 상품과 쉐어링크가 들어갑니다.
//      코드를 고칠 필요 없이 자동으로 전환됩니다.
//
// 예시 상태에서는 색인을 막습니다(noindex). 예시 상품 정보가 검색에 노출되면
// 실제 판매 정보로 오인될 수 있기 때문입니다. 연동되면 자동으로 색인이 열립니다.

const LIMIT = 8; // generateMetadata와 본문이 같은 인자를 써야 데이터 캐시를 공유합니다

// 한 시간마다 다시 만듭니다. 이게 없으면 빌드 시점의 상태(지금은 예시 카드)가
// 그대로 굳어서, 토스 승인이 나도 재배포 전까지 예시 화면이 남습니다.
// 특가 상품 자체도 매일 바뀌므로 어차피 갱신이 필요합니다.
export const revalidate = 3600;

interface SampleItem {
  name: string;
  price: number;
  originalPrice: number;
  thumb: ThumbKind;
}

// 실제 상품이 아니라 자리를 보여주기 위한 예시입니다. 특정 브랜드·제품을 지칭하지
// 않도록 일반 품목명만 씁니다.
const SAMPLE: SampleItem[] = [
  { name: "무선 블루투스 이어폰", price: 39900, originalPrice: 79000, thumb: "earbuds" },
  { name: "보온보냉 텀블러 500ml", price: 12900, originalPrice: 24000, thumb: "tumbler" },
  { name: "극세사 차렵이불 퀸", price: 34900, originalPrice: 69000, thumb: "blanket" },
  { name: "공기청정기 교체 필터 2입", price: 18500, originalPrice: 32000, thumb: "filter" },
  { name: "무선 고속충전 거치대", price: 15900, originalPrice: 29000, thumb: "charger" },
  { name: "캡슐 커피머신", price: 89000, originalPrice: 159000, thumb: "coffee" },
];

function rate(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export async function generateMetadata(): Promise<Metadata> {
  const { products } = await getTodayDeals(LIMIT);
  const live = products.length > 0;

  return {
    // absolute로 고정 — 기본 title 템플릿이 `%s | 상식왕 퀴즈`라, 그냥 문자열로 두면
    // 루트 도메인 페이지인데 퀴즈 사이트 이름이 붙습니다. 토스 심사에 제출하는
    // 화면이라 신청서의 서비스명과 탭 제목이 어긋나면 안 됩니다.
    title: {
      absolute: `오늘의 특가 - 토스쇼핑 할인 상품 모아보기 | ${INFO_SITE_NAME}`,
    },
    description:
      "토스쇼핑에서 오늘 할인 중인 상품을 한 화면에 모았습니다. 할인율과 리뷰 평점을 비교해 보세요. 매일 갱신됩니다.",
    alternates: { canonical: `${ROOT_URL}/deals` },
    // 예시 카드만 있는 상태에서는 색인하지 않습니다
    ...(live ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title: "오늘의 특가 - 토스쇼핑 할인 상품 모아보기",
      description: "오늘 할인 중인 상품을 할인율·리뷰와 함께 한 화면에서 비교하세요.",
      url: `${ROOT_URL}/deals`,
      siteName: INFO_SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
  };
}

function RealCard({ p, placement }: { p: TossProduct; placement: string }) {
  return (
    <AffiliateLink
      href={p.url}
      network="toss"
      placement={placement}
      label={p.name}
      className="block bg-[#16213e] rounded-xl overflow-hidden border border-[#2a3a5a] hover:border-[#3182F6] transition-colors"
    >
      {p.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="w-full aspect-square object-cover bg-white"
        />
      )}
      <div className="p-2.5">
        <p className="text-xs leading-snug line-clamp-2 text-[#e8e8f0]">{p.name}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          {p.discountRate > 0 && (
            <span className="text-sm font-bold text-[#EF4444]">{p.discountRate}%</span>
          )}
          {p.price > 0 && (
            <span className="text-sm font-bold text-accent">
              {p.price.toLocaleString("ko-KR")}원
            </span>
          )}
        </div>
        {p.originalPrice > p.price && (
          <p className="text-[10px] text-[#606070] line-through">
            {p.originalPrice.toLocaleString("ko-KR")}원
          </p>
        )}
        {p.reviewCount > 0 && (
          <p className="text-[10px] text-[#606070] mt-0.5">
            ⭐ {p.reviewScore.toFixed(1)} ({p.reviewCount.toLocaleString("ko-KR")})
          </p>
        )}
      </div>
    </AffiliateLink>
  );
}

function SampleCard({ item }: { item: SampleItem }) {
  const r = rate(item.price, item.originalPrice);
  return (
    <div className="bg-[#16213e] rounded-xl overflow-hidden border border-[#2a3a5a] opacity-90">
      <SampleThumb kind={item.thumb} />
      <div className="p-2.5">
        <p className="text-xs leading-snug line-clamp-2 text-[#e8e8f0]">{item.name}</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-bold text-[#EF4444]">{r}%</span>
          <span className="text-sm font-bold text-accent">
            {item.price.toLocaleString("ko-KR")}원
          </span>
        </div>
        <p className="text-[10px] text-[#606070] line-through">
          {item.originalPrice.toLocaleString("ko-KR")}원
        </p>
        <p className="text-[10px] text-[#4a5a7a] mt-0.5">예시 · 링크 없음</p>
      </div>
    </div>
  );
}

export default async function DealsPage() {
  const [deals, best] = await Promise.all([
    getTodayDeals(LIMIT),
    getBestSelling(LIMIT),
  ]);
  const live = deals.products.length > 0 || best.products.length > 0;

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="px-5 pt-8 pb-4">
        {/* 브랜드명 노출 — 심사자가 신청서의 서비스명과 화면을 대조할 수 있어야 합니다 */}
        <Link href="/" className="text-xs font-bold text-accent">
          {INFO_SITE_NAME}
        </Link>
        <p className="text-xs text-[#606070] mt-2 mb-2">토스쇼핑 · 매일 갱신</p>
        <h1 className="text-2xl font-bold leading-snug">
          오늘의 <span className="text-accent">특가</span>
        </h1>
        <p className="text-sm text-[#a0a0b0] leading-relaxed mt-3">
          토스쇼핑에서 오늘 할인 중인 상품을 한 화면에 모았습니다. 할인율과 리뷰 평점을
          함께 표시하니, 정가와 비교해 보고 필요한 것만 담으세요.
        </p>
      </header>

      {!live && (
        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#3182F6]/40 bg-[#3182F6]/10 p-4">
            <p className="text-xs font-bold text-[#7fb0ff] mb-1">
              연동 준비 중인 화면입니다
            </p>
            <p className="text-[11px] text-[#a0a0b0] leading-relaxed">
              토스쇼핑 쉐어링크 API 승인 전이라 아래 카드는 실제 상품이 아니라{" "}
              <strong className="text-[#c8c8d8]">노출 자리를 보여주는 예시</strong>입니다.
              구매 링크는 연결되어 있지 않습니다. 연동이 완료되면 같은 자리에 실제 특가
              상품과 가격이 표시됩니다.
            </p>
          </div>
        </div>
      )}

      {/* 오늘의 특가 — 하루특가가 비고 베스트만 오는 날에는 빈 그리드가 남지 않도록 */}
      {(!live || deals.products.length > 0) && (
        <section className="px-5 pb-6">
          <h2 className="text-base font-bold text-accent mb-3">⚡ 하루특가</h2>
          <div className="grid grid-cols-2 gap-3">
            {live
              ? deals.products.map((p) => (
                  <RealCard key={p.url} p={p} placement="deals_today" />
                ))
              : SAMPLE.map((item) => <SampleCard key={item.name} item={item} />)}
          </div>
        </section>
      )}

      {/* 인기 상품 — 연동 후에만 */}
      {live && best.products.length > 0 && (
        <section className="px-5 pb-6">
          <h2 className="text-base font-bold text-accent mb-3">🏆 베스트</h2>
          <div className="grid grid-cols-2 gap-3">
            {best.products.map((p) => (
              <RealCard key={p.url} p={p} placement="deals_best" />
            ))}
          </div>
        </section>
      )}

      <div className="px-5 pb-6">
        <p className="text-[10px] leading-relaxed text-[#606070] text-center">
          이 게시물은 토스쇼핑 쉐어링크 활동의 일환으로, 이에 따른 일정액의 수수료를
          제공받습니다.
        </p>
      </div>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />

      <section className="px-5 py-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">특가 고를 때 확인할 것</h2>
          <div className="space-y-2.5 text-xs text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">할인율보다 실제 가격</strong> — 정가를
              높게 적어두면 할인율은 얼마든지 커집니다. 같은 상품을 다른 곳에서 얼마에
              파는지 한 번 더 확인하세요.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">배송비 포함 여부</strong> — 상품가가
              싸도 배송비를 더하면 역전되는 경우가 많습니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">리뷰 수와 평점을 함께</strong> — 평점이
              높아도 리뷰가 몇 개뿐이면 판단하기 이릅니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">필요해서 사는지</strong> — 특가는 사려던
              것을 싸게 살 때만 절약입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="flex justify-center gap-4">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            홈
          </Link>
          <Link href="/help" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            생활 안내
          </Link>
          <Link href="/privacy" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            개인정보처리방침
          </Link>
        </div>
      </section>
    </div>
  );
}
