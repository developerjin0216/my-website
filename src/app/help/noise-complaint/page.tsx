import HelpShell from "@/components/help/HelpShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildHelpMetadata } from "@/data/help";

export const metadata = buildHelpMetadata("noise-complaint");

export default function NoiseComplaintPage() {
  return (
    <HelpShell id="noise-complaint">
      <Sec title="1분 요약 — 순서가 중요합니다">
        <p>1. <strong className="text-[#e8e8f0]">윗집에 직접 올라가지 마세요</strong> — 반복적인 초인종·문 두드리기·항의 방문은 스토킹처벌법으로 처벌될 수 있습니다. 피해자가 피고인이 된 판례가 실제로 있습니다.</p>
        <p>2. <strong className="text-[#e8e8f0]">관리사무소(경비실)에 중재 요청</strong> — 관리주체는 법에 따라 소음 세대에 중단을 권고할 수 있고, 상대는 협조 의무가 있습니다.</p>
        <p>3. 야간에 <strong className="text-[#e8e8f0]">음향기기·고성 등 고의적 소란</strong>이 계속되면 112 신고 가능(인근소란). 단, 아이 발소리 같은 생활소음은 경찰이 계도로 끝내는 경우가 많습니다.</p>
        <p>4. 다음 날 <strong className="text-[#e8e8f0]">층간소음 이웃사이센터 1661-2642</strong>(평일 09~18시)에 상담을 신청하고, 소음 일지를 쓰기 시작하세요.</p>
      </Sec>

      <Sec title="어디에 신고하나 — 소음 유형별 경로">
        <GuideTable
          headers={["소음 유형", "접수 경로"]}
          rows={[
            ["발소리·쿵쿵(직접충격)", "관리사무소 → 이웃사이센터 1661-2642"],
            ["TV·음악(공기전달)", "관리사무소 → 이웃사이센터"],
            ["고성방가·싸움 소리", "112 (경범죄 인근소란 — 층간소음 절차 대상 아님)"],
            ["보일러·배수관·실외기", "관리사무소 (시설 하자 점검 — 측정 대상 아님)"],
            ["옆집(벽간) 소음", "층간소음과 동일 절차로 접수 가능"],
          ]}
        />
        <p>
          경로가 갈리는 이유: 법정 &ldquo;층간소음&rdquo;은 발소리 등
          직접충격소음과 TV 등 공기전달소음만 해당하고, 사람 목소리·기계
          소음·동물 소리는 범위 밖이라 이웃사이센터의 측정·조정 대상이
          아닙니다. 대략 <strong className="text-[#e8e8f0]">&ldquo;고성방가는 112,
          발소리는 이웃사이센터&rdquo;</strong>로 기억하면 됩니다.
        </p>
      </Sec>

      <Sec title="이웃사이센터 — 무료지만 시간이 걸립니다">
        <p>
          기후에너지환경부·한국환경공단이 운영하는 무료 서비스입니다. 전화
          상담(1661-2642) 또는 온라인(floor.noiseinfo.or.kr) 접수 → 상대
          세대에 안내문 발송 → 방문상담 → 그래도 계속되면{" "}
          <strong className="text-[#e8e8f0]">소음 측정(1시간~24시간 연속,
          무료)</strong>까지 진행됩니다. 단계가 많아{" "}
          <strong className="text-[#e8e8f0]">수개월 걸릴 수 있고</strong> 강제력은
          없다는 한계를 알고 시작하는 게 좋습니다 — 그래서 그동안의 소음
          일지(날짜·시간·유형·지속시간)와 민원 접수 이력이 중요합니다. 이후
          조정·소송의 증거가 됩니다.
        </p>
        <p>
          그래도 해결이 안 되면: <strong className="text-[#e8e8f0]">공동주택관리
          분쟁조정위원회</strong>(namc.molit.go.kr, 수수료 1만원)나{" "}
          <strong className="text-[#e8e8f0]">환경분쟁조정피해구제위원회</strong>(ecc.me.go.kr,
          피해 배상 판단)에 조정을 신청할 수 있습니다.
        </p>
      </Sec>

      <Sec title="법적 기준 — 몇 dB부터 층간소음인가">
        <GuideTable
          headers={["구분", "주간(06~22시)", "야간(22~06시)"]}
          rows={[
            ["발소리 등 직접충격 (1분 평균)", "39dB", "34dB"],
            ["직접충격 최고소음 (1시간 3회 이상)", "57dB", "52dB"],
            ["TV 등 공기전달 (5분 평균)", "45dB", "40dB"],
          ]}
        />
        <p className="text-xs text-[#606070]">
          2023년 강화된 기준. 2005년 6월 이전 사업승인 구축 아파트는 +2dB 완화
          적용. 기준 초과는 조정·배상의 근거가 되지만 그 자체로 형사처벌은
          아닙니다.
        </p>
      </Sec>

      <Sec title="절대 하지 말 것 — 보복하면 내가 처벌받습니다">
        <p>
          대법원은 층간소음에 대한 보복으로 도구로 천장·벽을 반복해서 두드리고
          음향기기를 튼 행위를 <strong className="text-[#e8e8f0]">스토킹범죄로 인정해
          징역형(집행유예)을 확정</strong>했습니다(2023년). 천장에 우퍼 스피커를
          달아 보복한 사건들도 잇달아 유죄가 나왔습니다 — 이른바 &ldquo;층간소음
          복수 스피커&rdquo;는 사는 것부터가 형사 리스크입니다. 반복적인 항의
          방문·초인종·쪽지 붙이기도 스토킹으로 처벌될 수 있고, &ldquo;몇
          번까지는 괜찮다&rdquo;는 기준이 없으니 방문 항의 자체를 피하세요.
          이웃집 내부 대화를 몰래 녹음하는 것도 통신비밀보호법 위반 소지가
          있습니다.
        </p>
        <p className="text-xs text-[#606070]">
          이 페이지는 일반 안내이며 법률 자문이 아닙니다. 구체적 분쟁은
          변호사나 대한법률구조공단(132)과 상담하세요. 2026년 8월 기준.
        </p>
      </Sec>
    </HelpShell>
  );
}
