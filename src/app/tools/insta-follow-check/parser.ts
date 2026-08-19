// 인스타그램·쓰레드 '내 정보 다운로드' 파일 파서 — 순수 함수 (브라우저 전용 API 미사용)
// 두 서비스 모두 팔로워/팔로잉을 string_list_data 구조로 내보내므로 파서 하나로 겸용:
//   followers_1.json: [{ string_list_data: [{ href, value: "username", timestamp }] }, ...]
//   following.json:   { relationships_following: [ 같은 구조 ] }

export interface Person {
  username: string;
  href: string;
}

export interface ParseResult {
  followers: Person[];
  following: Person[];
  filesUsed: string[]; // 어떤 파일을 인식했는지 (사용자 확인용)
}

// string_list_data 항목을 재귀적으로 수집 — 내보내기 포맷의 소소한 변형에 견디게
function collectPeople(node: unknown, out: Person[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectPeople(item, out);
    return;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const sld = obj.string_list_data;
    if (Array.isArray(sld)) {
      for (const entry of sld) {
        if (entry && typeof entry === "object") {
          const e = entry as Record<string, unknown>;
          if (typeof e.value === "string" && e.value.length > 0) {
            out.push({
              username: e.value,
              href: typeof e.href === "string" ? e.href : "",
            });
          }
        }
      }
      return;
    }
    for (const v of Object.values(obj)) collectPeople(v, out);
  }
}

// 파일명으로 팔로워/팔로잉 구분 — 무관 파일(최근 언팔, 요청 대기 등)은 제외
const EXCLUDE = [
  "unfollowed",
  "follow_requests",
  "pending",
  "restricted",
  "blocked",
  "close_friends",
  "hide_story",
  "removed",
  "dismissed",
  "favorited",
];

export function classifyFile(path: string): "followers" | "following" | null {
  const base = path.split("/").pop()?.toLowerCase() ?? "";
  if (!base.endsWith(".json")) return null;
  if (EXCLUDE.some((k) => base.includes(k))) return null;
  // 'following'이 'follower'보다 먼저 — following.json에는 'follow'가 포함되므로 순서 중요
  if (base.includes("following")) return "following";
  if (base.includes("follower")) return "followers";
  return null;
}

function dedupe(list: Person[]): Person[] {
  const seen = new Map<string, Person>();
  for (const p of list) {
    const key = p.username.toLowerCase();
    if (!seen.has(key)) seen.set(key, p);
  }
  return [...seen.values()];
}

// (파일명, JSON 텍스트) 목록 → 팔로워/팔로잉 명단
export function parseExportFiles(
  files: { name: string; text: string }[]
): ParseResult {
  const followers: Person[] = [];
  const following: Person[] = [];
  const filesUsed: string[] = [];

  for (const file of files) {
    const kind = classifyFile(file.name);
    if (!kind) continue;
    let json: unknown;
    try {
      json = JSON.parse(file.text);
    } catch {
      continue; // 손상된 파일은 건너뜀
    }
    const before = kind === "followers" ? followers.length : following.length;
    collectPeople(json, kind === "followers" ? followers : following);
    const after = kind === "followers" ? followers.length : following.length;
    if (after > before) filesUsed.push(file.name.split("/").pop() ?? file.name);
  }

  return {
    followers: dedupe(followers),
    following: dedupe(following),
    filesUsed,
  };
}

export interface Comparison {
  notFollowingMeBack: Person[]; // 나는 팔로우, 상대는 안 함
  notFollowedByMe: Person[]; // 상대는 팔로우, 나는 안 함
  mutual: Person[];
}

export function compare(followers: Person[], following: Person[]): Comparison {
  const followerSet = new Set(followers.map((p) => p.username.toLowerCase()));
  const followingSet = new Set(following.map((p) => p.username.toLowerCase()));
  return {
    notFollowingMeBack: following.filter(
      (p) => !followerSet.has(p.username.toLowerCase())
    ),
    notFollowedByMe: followers.filter(
      (p) => !followingSet.has(p.username.toLowerCase())
    ),
    mutual: following.filter((p) =>
      followerSet.has(p.username.toLowerCase())
    ),
  };
}

export function toCsv(list: Person[]): string {
  const rows = list.map((p) => `${p.username},${p.href}`);
  return "username,profile_url\n" + rows.join("\n");
}
