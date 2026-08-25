import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";
import { CALC_URL } from "@/lib/site";

export const metadata = buildHelpMetadata("moving-checklist");

export default function MovingChecklistPage() {
  return (
    <HelpShell id="moving-checklist">
      <Sec title="1분 요약 — 이것만은 놓치지 마세요">
        <p>1. <strong className="text-[#e8e8f0]">2주 전까지 예약 3종</strong> — 이사업체(허가업체인지 조회!), 인터넷·TV 이전, 도시가스 철거. 예약이 늦으면 이사 날짜에 맞출 수 없습니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">당일, 세입자는 장기수선충당금 돌려받기</strong> — 아파트·오피스텔 세입자가 놓치는 대표적인 돈입니다. 관리사무소에서 납부확인서를 떼서 집주인에게 청구하세요.</p>
        <p>3. <strong className="text-[#e8e8f0]">이사 후 14일 안에 전입신고 + 확정일자</strong> — 늦으면 과태료(5만원 이하)보다 <strong className="text-[#e8e8f0]">보증금을 지키는 대항력 공백</strong>이 더 큰 손해입니다. 정부24에서 10분이면 끝납니다.</p>
      </Sec>

      <Sec title="이사 전 (D-30 ~ D-1) — 예약이 전부입니다">
        <GuideTable
          headers={["시기", "할 일"]}
          rows={[
            ["D-30~14", "이사업체 2~3곳 방문견적 비교 (허가이사.com에서 허가업체 확인)"],
            ["D-14", "인터넷·TV 이전 신청 (통신사, 설치 기사 예약이 밀립니다)"],
            ["D-7", "폐가전 무상수거 예약 (1599-0903) · 대형폐기물 스티커 신청"],
            ["D-3", "도시가스 철거(전출) 예약 — 지역 도시가스회사"],
            ["D-3", "정수기·비데 등 렌털기기 이전 설치 신청"],
            ["D-1", "냉장고 정리·세탁기 물 빼기, 귀중품·서류 따로 포장"],
          ]}
        />
        <p>
          <strong className="text-[#e8e8f0]">이사업체는 반드시 허가업체인지
          확인하세요</strong> — 국토교통부가 운영에 관여하는
          허가이사종합정보(허가이사.com)에서 업체명으로 조회할 수 있고, 평균
          이사비용·사다리차 요금표도 볼 수 있습니다. 허가업체는 피해보상
          보증보험(500만원 이상) 가입이 의무라서, 파손·분실 시 보상 경로가
          있습니다. 무허가 업체는 사고 후 연락 두절이 흔합니다. 참고로
          &ldquo;손 없는 날&rdquo;과 월말·주말은 비용이 크게 뛰니, 날짜가
          자유롭다면 평일 중순이 저렴합니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">버릴 가전은 돈 내지 마세요</strong> —
          TV·냉장고·세탁기·에어컨 등 대형 폐가전은{" "}
          <strong className="text-[#e8e8f0]">1599-0903</strong>(평일 08~18시) 또는
          15990903.or.kr로 예약하면 <strong className="text-[#e8e8f0]">무료로 방문
          수거</strong>해 갑니다(환경부 산하 e순환거버넌스). 소형 가전은 5개
          이상 모으면 함께 수거됩니다. 가구 등 폐가전이 아닌 대형폐기물만
          주민센터·지자체 앱에서 스티커를 사면 됩니다.
        </p>
      </Sec>

      <Sec title="이사 당일 — 챙길 돈과 확인할 것">
        <p>
          <strong className="text-[#e8e8f0]">① 장기수선충당금 (세입자 필수)</strong> —
          아파트·오피스텔 관리비에 포함된 장기수선충당금은 원래{" "}
          <strong className="text-[#e8e8f0]">집주인 부담</strong>입니다. 세입자가
          살면서 대신 낸 금액은 이사 나갈 때 돌려받을 수 있습니다 —
          관리사무소에서 &ldquo;장기수선충당금 납부확인서&rdquo;를 발급받아
          집주인에게 청구하세요. 2년 거주면 수십만 원인 경우도 흔합니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">② 공과금 정산</strong> — 전기는 한전{" "}
          <strong className="text-[#e8e8f0]">123</strong>에 전화해 당일 계량기
          지침으로 일할 정산하고, 도시가스는 철거 기사 방문 시 정산합니다.
          관리비는 관리사무소에서 중간 정산서를 받으세요.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">③ 파손은 그 자리에서</strong> — 이사
          중 물품이 파손·분실되면 나중에 말하면 늦습니다. 현장에서 사진을 찍고
          작업 책임자에게 <strong className="text-[#e8e8f0]">피해 사실 확인서를
          서면으로</strong> 받아두세요. 보상 분쟁이 안 풀리면 소비자상담센터
          1372로 상담할 수 있습니다.
        </p>
        <p>
          귀중품·현금·계약서·도장은 이삿짐에 싣지 말고 직접 소지하는 것이
          원칙입니다 — 분실 시 보상 다툼이 가장 어려운 품목입니다.
        </p>
      </Sec>

      <Sec title="이사 후 14일 안에 — 전입신고가 핵심">
        <p>
          <strong className="text-[#e8e8f0]">전입신고는 14일 이내가 법정
          기한</strong>입니다(주민등록법, 위반 시 과태료 5만원 이하). 하지만
          진짜 중요한 이유는 따로 있습니다 — 세입자는{" "}
          <strong className="text-[#e8e8f0]">전입신고 + 확정일자</strong>를 갖춰야
          집이 팔리거나 경매에 넘어가도 보증금을 지키는{" "}
          <strong className="text-[#e8e8f0]">대항력·우선변제권</strong>이 생깁니다.
          미루지 말고 <strong className="text-[#e8e8f0]">이사 당일</strong> 하는 것이
          정답입니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">정부24 &ldquo;전입신고+&rdquo;</strong>에서
          한 번에 처리하세요 — 전입신고와 함께 ① 확정일자 부여 신청(체크박스)
          ② 우편물 주소이전 ③ 초등학교 배정정보 ④ 요금감면
          통합신청(기초수급·다자녀 등 해당자)까지 원스톱으로 됩니다. 보증금
          6천만원 또는 월세 30만원 초과 계약은 30일 내 임대차 신고 의무도
          있는데, 신고하면 확정일자는 자동으로 부여된 것으로 처리됩니다.
        </p>
        <GuideTable
          headers={["할 일", "방법"]}
          rows={[
            ["전입신고 + 확정일자", "정부24 '전입신고+' (온라인 10분) 또는 주민센터"],
            ["우편물 주소 전송", "전입신고 시 함께 신청 — 동일권역 3개월 무료"],
            ["자동차 주소", "전입신고하면 자동 변경 (별도 신청 불필요)"],
            ["도시가스 개통", "지역 도시가스사에 전입 신청 — 기사 방문 입회 필요"],
            ["아이 전학", "초등: 전입신고 시 배정 안내 / 중고등: 교육청·학교 방문"],
          ]}
        />
      </Sec>

      <Sec title="도움받을 곳 한눈에">
        <GuideTable
          headers={["필요할 때", "연락처·사이트"]}
          rows={[
            ["허가 이사업체 조회·평균 비용", "허가이사.com (국토부 인가단체 운영)"],
            ["이사 파손·분실 분쟁", "1372 소비자상담센터"],
            ["폐가전 무료 방문수거", "1599-0903 · 15990903.or.kr"],
            ["전입신고·확정일자", "정부24 (gov.kr) '전입신고+'"],
            ["전기요금 정산", "한전 123"],
            ["우편물 전송 연장", "인터넷우체국 (epost.go.kr)"],
          ]}
        />
        <p>
          이사 비용 계산이 필요하다면 —{" "}
          <a href={`${CALC_URL}/calculators/jeonse-fee`} className="text-[#ffd700] underline">부동산 중개보수(복비) 계산기</a>와{" "}
          <a href={`${CALC_URL}/calculators/rent-conversion`} className="text-[#ffd700] underline">전월세 전환율 계산기</a>로
          계약 단계의 돈 계산을 확인할 수 있습니다.
        </p>
        <p className="text-xs text-[#606070]">
          수수료·제도는 2026년 8월 기준(정부24·우정사업본부·e순환거버넌스
          안내)이며 변경될 수 있습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
