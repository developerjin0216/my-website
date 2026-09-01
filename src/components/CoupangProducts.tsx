"use client";

import { useEffect, useState } from "react";

// 쿠팡파트너스 API 상품 카드 — 키워드 탭 선택 시 자동으로 상품 4개 표시.
// API 키 미설정·호출 실패 시 아무것도 렌더링하지 않습니다 (안전 배포).

interface Product {
  name: string;
  price: number;
  image: string;
  url: string;
}

export default function CoupangProducts({
  keywords,
  title = "🛒 관련 상품 최저가 비교",
}: {
  keywords: string[];
  title?: string;
}) {
  const [selected, setSelected] = useState(0);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/coupang/products?keyword=${encodeURIComponent(keywords[selected])}`
        );
        const json = await res.json();
        if (cancelled) return;
        if (!json.products || json.products.length === 0) {
          // 키 미설정 또는 결과 없음 — 첫 탭에서 비어 있으면 섹션 자체를 숨김
          if (selected === 0) setAvailable(false);
          setProducts([]);
        } else {
          setAvailable(true);
          setProducts(json.products);
        }
      } catch {
        if (!cancelled && selected === 0) setAvailable(false);
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [selected, keywords]);

  if (!available) return null;

  return (
    <div className="bg-card rounded-2xl p-5">
      <h2 className="text-base font-bold text-accent mb-3">{title}</h2>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {keywords.map((k, i) => (
          <button
            key={k}
            type="button"
            onClick={() => setSelected(i)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors ${
              selected === i
                ? "bg-accent text-[#1a1a2e] border-accent"
                : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {products === null ? (
        <p className="text-xs text-[#606070] py-4 text-center">불러오는 중…</p>
      ) : products.length === 0 ? (
        <p className="text-xs text-[#606070] py-4 text-center">
          상품을 불러오지 못했습니다
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              referrerPolicy="unsafe-url"
              className="block bg-[#16213e] rounded-xl overflow-hidden border border-[#2a3a5a] hover:border-accent transition-colors"
            >
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full aspect-square object-cover bg-white"
                />
              )}
              <div className="p-2.5">
                <p className="text-xs leading-snug line-clamp-2">{p.name}</p>
                {p.price > 0 && (
                  <p className="text-sm font-bold text-accent mt-1">
                    {p.price.toLocaleString("ko-KR")}원
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
      <p className="text-[10px] leading-relaxed text-[#606070] text-center mt-3">
        이 광고는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </p>
    </div>
  );
}
