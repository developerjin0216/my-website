"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  collectPeople,
  type Person,
} from "../insta-follow-check/parser";

// 인스타 내보내기 ZIP의 '숨은 기록' 카테고리 — 파일명 키워드로 분류
const CATEGORIES = [
  { key: "blocked", label: "내가 차단한 계정", icon: "🚫", match: ["blocked"] },
  { key: "hideStory", label: "스토리 숨김 대상", icon: "🙈", match: ["hide_story"] },
  { key: "pendingSent", label: "수락 안 된 팔로우 요청", icon: "⏳", match: ["pending_follow_requests"] },
  { key: "recentUnfollow", label: "최근 언팔한 계정", icon: "👋", match: ["recently_unfollowed"] },
  { key: "closeFriends", label: "친한 친구", icon: "💚", match: ["close_friends"] },
] as const;

type CatKey = (typeof CATEGORIES)[number]["key"];
type Result = Record<CatKey, Person[]>;

function dedupe(list: Person[]): Person[] {
  const seen = new Map<string, Person>();
  for (const p of list) {
    const k = p.username.toLowerCase();
    if (!seen.has(k)) seen.set(k, p);
  }
  return [...seen.values()];
}

async function analyzeFiles(files: File[]): Promise<Result | null> {
  const texts: { name: string; text: string }[] = [];
  for (const file of files) {
    if (file.name.toLowerCase().endsWith(".zip")) {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(file);
      for (const entry of Object.values(zip.files)) {
        if (entry.dir || !entry.name.toLowerCase().endsWith(".json")) continue;
        const base = entry.name.split("/").pop()?.toLowerCase() ?? "";
        if (CATEGORIES.some((c) => c.match.some((m) => base.includes(m)))) {
          texts.push({ name: base, text: await entry.async("text") });
        }
      }
    } else if (file.name.toLowerCase().endsWith(".json")) {
      texts.push({ name: file.name.toLowerCase(), text: await file.text() });
    }
  }

  const result = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, [] as Person[]])
  ) as Result;
  let found = false;
  for (const { name, text } of texts) {
    const cat = CATEGORIES.find((c) => c.match.some((m) => name.includes(m)));
    if (!cat) continue;
    try {
      const json = JSON.parse(text);
      const before = result[cat.key].length;
      collectPeople(json, result[cat.key]);
      if (result[cat.key].length > before) found = true;
    } catch {
      /* 손상 파일 무시 */
    }
  }
  if (!found && texts.length === 0) return null;
  for (const c of CATEGORIES) result[c.key] = dedupe(result[c.key]);
  return result;
}

export default function InstaHiddenPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [open, setOpen] = useState<CatKey>("blocked");

  const handleFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    setError(null);
    try {
      const r = await analyzeFiles([...fileList]);
      if (!r) {
        setError(
          "관련 파일을 찾지 못했습니다. '내 정보 다운로드' ZIP(JSON 형식, 연결 활동 포함)을 그대로 올렸는지 확인해 주세요."
        );
        setResult(null);
      } else {
        setResult(r);
        const firstWithData = CATEGORIES.find((c) => r[c.key].length > 0);
        if (firstWithData) setOpen(firstWithData.key);
      }
    } catch {
      setError("파일을 읽는 중 오류가 났습니다. 원본 ZIP인지 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">파일은 서버로 전송되지 않습니다.</strong>{" "}
        <Link href="/tools/insta-follow-check" className="text-accent underline">
          맞팔 확인
        </Link>
        에 쓴 것과 같은 ZIP을 그대로 사용하면 됩니다.
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-accent bg-accent/5"
            : "border-[#2a3a5a] bg-card hover:border-accent/60"
        }`}
      >
        <p className="text-3xl mb-2">🕵️</p>
        <p className="text-sm font-semibold">
          {busy ? "분석 중..." : "인스타 내보내기 ZIP을 여기에 놓거나 탭해서 선택"}
        </p>
        <p className="text-xs text-[#606070] mt-1.5">
          instagram-사용자명-….zip 그대로 올리면 됩니다
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

      {result && (
        <div className="space-y-2.5">
          {CATEGORIES.map((c) => {
            const list = result[c.key];
            const isOpen = open === c.key;
            return (
              <div key={c.key} className="bg-card rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(c.key)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold">
                    {c.icon} {c.label}
                  </span>
                  <span
                    className={`text-base font-bold ${list.length > 0 ? "text-accent" : "text-[#606070]"}`}
                  >
                    {list.length.toLocaleString()}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    {list.length === 0 ? (
                      <p className="text-xs text-[#606070] pb-1">
                        기록이 없습니다 (내보내기에 이 항목이 없거나 0건)
                      </p>
                    ) : (
                      <ul className="max-h-72 overflow-y-auto divide-y divide-[#2a3a5a]/60">
                        {list.map((p) => (
                          <li key={p.username}>
                            <a
                              href={p.href || `https://www.instagram.com/${p.username}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between py-2 text-sm hover:text-accent"
                            >
                              <span>@{p.username}</span>
                              <span className="text-xs text-[#606070]">프로필 ↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <p className="text-xs text-[#606070]">
            ※ &ldquo;나를 차단한 사람&rdquo;은 인스타그램이 제공하지 않는
            정보라 어떤 도구로도 확인할 수 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
