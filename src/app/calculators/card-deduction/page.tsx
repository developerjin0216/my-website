"use client";

import { useState } from "react";
import {
  Card,
  Field,
  BigResult,
  ResultRow,
  Notice,
  inputCls,
} from "@/components/calculators/ui";
import {
  calcCardDeduction,
  DEDUCTION_RATES,
  THRESHOLD_RATE,
  manwon,
  won,
  type Spend,
} from "@/utils/cardDeduction";

// 신용카드 소득공제 — '최저사용금액을 넘었는지'와 '지금부터 뭘 쓸지'만 답합니다.
//
// 환급액은 내지 않습니다. 한도(특히 전통시장·대중교통·문화비 추가 한도)가 출처마다
// 다르게 적혀 있어 확정하지 못했고, 확인 안 된 숫자로 환급액을 내면 그걸 믿고 소비
// 계획을 세우게 됩니다. 금액 확정은 홈택스 연말정산 미리보기 쪽으로 넘깁니다.

const FIELDS: { kind: keyof Spend; label: string; hint: string }[] = [
  { kind: "credit", label: "신용카드", hint: "공제율 15%" },
  { kind: "check", label: "체크·현금영수증", hint: "공제율 30%" },
  { kind: "market", label: "전통시장", hint: "공제율 40%" },
  { kind: "transit", label: "대중교통", hint: "공제율 40%" },
];

export default function CardDeductionPage() {
  const [pay, setPay] = useState("");
  const [spend, setSpend] = useState<Spend>({
    credit: "" as unknown as number,
    check: "" as unknown as number,
    market: "" as unknown as number,
    transit: "" as unknown as number,
  });

  const grossPay = Number(pay) || 0;
  const s: Spend = {
    credit: Number(spend.credit) || 0,
    check: Number(spend.check) || 0,
    market: Number(spend.market) || 0,
    transit: Number(spend.transit) || 0,
  };
  const r = calcCardDeduction(grossPay, s);
  const ready = grossPay > 0;

  return (
    <>
      <Card>
        <Field label="총급여 (연봉에서 비과세 수당을 뺀 금액)">
          <input
            type="number"
            inputMode="numeric"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            placeholder="예: 50000000"
            className={inputCls}
          />
        </Field>
        <p className="text-[11px] text-[#8a90a0] -mt-1 mb-3 leading-relaxed">
          연봉이 아니라 <strong className="text-[#a0a0b0]">총급여</strong>입니다.
          식대 같은 비과세 수당은 뺍니다. 원천징수영수증 16번 항목이 총급여입니다.
        </p>

        <p className="text-sm font-bold text-[#e8e8f0] mb-2">
          올해 지금까지 쓴 금액
        </p>
        <p className="text-[11px] text-[#8a90a0] mb-3 leading-relaxed">
          홈택스 &gt; 연말정산 미리보기에서 1~9월 사용액을 조회할 수 있습니다.
          모르면 대략만 넣어도 문턱까지 얼마 남았는지는 보입니다.
        </p>
        {FIELDS.map((f) => (
          <Field key={f.kind} label={`${f.label} (${f.hint})`}>
            <input
              type="number"
              inputMode="numeric"
              value={(spend[f.kind] as unknown as string) ?? ""}
              onChange={(e) =>
                setSpend({
                  ...spend,
                  [f.kind]: e.target.value as unknown as number,
                })
              }
              placeholder="0"
              className={inputCls}
            />
          </Field>
        ))}
      </Card>

      {ready && (
        <>
          <BigResult
            label={`최저사용금액 (총급여의 ${THRESHOLD_RATE * 100}%)`}
            value={manwon(r.threshold)}
          />

          <Card>
            {r.passed ? (
              <>
                <p className="text-sm font-bold text-[#22C55E] mb-2">
                  문턱을 넘었습니다
                </p>
                <p className="text-sm text-[#a0a0b0] leading-relaxed">
                  지금부터 쓰는 금액은 공제 대상에 들어갑니다. 공제율이 가장 높은{" "}
                  <strong className="text-accent">{r.bestNext.label}</strong>를
                  쓰면 1만원당 <strong className="text-accent">
                    {won(r.bestNext.perManwon)}
                  </strong>
                  이 공제 대상 금액으로 쌓입니다.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-[#d8c98a] mb-2">
                  아직 {manwon(r.remaining)} 남았습니다
                </p>
                <p className="text-sm text-[#a0a0b0] leading-relaxed">
                  이 금액을 채우기 전까지는 어떤 수단으로 써도 공제가 0입니다.
                  그래서 이 구간은 <strong className="text-accent">신용카드</strong>로
                  채우는 쪽이 낫습니다 — 어차피 공제가 안 되니 포인트·할인이 좋은
                  쪽을 쓰는 겁니다.
                </p>
              </>
            )}
            <div className="mt-3">
              <div className="h-2 rounded-full bg-[#0f1626] overflow-hidden">
                <div
                  className={`h-full ${r.passed ? "bg-[#22C55E]" : "bg-accent"}`}
                  style={{
                    width: `${Math.min(100, (r.total / r.threshold) * 100).toFixed(1)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[#606070] mt-1.5">
                쓴 금액 {manwon(r.total)} / 문턱 {manwon(r.threshold)}
              </p>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-bold text-[#e8e8f0] mb-3">
              결제수단별 공제 대상 금액
            </p>
            <p className="text-[11px] text-[#8a90a0] mb-3 leading-relaxed">
              최저사용금액은 실제 결제 순서와 무관하게{" "}
              <strong className="text-[#a0a0b0]">공제율이 낮은 수단부터</strong>{" "}
              차감됩니다. 신용카드로 문턱을 채우고 그 뒤를 체크카드로 쓰는 전략이
              유리한 이유가 이것입니다.
            </p>
            {r.breakdown.map((b) => (
              <ResultRow
                key={b.kind}
                label={`${b.label} ${(b.rate * 100).toFixed(0)}%`}
                value={
                  b.spent === 0
                    ? "—"
                    : b.counted === 0
                      ? "문턱에 흡수"
                      : `${manwon(b.counted)} → ${won(b.deduction)}`
                }
              />
            ))}
            <div className="border-t border-[#2a3a5a] mt-2 pt-2">
              <ResultRow
                label="공제 대상 금액 합계"
                value={won(r.deductionBeforeLimit)}
              />
            </div>
          </Card>

          <Notice>
            <strong>이 금액이 그대로 환급되는 것은 아닙니다.</strong> 공제 대상
            금액에는 총급여 구간별 한도가 걸리고, 전통시장·대중교통·문화비에는 별도
            추가 한도가 붙습니다. 그 뒤 소득세율을 곱한 만큼이 세금에서 줄어듭니다.
            <br />
            <br />
            기본공제 한도는 아래 &lsquo;2026년 사용분부터 달라지는 것&rsquo;과 같지만,
            추가 한도와 세율까지 반영해야 환급액이 나오므로 여기서는 계산하지
            않았습니다. 확정 금액은{" "}
            <strong>홈택스 &gt; 연말정산 미리보기</strong>에서 확인하세요. 이
            계산기는 그 전에 &lsquo;지금부터 뭘 쓸지&rsquo;를 정하는 용도입니다.
          </Notice>
        </>
      )}

      {!ready && (
        <Notice>
          총급여를 넣으면 최저사용금액(총급여의 {THRESHOLD_RATE * 100}%)과 지금부터
          어떤 결제수단을 쓰는 게 유리한지 계산합니다. 사용액은 몰라도 괜찮습니다 —
          문턱 금액만으로도 올해 얼마를 써야 공제가 시작되는지 알 수 있습니다.
        </Notice>
      )}

      <Card>
        <p className="text-sm font-bold text-[#e8e8f0] mb-2">공제율 한눈에</p>
        <div className="space-y-1">
          {DEDUCTION_RATES.map((d) => (
            <div
              key={d.kind}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm bg-[#16213e]"
            >
              <span className="text-[#a0a0b0]">{d.label}</span>
              <span className="font-bold text-[#e8e8f0]">
                {(d.rate * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#8a90a0] mt-2.5 leading-relaxed">
          도서·공연·영화 등 문화비는 총급여 7천만원 이하만 적용되는 별도 항목이라
          여기에 넣지 않았습니다.
        </p>
      </Card>

      {/* 2025년 개정세법 — 국회예산정책처 「2025년 개정세법 심의 결과 및 주요 내용」(2025.12)
          표 11·표 40에서 그대로 옮겼습니다. 추가 한도(전통시장·대중교통·문화)는 이 개정에
          없어 여기서도 다루지 않습니다. */}
      <Card>
        <p className="text-sm font-bold text-[#e8e8f0] mb-2">
          2026년 사용분부터 달라지는 것
        </p>
        <p className="text-xs text-[#a0a0b0] leading-relaxed mb-3 break-keep">
          신용카드 소득공제는 2025년 말까지만 적용될 예정이었는데, 2025년 세법
          개정으로 <strong className="text-[#e8e8f0]">2028년 12월 31일까지 3년
          연장</strong>됐습니다. 함께 <strong className="text-[#e8e8f0]">자녀 수에 따라
          기본공제 한도가 올라갑니다</strong>(2026년 1월 1일 시행 — 2026년에 쓴 금액을
          정산하는 2027년 초 연말정산부터).
        </p>
        <div className="overflow-hidden rounded-lg border border-[#2a3a5a] text-xs">
          <div className="grid grid-cols-4 bg-[#16213e] text-[#a0a0b0]">
            <span className="px-2 py-1.5">총급여</span>
            <span className="px-2 py-1.5 text-right">자녀 없음</span>
            <span className="px-2 py-1.5 text-right">자녀 1명</span>
            <span className="px-2 py-1.5 text-right">2명 이상</span>
          </div>
          {[
            ["7천만원 이하", "300만원", "350만원", "400만원"],
            ["7천만원 초과", "250만원", "275만원", "300만원"],
          ].map((row) => (
            <div key={row[0]} className="grid grid-cols-4 border-t border-[#2a3a5a] text-[#e8e8f0]">
              {row.map((cell, i) => (
                <span key={i} className={`px-2 py-1.5 ${i ? "text-right" : "text-[#a0a0b0]"}`}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#8a90a0] mt-2.5 leading-relaxed break-keep">
          공제율(신용카드 15%, 체크카드·현금영수증 30%, 전통시장·대중교통 40%)과
          총급여 25% 문턱은 그대로입니다. 출처: 국회예산정책처 「2025년 개정세법 심의
          결과 및 주요 내용」(2025.12).
        </p>
      </Card>
    </>
  );
}
