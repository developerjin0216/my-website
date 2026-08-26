import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("flight-delay");

export default function FlightDelayPage() {
  return (
    <HelpShell id="flight-delay">
      <Sec title="배상 기준표 (소비자분쟁해결기준)">
        <GuideTable
          headers={["국제선 지연", "배상 (구간 운임 기준)"]}
          rows={[
            ["2~4시간", "운임의 10%"],
            ["4~12시간", "운임의 20%"],
            ["12시간 초과", "운임의 30%"],
          ]}
          note="운임 = 유류할증료·공항이용료 제외 금액. 국내선은 1~2시간 10%, 2~3시간 20%, 3시간 이상 30%."
        />
        <p>
          결항은 대체편 제공 시점에 따라 <strong className="text-[#e8e8f0]">정액
          보상(국제선 USD 200~600)</strong>이 기준이고, 대체편이 없으면 전액
          환급 + 배상입니다. 단 이 기준은 권고 성격이라{" "}
          <strong className="text-[#e8e8f0]">증거를 갖춰 절차대로 요구하는 사람</strong>이
          받아냅니다 — 그 절차가 아래입니다.
        </p>
      </Sec>

      <DecisionFlow
        question="지금 어떤 상황인가요?"
        branches={[
          {
            label: "공항에서 지연·결항을 통보받았다",
            steps: [
              "카운터에서 <b>지연(결항)확인서</b>를 요청 — 모든 보상·보험 청구의 기본 서류입니다",
              "사유를 물어 <b>기록</b>하세요 (기상인지, 정비·연결편 문제인지에 따라 배상 여부가 갈립니다)",
              "항공사가 제공해야 할 것 요구: 장시간 대기 시 식사·통신, 필요시 숙박",
              "추가 지출(식사·숙박·교통)은 <b>영수증 전부 보관</b>",
            ],
          },
          {
            label: "항공사 잘못(정비·연결편)으로 늦었다",
            steps: [
              "귀국 후 항공사 고객센터·홈페이지에 <b>서면으로 배상 청구</b> — 위 기준표의 비율을 명시",
              "첨부: 탑승권, 지연확인서, 원래·실제 일정 비교, 추가 지출 영수증",
              "통상 <b>1개월 이내</b> 신청이 안전합니다",
              "거부·무응답 시 1372 → 한국소비자원 피해구제 — 이 기준표가 조정의 사실상 판단선입니다",
            ],
          },
          {
            label: "태풍·기상 때문이라고 한다",
            steps: [
              "기상·천재지변은 항공사 <b>배상 면책</b>입니다 — 배상 대신 실속 챙기기로 전환",
              "여행자보험의 <b>항공기 지연 특약</b> 확인 — 4~6시간 이상 지연 시 숙박·식사비 보상 (지연확인서 필수)",
              "결항 시 수수료 없는 전액 환급 또는 대체편 중 선택",
              "같은 날 다른 항공사는 떴는데 우리만 결항이라면 기상 면책이 다툼의 여지가 있습니다 — 운항 기록을 캡처해 두세요",
            ],
          },
          {
            label: "유럽 여행이다 (EU261)",
            steps: [
              "EU 출발 항공편(EU 항공사는 도착편도)은 <b>EU261 규정</b> 적용 — 3시간 이상 도착 지연·14일 전 미통지 결항 시 <b>거리별 250~600유로 정액</b>",
              "운임 환불과 <b>별개로</b> 받는 보상이고, 악천후·관제 파업은 면책",
              "항공사 홈페이지의 EU261 클레임 양식으로 직접 신청 (대행 서비스는 수수료 25~35%를 떼갑니다)",
              "소멸시효가 몇 년 단위로 길어 과거 여행 건도 청구 가능한 경우가 있습니다",
            ],
          },
        ]}
      />

      <Sec title="수하물이 늦거나 파손됐다면">
        <p>
          위탁 수하물 지연·분실·파손은 몬트리올 협약에 따라 배상받을 수
          있습니다. 공항에서 나가기 전에{" "}
          <strong className="text-[#e8e8f0]">수하물 사고 신고서(PIR)</strong>를
          작성하는 것이 필수이고, 파손은 7일, 지연은 21일 이내 서면 청구해야
          합니다. 지연 기간의 세면도구·속옷 등 필수품 구입 영수증은 배상
          대상입니다.
        </p>
      </Sec>

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">지연확인서 없이 공항을 떠나기</strong> — 나중에 발급받으려면 몇 배로 번거롭습니다. 그 자리에서 받는 게 원칙.</p>
        <p>❌ <strong className="text-[#e8e8f0]">&ldquo;어쩔 수 없죠&rdquo; 하고 넘어가기</strong> — 항공사 귀책 지연은 기준표가 있는 권리입니다. 요구하는 사람만 받습니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">현장에서 바우처에 서명하며 &lsquo;추가 청구 포기&rsquo; 문구 안 읽기</strong> — 소액 바우처가 전체 배상 포기 조건일 수 있습니다. 문구를 확인하고 서명하세요.</p>
      </Sec>
    </HelpShell>
  );
}
