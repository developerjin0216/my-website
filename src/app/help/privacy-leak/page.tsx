import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("privacy-leak");

export default function PrivacyLeakPage() {
  return (
    <HelpShell id="privacy-leak">
      <DecisionFlow
        question="어떤 정보가 유출됐나요?"
        branches={[
          {
            label: "주민등록번호·신분증 사진",
            steps: [
              "<b>pd.fss.or.kr(개인정보노출자 사고예방시스템)</b>에 등록 — 내 명의 신규 계좌·카드 개설에 강화된 본인확인이 걸립니다 (무료, 언제든 해제 가능)",
              "<b>엠세이퍼(msafer.or.kr)</b>에서 가입제한 신청 — 내 명의 휴대폰 신규 개통 차단",
              "신분증 자체를 잃어버렸다면 정부24에서 <b>분실신고</b>까지 — 신고 이후의 도용은 법적으로 다투기 쉬워집니다",
              "며칠 뒤 payinfo.or.kr와 msafer에서 모르는 계좌·개통이 없는지 재확인",
            ],
          },
          {
            label: "계좌·카드번호",
            steps: [
              "해당 은행·카드사 콜센터에 즉시 전화 — 카드는 <b>정지 후 재발급</b>, 계좌는 비밀번호 변경과 함께 이상거래 모니터링 요청",
              "모르는 결제·이체가 이미 있다면 <b>이의제기(카드 차지백)</b>를 접수하고 112에 신고",
              "pd.fss.or.kr 등록으로 추가 개설 차단",
              "자동이체·간편결제에 연결된 카드번호도 재발급 후 갱신",
            ],
          },
          {
            label: "비밀번호 (사이트 해킹)",
            steps: [
              "<b>같은 비밀번호를 쓰는 모든 사이트</b>가 위험 — 이메일 → 금융 → 포털 순으로 즉시 변경",
              "주요 계정에 <b>2단계 인증</b>을 켜기 (이것 하나가 대부분의 도용을 막습니다)",
              "eprivacy.go.kr(e프라이버시 클린서비스)에서 내 명의 가입 사이트를 조회해 안 쓰는 곳 회원탈퇴",
              "이메일이 뚫렸다면 비밀번호 찾기가 전부 뚫립니다 — 이메일 복구부터 최우선",
            ],
          },
          {
            label: "명의도용이 의심된다",
            steps: [
              "<b>payinfo.or.kr</b> 내계좌한눈에로 모르는 계좌·대출 확인",
              "<b>msafer.or.kr</b> 가입사실현황조회로 모르는 휴대폰 개통 확인",
              "발견되면: 해당 금융사·통신사에 명의도용 신고 + <b>경찰 신고(ECRM)</b>로 기록 확보 — 채무 부인의 근거가 됩니다",
              "개인정보 침해 상담은 국번없이 <b>118</b>(KISA, 24시간)",
            ],
          },
        ]}
      />

      <Sec title="무료 공식 서비스 5가지 — 각자 막아주는 것이 다릅니다">
        <GuideTable
          headers={["서비스", "막아주는 것"]}
          rows={[
            ["개인정보노출자 사고예방시스템 (pd.fss.or.kr)", "내 명의 신규 계좌·카드 개설"],
            ["엠세이퍼 (msafer.or.kr)", "내 명의 휴대폰 신규 개통 + 기존 개통 조회"],
            ["어카운트인포 (payinfo.or.kr)", "전 금융사 내 계좌·카드 한눈에 조회"],
            ["e프라이버시 클린서비스 (eprivacy.go.kr)", "내 명의 웹사이트 가입 조회·잔여 계정 탈퇴"],
            ["KISA 118", "개인정보 침해 신고·상담 (24시간)"],
          ]}
        />
        <p>
          전부 <strong className="text-[#e8e8f0]">무료</strong>이고 본인인증만
          있으면 됩니다. 유출이 의심되는 순간 위쪽 두 개(pd.fss + 엠세이퍼)만
          걸어둬도 명의도용의 대부분이 차단됩니다.
        </p>
      </Sec>

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">&ldquo;유출 여부를 확인해준다&rdquo;는 문자·전화의 링크 클릭</strong> — 유출 사고 직후를 노리는 2차 피싱이 반드시 옵니다. 확인은 위 공식 사이트에 직접 접속해서만 하세요.</p>
        <p>❌ <strong className="text-[#e8e8f0]">&ldquo;보안 앱을 설치하라&rdquo;는 원격 지원 요구</strong> — 공공기관·금융사는 전화로 앱 설치를 시키지 않습니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">유출된 비밀번호 한 곳만 변경</strong> — 같은 비밀번호를 쓰는 모든 사이트가 이미 뚫린 것과 같습니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">신분증 사진을 채팅·메일에 계속 보관</strong> — 이번 기회에 보낸 기록을 삭제하고, 제출할 땐 &ldquo;OO 제출용&rdquo; 워터마크를 넣는 습관을 들이세요.</p>
      </Sec>

      <Sec title="피해가 이미 생겼다면">
        <p>
          모르는 대출·결제·개통이 확인되면 ① 해당 회사에 명의도용 신고 ②
          경찰서 또는 ECRM(사이버)에 피해 신고 ③ 금감원 1332 분쟁 상담
          순서로 진행하세요. 주민등록번호 유출로 계속 피해가 우려되면{" "}
          <strong className="text-[#e8e8f0]">주민등록번호 변경 신청</strong>(주소지
          주민센터 접수 → 변경위원회 심사)이라는 최후 수단도 있습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
