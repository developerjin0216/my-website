"use client";

import { useRef, useState } from "react";

// "1-3,5,7-9" → 0-base 인덱스 배열 (순서 유지, 범위 밖 제거)
export function parseRange(input: string, total: number): number[] {
  const out: number[] = [];
  for (const part of input.split(",")) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      // "3-1"처럼 역순 범위는 내림차순으로 — 순서 바꿔 뽑기 지원
      const a = Number(m[1]), b = Number(m[2]);
      const step = a <= b ? 1 : -1;
      for (let i = a; step > 0 ? i <= b : i >= b; i += step) {
        if (i >= 1 && i <= total) out.push(i - 1);
      }
    } else if (/^\d+$/.test(p)) {
      const n = Number(p);
      if (n >= 1 && n <= total) out.push(n - 1);
    }
  }
  return out;
}

export default function PdfSplitPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [exclude, setExclude] = useState(false);

  const onFile = async (f: File) => {
    setError(null);
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setFile(f);
      setPageCount(doc.getPageCount());
      setRange("");
    } catch {
      setError("PDF를 열 수 없습니다 — 암호가 걸려 있다면 해제 후 다시 올려주세요.");
      setFile(null);
      setPageCount(0);
    } finally {
      setBusy(false);
    }
  };

  const indices = (() => {
    if (!range.trim() || pageCount === 0) return [];
    const picked = parseRange(range, pageCount);
    if (!exclude) return picked;
    const pickedSet = new Set(picked);
    return Array.from({ length: pageCount }, (_, i) => i).filter((i) => !pickedSet.has(i));
  })();

  const extract = async () => {
    if (!file || indices.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(/\.pdf$/i, "") + `_${indices.length}p.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("추출 중 오류가 났습니다.");
    } finally {
      setBusy(false);
    }
  };

  const splitAll = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const JSZip = (await import("jszip")).default;
      const src = await PDFDocument.load(await file.arrayBuffer());
      const zip = new JSZip();
      const base = file.name.replace(/\.pdf$/i, "");
      for (let i = 0; i < src.getPageCount(); i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        zip.file(`${base}_p${String(i + 1).padStart(3, "0")}.pdf`, await out.save());
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${base}_pages.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("분할 중 오류가 났습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">문서는 서버로 전송되지 않습니다.</strong>{" "}
        추출·분할 모두 이 브라우저 안에서 처리됩니다.
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
          if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-[#2a3a5a] bg-card hover:border-accent/60"
        }`}
      >
        <p className="text-3xl mb-2">✂️</p>
        <p className="text-sm font-semibold">
          {busy && !file ? "여는 중..." : file ? `${file.name} (${pageCount}페이지)` : "PDF를 여기에 놓거나 탭해서 선택"}
        </p>
        {file && <p className="text-xs text-[#606070] mt-1.5">다른 파일을 올리려면 다시 탭하세요</p>}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <div className="bg-[#2a1a1a] border border-[#EF4444]/40 rounded-2xl px-4 py-3 text-xs text-[#ffb0b0]">
          ⚠️ {error}
        </div>
      )}

      {file && pageCount > 0 && (
        <div className="bg-card rounded-2xl p-5 space-y-3">
          <label className="block text-sm font-semibold">
            페이지 지정 <span className="text-xs font-normal text-[#606070]">(전체 {pageCount}페이지)</span>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value.replace(/[^\d,\-\s]/g, ""))}
              placeholder="예: 1-3,5,7-9"
              className="w-full mt-2 bg-[#16213e] border border-[#2a3a5a] rounded-xl px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-[#a0a0b0]">
            <input type="checkbox" checked={exclude} onChange={(e) => setExclude(e.target.checked)} />
            제외 모드 — 지정한 페이지를 &lsquo;빼고&rsquo; 나머지를 저장
          </label>
          <button
            type="button"
            onClick={extract}
            disabled={busy || indices.length === 0}
            className="w-full py-3 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {indices.length === 0
              ? "페이지를 입력하세요"
              : busy
                ? "처리 중..."
                : `✂️ ${indices.length}페이지 ${exclude ? "남기고" : ""} 추출해서 저장`}
          </button>
          <div className="border-t border-[#2a3a5a] pt-3">
            <button
              type="button"
              onClick={splitAll}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-accent text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              📂 한 페이지씩 {pageCount}개 PDF로 나눠 ZIP 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
