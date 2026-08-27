import HelpShell from "@/components/help/HelpShell";
import DecisionFlow from "@/components/help/DecisionFlow";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("natural-disaster");

export default function NaturalDisasterPage() {
  return (
    <HelpShell id="natural-disaster">
      <DecisionFlow
        question="지금 어떤 상황인가요?"
        branches={[
          {
            label: "폭우 — 물이 차오르기 시작한다",
            steps: [
              "<b>반지하·지하주차장·지하차도는 즉시 포기하고 대피</b> — 수심이 무릎에 오기 전에 나와야 합니다. 그 이상이면 수압으로 문이 안 열립니다",
              "차량 운전 중이면: 물이 있는 <b>지하차도·하천변 도로에 진입 금지</b>. 이미 물에 잠기기 시작했다면 차를 버리고 높은 곳으로 — 차보다 목숨입니다",
              "차 안에 갇혔다면: 창문부터 열고, 안 열리면 <b>목받침(헤드레스트)을 뽑아 철심으로 창문 모서리</b>를 깨세요. 내·외부 수위 차가 30cm 이내로 줄면 문이 열립니다",
              "이동 시 <b>맨홀·가로등·신호등 근처를 피하세요</b> — 뚜껑 열림·감전 위험. 흐르는 물은 무릎 깊이만 돼도 성인이 휩쓸립니다",
            ],
          },
          {
            label: "산사태 — 산 근처, 전조가 보인다",
            steps: [
              "전조 증상: <b>경사면에서 갑자기 물이 솟거나</b>, 잘 나오던 샘물이 멈추거나, <b>나무가 기울고 땅 울림·굉음</b>이 들림 — 하나라도 보이면 즉시 대피",
              "산사태 주의보·경보가 발령되면 산림청 <b>산사태정보시스템</b>에서 우리 동네 위험 등급 확인, 대피 안내 시 지체 없이 이동",
              "대피할 땐 <b>산사태 흐름 방향(계곡·경사면 아래)에서 옆으로 벗어나</b> 가장 높은 곳 또는 튼튼한 건물로",
              "집이 산사태취약지역이면 폭우 예보 때 <b>미리 1박 대피</b>가 정답입니다 — 밤중 대피는 몇 배 위험합니다",
            ],
          },
          {
            label: "지진해일(쓰나미) — 해안에 있다",
            steps: [
              "해안에서 <b>지진동을 느끼거나 해일특보</b>가 발령되면 즉시 바다에서 멀고 <b>높은 곳(언덕·3층 이상 콘크리트 건물)</b>으로 — 차보다 도보가 빠를 수 있습니다",
              "<b>바닷물이 갑자기 빠지는 것은 해일의 전조</b>입니다 — 구경하지 말고 반대 방향으로 뛰세요",
              "<b>첫 파도가 끝이 아닙니다</b> — 해일은 수 시간 동안 반복되며 뒤 파도가 더 클 수 있습니다. 특보 해제까지 해안에 접근 금지",
              "동해안은 도달 시간이 길지 않습니다 — 재난문자를 받으면 짐 챙기지 말고 몸부터 이동하세요",
            ],
          },
          {
            label: "물이 빠졌다 — 복구·지원 단계",
            steps: [
              "집에 들어가기 전 <b>가스 밸브·전기 차단기부터 확인</b> — 침수 주택은 감전·가스 누출 위험이 있어 전문 점검 후 전원을 올리세요",
              "<b>치우기 전에 사진·영상부터</b> — 침수 높이, 가전·가구 피해를 방·물건 단위로 기록해야 지원금 실사에서 인정받습니다",
              "<b>재난 종료 후 10일 이내</b>에 읍면동 주민센터(또는 국민재난안전포털)에 사유재산 피해 신고 — 이 기한이 지나면 지원 제외될 수 있습니다",
              "침수차는 시동 걸지 말고(엔진 손상 확정됨) 보험사에 견인·자차 보상 접수",
            ],
          },
        ]}
      />

      <Sec title="실제 상황으로 보는 판단 — 이 순간, 뭐가 정답인가">
        <div className="space-y-4">
          <div className="bg-[#16213e] rounded-xl p-4">
            <p className="text-sm font-semibold text-accent mb-1.5">
              상황 ① 새벽 2시, 반지하 — 창틀로 물이 새어 들어온다
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              &ldquo;걸레로 막고 물을 퍼내면 버틸 수 있지 않을까?&rdquo; —
              <strong className="text-[#e8e8f0]"> 아닙니다.</strong> 반지하는
              바깥 수위가 창틀을 넘는 순간부터 분 단위로 차오릅니다. 물이
              발목에 오기 전에 귀중품 말고 <strong className="text-[#e8e8f0]">몸만
              들고 나가는 것</strong>이 정답입니다. 시간이 있다면 나가는 길에
              차단기만 내리세요. 수심이 무릎을 넘으면 바깥 수압 때문에 문이
              열리지 않아 그때는 나가고 싶어도 못 나갑니다.
            </p>
          </div>

          <div className="bg-[#16213e] rounded-xl p-4">
            <p className="text-sm font-semibold text-accent mb-1.5">
              상황 ② 아파트 방송 — &ldquo;지하주차장 침수 우려, 차량을 이동해 주세요&rdquo;
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              이미 물이 유입되기 시작했다면{" "}
              <strong className="text-[#e8e8f0]">내려가지 않는 것</strong>이
              정답입니다. 지하주차장은 경사로를 타고 물이 폭포처럼 쏟아지면
              1~2분 만에 사람 키를 넘기고, 어둡고 출구가 멀어 지상보다 훨씬
              위험합니다. 차는 자차보험으로 보상받을 수 있지만, &lsquo;차
              빼러 갔다가&rsquo;는 폭우 인명사고의 가장 흔한 패턴입니다.
              방송이 나왔다면 이미 늦은 겁니다.
            </p>
          </div>

          <div className="bg-[#16213e] rounded-xl p-4">
            <p className="text-sm font-semibold text-accent mb-1.5">
              상황 ③ 퇴근길 지하차도 — 물이 좀 고였지만 앞차가 지나갔다
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              &ldquo;앞차도 갔으니까&rdquo;가 가장 위험한 판단입니다. 지하차도
              수위는 <strong className="text-[#e8e8f0]">수십 초 만에</strong>{" "}
              범퍼에서 지붕까지 올라올 수 있고, 중간에 시동이 꺼지면 뒤차에
              막혀 후진도 못 합니다. 통제선이 없어도 물이 보이면{" "}
              <strong className="text-[#e8e8f0]">우회</strong>가 정답 — 10분
              돌아가는 것과 차 안에 갇히는 것의 선택입니다. 만약 이미 물속에서
              시동이 꺼졌다면: 안전벨트 풀기 → 창문 열기(안 열리면 헤드레스트
              철심으로 모서리 타격) → 지붕 위 또는 높은 곳으로.
            </p>
          </div>

          <div className="bg-[#16213e] rounded-xl p-4">
            <p className="text-sm font-semibold text-accent mb-1.5">
              상황 ④ 계곡 펜션 1박 — 밤새 폭우, 새벽에 &lsquo;우르릉&rsquo; 소리
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              천둥이 아니라 땅에서 나는 울림이면{" "}
              <strong className="text-[#e8e8f0]">산사태가 이미 시작된
              것</strong>일 수 있습니다. 창밖 확인하러 가지 말고 일행을 깨워
              즉시 건물을 벗어나 <strong className="text-[#e8e8f0]">계곡
              반대쪽·옆 방향의 높은 곳</strong>으로 뛰세요(산사태는 계곡을 따라
              내려옵니다). 애초에 폭우 예보가 있는 날 계곡·산기슭 숙소라면,
              어두워지기 전에 미리 자리를 옮기는 것이 유일하게 안전한
              선택입니다 — 새벽 대피는 몇 배 위험합니다.
            </p>
          </div>

          <div className="bg-[#16213e] rounded-xl p-4">
            <p className="text-sm font-semibold text-accent mb-1.5">
              상황 ⑤ 동해안 해변 — 발밑이 흔들리더니 바닷물이 쭉 빠진다
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              드러난 바닥을 구경하러 내려가는 사람들이 보여도 따라가면 안
              됩니다. <strong className="text-[#e8e8f0]">물 빠짐은 해일이 오기
              직전의 전조</strong>이고, 되돌아오는 파도는 걷는 속도보다
              빠릅니다. 사진 찍을 시간에 해안과 직각 방향으로 뛰어{" "}
              <strong className="text-[#e8e8f0]">언덕이나 3층 이상 콘크리트
              건물</strong>로 올라가세요. 그리고 첫 파도가 지나가도 내려오지
              마세요 — 두 번째, 세 번째 파도가 더 큰 경우가 많습니다.
            </p>
          </div>

          <div className="bg-[#16213e] rounded-xl p-4">
            <p className="text-sm font-semibold text-accent mb-1.5">
              상황 ⑥ 물이 빠진 다음 날 — 집이 엉망이라 빨리 치우고 싶다
            </p>
            <p className="text-xs text-[#c0c8d8] leading-relaxed break-keep">
              마음은 급하지만 순서를 지키면 수백만 원이 달라집니다. ①
              들어가기 전 가스 밸브·차단기 확인(감전·폭발 위험) ②{" "}
              <strong className="text-[#e8e8f0]">벽의 침수 흔적(물때 선)과 망가진
              가전·가구를 전부 사진으로</strong> — 실사 나온 공무원이 보는 건
              이 기록입니다 ③ 10일 안에 주민센터에 피해 신고 ④ 그다음에
              청소. 침수차는 &lsquo;시동 한 번만&rsquo;이 엔진을 완전히
              망가뜨립니다 — 그대로 보험사에 견인 요청하세요.
            </p>
          </div>
        </div>
      </Sec>

      <Sec title="재난 정보는 여기서 — 미리 깔아두세요">
        <GuideTable
          headers={["채널", "역할"]}
          rows={[
            ["안전디딤돌 앱 (행안부)", "재난문자·대피소·행동요령 통합 — 필수 설치"],
            ["국민재난안전포털 safekorea.go.kr", "특보 현황·대피소·피해 신고"],
            ["산사태정보시스템 (산림청)", "산사태 예보·취약지역 조회"],
            ["기상청 날씨누리·날씨알리미 앱", "호우·태풍·해일 특보"],
            ["119 / 지역번호+120", "구조 요청 / 지자체 재난 민원"],
          ]}
        />
      </Sec>

      <Sec title="피해 후 도움받는 법 — 아는 만큼 받습니다">
        <GuideTable
          headers={["지원", "내용"]}
          rows={[
            ["재난지원금 (사유재산)", "침수 주택 300만원, 소상공인 300만원 등 — 10일 내 신고 필수"],
            ["풍수해·지진재해보험", "보험료 70~92% 정부 지원, 주택 최대 8천만원 보상 (세입자도 가입 가능)"],
            ["특별재난지역 선포 시", "건보료·전기요금·통신비 감면, 세금 납부 유예 등 간접지원 추가"],
            ["이재민 구호", "임시주거시설·구호물자 — 지자체 + 희망브리지(전국재해구호협회)"],
            ["소상공인·세금", "중기부 재해 소상공인 지원, 국세청 재해 세액공제·납기 연장"],
          ]}
        />
        <p>
          핵심 두 가지만 기억하세요. ① <strong className="text-[#e8e8f0]">신고
          기한 10일</strong> — 청소·복구보다 사진과 신고가 먼저입니다. ②
          침수 위험 지역에 산다면 <strong className="text-[#e8e8f0]">풍수해보험이
          재난지원금보다 훨씬 큽니다</strong>(주택 침수 지원금 300만원 vs 보험
          최대 8천만원). 보험료 대부분을 정부가 내주는 정책보험이라 월 부담이
          작습니다 — 단, 같은 피해에 둘을 중복으로 받을 수는 없습니다.
        </p>
      </Sec>

      <Sec title="절대 하지 마세요">
        <p>❌ <strong className="text-[#e8e8f0]">&ldquo;차 빼러&rdquo; 지하주차장 내려가기</strong> — 폭우 인명사고의 단골 패턴입니다. 물이 보이면 차는 포기하세요. 자차보험이 차 값을, 목숨은 무엇도 대신 못 합니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">통제 중인 지하차도·하천도로 진입</strong> — 수십 초 만에 차가 잠깁니다. 우회가 늦더라도 진입 금지.</p>
        <p>❌ <strong className="text-[#e8e8f0]">사진 없이 청소부터</strong> — 실사 때 피해 입증이 안 되면 지원금이 깎이거나 제외됩니다. 기록 → 신고 → 정리 순서입니다.</p>
        <p>❌ <strong className="text-[#e8e8f0]">특보 해제 전 해안·계곡 복귀</strong> — 해일은 반복되고, 산사태는 비가 그친 뒤에도 발생합니다. 해제 안내까지 기다리세요.</p>
      </Sec>
    </HelpShell>
  );
}
