import { Suspense } from "react";
import type { Metadata } from "next";
import OmokClient from "./OmokClient";
import { ROOT_URL, SITE_NAME } from "@/lib/site";

// 초대 링크(/omok?r=CODE&n=닉네임)로 들어오면 그 방으로 바로 들어갑니다.
//
// 이 게임이 퍼질 유일한 경로는 사람이 손으로 보내는 링크입니다. 그런데 링크만
// 덜렁 가면 대부분 누르지 않으므로, 방마다 다른 미리보기 카드를 만들어
// 카톡·디스코드에서 "○○님이 오목 한 판 신청했습니다"로 펼쳐지게 합니다.
// 사실상 이 카드가 유일한 광고 소재입니다.

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const raw = Array.isArray(sp.r) ? sp.r[0] : sp.r;
  const code = (raw ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
  if (!code) return {}; // 초대가 아니면 layout의 기본 메타를 씁니다

  const nameRaw = Array.isArray(sp.n) ? sp.n[0] : sp.n;
  const name = (nameRaw ?? "").replace(/[\r\n\t]/g, " ").trim().slice(0, 12);
  const who = name || "친구";

  const og = `${ROOT_URL}/api/og/omok?r=${code}${
    name ? `&n=${encodeURIComponent(name)}` : ""
  }`;
  const title = `${who}님이 오목 한 판 신청했습니다`;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description:
      "설치도 가입도 없이 링크 하나로 바로 둡니다. 닉네임만 정하면 시작해요.",
    // 초대 링크는 일회성이라 색인 대상이 아닙니다. canonical은 자기 자신을
    // 가리켜야 합니다 — 다른 URL을 가리키면 noindex가 그쪽으로 번질 수 있습니다.
    robots: { index: false, follow: true },
    alternates: { canonical: `${ROOT_URL}/omok` },
    openGraph: {
      title,
      description: "설치·가입 없이 링크 하나로 바로 두는 1:1 오목",
      url: `${ROOT_URL}/omok?r=${code}`,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

export default function OmokPage() {
  // useSearchParams를 쓰는 클라이언트 컴포넌트는 Suspense 경계가 필요합니다
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto w-full px-5 py-20 text-center">
          <p className="text-sm text-[#606070]">불러오는 중…</p>
        </div>
      }
    >
      <OmokClient />
    </Suspense>
  );
}
