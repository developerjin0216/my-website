import Link from "next/link";
import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

// 집에 미리 갖춰 둘 비상용품 — 정전·단수·화재·한파·지진.
//
// "삶의 질 올리는 추천템"을 이 사이트 목소리로 쓴 글입니다. 급할 때 사면 제일 비싸고
// 품절되는 물건을 미리 두자는 것이고, 모든 품목은 다른 안내 글이 실제로 권하는 것입니다
// (정전 글의 랜턴, 동파 글의 보온재, 화재 글의 소화기…). 그래서 품목마다 그 글로 링크합니다.
//
// 수량(물 며칠치·몇 리터)과 점검 주기(몇 개월)는 쓰지 않습니다 — 기관 안내마다 다르고,
// 저장소에 없는 숫자입니다. "며칠 버틸 양", "계절 바뀔 때"로 씁니다.
// 쇼핑 블록은 helpGear(셸)가 한 개 붙입니다 — 페이지당 하나 규칙.

export const metadata = buildHelpMetadata("emergency-kit");

export default function EmergencyKitPage() {
  return (
    <HelpShell id="emergency-kit">
      <Sec title="왜 미리인가 — 급할 때는 못 삽니다">
        <p>
          정전이 나면 동네 편의점 손전등과 건전지가 먼저 빠지고, 한파 예보가 뜨면 핫팩과
          보온재가 품절되고, 눈이 오기 시작하면 체인은 배송이 늦습니다. 이 사이트의 안내
          글들이 공통으로 말하는 것이 있습니다 —{" "}
          <strong className="text-[#e8e8f0]">그 물건이 집에 있느냐가 그날의 결과를 가른다</strong>는
          것. 이 글은 그 물건들을 한 번에 모은 체크리스트입니다. 전부 살 필요는 없습니다. 우리
          집에 올 법한 상황부터 고르세요.
        </p>
      </Sec>

      <Sec title="상황별 — 뭐가 있어야 하나">
        <GuideTable
          headers={["상황", "있어야 하는 것", "왜"]}
          rows={[
            ["정전", "LED 랜턴, 보조배터리, 건전지 라디오", "휴대폰 손전등은 배터리를 빨리 씁니다. 복구 안내와 재난문자를 받으려면 폰이 켜져 있어야 합니다"],
            ["단수", "생수 묶음, 물통", "단수 안내가 뜨면 마실 물부터 확보해야 합니다. 받아 둘 통이 있어야 씁니다"],
            ["화재", "가정용 소화기, 단독경보형 감지기", "초기 소화는 소화기가 손 닿는 곳에 있느냐로 갈리고, 자다 나는 불은 경보가 깨웁니다"],
            ["한파·동파", "핫팩, 계량기 보온재(헌 옷·비닐), 배관 보온재", "보온 미비가 동파 원인의 대부분입니다. 한파 예보 뒤에는 품절됩니다"],
            ["차", "점프스타터, 스노우체인, 담요", "배터리 방전과 눈길 갇힘은 갇힌 뒤에는 살 수 없는 물건이 답입니다"],
            ["다침", "휴대용 구급함", "소독·지혈·붕대는 밤에 약국이 닫혀 있을 때 필요합니다"],
            ["대피", "비상가방 (아래 구성)", "지진·화재·침수로 집을 나와야 할 때 챙길 시간이 없습니다"],
          ]}
        />
        <p className="text-xs text-[#8a90a0]">
          각 상황의 행동 순서는{" "}
          <Link href="/help/utility-outage" className="text-accent underline">정전·단수</Link>
          {" · "}
          <Link href="/help/fire" className="text-accent underline">화재</Link>
          {" · "}
          <Link href="/help/frozen-pipes" className="text-accent underline">동파</Link>
          {" · "}
          <Link href="/help/car-wont-start" className="text-accent underline">차 시동</Link>
          {" · "}
          <Link href="/help/natural-disaster" className="text-accent underline">재난 대피</Link>
          {" "}글에 있습니다. 물건은 그 글들이 권하는 것만 골랐습니다.
        </p>
      </Sec>

      <Sec title="비상가방 — 들고 나갈 하나">
        <p>
          지진·화재·침수로 집을 비워야 할 때 <strong className="text-[#e8e8f0]">현관 근처에서
          집어 들고 나가는 가방</strong> 하나입니다. 평소에 쓰는 물건과 섞지 말고 따로 둡니다.
        </p>
        <GuideTable
          headers={["구분", "넣을 것"]}
          rows={[
            ["신원·돈", "신분증 사본, 가족 연락처 적은 종이, 현금 약간(정전이면 카드가 안 됩니다)"],
            ["물·먹을 것", "생수, 개봉 없이 먹을 수 있는 비상식량 — 며칠 버틸 양"],
            ["빛·정보", "손전등 또는 랜턴, 여분 건전지, 보조배터리, 건전지 라디오"],
            ["몸", "구급함, 복용 중인 약 며칠치, 마스크, 담요 또는 보온 시트, 호루라기"],
            ["생활", "물티슈, 휴지, 비닐봉지, 여분 양말·속옷, 멀티툴"],
          ]}
        />
        <p className="text-xs text-[#8a90a0]">
          호루라기는 갇혔을 때 소리치는 것보다 오래, 멀리 갑니다. 구급함과 약은 유효기간이
          있으니 계절이 바뀔 때 한 번 열어 보세요.
        </p>
      </Sec>

      <Sec title="어디에 둘지가 절반입니다">
        <p>
          <strong className="text-[#e8e8f0]">소화기는 불이 날 곳 근처가 아니라 거기서 나오는
          길목</strong>에 둡니다 — 주방 입구, 현관 근처. 불 옆에 두면 불 때문에 못 집습니다.
          감지기는 침실과 거실 천장. 랜턴과 보조배터리는 정전 뒤 어둠 속에서 손으로 찾을 수
          있는 한 자리에 고정하세요(현관 신발장 위, 침대 머리맡 서랍). 비상가방은 현관.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">가스 옆·보일러실·직사광선·차 트렁크 여름</strong>은
          보조배터리와 건전지를 두기에 나쁜 자리입니다. 열에 약합니다.
        </p>
      </Sec>

      <Sec title="사 두고 끝이 아닙니다 — 계절 바뀔 때 한 번">
        <GuideTable
          headers={["점검", "확인할 것"]}
          rows={[
            ["건전지·보조배터리", "방전됐는지, 유통기한. 보조배터리는 비워 두면 수명이 줍니다 — 가끔 충전"],
            ["소화기", "압력 게이지 바늘이 정상 범위에 있는지, 안전핀·호스 상태"],
            ["감지기", "시험 버튼을 눌러 소리가 나는지. 건전지식은 교체"],
            ["물·식량·약", "유통기한. 지난 것은 평소에 먹고 새로 채웁니다"],
            ["차 용품", "체인이 지금 타이어 규격에 맞는지, 점프스타터 충전"],
          ]}
        />
        <p className="text-xs text-[#8a90a0]">
          한꺼번에 점검하기 어려우면 &lsquo;보일러 켜는 날&rsquo;과 &lsquo;에어컨 켜는 날&rsquo;을
          점검일로 정하세요. 1년에 두 번이면 충분합니다.
        </p>
      </Sec>

      <Sec title="우리 집에 더 필요한 것">
        <p>
          <strong className="text-[#e8e8f0]">아이가 있으면</strong> 분유·이유식·기저귀 며칠치와
          아이가 안정하는 물건 하나. <strong className="text-[#e8e8f0]">어르신·지병이 있으면</strong>{" "}
          복용 약 목록과 약 여유분, 안경 여분. <strong className="text-[#e8e8f0]">반려동물이
          있으면</strong> 사료·물그릇·이동장·목줄 — 대피소에 데려가려면 이동장이 있어야 합니다.{" "}
          <strong className="text-[#e8e8f0]">차가 있으면</strong> 트렁크에 담요·물·점프스타터·체인.
        </p>
      </Sec>

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">한파 예보 보고 그제야 주문</strong> — 그때는 품절이거나 배송이 늦습니다. 지금 사는 게 가장 쌉니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">비상용품을 평소 물건과 섞어 두기</strong> — 쓰고 안 채워 두면 그날 없습니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">소화기를 불 날 자리 옆에</strong> — 못 집습니다. 나오는 길목에 두세요.</p>
        <p>❌ <strong className="text-[#e8e8f0]">전부 다 사려다 아무것도 안 사기</strong> — 랜턴·보조배터리·생수·소화기 넷이면 대부분의 날을 넘깁니다. 거기서 시작하세요.</p>
      </Sec>
    </HelpShell>
  );
}
