import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("medical-cost");

export default function MedicalCostPage() {
  return (
    <HelpShell id="medical-cost">
      <Sec title="한눈에 보기 — 상황별로 제도가 다릅니다">
        <GuideTable
          headers={["상황", "제도", "어디에"]}
          rows={[
            ["응급실인데 당장 낼 돈이 없다", "응급의료비 대지급", "병원 원무과"],
            ["갑작스러운 위기로 병원비가 막막하다", "긴급복지 의료지원", "129 전화"],
            ["큰 병으로 의료비가 감당이 안 된다", "재난적의료비 지원", "건보공단 1577-1000"],
          ]}
        />
        <p>
          &ldquo;129에 전화하면 3,000만원&rdquo;이라는 말은 이 제도들이 섞인
          이야기입니다 — 정확히는 <strong className="text-[#e8e8f0]">129는 긴급복지(300만원
          수준)</strong>, <strong className="text-[#e8e8f0]">최대 3,000만원은 재난적의료비
          지원</strong>입니다. 아래에서 하나씩 정리합니다.
        </p>
      </Sec>

      <Sec title="① 응급실 비용이 당장 없을 때 — 응급의료비 대지급제도">
        <p>
          응급 상황이면 <strong className="text-[#e8e8f0]">돈이 없어도 먼저 진료받을 수
          있습니다.</strong> 병원 원무과에 &ldquo;응급의료비 대지급제도를
          이용하겠다&rdquo;고 말하고 미납확인서를 작성하면, 건강보험심사평가원이
          병원에 비용을 대신 지급합니다.
        </p>
        <p>
          환자는 나중에 심평원에 <strong className="text-[#e8e8f0]">최대 12개월 무이자
          분할</strong>로 갚으면 됩니다. 응급증상(의식장애, 심한 출혈, 호흡곤란
          등)으로 진료받은 경우에 적용되며, 병원이 제도를 먼저 안내하지 않는
          경우도 있으니 <strong className="text-[#e8e8f0]">환자 쪽에서 먼저
          요청</strong>하는 것이 중요합니다.
        </p>
      </Sec>

      <Sec title="② 위기 상황의 병원비 — 긴급복지 의료지원 (129)">
        <p>
          주소득자의 사망·질병, 실직, 화재 같은 <strong className="text-[#e8e8f0]">갑작스러운
          위기</strong>로 의료비를 감당하기 어려울 때, 보건복지상담센터{" "}
          <strong className="text-[#e8e8f0]">129</strong> 또는 주민센터에 신청하면{" "}
          <strong className="text-[#e8e8f0]">1회 최대 300만원</strong>(필요시 1회 추가)의
          의료비를 지원받을 수 있습니다.
        </p>
        <p>
          핵심은 <strong className="text-[#e8e8f0]">&ldquo;선지원 후조사&rdquo;</strong> —
          위기 사유가 인정되면 소득·재산 조사는 나중에 하고 먼저 지원합니다.
          단, 원칙적으로 <strong className="text-[#e8e8f0]">퇴원(비용 정산) 전에
          신청</strong>해야 하니 병원비 걱정이 되는 순간 바로 129에 전화하세요.
          생계비·주거비 지원도 같은 창구에서 상담할 수 있습니다.
        </p>
      </Sec>

      <Sec title="③ 의료비 폭탄 — 재난적의료비 지원 (최대 3천만원)">
        <p>
          암·중증질환 등으로 <strong className="text-[#e8e8f0]">소득에 비해 과도한
          의료비</strong>가 발생하면, 국민건강보험공단이 본인부담 의료비의{" "}
          <strong className="text-[#e8e8f0]">50~80%를 연간 2천만원까지, 개별심사를 거치면
          최대 3천만원까지</strong> 지원합니다 (소득 구간별 차등).
        </p>
        <GuideTable
          headers={["항목", "내용"]}
          rows={[
            ["신청처", "국민건강보험공단 지사 (문의 1577-1000)"],
            ["기한", "퇴원일 다음 날부터 180일 이내 (입원 중에도 가능)"],
            ["대상", "기준중위소득 100% 이하 중심 + 의료비 부담 기준 충족"],
            ["제외", "미용·성형, 상급병실료, 간병비 등"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          기준·한도는 개정될 수 있으니 신청 전 건보공단(1577-1000)에서 최신
          기준을 확인하세요.
        </p>
      </Sec>

      <Sec title="이것도 알아두세요">
        <p>
          <strong className="text-[#e8e8f0]">병원 사회복지팀(의료사회복지사)</strong> —
          대학병원급에는 의료비 지원 제도를 연결해주는 사회복지팀이 있습니다.
          치료비가 막막하면 &ldquo;사회복지팀 상담을 받고 싶다&rdquo;고
          요청하세요. 민간 재단 지원 사업까지 함께 찾아줍니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">본인부담상한제</strong> — 건강보험 적용
          의료비의 연간 본인부담이 소득별 상한을 넘으면 초과분을 건보공단이
          이듬해 돌려줍니다. 별도 신청 없이도 공단이 안내문을 보내지만,
          1577-1000에서 미리 확인할 수 있습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
