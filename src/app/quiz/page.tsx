import Link from "next/link";
import QuizClient from "./QuizClient";

// 퀴즈 플레이어 자체는 클라이언트 컴포넌트라 크롤러에게 빈 화면입니다.
// 그래서 설명문을 서버에서 함께 렌더링하는데, 그 글을 layout.tsx에 두면
// /quiz 와 /quiz/<카테고리> 11개까지 12개 페이지가 똑같은 문단을 들고 있게
// 됩니다. 공통으로 둘 만한 안내(이용 방법·카테고리 목록)만 레이아웃에 남기고,
// 이 페이지에만 해당하는 글은 여기서 렌더링합니다.

export default function QuizPage() {
  return (
    <>
      <QuizClient />

      <section className="max-w-lg mx-auto w-full px-5 pt-2 space-y-4">
        {/* h1은 이 페이지에만 둡니다. 레이아웃에 두면 카테고리 페이지에
            자기 h1과 겹쳐 둘이 됩니다. */}
        <h1 className="text-xl font-bold text-accent">상식 퀴즈 풀기</h1>

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
              <strong className="text-[#e8e8f0]">확실한 오답부터 지우세요.</strong>{" "}
              보기 네 개 중 둘은 대개 분명히 틀립니다. 정답을 찾으려 하기보다 아닌
              것을 지우는 쪽이 15초 안에서는 훨씬 빠릅니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">끝나고 해설을 꼭 읽으세요.</strong>{" "}
              결과 화면에 틀린 문제의 정답과 해설이 모입니다. 답만 외우면 보기
              순서가 바뀌었을 때 다시 틀리지만, 해설을 읽으면 변형된 문제도
              풀립니다.
            </p>
            <p>
              <strong className="text-[#e8e8f0]">
                한 카테고리를 먼저 끝내세요.
              </strong>{" "}
              매번 다른 주제를 섞으면 어느 것도 익숙해지지 않습니다. 한 카테고리를
              정해 반복하면 점수가 눈에 띄게 오르고, 그다음 주제로 넘어가면 됩니다.
              문제 전체를 먼저 훑고 싶다면{" "}
              <Link href="/quiz-bank" className="text-accent hover:underline">
                문제은행
              </Link>
              에서 정답과 해설을 한 번에 볼 수 있습니다.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold mb-3 text-accent">
            점수는 어떻게 매겨지나
          </h2>
          <div className="space-y-3 text-sm text-[#a0a0b0] leading-relaxed">
            <p>
              한 판은 10문제이고 만점은 100점입니다. 정답 10점, 힌트를 본 뒤
              맞히면 5점, 틀리거나 시간이 지나면 0점입니다. 힌트는 문제당 한 번만
              열 수 있고, 한 번 열면 그 문제의 최대 점수는 5점으로 고정됩니다.
            </p>
            <p>
              제한 시간은 문제당 15초입니다. 답을 고르면 그 자리에서 맞았는지
              알려주고 바로 다음 문제로 넘어갑니다. 시간이 다 되면 자동으로
              오답 처리되고 넘어가므로, 모르겠으면 찍는 쪽이 비워두는 것보다
              낫습니다.
            </p>
            <p>
              최고 점수는 카테고리별로 따로 저장됩니다. 같은 카테고리를 여러 번
              풀면 가장 높은 점수만 남습니다. 기록은 브라우저 안에만 저장되므로
              가입할 것이 없고, 브라우저 데이터를 지우면 함께 사라집니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
