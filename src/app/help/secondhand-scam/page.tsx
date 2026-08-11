import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("secondhand-scam");

export default function SecondhandScamPage() {
  return (
    <HelpShell id="secondhand-scam">
      <Sec title="1분 요약 — 돈만 보내고 물건이 안 온다면">
        <p>1. <strong className="text-[#e8e8f0]">증거부터 캡처</strong> — 판매글, 대화 내용 전체, 입금 내역, 상대 계좌·연락처. 상대가 글을 지우기 전에 지금 바로 저장하세요.</p>
        <p>2. <strong className="text-[#e8e8f0]">더치트(thecheat.co.kr)에서 상대 계좌·연락처 조회 + 피해 등록</strong> — 다른 피해자가 있는지 확인되고, 다음 피해자를 막습니다.</p>
        <p>3. <strong className="text-[#e8e8f0]">경찰청 ECRM(ecrm.police.go.kr)에서 온라인 신고</strong> — 경찰서에 안 가도 사기 신고가 접수됩니다.</p>
        <p>4. 은행에도 지급정지를 요청해 보세요 — 단, 물품 사기는 보이스피싱과 달리 <strong className="text-[#e8e8f0]">즉시 정지가 안 되는 것이 원칙</strong>이라 기대치는 낮춰야 합니다(아래 설명).</p>
      </Sec>

      <Sec title="솔직한 이야기 — 왜 계좌를 바로 못 막나">
        <p>
          보이스피싱은 통신사기피해환급법에 따라 전화 한 통으로 상대 계좌가
          지급정지되지만, 이 법은 <strong className="text-[#e8e8f0]">&ldquo;재화·용역
          거래를 가장한 행위&rdquo;(=물건값 사기)를 적용 대상에서
          제외</strong>하고 있습니다. 그래서 중고거래 사기는 원칙적으로 즉시
          지급정지·피해금 환급 대상이 아니고, 형사 고소와 민사 청구로 가야
          합니다.
        </p>
        <p>
          다만 제도가 바뀌는 중입니다 — 2026년 8월 시행된 개정법과 함께 금융당국이
          &ldquo;법 적용 가능성이 조금이라도 있으면 경찰 확인 하에 신속히
          지급정지&rdquo;하도록 업무 기준을 정비하고 있고, 중고거래·간편결제
          사기를 지급정지 대상에 포함하는 개정안도 국회에 발의돼 있습니다(아직
          통과 전). 그러니 <strong className="text-[#e8e8f0]">은행 콜센터에 지급정지를
          요청해보되, 안 된다고 해도 놀라지 말고</strong> 바로 다음 단계(신고)로
          넘어가세요.
        </p>
      </Sec>

      <Sec title="신고 절차 — ECRM 온라인 신고">
        <GuideTable
          headers={["단계", "내용"]}
          rows={[
            ["① 증거 정리", "판매글·대화 전체 캡처, 이체확인증, 상대 계좌·닉네임·연락처"],
            ["② 온라인 신고", "ECRM(ecrm.police.go.kr) 접속 → 간편인증 로그인 → 사이버사기 신고, 증거 파일 첨부"],
            ["③ 사건 진행", "관할 경찰서 배정 → 조사 (진행 상황은 문자로 통보)"],
            ["④ 서류 발급", "'사건사고사실확인원' — 보험·플랫폼 보상 신청 등에 필요"],
          ]}
        />
        <p>
          피해 금액이 크거나 급하면 가까운 경찰서 민원실에 직접 방문해 고소장을
          접수해도 됩니다. 신고 전에 더치트에 피해를 등록해두면 같은 계좌로
          당한 다른 피해자들과 사건이 묶여 처리에 도움이 됩니다.
        </p>
      </Sec>

      <Sec title="돈은 어떻게 돌려받나">
        <p>
          범인이 검거되면 <strong className="text-[#e8e8f0]">배상명령
          신청</strong>이 가장 효율적입니다 — 형사재판에서 판사가 배상까지 함께
          명령하는 제도라 별도의 민사소송 비용 없이 판결문(집행권원)을 받을 수
          있습니다. 신청은 형사 1·2심 재판 중에 하며, 검거 시 담당 수사관에게
          방법을 물어보세요.
        </p>
        <p>
          그 외에는 <strong className="text-[#e8e8f0]">지급명령</strong>(법원의 간이
          절차, 소송보다 훨씬 저렴)이나 민사소송으로 청구합니다. 상대가 합의를
          원하면 반드시 <strong className="text-[#e8e8f0]">입금 확인 후</strong>에
          처벌불원 의사를 밝히세요 — 순서가 바뀌면 돈도 처벌도 놓칠 수
          있습니다.
        </p>
      </Sec>

      <Sec title="예방 — 30초 확인이 피해를 막습니다">
        <p>
          <strong className="text-[#e8e8f0]">송금 전 더치트에서 계좌번호
          조회</strong>가 가장 확실한 예방입니다. 그리고 &ldquo;안전결제
          링크&rdquo;를 카톡·문자로 보내주는 건 대부분{" "}
          <strong className="text-[#e8e8f0]">가짜 결제창 피싱</strong>입니다 —
          네이버페이 등 안전결제는 반드시 플랫폼 공식 앱 안에서만 진행하고,
          외부 링크로 받은 결제창엔 절대 카드번호를 입력하지 마세요. 계좌
          이체를 유도하며 시세보다 지나치게 싼 물건은 의심부터 하는 게
          맞습니다.
        </p>
        <p className="text-xs text-[#606070]">
          이 페이지는 일반 절차 안내이며 법률 자문이 아닙니다. 개별 사건은
          경찰(182·112)이나 대한법률구조공단(132) 상담을 이용하세요.
        </p>
      </Sec>
    </HelpShell>
  );
}
