import crypto from "crypto";

// 쿠팡파트너스 오픈 API 클라이언트 (서버 전용)
// 인증: HMAC-SHA256 서명 (파트너스 → Open API에서 발급한 키를 Vercel env에 설정)
//   COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY
// 키가 없으면 모든 함수가 빈 결과를 반환 — 프론트는 자동으로 숨김 처리됩니다.

const HOST = "https://api-gateway.coupang.com";

export interface CoupangProduct {
  name: string;
  price: number;
  image: string;
  url: string; // 트래킹 포함 파트너스 URL
}

function signedHeaders(method: string, path: string, query: string) {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return null;

  // signed-date 형식: yyMMdd'T'HHmmss'Z' (UTC)
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const datetime =
    String(d.getUTCFullYear()).slice(2) +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z";

  const message = datetime + method + path + query;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  return {
    Authorization: `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`,
    "Content-Type": "application/json;charset=UTF-8",
  };
}

// 상품 검색 — 키워드당 하루 1회만 실제 호출 (Next 데이터 캐시로 레이트리밋 보호)
export async function searchProducts(
  keyword: string,
  limit = 4
): Promise<CoupangProduct[]> {
  const path =
    "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
  const query = `keyword=${encodeURIComponent(keyword)}&limit=${limit}`;
  const headers = signedHeaders("GET", path, query);
  if (!headers) return [];

  try {
    const res = await fetch(`${HOST}${path}?${query}`, {
      headers,
      next: { revalidate: 86400 }, // 24시간 캐시
    });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data?.productData ?? json?.data ?? [];
    if (!Array.isArray(list)) return [];
    return list
      .filter((p) => p?.productName && p?.productUrl)
      .slice(0, limit)
      .map((p) => ({
        name: String(p.productName),
        price: Number(p.productPrice) || 0,
        image: String(p.productImage ?? ""),
        url: String(p.productUrl),
      }));
  } catch {
    return [];
  }
}
