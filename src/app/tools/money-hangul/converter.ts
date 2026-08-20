// 숫자 금액 → 한글 표기 3종 (계약서·갖은자·읽기) — 순수 함수

const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const DIGITS_GAJEUN = ["", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
const SMALL = ["", "십", "백", "천"];
const SMALL_GAJEUN = ["", "拾", "佰", "仟"];
const BIG = ["", "만", "억", "조", "경"];
const BIG_GAJEUN = ["", "萬", "億", "兆", "京"];

// 4자리 그룹 하나를 읽음. explicitOne=true면 '일십·일백·일천'의 '일'을 살림(위변조 방지 표기)
function readGroup(
  n: number,
  digits: string[],
  small: string[],
  explicitOne: boolean
): string {
  let out = "";
  for (let pos = 3; pos >= 0; pos--) {
    const d = Math.floor(n / 10 ** pos) % 10;
    if (d === 0) continue;
    const digit = d === 1 && pos > 0 && !explicitOne ? "" : digits[d];
    out += digit + small[pos];
  }
  return out;
}

function convert(
  amount: number,
  digits: string[],
  small: string[],
  big: string[],
  explicitOne: boolean
): string {
  if (amount === 0) return digits[0] || "영";
  let out = "";
  let groupIdx = 0;
  while (amount > 0) {
    const group = amount % 10000;
    if (group > 0) {
      out = readGroup(group, digits, small, explicitOne) + big[groupIdx] + out;
    }
    amount = Math.floor(amount / 10000);
    groupIdx++;
  }
  return out;
}

export interface MoneyHangul {
  contract: string; // 일금오백만원정
  gajeun: string; // 金伍佰萬원整
  reading: string; // 오백만 원
}

export function toHangul(amount: number): MoneyHangul {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 9_999_999_999_999_999) {
    return { contract: "", gajeun: "", reading: "" };
  }
  const contractBody = convert(amount, DIGITS, SMALL, BIG, true);
  const gajeunBody = convert(amount, DIGITS_GAJEUN, SMALL_GAJEUN, BIG_GAJEUN, true);
  // 읽기용: 자연스러운 표기 (일십→십), 만·억 단위 뒤 띄어쓰기
  // 선두의 '일만'은 '만'으로 (만 오천 원) — 단 일억·일조는 '일'을 유지
  const readingBody = convert(amount, DIGITS, SMALL, BIG, false)
    .replace(/^일만/, "만")
    .replace(/(경|조|억|만)/g, "$1 ")
    .trim();

  return {
    contract: `일금${contractBody}원정`,
    gajeun: `金${gajeunBody}원整`,
    reading: `${readingBody} 원`,
  };
}
