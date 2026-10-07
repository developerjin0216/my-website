// 글자수·바이트 계산 — 순수 함수.
//
// 이 도구의 쓸모는 '숫자 하나'가 아니라 '기준별로 숫자가 다르다'를 한눈에 보여주는
// 데 있습니다. 자소서를 쓰는 사람이 막히는 지점이 정확히 거기입니다 — 공고에는
// "1000자 이내"라고만 적혀 있는데, 입력창이 공백을 세는지, 줄바꿈을 세는지,
// 바이트 제한이면 2바이트인지 3바이트인지에 따라 실제로 쓸 수 있는 분량이 달라집니다.

export interface CountResult {
  /** 눈에 보이는 글자 수 (자소서 입력창 기준) */
  charsWithSpace: number;
  charsNoSpace: number;
  /** 줄바꿈을 글자로 세지 않음 — 한글(HWP) 문서 통계 기준 */
  charsHwp: number;
  /** EUC-KR 계열. 기업 채용 시스템 대부분이 쓰는 기준 (한글 2바이트) */
  bytes2WithSpace: number;
  bytes2NoSpace: number;
  /** UTF-8 실제 인코딩 바이트 (한글 3바이트) */
  bytesUtf8: number;
  words: number;
  lines: number;
  sentences: number;
  /** 200자 원고지 매수 */
  manuscript: number;
  /** 눈에 보이는 글자 수와 코드포인트 수가 다른 경우 (이모지·조합형) */
  hasCombining: boolean;
}

// '눈에 보이는 글자' 단위로 쪼갭니다. [...str]는 코드포인트 단위라
// 👨‍👩‍👧 같은 결합 이모지나 조합형 한글을 여러 글자로 세어버립니다.
const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("ko", { granularity: "grapheme" })
    : null;

export function graphemes(text: string): string[] {
  if (!segmenter) return [...text];
  return [...segmenter.segment(text)].map((s) => s.segment);
}

const SPACE_RE = /\s/u;

/**
 * 한 글자의 바이트 수 (EUC-KR 계열 2바이트 기준).
 *
 * 기업 채용 시스템이 쓰는 방식입니다. ASCII는 1, 그 밖(한글·한자·전각)은 2로
 * 셉니다. EUC-KR로 표현되지 않는 문자(이모지 등)는 애초에 그 입력창에 들어가지
 * 않는 경우가 많아, 여기서는 2로 계산하고 화면에서 따로 안내합니다.
 */
function byte2(ch: string): number {
  const cp = ch.codePointAt(0) ?? 0;
  return cp < 0x80 ? 1 : 2;
}

const utf8 =
  typeof TextEncoder !== "undefined" ? new TextEncoder() : null;

export function count(text: string): CountResult {
  const g = graphemes(text);
  const noSpace = g.filter((c) => !SPACE_RE.test(c));
  const noNewline = g.filter((c) => c !== "\n" && c !== "\r");

  const sum2 = (arr: string[]) =>
    arr.reduce((n, ch) => n + [...ch].reduce((m, c) => m + byte2(c), 0), 0);

  const charsWithSpace = g.length;
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
  // 종결 부호로 끊되, 부호 뒤에 내용이 없으면 세지 않습니다
  const sentences = (text.match(/[^\s.!?。？！]+(?:[.!?。？！]+|$)/gu) ?? []).length;

  return {
    charsWithSpace,
    charsNoSpace: noSpace.length,
    charsHwp: noNewline.length,
    bytes2WithSpace: sum2(g),
    bytes2NoSpace: sum2(noSpace),
    bytesUtf8: utf8 ? utf8.encode(text).length : sum2(g),
    words,
    lines,
    sentences,
    manuscript: Math.ceil(charsWithSpace / 200),
    hasCombining: charsWithSpace !== [...text].length,
  };
}

/** 제한값까지 얼마나 남았는지 — 기준을 골라 쓰는 쪽 */
export type LimitBasis =
  | "charsWithSpace"
  | "charsNoSpace"
  | "bytes2WithSpace"
  | "bytes2NoSpace";

export const LIMIT_LABELS: Record<LimitBasis, string> = {
  charsWithSpace: "글자수 (공백 포함)",
  charsNoSpace: "글자수 (공백 제외)",
  bytes2WithSpace: "바이트 (공백 포함, 한글 2바이트)",
  bytes2NoSpace: "바이트 (공백 제외, 한글 2바이트)",
};

/**
 * 제한 안에 들어가도록 자른 텍스트. 기준 단위로 하나씩 더해보며 넘기 직전까지만
 * 남깁니다 — 바이트 기준일 때 한글이 중간에서 잘리지 않게 하려는 것입니다.
 */
export function truncateTo(
  text: string,
  limit: number,
  basis: LimitBasis
): string {
  if (limit <= 0) return "";
  const g = graphemes(text);
  let out = "";
  for (const ch of g) {
    const next = out + ch;
    if (count(next)[basis] > limit) break;
    out = next;
  }
  return out;
}
