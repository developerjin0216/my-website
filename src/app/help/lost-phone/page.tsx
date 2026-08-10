import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("lost-phone");

export default function LostPhonePage() {
  return (
    <HelpShell id="lost-phone">
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

      <Sec title="해외에서 잃어버렸다면">
        <p>
          통신사 로밍센터(각 사 24시간)로 전화해 회선을 정지하고, 현지 경찰서에서
          분실 증명서(police report)를 받아두세요 — 여행자보험 보상 청구에
          필요합니다. 귀국 후 보험사에 기기 보상을 청구할 수 있습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
