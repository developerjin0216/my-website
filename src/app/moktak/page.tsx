import type { Metadata } from "next";
import Link from "next/link";
import MoktakClient from "./MoktakClient";
import { robotsFor } from "@/lib/indexPolicy";
import { ROOT_URL, ROOT_SITE_NAME } from "@/lib/site";

// 사이버 목탁 — 별도 서비스. 사이트 주제(급할 때 생활 안내) 밖이라 색인에서 뺍니다
// (indexPolicy NOINDEX_SECTIONS). 검색이 아니라 직접 링크·공유로 쓰는 페이지입니다.
// 광고·제휴 블록은 두지 않습니다 — 이 화면의 쓰임새와 맞지 않습니다.

const url = `${ROOT_URL}/moktak`;

export const metadata: Metadata = {
  title: { absolute: `사이버 목탁 - 터치하면 소리 나는 온라인 목탁 | ${ROOT_SITE_NAME}` },
  description:
    "화면의 목탁을 터치하면 채가 내려치고 목탁이 흔들리며 똑 소리가 납니다. 설치·로그인 없이 브라우저에서 바로. 친 횟수는 이 기기에만 저장됩니다.",
  robots: robotsFor("/moktak"),
  alternates: { canonical: url },
  openGraph: {
    title: "사이버 목탁",
    description: "터치하면 소리 나는 온라인 목탁",
    url,
    siteName: ROOT_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

export default function MoktakPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <header className="px-5 pt-6 pb-2">
        <Link href="/" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← {ROOT_SITE_NAME}
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">사이버 목탁</h1>
        <p className="text-sm text-[#a0a0b0] mt-1 leading-relaxed">
          목탁을 터치하세요. 채가 내려치고 소리가 납니다.
        </p>
      </header>

      <main className="px-5 py-8 flex-1 flex flex-col items-center justify-center">
        <MoktakClient />
      </main>

      <section className="px-5 pb-6 space-y-3 text-sm text-[#a0a0b0] leading-relaxed break-keep">
        <div className="bg-card rounded-2xl p-5 space-y-2">
          <h2 className="text-base font-bold text-accent">쓰는 법</h2>
          <p>화면의 목탁을 탭하거나 클릭하면 한 번 칩니다. 키보드는 스페이스나 엔터입니다.</p>
          <p>
            소리가 안 나면 기기의 무음 스위치와 볼륨을 확인하세요. 아이폰은 무음 모드에서
            웹 소리가 나지 않습니다. 소리는 파일이 아니라 브라우저가 그 자리에서 만듭니다 —
            칠 때마다 음이 아주 조금씩 다른 이유입니다.
          </p>
          <p>친 횟수는 이 기기의 브라우저에만 남고 어디로도 전송되지 않습니다.</p>
        </div>
        <div className="bg-card rounded-2xl p-5 space-y-2">
          <h2 className="text-base font-bold text-accent">목탁</h2>
          <p>
            목탁은 나무를 속이 비게 깎아 울림을 내는 법구입니다. 염불이나 독경의 박자를
            맞추는 데 쓰고, 몸통 아래의 긴 틈이 울림통 역할을 합니다. 손잡이 쪽에 물고기
            모양을 새기는 것은 눈을 감지 않는 물고기처럼 깨어 있으라는 뜻으로 전해집니다.
          </p>
        </div>
      </section>

      <footer className="px-5 py-4 text-center border-t border-[#2a3a5a]">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <Link href="/" className="text-xs text-[#606070] hover:text-[#a0a0b0]">홈</Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/about" className="text-xs text-[#606070] hover:text-[#a0a0b0]">소개</Link>
          <span className="text-xs text-[#606070]">|</span>
          <Link href="/privacy" className="text-xs text-[#606070] hover:text-[#a0a0b0]">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
