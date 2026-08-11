import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("car-accident");

export default function CarAccidentPage() {
  return (
    <HelpShell id="car-accident">
      <Sec title="1분 요약 — 사고 직후 순서">
        <p>1. <strong className="text-[#e8e8f0]">즉시 정차 + 비상등</strong> — 다친 사람이 있으면 119, 그리고 112. 인명피해 사고의 경찰 신고는 법적 의무이고, 구호 없이 자리를 뜨면 뺑소니입니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">사진 4장 찍고 차를 갓길로</strong> — 전경(멀리서), 접촉 부위, 상대 번호판·바퀴, 노면 흔적. 도로 한복판 정차가 2차사고를 부릅니다.</p>
        <p>3. <strong className="text-[#e8e8f0]">상대 정보 직접 확인</strong> — 이름·연락처·차량번호·보험사. 명함만 받고 보내지 마세요.</p>
        <p>4. <strong className="text-[#e8e8f0]">내 보험사에 접수</strong>, 몸이 아프면 상대 보험사에 &ldquo;대인접수&rdquo; 요청 — 접수번호로 치료비 없이 진료받습니다.</p>
      </Sec>

      <Sec title="법이 정한 의무 — 안 하면 뺑소니">
        <p>
          도로교통법 제54조: 사고를 내면 <strong className="text-[#e8e8f0]">즉시
          정차해 부상자를 구호하고 인적사항을 제공</strong>해야 합니다. 이를 어기면
          5년 이하 징역 또는 1,500만원 이하 벌금이고, 다친 사람을 알고도 떠나면
          특정범죄가중처벌법상 도주치상(1년 이상 징역)으로 형이 크게
          올라갑니다. 인명피해가 있으면 경찰 신고도 의무입니다.
        </p>
        <p>
          상대가 &ldquo;괜찮다&rdquo;며 그냥 가자고 해도, 부상이 조금이라도
          의심되면 신고하고 기록을 남기는 것이 <strong className="text-[#e8e8f0]">나중에
          뺑소니 시비를 막는 안전한 선택</strong>입니다. 경찰 신고와 보험사
          접수는 별개라 물피 사고도 보험 처리를 하려면 보험사 접수는 따로
          해야 합니다.
        </p>
      </Sec>

      <Sec title="2차사고 예방 — 고속도로에선 사람부터 대피">
        <p>
          요즘 원칙은 &ldquo;현장 보존&rdquo;이 아니라 <strong className="text-[#e8e8f0]">빨리
          찍고 빨리 치우기</strong>입니다. 사진을 찍었으면 차를 갓길로 옮기세요.
          고속도로에서 차가 안 움직이면: 비상등 → 트렁크 개방 → <strong className="text-[#e8e8f0]">탑승자
          전원 가드레일 밖으로 대피</strong> → 신고 순서입니다. 차 안이나 차
          뒤에 서 있는 것이 가장 위험합니다. 야간 고장 시에는 멀리서도 보이는
          적색 섬광·불꽃신호 표지가 규정이지만, 표지를 설치하러 도로를 걷는 것
          자체가 위험하니 대피가 우선입니다.
        </p>
      </Sec>

      <Sec title="대인접수 — 치료비 걱정 없이 진료받는 법">
        <p>
          <strong className="text-[#e8e8f0]">대인접수</strong>는 내 몸의 피해를 가해자
          측 보험사에 접수하는 것으로, 차 수리(대물)와 별개입니다. 접수되면
          사고접수번호가 나오고, 이 번호를 병원에 제시하면 보험사
          지불보증으로 치료비를 내지 않고 진료받습니다. 교통사고 통증은
          며칠 뒤 나타나는 경우가 흔하니 <strong className="text-[#e8e8f0]">현장에서
          성급히 합의금 받고 끝내지 마세요.</strong> 상대가 대인접수를 거부하면
          경찰에 사고를 접수한 뒤 그 서류를 근거로 상대 보험사에 직접 접수를
          요구할 수 있습니다.
        </p>
      </Sec>

      <Sec title="렉카·과실 다툼·음주 상대 — 함정 3가지">
        <GuideTable
          headers={["상황", "대처"]}
          rows={[
            ["부르지 않은 사설 렉카 도착", "거절 가능 — 내 보험사 긴급출동 견인(기본 10km 무료)을 부를 것"],
            ["고속도로 견인", "한국도로공사 1588-2504 — 안전지대까지 무료 견인"],
            ["과실비율 다툼", "과실비율정보포털 accident.knia.or.kr — 유형별 기준 검색·무료 상담"],
            ["상대 음주·무면허 의심", "합의하지 말고 즉시 112 — 음주 증거는 시간이 지나면 사라짐"],
          ]}
        />
        <p>
          음주·무면허는 12대 중과실이라 상대가 보험에 들었어도, 합의를 해도
          형사처벌 대상입니다 — 피해자라면 경찰 신고가 특히 중요한 이유입니다.
          보험사 견인 무료 거리(기본 10km)를 넘기면 요금이 붙고 조건은
          보험사마다 다르니, 견인 전에 행선지(공업사)까지 거리를 확인하세요.
        </p>
        <p className="text-xs text-[#606070]">
          이 페이지는 일반 안내이며 법률·보험 자문이 아닙니다. 형사 책임은
          변호사, 보상은 가입 보험사와 상담하세요. 2026년 8월 기준.
        </p>
      </Sec>
    </HelpShell>
  );
}
