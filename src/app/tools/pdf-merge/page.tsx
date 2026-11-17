"use client";

import { useRef, useState } from "react";

interface Entry {
  file: File;
  pages: number | null; // null = 아직 미확인, -1 = 열기 실패(암호 등)
}

export default function PdfMergePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (fileList: FileList | File[]) => {
    setError(null);
    const pdfs = [...fileList].filter(
      (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name)
    );
    if (pdfs.length === 0) {
      setError("PDF 파일을 올려주세요.");
      return;
    }
    // 새로 올린 것만 따로 들고 검사합니다. 예전에는 목록 전체를 복사해 두었다가 검사 뒤 통째로
    // 되돌려 써서, 검사 중에 지우거나 순서를 바꾼 것이 되살아나고 그사이 올린 묶음이 사라졌습니다.
    const added: Entry[] = pdfs.map((file) => ({ file, pages: null }));
    setEntries((cur) => [...cur, ...added]);
    // 페이지 수 검사 (암호 PDF 조기 감지)
    const { PDFDocument } = await import("pdf-lib");
    for (const entry of added) {
      if (entry.pages !== null) continue;
      try {
        const doc = await PDFDocument.load(await entry.file.arrayBuffer(), {
          ignoreEncryption: false,
        });
        entry.pages = doc.getPageCount();
      } catch {
        entry.pages = -1;
      }
    }
    // 결과는 같은 항목 객체에 적었으므로 지금 목록을 그대로 다시 그리면 됩니다
    setEntries((cur) => [...cur]);
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...entries];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setEntries(next);
  };

  const remove = (i: number) => setEntries(entries.filter((_, k) => k !== i));

  const merge = async () => {
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const entry of entries) {
        if (entry.pages === -1) continue;
        const src = await PDFDocument.load(await entry.file.arrayBuffer());
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      if (out.getPageCount() === 0) {
        setError("합칠 수 있는 페이지가 없습니다. 암호 걸린 PDF는 해제 후 다시 올려주세요.");
        return;
      }
      const bytes = await out.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("병합 중 오류가 났습니다. 파일이 손상되지 않았는지 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  const mergeable = entries.filter((e) => e.pages !== -1);
  // 확인이 안 끝난 파일이 암호 PDF 면 병합 전체가 엉뚱한 오류로 멈춥니다 — 끝날 때까지 잠급니다
  const checking = entries.some((e) => e.pages === null);

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">문서는 서버로 전송되지 않습니다.</strong>{" "}
        병합은 100% 이 브라우저 안에서 이루어집니다 — 회사 보안 규정 걱정 없이
        쓰세요.
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
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-[#2a3a5a] bg-card hover:border-accent/60"
        }`}
      >
        <p className="text-3xl mb-2">📑</p>
        <p className="text-sm font-semibold">
          PDF를 여기에 놓거나 탭해서 선택 (여러 번 추가 가능)
        </p>
        <input
          ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <div className="bg-[#2a1a1a] border border-[#EF4444]/40 rounded-2xl px-4 py-3 text-xs text-[#ffb0b0]">
          ⚠️ {error}
        </div>
      )}

      {entries.length > 0 && (
        <div className="bg-card rounded-2xl p-4 space-y-2">
          {entries.map((entry, i) => (
            <div
              key={`${entry.file.name}-${i}`}
              className="flex items-center gap-2 bg-[#16213e] rounded-xl px-3 py-2.5"
            >
              <span className="text-xs text-[#606070] w-5 shrink-0">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{entry.file.name}</p>
                <p className="text-xs text-[#606070]">
                  {entry.pages === null
                    ? "확인 중..."
                    : entry.pages === -1
                      ? "⚠️ 열 수 없음 (암호 PDF?) — 병합에서 제외됨"
                      : `${entry.pages}페이지`}
                </p>
              </div>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="text-[#a0a0b0] disabled:opacity-30 px-1.5 py-1 text-sm" aria-label="위로">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === entries.length - 1}
                className="text-[#a0a0b0] disabled:opacity-30 px-1.5 py-1 text-sm" aria-label="아래로">↓</button>
              <button type="button" onClick={() => remove(i)}
                className="text-[#ff6b6b] px-1.5 py-1 text-sm" aria-label="삭제">✕</button>
            </div>
          ))}
          <button
            type="button"
            onClick={merge}
            disabled={busy || checking || mergeable.length < 2}
            className="w-full py-3 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {busy
              ? "병합 중..."
              : checking
                ? "페이지 확인 중..."
                : mergeable.length < 2
                ? "PDF를 2개 이상 올려주세요"
                : `📑 ${mergeable.length}개 파일 합치기`}
          </button>
        </div>
      )}
    </div>
  );
}
