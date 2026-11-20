import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";

// 문의 페이지 — 애드센스 심사와 E-E-A-T 에서 "연락할 수 있는 운영자"의 증거가 됩니다.
// 2026-11-18: 퀴즈 서비스가 삭제되었는데도 문의 항목에 "퀴즈 문제·해설 오류",
// "퀴즈 카테고리"가 남아 있었습니다. 지금 실제로 운영하는 서비스 기준으로 다시 썼습니다.

export const metadata: Metadata = {
  title: { absolute: `문의하기 - ${BRAND}` },
  description:
    "8282114 생활안내 문의 — 계산기·안내 내용의 오류 제보, 콘텐츠 제안, 광고·제휴, 개인정보 관련 문의를 받습니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen page-shell">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">문의하기</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">문의 이메일</h2>
            <p>
              모든 문의는 아래 이메일로 보내주세요. 확인 후 순차적으로 답변드리며,
              보통 2~3일 이내에 회신합니다.
            </p>
            <p className="mt-3 text-center">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block bg-[#16213e] border border-[#2a3a5a] rounded-xl px-5 py-3 text-accent font-semibold hover:border-accent transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">
              오류 제보할 때 적어주시면 좋은 것
            </h2>
            <p>
              이 사이트에는 법령·고시에 따라 달라지는 숫자가 많습니다. 요율이
              개정됐는데 반영이 늦었거나, 계산식 자체가 틀린 경우가 생길 수
              있습니다. 아래 세 가지만 알려주시면 확인이 훨씬 빨라집니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>
                <strong className="text-white">페이지 주소</strong> — 주소창의
                링크를 그대로 복사해 주세요
              </li>
              <li>
                <strong className="text-white">입력한 값과 나온 값</strong> —
                계산기라면 어떤 숫자를 넣었을 때 얼마가 나왔는지, 안내 글이라면
                어떤 문장이 문제인지
              </li>
              <li>
                <strong className="text-white">맞다고 생각하는 값과 근거</strong>{" "}
                — 고시나 공식 안내 링크가 있으면 가장 좋습니다
              </li>
            </ul>
            <p className="mt-3">
              확인 결과 숫자가 틀렸다면 계산기와 설명글을 같은 자료를 보고 함께
              고치고, 페이지 하단의 최종 확인 날짜를 갱신합니다. 틀리지 않았다면
              왜 그런 값이 나오는지 회신으로 설명드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">이런 문의를 받습니다</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#a0a0b0]">
              <li>
                <strong className="text-white">오류 제보</strong> — 계산기 요율·계산
                결과 오류, 안내 글의 사실·연락처 오류, 도구가 동작하지 않는 경우
                (해당 페이지 주소를 함께 보내주시면 빠르게 확인할 수 있습니다)
              </li>
              <li>
                <strong className="text-white">콘텐츠 제안</strong> — 추가되었으면 하는
                생활 계산기, 다루지 않은 긴급 상황, 영문 가이드 주제
              </li>
              <li>
                <strong className="text-white">광고·제휴</strong> — 광고 게재, 콘텐츠 제휴 문의
              </li>
              <li>
                <strong className="text-white">개인정보</strong> — 개인정보 처리 관련 문의
                (자세한 내용은 개인정보처리방침 참고)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">
              답변드리기 어려운 것
            </h2>
            <p>
              개인의 사정에 맞춘 판단은 드릴 수 없습니다. 이 사이트의 계산기는
              공개된 요율에 숫자를 넣어 계산할 뿐이고, 실제 수급 자격이나 세액,
              보상 여부는 재산·소득·계약 내용·분쟁 경위에 따라 달라집니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>
                &ldquo;제가 실업급여 대상이 되나요&rdquo;, &ldquo;이 경우 퇴직금을
                받을 수 있나요&rdquo; 같은 개별 판정 — 고용노동부 상담(1350)이나
                관할 고용센터가 정확합니다
              </li>
              <li>
                법률·세무·의료 자문 — 자격을 가진 전문가에게 문의하셔야 합니다
              </li>
              <li>
                특정 업체나 상품의 추천·비교 의뢰
              </li>
            </ul>
            <p className="mt-3">
              대신 &lsquo;이 숫자가 어떻게 나온 건지&rsquo;, &lsquo;어느 기관
              자료를 근거로 했는지&rsquo;는 얼마든지 물어보셔도 됩니다. 각 페이지
              하단에 출처를 링크로 밝혀두고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">
              전화번호가 연결되지 않을 때
            </h2>
            <p>
              기관 대표번호는 상담 창구가 통합되거나 새로 생기면서 바뀝니다. 이
              사이트는 번호를 바꿀 때마다 페이지 상단의 확인 날짜를 갱신하고 있지만,
              공지가 늦게 알려지는 경우도 있습니다. 안내한 번호로 연결되지 않으면
              해당 기관 홈페이지의 대표번호를 보거나 국민콜 110(정부 민원
              종합안내)에 물어보세요. 급한 상황이라면 112·119가 우선입니다.
            </p>
            <p className="mt-3">
              바뀐 번호를 알려주시면 그 페이지의 숫자와 설명을 함께 고치고, 확인
              날짜도 그날로 바꿉니다. 그 번호가 어느 안내에서 나온 것인지(기관
              홈페이지 주소나 공지 링크)를 같이 보내주시면 바로 대조할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">운영</h2>
            <p>
              이 사이트는 개인이 혼자 만들고 운영합니다. 회사나 기관이 아니라
              한 사람이 쓰고 고치는 곳이라, 답장이 늦어지는 날이 있을 수 있습니다.
              그래도 오류 제보는 가장 먼저 처리합니다 — 틀린 숫자를 그대로 두는
              것이 이 사이트에서 가장 나쁜 일이기 때문입니다.
            </p>
            <p className="mt-3">
              사이트의 운영 목적과 콘텐츠 작성 기준은{" "}
              <Link href="/about" className="text-accent hover:underline">
                사이트 소개
              </Link>
              에 적어두었습니다.
            </p>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex justify-center gap-3 mb-2">
          <Link href="/about" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            소개
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/privacy" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            개인정보처리방침
          </Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/terms" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            이용약관
          </Link>
        </div>
        <p className="text-xs text-[#606070]">© 2026 {BRAND} — 급할 때 생활 안내</p>
      </footer>
    </div>
  );
}
