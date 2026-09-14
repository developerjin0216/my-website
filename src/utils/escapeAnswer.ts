// 방탈출 정답 대조 — 브라우저 Web Crypto(sha256)로 해시만 비교합니다.
//
// 정답을 평문으로 번들에 넣으면 소스 보기로 전부 읽히므로(방탈출은 정답이 곧
// 콘텐츠라 치명적) 해시만 둡니다. 다만 정답이 짧은 숫자면 무차별 대입에 약하므로
// 완전한 보호가 아니라 "우연히 스포일러를 당하지 않게 하는" 수준입니다.
//
// data/escape.ts의 answerHash를 만들 때 쓴 규칙과 반드시 동일해야 합니다:
//   sha256(salt + normalizeAnswer(정답))

/** 공백·구두점 차이와 영문 대소문자를 무시 (한글은 영향 없음) */
export function normalizeAnswer(raw: string): string {
  return raw.trim().toLowerCase().replace(/[\s\-_.]/g, "");
}

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkAnswer(
  input: string,
  salt: string,
  answerHash: string
): Promise<boolean> {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;
  try {
    return (await sha256Hex(salt + normalized)) === answerHash;
  } catch {
    // crypto.subtle은 보안 컨텍스트(HTTPS·localhost)에서만 동작합니다.
    // 실패 시 오답 처리 — 정답을 평문으로 되돌리는 폴백은 두지 않습니다.
    return false;
  }
}
