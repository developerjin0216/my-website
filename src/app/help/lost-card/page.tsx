import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("lost-card");

export default function LostCardPage() {
  return (
    <HelpShell id="lost-card">
      <DecisionFlow
        question="어떤 상황인가요?"
        branches={[
          {
            label: "카드만 잃어버렸다",
            steps: [
              "카드사 앱 또는 콜센터(24시간)에서 <b>일시정지</b> — 찾으면 해제 가능",
              "며칠 내 못 찾으면 정식 <b>분실신고 + 재발급</b> 전환",
              "자동이체·간편결제에 등록된 카드라면 새 번호로 갱신 예약",
            ],
          },
          {
            label: "지갑째 잃어버렸다 (신분증 포함)",
            steps: [
              "아무 카드사 한 곳에 전화해 <b>&lsquo;분실 일괄신고&rsquo;</b> — 전 카드사 카드가 한 번에 정지됩니다",
              "정부24에서 <b>주민등록증 분실신고</b> — 신고 이후의 명의도용은 법적으로 다투기 쉬워집니다",
              "내가 무슨 카드가 있었는지 기억 안 나면 <b>payinfo.or.kr</b>에서 전체 조회",
              "습득물은 경찰서로 모입니다 — <b>lost112.go.kr</b>에서 날짜·장소로 검색",
            ],
          },
          {
            label: "해외에서 잃어버렸다",
            steps: [
              "카드사 <b>해외 수신자부담 번호</b>(카드사 앱·홈페이지에 국가별 표기)로 즉시 정지",
              "당장 결제 수단이 없으면 비자·마스터 <b>긴급 대체카드</b>(수일 내 현지 수령, 수수료 있음) 문의",
              "여권도 함께 잃었다면 긴급여권 가이드 참고 — 대사관·영사콜센터(+82-2-3210-0404)",
            ],
          },
          {
            label: "이미 부정사용이 발생했다",
            steps: [
              "카드사에 정지 + <b>보상 신청</b> — 신고 시점 기준 60일 전까지의 부정사용은 원칙적으로 카드사가 보상",
              "112(또는 경찰서)에 신고하고 <b>사건 접수증</b> 확보 — 보상 절차에 필요할 수 있습니다",
              "비밀번호가 필요한 거래(ATM 출금)까지 뚫렸다면 비밀번호 유출 경로를 점검하고 개인정보 유출 대처 페이지의 조치 병행",
            ],
          },
        ]}
      />
      <Sec title="1분 요약 — 지금 바로 할 일">
        <p>1. <strong className="text-[#e8e8f0]">카드사 앱 또는 콜센터로 즉시 분실신고</strong> — 24시간 접수되며, 앱에서는 &ldquo;일시정지&rdquo;로 걸어뒀다가 찾으면 해제할 수도 있습니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">한 곳에 신고하면 전 카드사 일괄신고 가능</strong> — 지갑째 잃어버렸다면 아무 카드사 한 곳에 전화해 &ldquo;분실 일괄신고&rdquo;를 요청하세요. 다른 회사 카드까지 한 번에 정지됩니다.</p>
        <p>3. 내가 무슨 카드를 갖고 있었는지 기억나지 않으면 <strong className="text-[#e8e8f0]">어카운트인포(payinfo.or.kr)</strong>에서 내 명의의 모든 카드·계좌를 조회할 수 있습니다.</p>
      </Sec>

      <Sec title="부정사용 당했다면 — 보상 기준">
        <p>
          여신전문금융업법에 따라 <strong className="text-[#e8e8f0]">분실신고 시점
          기준 60일 전까지의 부정사용액은 원칙적으로 카드사가
          보상</strong>합니다. 신고가 늦을수록 불리해지니 분실을 인지한 즉시
          신고하는 것이 핵심입니다. 다만 비밀번호 유출, 카드 뒷면 미서명, 가족
          사용 등 본인 과실이 있으면 보상이 제한될 수 있습니다.
        </p>
        <p>
          부정사용이 확인되면 카드사에 보상 신청과 함께 경찰(112)에도
          신고하세요. 신고 접수증이 보상 절차에 필요할 수 있습니다.
        </p>
      </Sec>

      <Sec title="지갑 속 신분증·면허증 재발급">
        <GuideTable
          headers={["분실물", "재발급 방법"]}
          rows={[
            ["주민등록증", "정부24 온라인 분실신고 + 재발급, 또는 주민센터 방문"],
            ["운전면허증", "안전운전 통합민원(safedriving.or.kr) 또는 경찰서·면허시험장"],
            ["여권", "영사민원24 또는 시·군·구청 여권과 (분실신고 후 재발급)"],
            ["건강보험증", "모바일 건강보험증으로 대체 가능 (The건강보험 앱)"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          신분증 분실은 명의도용 위험이 있으니, 주민등록증은 꼭 분실신고를
          해두세요 (신고해야 타인 사용 시 법적 보호를 받기 쉽습니다).
        </p>
      </Sec>

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">&ldquo;내일 찾아보고 신고하지&rdquo;</strong> — 보상은 신고 시점이 기준입니다. 신고가 늦은 기간의 부정사용은 보상에서 불리해집니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">비밀번호를 카드와 같이 보관</strong> — 비밀번호 유출이 확인되면 부정사용 보상이 제한될 수 있습니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">신분증 분실을 &lsquo;귀찮아서&rsquo; 방치</strong> — 카드는 정지하면 끝이지만, 신분증은 대출·개통 명의도용의 열쇠가 됩니다. 분실신고 + 필요시 pd.fss.or.kr 등록까지.</p>
      </Sec>

      <Sec title="현금·지갑 자체를 찾고 싶다면">
        <p>
          습득물은 경찰서로 모입니다 — 경찰청 유실물 통합포털{" "}
          <strong className="text-[#e8e8f0]">로스트112(lost112.go.kr)</strong>에서
          날짜·장소·물건 종류로 검색해보세요. 지하철에서 잃어버렸다면 해당
          노선 운영사의 유실물센터(역무실 문의)도 함께 확인하는 것이
          빠릅니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
