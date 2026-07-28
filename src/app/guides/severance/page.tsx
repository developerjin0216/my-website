import Link from "next/link";
import GuideShell, { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildGuideMetadata } from "@/data/guides";

export const metadata = buildGuideMetadata("severance");

export default function SeveranceGuide() {
  return (
    <GuideShell id="severance">
      <Sec title="누가 퇴직금을 받을 수 있나?">
        <p>
          「근로자퇴직급여 보장법」상 요건은 두 가지뿐입니다:{" "}
          <strong className="text-[#e8e8f0]">계속근로기간 1년 이상</strong> +{" "}
          <strong className="text-[#e8e8f0]">4주 평균 주 15시간 이상 근무</strong>. 이 두
          가지를 충족하면 정규직·계약직·아르바이트 등 고용형태와 무관하게 퇴직금을
          받을 수 있고, 5인 미만 사업장도 지급 대상입니다(연차휴가와 달리 예외가
          없습니다).
        </p>
        <p>
          계약을 반복 갱신한 알바도 실질적으로 근로가 이어졌다면 기간을 합산해
          1년을 계산합니다.
        </p>
      </Sec>

      <Sec title="퇴직금 계산 방법">
        <p>
          퇴직금 = <strong className="text-[#e8e8f0]">1일 평균임금 × 30일 × (재직일수 ÷
          365)</strong>
        </p>
        <p>
          1일 평균임금은 퇴직일 이전 3개월간 받은 임금 총액을 그 기간의 총
          일수(약 89~92일)로 나눈 금액입니다. 기본급뿐 아니라 고정수당, 연간
          상여금의 3/12, 연차수당의 3/12가 포함됩니다. 계산된 평균임금이
          통상임금보다 적으면 통상임금으로 계산해야 합니다.
        </p>
        <GuideTable
          headers={["월급 300만원 기준", "예상 퇴직금 (세전)"]}
          rows={[
            ["1년 근속", "약 296만원"],
            ["3년 근속", "약 888만원"],
            ["10년 근속", "약 2,959만원"],
          ]}
        />
        <p>
          내 입사일·급여 기준 정확한 금액은{" "}
          <Link href="/calculators/severance" className="text-accent underline">
            퇴직금 계산기
          </Link>
          에서 확인하세요. 남은 연차가 있다면{" "}
          <Link href="/calculators/annual-leave" className="text-accent underline">
            연차 계산기
          </Link>
          로 연차수당도 함께 챙기세요.
        </p>
      </Sec>

      <Sec title="지급기한은 14일 — 늦으면 이자가 붙는다">
        <p>
          퇴직금은 퇴직일로부터 <strong className="text-[#e8e8f0]">14일 이내</strong>에
          지급해야 합니다(당사자 합의로 연장 가능). 기한을 넘기면 연 20%의
          지연이자가 발생하고, 계속 미지급하면 고용노동부 노동포털에서 임금체불
          진정을 제기할 수 있습니다. 3년이 지나면 청구권이 소멸하니 미루지 마세요.
        </p>
      </Sec>

      <Sec title="퇴직금은 IRP 계좌로 받는다">
        <p>
          2022년 4월 14일부터 퇴직급여는 원칙적으로 본인 명의{" "}
          <strong className="text-[#e8e8f0]">IRP(개인형 퇴직연금) 계좌로 지급</strong>됩니다.
          55세 이후 퇴직하거나 퇴직금이 300만원 이하인 경우 등은 일반 계좌로 받을
          수 있습니다.
        </p>
        <p>
          IRP로 받은 뒤 바로 해지해 현금화할 수도 있지만, 연금으로 수령하면
          퇴직소득세의 30~40%가 감면되므로 당장 쓸 돈이 아니라면 유지가
          유리합니다.
        </p>
      </Sec>

      <Sec title="퇴직소득세 — 생각보다 적게 뗀다">
        <p>
          퇴직금은 급여와 합산하지 않고 별도로 과세(분류과세)합니다. 근속연수에
          비례한 근속연수공제와 환산급여 공제가 적용되어, 같은 금액의 월급보다
          세부담이 훨씬 낮고 근속이 길수록 실효세율이 더 떨어집니다. 수천만원
          퇴직금의 실효세율이 한 자릿수인 경우가 많습니다.
        </p>
      </Sec>

      <Sec title="중간정산은 원칙적으로 금지">
        <p>
          재직 중 퇴직금 중간정산은 원칙적으로 금지이며, 무주택자의 주택 구입·
          전세보증금 부담, 본인·가족의 6개월 이상 요양, 파산·개인회생 등 법정
          사유에 해당할 때만 가능합니다.
        </p>
        <p>
          참고로 &ldquo;연봉에 퇴직금 포함&rdquo; 특약으로 매월 나눠 지급하는
          방식은 법적으로 퇴직금 지급으로 인정되지 않습니다 — 퇴직 시 별도로
          청구할 수 있습니다.
        </p>
      </Sec>
    </GuideShell>
  );
}
