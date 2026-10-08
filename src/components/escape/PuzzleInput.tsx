"use client";

import { useState } from "react";
import type { Interaction } from "@/data/escape";

// 퍼즐 입력 — 방식마다 다른 조작을 제공하고, 공통으로 '정답 문자열'을 만들어 냅니다.
//
// 처음에는 12개 퍼즐이 전부 텍스트 입력 하나였습니다. 서사를 아무리 붙여도
// 하는 동작이 매번 같으면 방탈출이 아니라 설문지입니다. 방탈출의 재미는
// '무엇을 하는지가 매번 다른 것'에서 나옵니다.
//
// 정답 대조는 그대로 해시로 합니다(utils/escapeAnswer). 각 방식은 조작 결과를
// 정해진 규칙으로 문자열로 만들기만 하면 됩니다:
//   text  : 입력한 그대로
//   dial  : 자리값을 이어 붙임            "98317"
//   order : 고른 순서대로 id를 - 로 연결   "dev-stop-fix-wash"
//   pick  : 고른 항목의 id                 "r14"
//   multi : 고른 id들을 정렬해 - 로 연결   "a-c-e"

export function toAnswer(
  interaction: Interaction,
  state: PuzzleState
): string {
  switch (interaction.kind) {
    case "text":
      return state.text;
    case "dial":
      return state.dial.join("");
    case "order":
      return state.order.join("-");
    case "pick":
      return state.pick ?? "";
    case "multi":
      return [...state.multi].sort().join("-");
    case "overlay":
      return state.text; // 맞춰서 읽어낸 글자가 답입니다
  }
}

export interface PuzzleState {
  text: string;
  /** overlay — 위에 덮은 종이의 위치 [열, 행] */
  sheet: [number, number];
  dial: number[];
  order: string[];
  pick: string | null;
  multi: string[];
}

export function initialState(interaction: Interaction): PuzzleState {
  return {
    text: "",
    sheet: [0, 0],
    dial:
      interaction.kind === "dial"
        ? Array.from({ length: interaction.digits }, () => 0)
        : [],
    order: interaction.kind === "order" ? interaction.items.map((i) => i.id) : [],
    pick: null,
    multi: [],
  };
}

export function isReady(interaction: Interaction, s: PuzzleState): boolean {
  switch (interaction.kind) {
    case "text":
      return s.text.trim().length > 0;
    case "dial":
      return true; // 0도 유효한 자리값입니다
    case "order":
      return s.order.length > 0;
    case "pick":
      return s.pick !== null;
    case "multi":
      return s.multi.length >= interaction.min;
    case "overlay":
      return s.text.trim().length > 0;
  }
}

const cell =
  "rounded-xl border transition-colors text-left leading-snug select-none";

/* ── 다이얼 ── */
function Dial({
  digits,
  value,
  onChange,
}: {
  digits: number;
  value: number[];
  onChange: (v: number[]) => void;
}) {
  const set = (i: number, d: number) => {
    const next = [...value];
    next[i] = (d + 10) % 10;
    onChange(next);
  };
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: digits }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <button
            type="button"
            aria-label={`${i + 1}번째 자리 올리기`}
            onClick={() => set(i, (value[i] ?? 0) + 1)}
            className="w-10 h-7 rounded-lg bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] text-xs hover:border-accent"
          >
            ▲
          </button>
          <div className="w-10 h-12 rounded-lg bg-[#0f1626] border-2 border-[#2a3a5a] flex items-center justify-center font-mono text-2xl font-bold text-accent tabular-nums">
            {value[i] ?? 0}
          </div>
          <button
            type="button"
            aria-label={`${i + 1}번째 자리 내리기`}
            onClick={() => set(i, (value[i] ?? 0) - 1)}
            className="w-10 h-7 rounded-lg bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] text-xs hover:border-accent"
          >
            ▼
          </button>
        </div>
      ))}
    </div>
  );
}

/* ── 순서 배열 ── */
function Order({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; note?: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const byId = new Map(items.map((i) => [i.id, i]));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {value.map((id, i) => {
        const it = byId.get(id);
        if (!it) return null;
        return (
          <div
            key={id}
            className="flex items-center gap-2 rounded-xl bg-[#16213e] border border-[#2a3a5a] px-3 py-2.5"
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#0f1626] border border-[#2a3a5a] text-[11px] font-bold text-accent flex items-center justify-center">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#e8e8f0] truncate">{it.label}</p>
              {it.note && (
                <p className="text-[11px] text-[#606070] truncate">{it.note}</p>
              )}
            </div>
            <div className="shrink-0 flex gap-1">
              <button
                type="button"
                aria-label="위로"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                className="w-8 h-8 rounded-lg bg-[#0f1626] border border-[#2a3a5a] text-[#a0a0b0] text-xs disabled:opacity-30 hover:border-accent"
              >
                ▲
              </button>
              <button
                type="button"
                aria-label="아래로"
                onClick={() => move(i, i + 1)}
                disabled={i === value.length - 1}
                className="w-8 h-8 rounded-lg bg-[#0f1626] border border-[#2a3a5a] text-[#a0a0b0] text-xs disabled:opacity-30 hover:border-accent"
              >
                ▼
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── 하나 고르기 ── */
function Pick({
  items,
  layout,
  value,
  onChange,
}: {
  items: { id: string; label: string; note?: string }[];
  layout: "rows" | "strip" | "grid";
  value: string | null;
  onChange: (v: string) => void;
}) {
  const wrap =
    layout === "strip"
      ? "flex gap-1.5 overflow-x-auto pb-1"
      : layout === "grid"
        ? "grid grid-cols-3 gap-2"
        : "space-y-1.5";
  return (
    <div className={wrap}>
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            className={`${cell} ${
              layout === "strip"
                ? "shrink-0 w-16 px-2 py-3 text-center"
                : layout === "grid"
                  ? "px-2 py-3 text-center"
                  : "w-full px-3 py-2.5"
            } ${
              on
                ? "border-accent bg-[#3d2e00]/40"
                : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
            }`}
          >
            <span
              className={`block text-sm ${on ? "text-accent font-semibold" : "text-[#e8e8f0]"}`}
            >
              {it.label}
            </span>
            {it.note && (
              <span className="block text-[11px] text-[#606070] mt-0.5">
                {it.note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── 여러 개 고르기 ── */
function Multi({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string; note?: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => {
        const on = value.includes(it.id);
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => toggle(it.id)}
            className={`${cell} px-3 py-2.5 ${
              on
                ? "border-accent bg-[#3d2e00]/40"
                : "border-[#2a3a5a] bg-[#16213e] hover:border-[#4a5a7a]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                  on
                    ? "border-accent text-accent"
                    : "border-[#4a5a7a] text-transparent"
                }`}
              >
                ✓
              </span>
              <span
                className={`text-sm truncate ${on ? "text-accent font-semibold" : "text-[#e8e8f0]"}`}
              >
                {it.label}
              </span>
            </span>
            {it.note && (
              <span className="block text-[11px] text-[#606070] mt-0.5 pl-5.5">
                {it.note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


/* ── 겹쳐 읽기 ── */
function Overlay({
  grid,
  windows,
  sheet,
  pos,
  onMove,
}: {
  grid: string[][];
  windows: [number, number][];
  sheet: [number, number];
  pos: [number, number];
  onMove: (p: [number, number]) => void;
}) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const [sw, sh] = sheet;
  const maxX = Math.max(0, cols - sw);
  const maxY = Math.max(0, rows - sh);
  const [px, py] = pos;

  // 종이 구멍이 지금 덮고 있는 칸인지
  const visible = new Set(
    windows.map(([wx, wy]) => `${px + wx},${py + wy}`)
  );
  const covered = (c: number, r: number) =>
    c >= px && c < px + sw && r >= py && r < py + sh;

  const move = (dx: number, dy: number) =>
    onMove([
      Math.min(maxX, Math.max(0, px + dx)),
      Math.min(maxY, Math.max(0, py + dy)),
    ]);

  return (
    <div>
      <div className="overflow-x-auto">
        <div
          className="inline-grid gap-[2px] bg-[#0f1626] p-2 rounded-xl border border-[#2a3a5a]"
          style={{ gridTemplateColumns: `repeat(${cols}, 1.6rem)` }}
        >
          {grid.map((row, r) =>
            row.map((ch, c) => {
              const inSheet = covered(c, r);
              const show = visible.has(`${c},${r}`);
              return (
                <div
                  key={`${c}-${r}`}
                  className={`h-7 flex items-center justify-center text-[13px] rounded-[3px] ${
                    show
                      ? "bg-[#3d2e00] text-accent font-bold ring-1 ring-accent/60"
                      : inSheet
                        ? "bg-[#2a2622] text-transparent"
                        : "bg-[#16213e] text-[#55607a]"
                  }`}
                >
                  {inSheet && !show ? "" : ch}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="text-[11px] text-[#606070] mt-2 leading-relaxed">
        덮은 종이를 움직이면 구멍에 걸린 글자만 보입니다. 위치 {px + 1},{py + 1}
      </p>
      <div className="flex justify-center gap-1.5 mt-2">
        {([
          ["←", -1, 0],
          ["↑", 0, -1],
          ["↓", 0, 1],
          ["→", 1, 0],
        ] as [string, number, number][]).map(([t, dx, dy]) => (
          <button
            key={t}
            type="button"
            aria-label={`종이 ${t} 이동`}
            onClick={() => move(dx, dy)}
            className="w-11 h-9 rounded-lg bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] hover:border-accent"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PuzzleInput({
  interaction,
  state,
  onChange,
  onWrongReset,
}: {
  interaction: Interaction;
  state: PuzzleState;
  onChange: (s: PuzzleState) => void;
  onWrongReset: () => void;
}) {
  const [touched, setTouched] = useState(false);
  const up = (patch: Partial<PuzzleState>) => {
    if (!touched) setTouched(true);
    onWrongReset();
    onChange({ ...state, ...patch });
  };
  void touched;

  return (
    <div>
      <label className="block text-xs text-[#a0a0b0] mb-2">
        {interaction.label}
      </label>

      {interaction.kind === "text" && (
        <input
          value={state.text}
          onChange={(e) => up({ text: e.target.value })}
          placeholder={interaction.placeholder}
          autoComplete="off"
          className="w-full rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent"
        />
      )}

      {interaction.kind === "dial" && (
        <Dial
          digits={interaction.digits}
          value={state.dial}
          onChange={(dial) => up({ dial })}
        />
      )}

      {interaction.kind === "order" && (
        <Order
          items={interaction.items}
          value={state.order}
          onChange={(order) => up({ order })}
        />
      )}

      {interaction.kind === "pick" && (
        <Pick
          items={interaction.items}
          layout={interaction.layout}
          value={state.pick}
          onChange={(pick) => up({ pick })}
        />
      )}

      {interaction.kind === "overlay" && (
        <>
          <Overlay
            grid={interaction.grid}
            windows={interaction.windows}
            sheet={interaction.sheet}
            pos={state.sheet}
            onMove={(sheet) => up({ sheet })}
          />
          <input
            value={state.text}
            onChange={(e) => up({ text: e.target.value })}
            placeholder={interaction.placeholder}
            autoComplete="off"
            className="w-full mt-3 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent"
          />
        </>
      )}

      {interaction.kind === "multi" && (
        <>
          <Multi
            items={interaction.items}
            value={state.multi}
            onChange={(multi) => up({ multi })}
          />
          <p className="text-[11px] text-[#606070] mt-2">
            {state.multi.length}개 선택 — 최소 {interaction.min}개
          </p>
        </>
      )}
    </div>
  );
}
