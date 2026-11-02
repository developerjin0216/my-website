import { parseExportFiles, compare, diffFollowers, latestTimestamp } from "../src/app/tools/insta-follow-check/parser.ts";

const mk = (names: [string, number][]) => JSON.stringify(
  names.map(([n, t]) => ({ string_list_data: [{ href: `https://instagram.com/${n}`, value: n, timestamp: t }] }))
);
const mkFollowing = (names: [string, number][]) => JSON.stringify({
  relationships_following: names.map(([n, t]) => ({ string_list_data: [{ href: "", value: n, timestamp: t }] })),
});

let pass = 0, fail = 0;
const eq = (label: string, got: unknown, want: unknown) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; } else { fail++; console.log(`✗ ${label}\n   got  ${g}\n   want ${w}`); }
};

// 1) 기본 파싱 + 맞팔 비교
const cur = parseExportFiles([
  { name: "connections/followers_1.json", text: mk([["alice", 100], ["bob", 200], ["carol", 300]]) },
  { name: "connections/following.json", text: mkFollowing([["bob", 150], ["dave", 250]]) },
]);
eq("팔로워 3명", cur.followers.map(p => p.username), ["alice", "bob", "carol"]);
eq("팔로잉 2명", cur.following.map(p => p.username), ["bob", "dave"]);
const c = compare(cur.followers, cur.following);
eq("맞팔", c.mutual.map(p => p.username), ["bob"]);
eq("내가 팔로우하는데 안 받아줌", c.notFollowingMeBack.map(p => p.username), ["dave"]);
eq("나를 팔로우하는데 내가 안 함", c.notFollowedByMe.map(p => p.username), ["alice", "carol"]);

// 2) 제외 파일은 무시
const excl = parseExportFiles([
  { name: "connections/recently_unfollowed_accounts.json", text: mk([["zed", 1]]) },
  { name: "connections/pending_follow_requests.json", text: mk([["pend", 1]]) },
  { name: "connections/followers_1.json", text: mk([["alice", 100]]) },
]);
eq("제외 파일 무시", excl.followers.map(p => p.username), ["alice"]);
eq("인식 파일 하나", excl.filesUsed, ["followers_1.json"]);

// 3) HTML·깨진 JSON
const bad = parseExportFiles([
  { name: "followers_1.html", text: "<html>" },
  { name: "followers_2.json", text: "{ broken" },
  { name: "followers_1.json", text: mk([["ok", 1]]) },
]);
eq("html·깨진 json 건너뜀", bad.followers.map(p => p.username), ["ok"]);

// 4) 언팔 diff — 핵심
const prev = parseExportFiles([{ name: "followers_1.json", text: mk([["alice", 100], ["bob", 200], ["carol", 300]]) }]);
const now = parseExportFiles([{ name: "followers_1.json", text: mk([["bob", 200], ["carol", 300], ["erin", 400]]) }]);
const d = diffFollowers(prev.followers, now.followers);
eq("나를 언팔한 계정", d.unfollowedMe.map(p => p.username), ["alice"]);
eq("새 팔로워", d.newFollowers.map(p => p.username), ["erin"]);

// 5) 대소문자 — 같은 계정으로 봐야 함 (언팔로 오탐하면 안 됨)
const pc = parseExportFiles([{ name: "followers_1.json", text: mk([["Alice", 100]]) }]);
const nc = parseExportFiles([{ name: "followers_1.json", text: mk([["alice", 100]]) }]);
eq("대소문자만 다름 → 언팔 아님", diffFollowers(pc.followers, nc.followers).unfollowedMe, []);
eq("대소문자만 다름 → 새 팔로워도 아님", diffFollowers(pc.followers, nc.followers).newFollowers, []);

// 6) 중복 제거
const dup = parseExportFiles([{ name: "followers_1.json", text: mk([["alice", 1], ["ALICE", 2], ["alice", 3]]) }]);
eq("중복 1명으로", dup.followers.length, 1);

// 7) 최신 timestamp
eq("latestTimestamp", latestTimestamp(prev.followers), 300);
eq("timestamp 없으면 null", latestTimestamp([{ username: "x", href: "" }]), null);

console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);
