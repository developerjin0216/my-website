import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/coupang";

// 쿠팡 상품 검색 프록시 — 클라이언트 컴포넌트가 호출.
// API 키는 서버에만 있고, 응답은 CDN에서 24시간 캐시됩니다.

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword")?.slice(0, 50);
  if (!keyword) {
    return Response.json({ products: [] }, { status: 400 });
  }

  // must=알카라인,9V — 상품명에 반드시 있어야 하는 단어 (쉼표 구분)
  const must = (request.nextUrl.searchParams.get("must") ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
    .slice(0, 3);
  const products = await searchProducts(keyword, 4, must);
  return Response.json(
    { products },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    }
  );
}
