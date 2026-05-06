"use client";

import { useState, useEffect } from "react";
import { getQuoteForToday } from "@/data/quotes";

export default function DailyQuote() {
  const [quote, setQuote] = useState<{
    quote: string;
    author: string;
  } | null>(null);

  useEffect(() => {
    setQuote(getQuoteForToday());
  }, []);

  if (!quote) return null;

  return (
    <div className="mx-5 my-4 bg-gradient-to-br from-[#1e2a45] to-[#162040] rounded-2xl p-5 border border-[#2a3a5a]/50">
      <p className="text-xs text-accent font-bold mb-2 tracking-wider uppercase">
        오늘의 명언
      </p>
      <p className="text-[15px] leading-relaxed text-[#e0e0e8] mb-3 break-keep">
        &ldquo;{quote.quote}&rdquo;
      </p>
      <p className="text-xs text-[#8090b0] text-right">
        — {quote.author}
      </p>
    </div>
  );
}
