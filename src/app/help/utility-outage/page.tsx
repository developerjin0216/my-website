import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";
import { CALC_URL } from "@/lib/site";

export const metadata = buildHelpMetadata("utility-outage");

export default function UtilityOutagePage() {
  return (
    <HelpShell id="utility-outage">
      <Sec title="⚡ 정전됐을 때">
        <p>1. <strong className="text-[#e8e8f0]">우리 집만인지 확인</strong> — 현관 밖·옆집 불이 켜져 있으면 우리 집 차단기(두꺼비집) 문제입니다. 내려간 차단기를 올려보고, 계속 떨어지면 특정 가전의 누전이니 하나씩 뽑아 확인하세요.</p>
        <p>2. <strong className="text-[#e8e8f0]">동네 전체 정전이면 한전 123</strong> — 복구 예정 시간을 안내받을 수 있습니다. 아파트는 관리사무소부터 (단지 내 설비 문제인 경우가 많습니다).</p>
        <p>3. 여름철 정전 대비로 냉장고는 문을 열지 않으면 2~3시간은 버팁니다.</p>
        <p className="text-xs text-[#606070]">
          전기요금이 궁금하다면{" "}
          <a
            href={`${CALC_URL}/calculators/electricity`}
            className="text-accent underline"
          >
            전기요금 계산기
          </a>
          에서 확인할 수 있습니다.
        </p>
      </Sec>

      <Sec title="💧 물이 안 나올 때 (단수)">
        <p>1. <strong className="text-[#e8e8f0]">계획 단수인지 확인</strong> — 지자체 상수도사업소가 문자·공지로 안내합니다. 아파트는 관리사무소 방송·공지 확인.</p>
        <p>2. <strong className="text-[#e8e8f0]">신고는 지역 상수도사업소</strong> — 지역번호+120(지자체 민원콜) 또는 시·군 상수도사업소로 연결됩니다. 서울은 다산콜 02-120.</p>
        <p>3. 녹물이 나오면 마시지 말고 사진을 찍어 상수도사업소에 신고하세요 — 수질 검사를 요청할 수 있습니다.</p>
      </Sec>

      <Sec title="🔥 가스 냄새가 날 때 — 순서 중요!">
        <p><strong className="text-[#ff6b6b]">하지 말 것부터: 전등 스위치·환풍기·라이터 켜지 마세요.</strong> 스파크 하나로 폭발할 수 있습니다.</p>
        <p>1. 가스레인지 밸브와 중간밸브를 잠급니다</p>
        <p>2. 창문을 활짝 열어 환기합니다 (LPG는 바닥에 깔리므로 빗자루로 쓸어내듯 환기)</p>
        <p>3. 집 밖으로 나가서 <strong className="text-[#e8e8f0]">지역 도시가스회사</strong>(고지서·계량기에 번호 표기) 또는 <strong className="text-[#e8e8f0]">한국가스안전공사 1544-4500</strong>에 신고합니다. 급박하면 119.</p>
      </Sec>

      <Sec title="🚿 보일러·온수 문제">
        <GuideTable
          headers={["증상", "확인할 것"]}
          rows={[
            ["온수만 안 나옴", "보일러 온수 설정, 수압(0.5~2 사이 정상)"],
            ["에러 코드 표시", "제조사 앱·설명서에서 코드 검색 후 AS 접수"],
            ["동파(겨울)", "수도꼭지 온수 쪽 살짝 열고 미지근한 물로 배관 해동 — 뜨거운 물 직접 붓기 금지"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          보일러 AS는 제조사 콜센터로 — 기기 전면 스티커에 번호가 있습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
