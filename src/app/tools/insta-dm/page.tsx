"use client";

import { useRef, useState } from "react";
import { analyze, type Analysis } from "../kakao-analyzer/parser";
import { parseDmFiles, type DmThread } from "./dmParser";

function fmtReply(min: number | null): string {
  if (min === null) return "-";
  if (min < 1) return "1분 이내";
  if (min < 60) return `${Math.round(min)}분`;
  return `${(min / 60).toFixed(1)}시간`;
}

export default function InstaDmPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<DmThread[] | null>(null);
  const [selected, setSelected] = useState<DmThread | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    setError(null);
    setSelected(null);
    setResult(null);
    try {
      const texts: { path: string; text: string }[] = [];
      for (const file of [...fileList]) {
        if (file.name.toLowerCase().endsWith(".zip")) {
          const JSZip = (await import("jszip")).default;
          const zip = await JSZip.loadAsync(file);
          for (const entry of Object.values(zip.files)) {
            if (entry.dir) continue;
            if (/messages\/[^/]*inbox\/[^/]+\/message_\d+\.json$/i.test(entry.name)) {
              texts.push({ path: entry.name, text: await entry.async("text") });
            }
          }
        } else if (file.name.toLowerCase().endsWith(".json")) {
          texts.push({ path: `messages/inbox/direct/${file.name}`, text: await file.text() });
        }
      }
      const parsed = parseDmFiles(texts);
      if (parsed.length === 0) {
        setError(
          "DM 데이터를 찾지 못했습니다. 내보내기 신청 시 '메시지' 항목을 포함했는지 확인하세요 — 맞팔 확인용 ZIP(팔로워만 선택)에는 DM이 없습니다."
        );
        setThreads(null);
        return;
      }
      setThreads(parsed);
      if (parsed.length === 1) selectThread(parsed[0]);
    } catch {
      setError("파일을 읽는 중 오류가 났습니다. 원본 ZIP인지 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  const selectThread = (t: DmThread) => {
    setSelected(t);
    setResult(analyze(t.messages));
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">대화 내용은 서버로 전송되지 않습니다.</strong>{" "}
        깨진 한글(모지바케)도 브라우저 안에서 자동 복원됩니다.
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-[#2a3a5a] bg-card hover:border-accent/60"
        }`}
      >
        <p className="text-3xl mb-2">💌</p>
        <p className="text-sm font-semibold">
          {busy ? "분석 중..." : "메시지 포함 내보내기 ZIP을 여기에 놓거나 탭해서 선택"}
        </p>
        <p className="text-xs text-[#606070] mt-1.5">
          &lsquo;메시지&rsquo; 항목을 포함해 신청한 ZIP이어야 합니다 (가이드 참고)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".zip,.json,application/zip,application/json"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="bg-[#2a1a1a] border border-[#EF4444]/40 rounded-2xl px-4 py-3 text-xs text-[#ffb0b0] leading-relaxed">
          ⚠️ {error}
        </div>
      )}

      {/* 대화방 선택 */}
      {threads && threads.length > 1 && (
        <div className="bg-card rounded-2xl p-4">
          <h2 className="text-sm font-bold text-accent mb-2">
            분석할 대화 선택 <span className="font-normal text-[#606070]">({threads.length}개 중 상위 20)</span>
          </h2>
          <div className="max-h-64 overflow-y-auto divide-y divide-[#2a3a5a]/60">
            {threads.slice(0, 20).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => selectThread(t)}
                className={`w-full flex items-center justify-between py-2.5 text-left text-sm hover:text-accent ${
                  selected?.key === t.key ? "text-accent font-semibold" : ""
                }`}
              >
                <span className="truncate">{t.title}</span>
                <span className="text-xs text-[#606070] shrink-0 ml-2">
                  {t.messages.length.toLocaleString()}개
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 분석 결과 */}
      {result && selected && (
        <>
          {result.chemistry !== null && (
            <div className="bg-card rounded-2xl p-6 text-center">
              <p className="text-sm text-[#a0a0b0]">{selected.title}</p>
              <p className="text-6xl font-bold text-accent my-2">{result.chemistry}%</p>
              <p className="text-xs text-[#606070]">
                대화량·선톡·답장속도 균형 기반 재미용 케미 점수
              </p>
            </div>
          )}

          <div className="bg-card rounded-2xl p-5">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-xl font-bold text-accent">{result.total.toLocaleString()}</p>
                <p className="text-xs text-[#a0a0b0]">메시지</p>
              </div>
              <div>
                <p className="text-xl font-bold text-accent">
                  {new Date(result.firstTs).toLocaleDateString("ko-KR")}
                </p>
                <p className="text-xs text-[#a0a0b0]">첫 DM</p>
              </div>
              <div>
                <p className="text-xl font-bold text-accent">{Math.round(result.nightRatio * 100)}%</p>
                <p className="text-xs text-[#a0a0b0]">새벽 대화</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5">
            <h2 className="text-sm font-bold text-accent mb-3">누가 어떻게 보냈나</h2>
            <div className="space-y-3">
              {result.authors.slice(0, 10).map((s) => (
                <div key={s.author}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{s.author}</span>
                    <span className="text-[#a0a0b0]">
                      {s.count.toLocaleString()}개 ({Math.round(s.share * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[#2a3a5a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.max(2, Math.round(s.share * 100))}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#606070] mt-1">
                    답장 중앙값 {fmtReply(s.medianReplyMin)} · 선톡 {s.starts}회
                  </p>
                </div>
              ))}
            </div>
          </div>

          {result.topWords.length > 0 && (
            <div className="bg-card rounded-2xl p-5">
              <h2 className="text-sm font-bold text-accent mb-3">많이 쓴 단어</h2>
              <div className="flex flex-wrap gap-2">
                {result.topWords.map((w) => (
                  <span key={w.word} className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5">
                    {w.word} <span className="text-[#606070]">{w.count.toLocaleString()}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
