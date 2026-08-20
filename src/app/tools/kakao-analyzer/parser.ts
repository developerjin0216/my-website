// 카카오톡 '대화 내보내기' 파서 + 통계 — 순수 함수 (안드로이드/iOS/PC txt/PC csv 자동 인식)

export interface Msg {
  author: string;
  ts: number; // epoch ms
  text: string;
}

const AMPM = (ampm: string, h: number) =>
  ampm === "오후" && h !== 12 ? h + 12 : ampm === "오전" && h === 12 ? 0 : h;

// 안드로이드: "2026년 8월 20일 오후 3:24, 홍길동 : 안녕"
const RE_ANDROID =
  /^(\d{4})년 (\d{1,2})월 (\d{1,2})일 (오전|오후) (\d{1,2}):(\d{2}), (.+?) : ([\s\S]*)$/;
// iOS: "2026. 8. 20. 오후 3:24, 홍길동 : 안녕"
const RE_IOS =
  /^(\d{4})\. (\d{1,2})\. (\d{1,2})\. (오전|오후) (\d{1,2}):(\d{2}), (.+?) : ([\s\S]*)$/;
// PC 날짜 구분선: "--------------- 2026년 8월 20일 목요일 ---------------"
const RE_PC_DATE = /^-+ (\d{4})년 (\d{1,2})월 (\d{1,2})일 .+?-+\s*$/;
// PC 메시지: "[홍길동] [오후 3:24] 안녕"
const RE_PC_MSG = /^\[(.+?)\] \[(오전|오후) (\d{1,2}):(\d{2})\] ([\s\S]*)$/;

// 시스템 메시지(입장·퇴장 등)는 author 패턴에 안 걸려 자연 제외됨

export function parseKakao(raw: string): Msg[] {
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/);
  const messages: Msg[] = [];

  // CSV (PC 내보내기): Date,User,Message
  if (/^"?Date"?\s*,\s*"?User"?\s*,\s*"?Message"?/i.test(lines[0] ?? "")) {
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length < 3) continue;
      const ts = Date.parse(cols[0].replace(/\./g, "-"));
      if (Number.isNaN(ts)) continue;
      messages.push({ author: cols[1], ts, text: cols.slice(2).join(",") });
    }
    return messages;
  }

  let pcDate: { y: number; mo: number; d: number } | null = null;

  for (const line of lines) {
    let m = line.match(RE_ANDROID) ?? line.match(RE_IOS);
    if (m) {
      const [, y, mo, d, ampm, h, min, author, text] = m;
      messages.push({
        author,
        ts: new Date(+y, +mo - 1, +d, AMPM(ampm, +h), +min).getTime(),
        text,
      });
      continue;
    }
    m = line.match(RE_PC_DATE);
    if (m) {
      pcDate = { y: +m[1], mo: +m[2], d: +m[3] };
      continue;
    }
    m = line.match(RE_PC_MSG);
    if (m && pcDate) {
      const [, author, ampm, h, min, text] = m;
      messages.push({
        author,
        ts: new Date(pcDate.y, pcDate.mo - 1, pcDate.d, AMPM(ampm, +h), +min).getTime(),
        text,
      });
      continue;
    }
    // 어떤 패턴에도 안 걸리면 직전 메시지의 연속 줄
    if (line.trim() && messages.length > 0) {
      messages[messages.length - 1].text += "\n" + line;
    }
  }
  return messages;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') inQ = false;
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

// ── 통계 ──

export interface AuthorStat {
  author: string;
  count: number;
  share: number; // 0~1
  medianReplyMin: number | null; // 답장 속도 중앙값(분)
  starts: number; // 선톡(새 대화 시작) 횟수
  laughs: number; // ㅋ 개수 합
}

export interface Analysis {
  total: number;
  authors: AuthorStat[];
  hours: number[]; // 24
  days: number[]; // 7 (일~토)
  topWords: { word: string; count: number }[];
  periodDays: number;
  firstTs: number;
  lastTs: number;
  chemistry: number | null; // 1:1일 때만 (0~100)
  nightRatio: number; // 0~6시 비율
}

const REPLY_CAP_MS = 6 * 60 * 60 * 1000; // 6시간 넘으면 새 대화로 간주
const NEW_CONVO_MS = 8 * 60 * 60 * 1000; // 8시간 공백 후 첫 메시지 = 선톡

const STOPWORDS = new Set([
  "사진", "이모티콘", "동영상", "삭제된", "메시지입니다.", "샵검색:", "지도:",
  "근데", "그리고", "그래서", "그럼", "진짜", "너무", "그냥", "저도", "나도",
  "이제", "오늘", "내일", "지금", "아니", "그거", "이거", "저거", "우리",
  "하는", "해서", "하고", "있는", "없는", "같은", "그게", "뭐야", "아냐",
]);

export function analyze(messages: Msg[]): Analysis {
  const byAuthor = new Map<
    string,
    { count: number; replies: number[]; starts: number; laughs: number }
  >();
  const hours = Array(24).fill(0);
  const days = Array(7).fill(0);
  const wordCount = new Map<string, number>();
  let night = 0;

  let prev: Msg | null = null;
  for (const m of messages) {
    const stat = byAuthor.get(m.author) ?? {
      count: 0,
      replies: [],
      starts: 0,
      laughs: 0,
    };
    stat.count++;
    stat.laughs += (m.text.match(/ㅋ/g) ?? []).length;

    const date = new Date(m.ts);
    hours[date.getHours()]++;
    days[date.getDay()]++;
    if (date.getHours() < 6) night++;

    if (!prev || m.ts - prev.ts >= NEW_CONVO_MS) {
      stat.starts++;
    } else if (prev.author !== m.author && m.ts - prev.ts < REPLY_CAP_MS) {
      stat.replies.push(m.ts - prev.ts);
    }

    // 단어 집계 (2자 이상, 불용어·URL 제외)
    for (const raw of m.text.split(/\s+/)) {
      const w = raw.replace(/[^\p{L}\p{N}ㄱ-ㅎ]/gu, "");
      if (w.length < 2 || w.length > 12) continue;
      if (STOPWORDS.has(w) || /^https?/.test(raw) || /^[ㅋㅎㅠㅜ]+$/.test(w)) continue;
      wordCount.set(w, (wordCount.get(w) ?? 0) + 1);
    }

    byAuthor.set(m.author, stat);
    prev = m;
  }

  const total = messages.length;
  const median = (arr: number[]): number | null => {
    if (arr.length === 0) return null;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)] / 60000;
  };

  const authors: AuthorStat[] = [...byAuthor.entries()]
    .map(([author, s]) => ({
      author,
      count: s.count,
      share: total > 0 ? s.count / total : 0,
      medianReplyMin: median(s.replies),
      starts: s.starts,
      laughs: s.laughs,
    }))
    .sort((a, b) => b.count - a.count);

  const topWords = [...wordCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const firstTs = messages[0]?.ts ?? 0;
  const lastTs = messages[messages.length - 1]?.ts ?? 0;
  const periodDays = Math.max(1, Math.round((lastTs - firstTs) / 86_400_000));

  // 케미 점수 (1:1만, 재미용): 대화량·선톡·답장속도 균형의 조합 → 55~99
  let chemistry: number | null = null;
  if (authors.length === 2) {
    const [a, b] = authors;
    const countBal = Math.min(a.count, b.count) / Math.max(a.count, b.count);
    const startBal =
      a.starts + b.starts > 0
        ? Math.min(a.starts, b.starts) / Math.max(a.starts, b.starts, 1)
        : 0.5;
    const ra = a.medianReplyMin ?? 60;
    const rb = b.medianReplyMin ?? 60;
    const replyBal = Math.min(ra, rb) / Math.max(ra, rb, 1);
    const speedBonus = Math.max(0, 1 - Math.min(ra, rb) / 120); // 둘 중 빠른 쪽이 2시간 이내면 가산
    const score =
      55 + countBal * 16 + startBal * 12 + replyBal * 8 + speedBonus * 8;
    chemistry = Math.min(99, Math.round(score));
  }

  return {
    total,
    authors,
    hours,
    days,
    topWords,
    periodDays,
    firstTs,
    lastTs,
    chemistry,
    nightRatio: total > 0 ? night / total : 0,
  };
}
