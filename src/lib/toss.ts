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

// 연동 진단 — 빈 응답이 나오는 원인이 (1) 키 미설정 (2) 승인 전/인증 실패
// (3) 상품 조회 차단(출발지 IP 미등록 등) 중 무엇인지 구분하기 위한 정보.
// 실패를 조용히 삼키면 원인을 특정할 수 없어 수익 0원의 이유를 알 수 없습니다.
export interface TossDiag {
  keys: boolean; // env 3종(ACCESS/SECRET/PUBLISHER) 설정 여부
  token: string; // ok | no-keys | http-401 | network-error ...
  fetch?: string; // ok | http-403 | network-error ...
  items?: number; // 조회된 상품 수 (품절 제외 전)
  links?: number; // 쉐어링크 발급 성공 수 (0이면 수수료가 붙지 않음)
  detail?: string; // 토스가 내려준 오류 본문 앞부분 (원인 파악용, 200자)
}

// 응답 본문 앞부분만 — 키·토큰은 요청에만 쓰이므로 본문에 섞일 일이 없습니다
async function peek(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 200);
  } catch {
    return "";
  }
}

// 토큰은 약 1년 유효 — 문서 권고대로 재사용 (매번 발급 시 호출 제한 위험).
// 서버리스 특성상 인스턴스별 모듈 캐시로 관리, 라우트 응답 자체는 CDN 캐시라
// 실제 토큰 발급 빈도는 낮습니다.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(
  diag: TossDiag
): Promise<string | null> {
  const accessKey = process.env.TOSS_SHARELINK_ACCESS_KEY;
  const secretKey = process.env.TOSS_SHARELINK_SECRET_KEY;
  if (!accessKey || !secretKey) {
    diag.token = "no-keys";
    console.error("[toss] TOSS_SHARELINK_ACCESS_KEY/SECRET_KEY 미설정");
    return null;
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    diag.token = "ok-cached";
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
    if (!res.ok) {
      diag.token = `http-${res.status}`;
      diag.detail = await peek(res);
      console.error(`[toss] 토큰 발급 실패 ${res.status}: ${diag.detail}`);
      return null;
    }
    const json = await res.json();
    if (!json?.access_token) {
      diag.token = "no-access-token";
      console.error("[toss] 토큰 응답에 access_token 없음");
      return null;
    }
    diag.token = "ok";
    cachedToken = {
      token: String(json.access_token),
      expiresAt: Date.now() + (Number(json.expires_in) || 3600) * 1000,
    };
    return cachedToken.token;
  } catch (e) {
    diag.token = "network-error";
    diag.detail = String(e).slice(0, 200);
    console.error("[toss] 토큰 발급 중 예외:", e);
    return null;
  }
}

// 쉐어링크 발급 — 수익 추적 링크(shortUrl). 실패 시 null (호출부에서 일반 URL 폴백)
async function issueLink(
  token: string,
  tacaItemId: number
): Promise<string | null> {
  const publisherId = process.env.TOSS_SHARELINK_PUBLISHER_ID;
  if (!publisherId) {
    console.error("[toss] TOSS_SHARELINK_PUBLISHER_ID 미설정 — 수수료 추적 불가");
    return null;
  }
  try {
    const res = await fetch(`${API_HOST}/openapi/links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tacaItemId, publisherId }),
    });
    if (!res.ok) {
      console.error(
        `[toss] 쉐어링크 발급 실패 ${res.status} (item ${tacaItemId}): ${await peek(res)}`
      );
      return null;
    }
    const json = await res.json();
    return json?.success?.shortUrl ? String(json.success.shortUrl) : null;
  } catch (e) {
    console.error(`[toss] 쉐어링크 발급 중 예외 (item ${tacaItemId}):`, e);
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

export interface TossResult {
  products: TossProduct[];
  diag: TossDiag;
}

async function fetchProducts(
  path: string,
  limit: number
): Promise<TossResult> {
  const diag: TossDiag = {
    keys: Boolean(
      process.env.TOSS_SHARELINK_ACCESS_KEY &&
        process.env.TOSS_SHARELINK_SECRET_KEY &&
        process.env.TOSS_SHARELINK_PUBLISHER_ID
    ),
    token: "pending",
  };

  const token = await getToken(diag);
  if (!token) return { products: [], diag };

  try {
    const res = await fetch(`${API_HOST}${path}?size=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 }, // 24시간 캐시 (레이트리밋 보호)
    });
    if (!res.ok) {
      diag.fetch = `http-${res.status}`;
      diag.detail = await peek(res);
      // 403은 출발지 IP 미등록이 대표적 원인 (Vercel 서버리스는 고정 IP 없음)
      console.error(`[toss] ${path} 조회 실패 ${res.status}: ${diag.detail}`);
      return { products: [], diag };
    }
    const json = await res.json();
    const items: RawItem[] = json?.success?.items ?? [];
    if (!Array.isArray(items)) {
      diag.fetch = "bad-shape";
      console.error(`[toss] ${path} 응답 형식 예상과 다름`);
      return { products: [], diag };
    }
    diag.fetch = "ok";
    diag.items = items.length;

    const inStock = items
      .filter((p) => p?.displayName && !p?.isSoldOut && p?.tacaItemId)
      .slice(0, limit);

    // 상품별 쉐어링크 발급 (실패 시 일반 상품 URL로 폴백 — 수수료만 없을 뿐 동작)
    let issued = 0;
    const products = (
      await Promise.all(
        inStock.map(async (p) => {
          const shortUrl = await issueLink(token, p.tacaItemId!);
          if (shortUrl) issued += 1;
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
      )
    ).filter((p) => p.url);

    diag.links = issued;
    if (products.length > 0 && issued === 0) {
      console.error(
        `[toss] ${path}: 상품 ${products.length}개 중 쉐어링크 발급 0건 — 노출돼도 수수료가 붙지 않습니다`
      );
    }

    return { products, diag };
  } catch (e) {
    diag.fetch = "network-error";
    diag.detail = String(e).slice(0, 200);
    console.error(`[toss] ${path} 조회 중 예외:`, e);
    return { products: [], diag };
  }
}

// 베스트 상품 (인기순)
export function getBestSelling(limit = 8): Promise<TossResult> {
  return fetchProducts("/openapi/products/best-selling", limit);
}

// 하루특가
export function getTodayDeals(limit = 8): Promise<TossResult> {
  return fetchProducts("/openapi/products/today-deals", limit);
}
