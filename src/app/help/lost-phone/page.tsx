import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("lost-phone");

export default function LostPhonePage() {
  return (
    <HelpShell id="lost-phone">
      <DecisionFlow
        question="어떤 폰을 잃어버렸나요?"
        branches={[
          {
            label: "아이폰",
            steps: [
              "다른 기기나 PC에서 <b>icloud.com/find</b> 접속 → 내 아이폰 선택",
              "<b>분실 모드</b> 켜기 — 잠금 + 잠금화면에 연락받을 번호 표시",
              "위치가 집·직장 근처로 잡히면 소리 재생으로 찾기, 모르는 곳이면 직접 가지 말고 위치를 캡처해 경찰에 제공",
              "금융 정보가 걱정되면 '지우기'는 최후 수단 — 지우면 위치 추적이 끊깁니다. 통신사 정지·유심 잠금을 먼저",
            ],
          },
          {
            label: "갤럭시·안드로이드",
            steps: [
              "PC나 다른 폰에서 <b>smartthingsfind.samsung.com</b>(갤럭시) 또는 구글 '내 기기 찾기' 접속",
              "<b>잠금</b> 실행 — 잠금화면에 연락처 메시지 표시",
              "필요하면 소리 울리기·위치 추적, 마지막 위치라도 캡처해 두세요",
              "'데이터 삭제'는 위치 추적이 끊기므로 통신사 정지·유심 잠금 후 최후 수단으로",
            ],
          },
          {
            label: "금융앱·페이가 걱정된다",
            steps: [
              "주거래 은행 콜센터에 <b>모바일뱅킹 일시 차단</b> 요청",
              "삼성페이는 SmartThings Find에서, 애플페이는 분실 모드에서 자동 정지됩니다 — 카카오·네이버페이는 각 고객센터·웹에서 원격 차단",
              "통신사에 <b>유심 잠금</b> 요청 — 유심을 빼서 인증번호를 가로채는 수법 차단",
              "찾은 뒤에는 금융 앱 로그인 기록을 확인하고 비밀번호 변경",
            ],
          },
          {
            label: "해외에서 잃어버렸다",
            steps: [
              "통신사 <b>로밍센터(24시간)</b>로 전화해 회선 정지 — 국제전화 요금 폭탄 방지가 최우선",
              "위의 원격 잠금(나의 찾기/SmartThings)은 해외에서도 동일하게 동작",
              "현지 경찰서에서 <b>분실 증명서(police report)</b> 발급 — 여행자보험 보상의 필수 서류",
              "귀국 후 보험사에 기기 보상 청구 + 재발급 진행",
            ],
          },
        ]}
      />
      <Sec title="1분 요약 — 순서가 중요합니다">
        <p>1. <strong className="text-[#e8e8f0]">원격으로 위치 확인 + 잠금</strong> — 다른 기기나 PC에서: 아이폰은 iCloud &ldquo;나의 찾기&rdquo;, 안드로이드는 구글 &ldquo;내 기기 찾기(Find My Device)&rdquo;. 분실 모드로 잠그고 연락처를 화면에 띄울 수 있습니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">통신사 분실신고(회선 정지)</strong> — 고객센터(휴대폰 114, 일반전화는 통신사 대표번호) 또는 통신사 앱. 소액결제·국제전화 차단을 함께 요청하세요.</p>
        <p>3. <strong className="text-[#e8e8f0]">명의도용 차단</strong> — 엠세이퍼(msafer.or.kr)에서 &ldquo;가입제한 서비스&rdquo;를 신청하면 내 명의로 새 휴대폰이 개통되는 것을 막을 수 있습니다.</p>
      </Sec>

      <Sec title="찾을 가능성을 높이는 방법">
        <GuideTable
          headers={["방법", "내용"]}
          rows={[
            ["로스트112", "경찰청 유실물 포털(lost112.go.kr) — 습득 신고된 폰 검색"],
            ["분실 모드 메시지", "잠금화면에 다른 연락처를 띄워 습득자가 연락 가능하게"],
            ["택시·지하철", "카카오T 분실물 접수, 지하철 유실물센터(호선별)"],
            ["핸드폰찾기콜센터", "이동통신 3사 공동 운영 — handphone.or.kr"],
          ]}
        />
      </Sec>

      <Sec title="금융 앱이 걱정될 때">
        <p>
          요즘 휴대폰에는 은행·페이 앱이 다 들어 있죠. 기기 잠금(비밀번호·
          생체인증)이 걸려 있다면 뚫기 어렵지만, 불안하면 주거래 은행
          콜센터에 전화해 <strong className="text-[#e8e8f0]">모바일뱅킹 일시
          차단</strong>을 요청하세요. 간편결제(삼성페이·카카오페이 등)는 각
          서비스 웹사이트에서 원격으로 사용 중지할 수 있습니다.
        </p>
        <p>
          유심을 빼서 다른 폰에 꽂는 수법에 대비해, 통신사에{" "}
          <strong className="text-[#e8e8f0]">유심 잠금(USIM 보호)</strong>도 함께
          요청하면 안전합니다.
        </p>
      </Sec>

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">성급한 원격 초기화(지우기)</strong> — 실행하는 순간 위치 추적이 끊겨 되찾을 가능성이 사라집니다. 통신사 정지·유심 잠금이 먼저입니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">습득자와 현금 사례 직거래</strong> — 2차 사기·강요 위험이 있습니다. 경찰서 인계를 요청하세요(보상금 절차도 경찰 통해서 가능).</p>
        <p>❌ <strong className="text-[#e8e8f0]">&ldquo;폰을 찾았다&rdquo;는 문자 속 링크 클릭</strong> — 분실 직후 애플·삼성을 사칭해 계정 비밀번호를 노리는 피싱이 옵니다. 반드시 공식 앱·사이트에 직접 접속하세요.</p>
      </Sec>
    </HelpShell>
  );
}
