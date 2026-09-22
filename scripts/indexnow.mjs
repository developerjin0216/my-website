// IndexNow 일괄 제출 — 사이트맵의 모든 URL을 참여 검색엔진에 즉시 통지합니다.
//
// 참여: Bing, Naver, Yandex, Seznam, Amazon, Yep — 구글은 참여하지 않습니다.
// 그래서 이건 '구글 색인' 대책이 아니라 **네이버·Bing 대책**입니다.
// 한국 사이트에서 네이버 수집이 5주째 없는 상황에는 이쪽이 더 급합니다.
//
// 키는 공개가 전제입니다(public/<key>.txt로 서빙되어 소유 증명에 쓰임).
// 따라서 별도 시크릿이 필요 없고, 이 스크립트는 로컬에서 그냥 실행하면 됩니다.
//
//   node scripts/indexnow.mjs            # 사이트맵 전체 제출
//   node scripts/indexnow.mjs --dry      # 실제 전송 없이 대상만 확인
//
// 주의: 같은 URL을 하루에 몇 번씩 던지면 남용으로 간주될 수 있습니다.
// 콘텐츠를 실제로 추가·수정한 뒤에만 돌리세요.

const HOST = "8282114.xyz";
const KEY = "b128ad55a4cf50e757b0c09d41e6884c";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const dry = process.argv.includes("--dry");

function fail(msg) {
  console.error("✗ " + msg);
  process.exit(1);
}

// 1) 키 파일이 실제로 서빙되는지 먼저 확인 — 이게 404면 제출은 전부 무시됩니다
const keyRes = await fetch(KEY_LOCATION);
if (!keyRes.ok) fail(`키 파일이 ${keyRes.status}입니다: ${KEY_LOCATION}`);
const keyBody = (await keyRes.text()).trim();
if (keyBody !== KEY) fail(`키 파일 내용이 키와 다릅니다: "${keyBody}"`);
console.log(`✓ 키 파일 확인 ${KEY_LOCATION}`);

// 2) 사이트맵에서 URL 수집
const xml = await (await fetch(SITEMAP)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) fail("사이트맵에서 URL을 찾지 못했습니다");

// 다른 호스트가 섞이면 전체 요청이 거부됩니다
const foreign = urls.filter((u) => new URL(u).host !== HOST);
if (foreign.length) fail(`호스트가 다른 URL ${foreign.length}건: ${foreign[0]}`);

console.log(`✓ 사이트맵 URL ${urls.length}건 수집`);

if (dry) {
  console.log("\n--dry 모드 — 전송하지 않습니다. 앞 5건:");
  urls.slice(0, 5).forEach((u) => console.log("   " + u));
  process.exit(0);
}

// 3) 제출 (1회 최대 10,000건이라 분할 불필요)
const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});

const text = await res.text().catch(() => "");
// 200=수락, 202=수락(키 검증 대기). 그 외는 본문에 사유가 옵니다.
if (res.status === 200 || res.status === 202) {
  console.log(`✓ 제출 완료 — HTTP ${res.status} (${urls.length}건)`);
  console.log("  Bing·네이버·Yandex 등 참여 엔진에 전달됩니다. 구글은 미참여.");
} else {
  fail(`제출 실패 HTTP ${res.status}: ${text.slice(0, 300)}`);
}
