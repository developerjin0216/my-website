import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("night-hospital");

export default function NightHospitalPage() {
  return (
    <HelpShell id="night-hospital">
      <DecisionFlow
        question="지금 상황에 맞는 길을 고르세요"
        branches={[
          {
            label: "증상이 심각하다 / 판단이 안 선다",
            steps: [
              "의식 저하·가슴통증·호흡곤란·마비·심한 출혈·경련이면 <b>즉시 119</b>",
              "판단이 안 서면 119에 전화해 <b>상담</b>을 요청하세요 — 신고가 아니어도 응급실行 여부를 안내해 줍니다",
              "119 구급차는 <b>무료</b>입니다. 비용 걱정으로 망설이지 마세요",
            ],
          },
          {
            label: "아이가 아프다",
            steps: [
              "경증(열·감기)이면 <b>달빛어린이병원</b> — 응급실보다 빠르고 저렴 (E-Gen에서 지역별 검색)",
              "3개월 미만 38도 이상, 열성경련, 축 처짐은 <b>즉시 응급실</b>",
              "해열제 복용 여부·시간을 메모해 가면 진료가 빨라집니다",
            ],
          },
          {
            label: "성인, 경증인데 병원이 닫았다",
            steps: [
              "<b>e-gen.or.kr</b>(응급의료포털)에서 지금 문 연 병·의원 검색",
              "응급실은 경증이면 몇 시간 대기 + 응급의료관리료 본인부담 — 야간 진료 의원이 합리적",
              "다음날 진료로 충분한지 119 상담으로 확인하는 것도 방법",
            ],
          },
          {
            label: "약만 필요하다",
            steps: [
              "E-Gen 또는 <b>120</b>으로 당번 약국 확인",
              "당번 약국도 없으면 24시간 편의점의 <b>안전상비의약품 13종</b>(해열진통제·감기약·소화제·파스)",
              "복용 중인 약과의 중복(특히 아세트아미노펜)을 포장 설명서로 확인",
            ],
          },
        ]}
      />
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
