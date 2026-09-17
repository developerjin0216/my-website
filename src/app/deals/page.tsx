import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import AffiliateLink from "@/components/AffiliateLink";
import { getBestSelling, getTodayDeals, type TossProduct } from "@/lib/toss";
import { INFO_SITE_NAME, ROOT_URL } from "@/lib/site";

// 토스쇼핑 쉐어링크 · 오늘의 특가
//
// 상품이 들어오면 카드가 뜨고, 없으면 '특가 고르는 법' 안내만 남습니다.
// 예시·플레이스홀더 카드는 두지 않습니다 — '제작 중인 페이지'는 애드센스 정책상
// 명시적 거절 사유이고, 가짜 가격은 이용자를 오인시킵니다. 상품이 없는 동안에도
// 페이지 자체로 읽을 값이 있도록 안내 본문을 채워 두었습니다.
//
// 상품이 없을 때는 색인하지 않습니다(noindex). 연동되면 자동으로 열립니다.

const LIMIT = 8; // generateMetadata와 본문이 같은 인자를 써야 데이터 캐시를 공유합니다

// 한 시간마다 다시 만듭니다. 이게 없으면 빌드 시점의 상태(지금은 예시 카드)가
// 그대로 굳어서, 토스 승인이 나도 재배포 전까지 예시 화면이 남습니다.
// 특가 상품 자체도 매일 바뀌므로 어차피 갱신이 필요합니다.
export const revalidate = 3600;

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
          <div className="rounded-xl border border-[#2a3a5a] bg-[#16213e] p-4">
            <p className="text-xs text-[#a0a0b0] leading-relaxed">
              오늘 표시할 특가 상품이 아직 준비되지 않았습니다. 상품 목록은 매일
              갱신되며, 아래 내용은 특가를 고를 때 확인할 것들을 정리한 것입니다.
            </p>
          </div>
        </div>
      )}

      {/* 상품이 실제로 있을 때만 렌더합니다.
          예시·플레이스홀더 카드는 두지 않습니다 — '제작 중인 페이지'는 애드센스
          정책상 명시적 거절 사유이고, 가짜 가격은 이용자를 오인시킵니다. */}
      {deals.products.length > 0 && (
        <section className="px-5 pb-6">
          <h2 className="text-base font-bold text-accent mb-3">⚡ 하루특가</h2>
          <div className="grid grid-cols-2 gap-3">
            {deals.products.map((p) => (
              <RealCard key={p.url} p={p} placement="deals_today" />
            ))}
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

      <section className="px-5 py-6 space-y-4">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            할인율에 속지 않는 법
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              온라인 특가에서 가장 먼저 눈에 들어오는 건 붉은 글씨로 적힌 할인율입니다.
              그런데 할인율은 <strong className="text-[#e8e8f0]">판매자가 정한 정가를
              기준으로 계산</strong>됩니다. 정가를 높게 적어두면 같은 가격에도 할인율은
              얼마든지 커집니다. 70% 할인이 50% 할인보다 반드시 싼 것은 아닙니다.
            </p>
            <p>
              판단 기준은 할인율이 아니라 <strong className="text-[#e8e8f0]">지금
              내가 내야 하는 금액</strong>입니다. 같은 상품명을 다른 쇼핑몰에서 한 번만
              검색해 보면 대부분 판가름이 납니다. 포털의 가격비교에서 최근 가격 흐름을
              보면, 원래 그 가격이던 것을 특가로 붙여둔 경우도 쉽게 걸러집니다.
            </p>
            <p>
              &lsquo;역대가&rsquo;, &lsquo;최저가&rsquo; 같은 표현에도 기준이 없습니다.
              어느 기간의 최저가인지, 어느 쇼핑몰 안에서의 최저가인지 적혀 있지 않다면
              그냥 광고 문구로 보는 편이 안전합니다.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            결제 전 30초 체크리스트
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">1. 배송비와 묶음 조건</strong> — 상품가가
              2천 원 싸도 배송비 3천 원이 붙으면 손해입니다. 무료배송 조건 금액을 맞추려고
              필요 없는 물건을 더 담게 되는 것도 흔한 함정입니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">2. 리뷰는 수와 최신순으로</strong> —
              평점 4.9라도 리뷰가 다섯 개면 판단하기 이릅니다. 최신순으로 정렬해 최근
              한두 달 리뷰를 보면 품질이 바뀐 상품인지 드러납니다. 사진 리뷰가 전부 같은
              구도라면 한 번 더 의심할 만합니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">3. 용량·수량 단위</strong> — 묶음 상품은
              개당 가격으로 환산해야 비교가 됩니다. 같은 브랜드라도 500ml와 450ml를 나란히
              놓고 파는 경우가 있습니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">4. 반품 조건과 판매자</strong> — 특가
              상품은 단순 변심 반품이 안 되거나 반품비가 비싼 경우가 있습니다. 해외 배송
              상품은 반품에 2~3주가 걸리기도 합니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">5. 결제는 플랫폼 안에서</strong> — 더 싸게
              해준다며 현금 이체나 외부 링크를 유도하면 구매 보호를 받을 수 없습니다.
              명절이나 대규모 할인 기간에 특히 자주 나타나는 수법입니다.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            특가가 절약이 되는 조건
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              특가는 <strong className="text-[#e8e8f0]">사려던 것을 싸게 살 때만</strong>
              절약입니다. 싸다는 이유로 산 물건은 아무리 할인율이 높아도 지출이지
              절약이 아닙니다. 할인 기간에 장바구니만 채워두고 하루 뒤에 다시 보면,
              절반쯤은 굳이 필요하지 않았다는 걸 알게 됩니다.
            </p>
            <p>
              생필품처럼 어차피 쓸 것은 재고를 쌓아둘 만합니다. 다만 유통기한이 있는
              식품, 유행을 타는 의류, 성능이 빠르게 바뀌는 전자기기는 미리 사둬서
              이득을 보기 어렵습니다.
            </p>
            <p>
              카드사 즉시할인이나 쿠폰은 중복 적용 조건이 까다로운 경우가 많습니다.
              최종 결제창에서 실제로 얼마가 빠지는지 확인한 뒤 결정하세요.
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
