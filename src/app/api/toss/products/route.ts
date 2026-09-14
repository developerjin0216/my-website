import { NextResponse, type NextRequest } from "next/server";
import { getBestSelling, getTodayDeals } from "@/lib/toss";

// 토스쇼핑 쉐어링크 상품 프록시 — ?type=best|deals
// CDN에서 24시간 캐시 → 실제 API 호출(토큰·링크 발급 포함)은 하루 몇 번 수준
//
// ?debug=1 — 연동 진단용. 상품이 비어 있을 때 원인이 키 미설정인지, 승인 전
// 인증 실패인지, 출발지 IP 차단인지 구분해서 보여줍니다. 키·토큰 값은 포함되지
// 않습니다(상태 문자열과 토스가 내려준 오류 본문 앞부분만). 진단 응답은 캐시를
// 타면 안 되므로 no-store로 내려보냅니다.

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? "best";
  const debug = request.nextUrl.searchParams.get("debug") === "1";

  const { products, diag } =
    type === "deals" ? await getTodayDeals(8) : await getBestSelling(8);

  if (debug) {
    return NextResponse.json(
      { products, diag },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { products },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    }
  );
}
