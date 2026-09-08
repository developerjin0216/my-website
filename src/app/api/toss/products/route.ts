import { NextResponse, type NextRequest } from "next/server";
import { getBestSelling, getTodayDeals } from "@/lib/toss";

// 토스쇼핑 쉐어링크 상품 프록시 — ?type=best|deals
// CDN에서 24시간 캐시 → 실제 API 호출(토큰·링크 발급 포함)은 하루 몇 번 수준

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? "best";
  const products =
    type === "deals" ? await getTodayDeals(8) : await getBestSelling(8);

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
