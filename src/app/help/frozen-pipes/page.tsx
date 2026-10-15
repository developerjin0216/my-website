import Link from "next/link";
import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

// 수도 계량기·수도관 동파 — 11~3월 계절 글.
//
// 숫자와 기준은 전부 서울시 발표(내 손안에 서울 2024.12.3, 2022.11.9)에서 왔습니다.
// 수도는 지자체가 운영해서 신고 번호·비용 부담이 지역마다 다릅니다. 서울 외 지역의 번호는
// 공식 페이지로 확인하지 못해 적지 않았습니다 — "지역번호+121" 같은 옛 안내를 그대로 옮기면
// 부산처럼 이미 바뀐 곳에서 틀립니다.

export const metadata = buildHelpMetadata("frozen-pipes");

export default function FrozenPipesPage() {
  return (
    <HelpShell id="frozen-pipes">
      <Sec title="🧊 물이 안 나올 때 — 먼저 계량기 유리를 보세요">
        <p>
          1. <strong className="text-[#e8e8f0]">계량기 유리가 깨졌거나 부풀어 올랐으면 동파</strong>입니다.
          녹여서 해결되는 단계가 아니니 바로 신고하세요(아래 &lsquo;신고하는 곳&rsquo;).
        </p>
        <p>
          2. <strong className="text-[#e8e8f0]">유리가 멀쩡하면 얼기만 한 것</strong>입니다.
          서서히 녹여야 합니다. 서울시는 언 계량기를 &ldquo;서서히 녹여 열 손상이 가지 않도록&rdquo;
          하라고 안내합니다 — 끓는 물을 붓거나 불을 갖다 대는 식으로 갑자기 뜨겁게 하면 안 됩니다.
        </p>
        <p>
          3. <strong className="text-[#e8e8f0]">우리 집만인지, 동네 전체인지</strong> — 옆집도 물이 안
          나오면 동파가 아니라 단수일 수 있습니다. 단수는{" "}
          <Link href="/help/utility-outage" className="text-accent underline">
            정전·단수 안내
          </Link>
          를 보세요.
        </p>
      </Sec>

      <Sec title="📞 신고하는 곳">
        <GuideTable
          headers={["지역", "신고처"]}
          rows={[
            ["서울", "카카오톡 챗봇 '아리수톡' · 아리수 사이버고객센터 · 120다산콜(02-120) · 관할 수도사업소"],
            ["그 밖의 지역", "시·군 상수도사업소(수도사업본부) — 번호가 지역마다 다릅니다"],
          ]}
        />
        <p className="text-xs text-[#8a90a0]">
          수도는 전기(한전)나 가스와 달리 지자체가 운영해서 전국 공통 번호가 없습니다.
          &lsquo;○○시 상수도사업소&rsquo;로 검색하면 그 지역 번호가 나옵니다. 서울시는 매년 11월
          15일부터 이듬해 3월 15일까지 동파대책 상황실을 운영합니다.
        </p>
      </Sec>

      <Sec title="💸 계량기 교체 비용은 누가 내나 (서울 기준)">
        <p>
          서울은 2022년 수도조례 개정으로, <strong className="text-[#e8e8f0]">한파 같은 자연재해로 동파돼
          교체하면 시가 비용을 냅니다</strong>. 다만 <strong className="text-[#e8e8f0]">보온 조치를 하지
          않았거나 계량기 보호통을 관리하지 않아</strong>(훼손·노출·이탈) 동파됐다면 계량기 값과
          설치비를 사용자가 전부 냅니다.
        </p>
        <p className="text-xs text-[#8a90a0]">
          다른 지역은 조례마다 다르니 신고할 때 비용 부담을 함께 물어보세요. 세입자와 집주인 사이에서
          누가 내는지는{" "}
          <Link href="/help/rental-repair" className="text-accent underline">
            전월세 집수리 부담
          </Link>
          을 참고하세요.
        </p>
      </Sec>

      <Sec title="🛡 예방 — 채우기·틀기·녹이기">
        <p>
          <strong className="text-[#e8e8f0]">채우기</strong> — 계량기 보호통(함) 안을 헌 옷 같은 마른
          보온재로 채우고, 뚜껑을 비닐 등으로 덮어 찬 공기를 막습니다. 노출된 수도관, 화장실, 보일러
          배관도 보온재로 감쌉니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">틀기</strong> — 보온을 해도 영하 10도 아래 날씨가 이틀
          넘게 이어지면 동파가 늘기 시작하고, 영하 15도에서는 급격히 늘어납니다. 그럴 땐 수도꼭지를
          가늘게 틀어 계량기 안에 물이 고여 있지 않게 합니다.
        </p>
        <GuideTable
          headers={["하루 최저기온", "흘려 둘 물의 양"]}
          rows={[
            ["0도 ~ 영하 10도", "45초에 종이컵 하나가 찰 정도"],
            ["영하 10도 미만", "33초에 종이컵 하나가 찰 정도"],
          ]}
        />
        <p className="text-xs text-[#8a90a0]">
          서울시 계산으로는 이 양을 10시간 흘려도 가정용 수도요금으로 하루 300원이 안 됩니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">녹이기</strong> — 이미 얼었다면 서서히 녹입니다(위 1번).
        </p>
      </Sec>

      <Sec title="📊 서울시 동파 예보 4단계">
        <GuideTable
          headers={["단계 (하루 최저기온)", "할 일"]}
          rows={[
            ["관심 (영하 5도 초과)", "계량기함에 보온재 채우고 뚜껑을 비닐로 덮기, 노출 수도관·보일러 배관 감싸기"],
            ["주의 (영하 5 ~ 10도)", "계량기·노출 수도관·화장실·보일러 보온 상태 다시 점검"],
            ["경계 (영하 10 ~ 15도, 이틀 이상)", "오래 집을 비울 때는 보온했더라도 수도꼭지를 아주 조금 열어 두기"],
            ["심각 (영하 15도 이하, 이틀 이상)", "잠깐 외출하거나 밤사이처럼 짧게 물을 안 쓸 때도 수도꼭지를 아주 조금 열어 두기"],
          ]}
        />
        <p className="text-xs text-[#8a90a0]">
          서울시는 연휴와 한파가 겹쳐 집을 오래 비우는 경우에 대비해 동파 예보를 7일 전부터 냅니다.
        </p>
      </Sec>

      <Sec title="🔎 서울 동파는 왜 생겼나">
        <p>
          2021~22년 겨울 서울 동파 3,621건을 분석했더니 원인은{" "}
          <strong className="text-[#e8e8f0]">보온 미비 67.7%, 장시간 외출 24%, 계량기 노출 6.5%</strong>
          였습니다. 집을 비운 사이 물이 멈춰 있으면 얼기 쉽다는 뜻입니다. 2023~24년 겨울에는
          3,072건이 났습니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
