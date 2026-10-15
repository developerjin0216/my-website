import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HighwayViewer from "@/components/tools/HighwayViewer";
import {
  HIGHWAYS,
  SNAPSHOT_DATE,
  camsOf,
  getHighway,
} from "@/data/cctvHighways";
import { robotsFor } from "@/lib/indexPolicy";
import { CONTACT_EMAIL, ROOT_SITE_NAME, ROOT_URL } from "@/lib/site";

// 고속도로 노선별 실시간 CCTV — /tools/cctv/<slug>
//
// 이 라우트는 (hub) 그룹 밖에 있어서 ToolShell(지역별 CCTV 도구의 제목·안내·FAQ)을
// 물려받지 않습니다. 물려받으면 h1 이 둘이 되고 같은 안내문이 노선 20개에 복제됩니다.
// 페이지마다 다른 본문은 그 노선의 지점 목록과 그 목록에서 센 숫자들입니다.

export const dynamicParams = false;

export function generateStaticParams() {
  return HIGHWAYS.map((h) => ({ road: h.slug }));
}

const pathOf = (slug: string) => `/tools/cctv/${slug}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ road: string }>;
}): Promise<Metadata> {
  const { road } = await params;
  const h = getHighway(road);
  if (!h) return {};
  const n = camsOf(h).length;
  const title = `${h.name} 실시간 CCTV ${n}곳 - 눈·비 올 때 도로 상황 확인`;
  const description = `${h.name}에 설치된 CCTV ${n}곳을 노선 순서대로 정리했습니다. 지점을 누르면 실시간 영상이 나옵니다. 폭설·폭우·명절 귀성길에 가는 길 상황을 미리 확인하세요.`;
  const url = `${ROOT_URL}${pathOf(h.slug)}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: robotsFor(pathOf(h.slug)),
    openGraph: {
      title,
      description,
      url,
      siteName: ROOT_SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
  };
}

/** 지점 이름에 든 단어로 센 숫자 — 이 노선 페이지만의 본문 */
function counts(names: string[]) {
  const has = (re: RegExp) => names.filter((n) => re.test(n));
  return {
    tunnel: has(/터널/),
    junction: has(/분기점|JC/i),
    restArea: has(/휴게소/),
    tollgate: has(/요금소|영업소|TG/i),
  };
}

export default async function HighwayPage({
  params,
}: {
  params: Promise<{ road: string }>;
}) {
  const { road } = await params;
  const h = getHighway(road);
  if (!h) notFound();

  const cams = camsOf(h);
  const names = cams.map((c) => c[0]);
  const c = counts(names);
  const others = HIGHWAYS.filter((x) => x.slug !== h.slug);
  const url = `${ROOT_URL}${pathOf(h.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ROOT_SITE_NAME, item: ROOT_URL },
      { "@type": "ListItem", position: 2, name: "전국 도로 CCTV", item: `${ROOT_URL}/tools/cctv` },
      { "@type": "ListItem", position: 3, name: `${h.name} CCTV`, item: url },
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
        <h1 className="text-2xl font-bold text-accent mt-2">
          {h.name} 실시간 CCTV
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-1 leading-relaxed break-keep">
          {h.name}에 설치된 CCTV {cams.length}곳입니다. 한쪽 끝 &lsquo;{names[0]}&rsquo;부터
          반대쪽 끝 &lsquo;{names[names.length - 1]}&rsquo;까지 노선 순서대로 놓았고,
          지점을 누르면 지금 영상이 나옵니다.
        </p>
      </header>

      <main className="px-5 py-5 flex-1 space-y-4">
        <HighwayViewer line={h.line} name={h.name} cams={cams} />

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">
            {h.name} CCTV 한눈에 보기
          </h2>
          <ul className="text-sm text-[#c0c8d8] leading-relaxed space-y-1.5 break-keep">
            <li>· 전체 {cams.length}곳 (지점 목록 기준일 {SNAPSHOT_DATE})</li>
            {c.tunnel.length > 0 && <li>· 이름에 &lsquo;터널&rsquo;이 들어간 지점 {c.tunnel.length}곳</li>}
            {c.junction.length > 0 && (
              <li>
                · 분기점 근처 {c.junction.length}곳 — 다른 고속도로와 갈라지는 곳입니다.
                목록에서 &lsquo;분기점&rsquo;으로 찾을 수 있습니다
              </li>
            )}
            {c.restArea.length > 0 && <li>· 휴게소 근처 {c.restArea.length}곳</li>}
            {c.tollgate.length > 0 && <li>· 요금소·영업소 근처 {c.tollgate.length}곳</li>}
          </ul>
          <p className="text-xs text-[#8a90a0] leading-relaxed mt-3 break-keep">
            같은 이름 뒤에 숫자가 붙은 지점(예: 터널1, 터널2)은 대개 한 구간에 여러 대가
            있는 경우입니다. 영상은 국토교통부 국가교통정보센터(ITS)가 공개하는 CCTV를
            브라우저가 직접 받아 보여주며, 이 사이트를 거치거나 저장되지 않습니다.
          </p>
        </section>

        <section className="bg-card rounded-2xl p-5">
          <h2 className="text-base font-bold text-accent mb-3">다른 고속도로</h2>
          <div className="flex flex-wrap gap-1.5">
            {others.map((x) => (
              <Link
                key={x.slug}
                href={pathOf(x.slug)}
                className="text-xs rounded-full px-3 py-1.5 border border-[#2a3a5a] bg-[#16213e] text-[#c0c8d8] hover:border-accent"
              >
                {x.name}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#8a90a0] mt-3">
            국도까지 지역별로 보려면{" "}
            <Link href="/tools/cctv" className="underline hover:text-accent">
              전국 도로 CCTV
            </Link>
            에서 지역을 고르세요.
          </p>
        </section>

        <p className="text-[11px] text-[#606070] leading-relaxed px-1 break-keep">
          지점에 따라 점검·장애로 재생되지 않을 수 있습니다. 영상 주소는 2시간이 지나면
          만료되니, 페이지를 오래 열어 두었다면 지점을 다시 눌러 주세요.
        </p>
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
