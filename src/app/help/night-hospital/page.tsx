import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("night-hospital");

export default function NightHospitalPage() {
  return (
    <HelpShell id="night-hospital">
      <Sec title="지금 문 연 병원·약국 찾기">
        <GuideTable
          headers={["방법", "내용"]}
          rows={[
            ["응급의료포털 E-Gen", "e-gen.or.kr — 야간·휴일 진료기관, 당번 약국 실시간 검색"],
            ["앱 「응급의료정보제공」", "같은 정보를 앱으로 — 현 위치 기준 검색"],
            ["119 전화 상담", "증상 상담 + 진료 가능한 병원 안내까지 해줍니다"],
            ["120 (지자체 콜)", "우리 동네 당번 약국 안내"],
          ]}
        />
        <p>
          가장 확실한 건 <strong className="text-[#e8e8f0]">응급의료포털
          E-Gen</strong>입니다. 명절 연휴에는 문 여는 병원·약국 정보가 특별
          페이지로 제공됩니다.
        </p>
      </Sec>

      <Sec title="아이가 아플 때 — 달빛어린이병원">
        <p>
          <strong className="text-[#e8e8f0]">달빛어린이병원</strong>은 평일 밤과
          휴일에도 소아 진료를 하는 병원입니다. 응급실보다 대기가 짧고 비용
          부담도 적어, 열·감기 같은 경증이면 응급실 대신 이용하는 것이
          좋습니다. E-Gen에서 지역별 목록을 확인할 수 있습니다.
        </p>
        <p>
          밤중 아이 증상이 애매할 때는 119에 전화해 상담을 받아보세요 —
          구급대원이 응급실에 가야 할 상황인지 판단을 도와줍니다.
        </p>
      </Sec>

      <Sec title="응급실에 가야 하나, 참아야 하나">
        <p>
          <strong className="text-[#e8e8f0]">즉시 119</strong>: 의식이 없거나
          흐려질 때, 가슴 통증·호흡곤란, 한쪽 팔다리 마비·발음 이상(뇌졸중
          의심), 심한 출혈, 경련.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">야간 진료로 충분</strong>: 열·감기,
          가벼운 복통, 경미한 상처. 응급실은 중증도 순으로 진료해서 경증은
          오래 기다리고 비용(응급의료관리료)도 추가됩니다.
        </p>
      </Sec>

      <Sec title="약만 필요할 때">
        <p>
          당번 약국이 없는 시간대에는 <strong className="text-[#e8e8f0]">편의점
          안전상비의약품</strong>(해열진통제, 감기약, 소화제, 파스 등 13종)을
          이용할 수 있습니다. 24시간 편의점에서 구매 가능하며, 용법·용량은
          포장의 설명서를 꼭 확인하세요.
        </p>
      </Sec>
    </HelpShell>
  );
}
