import type { Metadata } from "next";
import Link from "next/link";
import ParkViewer from "@/components/tools/ParkViewer";
import CoupangProducts from "@/components/CoupangProducts";
import { PARK_CAMS, PARK_SOURCE_URL } from "@/data/cctvParks";
import { HIGHWAYS } from "@/data/cctvHighwayList";
import { robotsFor } from "@/lib/indexPolicy";
import { CONTACT_EMAIL, ROOT_SITE_NAME, ROOT_URL } from "@/lib/site";

// 국립공원 실시간 CCTV — 단풍(10~11월)·눈꽃(12~2월)·새해 일출 때 산 정상과 해안 상황을 보는 페이지.
// [road] 와 같은 층에 있지만 정적 폴더라 동적 경로보다 먼저 잡힙니다. (hub) 그룹 밖이라
// ToolShell 을 물려받지 않습니다 — 이유는 [road]/page.tsx 주석 참고.

const PATH = "/tools/cctv/national-parks";
const parks = [...new Set(PARK_CAMS.map((c) => c.park))];

const title = `국립공원 실시간 CCTV ${PARK_CAMS.length}곳 - 설악산·지리산·북한산·내장산 지금 날씨`;
const description = `설악산 울산바위, 지리산 천왕봉, 북한산 백운대, 내장산 단풍길, 태안 학암포 등 국립공원 ${parks.length}곳의 실시간 영상을 한 곳에 모았습니다. 단풍·눈꽃·일출 보러 가기 전에 지금 산 위 날씨를 확인하세요.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${ROOT_URL}${PATH}` },
  robots: robotsFor(PATH),
  openGraph: {
    title,
    description,
    url: `${ROOT_URL}${PATH}`,
    siteName: ROOT_SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
};

export default function NationalParksCctvPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ROOT_SITE_NAME, item: ROOT_URL },
      { "@type": "ListItem", position: 2, name: "전국 도로 CCTV", item: `${ROOT_URL}/tools/cctv` },
      { "@type": "ListItem", position: 3, name: "국립공원 CCTV", item: `${ROOT_URL}${PATH}` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bg-header px-5 py-5">
        <Link href="/tools/cctv" className="text-sm text-[#a0a0b0] hover:text-accent">
          ← 전국 도로 CCTV
        </Link>
        <h1 className="text-2xl font-bold text-accent mt-2">국립공원 실시간 CCTV</h1>
        <p className="text-sm text-[#a0a0b0] mt-1 leading-relaxed break-keep">
          국립공원 {parks.length}곳, 카메라 {PARK_CAMS.length}대의 지금 영상입니다. 산 정상과
          탐방로, 해안을 비추는 카메라라 단풍이 얼마나 들었는지, 정상에 눈이 쌓였는지,
          안개가 꼈는지를 출발 전에 볼 수 있습니다.
        </p>
      </header>

      <main className="px-5 py-5 flex-1 space-y-4">
        <ParkViewer />

        {/* 뷰어 바로 아래, 페이지당 하나. 이 페이지는 단풍·눈꽃·일출 전에 산 위 날씨를
            보는 사람이 옵니다 — 겨울 산행에서 실제로 쓰는 물건으로 좁혔습니다. */}
        <CoupangProducts
          keywords={["등산 아이젠", "등산 장갑", "핫팩", "보온병"]}
          notes={[
            "영상에 눈꽃이 보이면 등산로는 이미 얼어 있습니다. 입구에서 못 사는 날이 많습니다.",
            "정상 부근은 영상보다 춥습니다. 바람을 막는 장갑이 필요한 이유입니다.",
            "산 위 기온은 아래와 다릅니다. 손·발용을 여유 있게 챙기는 용도입니다.",
            "겨울 산행에서 따뜻한 물을 가지고 다니는 용도입니다.",
          ]}
          title="🥾 겨울 산에 올라가기 전에"
          placement="cctv_parks"
        />

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">보기 전에 알아둘 것</h2>
          <ul className="text-sm text-[#c0c8d8] leading-relaxed space-y-2 break-keep">
            <li>
              · 영상은 <strong className="text-[#e8e8f0]">국립공원공단</strong>이 누리집에 공개하는
              실시간 CCTV입니다. 브라우저가 공단 서버에서 바로 받아 보여주며, 이 사이트를 거치거나
              저장되지 않습니다.
            </li>
            <li>
              · 공단 안내대로 현장 기상과 통신 상황에 따라 영상이 잠시 멈출 수 있습니다. 목록의
              &lsquo;잠시 멈춤&rsquo;이 그런 경우입니다.
            </li>
            <li>
              · 카메라 한 대는 한 지점만 비춥니다. 탐방로 전체 상황이나 입산 통제 여부는 국립공원공단
              안내를 따로 확인하세요.
            </li>
          </ul>
          <p className="text-xs text-[#8a90a0] mt-3">
            출처:{" "}
            <a
              href={PARK_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent"
            >
              국립공원공단 홍보미디어센터 실시간영상 ↗
            </a>
          </p>
        </section>

        {/* 2026년 통제 공지(공단 11/1 발표)로 갱신 — 2026-11-09. 수치는 아래 출처 두 기사에서
            그대로 옮겼습니다. 과태료 문단만 2025년 설악산 안내(경향)를 그대로 둡니다 — 2026
            발표 기사에는 금액이 없습니다. 다음 해 10월 말에 다시 공지를 확인하세요. */}
        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">
            2026년 가을 산불조심기간 탐방로 통제 — 11월 15일부터
          </h2>
          <p className="text-sm text-[#c0c8d8] leading-relaxed break-keep">
            국립공원공단은 2026년 11월 1일부터 12월 15일까지 45일간을 가을철 산불조심 기간으로
            정하고, 산불 위험이 높은 전국 탐방로{" "}
            <strong className="text-[#e8e8f0]">148개 구간(668km)을 11월 15일부터 12월 15일까지
            31일간</strong>{" "}
            통제합니다(11월 1일 발표). 지리산 노고단고개~장터목 등 115개 구간(474km)은 전면
            통제, 33개 구간(194km)은 상황에 따라 부분 통제이고, 나머지 515개 구간(1,373km)은
            평소대로 다닐 수 있습니다.
          </p>
          <p className="text-sm text-[#c0c8d8] leading-relaxed mt-2 break-keep">
            어느 공원의 어느 구간이 막히는지는 국립공원공단 누리집의 공원별 알림에 지도와 함께
            올라옵니다. 카메라로 날씨를 확인했더라도 가려는 탐방로가 열려 있는지는 거기서 따로
            확인하세요. 출발점과 정상만 보지 말고 중간 갈림길과 하산 구간까지 계획한 경로와
            맞춰 보는 편이 안전합니다.
          </p>
          <p className="text-xs text-[#8a90a0] leading-relaxed mt-2 break-keep">
            통제 구간에 무단으로 들어가면 20만~50만 원, 국립공원 안에서 담배를 피우거나 인화물질을
            가지고 있다 적발되면 60만~200만 원의 과태료가 부과됩니다(2025년 설악산국립공원사무소 안내).
          </p>
          <p className="text-xs text-[#8a90a0] mt-2">
            출처:{" "}
            <a
              href="https://www.metroseoul.co.kr/article/20261101500193"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent"
            >
              메트로신문 2026.11.1 ↗
            </a>
            {" · "}
            <a
              href="https://www.ajunews.com/view/20261101110736361"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent"
            >
              아주경제 2026.11.1 ↗
            </a>
            {" · "}
            <a
              href="https://www.khan.co.kr/article/202511061252001"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent"
            >
              경향신문 2025.11.6(과태료) ↗
            </a>
          </p>
        </section>

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">가는 길 고속도로 상황</h2>
          <div className="flex flex-wrap gap-1.5">
            {HIGHWAYS.map((h) => (
              <Link
                key={h.slug}
                href={`/tools/cctv/${h.slug}`}
                className="text-xs rounded-full px-3 py-1.5 border border-[#2a3a5a] bg-[#16213e] text-[#c0c8d8] hover:border-accent"
              >
                {h.name.replace(/고속도로$/, "")}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#8a90a0] mt-3">
            국도까지 지역별로 보려면{" "}
            <Link href="/tools/cctv" className="underline hover:text-accent">
              전국 도로 CCTV
            </Link>
            로 가세요.
          </p>
        </section>
      </main>

      <footer className="text-center text-xs text-[#606070] pb-8 space-y-2">
        <p>
          <Link href="/" className="hover:text-accent">8282114 생활안내</Link>
          {" · "}
          <Link href="/help" className="hover:text-accent">급할 때 대처법</Link>
          {" · "}
          <Link href="/calculators" className="hover:text-accent">생활 계산기</Link>
        </p>
        <p>
          <Link href="/about" className="hover:text-accent">소개</Link>
          {" · "}
          <Link href="/contact" className="hover:text-accent">문의</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-accent">개인정보처리방침</Link>
        </p>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent">
            {CONTACT_EMAIL}
          </a>
        </p>
      </footer>
    </div>
  );
}
