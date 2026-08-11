import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("missing-person");

export default function MissingPersonPage() {
  return (
    <HelpShell id="missing-person">
      <Sec title="1분 요약 — 기다리지 말고 바로 신고">
        <p>1. <strong className="text-[#e8e8f0]">지금 즉시 182</strong>(경찰청 실종신고, 24시간) — &ldquo;시간이 지나야 신고할 수 있다&rdquo;는 건 <strong className="text-[#e8e8f0]">틀린 상식</strong>입니다. 대기 요건이 없고 경찰서에 갈 필요도 없습니다. 납치 등 범죄 정황이 보이면 112가 우선입니다.</p>
        <p>2. 통화하며 준비: <strong className="text-[#e8e8f0]">최근 사진, 오늘 옷차림, 마지막 목격 장소·시각</strong>, (치매 어르신이면) 지병·자주 가던 곳.</p>
        <p>3. 접수 후 마지막 목격 지점 주변을 수색하고, <strong className="text-[#e8e8f0]">안전Dream(safe182.go.kr)</strong>에서 온라인 신고를 병행하세요. 경찰이 실종경보 문자 동의를 물으면 동의하세요.</p>
        <p>4. 평시라면 오늘 바로 <strong className="text-[#e8e8f0]">지문 사전등록</strong>을 해두세요 — 등록 아동은 평균 52분 만에, 미등록은 평균 56시간 만에 발견됐습니다(경찰청).</p>
      </Sec>

      <Sec title="182 신고 — 아동·치매환자는 즉시 수색 대상">
        <p>
          실종신고는 국번 없이 <strong className="text-[#e8e8f0]">182</strong>로
          전화하면 경찰청 실종아동찾기센터가 24시간 접수합니다. 법률상
          &ldquo;실종아동등&rdquo;(18세 미만 아동, 치매환자, 지적·자폐성·정신장애인)은
          성인 가출과 달리 <strong className="text-[#e8e8f0]">접수 즉시 발견
          절차가 시작</strong>됩니다. 신고 접수 후 48시간이 기준선입니다 —
          경찰 규칙상 48시간이 지나면 장기실종으로 분류될 만큼, 초기 대응이
          결정적입니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">실종경보 문자</strong>(한국형 앰버
          경보)는 보호자가 동의하면 지역 주민들에게 인상착의 문자가
          발송되는 제도로, 발송 대상자의 약 4분의 1이 시민 제보로
          발견됐습니다(경찰청). 반대로 내가 실종경보 문자를 받았다면 사진을
          확인하고 목격 시 182로 제보하면 됩니다.
        </p>
      </Sec>

      <Sec title="최고의 대비 — 지문 사전등록 (무료·즉시)">
        <p>
          아동·치매환자·지적장애인의 지문·사진·신체특징을 경찰 시스템에 미리
          등록해 두면, 발견됐을 때 신원 확인 없이 바로 가족에게 연락이
          옵니다. <strong className="text-[#e8e8f0]">안전드림 앱에서 셀프 등록</strong>하거나
          경찰서·지구대에 방문하면 되고(가족관계 증명서류·신분증 지참), 무료로
          즉시 처리됩니다. 아이는 크면서 얼굴이 바뀌니 앱에서 사진을 주기적으로
          갱신해 주세요.
        </p>
      </Sec>

      <Sec title="치매 어르신 — 실종예방 4종 세트">
        <GuideTable
          headers={["지원", "내용·신청처"]}
          rows={[
            ["GPS 배회감지기 (행복GPS)", "기기 무상 + 통신비 2년 지원 — 치매안심센터(보건소) 신청"],
            ["복지용구 배회감지기 대여", "장기요양 등급자 — 건보공단 (본인부담 0~15%)"],
            ["배회가능 어르신 인식표", "옷에 붙이는 고유번호 — 치매안심센터 무료 발급"],
            ["치매체크 앱", "GPS 위치 확인·안심구역 이탈 알림 (복지부, 무료)"],
          ]}
        />
        <p>
          어디부터 할지 모르겠으면 <strong className="text-[#e8e8f0]">치매상담콜센터
          1899-9988</strong>(365일)로 전화하세요 — 실종 예방부터 돌봄, 가족
          심리상담까지 안내해 줍니다. 지문 사전등록도 치매안심센터에서 대행
          신청할 수 있습니다. 지역별로 배회감지기 수량·시기가 다르니 주소지
          치매안심센터에 먼저 확인하세요.
        </p>
      </Sec>

      <Sec title="연락처 정리">
        <GuideTable
          headers={["상황", "연락처"]}
          rows={[
            ["실종 신고", "182 (24시간)"],
            ["납치 등 범죄 의심", "112"],
            ["온라인 신고·사전등록", "safe182.go.kr / 안전드림 앱"],
            ["치매 상담", "1899-9988 (365일)"],
            ["복지제도 문의", "129"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          성인(18세 이상, 치매·장애 아님)의 실종은 법률상 대응 절차가 다를 수
          있습니다. 실제 상황에서는 접수 경찰관의 안내가 우선합니다. 통계는
          경찰청·보건복지부 발표 기준.
        </p>
      </Sec>
    </HelpShell>
  );
}
