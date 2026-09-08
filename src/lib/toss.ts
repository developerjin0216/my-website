// 토스쇼핑 쉐어링크 Open API 클라이언트 (서버 전용)
// 문서: https://sharelink-docs.toss.im/guide/open-api.md
// 인증: OAuth2 client_credentials → Bearer 토큰 (유효기간 약 1년 — 재사용 필수)
//   TOSS_SHARELINK_ACCESS_KEY / TOSS_SHARELINK_SECRET_KEY / TOSS_SHARELINK_PUBLISHER_ID
// 키가 없으면 모든 함수가 빈 결과를 반환 — 프론트는 자동으로 숨김 처리됩니다.
//
// ⚠️ 승인·연동 조건 (Creator Admin — sharelink.toss.im):
//   - API 연동 메뉴에서 사용 승인 신청 (검수 영업일 5일)
//   - 출발지 IP 등록 필수 (최대 10개, CIDR /16~/32) — Vercel 서버리스는 고정
//     IP가 아니므로, 차단될 경우 고정 IP 서버(배틀 서버)를 프록시로 경유시킬 것

const API_HOST = "https://sharelink.toss.im";
const TOKEN_URL = "https://oauth2.cert.toss.im/token";

export interface TossProduct {
  name: string;
  price: number; // 판매가 (displayPrice)
  originalPrice: number; // 정가 (0이면 할인 없음)
  discountRate: number; // %
  image: string;
  url: string; // 쉐어링크 shortUrl (발급 실패 시 일반 상품 URL)
  reviewScore: number;
  reviewCount: number;
}

// 토큰은 약 1년 유효 — 문서 권고대로 재사용 (매번 발급 시 호출 제한 위험).
// 서버리스 특성상 인스턴스별 모듈 캐시로 관리, 라우트 응답 자체는 CDN 캐시라
// 실제 토큰 발급 빈도는 낮습니다.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string | null> {
  const accessKey = process.env.TOSS_SHARELINK_ACCESS_KEY;
  const secretKey = process.env.TOSS_SHARELINK_SECRET_KEY;
  if (!accessKey || !secretKey) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: accessKey,
        client_secret: secretKey,
        scope: "sharelink:read sharelink:write",
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.access_token) return null;
    cachedToken = {
      token: String(json.access_token),
      expiresAt: Date.now() + (Number(json.expires_in) || 3600) * 1000,
    };
    return cachedToken.token;
  } catch {
    return null;
  }
}

// 쉐어링크 발급 — 수익 추적 링크(shortUrl). 실패 시 null (호출부에서 일반 URL 폴백)
async function issueLink(
  token: string,
  tacaItemId: number
): Promise<string | null> {
  const publisherId = process.env.TOSS_SHARELINK_PUBLISHER_ID;
  if (!publisherId) return null;
  try {
    const res = await fetch(`${API_HOST}/openapi/links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tacaItemId, publisherId }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success?.shortUrl ? String(json.success.shortUrl) : null;
  } catch {
    return null;
  }
}

interface RawItem {
  tacaItemId?: number;
  displayName?: string;
  thumbnailUrl?: string;
  productUrl?: string;
  displayPrice?: number;
  originalPrice?: number;
  discountRate?: number;
  isSoldOut?: boolean;
  reviewScore?: number;
  reviewCount?: number;
}

async function fetchProducts(
  path: string,
  limit: number
): Promise<TossProduct[]> {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_HOST}${path}?size=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 }, // 24시간 캐시 (레이트리밋 보호)
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items: RawItem[] = json?.success?.items ?? [];
    if (!Array.isArray(items)) return [];

    const inStock = items
      .filter((p) => p?.displayName && !p?.isSoldOut && p?.tacaItemId)
      .slice(0, limit);

    // 상품별 쉐어링크 발급 (실패 시 일반 상품 URL로 폴백 — 수수료만 없을 뿐 동작)
    return Promise.all(
      inStock.map(async (p) => {
        const shortUrl = await issueLink(token, p.tacaItemId!);
        return {
          name: String(p.displayName),
          price: Number(p.displayPrice) || 0,
          originalPrice: Number(p.originalPrice) || 0,
          discountRate: Number(p.discountRate) || 0,
          image: String(p.thumbnailUrl ?? ""),
          url: shortUrl ?? String(p.productUrl ?? ""),
          reviewScore: Number(p.reviewScore) || 0,
          reviewCount: Number(p.reviewCount) || 0,
        };
      })
    ).then((list) => list.filter((p) => p.url));
  } catch {
    return [];
  }
}

// 베스트 상품 (인기순)
export function getBestSelling(limit = 8): Promise<TossProduct[]> {
  return fetchProducts("/openapi/products/best-selling", limit);
}

// 하루특가
export function getTodayDeals(limit = 8): Promise<TossProduct[]> {
  return fetchProducts("/openapi/products/today-deals", limit);
}
