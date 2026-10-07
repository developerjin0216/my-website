// 한글 ↔ 영문 자판 변환 — 순수 함수.
//
// "안녕하세요"를 영타로 치면 "dkssudgktpdy", 반대로 영타 상태에서 한글을 치면
// 그 반대가 됩니다. 변환 자체는 자판 배열 대응표지만, 어려운 건 조합입니다.
// 한글은 초성·중성·종성을 하나의 음절로 합쳐야 하고, 겹받침(ㄳ ㄵ ㄶ …)과
// 겹모음(ㅘ ㅙ ㅚ …)은 두 자판을 눌러 만들어집니다. 많은 변환기가 여기서
// 틀립니다 — "없다"를 "djqtek"가 아니라 "djqstek"로 돌려주는 식입니다.

// ── 자판 대응 (두벌식 표준) ──
const EN_TO_KO: Record<string, string> = {
  q: "ㅂ", w: "ㅈ", e: "ㄷ", r: "ㄱ", t: "ㅅ", y: "ㅛ", u: "ㅕ", i: "ㅑ", o: "ㅐ", p: "ㅔ",
  a: "ㅁ", s: "ㄴ", d: "ㅇ", f: "ㄹ", g: "ㅎ", h: "ㅗ", j: "ㅓ", k: "ㅏ", l: "ㅣ",
  z: "ㅋ", x: "ㅌ", c: "ㅊ", v: "ㅍ", b: "ㅠ", n: "ㅜ", m: "ㅡ",
  Q: "ㅃ", W: "ㅉ", E: "ㄸ", R: "ㄲ", T: "ㅆ", Y: "ㅛ", U: "ㅕ", I: "ㅑ", O: "ㅒ", P: "ㅖ",
  A: "ㅁ", S: "ㄴ", D: "ㅇ", F: "ㄹ", G: "ㅎ", H: "ㅗ", J: "ㅓ", K: "ㅏ", L: "ㅣ",
  Z: "ㅋ", X: "ㅌ", C: "ㅊ", V: "ㅍ", B: "ㅠ", N: "ㅜ", M: "ㅡ",
};

// 역방향 — 대문자(ㅃㅉㄸㄲㅆㅒㅖ)가 소문자를 덮어쓰지 않도록 소문자를 우선합니다
const KO_TO_EN: Record<string, string> = {};
for (const [en, ko] of Object.entries(EN_TO_KO)) {
  if (!(ko in KO_TO_EN) || /[a-z]/.test(en)) KO_TO_EN[ko] = en;
}
// 쌍자음·이중모음은 대문자로만 입력되므로 명시적으로 고정
Object.assign(KO_TO_EN, {
  ㅃ: "Q", ㅉ: "W", ㄸ: "E", ㄲ: "R", ㅆ: "T", ㅒ: "O", ㅖ: "P",
});

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
const JONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ",
  "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ",
  "ㅌ", "ㅍ", "ㅎ",
];

// 두 자판을 눌러 만드는 글자 → 구성 요소
const JUNG_PAIR: Record<string, [string, string]> = {
  ㅘ: ["ㅗ", "ㅏ"], ㅙ: ["ㅗ", "ㅐ"], ㅚ: ["ㅗ", "ㅣ"],
  ㅝ: ["ㅜ", "ㅓ"], ㅞ: ["ㅜ", "ㅔ"], ㅟ: ["ㅜ", "ㅣ"], ㅢ: ["ㅡ", "ㅣ"],
};
const JONG_PAIR: Record<string, [string, string]> = {
  ㄳ: ["ㄱ", "ㅅ"], ㄵ: ["ㄴ", "ㅈ"], ㄶ: ["ㄴ", "ㅎ"], ㄺ: ["ㄹ", "ㄱ"],
  ㄻ: ["ㄹ", "ㅁ"], ㄼ: ["ㄹ", "ㅂ"], ㄽ: ["ㄹ", "ㅅ"], ㄾ: ["ㄹ", "ㅌ"],
  ㄿ: ["ㄹ", "ㅍ"], ㅀ: ["ㄹ", "ㅎ"], ㅄ: ["ㅂ", "ㅅ"],
};

const BASE = 0xac00;
const LAST = 0xd7a3;

/** 완성된 음절을 자판 입력 순서의 낱자 배열로 분해 */
function decompose(ch: string): string[] {
  const code = ch.charCodeAt(0);
  if (code < BASE || code > LAST) return [ch];
  const n = code - BASE;
  const cho = CHO[Math.floor(n / 588)];
  const jung = JUNG[Math.floor((n % 588) / 28)];
  const jong = JONG[n % 28];
  const out = [cho, ...(JUNG_PAIR[jung] ?? [jung])];
  if (jong) out.push(...(JONG_PAIR[jong] ?? [jong]));
  return out;
}

/** 한글 → 영타 */
export function koToEn(text: string): string {
  let out = "";
  for (const ch of text) {
    for (const j of decompose(ch)) out += KO_TO_EN[j] ?? j;
  }
  return out;
}

// ── 영타 → 한글 ──
// 낱자를 순서대로 받아 음절로 합칩니다. 받침이 될 수 있는 자음 뒤에 모음이
// 오면, 그 자음은 앞 음절의 받침이 아니라 다음 음절의 초성이 되어야 합니다
// ('안녕'의 ㄴ처럼). 이걸 처리하지 않으면 "dkssud"이 "않영"처럼 깨집니다.

const CHO_IDX = new Map(CHO.map((c, i) => [c, i] as const));
const JUNG_IDX = new Map(JUNG.map((c, i) => [c, i] as const));
const JONG_IDX = new Map(
  JONG.map((c, i) => [c, i] as const).filter(([c]) => c !== "")
);

const JUNG_COMBINE = new Map<string, string>();
for (const [pair, [a, b]] of Object.entries(JUNG_PAIR))
  JUNG_COMBINE.set(a + b, pair);
const JONG_COMBINE = new Map<string, string>();
for (const [pair, [a, b]] of Object.entries(JONG_PAIR))
  JONG_COMBINE.set(a + b, pair);

function compose(cho: string, jung: string, jong: string): string {
  return String.fromCharCode(
    BASE +
      (CHO_IDX.get(cho) ?? 0) * 588 +
      (JUNG_IDX.get(jung) ?? 0) * 28 +
      (jong ? (JONG_IDX.get(jong) ?? 0) : 0)
  );
}

/** 영타 → 한글 */
export function enToKo(text: string): string {
  let out = "";
  // 조립 중인 음절
  let cho = "";
  let jung = "";
  let jong = "";

  const flush = () => {
    if (cho && jung) out += compose(cho, jung, jong);
    else out += cho + jung + jong;
    cho = jung = jong = "";
  };

  for (const raw of text) {
    const j = EN_TO_KO[raw];
    if (!j) {
      flush();
      out += raw;
      continue;
    }
    const isVowel = JUNG_IDX.has(j);

    if (isVowel) {
      if (jong) {
        // 받침이 다음 글자의 초성으로 넘어갑니다 — 겹받침이면 뒤 하나만
        const pair = JONG_PAIR[jong];
        const moved = pair ? pair[1] : jong;
        if (pair) jong = pair[0];
        else jong = "";
        flush();
        cho = moved;
        jung = j;
      } else if (jung) {
        const merged = JUNG_COMBINE.get(jung + j);
        if (merged) jung = merged;
        else {
          flush();
          jung = j;
        }
      } else {
        jung = j;
      }
      continue;
    }

    // 자음
    if (!cho) {
      if (jung) {
        flush();
        cho = j;
      } else cho = j;
    } else if (!jung) {
      flush();
      cho = j;
    } else if (!jong) {
      if (JONG_IDX.has(j)) jong = j;
      else {
        flush();
        cho = j;
      }
    } else {
      const merged = JONG_COMBINE.get(jong + j);
      if (merged) jong = merged;
      else {
        flush();
        cho = j;
      }
    }
  }
  flush();
  return out;
}

/**
 * 어느 방향인지 추측. 한글 낱자·음절이 하나라도 있으면 한글→영문,
 * 그 밖에는 영문→한글로 봅니다.
 */
export function guessDirection(text: string): "koToEn" | "enToKo" {
  return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text) ? "koToEn" : "enToKo";
}
