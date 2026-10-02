import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { orderedScenes } from "@/data/escape";
import { escapeStats, validateEscapeStory } from "@/lib/escapeValidate";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";
import { authorship, REVIEWED } from "@/lib/trust";

// 스토리 정합성 검증 — 모듈 로드 시점에 실행되므로, 떡밥 회수 누락이나 풀 수 없는
// 퍼즐이 있으면 이 페이지의 정적 생성이 실패하고 빌드가 통째로 깨집니다.
// 논리 구멍이 있는 스토리는 배포되지 않습니다.
validateEscapeStory();

const stats = escapeStats();

export const metadata: Metadata = {
  title: "웹 방탈출 게임 한빛사진관 - 무료 추리 방탈출 '현상되지 않은 필름'",
  description:
    `설치 없이 브라우저에서 바로 하는 무료 웹 방탈출. 폐업을 앞둔 동네 사진관을 정리하며 20년 전 흔적을 따라가는 추리 게임입니다. 방 ${stats.scenes}개, 퍼즐 ${stats.puzzles}개, 회수되는 떡밥 ${stats.clues}개.`,
  alternates: { canonical: `${QUIZ_URL}/escape` },
  openGraph: {
    title: "웹 방탈출 '현상되지 않은 필름' - 한빛사진관",
    description:
      "폐업 정리 중인 동네 사진관. 장부에서 늘 비어 있는 접수번호 하나가 시작입니다. 무료 추리 방탈출.",
    url: `${QUIZ_URL}/escape`,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [
      { url: `${QUIZ_URL}/quiz-home/opengraph-image`, width: 1200, height: 630 },
    ],
  },
};

const FAQ = [
  {
    q: "설치하거나 가입해야 하나요?",
    a: "아닙니다. 브라우저에서 바로 실행되고 회원가입도 필요 없습니다. 진행 상황은 사용하는 기기에만 저장되므로, 중간에 나갔다가 같은 브라우저로 돌아오면 이어서 할 수 있습니다.",
  },
  {
    q: "얼마나 걸리나요?",
    a: "힌트를 거의 쓰지 않으면 25~35분, 힌트를 활용하면 15~20분 정도 걸립니다. 방마다 끊어서 해도 진행이 저장됩니다.",
  },
  {
    q: "막히면 어떻게 하나요?",
    a: "퍼즐마다 힌트가 3단계로 준비되어 있습니다. 1단계는 어디를 봐야 하는지, 2단계는 푸는 방법, 3단계는 정답입니다. 필요한 만큼만 열어 보세요.",
  },
  {
    q: "무서운 내용인가요?",
    a: "공포 요소는 없습니다. 놀래키는 연출이나 잔인한 묘사 없이 진행되는 잔잔한 추리물이며, 결말도 따뜻하게 끝납니다.",
  },
  {
    q: "정답을 검색하면 나오나요?",
    a: "플레이 화면은 검색 엔진에 색인되지 않도록 설정해 두었습니다. 직접 풀어보시는 편이 훨씬 재미있습니다.",
  },
  {
    q: "휴대폰에서도 되나요?",
    a: "됩니다. 처음부터 세로 화면에 맞춰 만들었습니다. 답을 입력하는 칸과 물건을 살펴보는 화면 모두 한 손으로 조작할 수 있습니다. PC에서도 같은 주소로 동일하게 진행됩니다.",
  },
  {
    q: "중간에 저장하고 나갔다가 다시 할 수 있나요?",
    a: "풀었던 퍼즐과 열어본 힌트가 브라우저에 저장되어, 같은 기기 같은 브라우저로 돌아오면 그 지점부터 이어집니다. 다만 서버에 저장하는 것이 아니라서 다른 기기로 옮겨가거나 브라우저 데이터를 지우면 처음부터 시작해야 합니다.",
  },
  {
    q: "바깥 지식이 필요한 퍼즐이 있나요?",
    a: "없습니다. 역사 상식이나 특정 영화·게임을 알아야 풀리는 문제는 넣지 않았습니다. 필요한 정보는 전부 게임 안의 물건과 글에 들어 있고, 검색창을 열어야 한다면 그건 설계가 잘못된 것으로 보고 고쳤습니다.",
  },
  {
    q: "여러 명이 같이 할 수 있나요?",
    a: "같은 화면을 보며 함께 풀 수는 있지만, 각자의 기기로 접속해 협동하는 멀티플레이 기능은 없습니다. 둘이서 한 화면을 보며 상의하는 방식이 가장 잘 맞습니다.",
  },
  {
    q: "2편이 나오나요?",
    a: "1편의 이야기는 이 안에서 완결됩니다. 떡밥을 남겨두고 끝내지 않았습니다. 다음 편은 만들게 되면 별개의 이야기가 됩니다.",
  },
];

// 재미없을 사람에게 미리 말해주는 쪽이 낫습니다. 기대와 다른 게임을 20분 하다
// 나가는 것보다, 처음에 걸러지는 편이 서로 낫습니다.
const NOT_FOR_YOU = [
  "반사신경이나 조작 실력을 겨루는 걸 기대한다면 — 시간 제한도 액션도 없습니다.",
  "무서운 걸 찾는다면 — 놀래키는 장면도 잔인한 묘사도 없습니다.",
  "5분짜리 가벼운 미니게임을 찾는다면 — 짧아도 15분, 보통 30분쯤 걸립니다.",
  "글 읽는 걸 싫어한다면 — 단서가 전부 글 안에 있어서 읽지 않으면 풀리지 않습니다.",
];

export default function EscapeHubPage() {
  const url = `${QUIZ_URL}/escape`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        name: "한빛사진관 — 현상되지 않은 필름",
        url,
        description:
          "폐업을 앞둔 동네 사진관을 정리하며 20년 전 흔적을 따라가는 1인용 추리 방탈출. 설치와 가입 없이 브라우저에서 진행합니다.",
        genre: ["방탈출", "추리", "퍼즐"],
        gamePlatform: "Web browser",
        playMode: "SinglePlayer",
        applicationCategory: "GameApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        // authorship()이 inLanguage("ko-KR")·author·publisher·dateModified를 넣습니다
        ...authorship(REVIEWED.escape),
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
          { "@type": "ListItem", position: 2, name: "웹 방탈출", item: url },
        ],
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
      <header className="px-5 pt-8 pb-5">
        <p className="text-xs text-[#606070] mb-2">웹 방탈출 · 1편</p>
        <h1 className="text-2xl font-bold leading-snug">
          한빛사진관
          <br />
          <span className="text-accent">현상되지 않은 필름</span>
        </h1>
        <p className="text-sm text-[#a0a0b0] leading-relaxed mt-3">
          다음 주면 간판을 내리는 동네 사진관. 할아버지가 남긴 가게를 정리하러 갔다가,
          장부에서 20년 내내 비어 있는 접수번호 하나를 발견합니다.
        </p>
      </header>

      <section className="px-5 pb-5">
        <Link
          href="/escape/play"
          className="block rounded-2xl bg-accent text-[#1a1a2e] text-center font-bold py-4 active:scale-[0.99] transition-transform"
        >
          방탈출 시작하기
        </Link>
        <p className="text-[11px] text-[#606070] text-center mt-2">
          설치·가입 없이 바로 시작 · 진행 상황 자동 저장
        </p>
      </section>

      <section className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { n: stats.scenes, label: "개의 방" },
            { n: stats.puzzles, label: "개의 퍼즐" },
            { n: stats.clues, label: "개의 떡밥" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-card py-3 text-center border border-[#2a3a5a]"
            >
              <p className="text-xl font-bold text-accent">{s.n}</p>
              <p className="text-[11px] text-[#606070] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">어떤 게임인가요?</h2>
          <p className="text-sm text-[#c8c8d8] leading-relaxed mb-3">
            방마다 물건을 하나씩 살펴보며 이야기를 읽고, 거기서 얻은 단서를 조합해
            답을 입력하는 1인용 추리 방탈출입니다. 전투나 반응 속도를 요구하는 요소는
            없고, 제시된 정보만으로 논리적으로 풀리도록 설계했습니다. 밖에서 찾아와야
            하는 지식은 필요하지 않습니다.
          </p>
          <p className="text-sm text-[#c8c8d8] leading-relaxed">
            이 게임의 중심은 <strong className="text-[#e8e8f0]">떡밥 회수</strong>입니다.
            초반에 그냥 지나쳤던 낡은 서류, 벽에 걸린 사진, 해마다 쉬던 하루 — 전부
            나중에 다른 의미로 돌아옵니다. 마지막 방에서 남은 단서가 한꺼번에
            맞물리도록 짜여 있어서, 끝까지 가야 이야기가 완성됩니다.
          </p>
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            퍼즐은 어떻게 풀리나요
          </h2>
          <p className="text-sm text-[#c8c8d8] leading-relaxed mb-3">
            방에 들어가면 물건이 서너 개씩 놓여 있습니다. 하나씩 눌러 보면 짧은 글이
            나오는데, 그 안에 단서가 섞여 있습니다. 단서는 대개{" "}
            <strong className="text-[#e8e8f0]">한 물건 안에서 완결되지 않습니다</strong>.
            장부에서 본 날짜와 벽에 걸린 사진의 계절을 맞춰 봐야 숫자가 나오는 식입니다.
            그래서 방을 다 둘러보지 않으면 퍼즐 앞에서 멈추게 됩니다.
          </p>
          <p className="text-sm text-[#c8c8d8] leading-relaxed mb-3">
            답은 대부분 숫자나 짧은 단어입니다. 맞으면 바로 넘어가고, 틀려도 횟수
            제한이나 벌점은 없습니다. 찍어서 맞히는 걸 막으려고 정답은 해시로만
            가지고 있어서, 개발자 도구로 페이지를 뜯어봐도 답이 보이지 않습니다.
          </p>
          <p className="text-sm text-[#c8c8d8] leading-relaxed">
            풀리지 않는 퍼즐을 만들지 않으려고{" "}
            <strong className="text-[#e8e8f0]">
              이야기 구조를 빌드 단계에서 검사
            </strong>
            합니다. 단서가 쓰이기 전에 반드시 먼저 등장하는지, 아직 얻지 못한 정보를
            요구하는 퍼즐이 없는지, 마지막 방에서 회수되는 떡밥이 충분한지를 기계가
            확인하고, 하나라도 어긋나면 배포 자체가 실패합니다. 사람 눈으로 검토하면
            꼭 한두 개를 놓치기 때문입니다.
          </p>
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">진행 순서</h2>
          <ol className="space-y-2.5">
            {orderedScenes.map((s) => (
              <li key={s.id} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#16213e] border border-[#2a3a5a] text-[11px] font-bold text-accent flex items-center justify-center">
                  {s.order}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#e8e8f0]">
                    {s.title}
                    <span className="text-[10px] text-[#606070] font-normal ml-1.5">
                      {s.act}
                    </span>
                  </p>
                  <p className="text-xs text-[#606070] mt-0.5">{s.place}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-[#606070] leading-relaxed mt-4">
            각 방의 퍼즐을 모두 풀어야 다음 장소로 넘어갑니다. 방 이름 외에 내용은
            미리 공개하지 않습니다.
          </p>
        </div>
      </section>

      <AdBanner slot="XXXXXXXXXX" format="horizontal" />

      <section className="px-5 py-6">
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
      </section>

      <section className="px-5 pb-6">
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            이런 걸 찾는 거라면 안 맞습니다
          </h2>
          <ul className="space-y-2">
            {NOT_FOR_YOU.map((t) => (
              <li
                key={t}
                className="text-sm text-[#a0a0b0] leading-relaxed flex gap-2"
              >
                <span className="text-[#606070] shrink-0">·</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#a0a0b0] leading-relaxed mt-3.5">
            반대로 추리소설을 읽으며 앞 장을 다시 넘겨보는 걸 좋아한다면, 또는 오프라인
            방탈출을 해봤는데 가격이나 시간 때문에 자주 못 간다면 맞을 가능성이
            높습니다. 돈이 들지 않고 중간에 멈춰도 되니까요.
          </p>
        </div>
      </section>

      <section className="px-5 pb-8">
        <p className="text-[11px] text-[#606070] leading-relaxed">
          이 이야기와 등장인물·상호는 모두 창작이며 실제와 관계가 없습니다. 진행
          상황은 브라우저에만 저장되고 서버로 전송되지 않습니다. 브라우저 데이터를
          지우면 처음부터 다시 시작됩니다.
        </p>
        <div className="flex justify-center gap-4 mt-5">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            홈
          </Link>
          <Link href="/quiz-bank" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            상식 문제은행
          </Link>
          <Link href="/mbti" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            MBTI
          </Link>
        </div>
      </section>
    </div>
  );
}
