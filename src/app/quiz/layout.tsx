import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/quizData";
import { QUIZ_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "퀴즈 풀기",
  description:
    "11개 카테고리 1,100여 문제 중 랜덤 10문제에 도전하세요. 15초 제한 시간, 힌트 기능, 오답 해설까지 제공합니다.",
  alternates: { canonical: `${QUIZ_URL}/quiz` },
};

// 퀴즈 본체는 클라이언트 컴포넌트라 크롤러에 보이지 않으므로,
// 레이아웃에서 이용 방법·카테고리를 서버 렌더링해 색인 가능한 콘텐츠를 제공합니다.
export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <section className="max-w-lg mx-auto w-full px-5 py-6 space-y-4">
        {/* 퀴즈 본체가 클라이언트 컴포넌트라 h1이 어디에도 없었습니다.
            제목 없는 문서는 크롤러가 주제를 잡지 못합니다. */}
        <h1 className="text-xl font-bold text-accent">상식 퀴즈 풀기</h1>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            상식 퀴즈 이용 방법
          </h2>
          <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
            매 판 10문제가 랜덤으로 출제되고, 문제당 15초의 제한 시간이
            있습니다. 정답은 10점, 힌트를 본 뒤 맞히면 5점입니다. 퀴즈가 끝나면
            결과 화면에서 틀린 문제의 정답과 해설을 오답 노트로 복습할 수
            있습니다.
          </p>
          <ul className="text-xs text-[#a0a0b0] leading-relaxed space-y-1.5">
            <li>• 오늘의 퀴즈 — 전체 카테고리에서 매일 새로운 10문제</li>
            <li>• 카테고리 퀴즈 — 원하는 주제만 골라 도전</li>
            <li>• 힌트 — 문제당 1회, 사용 시 획득 점수 절반</li>
            <li>• 최고 점수 — 카테고리별 기록이 브라우저에 저장</li>
          </ul>
          <p className="text-xs text-[#a0a0b0] leading-relaxed mt-3">
            가입이나 설치는 필요 없습니다. 최고 점수와 오늘의 퀴즈 완료 여부만
            브라우저 안에 저장되고 서버로는 보내지 않으므로, 브라우저 데이터를
            지우면 기록도 함께 사라집니다.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            점수를 올리는 요령
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              <strong className="text-[#e8e8f0]">
                모르면 바로 힌트를 쓰는 편이 낫습니다.
              </strong>{" "}
              15초 안에 답을 못 내면 0점이지만, 힌트를 보고 맞히면 5점입니다.
              망설이다 시간이 끝나는 것이 가장 손해입니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                확실한 오답부터 지우세요.
              </strong>{" "}
              보기 네 개 중 둘은 대개 분명히 틀립니다. 정답을 찾으려 하기보다
              아닌 것을 지우는 쪽이 15초 안에서는 훨씬 빠릅니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                끝나고 해설을 꼭 읽으세요.
              </strong>{" "}
              결과 화면에 틀린 문제의 정답과 해설이 모입니다. 답만 외우면 보기
              순서가 바뀌었을 때 다시 틀리지만, 해설을 읽으면 변형된 문제도
              풀립니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                한 카테고리를 먼저 끝내세요.
              </strong>{" "}
              매번 다른 주제를 섞으면 어느 것도 익숙해지지 않습니다. 한 카테고리를
              정해 반복하면 점수가 눈에 띄게 오르고, 그다음 주제로 넘어가면
              됩니다. 문제 전체를 먼저 훑고 싶다면{" "}
              <Link href="/quiz-bank" className="text-accent hover:underline">
                문제은행
              </Link>
              에서 정답과 해설을 한 번에 볼 수 있습니다.
            </p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            퀴즈 카테고리 (총 1,100여 문제)
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 text-sm text-[#a0a0b0] leading-loose">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/quiz/${cat.id}`} className="hover:text-accent">
                  <span aria-hidden="true">{cat.icon}</span> {cat.name} — 100문제
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#a0a0b0] leading-relaxed mt-3">
            어느 카테고리든 한 판은 10문제입니다.{" "}
            <Link href="/quiz?mode=daily" className="text-accent hover:underline">
              오늘의 퀴즈
            </Link>
            는 전체 카테고리에서 뽑고,{" "}
            <Link href="/battle" className="text-accent hover:underline">
              퀴즈 배틀
            </Link>
            에서는 같은 문제로 여러 명이 동시에 겨룹니다.
          </p>
        </div>
      </section>
    </>
  );
}
