// 인스타그램 내보내기 messages/inbox JSON 파서 — 순수 함수
// 함정: 인스타 JSON은 비ASCII를 latin-1 이중 인코딩으로 저장(ì... 모지바케)
// → 문자열을 latin-1 바이트로 되돌린 뒤 UTF-8로 재디코딩해야 한글이 복원됨

import type { Msg } from "../kakao-analyzer/parser";

export function fixMojibake(s: string): string {
  // 이미 정상 문자(한글 등 코드포인트 >255)가 있으면 손대지 않음
  if (/[Ā-￿]/.test(s)) return s;
  // 순수 ASCII면 변환 불필요
  if (!/[-ÿ]/.test(s)) return s;
  try {
    const bytes = Uint8Array.from(s, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return s; // UTF-8로 해석 불가한 진짜 latin-1 텍스트는 원본 유지
  }
}

interface RawMessage {
  sender_name?: string;
  timestamp_ms?: number;
  content?: string;
  photos?: unknown[];
  share?: unknown;
}

interface RawThread {
  participants?: { name?: string }[];
  messages?: RawMessage[];
}

export interface DmThread {
  key: string; // 폴더 경로
  title: string; // 참여자 이름들
  participants: string[];
  messages: Msg[]; // 시간 오름차순
}

// (경로, JSON 텍스트) 목록 → 스레드별 병합 (message_1.json, message_2.json … 합침)
export function parseDmFiles(
  files: { path: string; text: string }[]
): DmThread[] {
  const byThread = new Map<string, { participants: Set<string>; messages: Msg[] }>();

  for (const file of files) {
    // .../messages/inbox/<thread>/message_N.json → thread 키 추출
    const m = file.path.match(/messages\/[^/]*inbox\/([^/]+)\/message_\d+\.json$/i);
    if (!m) continue;
    let json: RawThread;
    try {
      json = JSON.parse(file.text);
    } catch {
      continue;
    }
    const entry =
      byThread.get(m[1]) ?? { participants: new Set<string>(), messages: [] };
    for (const p of json.participants ?? []) {
      if (p.name) entry.participants.add(fixMojibake(p.name));
    }
    for (const raw of json.messages ?? []) {
      if (!raw.sender_name || !raw.timestamp_ms) continue;
      // 좋아요 반응·빈 메시지는 제외, 사진·공유는 텍스트 없는 메시지로 집계
      const content = raw.content ? fixMojibake(raw.content) : "";
      // 시스템 문구(영문 액션 메시지) 걸러내기: 릴스 공유 안내 등은 텍스트 분석에서 자연 제외됨
      entry.messages.push({
        author: fixMojibake(raw.sender_name),
        ts: raw.timestamp_ms,
        text: content,
      });
    }
    byThread.set(m[1], entry);
  }

  return [...byThread.entries()]
    .map(([key, v]) => ({
      key,
      title: [...v.participants].join(", ") || key,
      participants: [...v.participants],
      messages: v.messages.sort((a, b) => a.ts - b.ts),
    }))
    .filter((t) => t.messages.length >= 10)
    .sort((a, b) => b.messages.length - a.messages.length);
}
