import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CONTACT_EMAIL } from "@/lib/site";

// 이용약관 — 2026-11-18: 삭제된 퀴즈·퀴즈 배틀 조항을 지우고 실제 서비스 기준으로 다시 썼습니다.
// 광고·제휴와 저작권 조항을 더했습니다 — 이 사이트는 쿠팡 파트너스 배너로 운영되고,
// 글을 그대로 복사해 가는 곳이 있어 기준을 약관에 적어두는 편이 낫습니다.

export const metadata: Metadata = {
  title: { absolute: `이용약관 - ${BRAND}` },
  description:
    "8282114 생활안내 이용약관입니다. 긴급 상황 안내, 생활 계산기, 생활·서류 도구, 도로 CCTV, 영문 가이드의 이용 조건과 광고·저작권·면책 범위를 정합니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen page-shell">
      <header className="bg-header px-5 py-5 text-center">
        <Link href="/" className="text-sm text-[#a0a0b0] mb-1 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-accent">이용약관</h1>
      </header>

      <div className="flex-1 px-5 py-6">
        <div className="bg-card rounded-2xl p-5 text-sm text-[#c0c8d8] leading-relaxed space-y-5">
          <section>
            <h2 className="text-base font-bold text-white mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 8282114 생활안내(8282114.xyz)와 그 안의 모든 페이지 — 이하
              통칭 &ldquo;서비스&rdquo; — 의 이용과 관련하여 서비스 제공자와 이용자
              간의 권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제2조 (서비스 내용)</h2>
            <p>서비스는 다음 기능을 무료로 제공합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>긴급 상황·생활 대처 안내 — 분실, 사고, 사기, 체불, 병원비 등 상황별 대처법과 연락처</li>
              <li>생활 계산기와 생활 가이드 — 연봉 실수령액, 퇴직금, 전기요금, 실업급여 등</li>
              <li>생활·서류 도구 — 사진 위치정보 확인·제거, 이미지 압축, PDF 합치기·나누기, 여권사진 규격, QR 생성 등 브라우저에서 동작하는 도구</li>
              <li>실시간 도로 CCTV — 고속도로·국도·국립공원 영상 확인</li>
              <li>영문 가이드 — 한국에 사는 외국인을 위한 같은 안내의 영문판</li>
            </ul>
            <p className="mt-2 text-[#a0a0b0]">
              안내 콘텐츠와 계산 결과는 참고용 정보 제공이며 법률·의료·세무
              자문이 아닙니다. 중요한 결정은 관련 기관·전문가의 확인을
              거치시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제3조 (이용 조건)</h2>
            <p>
              서비스는 별도의 회원가입 없이 누구나 이용할 수 있습니다. 서비스 안에
              남아 있는 1:1 오목을 이용할 때는 닉네임을 입력하며, 그 닉네임은 대국
              세션 동안에만 쓰이고 저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제4조 (광고 및 제휴)</h2>
            <p>
              서비스는 Google AdSense 광고와 쿠팡 파트너스 제휴 배너로 운영됩니다.
              제휴 링크를 통해 상품을 구매하면 서비스 제공자가 일정액의 수수료를
              받으며, 해당 배너에는 그 사실을 표시합니다. 광고와 제휴는 어떤 내용을
              어떻게 설명할지에 영향을 주지 않습니다.
            </p>
            <p className="mt-2 text-[#a0a0b0]">
              배너를 누르면 쿠팡 등 외부 사이트로 이동하며, 그 이후의 결제·배송·환불은
              해당 사이트의 약관과 개인정보처리방침을 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제5조 (저작권)</h2>
            <p>
              서비스가 직접 작성한 안내 글과 계산기의 저작권은 서비스 제공자에게
              있습니다. 출처와 링크를 밝히고 일부를 인용하는 것은 허용되지만, 글
              전체를 복제해 다른 사이트에 올리거나 상업적으로 재배포하려면 사전
              허락이 필요합니다.
            </p>
            <p className="mt-2 text-[#a0a0b0]">
              각 페이지의 공식 출처 블록에서 링크하는 법령·고시·보도자료의 권리는
              해당 기관에 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제6조 (이용자의 의무)</h2>
            <p>이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0b0]">
              <li>타인에게 불쾌감을 주는 닉네임 사용</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>서비스를 이용한 영리 목적의 활동</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제7조 (서비스의 변경 및 중단)</h2>
            <p>
              서비스 제공자는 운영상 또는 기술상의 필요에 따라 서비스의 전부 또는
              일부를 변경하거나 중단할 수 있습니다. 이 경우 사전에 서비스 내
              공지사항을 통해 안내합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제8조 (면책 조항)</h2>
            <p>
              서비스의 안내 글과 계산 결과는 공개된 법령·고시·공식 안내를 근거로
              작성하지만, 제도가 바뀌거나 개별 사정이 다르면 실제 결과와 달라질 수
              있습니다. 서비스 제공자는 정보의 완전한 정확성을 보장하지 않으며,
              서비스 이용으로 발생하는 문제에 대해 법적 책임을 지지 않습니다. 도로
              CCTV 영상과 쇼핑 배너처럼 외부 기관·업체가 제공하는 내용은 해당
              제공자의 책임입니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제9조 (약관의 변경)</h2>
            <p>
              본 약관은 2026년 5월 7일부터 시행됩니다. 약관이 변경될 경우 본
              페이지를 통해 공지하며, 변경된 약관은 공지 후 7일이 경과한 시점부터
              효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">제10조 (문의)</h2>
            <p>
              서비스 이용 관련 문의:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <p className="text-xs text-[#606070]">
          © 2026 {BRAND}
        </p>
      </footer>
    </div>
  );
}
