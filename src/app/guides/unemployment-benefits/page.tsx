import Link from "next/link";
import GuideShell, { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildGuideMetadata } from "@/data/guides";

export const metadata = buildGuideMetadata("unemployment-benefits");

// 수치는 실업급여 계산기(2026년 이직자 기준)와 동일합니다.
export default function UnemploymentBenefitsGuide() {
  return (
    <GuideShell id="unemployment-benefits">
      <Sec title="실업급여, 누가 받을 수 있나?">
        <p>
          구직급여(통칭 실업급여)의 기본 요건은 두 가지입니다:{" "}
          <strong className="text-[#e8e8f0]">비자발적 이직</strong>(권고사직,
          계약만료, 폐업·도산 등) +{" "}
          <strong className="text-[#e8e8f0]">이직 전 18개월 중 고용보험 가입
          180일 이상</strong>. 알바·계약직도 고용보험에 가입되어 있었다면
          동일하게 적용됩니다.
        </p>
        <p>
          자발적 퇴사는 원칙적으로 안 되지만 예외가 있습니다 — 임금체불,
          최저임금 미달, 직장 내 괴롭힘, 왕복 3시간 이상 통근 곤란, 질병으로
          업무 수행이 어려운 경우 등은 정당한 이직 사유로 인정될 수 있습니다.
        </p>
      </Sec>

      <Sec title="얼마나, 얼마 동안 받나?">
        <p>
          1일 지급액은 <strong className="text-[#e8e8f0]">퇴직 전 3개월 평균임금의
          60%</strong>이며, 2026년 이직자 기준 상한 68,100원·하한
          66,048원(최저시급의 80% × 8시간)이 적용됩니다. 상·하한 폭이 좁아
          대부분 하루 6만 6천~6만 8천원 수준입니다.
        </p>
        <GuideTable
          headers={["고용보험 가입기간", "50세 미만", "50세 이상·장애인"]}
          rows={[
            ["1년 미만", "120일", "120일"],
            ["1년 ~ 3년", "150일", "180일"],
            ["3년 ~ 5년", "180일", "210일"],
            ["5년 ~ 10년", "210일", "240일"],
            ["10년 이상", "240일", "270일"],
          ]}
        />
        <p>
          예를 들어 45세, 가입기간 6년이면 210일 × 약 6만 8천원 ≈ 1,430만원
          수준입니다. 내 조건 기준 예상액은{" "}
          <Link
            href="/calculators/unemployment"
            className="text-accent underline"
          >
            실업급여 계산기
          </Link>
          에서 바로 확인하세요.
        </p>
      </Sec>

      <Sec title="신청 절차 4단계">
        <p>1. <strong className="text-[#e8e8f0]">이직확인서 처리 확인</strong> — 회사가 고용센터에 제출해야 합니다. 고용24(work24.go.kr)에서 처리 여부를 확인하고, 안 해주면 요청하세요.</p>
        <p>2. <strong className="text-[#e8e8f0]">구직 등록</strong> — 고용24에서 이력서 등록 후 구직 신청.</p>
        <p>3. <strong className="text-[#e8e8f0]">수급자격 신청</strong> — 온라인 교육 수강 후 거주지 관할 고용센터 방문(또는 온라인) 신청. 대기기간 7일 후 지급이 시작됩니다.</p>
        <p>4. <strong className="text-[#e8e8f0]">실업인정</strong> — 4주마다 구직활동(입사 지원, 면접, 직업훈련 등) 실적을 제출해야 해당 기간분이 지급됩니다.</p>
      </Sec>

      <Sec title="2026년에 바뀐 것">
        <p>
          <strong className="text-[#e8e8f0]">상한액 7년 만에 인상</strong> — 하한액이
          최저임금 인상으로 66,048원이 되면서 기존 상한(66,000원)을 역전하게
          되자, 상한이 68,100원으로 함께 인상됐습니다. 2026년 1월 1일 이후
          이직자부터 적용됩니다.
        </p>
        <p>
          <strong className="text-[#e8e8f0]">반복수급 제재 강화</strong> — 5년 안에
          3회 이상 수급하면 급여가 최대 50%까지 감액되고 대기기간도
          길어집니다.
        </p>
      </Sec>

      <Sec title="놓치기 쉬운 것들">
        <p>
          수급기간은 <strong className="text-[#e8e8f0]">이직일 다음 날부터
          12개월</strong>입니다 — 이 안에 소정급여일수를 다 받아야 하므로, 퇴사
          후 미루지 말고 바로 신청하는 것이 유리합니다. 수급 중 재취업하면
          남은 급여의 일부를 조기재취업수당으로 받을 수 있고, 취업 사실을
          숨기고 받으면 부정수급으로 환수·추가 징수됩니다.
        </p>
      </Sec>
    </GuideShell>
  );
}
