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
    <div className="flex flex-col min-h-screen page-shell">
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
        {/* 아래 숫자는 전부 MoktakClient.tsx 의 TONE·STICK_MS·BODY_* 값입니다.
            값을 바꾸면 이 문단도 같이 고치세요. */}
        <div className="bg-card rounded-2xl p-5 space-y-2">
          <h2 className="text-base font-bold text-accent">소리와 움직임</h2>
          <p>
            목탁 소리는 녹음 파일을 트는 것이 아니라 칠 때마다 브라우저가 합성합니다.
            460Hz에서 1,150Hz 사이의 음 여덟 개를 겹치는데, 가장 크게 울리는 것은 655Hz·637Hz·596Hz
            부근입니다. 각 음은 0.3초가 안 돼 사라지고, 사라지면서 음 높이가 아주 조금 내려갑니다.
            여기에 나무가 울리는 짧은 &lsquo;툭&rsquo; 소리와 채가 닿는 순간의 더 짧은 &lsquo;딱&rsquo;
            소리를 얹고, 2,500Hz보다 높은 날카로운 성분은 깎아 냅니다.
          </p>
          <p>
            누르는 순간 채가 내려와 목탁을 치고, 조금 늦게 몸통이 살짝 눌렸다가 흔들리며 제자리로
            돌아옵니다. 한 번의 동작은 0.5초 남짓입니다. 진동을 지원하는 휴대폰에서는 칠 때 아주
            짧게 진동합니다.
          </p>
          <p>
            &lsquo;소리 켜짐&rsquo; 버튼으로 소리를 끄면 채의 움직임과 횟수 세기는 그대로이고 소리만
            나지 않습니다. 소리 기능이 없는 브라우저에서도 마찬가지로 움직임과 횟수만 동작합니다.
            &lsquo;처음부터&rsquo;를 누르면 횟수가 0으로 돌아가고 이 기기에 저장된 기록도 지워집니다.
            브라우저는 사람이 화면을 누르기 전에는 소리를 내지 못하게 막기 때문에, 소리 장치는 첫
            터치 때 준비됩니다.
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
