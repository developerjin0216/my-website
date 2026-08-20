"use client";

import { useRef, useState } from "react";

interface Item {
  file: File;
  url: string; // 미리보기 objectURL
  gps: { lat: number; lon: number } | null;
  date: string | null;
  device: string | null;
  hasMeta: boolean;
}

// canvas 재인코딩 — 픽셀만 다시 그리므로 EXIF·GPS 등 메타데이터가 모두 제거됨
async function stripMeta(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  bitmap.close();
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode fail"))),
      type,
      0.95
    )
  );
}

function cleanName(name: string): string {
  return name.replace(/\.(jpe?g|png|webp)$/i, "") + "_clean" + (/\.png$/i.test(name) ? ".png" : ".jpg");
}

export default function ExifRemoverPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    setError(null);
    try {
      const exifr = (await import("exifr")).default;
      const files = [...fileList].filter((f) =>
        /^image\/(jpeg|png|webp)$/.test(f.type)
      );
      if (files.length === 0) {
        setError("JPG·PNG·WebP 이미지를 올려주세요. (HEIC는 미지원 — FAQ 참고)");
        return;
      }
      const parsed: Item[] = [];
      for (const file of files) {
        let gps = null, date = null, device = null, hasMeta = false;
        try {
          const meta = await exifr.parse(file, {
            gps: true,
            pick: ["DateTimeOriginal", "Make", "Model", "latitude", "longitude"],
          });
          if (meta) {
            hasMeta = true;
            if (meta.latitude && meta.longitude)
              gps = { lat: meta.latitude, lon: meta.longitude };
            if (meta.DateTimeOriginal)
              date = new Date(meta.DateTimeOriginal).toLocaleString("ko-KR");
            if (meta.Make || meta.Model)
              device = [meta.Make, meta.Model].filter(Boolean).join(" ");
          }
        } catch {
          /* 메타데이터 없음 */
        }
        parsed.push({
          file,
          url: URL.createObjectURL(file),
          gps,
          date,
          device,
          hasMeta,
        });
      }
      setItems(parsed);
    } catch {
      setError("이미지를 읽는 중 오류가 났습니다.");
    } finally {
      setBusy(false);
    }
  };

  const saveOne = async (item: Item) => {
    const blob = await stripMeta(item.file);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = cleanName(item.file.name);
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const saveAll = async () => {
    setBusy(true);
    try {
      if (items.length === 1) {
        await saveOne(items[0]);
        return;
      }
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const item of items) {
        zip.file(cleanName(item.file.name), await stripMeta(item.file));
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "photos_clean.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">사진은 서버로 전송되지 않습니다.</strong>{" "}
        위치정보를 지우려고 사진을 남의 서버에 올리는 모순 — 여기엔 없습니다.
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
        <p className="text-3xl mb-2">📍</p>
        <p className="text-sm font-semibold">
          {busy ? "처리 중..." : "사진을 여기에 놓거나 탭해서 선택 (여러 장 가능)"}
        </p>
        <p className="text-xs text-[#606070] mt-1.5">JPG · PNG · WebP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="bg-[#2a1a1a] border border-[#EF4444]/40 rounded-2xl px-4 py-3 text-xs text-[#ffb0b0]">
          ⚠️ {error}
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt=""
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1 text-xs space-y-1">
                <p className="font-semibold text-sm truncate">{item.file.name}</p>
                {item.gps ? (
                  <p className="text-[#ff6b6b]">
                    📍 위치 노출!{" "}
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${item.gps.lat}&mlon=${item.gps.lon}#map=16/${item.gps.lat}/${item.gps.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      지도에서 확인 ↗
                    </a>
                  </p>
                ) : (
                  <p className="text-[#22C55E]">✓ GPS 위치정보 없음</p>
                )}
                {item.date && <p className="text-[#a0a0b0]">촬영: {item.date}</p>}
                {item.device && <p className="text-[#a0a0b0]">기기: {item.device}</p>}
                {!item.hasMeta && (
                  <p className="text-[#606070]">메타데이터가 없거나 이미 제거된 사진입니다</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => saveOne(item)}
                className="self-center shrink-0 text-xs font-semibold text-accent border border-[#2a3a5a] rounded-xl px-3 py-2 hover:border-accent"
              >
                지운 사본<br />저장
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={saveAll}
            disabled={busy}
            className="w-full py-3 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {busy
              ? "처리 중..."
              : items.length > 1
                ? `⬇️ 전체 ${items.length}장 정보 지워서 ZIP 저장`
                : "⬇️ 정보 지운 사본 저장"}
          </button>
        </div>
      )}
    </div>
  );
}
