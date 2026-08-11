import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("urgent-passport");

export default function UrgentPassportPage() {
  return (
    <HelpShell id="urgent-passport">
      <Sec title="1분 요약 — 출국까지 남은 시간으로 판단">
        <p>1. <strong className="text-[#e8e8f0]">출국이 당일~내일</strong> → 공항 여권민원센터에서 <strong className="text-[#e8e8f0]">긴급여권</strong>(당일 발급, 비전자·1년 단수). 단 운영시간은 09~18시뿐 — 24시간이 아닙니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">2일 이상 남았고 미국 등 전자여권 필수 국가</strong> → <strong className="text-[#e8e8f0]">48시간 내 발급여권</strong>(전자여권) — 당일 14시 전에 여권 대행기관 접수.</p>
        <p>3. 행선지가 <strong className="text-[#e8e8f0]">긴급여권을 받아주는 나라인지</strong>부터 확인 — 미국은 ESTA가 안 돼서 긴급여권 무비자 입국 불가입니다.</p>
        <p>4. 새벽에 여권 문제를 발견했다면 <strong className="text-[#e8e8f0]">영사콜센터 02-3210-0404</strong>(24시간)로 먼저 경로를 확인하세요.</p>
      </Sec>

      <Sec title="세 가지 경로 비교">
        <GuideTable
          headers={["구분", "긴급여권", "48시간 발급", "일반 재발급"]}
          rows={[
            ["소요", "당일", "48시간 이내", "근무일 8일"],
            ["종류", "비전자·1년 단수", "정식 전자여권", "정식 전자여권"],
            ["수수료", "50,000원", "일반과 동일 (10년 58면 52,000원)", "동일"],
            ["미국 ESTA", "불가", "가능", "가능"],
          ]}
        />
        <p>
          긴급여권은 출국·입국 각 1회만 쓸 수 있는 스티커 부착식 여권입니다.
          친족 사망·위독 증빙이 있으면 수수료가 17,000원으로 감면되고, 발급 후
          6개월 내 증빙을 내면 차액을 환불받을 수도 있습니다. 참고: 인터넷에
          퍼진 &ldquo;53,000원&rdquo;은 옛 금액입니다(현행 50,000원, 외교부
          여권안내 기준). 5년 내 여권을 3회 이상 분실했다면 긴급여권 발급이
          안 됩니다.
        </p>
      </Sec>

      <Sec title="긴급여권 발급처 — 공휴일엔 T1이 쉽니다">
        <GuideTable
          headers={["발급처", "운영", "비고"]}
          rows={[
            ["인천공항 T2 (2층 정부종합행정센터)", "09~18시 · 365일", "032-740-2782~3"],
            ["인천공항 T1 (3층 G카운터 부근)", "09~18시 · 토일 운영", "법정공휴일 휴무 · 032-740-2777~8"],
            ["김해공항 여권민원센터", "09~18시 · 365일", ""],
            ["전국 여권과 (광역·서울 구청 등 66곳)", "기관별 상이", "일부 구청 토요일 불가"],
          ]}
        />
        <p>
          <strong className="text-[#e8e8f0]">준비물</strong>: 신분증, 6개월 이내 촬영한
          여권용 사진 1매(3.5×4.5cm, 흰 배경·보정 불가), 항공권 사본(공항 접수 시
          필수), 긴급 사유 증빙(있으면). 신청서·사유서는 현장에서 작성합니다.
          블로그에 도는 &ldquo;인천공항 24시간 발급&rdquo;은{" "}
          <strong className="text-[#e8e8f0]">사실이 아니니</strong> 야간·새벽
          출국이라면 발급이 불가능합니다 — 항공편 변경을 먼저 검토하세요.
        </p>
      </Sec>

      <Sec title="긴급여권으로 못 가는 나라 — 경유지까지 확인">
        <p>
          긴급여권은 전자칩이 없는 비전자여권이라 나라마다 인정 여부가
          다릅니다. 대표적으로 <strong className="text-[#e8e8f0]">미국은 비전자여권으로
          ESTA(전자여행허가)를 신청할 수 없어 무비자 입국이 불가</strong>합니다(주미
          대사관 공식). 방문국뿐 아니라 <strong className="text-[#e8e8f0]">경유국</strong>까지
          외교부 여권안내(passport.go.kr)의 &ldquo;비전자여권 국가별
          인정현황&rdquo; 최신 PDF로 확인하거나 영사콜센터에 물어보세요.
        </p>
        <p>
          또 하나 — 상당수 국가가 입국 시 여권 잔여 유효기간 6개월 이상을
          요구합니다. 긴급여권은 유효기간이 1년뿐이니 귀국 후 재출국 계획이
          있다면 돌아오자마자 정식 여권을 재발급받는 게 좋습니다.
        </p>
      </Sec>

      <Sec title="시간이 좀 있다면 — 일반 재발급 팁">
        <p>
          전자여권을 한 번이라도 발급받은 적이 있으면{" "}
          <strong className="text-[#e8e8f0]">정부24에서 온라인 재발급 신청</strong>이
          가능합니다(생애 최초는 방문 필수). 처리는 근무일 8일 기준이고
          성수기(방학·휴가철)엔 더 걸릴 수 있으니, 여행이 확정되면 가장 먼저
          여권 유효기간부터 확인하는 습관이 최선의 예방입니다. 사진은 외교부
          여권안내 홈페이지의 &ldquo;온라인 여권 사진 검증&rdquo;에서 무료로
          적합 여부를 미리 판정받을 수 있습니다.
        </p>
        <p className="text-xs text-[#606070]">
          수수료·운영시간·인정 국가는 수시로 바뀝니다. 2026년 8월 외교부
          여권안내·인천공항 공식 기준이며, 방문 전 영사콜센터(02-3210-0404,
          24시간)로 최종 확인을 권장합니다.
        </p>
      </Sec>
    </HelpShell>
  );
}
