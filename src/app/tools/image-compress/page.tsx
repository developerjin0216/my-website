"use client";

import { useRef, useState } from "react";

interface Done {
  name: string;
  before: number;
  after: number;
  blob: Blob;
  url: string;
}

const fmtKB = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)}MB`
    : `${Math.max(1, Math.round(bytes / 1024))}KB`;

async function loadBitmap(file: File, maxWidth: number): Promise<ImageBitmap> {
  const bmp = await createImageBitmap(file);
  if (maxWidth > 0 && bmp.width > maxWidth) {
    const scaled = await createImageBitmap(bmp, {
      resizeWidth: maxWidth,
      resizeHeight: Math.round((bmp.height * maxWidth) / bmp.width),
      resizeQuality: "high",
    });
    bmp.close();
    return scaled;
  }
  return bmp;
}

function encode(bmp: ImageBitmap, type: string, quality: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode fail"))), type, quality)
  );
}

// 목표 용량(바이트)에 맞는 최고 품질을 이진 탐색
async function compressToTarget(
  bmp: ImageBitmap,
  type: string,
  targetBytes: number
): Promise<Blob> {
  let lo = 0.05, hi = 0.95;
  let best: Blob | null = null;
  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2;
    const blob = await encode(bmp, type, mid);
    if (blob.size <= targetBytes) {
      best = blob;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return best ?? encode(bmp, type, 0.05);
}

export default function ImageCompressPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Done[]>([]);
  const [mode, setMode] = useState<"target" | "quality">("target");
  const [targetKb, setTargetKb] = useState("100");
  const [quality, setQuality] = useState("80");
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [maxWidth, setMaxWidth] = useState("0");

  const handleFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    setError(null);
    setResults([]);
    try {
      const files = [...fileList].filter((f) => /^image\//.test(f.type));
      if (files.length === 0) {
        setError("이미지 파일을 올려주세요.");
        return;
      }
      const type = `image/${format}`;
      const done: Done[] = [];
      for (const file of files) {
        const bmp = await loadBitmap(file, Number(maxWidth) || 0);
        const blob =
          mode === "target"
            ? await compressToTarget(bmp, type, Math.max(10, Number(targetKb)) * 1024)
            : await encode(bmp, type, Math.min(95, Math.max(5, Number(quality))) / 100);
        bmp.close();
        const ext = format === "webp" ? ".webp" : ".jpg";
        done.push({
          name: file.name.replace(/\.[^.]+$/, "") + ext,
          before: file.size,
          after: blob.size,
          blob,
          url: URL.createObjectURL(blob),
        });
      }
      setResults(done);
    } catch {
      setError("이미지 처리 중 오류가 났습니다. 사진이 너무 크면 가로 폭 제한을 걸어보세요.");
    } finally {
      setBusy(false);
    }
  };

  const saveAll = async () => {
    if (results.length === 1) {
      const a = document.createElement("a");
      a.href = results[0].url;
      a.download = results[0].name;
      a.click();
      return;
    }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const r of results) zip.file(r.name, r.blob);
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "compressed.zip";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inputCls =
    "w-full bg-[#16213e] border border-[#2a3a5a] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent";
  const segBtn = (active: boolean) =>
    `flex-1 rounded-xl px-2 py-2 text-xs font-semibold border transition-colors ${
      active
        ? "bg-accent text-[#1a1a2e] border-accent"
        : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
    }`;

  return (
    <div className="space-y-4">
      {/* 옵션 */}
      <div className="bg-card rounded-2xl p-4 space-y-3">
        <div className="flex gap-2">
          <button type="button" className={segBtn(mode === "target")} onClick={() => setMode("target")}>
            목표 용량 맞춤
          </button>
          <button type="button" className={segBtn(mode === "quality")} onClick={() => setMode("quality")}>
            품질 직접 선택
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {mode === "target" ? (
            <label className="text-xs text-[#a0a0b0]">
              목표 (KB)
              <input
                type="text" inputMode="numeric" value={targetKb}
                onChange={(e) => setTargetKb(e.target.value.replace(/\D/g, ""))}
                className={`${inputCls} mt-1`}
              />
            </label>
          ) : (
            <label className="text-xs text-[#a0a0b0]">
              품질 (5~95)
              <input
                type="text" inputMode="numeric" value={quality}
                onChange={(e) => setQuality(e.target.value.replace(/\D/g, ""))}
                className={`${inputCls} mt-1`}
              />
            </label>
          )}
          <label className="text-xs text-[#a0a0b0]">
            형식
            <select value={format} onChange={(e) => setFormat(e.target.value as "jpeg" | "webp")} className={`${inputCls} mt-1`}>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP (더 작음)</option>
            </select>
          </label>
          <label className="text-xs text-[#a0a0b0]">
            가로 폭 제한
            <select value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} className={`${inputCls} mt-1`}>
              <option value="0">원본 유지</option>
              <option value="1920">1920px</option>
              <option value="1280">1280px</option>
              <option value="800">800px</option>
            </select>
          </label>
        </div>
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
        <p className="text-3xl mb-2">🗜️</p>
        <p className="text-sm font-semibold">
          {busy ? "압축 중..." : "이미지를 여기에 놓거나 탭해서 선택 (여러 장 가능)"}
        </p>
        <p className="text-xs text-[#606070] mt-1.5">사진은 서버로 전송되지 않습니다</p>
        <input
          ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="bg-[#2a1a1a] border border-[#EF4444]/40 rounded-2xl px-4 py-3 text-xs text-[#ffb0b0]">
          ⚠️ {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-card rounded-2xl p-5 space-y-3">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-sm gap-2">
              <span className="truncate min-w-0">{r.name}</span>
              <span className="shrink-0 text-xs">
                <span className="text-[#606070] line-through">{fmtKB(r.before)}</span>{" "}
                <span className="text-[#22C55E] font-bold">{fmtKB(r.after)}</span>{" "}
                <span className="text-[#a0a0b0]">
                  (−{Math.max(0, Math.round((1 - r.after / r.before) * 100))}%)
                </span>
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={saveAll}
            className="w-full py-3 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform"
          >
            ⬇️ {results.length > 1 ? `${results.length}장 ZIP으로 저장` : "저장"}
          </button>
        </div>
      )}
    </div>
  );
}
