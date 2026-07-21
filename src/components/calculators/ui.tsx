"use client";

// 계산기 공용 UI 프리미티브 — 모든 계산기 페이지에서 재사용

export const inputCls =
  "w-full bg-[#16213e] border border-[#2a3a5a] rounded-xl px-4 py-3 text-base outline-none focus:border-accent transition-colors [color-scheme:dark]";

export function fmt(n: number): string {
  if (!isFinite(n)) return "0";
  return Math.round(n).toLocaleString("ko-KR");
}

export function won(n: number): string {
  return `${fmt(n)}원`;
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`bg-card rounded-2xl p-5 ${className}`}>{children}</div>;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#606070] mt-1.5">{hint}</p>}
    </div>
  );
}

// 천 단위 콤마 숫자 입력 (comma=false면 소수점 입력 허용)
export function NumInput({
  value,
  onChange,
  placeholder,
  suffix,
  comma = true,
}: {
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  suffix?: string;
  comma?: boolean;
}) {
  const display =
    comma && value !== "" ? Number(value).toLocaleString("ko-KR") : value;

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, "");
    if (comma) {
      raw = raw.replace(/[^\d]/g, "");
    } else {
      raw = raw.replace(/[^\d.]/g, "");
      const parts = raw.split(".");
      if (parts.length > 2) raw = parts[0] + "." + parts.slice(1).join("");
    }
    onChange(raw);
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode={comma ? "numeric" : "decimal"}
        className={`${inputCls} ${suffix ? "pr-14" : ""}`}
        value={display}
        onChange={handle}
        placeholder={placeholder}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#a0a0b0]">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors border ${
            value === opt.value
              ? "bg-accent text-[#1a1a2e] border-accent"
              : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a] hover:brightness-110"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function BigResult({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-[#a0a0b0]">{label}</p>
      <p className="text-3xl font-bold text-accent mt-1">{value}</p>
      {sub && <p className="text-xs text-[#a0a0b0] mt-1.5">{sub}</p>}
    </div>
  );
}

export function ResultRow({
  label,
  value,
  strong = false,
  negative = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-2 text-sm ${
        strong ? "font-bold border-t border-[#2a3a5a] mt-1 pt-3" : ""
      }`}
    >
      <span className={strong ? "" : "text-[#a0a0b0]"}>{label}</span>
      <span className={negative ? "text-[#ff6b6b]" : strong ? "text-accent" : ""}>
        {value}
      </span>
    </div>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-[#606070] leading-relaxed bg-[#16213e] rounded-xl px-4 py-3 mt-4">
      ⓘ {children}
    </p>
  );
}
