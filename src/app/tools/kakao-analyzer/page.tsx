"use client";

import { useRef, useState } from "react";
import { parseKakao, analyze, type Analysis } from "./parser";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function fmtReply(min: number | null): string {
  if (min === null) return "-";
  if (min < 1) return "1분 이내";
  if (min < 60) return `${Math.round(min)}분`;
  return `${(min / 60).toFixed(1)}시간`;
}

// 케미 카드 PNG를 캔버스로 생성 — 서버 OG 대신 클라이언트 생성(민감 데이터 URL 노출 방지)
function drawShareCard(a: Analysis): string {
  const c = document.createElement("canvas");
  c.width = 800;
  c.height = 800;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, 800, 800);
  ctx.textAlign = "center";
  ctx.fillStyle = "#a0a0b0";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText("카톡 케미 분석", 400, 110);
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 170px sans-serif";
  ctx.fillText(`${a.chemistry}%`, 400, 330);
  ctx.fillStyle = "#e8e8f0";
  ctx.font = "bold 40px sans-serif";
  const names = a.authors.map((s) => s.author).join(" ♥ ");
  ctx.fillText(names.length > 18 ? names.slice(0, 18) + "…" : names, 400, 420);
  ctx.fillStyle = "#c0c8d8";
  ctx.font = "28px sans-serif";
  ctx.fillText(
    `${a.periodDays}일간 ${a.total.toLocaleString()}개의 메시지`,
    400,
    490
  );
  const fast = a.authors.reduce((p, s) =>
    (s.medianReplyMin ?? 999) < (p.medianReplyMin ?? 999) ? s : p
  );
  ctx.fillText(
    `답장 빠른 사람: ${fast.author} (${fmtReply(fast.medianReplyMin)})`,
    400,
    540
  );
  ctx.fillStyle = "#606070";
  ctx.font = "24px sans-serif";
  ctx.fillText("tools.8282114.xyz · 대화는 서버로 전송되지 않아요", 400, 720);
  return c.toDataURL("image/png");
}

export default function KakaoAnalyzerPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    setBusy(true);
    setError(null);
    try {
      const file = [...fileList].find((f) =>
        /\.(txt|csv)$/i.test(f.name)
      );
      if (!file) {
        setError("카톡 대화 내보내기 .txt 또는 .csv 파일을 올려주세요.");
        return;
      }
      const messages = parseKakao(await file.text());
      if (messages.length < 10) {
        setError(
          "대화를 인식하지 못했습니다. 카카오톡의 '대화 내용 내보내기(텍스트만)'로 저장한 원본 파일인지 확인해 주세요."
        );
        setResult(null);
        return;
      }
      setResult(analyze(messages));
    } catch {
      setError("파일을 읽는 중 오류가 났습니다.");
    } finally {
      setBusy(false);
    }
  };

  const saveCard = () => {
    if (!result?.chemistry) return;
    const a = document.createElement("a");
    a.href = drawShareCard(result);
    a.download = "kakao-chemistry.png";
    a.click();
  };

  const maxHour = result ? Math.max(...result.hours, 1) : 1;

  return (
    <div className="space-y-4">
      <div className="bg-[#16213e] border border-[#2a3a5a] rounded-2xl px-4 py-3 text-xs text-[#a0a0b0] leading-relaxed">
        🔒 <strong className="text-[#e8e8f0]">대화 내용은 서버로 전송되지
        않습니다.</strong> 분석은 이 브라우저 안에서만 실행되고, 페이지를 닫으면
        사라집니다.
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
        <p className="text-3xl mb-2">💬</p>
        <p className="text-sm font-semibold">
          {busy ? "분석 중..." : "카톡 대화 파일(.txt/.csv)을 여기에 놓거나 탭해서 선택"}
        </p>
        <p className="text-xs text-[#606070] mt-1.5">
          안드로이드·아이폰·PC 내보내기 형식 자동 인식
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.csv,text/plain,text/csv"
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
        <>
          {/* 케미 카드 (1:1) */}
          {result.chemistry !== null && (
            <div className="bg-card rounded-2xl p-6 text-center">
              <p className="text-sm text-[#a0a0b0]">두 사람의 케미</p>
              <p className="text-6xl font-bold text-accent my-2">
                {result.chemistry}%
              </p>
              <p className="text-xs text-[#606070] mb-3">
                대화량·선톡·답장속도 균형 기반 재미용 점수입니다
              </p>
              <button
                type="button"
                onClick={saveCard}
                className="w-full py-2.5 rounded-xl bg-accent text-[#1a1a2e] text-sm font-bold active:scale-[0.98] transition-transform"
              >
                📤 케미 카드 이미지 저장 (공유용)
              </button>
            </div>
          )}

          {/* 요약 */}
          <div className="bg-card rounded-2xl p-5">
            <div className="flex justify-around text-center mb-1">
              <div>
                <p className="text-xl font-bold text-accent">
                  {result.total.toLocaleString()}
                </p>
                <p className="text-xs text-[#a0a0b0]">메시지</p>
              </div>
              <div>
                <p className="text-xl font-bold text-accent">{result.periodDays.toLocaleString()}일</p>
                <p className="text-xs text-[#a0a0b0]">기간</p>
              </div>
              <div>
                <p className="text-xl font-bold text-accent">
                  {Math.round(result.nightRatio * 100)}%
                </p>
                <p className="text-xs text-[#a0a0b0]">새벽(0~6시) 대화</p>
              </div>
            </div>
          </div>

          {/* 참여자별 */}
          <div className="bg-card rounded-2xl p-5">
            <h2 className="text-sm font-bold text-accent mb-3">
              누가 어떻게 말했나
            </h2>
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
                    · ㅋ {s.laughs.toLocaleString()}개
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 시간대 */}
          <div className="bg-card rounded-2xl p-5">
            <h2 className="text-sm font-bold text-accent mb-3">시간대 패턴</h2>
            <div className="flex items-end gap-[2px] h-20">
              {result.hours.map((v, h) => (
                <div
                  key={h}
                  className="flex-1 bg-accent/70 rounded-t"
                  style={{ height: `${Math.max(3, (v / maxHour) * 100)}%` }}
                  title={`${h}시: ${v}개`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#606070] mt-1">
              <span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>23시</span>
            </div>
            <p className="text-xs text-[#606070] mt-2">
              요일: {result.days
                .map((v, i) => ({ v, i }))
                .sort((a, b) => b.v - a.v)
                .slice(0, 2)
                .map(({ i }) => `${DAY_LABELS[i]}요일`)
                .join(" · ")}에 가장 활발
            </p>
          </div>

          {/* 많이 쓴 단어 */}
          {result.topWords.length > 0 && (
            <div className="bg-card rounded-2xl p-5">
              <h2 className="text-sm font-bold text-accent mb-3">많이 쓴 단어</h2>
              <div className="flex flex-wrap gap-2">
                {result.topWords.map((w) => (
                  <span
                    key={w.word}
                    className="text-xs bg-[#16213e] border border-[#2a3a5a] rounded-full px-3 py-1.5"
                  >
                    {w.word}{" "}
                    <span className="text-[#606070]">{w.count.toLocaleString()}</span>
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
