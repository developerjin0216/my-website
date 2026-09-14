"use client";

import { useEffect, useState } from "react";
import { trackAffiliateClick } from "@/utils/analytics";

// 토스쇼핑 쉐어링크 상품 카드 — 베스트/하루특가 탭.
// API 키 미설정·호출 실패 시 아무것도 렌더링하지 않습니다 (안전 배포).

interface Product {
  name: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  image: string;
  url: string;
  reviewScore: number;
  reviewCount: number;
}

const TABS = [
  { type: "best", label: "🏆 베스트" },
  { type: "deals", label: "⚡ 하루특가" },
];

export default function TossProducts({
  title = "💙 토스쇼핑 인기 상품",
}: {
  title?: string;
}) {
  const [selected, setSelected] = useState(0);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/toss/products?type=${TABS[selected].type}`);
        const json = await res.json();
        if (cancelled) return;
        if (!json.products || json.products.length === 0) {
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
  }, [selected]);

  if (!available) return null;

  return (
    <div className="bg-card rounded-2xl p-5">
      <h2 className="text-base font-bold text-accent mb-3">{title}</h2>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {TABS.map((tab, i) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => setSelected(i)}
            className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors ${
              selected === i
                ? "bg-[#3182F6] text-white border-[#3182F6]"
                : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
            }`}
          >
            {tab.label}
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
              onClick={() =>
                trackAffiliateClick({
                  network: "toss",
                  placement: "toss_products",
                  label: `${TABS[selected].type} / ${p.name}`,
                })
              }
              className="block bg-[#16213e] rounded-xl overflow-hidden border border-[#2a3a5a] hover:border-[#3182F6] transition-colors"
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
                <div className="flex items-baseline gap-1.5 mt-1">
                  {p.discountRate > 0 && (
                    <span className="text-sm font-bold text-[#EF4444]">
                      {p.discountRate}%
                    </span>
                  )}
                  {p.price > 0 && (
                    <span className="text-sm font-bold text-accent">
                      {p.price.toLocaleString("ko-KR")}원
                    </span>
                  )}
                </div>
                {p.reviewCount > 0 && (
                  <p className="text-[10px] text-[#606070] mt-0.5">
                    ⭐ {p.reviewScore.toFixed(1)} ({p.reviewCount.toLocaleString("ko-KR")})
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
      <p className="text-[10px] leading-relaxed text-[#606070] text-center mt-3">
        이 게시물은 토스쇼핑 쉐어링크 활동의 일환으로, 이에 따른 일정액의
        수수료를 제공받습니다.
      </p>
    </div>
  );
}
