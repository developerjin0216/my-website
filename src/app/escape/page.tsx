import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { orderedScenes } from "@/data/escape";
import { escapeStats, validateEscapeStory } from "@/lib/escapeValidate";
import { QUIZ_URL, SITE_NAME } from "@/lib/site";

// 스토리 정합성 검증 — 모듈 로드 시점에 실행되므로, 떡밥 회수 누락이나 풀 수 없는
// 퍼즐이 있으면 이 페이지의 정적 생성이 실패하고 빌드가 통째로 깨집니다.
// 논리 구멍이 있는 스토리는 배포되지 않습니다.
validateEscapeStory();

const stats = escapeStats();

export const metadata: Metadata = {
  title: "웹 방탈출 게임 한빛사진관 - 무료 추리 방탈출 '현상되지 않은 필름'",
  description:
    "설치 없이 브라우저에서 바로 하는 무료 웹 방탈출. 폐업을 앞둔 동네 사진관에서 20년 전 사건의 단서를 찾는 추리 게임입니다. 방 6개, 퍼즐 12개, 회수되는 떡밥 8개.",
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
];

export default function EscapeHubPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
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
            방을 순서대로 지나며 관찰하고, 단서를 조합해 답을 입력하는 1인용 추리
            방탈출입니다. 전투나 반응 속도를 요구하는 요소는 없고, 제시된 정보만으로
            논리적으로 풀리도록 설계했습니다. 밖에서 찾아와야 하는 지식은 필요하지
            않습니다.
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
