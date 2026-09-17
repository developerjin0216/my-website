"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import EscapeArt from "@/components/escape/EscapeArt";
import {
  clues,
  ending,
  getPuzzlesOf,
  orderedScenes,
  TOTAL_PUZZLES,
  type Clue,
  type Puzzle,
} from "@/data/escape";
import { checkAnswer } from "@/utils/escapeAnswer";
import {
  ESCAPE_VERSION,
  getEscapeProgress,
  resetEscapeProgress,
  saveEscapeProgress,
} from "@/utils/storage";
import { QUIZ_URL } from "@/lib/site";

// 방탈출 플레이 화면 — 장면 → 퍼즐 → 해설 → 장면 마무리 순으로 진행합니다.
// 광고는 장면이 바뀌는 시점(outro)에만 넣습니다. 퍼즐 화면에 붙이면 몰입이
// 끊기고 오조작 클릭(무효 트래픽) 위험도 있습니다.

type View = "intro" | "explore" | "puzzle" | "solved" | "outro" | "memory" | "ending";

export default function PlayClient() {
  const [loaded, setLoaded] = useState(false);
  const [solved, setSolved] = useState<string[]>([]);
  const [hints, setHints] = useState<Record<string, number>>({});
  const [sceneIdx, setSceneIdx] = useState(0);
  const [view, setView] = useState<View>("intro");
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);
  const [checking, setChecking] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [justSolved, setJustSolved] = useState<Puzzle | null>(null);
  const [seen, setSeen] = useState<string[]>([]); // 이번 방에서 살펴본 사물
  const [openObj, setOpenObj] = useState<string | null>(null);
  const [stale, setStale] = useState(false); // 스토리 보강 전 저장분으로 이어하는 중

  // 저장된 진행 상황 복원 (effect 내 동기 setState를 피하려고 태스크로 지연)
  useEffect(() => {
    const t = setTimeout(() => {
      const p = getEscapeProgress();
      const done = new Set(p.solved);

      let idx = orderedScenes.length;
      for (let i = 0; i < orderedScenes.length; i++) {
        const list = getPuzzlesOf(orderedScenes[i].id);
        if (list.some((q) => !done.has(q.id))) {
          idx = i;
          break;
        }
      }

      setSolved(p.solved);
      setHints(p.hints);
      if (idx >= orderedScenes.length) {
        setSceneIdx(orderedScenes.length - 1);
        setView("ending");
      } else {
        setSceneIdx(idx);
        // 이어하기도 반드시 방 도입부부터. 곧장 퍼즐로 복원하면 이야기를 건너뛰고
        // 문제만 튀어나와서, 이어하는 사람에게는 이 게임이 퀴즈로만 보입니다.
        setView("intro");
      }
      // 스토리 보강 전에 저장된 진행이면 알려줍니다. 강제로 지우지는 않습니다.
      if ((p.version ?? 1) < ESCAPE_VERSION && p.solved.length > 0) {
        setStale(true);
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const scene = orderedScenes[sceneIdx];
  const solvedSet = useMemo(() => new Set(solved), [solved]);
  const scenePuzzles = useMemo(() => getPuzzlesOf(scene.id), [scene.id]);
  const current = scenePuzzles.find((q) => !solvedSet.has(q.id)) ?? null;

  // 장면이 끝났는가 = 그 장면 퍼즐을 전부 풀었는가
  const sceneDone = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const s of orderedScenes) {
      map.set(s.id, getPuzzlesOf(s.id).every((q) => solvedSet.has(q.id)));
    }
    return map;
  }, [solvedSet]);

  // 수첩에 올라오는 떡밥 = 이미 지나온 장면에서 심긴 것
  const collected: Clue[] = useMemo(
    () =>
      clues.filter((c) => {
        const planted = orderedScenes.find((s) => s.id === c.plantedIn);
        return planted ? planted.order <= scene.order : false;
      }),
    [scene.order]
  );
  const isResolved = (c: Clue) => sceneDone.get(c.payoffIn) === true;

  const persist = (
    nextSolved: string[],
    nextHints: Record<string, number>,
    completed = false
  ) => saveEscapeProgress(nextSolved, nextHints, completed);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || checking) return;
    setChecking(true);
    const ok = await checkAnswer(input, current.salt, current.answerHash);
    setChecking(false);
    if (!ok) {
      setWrong(true);
      return;
    }
    const next = [...solved, current.id];
    setSolved(next);
    persist(next, hints);
    setInput("");
    setWrong(false);
    setJustSolved(current);
    setView("solved");
  };

  const openHint = (p: Puzzle) => {
    const level = Math.min((hints[p.id] ?? 0) + 1, 3);
    const next = { ...hints, [p.id]: level };
    setHints(next);
    persist(solved, next);
  };

  const afterSolved = () => {
    const remaining = scenePuzzles.some((q) => !solvedSet.has(q.id));
    setJustSolved(null);
    setView(remaining ? "puzzle" : "outro");
  };

  const toMemory = () => setView("memory");

  const nextScene = () => {
    setSeen([]);
    setOpenObj(null);
    if (sceneIdx + 1 >= orderedScenes.length) {
      persist(solved, hints, true);
      setView("ending");
      return;
    }
    setSceneIdx(sceneIdx + 1);
    setView("intro");
  };

  const restart = () => {
    resetEscapeProgress();
    setSolved([]);
    setHints({});
    setSceneIdx(0);
    setView("intro");
    setInput("");
    setJustSolved(null);
    setSeen([]);
    setOpenObj(null);
    setStale(false);
  };

  const share = async () => {
    // 떡밥 수는 데이터에서 — 늘릴 때마다 문구를 고치는 걸 잊게 됩니다
    const text = `[방탈출] 한빛사진관 — "현상되지 않은 필름"\n폐업 앞둔 사진관에 남은 떡밥 ${clues.length}개, 전부 회수했습니다.\n당신도 풀어보세요.`;
    const url = `${QUIZ_URL}/escape`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "웹 방탈출 · 한빛사진관", text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        alert("링크가 복사되었습니다!");
      } catch {
        /* clipboard unavailable */
      }
    }
  };

  if (!loaded) {
    return (
      <div className="max-w-lg mx-auto w-full px-5 py-20 text-center">
        <p className="text-sm text-[#606070]">불러오는 중…</p>
      </div>
    );
  }

  const progress = Math.round((solved.length / TOTAL_PUZZLES) * 100);

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto w-full px-5 py-6">
      {/* 상단 진행 표시 */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <Link href="/escape" className="text-xs text-[#606070] hover:text-[#a0a0b0]">
            ← 나가기
          </Link>
          <span className="text-[11px] text-[#606070]">
            {view === "ending"
              ? "탈출 완료"
              : `${scene.order}/${orderedScenes.length} · ${scene.act} · ${scene.title}`}
          </span>
        </div>
        <div className="h-1 rounded-full bg-[#16213e] overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 스토리 보강 전 저장분으로 이어하는 중 — 새 내용을 못 보고 지나칩니다 */}
      {stale && view !== "ending" && (
        <div className="mb-4 rounded-xl border border-accent/40 bg-[#3d2e00]/30 p-4">
          <p className="text-xs font-bold text-accent mb-1">이야기가 크게 보강됐습니다</p>
          <p className="text-[11px] text-[#c8c8d8] leading-relaxed">
            지금 이어하시는 진행은 이야기를 넣기 전에 저장된 것입니다. 방마다 살펴보는
            물건과 회상이 새로 들어갔는데, 이어하면 지나온 방의 내용은 볼 수 없습니다.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={restart}
              className="flex-1 rounded-lg bg-accent text-[#1a1a2e] text-xs font-bold py-2.5"
            >
              처음부터 다시
            </button>
            <button
              type="button"
              onClick={() => setStale(false)}
              className="flex-1 rounded-lg bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] text-xs font-semibold py-2.5"
            >
              이어서 할게요
            </button>
          </div>
        </div>
      )}

      {/* ── 장면 도입 ── */}
      {view === "intro" && (
        <section className="bg-card rounded-2xl p-6 animate-[fadeIn_0.4s_ease]">
          <p className="text-[11px] text-[#606070] mb-1">{scene.place}</p>
          <h1 className="text-xl font-bold text-accent mb-4">{scene.title}</h1>
          {scene.intro.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-[#c8c8d8] mb-2">
              {line}
            </p>
          ))}
          <button
            type="button"
            onClick={() => setView("explore")}
            className="w-full mt-5 rounded-xl bg-accent text-[#1a1a2e] font-bold py-3 active:scale-[0.99] transition-transform"
          >
            둘러보기
          </button>
        </section>
      )}

      {/* ── 둘러보기 ── */}
      {view === "explore" && (
        <section className="space-y-3">
          <div className="bg-card rounded-2xl p-5">
            <p className="text-[11px] text-[#606070] mb-1">{scene.place}</p>
            <h2 className="text-lg font-bold text-accent">{scene.title}을 둘러본다</h2>
            <p className="text-xs text-[#606070] mt-1">
              살펴본 것 {seen.length}/{scene.objects.length}
            </p>
          </div>

          {scene.objects.map((o) => {
            const open = openObj === o.id;
            const read = seen.includes(o.id);
            return (
              <div key={o.id} className="bg-card rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setOpenObj(open ? null : o.id);
                    if (!read) setSeen([...seen, o.id]);
                  }}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                >
                  <span
                    className={`text-sm font-semibold ${read ? "text-[#8a8a9a]" : "text-[#e8e8f0]"}`}
                  >
                    {read ? "· " : "› "}
                    {o.name}
                  </span>
                  <span className="text-[#606070] text-xs shrink-0">{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div className="px-5 pb-5">
                    {o.text.map((line, i) => (
                      <p key={i} className="text-sm leading-relaxed text-[#c8c8d8] mb-2">
                        {line}
                      </p>
                    ))}
                    {o.clue && (
                      <p className="text-[11px] text-accent mt-3">🔖 단서 수첩에 적어둔다</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setView("puzzle")}
            className="w-full rounded-xl bg-accent text-[#1a1a2e] font-bold py-3.5 active:scale-[0.99] transition-transform"
          >
            {seen.length < scene.objects.length
              ? `그만 보고 손을 대본다 (${scene.objects.length - seen.length}개 안 봄)`
              : "손을 대본다"}
          </button>
        </section>
      )}

      {/* ── 퍼즐 ── */}
      {view === "puzzle" && current && (
        <section className="bg-card rounded-2xl p-6">
          <p className="text-[11px] text-[#606070] mb-1">
            {scene.title} · {current.order}/{scenePuzzles.length}
          </p>
          <h2 className="text-lg font-bold text-accent mb-3">{current.title}</h2>

          {/* 언제든 방으로 돌아가 물건을 다시 볼 수 있어야 합니다.
              퍼즐 화면에 갇히면 앞의 서술이 기억나지 않아 문제만 남습니다. */}
          <button
            type="button"
            onClick={() => setView("explore")}
            className="text-[11px] text-[#606070] hover:text-[#a0a0b0] underline underline-offset-2 mb-3"
          >
            ← 이 방 다시 둘러보기
          </button>

          {/* 진입 서술 — 왜 지금 이걸 보고 있는가 */}
          {current.lead.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-[#c8c8d8] mb-2">
              {line || " "}
            </p>
          ))}

          <p className="text-sm text-[#e8e8f0] leading-relaxed mt-4 mb-4 border-l-2 border-accent pl-3">
            {current.prompt}
          </p>

          {/* 관찰 대상 — 정답에 필요한 정보는 그림 쪽에 있습니다 */}
          <div className="mb-3">
            <EscapeArt art={current.art} />
          </div>

          <div className="rounded-xl bg-[#16213e] border border-[#2a3a5a] p-4 mb-4">
            {current.body.map((line, i) => (
              <p
                key={i}
                className="text-[13px] leading-relaxed text-[#c8c8d8] whitespace-pre-wrap"
              >
                {line || " "}
              </p>
            ))}
          </div>

          <form onSubmit={submit}>
            <label className="block text-xs text-[#a0a0b0] mb-1.5">
              {current.inputLabel}
            </label>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setWrong(false);
                }}
                placeholder={current.placeholder}
                autoComplete="off"
                className="flex-1 min-w-0 rounded-xl bg-[#0f1626] border border-[#2a3a5a] px-3 py-2.5 text-sm text-[#e8e8f0] outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={checking || !input.trim()}
                className="shrink-0 rounded-xl bg-accent text-[#1a1a2e] font-bold px-5 py-2.5 text-sm disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                {checking ? "…" : "확인"}
              </button>
            </div>
          </form>

          {wrong && (
            <p className="text-xs text-[#EF4444] mt-2">
              맞지 않습니다. 다시 살펴보세요.
            </p>
          )}

          {/* 힌트 */}
          <div className="mt-5 border-t border-[#2a3a5a] pt-4">
            {Array.from({ length: hints[current.id] ?? 0 }, (_, i) => (
              <p key={i} className="text-xs text-[#a0a0b0] leading-relaxed mb-1.5">
                <span className="text-[#606070]">힌트 {i + 1}.</span>{" "}
                {current.hints[i]}
              </p>
            ))}
            {(hints[current.id] ?? 0) < 3 && (
              <button
                type="button"
                onClick={() => openHint(current)}
                className="text-xs text-[#606070] hover:text-[#a0a0b0] underline underline-offset-2"
              >
                힌트 열기 ({(hints[current.id] ?? 0) + 1}/3)
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── 정답 해설 ── */}
      {view === "solved" && justSolved && (
        <section className="bg-card rounded-2xl p-6">
          <p className="text-xs font-bold text-[#22C55E] mb-3">✓ 열렸다</p>
          {justSolved.solved.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-[#c8c8d8] mb-2">
              {line || " "}
            </p>
          ))}
          <button
            type="button"
            onClick={afterSolved}
            className="w-full mt-5 rounded-xl bg-accent text-[#1a1a2e] font-bold py-3 active:scale-[0.99] transition-transform"
          >
            계속
          </button>
        </section>
      )}

      {/* ── 장면 마무리 (광고는 여기서만) ── */}
      {view === "outro" && (
        <section className="space-y-4">
          <div className="bg-card rounded-2xl p-6">
            <p className="text-[11px] text-[#606070] mb-1">{scene.place}</p>
            <h2 className="text-lg font-bold text-accent mb-3">
              {scene.title}을(를) 정리했다
            </h2>
            {scene.outro.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#c8c8d8] mb-2">
                {line}
              </p>
            ))}

            {scene.resolves.length > 0 && (
              <div className="mt-4 rounded-xl border border-[#ffd700]/30 bg-[#3d2e00]/30 p-4">
                <p className="text-xs font-bold text-accent mb-2">
                  🔖 떡밥 {scene.resolves.length}개 회수
                </p>
                {scene.resolves.map((id) => {
                  const c = clues.find((x) => x.id === id);
                  if (!c) return null;
                  return (
                    <div key={id} className="mb-3 last:mb-0">
                      <p className="text-xs text-[#d8c98a] font-semibold">{c.label}</p>
                      <p className="text-xs text-[#a0a0b0] leading-relaxed mt-0.5">
                        {c.truth}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <AdBanner slot="XXXXXXXXXX" format="horizontal" />

          <button
            type="button"
            onClick={toMemory}
            className="w-full rounded-xl bg-accent text-[#1a1a2e] font-bold py-3.5 active:scale-[0.99] transition-transform"
          >
            {sceneIdx + 1 >= orderedScenes.length ? "가게를 나선다" : "다음 장소로"}
          </button>
        </section>
      )}

      {/* ── 회상 ── */}
      {view === "memory" && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-[#3a4a6a] bg-[#0f1626] p-6">
            <p className="text-[11px] tracking-wider text-[#6b7a90] mb-4">
              {scene.memory.title}
            </p>
            {scene.memory.text.map((line, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-[#9aa8c0] italic mb-2.5"
              >
                {line}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={nextScene}
            className="w-full rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#c8c8d8] font-semibold py-3.5"
          >
            계속
          </button>
        </section>
      )}

      {/* ── 엔딩 ── */}
      {view === "ending" && (
        <section className="space-y-4">
          <div className="bg-card rounded-2xl p-6">
            <p className="text-xs text-[#606070] mb-1">탈출 완료</p>
            <h1 className="text-2xl font-bold text-accent mb-5">{ending.title}</h1>
            {ending.lines.map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#c8c8d8] mb-2">
                {line || " "}
              </p>
            ))}
            <p className="text-[10px] text-[#606070] mt-5">{ending.epilogue}</p>
          </div>

          <div className="bg-card rounded-2xl p-5">
            <p className="text-sm font-bold text-accent mb-3">
              🔖 회수한 떡밥 {clues.length}개
            </p>
            {clues.map((c) => (
              <div key={c.id} className="mb-3 last:mb-0 border-b border-[#2a3a5a] last:border-0 pb-3 last:pb-0">
                <p className="text-xs text-[#d8c98a] font-semibold">{c.label}</p>
                <p className="text-[11px] text-[#606070] leading-relaxed mt-0.5">
                  처음엔 — {c.surface}
                </p>
                <p className="text-xs text-[#a0a0b0] leading-relaxed mt-1">
                  사실은 — {c.truth}
                </p>
              </div>
            ))}
          </div>

          <AdBanner slot="XXXXXXXXXX" format="horizontal" />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={share}
              className="flex-1 rounded-xl bg-accent text-[#1a1a2e] font-bold py-3 active:scale-[0.99] transition-transform"
            >
              공유하기
            </button>
            <button
              type="button"
              onClick={restart}
              className="flex-1 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] font-semibold py-3"
            >
              처음부터
            </button>
          </div>
          <Link
            href="/escape"
            className="block text-center text-xs text-[#606070] hover:text-[#a0a0b0] py-2"
          >
            방탈출 안내로 돌아가기
          </Link>
        </section>
      )}

      {/* ── 단서 수첩 ── */}
      {view !== "ending" && view !== "memory" && collected.length > 0 && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setJournalOpen((v) => !v)}
            className="w-full text-left rounded-xl bg-[#16213e] border border-[#2a3a5a] px-4 py-3 text-xs font-semibold text-[#a0a0b0]"
          >
            🔖 단서 수첩 ({collected.filter(isResolved).length}/{collected.length} 회수)
            <span className="float-right text-[#606070]">{journalOpen ? "▲" : "▼"}</span>
          </button>
          {journalOpen && (
            <div className="mt-2 rounded-xl bg-card p-4 space-y-3">
              {collected.map((c) => (
                <div key={c.id}>
                  <p className="text-xs font-semibold text-[#d8c98a]">
                    {isResolved(c) ? "✓ " : "· "}
                    {c.label}
                  </p>
                  <p className="text-[11px] text-[#606070] leading-relaxed mt-0.5">
                    {c.surface}
                  </p>
                  {isResolved(c) && (
                    <p className="text-[11px] text-[#a0a0b0] leading-relaxed mt-1">
                      → {c.truth}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
