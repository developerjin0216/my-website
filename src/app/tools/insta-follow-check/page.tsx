"use client";

import { useRef, useState } from "react";
import {
  parseExportFiles,
  compare,
  toCsv,
  type Comparison,
  type Person,
} from "./parser";

type Tab = "notBack" | "notMine" | "mutual";

interface Analysis {
  followers: number;
  following: number;
  filesUsed: string[];
  result: Comparison;
}

// ZIP이면 jszip(동적 import)으로 풀고, JSON이면 그대로 — (파일명, 텍스트) 목록으로 정규화
async function readInputFiles(
  files: File[]
): Promise<{ name: string; text: string }[]> {
  const out: { name: string; text: string }[] = [];
  for (const file of files) {
    if (file.name.toLowerCase().endsWith(".zip")) {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(file);
      for (const entry of Object.values(zip.files)) {
        if (entry.dir || !entry.name.toLowerCase().endsWith(".json")) continue;
        // 팔로워 파일만 골라 읽으면 수십 MB짜리 전체 내보내기 ZIP도 빠르게 처리됨
        const base = entry.name.split("/").pop()?.toLowerCase() ?? "";
        if (!base.includes("follow")) continue;
        out.push({ name: entry.name, text: await entry.async("text") });
      }
    } else if (file.name.toLowerCase().endsWith(".json")) {
      out.push({ name: file.name, text: await file.text() });
    }
  }
  return out;
}

const TABS: { key: Tab; label: string; desc: string }[] = [
  { key: "notBack", label: "나를 팔로우 안 함", desc: "내가 팔로우하지만 나를 팔로우하지 않는 계정" },
  { key: "notMine", label: "내가 팔로우 안 함", desc: "나를 팔로우하지만 내가 팔로우하지 않는 계정" },
  { key: "mutual", label: "맞팔", desc: "서로 팔로우 중인 계정" },
];

export default function InstaFollowCheckPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [tab, setTab] = useState<Tab>("notBack");

  const handleFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    setError(null);
    try {
      const files = [...fileList];
      const parsed = parseExportFiles(await readInputFiles(files));
      if (parsed.followers.length === 0 && parsed.following.length === 0) {
        setError(
          "팔로워/팔로잉 파일을 찾지 못했습니다. '내 정보 다운로드'를 JSON 형식으로 신청했는지, ZIP 파일(또는 followers_1.json·following.json)을 올렸는지 확인해 주세요."
        );
        setAnalysis(null);
        return;
      }
      if (parsed.followers.length === 0 || parsed.following.length === 0) {
        setError(
          `${parsed.followers.length === 0 ? "팔로워" : "팔로잉"} 파일이 없습니다. 내보내기 신청 시 '팔로워 및 팔로잉' 항목을 선택했는지 확인해 주세요. (인식된 파일: ${parsed.filesUsed.join(", ") || "없음"})`
        );
        setAnalysis(null);
        return;
      }
      setAnalysis({
        followers: parsed.followers.length,
        following: parsed.following.length,
        filesUsed: parsed.filesUsed,
        result: compare(parsed.followers, parsed.following),
      });
      setTab("notBack");
    } catch {
      setError("파일을 읽는 중 오류가 났습니다. 손상되지 않은 원본 ZIP인지 확인해 주세요.");
      setAnalysis(null);
    } finally {
      setBusy(false);
    }
  };

  const downloadCsv = (list: Person[], name: string) => {
    const blob = new Blob(["﻿" + toCsv(list)], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const activeList: Person[] = analysis
    ? tab === "notBack"
      ? analysis.result.notFollowingMeBack
      : tab === "notMine"
        ? analysis.result.notFollowedByMe
        : analysis.result.mutual
    : [];

  return (
    <div className="space-y-4">
      {/* 개인정보 안내 배너 */}
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">파일은 서버로 전송되지 않습니다.</strong>{" "}
        분석은 지금 이 브라우저 안에서만 실행되고, 페이지를 닫으면 사라집니다.
        로그인·비밀번호도 필요 없습니다.
      </div>

      {/* 드롭존 */}
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
        <p className="text-3xl mb-2">📂</p>
        <p className="text-sm font-semibold">
          {busy ? "분석 중..." : "내보내기 ZIP 파일을 여기에 놓거나 탭해서 선택"}
        </p>
        <p className="text-xs text-[#606070] mt-1.5">
          instagram-사용자명-….zip 그대로 또는 followers_1.json + following.json
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

      {analysis && (
        <div className="bg-card rounded-2xl p-5">
          <div className="flex justify-around text-center mb-4">
            <div>
              <p className="text-xl font-bold text-accent">{analysis.followers.toLocaleString()}</p>
              <p className="text-xs text-[#a0a0b0]">팔로워</p>
            </div>
            <div>
              <p className="text-xl font-bold text-accent">{analysis.following.toLocaleString()}</p>
              <p className="text-xs text-[#a0a0b0]">팔로잉</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#22C55E]">{analysis.result.mutual.length.toLocaleString()}</p>
              <p className="text-xs text-[#a0a0b0]">맞팔</p>
            </div>
          </div>

          {/* 탭 */}
          <div className="grid grid-cols-3 gap-2 mb-1">
            {TABS.map((t) => {
              const count =
                t.key === "notBack"
                  ? analysis.result.notFollowingMeBack.length
                  : t.key === "notMine"
                    ? analysis.result.notFollowedByMe.length
                    : analysis.result.mutual.length;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`rounded-xl px-1 py-2.5 text-xs font-semibold border transition-colors ${
                    tab === t.key
                      ? "bg-accent text-[#1a1a2e] border-accent"
                      : "bg-[#16213e] text-[#a0a0b0] border-[#2a3a5a]"
                  }`}
                >
                  {t.label}
                  <span className="block text-sm font-bold mt-0.5">{count.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#606070] mb-3">
            {TABS.find((t) => t.key === tab)?.desc}
          </p>

          {/* 목록 */}
          {activeList.length === 0 ? (
            <p className="text-sm text-[#a0a0b0] text-center py-6">
              해당하는 계정이 없습니다 🎉
            </p>
          ) : (
            <>
              <ul className="max-h-96 overflow-y-auto divide-y divide-[#2a3a5a]/60">
                {activeList.map((p) => (
                  <li key={p.username}>
                    <a
                      href={p.href || `https://www.instagram.com/${p.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2.5 text-sm hover:text-accent"
                    >
                      <span>@{p.username}</span>
                      <span className="text-xs text-[#606070]">프로필 열기 ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  downloadCsv(activeList, `insta-${tab}-${activeList.length}`)
                }
                className="w-full mt-3 py-2.5 rounded-xl bg-[#16213e] border border-[#2a3a5a] text-sm font-semibold text-accent hover:border-accent transition-colors"
              >
                ⬇️ 이 목록 CSV로 저장 ({activeList.length.toLocaleString()}개)
              </button>
            </>
          )}
          <p className="text-xs text-[#606070] mt-3">
            인식된 파일: {analysis.filesUsed.join(", ")} · 내보내기 신청 시점
            기준 스냅샷입니다.
          </p>
        </div>
      )}
    </div>
  );
}
