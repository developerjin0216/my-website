import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("rental-repair");

export default function RentalRepairPage() {
  return (
    <HelpShell id="rental-repair">
      <Sec title="기준은 하나 — 그것 없이 살 수 있는가">
        <p>
          민법 제623조는 <strong className="text-[#e8e8f0]">집을 사용할 수 있는
          상태로 유지할 의무를 임대인(집주인)</strong>에게 지웁니다. 대법원
          기준은 명확합니다 — 세입자가 <strong className="text-[#e8e8f0]">큰 비용
          없이 손쉽게 고칠 수 있는 사소한 것</strong>은 세입자가,{" "}
          <strong className="text-[#e8e8f0]">고치지 않으면 정상적으로 살 수 없는
          것</strong>은 집주인이 부담합니다.
        </p>
        <GuideTable
          headers={["집주인(임대인) 부담", "세입자(임차인) 부담"]}
          rows={[
            ["보일러 고장·교체 (노후)", "형광등·LED 전구 교체"],
            ["천장·벽 누수, 수도관 파열", "샤워기 헤드·수도꼭지 패킹"],
            ["창문 파손, 새시 하자", "도어락 건전지"],
            ["전기시설·계량기 고장", "변기 뚫기 등 간단한 막힘"],
            ["구조적 결함으로 인한 곰팡이", "환기 부족으로 생긴 곰팡이"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          대법원 2010다89876 판결 기준. 세입자 고의·과실로 부순 것은 당연히
          세입자 부담입니다.
        </p>
      </Sec>

      <DecisionFlow
        question="지금 어떤 상황인가요?"
        branches={[
          {
            label: "고장 났다 — 수리 요청 단계",
            steps: [
              "고장 부위를 <b>사진·영상으로 기록</b> (날짜가 남게)",
              "집주인에게 <b>문자·카톡으로 통지</b> — 세입자는 하자를 알게 되면 지체 없이 알릴 의무(민법 634조)가 있고, 늦게 알려 피해가 커진 부분은 세입자 책임이 될 수 있습니다",
              "무엇이 언제부터 고장인지, 언제까지 수리를 요청하는지 명확히 — 전화로 했다면 통화 후 문자로 요약해 보내 기록을 남기세요",
            ],
          },
          {
            label: "집주인이 수리를 거부·방치한다",
            steps: [
              "내용증명으로 기한을 정해 최종 통보 (예: 7일 내)",
              "그래도 안 하면 <b>직접 수리 후 비용 청구</b> — 필요비는 즉시 상환을 청구할 수 있습니다(민법 626조). 견적서·영수증을 반드시 보관",
              "월세에서 공제하겠다고 사전 통보하는 방법도 실무에서 쓰입니다 (일방 공제보다 합의·통보 후가 안전)",
              "수리 없이는 살 수 없는 수준이면 <b>차임 감액·계약 해지·손해배상</b>까지 가능 — 분쟁조정위 상담부터",
            ],
          },
          {
            label: "비용 분쟁이 붙었다",
            steps: [
              "<b>주택임대차분쟁조정위원회</b>에 조정 신청 — 대한법률구조공단(hldcc.or.kr)·LH·한국부동산원에서 운영, 수수료 1만~10만원으로 소송보다 훨씬 저렴",
              "양쪽이 조정안을 수락하면 강제력이 생깁니다",
              "무료 법률 상담은 대한법률구조공단 <b>132</b>",
            ],
          },
          {
            label: "입주 전 — 예방하고 싶다",
            steps: [
              "입주 당일 집 상태를 <b>구석구석 영상으로</b> 남기기 (기존 하자 증거 — 퇴거 시 원상복구 분쟁 예방)",
              "특약에 소모품 외 수선은 임대인 부담이라고 명시 요청 — 반대로 모든 수리를 세입자에게 넘기는 특약은 서명 전에 걸러내세요",
              "보일러 연식·누수 이력을 계약 전에 물어보고 답변을 문자로 받아두기",
            ],
          },
        ]}
      />

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">통지 없이 먼저 고치고 나중에 청구</strong> — 집주인이 &ldquo;그 정도는 아니었다&rdquo;고 다투면 입증이 어려워집니다. 통지 → 기한 → 수리 순서를 지키세요.</p>
        <p>❌ <strong className="text-[#e8e8f0]">수리비 대신 월세를 말없이 안 내기</strong> — 2기분 연체는 계약 해지 사유가 될 수 있습니다. 공제하더라도 근거와 통보를 남기고 하세요.</p>
        <p>❌ <strong className="text-[#e8e8f0]">겨울에 보일러 완전 끄고 장기 외출</strong> — 동파는 세입자 관리 소홀로 판단될 수 있는 대표 사례입니다. &lsquo;외출 모드&rsquo;를 유지하세요.</p>
        <p>❌ <strong className="text-[#e8e8f0]">구두 약속만 믿기</strong> — &ldquo;고쳐줄게&rdquo;라는 말은 기록이 없으면 없던 일이 됩니다.</p>
      </Sec>
    </HelpShell>
  );
}
