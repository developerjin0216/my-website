import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

// 오목 본체는 클라이언트 컴포넌트라 크롤러에 거의 빈 페이지로 보입니다.
// 배틀 페이지와 같은 방식으로, 규칙·전략·FAQ를 레이아웃에서 서버 렌더링합니다.

const url = `${QUIZ_URL}/omok`;

export const metadata: Metadata = {
  title: { absolute: `1:1 온라인 오목 - 가입 없이 친구와 바로 두기 | ${SITE_NAME}` },
  description:
    "설치도 가입도 없이 브라우저에서 친구와 1:1 오목을 둡니다. 초대 코드를 보내면 바로 시작하고, 15줄 정규 판에 자유룰로 진행합니다.",
  alternates: { canonical: url },
  openGraph: {
    title: "1:1 온라인 오목 - 가입 없이 친구와 바로 두기",
    description:
      "초대 코드만 보내면 시작. 15x15 정규 판, 자유룰, 매판 선공 교대.",
    url,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

const FAQ = [
  {
    q: "가입이나 설치가 필요한가요?",
    a: "아닙니다. 닉네임만 정하면 바로 둘 수 있습니다. 방을 만들면 여섯 자리 초대 코드가 나오는데, 그 코드를 상대에게 보내면 됩니다.",
  },
  {
    q: "처음 들어갈 때 왜 느린가요?",
    a: "대국 서버가 아무도 쓰지 않을 때 잠들었다가 첫 접속에 깨어납니다. 이때 최대 1분 정도 걸릴 수 있습니다. 한 번 깨어난 뒤에는 바로 연결됩니다.",
  },
  {
    q: "3-3이나 4-4를 두면 지나요?",
    a: "이 오목은 자유룰이라 금수가 없습니다. 3-3, 4-4, 6목 이상(장목) 모두 허용되고 다섯 개가 먼저 이어지면 이깁니다. 대신 흑이 유리하기 때문에 한 판이 끝날 때마다 선공과 돌 색이 자동으로 바뀝니다.",
  },
  {
    q: "상대가 중간에 나가면 어떻게 되나요?",
    a: "대국 중에 상대가 나가거나 연결이 끊기면 남은 사람이 이깁니다. 대기 중이었다면 방은 그대로 남아 다른 사람을 기다립니다.",
  },
  {
    q: "무르기가 되나요?",
    a: "되지 않습니다. 한 번 놓은 돌은 되돌릴 수 없습니다. 마지막에 놓인 돌은 빨간 테두리로 표시되니 상대가 어디에 뒀는지 확인하고 두세요.",
  },
];

export default function OmokLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "1:1 온라인 오목",
        url,
        description:
          "브라우저에서 가입 없이 친구와 1:1로 두는 온라인 오목. 15x15 정규 판, 자유룰.",
        applicationCategory: "GameApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        ...authorship("2026-09-15"),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: QUIZ_URL },
          { "@type": "ListItem", position: 2, name: "1:1 오목", item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}

      <div className="max-w-lg mx-auto w-full px-5">
        <AdBanner slot="XXXXXXXXXX" format="horizontal" />
      </div>

      <section className="max-w-lg mx-auto w-full px-5 py-6 space-y-4">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">오목 규칙</h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            오목은 가로 15줄, 세로 15줄이 만나는 자리에 두 사람이 번갈아 돌을 놓아,
            자기 돌 다섯 개를 먼저 한 줄로 잇는 사람이 이기는 게임입니다. 가로·세로·
            대각선 어느 방향이든 상관없습니다. 흑이 먼저 두고, 한 번 놓은 돌은 움직이지
            않습니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            이 페이지의 오목은 <strong className="text-[#e8e8f0]">자유룰</strong>로
            진행합니다. 대회에서 쓰는 렌주룰은 흑에게 3-3, 4-4, 장목을 금지하는데,
            규칙을 모르는 사람이 영문도 모른 채 반칙패를 당하기 쉽습니다. 그래서 금수를
            두지 않는 대신, 흑이 유리한 만큼을{" "}
            <strong className="text-[#e8e8f0]">매 판 선공을 바꾸는 방식</strong>으로
            맞췄습니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            판이 가득 차도록 다섯이 이어지지 않으면 무승부입니다. 실제로는 그 전에
            거의 승부가 납니다.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">처음이라면 이것만</h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">가운데에서 시작하세요.</strong> 판의
              가장자리는 뻗어나갈 방향이 절반으로 줄어듭니다. 초반에는 중앙 근처에서
              돌을 모으는 편이 유리합니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">열린 3을 경계하세요.</strong> 양쪽 끝이
              모두 비어 있는 돌 세 개를 &lsquo;열린 3&rsquo;이라고 합니다. 이걸 막지
              않으면 다음 수에 열린 4가 되고, 열린 4는 한쪽을 막아도 반대쪽으로 다섯이
              완성돼 막을 방법이 없습니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">막기만 하면 집니다.</strong> 상대를
              따라다니며 막기만 하면 주도권을 영원히 넘겨주게 됩니다. 막으면서 동시에
              내 돌이 이어지는 자리를 고르는 것이 기본입니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">양수겸장을 노리세요.</strong> 한 수로
              두 방향에 동시에 4를 만들면 상대는 한쪽밖에 막지 못합니다. 오목에서 이기는
              가장 흔한 형태입니다.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q}>
                <p className="text-sm font-semibold text-[#e8e8f0] mb-1">{f.q}</p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            홈
          </Link>
          <Link href="/battle" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            퀴즈 배틀
          </Link>
          <Link href="/escape" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            웹 방탈출
          </Link>
        </div>
      </section>
    </>
  );
}
