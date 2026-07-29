import Link from "next/link";
import GuideShell, { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildGuideMetadata } from "@/data/guides";

export const metadata = buildGuideMetadata("pension-reform");

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

// 월 300만원 근로자의 연도별 본인 부담 증가액 (개혁 전 4.5% 대비)
const EXAMPLE_SALARY = 3_000_000;

export default function PensionReformGuide() {
  const rows = [
    ["2025년 (개혁 전)", "9.0%", "4.5%", won(EXAMPLE_SALARY * 0.045)],
    ["2026년", "9.5%", "4.75%", won(EXAMPLE_SALARY * 0.0475)],
    ["2027년", "10.0%", "5.0%", won(EXAMPLE_SALARY * 0.05)],
    ["2029년", "11.0%", "5.5%", won(EXAMPLE_SALARY * 0.055)],
    ["2031년", "12.0%", "6.0%", won(EXAMPLE_SALARY * 0.06)],
    ["2033년 (최종)", "13.0%", "6.5%", won(EXAMPLE_SALARY * 0.065)],
  ];

  return (
    <GuideShell id="pension-reform">
      <Sec title="무엇이 바뀌었나 — 18년 만의 연금개혁">
        <p>
          2025년 3월 국회를 통과한 국민연금법 개정으로, 1998년 이후 9%에 묶여
          있던 보험료율이 <strong className="text-[#e8e8f0]">2026년부터 매년
          0.5%p씩 올라 2033년 13%</strong>가 됩니다. 대신 받는 돈의 기준인
          소득대체율은 41.5%에서 <strong className="text-[#e8e8f0]">43%</strong>로
          올랐습니다(2026년부터). &lsquo;더 내고 더 받는&rsquo; 구조입니다.
        </p>
        <p>
          직장가입자는 보험료를 회사와 절반씩 부담하므로, 근로자 부담은 2026년
          4.75%에서 2033년 6.5%까지 단계적으로 늘어납니다.
        </p>
      </Sec>

      <Sec title="내 월급에서 얼마나 더 나가나 (월 300만원 기준)">
        <GuideTable
          headers={["연도", "총 요율", "근로자 부담", "월 보험료"]}
          rows={rows}
        />
        <p>
          월 300만원 근로자 기준 2026년에는 월 7,500원, 2033년에는 개혁 전보다{" "}
          <strong className="text-[#e8e8f0]">월 6만원</strong>을 더 내게 됩니다.
          회사도 같은 금액을 추가 부담합니다. 올해 기준 정확한 실수령액은{" "}
          <Link href="/calculators/salary" className="text-accent underline">
            연봉 실수령액 계산기
          </Link>
          에서 확인하세요 (2026년 요율 4.75%가 반영되어 있습니다).
        </p>
      </Sec>

      <Sec title="상한액도 매년 7월 조정된다">
        <p>
          보험료를 매기는 기준소득월액에는 상한이 있어, 2026년 7월부터 1년간{" "}
          <strong className="text-[#e8e8f0]">상한 659만원·하한 41만원</strong>이
          적용됩니다. 월급이 659만원을 넘어도 보험료는 월 최대 약
          31만 3천원(659만원 × 4.75%)에서 멈춥니다. 요율 인상(매년 1월)과 상한
          조정(매년 7월)이 겹치는 해에는 고소득자의 보험료가 1년에 두 번 오르는
          셈입니다.
        </p>
      </Sec>

      <Sec title="받는 돈은 어떻게 달라지나">
        <p>
          소득대체율 43%는 &lsquo;40년 가입한 평균소득자가 생애 평균소득의
          43%를 연금으로 받는다&rsquo;는 뜻입니다. 기존 41.5% 대비 인상분은
          2026년 이후 가입 기간에만 적용되므로, 젊을수록 혜택 기간이 깁니다.
          군 복무·출산 크레딧 확대 등 가입기간을 늘려주는 제도도 함께
          강화되었습니다.
        </p>
        <p>
          내 예상 수령액은 개인 가입 이력에 따라 달라지므로, 국민연금공단
          &lsquo;내 곁에 국민연금&rsquo; 앱이나 공단 홈페이지(nps.or.kr)의 예상연금
          조회에서 확인하는 것이 정확합니다.
        </p>
      </Sec>
    </GuideShell>
  );
}
