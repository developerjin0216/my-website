"use client";

import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

const SPECS = [
  {
    key: "passport",
    label: "여권 (온라인 재발급)",
    w: 413,
    h: 531,
    note: "413×531px — 정부24·여권안내 온라인 신청용",
  },
  {
    key: "id34",
    label: "증명사진 3×4cm",
    w: 354,
    h: 472,
    note: "354×472px (300dpi) — 이력서·각종 서류용",
  },
  {
    key: "half",
    label: "반명함 2.5×3cm",
    w: 295,
    h: 354,
    note: "295×354px (300dpi)",
  },
] as const;

export default function PassportPhotoPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [spec, setSpec] = useState<(typeof SPECS)[number]>(SPECS[0]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = (file: File) => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const save = async () => {
    if (!imgUrl || !area) return;
    setBusy(true);
    try {
      const img = new Image();
      img.src = imgUrl;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = spec.w;
      canvas.height = spec.h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        area.x, area.y, area.width, area.height,
        0, 0, spec.w, spec.h
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("fail"))), "image/jpeg", 0.92)
      );
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `photo_${spec.w}x${spec.h}.jpg`;
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
        크롭과 저장이 전부 이 브라우저 안에서 이루어집니다.
      </div>

      {/* 규격 선택 */}
      <div className="grid grid-cols-3 gap-2">
        {SPECS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSpec(s)}
            className={`rounded-xl px-2 py-2.5 text-xs font-semibold border transition-colors ${
              spec.key === s.key
                ? "bg-accent text-[#1a1a2e] border-accent"
                : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#606070] -mt-2">{spec.note}</p>

      {!imgUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className="rounded-2xl border-2 border-dashed border-[#2a3a5a] bg-card hover:border-accent/60 p-10 text-center cursor-pointer transition-colors"
        >
          <p className="text-3xl mb-2">🪪</p>
          <p className="text-sm font-semibold">사진을 탭해서 선택하세요</p>
          <p className="text-xs text-[#606070] mt-1.5">
            흰 배경·정면 사진 (보정·필터 없이)
          </p>
        </div>
      ) : (
        <>
          {/* 크롭 영역 */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: `${spec.w}/${spec.h}`, maxHeight: 480 }}>
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              aspect={spec.w / spec.h}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, px) => setArea(px)}
              showGrid={false}
            />
            {/* 얼굴 가이드라인 — 여권: 머리가 세로 70~80% 차지 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 right-0 border-t border-dashed border-[#ffd700]/70" style={{ top: "8%" }} />
              <div className="absolute left-0 right-0 border-t border-dashed border-[#ffd700]/70" style={{ top: "84%" }} />
              <span className="absolute right-2 text-[10px] text-[#ffd700]" style={{ top: "8%" }}>정수리</span>
              <span className="absolute right-2 text-[10px] text-[#ffd700]" style={{ top: "84%" }}>턱</span>
              <div className="absolute top-0 bottom-0 border-l border-dashed border-white/25" style={{ left: "50%" }} />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-4 space-y-3">
            <label className="block text-xs text-[#a0a0b0]">
              확대/축소
              <input
                type="range"
                min={1}
                max={3}
                step={0.02}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full mt-1 accent-[#ffd700]"
              />
            </label>
            <p className="text-xs text-[#606070]">
              드래그로 위치를 옮겨 <strong className="text-[#e8e8f0]">정수리와 턱을 노란 점선 사이</strong>에 맞추세요.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="py-3 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-[#a0a0b0] text-sm font-semibold"
              >
                다른 사진 선택
              </button>
              <button
                type="button"
                onClick={save}
                disabled={busy}
                className="py-3 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {busy ? "저장 중..." : `⬇️ ${spec.w}×${spec.h} 저장`}
              </button>
            </div>
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}
