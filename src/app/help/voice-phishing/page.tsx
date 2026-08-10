import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("voice-phishing");

export default function VoicePhishingPage() {
  return (
    <HelpShell id="voice-phishing">
      <Sec title="돈을 보냈다면 — 지금 1분이 환급을 가릅니다">
        <p>1. <strong className="text-[#e8e8f0]">즉시 112에 전화</strong> — &ldquo;보이스피싱 지급정지 요청&rdquo;이라고 말하세요. 경찰이 사기 계좌의 지급정지를 연계 처리해줍니다. 내 돈이 인출되기 전에 묶는 것이 최우선입니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">송금한 은행 콜센터</strong>에도 전화해 지급정지를 이중으로 요청하세요 (24시간 접수).</p>
        <p>3. 지급정지가 되면 이후 <strong className="text-[#e8e8f0]">피해금 환급 절차</strong>(전기통신금융사기 피해방지 특별법)가 진행됩니다 — 경찰서에서 피해 신고 확인서를 받아 은행에 피해구제 신청서를 제출하면, 사기 계좌에 남은 돈을 소송 없이 돌려받을 수 있습니다.</p>
      </Sec>

      <Sec title="개인정보·인증번호를 알려줬다면">
        <GuideTable
          headers={["조치", "방법"]}
          rows={[
            ["개인정보 노출 등록", "금감원 개인정보노출자 사고예방시스템(pd.fss.or.kr) — 내 명의 신규 계좌·카드 개설 제한"],
            ["명의도용 개통 차단", "엠세이퍼(msafer.or.kr) 가입제한 신청"],
            ["내 명의 계좌 전수 확인", "어카운트인포(payinfo.or.kr) — 모르는 계좌 개설 여부 확인"],
            ["휴대폰 소액결제 차단", "통신사 고객센터(114)"],
          ]}
        />
        <p>
          악성 앱을 설치했다면(원격조종 위험) 즉시{" "}
          <strong className="text-[#e8e8f0]">비행기 모드</strong>로 전환하고, 그
          폰으로는 은행 앱을 열지 마세요. 다른 기기에서 비밀번호를 바꾸고,
          폰은 초기화하는 것이 안전합니다.
        </p>
      </Sec>

      <Sec title="이게 피싱인가 헷갈릴 때">
        <p>
          상담은 <strong className="text-[#e8e8f0]">금융감독원 1332</strong>
          (평일)에서 받을 수 있습니다. 요즘 수법 몇 가지:
        </p>
        <p>• 검찰·경찰·금감원은 <strong className="text-[#e8e8f0]">절대 전화로 돈을 요구하거나 앱 설치를 시키지 않습니다</strong><br/>• &ldquo;자녀 납치·사고&rdquo; 전화는 끊고 자녀 본인에게 직접 전화<br/>• 문자 속 링크(택배·범칙금·부고장)는 클릭 금지 — 스미싱 악성앱 통로입니다<br/>• &ldquo;저금리 대환대출&rdquo; 권유 후 기존 대출 상환금을 현금·이체로 요구하면 100% 사기</p>
      </Sec>

      <Sec title="가족에게 공유하세요">
        <p>
          보이스피싱 피해의 상당수가 부모님 세대에서 발생합니다. 이 페이지를
          가족 단톡방에 공유하고, &ldquo;돈 얘기 나오는 전화는 일단 끊고
          나한테 먼저 전화해&rdquo;라는 약속 하나만 해둬도 큰 피해를 막을 수
          있습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
