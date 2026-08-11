import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("outdoor-injury");

export default function OutdoorInjuryPage() {
  return (
    <HelpShell id="outdoor-injury">
      <Sec title="1분 요약">
        <p>1. <strong className="text-[#e8e8f0]">벌 쏘임</strong> — 침이 보이면 카드로 긁어 빼고 냉찜질. 호흡곤란·어지럼·전신 두드러기가 시작되면 아나필락시스 — <strong className="text-[#e8e8f0]">즉시 119</strong>.</p>
        <p>2. <strong className="text-[#e8e8f0]">뱀 물림</strong> — 입으로 빨기·칼로 째기·꽉 묶기 전부 금지. 물린 부위를 심장보다 낮게, 움직임 최소화, 즉시 119로 병원 이송.</p>
        <p>3. <strong className="text-[#e8e8f0]">개 물림</strong> — 비누와 흐르는 물로 충분히 씻고 병원으로. 견주 연락처·사진·목격자 확보, 필요하면 112.</p>
        <p>4. <strong className="text-[#e8e8f0]">벌집 발견</strong> — 건드리지 말고 119 신고(무료 제거). 건드렸다면 머리를 감싸고 20m 이상 벗어나세요.</p>
      </Sec>

      <Sec title="벌 쏘임 — 골든타임은 아나필락시스 감시">
        <p>
          꿀벌 침이 박혀 있으면 <strong className="text-[#e8e8f0]">카드로 밀어
          긁어서</strong> 빼세요 — 핀셋·손가락으로 집으면 독주머니를 짜서 독을 더
          밀어 넣게 됩니다(소방청). <strong className="text-[#e8e8f0]">말벌은 침이
          안 남으니</strong> 침 찾느라 시간 쓰지 말고 바로 씻고 냉찜질하며 증상을
          지켜보세요. 말벌 독은 꿀벌보다 강합니다.
        </p>
        <p>
          쏘인 뒤 <strong className="text-[#e8e8f0]">호흡곤란·어지럼·전신
          두드러기·구토</strong>가 나타나면 아나필락시스입니다 — 수 분 만에
          심정지까지 갈 수 있으니 즉시 119에 &ldquo;벌에 쏘였다&rdquo;고 알리고,
          환자를 눕혀 다리를 심장보다 높게 올리세요. 벌쏘임 119 이송의 약
          8할이 7~9월(벌초·성묘철)에 집중됩니다 — 산에 갈 땐 밝은색 긴소매를
          입고 향수·단 음료를 피하세요.
        </p>
      </Sec>

      <Sec title="뱀 물림 — '하지 말 것'이 절반입니다">
        <GuideTable
          headers={["행동", "이유"]}
          rows={[
            ["❌ 입으로 독 빨아내기", "독이 입으로 흡수되고 상처가 2차 감염"],
            ["❌ 칼로 상처 절개", "혈관·신경 손상, 감염 위험만 증가"],
            ["❌ 노끈으로 꽉 묶기", "혈류 차단으로 괴사 위험"],
            ["❌ 뱀 잡아서 확인", "2차 물림 — 치료는 병원 항독소가 전부"],
            ["⭕ 심장보다 낮게·부목 고정", "독 확산을 늦춤"],
            ["⭕ 반지·시계 미리 빼기", "부어오른 뒤엔 못 뺌"],
          ]}
        />
        <p>
          잘못된 응급처치로 상태가 악화된 사례가 실제 소방 통계에 잡힐 만큼
          흔합니다. 독사인지 구별하는 데 시간 쓰지 말고{" "}
          <strong className="text-[#e8e8f0]">빨리 병원에 가는 것</strong>이 유일한
          정답입니다. 별로 안 아파도 반드시 진료받으세요 — 뱀 물림은 입원율이
          높은 중증 손상입니다.
        </p>
      </Sec>

      <Sec title="개 물림 — 치료 다음은 배상입니다">
        <p>
          <strong className="text-[#e8e8f0]">비누 + 흐르는 물 세척</strong>이
          최우선입니다(문지르지 말고 꼼꼼히). 이후 병원에서 파상풍 접종 여부
          확인과 상처 처치를 받으세요. 참고로 국내 동물 광견병은 2013년 이후
          보고가 없지만, 야생동물이나 접종 이력을 모르는 개에 물렸다면
          의료기관에서 노출 평가를 받아야 합니다(질병관리청).
        </p>
        <p>
          현장에서 <strong className="text-[#e8e8f0]">견주 인적사항·연락처, 상처와
          현장 사진, 목격자, CCTV</strong>를 확보하세요 — 나중에 부인하는 견주가
          많습니다. 견주는 과실치상(형사)과 민법상 동물점유자 책임(민사)을
          지며, 치료비·위자료는 견주의{" "}
          <strong className="text-[#e8e8f0]">일상생활배상책임보험</strong>(상해·화재보험
          특약)으로 처리되는 경우가 많으니 가입 여부를 물어보세요. 목줄 등
          안전조치 위반으로 사람을 다치게 하면 동물보호법상 2년 이하 징역 또는
          2천만원 이하 벌금으로 가중됩니다.
        </p>
      </Sec>

      <Sec title="신고처 정리">
        <GuideTable
          headers={["상황", "연락처"]}
          rows={[
            ["응급 이송·벌집 제거", "119 (벌집 제거 무료)"],
            ["개 물림 형사 신고", "112"],
            ["목줄 미착용 등 지자체 민원", "지역번호 + 120"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          이 페이지는 일반 응급대처 안내이며 의료인의 진단·치료를 대체하지
          않습니다. 벌독 알레르기 병력이 있으면 증상이 없어도 즉시 진료받고,
          처방받은 에피네프린 자가주사기가 있다면 의사 지시에 따라 사용하세요.
        </p>
      </Sec>
    </HelpShell>
  );
}
