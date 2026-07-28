import Link from "next/link";
import GuideShell, { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildGuideMetadata } from "@/data/guides";

export const metadata = buildGuideMetadata("electricity-progressive");

// 단가·구간 수치는 src/utils/electricity.ts 상수(계산기와 동일 기준)와 일치해야 합니다.
export default function ElectricityProgressiveGuide() {
  return (
    <GuideShell id="electricity-progressive">
      <Sec title="누진제란 무엇인가?">
        <p>
          주택용 전기요금은 <strong className="text-[#e8e8f0]">쓰면 쓸수록 단가가 비싸지는
          3단계 누진제</strong>입니다. 처음 쓰는 전기는 kWh당 120원이지만, 많이
          쓰는 구간으로 넘어가면 같은 전기가 kWh당 307.3원 — 약 2.6배가
          됩니다. 에너지 절약을 유도하기 위한 제도로, 일반용(상가)·산업용에는
          없고 주택용에만 적용됩니다.
        </p>
      </Sec>

      <Sec title="구간과 단가 (주택용 저압 기준)">
        <GuideTable
          headers={["구간", "기타계절", "하계(7~8월)", "단가"]}
          rows={[
            ["1구간", "~200kWh", "~300kWh", "120.0원/kWh"],
            ["2구간", "201~400kWh", "301~450kWh", "214.6원/kWh"],
            ["3구간", "400kWh 초과", "450kWh 초과", "307.3원/kWh"],
          ]}
        />
        <p>
          기본요금도 도달 구간에 따라 910원 → 1,600원 → 7,300원으로 함께
          올라갑니다. 냉방 수요가 몰리는 여름(7~8월)에는 구간 경계가
          완화되어(200→300, 400→450) 같은 사용량이면 기타계절보다 요금이
          낮아집니다.
        </p>
        <p>
          하계·동계에 1,000kWh를 초과하는 사용량에는{" "}
          <strong className="text-[#e8e8f0]">슈퍼유저 요금(736.2원/kWh)</strong>이 적용됩니다.
        </p>
      </Sec>

      <Sec title="청구서에 붙는 항목들">
        <p>실제 청구액은 기본요금과 전력량요금 외에 몇 가지가 더 붙습니다.</p>
        <GuideTable
          headers={["항목", "기준"]}
          rows={[
            ["기후환경요금", "9원/kWh"],
            ["연료비조정요금", "5원/kWh"],
            ["부가가치세", "전기요금계의 10%"],
            ["전력산업기반기금", "전기요금계의 2.7%"],
          ]}
        />
        <p>
          즉 청구액 ≈ (기본요금 + 전력량요금 + 기후환경 + 연료비조정) ×
          약 1.127 입니다. 최종 금액은 10원 미만 절사됩니다.
        </p>
      </Sec>

      <Sec title="여름 요금이 무서운 진짜 이유">
        <p>
          하계 구간 완화 덕분에 같은 사용량이면 여름이 오히려 저렴합니다.
          문제는 <strong className="text-[#e8e8f0]">사용량 자체가 급증</strong>한다는 것.
          평소 300kWh 쓰던 집이 에어컨으로 600kWh를 쓰면 요금은 약 23,700원에서
          약 60,000원으로 — 사용량은 2배인데 요금은 2.5배가 됩니다. 늘어난
          300kWh의 대부분이 2·3구간 단가로 계산되기 때문입니다.
        </p>
        <p>
          우리 집 상황은{" "}
          <Link href="/calculators/aircon" className="text-accent underline">
            에어컨 전기세 계산기
          </Link>
          로 시뮬레이션해볼 수 있습니다.
        </p>
      </Sec>

      <Sec title="전기세 절약 방법 5가지">
        <p>1. <strong className="text-[#e8e8f0]">구간 경계 관리</strong> — 하계 450kWh, 기타계절 400kWh를 넘지 않도록 관리하면 최고 단가를 피할 수 있습니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">실시간 사용량 확인</strong> — 한전:ON 앱이나 파워플래너에서 이번 달 누적 사용량과 예상 요금을 확인하세요.</p>
        <p>3. <strong className="text-[#e8e8f0]">에어컨 운용</strong> — 인버터형은 26도 안팎으로 켜두는 편이, 정속형은 필요할 때만 켜는 편이 유리합니다. 필터 청소만으로도 효율이 좋아집니다.</p>
        <p>4. <strong className="text-[#e8e8f0]">대기전력 차단</strong> — 셋톱박스·공유기 등 대기전력은 가정 전력의 5% 안팎을 차지합니다.</p>
        <p>5. <strong className="text-[#e8e8f0]">에너지캐시백 신청</strong> — 한전 주택용 에너지캐시백에 가입하면 직전 2개년 대비 절감량에 따라 요금을 돌려받을 수 있습니다.</p>
      </Sec>

      <Sec title="아파트는 왜 다른가? (고압/저압)">
        <p>
          단독주택·빌라는 대부분 저압 계약이고, 아파트는 단지 전체가 고압으로
          수전하는 경우가 많습니다. 고압은 kWh당 단가가 저압보다 낮은 대신
          공용부 전기료가 관리비에 별도로 부과됩니다. 관리비 고지서의 세대
          전기료가 이웃 단독주택보다 적게 나오는 이유입니다.{" "}
          <Link href="/calculators/electricity" className="text-accent underline">
            전기요금 계산기
          </Link>
          에서 저압/고압을 선택해 비교해보세요.
        </p>
      </Sec>
    </GuideShell>
  );
}
