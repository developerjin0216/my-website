import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { mbtiTypes } from "@/data/mbti";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import { authorship } from "@/lib/trust";

// 검사 본체는 클라이언트 컴포넌트라, 크롤러에게 이 페이지는 사실상 빈 문서였습니다
// (본문 148자 — 사이트에서 가장 얇았습니다). 배틀·오목과 같은 방식으로 설명과
// FAQ를 레이아웃에서 서버 렌더링합니다.
//
// 내용은 /mbti 허브와 겹치지 않게, 허브는 '유형이 무엇인가', 여기는 '이 검사가
// 무엇을 재고 무엇을 못 재는가'로 갈라 씁니다. 같은 글을 두 URL에 두면 둘 다
// 색인에서 밀립니다.

const url = `${QUIZ_URL}/mbti/test`;

const AXES = [
  {
    code: "E / I",
    name: "에너지의 방향",
    body: "사람들 사이에 있을 때 기운이 차오르는지(E), 혼자 있는 시간에 회복되는지(I)를 봅니다. 말수가 많고 적음이 아니라 어디서 충전되는가의 문제라, 말이 많은 I도 조용한 E도 흔합니다.",
  },
  {
    code: "S / N",
    name: "정보를 받아들이는 방식",
    body: "눈앞의 사실과 경험을 먼저 보는지(S), 그 너머의 가능성과 연결을 먼저 보는지(N)입니다. 설명을 들을 때 '그래서 구체적으로 뭘 하면 되는데'가 먼저 떠오르면 S 쪽, '이게 결국 무슨 의미지'가 먼저면 N 쪽에 가깝습니다.",
  },
  {
    code: "T / F",
    name: "판단의 기준",
    body: "맞고 틀림과 일관성을 먼저 따지는지(T), 사람과 관계에 미치는 영향을 먼저 따지는지(F)입니다. T가 차갑고 F가 따뜻한 것이 아니라, 결정을 내릴 때 무엇을 먼저 저울에 올리느냐의 차이입니다.",
  },
  {
    code: "J / P",
    name: "생활을 꾸리는 방식",
    body: "미리 정해두고 차례로 닫아가는 쪽이 편한지(J), 열어두고 상황에 맞추는 쪽이 편한지(P)입니다. 부지런함과 게으름의 구분이 아닙니다. 마감 직전에 몰아치는 J도, 계획표를 좋아하는 P도 있습니다.",
  },
];

const FAQ = [
  {
    q: "이 검사는 정식 MBTI 검사인가요?",
    a: "아닙니다. 정식 MBTI®는 유료 검사이고 자격을 갖춘 전문가의 해석을 함께 받는 절차입니다. 여기 있는 것은 같은 네 축의 개념을 빌려 20문항으로 만든 간이 검사이고, 재미와 자기 이해를 위한 참고용입니다. 채용이나 진학처럼 중요한 판단의 근거로 쓰면 안 됩니다.",
  },
  {
    q: "할 때마다 결과가 달라지는데 왜 그런가요?",
    a: "어느 축에서 점수가 거의 반반이면 작은 기분 차이로도 글자가 뒤집힙니다. 이건 검사가 고장난 것이 아니라 그 축의 성향이 뚜렷하지 않다는 뜻에 가깝습니다. 두 유형 설명을 모두 읽어보고 더 자주 들어맞는 쪽을 참고하면 됩니다.",
  },
  {
    q: "20문항으로 성격을 알 수 있나요?",
    a: "알 수 없습니다. 문항이 적을수록 애매한 축에서 흔들리고, 사람의 성격은 네 글자로 나뉘지도 않습니다. 다만 '나는 어디서 기운이 나고 무엇을 먼저 따지는가'를 한 번 정리해보는 계기로는 충분히 쓸모가 있습니다.",
  },
  {
    q: "결과가 마음에 들지 않는데 어떡하죠?",
    a: "유형에는 좋고 나쁨이 없습니다. 설명이 안 맞는다고 느껴지면 그 설명이 틀린 것이지 당신이 틀린 것이 아닙니다. 유형 설명은 평균적인 경향을 적어둔 것이라, 같은 유형 안에서도 사람마다 꽤 다릅니다.",
  },
  {
    q: "결과가 저장되나요?",
    a: "서버로 보내지 않습니다. 답변과 결과는 브라우저 안에서만 처리되고, 가입이나 로그인도 필요 없습니다.",
  },
  {
    q: "얼마나 걸리나요?",
    a: "20문항이라 보통 3분 안쪽입니다. 오래 고민하지 말고 먼저 떠오르는 쪽을 고르는 편이 결과가 더 정확합니다. '어떤 사람이고 싶은가'가 아니라 '평소에 실제로 어떤가'를 기준으로 답하세요.",
  },
];

export default function MbtiTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "MBTI 무료 간이 테스트",
        url,
        description:
          "20문항으로 16가지 성격유형 중 내 유형을 알아보는 무료 간이 검사. 가입 없이 3분이면 끝납니다.",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        ...authorship("2026-09-08"),
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
          {
            "@type": "ListItem",
            position: 2,
            name: "MBTI 백과",
            item: `${QUIZ_URL}/mbti`,
          },
          { "@type": "ListItem", position: 3, name: "간이 테스트", item: url },
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

      <section className="max-w-lg mx-auto w-full px-5 py-6 space-y-4">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            이 검사는 무엇을 재나요
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            MBTI는 사람을 네 개의 축에 놓고 각 축에서 어느 쪽에 더 기우는지를
            봅니다. 그 결과를 글자 하나씩 모아 네 글자로 적은 것이 ENFP, ISTJ
            같은 유형입니다. 중요한 건 이게{" "}
            <strong className="text-[#e8e8f0]">
              능력이나 좋고 나쁨을 재는 것이 아니라 선호를 재는 것
            </strong>
            이라는 점입니다. 오른손잡이가 왼손잡이보다 나은 게 아닌 것과 같습니다.
          </p>
          <p className="text-sm text-[#a0a0b0] leading-relaxed">
            20문항은 네 축에 각각 다섯 문항씩 배정돼 있습니다. 한 축에서 다섯 개
            답이 한쪽으로 몰리면 그 성향이 뚜렷한 것이고, 셋 대 둘로 갈리면
            거의 중간이라는 뜻입니다. 그래서 같은 사람이 다시 해도 애매한 축에서는
            글자가 바뀔 수 있습니다.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">네 개의 축</h2>
          <div className="space-y-3.5">
            {AXES.map((a) => (
              <div key={a.code}>
                <p className="text-sm font-semibold text-[#e8e8f0]">
                  <span className="font-mono text-accent">{a.code}</span> ·{" "}
                  {a.name}
                </p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed mt-1">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <AdBanner slot="XXXXXXXXXX" format="horizontal" />

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            믿어도 되는 만큼만
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              MBTI는 심리학계에서 성격 측정 도구로서의 신뢰도와 타당도를 두고
              오랫동안 비판을 받아온 검사입니다. 특히 사람을 두 쪽으로 가르는
              방식이 문제로 지적됩니다. 실제 성향은 연속적인 분포에 가까워서,
              경계선 근처에 있는 사람이 매우 많기 때문입니다.
            </p>
            <p>
              그래서 유형을 <strong className="text-[#e8e8f0]">설명</strong>으로
              쓰는 건 괜찮지만{" "}
              <strong className="text-[#e8e8f0]">변명이나 판정</strong>으로 쓰면
              곤란합니다. &lsquo;나는 P라서 약속을 못 지켜&rsquo;는 유형 탓이
              아니고, &lsquo;저 사람은 T라서 공감을 못 해&rsquo;도 근거가 되지
              않습니다. 채용이나 평가에 쓰는 것은 검사를 만든 쪽에서도 권하지 않는
              용도입니다.
            </p>
            <p>
              가볍게 즐기되, 결과가 안 맞으면 과감히 무시해도 됩니다. 사람은 네
              글자보다 복잡합니다.
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

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            16가지 유형 바로 보기
          </h2>
          <p className="text-xs text-[#a0a0b0] leading-relaxed mb-3">
            검사 없이 설명부터 읽어도 됩니다. 각 유형의 특징, 강점과 약점, 연애
            스타일, 잘 맞는 유형까지 정리해 두었습니다.
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {mbtiTypes.map((t) => (
              <li key={t.code}>
                <Link
                  href={`/mbti/${t.code.toLowerCase()}`}
                  className="text-[#a0a0b0] hover:text-accent"
                >
                  <span aria-hidden="true">{t.emoji}</span> {t.code}
                  <span className="text-[#606070]"> · {t.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-4 pt-1">
          <Link href="/mbti" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            MBTI 백과
          </Link>
          <Link href="/quiz" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            상식 퀴즈
          </Link>
          <Link href="/meme" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            밈 사전
          </Link>
        </div>
      </section>
    </>
  );
}
