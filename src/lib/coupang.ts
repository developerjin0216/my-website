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

// 비교용: 소문자, 한글·영숫자만 ("오메가-3" → "오메가3")
const squash = (s: string) => s.toLowerCase().replace(/[^0-9a-z가-힣]/g, "");

/**
 * 검색 결과가 키워드와 상관있는지 거릅니다.
 *
 * 검색 API는 맞는 상품이 없으면 빈 배열 대신 엉뚱한 인기 상품(후드티·화장지·콜라)을 돌려줍니다.
 * '체온계'처럼 의료기기는 늘 그렇습니다. 그대로 보여주면 상황 안내 페이지에 콜라가 뜹니다.
 *
 * 상품마다 키워드 단어를 요구하면 '종합비타민' 검색의 '멀티비타민'처럼 제대로 찾은 상품까지
 * 버려집니다. 그래서 판단은 묶음 단위로 합니다 — 결과 중 키워드 단어를 가진 상품이 하나도
 * 없으면 통째로 엉터리로 보고 비우고, 하나라도 있으면 검색이 제대로 된 것으로 봅니다.
 * must 단어(규격 등)는 상품마다 전부 있어야 통과합니다.
 */
export function relevant<T extends { name: string }>(
  items: T[],
  keyword: string,
  must: string[] = []
): T[] {
  const words = keyword.split(/\s+/).map(squash).filter((w) => w.length >= 2);
  const names = items.map((p) => squash(p.name));
  const searchWorked =
    words.length === 0 || names.some((n) => words.some((w) => n.includes(w)));
  if (!searchWorked) return [];
  const req = must.map(squash).filter(Boolean);
  return items.filter((_, i) => req.every((m) => names[i].includes(m)));
}

// 상품 검색 — 키워드당 하루 1회만 실제 호출 (Next 데이터 캐시로 레이트리밋 보호).
// 걸러낼 몫을 생각해 최대치(10)를 받아 두고 relevant() 를 거친 뒤 limit 개만 돌려줍니다.
export async function searchProducts(
  keyword: string,
  limit = 4,
  must: string[] = []
): Promise<CoupangProduct[]> {
  const path =
    "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
  const query = `keyword=${encodeURIComponent(keyword)}&limit=10`;
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
    const products = list
      .filter((p) => p?.productName && p?.productUrl)
      .map((p) => ({
        name: String(p.productName),
        price: Number(p.productPrice) || 0,
        image: String(p.productImage ?? ""),
        url: String(p.productUrl),
      }));
    return relevant(products, keyword, must).slice(0, limit);
  } catch {
    return [];
  }
}
