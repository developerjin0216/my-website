import Link from "next/link";
import GuideShell, { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildGuideMetadata } from "@/data/guides";
import {
  MIN_WAGE_2026,
  MIN_WAGE_2027,
  minWageMonthly,
} from "@/data/calculators";

export const metadata = buildGuideMetadata("minimum-wage-2027");

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

// 수치는 계산기와 동일한 상수·함수(src/data/calculators.ts)로 산출합니다.
export default function MinimumWage2027Guide() {
  return (
    <GuideShell id="minimum-wage-2027">
      <Sec title="2027년 최저임금, 시급 10,700원 확정">
        <p>
          최저임금위원회가 2026년 7월 14일 <strong className="text-[#e8e8f0]">2027년
          최저임금을 시급 10,700원</strong>으로 의결했습니다. 2026년(10,320원)보다
          3.7% 오른 금액으로, 8월 5일 고용노동부 고시를 거쳐{" "}
          <strong className="text-[#e8e8f0]">2027년 1월 1일부터</strong> 적용됩니다.
        </p>
        <GuideTable
          headers={["연도", "시급", "인상률", "월급 (209시간)"]}
          rows={[
            ["2024년", "9,860원", "2.5%", "2,060,740원"],
            ["2025년", "10,030원", "1.7%", "2,096,270원"],
            ["2026년", "10,320원", "2.9%", "2,156,880원"],
            ["2027년", "10,700원", "3.7%", "2,236,300원"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          월급은 주 40시간 근무 + 주휴수당 포함(월 209시간 환산) 세전 기준입니다.
        </p>
      </Sec>

      <Sec title="주휴수당까지 계산하면 실질 시급은?">
        <p>
          주 15시간 이상 일하고 개근하면 주휴수당(1일분 유급휴일)이 붙습니다.
          주 40시간 근무 기준으로 주휴수당을 포함한 실질 시급은{" "}
          <strong className="text-[#e8e8f0]">
            2027년 {won(MIN_WAGE_2027 * 1.2)}
          </strong>
          (10,700원 × 1.2)입니다. 알바 급여를 계산할 때 주휴수당을 빼먹으면
          법정 최저임금 미달이 될 수 있습니다.
        </p>
        <GuideTable
          headers={["주 근무시간", "2026년 월급", "2027년 월급"]}
          rows={[15, 25, 40].map((h) => [
            `주 ${h}시간`,
            won(minWageMonthly(MIN_WAGE_2026, h)),
            won(minWageMonthly(MIN_WAGE_2027, h)),
          ])}
        />
        <p>
          내 근무시간 기준 정확한 금액은{" "}
          <Link
            href="/calculators/minimum-wage"
            className="text-accent underline"
          >
            최저임금·주휴수당 계산기
          </Link>
          에서 바로 확인할 수 있습니다.
        </p>
      </Sec>

      <Sec title="알아두면 좋은 규정">
        <p>
          <strong className="text-[#e8e8f0]">수습 감액</strong> — 1년 이상 근로계약을
          맺은 경우에만 수습 시작 후 3개월까지 최저임금의 90%를 지급할 수
          있습니다. 1년 미만 계약이나 단순노무직은 감액할 수 없습니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">적용 범위</strong> — 최저임금은 근로자
          1명 이상을 고용한 모든 사업장에 적용됩니다. 5인 미만 사업장, 알바,
          외국인 근로자도 예외가 아닙니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">위반 시</strong> — 최저임금보다 적게
          지급하면 3년 이하의 징역 또는 2천만원 이하의 벌금 대상이며, 차액은
          소급해서 청구할 수 있습니다(임금채권 소멸시효 3년).
        </p>
      </Sec>

      <Sec title="월급이 최저임금 위반인지 확인하는 법">
        <p>
          월급제 근로자는 [월급 ÷ 209시간]으로 시급을 환산해 최저시급과
          비교합니다. 2027년 기준 월 2,236,300원 미만이면(주 40시간 기준)
          최저임금 위반 소지가 있습니다. 다만 식대·교통비 등 복리후생비와
          상여금은 일정 기준에 따라 산입 범위가 다르니, 애매하면 고용노동부
          상담센터(1350)에 확인하는 것이 정확합니다.
        </p>
      </Sec>
    </GuideShell>
  );
}
