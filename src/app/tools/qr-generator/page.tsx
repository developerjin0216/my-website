"use client";

import { useEffect, useState } from "react";

type Mode = "url" | "text" | "wifi" | "tel" | "sms";

const MODES: { key: Mode; label: string }[] = [
  { key: "url", label: "링크" },
  { key: "wifi", label: "와이파이" },
  { key: "tel", label: "전화" },
  { key: "sms", label: "문자" },
  { key: "text", label: "텍스트" },
];

// 와이파이 QR 표준 형식 — 특수문자는 이스케이프
const esc = (s: string) => s.replace(/([\\;,:"'])/g, "\\$1");

export default function QrGeneratorPage() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPw, setWifiPw] = useState("");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "nopass">("WPA");
  const [tel, setTel] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [png, setPng] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  const content =
    mode === "url"
      ? url.trim() && (url.startsWith("http") ? url.trim() : `https://${url.trim()}`)
      : mode === "text"
        ? text.trim()
        : mode === "wifi"
          ? ssid.trim() &&
            `WIFI:T:${wifiEnc === "nopass" ? "nopass" : "WPA"};S:${esc(ssid.trim())};${
              wifiEnc === "nopass" ? "" : `P:${esc(wifiPw)};`
            };`
          : mode === "tel"
            ? tel.trim() && `tel:${tel.replace(/[^\d+]/g, "")}`
            : tel.trim() &&
              `sms:${tel.replace(/[^\d+]/g, "")}${smsBody.trim() ? `?body=${encodeURIComponent(smsBody.trim())}` : ""}`;

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!content) {
        if (!cancelled) {
          setPng(null);
          setSvg(null);
        }
        return;
      }
      const QRCode = await import("qrcode");
      const opts = { errorCorrectionLevel: "M" as const, margin: 2, width: 640 };
      const [pngUrl, svgStr] = await Promise.all([
        QRCode.toDataURL(content, opts),
        QRCode.toString(content, { ...opts, type: "svg" }),
      ]);
      if (!cancelled) {
        setPng(pngUrl);
        setSvg(svgStr);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [content]);

  const saveSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const inputCls =
    "w-full bg-[#16213e] border border-[#2a3a5a] rounded-xl px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-5 gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`rounded-xl px-1 py-2 text-xs font-semibold border transition-colors ${
                mode === m.key
                  ? "bg-accent text-[#1a1a2e] border-accent"
                  : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "url" && (
          <input className={inputCls} placeholder="example.com 또는 https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
        )}
        {mode === "text" && (
          <textarea className={`${inputCls} h-24 resize-none`} placeholder="QR에 담을 텍스트" value={text} onChange={(e) => setText(e.target.value)} />
        )}
        {mode === "wifi" && (
          <div className="space-y-2">
            <input className={inputCls} placeholder="와이파이 이름 (SSID)" value={ssid} onChange={(e) => setSsid(e.target.value)} />
            {wifiEnc !== "nopass" && (
              <input className={inputCls} placeholder="비밀번호" value={wifiPw} onChange={(e) => setWifiPw(e.target.value)} />
            )}
            <label className="flex items-center gap-2 text-xs text-[#a0a0b0]">
              <input
                type="checkbox"
                checked={wifiEnc === "nopass"}
                onChange={(e) => setWifiEnc(e.target.checked ? "nopass" : "WPA")}
              />
              비밀번호 없는 개방 네트워크
            </label>
          </div>
        )}
        {(mode === "tel" || mode === "sms") && (
          <div className="space-y-2">
            <input className={inputCls} inputMode="tel" placeholder="010-1234-5678" value={tel} onChange={(e) => setTel(e.target.value)} />
            {mode === "sms" && (
              <input className={inputCls} placeholder="미리 채울 문자 내용 (선택)" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} />
            )}
          </div>
        )}
      </div>

      {png && (
        <div className="bg-card rounded-2xl p-5 text-center">
          <div className="bg-white rounded-2xl p-4 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={png} alt="생성된 QR코드" className="w-52 h-52" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <a
              href={png}
              download="qrcode.png"
              className="py-3 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform"
            >
              ⬇️ PNG 저장
            </a>
            <button
              type="button"
              onClick={saveSvg}
              className="py-3 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-accent text-sm font-bold active:scale-[0.98] transition-transform"
            >
              ⬇️ SVG (인쇄용)
            </button>
          </div>
          <p className="text-xs text-[#606070] mt-3">
            만료 없음 · 입력값은 서버로 전송되지 않습니다 · 휴대폰 카메라로
            지금 바로 스캔해 확인하세요
          </p>
        </div>
      )}
    </div>
  );
}
