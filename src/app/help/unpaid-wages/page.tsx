import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";
import { CALC_URL } from "@/lib/site";

export const metadata = buildHelpMetadata("unpaid-wages");

export default function UnpaidWagesPage() {
  return (
    <HelpShell id="unpaid-wages">
      <Sec title="1분 요약 — 월급이 안 들어왔다면">
        <p>1. <strong className="text-[#e8e8f0]">증거부터 확보</strong> — 카톡·문자, 통장 입금내역, 출퇴근 기록. 근로계약서가 없어도 신고할 수 있으니, 사업주가 지우기 전에 캡처하세요.</p>
        <p>2. <strong className="text-[#e8e8f0]">노동포털(labor.moel.go.kr)에서 온라인 진정 접수</strong> — 24시간 접수. 방문한다면 내 집이 아니라 &ldquo;회사 소재지&rdquo; 관할 노동청입니다.</p>
        <p>3. 조사에서 체불이 확정되면 <strong className="text-[#e8e8f0]">&ldquo;체불 임금등·사업주 확인서&rdquo;</strong>를 발급받으세요 — 다음 단계의 핵심 서류입니다.</p>
        <p>4. 사업주가 그래도 안 주면 <strong className="text-[#e8e8f0]">간이대지급금</strong> — 국가(근로복지공단)가 먼저 지급합니다(퇴직자 최대 1,000만원).</p>
      </Sec>

      <Sec title="근로계약서가 없어도 됩니다">
        <p>
          실제로 일한 사실이 입증되면 근로관계는 성립합니다. 급여 통장
          입금내역(과거 지급액), 업무 지시 카톡·문자, 출퇴근 기록, 4대보험
          가입내역, 채용공고 캡처가 모두 증거가 됩니다. 체불 내역은
          &ldquo;2026년 3~6월 근무, 월 220만원 4개월분 880만원 미지급&rdquo;처럼{" "}
          <strong className="text-[#e8e8f0]">기간·금액을 구체적으로</strong> 정리해
          두세요. 어디서부터 할지 막막하면 고용노동부 상담센터{" "}
          <strong className="text-[#e8e8f0]">1350</strong>(평일 09~18시)에 먼저
          전화해도 됩니다.
        </p>
      </Sec>

      <Sec title="진정 접수 — 온라인이 가장 빠릅니다">
        <GuideTable
          headers={["항목", "내용"]}
          rows={[
            ["온라인 접수", "노동포털 labor.moel.go.kr → 민원신청 → 진정서(임금체불)"],
            ["방문 접수", "사업장 소재지 관할 노동청 고객지원실"],
            ["처리 기간", "25일 (토·공휴일 제외, 연장될 수 있음)"],
            ["전화 상담", "국번없이 1350"],
          ]}
        />
        <p>
          접수하면 근로감독관이 배정되어 양측을 조사하고, 체불이 확인되면
          사업주에게 시정지시가 나갑니다. 진행 단계마다 문자로 통보됩니다.
          참고로 <strong className="text-[#e8e8f0]">진정</strong>은 &ldquo;돈을 받게
          해달라&rdquo;, <strong className="text-[#e8e8f0]">고소</strong>는
          &ldquo;처벌해달라&rdquo;는 절차로, 보통 진정으로 시작합니다. 임금채권
          소멸시효는 3년이니 미루지 마세요.
        </p>
      </Sec>

      <Sec title="간이대지급금 — 사업주 대신 국가가 먼저 줍니다">
        <p>
          사업주가 못 주든 안 주든, 체불이 확정되면{" "}
          <strong className="text-[#e8e8f0]">근로복지공단이 먼저 지급하고 사업주에게
          회수</strong>하는 제도입니다. 소송 없이 &ldquo;체불 임금등·사업주
          확인서&rdquo;만으로 청구할 수 있습니다.
        </p>
        <GuideTable
          headers={["항목", "내용"]}
          rows={[
            ["퇴직자 상한", "총 1,000만원 (임금 최대 700만 + 퇴직급여 최대 700만)"],
            ["재직자 상한", "최대 700만원 (임금만, 같은 사업장 1회)"],
            ["지급 범위", "최종 3개월분 임금 + 최종 3년간 퇴직급여"],
            ["신청처", "고용·산재보험 토탈서비스(total.comwel.or.kr) 또는 공단 지사"],
            ["신청 기한", "확인서 발급일부터 6개월 이내"],
            ["주의", "퇴직 다음 날부터 1년 이내에 진정을 제기해야 요건 충족"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          상한액·요건은 고시 개정으로 바뀔 수 있으니 신청 전 근로복지공단에서
          최신 기준을 확인하세요.
        </p>
      </Sec>

      <Sec title="알아두면 힘이 되는 것들">
        <p>
          <strong className="text-[#e8e8f0]">지연이자 연 20%</strong> — 퇴직 후 14일이
          지나면 체불액에 연 20% 이자가 붙고, 2025년 10월부터는 재직 중 체불에도
          적용됩니다. <strong className="text-[#e8e8f0]">사업주 처벌</strong>은 3년 이하
          징역 또는 3,000만원 이하 벌금 — 다만 반의사불벌죄라서,{" "}
          <strong className="text-[#e8e8f0]">합의서·처벌불원서는 반드시 실제 입금을
          확인한 뒤에</strong> 써주세요. 2025년 개정으로 상습 체불 사업주는
          출국금지·최대 3배 징벌적 배상 대상이 됐습니다.
        </p>
        <p>
          한 가지 주의: 고용노동부는 출석요구서를 이메일로 보내거나 문자에
          링크를 넣지 않습니다 — 노동부 사칭 피싱에 주의하세요. 밀린 급여를
          받으면{" "}
          <a href={`${CALC_URL}/calculators/salary`} className="text-[#ffd700] underline">실수령액 계산기</a>로
          공제 내역을, 퇴사했다면{" "}
          <a href={`${CALC_URL}/calculators/severance`} className="text-[#ffd700] underline">퇴직금 계산기</a>로
          받을 금액을 확인해 보세요.
        </p>
        <p className="text-xs text-[#606070]">
          이 페이지는 일반 절차 안내이며 법률 자문이 아닙니다. 구체적 사건은
          1350 또는 공인노무사·변호사와 상담하세요.
        </p>
      </Sec>
    </HelpShell>
  );
}
