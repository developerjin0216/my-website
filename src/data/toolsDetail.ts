// 도구 페이지 상세 설명 — 2026-11-17. 각 도구의 소스 코드에서만 뽑았습니다.
//
// 왜: 애드센스가 '가치가 별로 없는 콘텐츠'로 거듭 거절했고, 심사관은 검색 색인에서 뺀 페이지도
// 봅니다. 도구 페이지 대부분이 1,000~1,300자였습니다. 문장을 지어내지 않으려고, 문장마다 근거가
// 된 코드 조각을 evidence 에 남겼습니다(화면에는 나오지 않음). 도구 코드를 고치면
//   node --experimental-strip-types scripts/check-tool-claims.mjs
// 를 돌리고, 근거가 사라진 도구의 문장을 다시 확인하세요.
//
// tools.ts 가 모듈 로드 때 이 내용을 각 도구의 intro·guide·faq 뒤에 붙입니다.

import type { ToolFaq, ToolGuideSection } from "./tools";

export interface ToolDetail {
  intro: string[];
  guide: ToolGuideSection;
  faq: ToolFaq[];
  evidence: { file: string; quote: string }[];
}

export const toolDetails: Record<string, ToolDetail> = {
  "pdf-split": {
    "intro": [
      "페이지 지정 칸은 쉼표로 나눈 조각을 하나씩 읽습니다. 각 조각은 '5' 같은 숫자 하나나 '1-3' 같은 범위여야 하고, 다른 모양은 건너뜁니다. '3-1'처럼 큰 수를 앞에 쓰면 3, 2, 1페이지 순으로 담기고, 같은 번호를 두 번 적으면 그 페이지도 두 번 들어갑니다. 문서에 없는 번호는 안내 없이 빠지니 저장 버튼에 표시된 페이지 수를 확인하고 누르세요.",
      "결과 파일 이름은 올린 파일 이름을 따릅니다. '계약서.pdf'에서 세 페이지를 뽑으면 '계약서_3p.pdf'가 되고, 한 페이지씩 나누면 '계약서_p001.pdf'처럼 번호가 붙은 파일들이 '계약서_pages.zip' 하나에 묶여 내려옵니다. 빈 PDF를 새로 만들어 페이지를 복사해 넣는 방식이라 원본 파일은 바뀌지 않습니다."
    ],
    "guide": {
      "title": "입력이 생각대로 안 될 때",
      "items": [
        "입력칸에는 숫자·쉼표·하이픈·띄어쓰기만 남습니다. 물결표(~)로 적으면 하이픈으로 바뀌어 '1~3'도 1~3페이지로 읽힙니다",
        "띄어쓰기만으로는 페이지가 나뉘지 않습니다. '1 3 5'는 아무 페이지도 잡지 못하니 '1,3,5'로 적으세요",
        "제외 모드에서는 적은 순서와 상관없이 남은 페이지가 원래 순서대로 저장됩니다",
        "'한 페이지씩 나누기'는 페이지 지정 칸이나 제외 모드와 상관없이 언제나 전체 페이지를 나눕니다"
      ]
    },
    "faq": [
      {
        "q": "암호를 건 적이 없는데 열 수 없다고 나와요",
        "a": "파일을 열지 못하면 이유와 상관없이 같은 안내가 나와서, PDF가 아니거나 손상돼 읽히지 않는 파일도 이 문구를 보게 됩니다. 또 파일 안에 암호화 설정이 있으면 그것만으로 열기를 멈추므로, 뷰어에서 암호 없이 열리던 파일도 여기서는 열리지 않을 수 있습니다."
      },
      {
        "q": "원본의 책갈피(목차)도 같이 옮겨지나요?",
        "a": "아니요. 새 PDF에는 고른 페이지만 복사해 넣어서 원본의 책갈피와 문서 제목 같은 정보는 남지 않습니다. 페이지 크기와 회전 방향은 원본 그대로 옮겨집니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "const JSZip = (await import(\"jszip\")).default;"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "for (const part of input.split(\",\")) {"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "const m = p.match(/^(\\d+)\\s*-\\s*(\\d+)$/);"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "} else if (/^\\d+$/.test(p)) {"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "// \"3-1\"처럼 역순 범위는 내림차순으로 — 순서 바꿔 뽑기 지원"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "const hi = Math.min(total, Math.max(a, b));"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "if (n >= 1 && n <= total) out.push(n - 1);"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "const pages = await out.copyPages(src, indices);"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": ": `✂️ ${indices.length}페이지 ${exclude ? \"남기고\" : \"\"} 추출해서 저장`}"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "a.download = file.name.replace(/\\.pdf$/i, \"\") + `_${indices.length}p.pdf`;"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "zip.file(`${base}_p${String(i + 1).padStart(3, \"0\")}.pdf`, await out.save());"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "a.download = `${base}_pages.zip`;"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "const out = await PDFDocument.create();"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "e.target.value.replace(/[~～]/g, \"-\").replace(/[^\\d,\\-\\s]/g, \"\")"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "return Array.from({ length: pageCount }, (_, i) => i).filter((i) => !pickedSet.has(i));"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "for (let i = 0; i < src.getPageCount(); i++) {"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "setError(\"PDF를 열 수 없습니다 — 암호가 걸려 있다면 해제 후 다시 올려주세요.\");"
      },
      {
        "file": "src/app/tools/pdf-split/page.tsx",
        "quote": "const doc = await PDFDocument.load(await f.arrayBuffer());"
      },
      {
        "file": "node_modules/pdf-lib/es/api/PDFDocument.js",
        "quote": "ignoreEncryption = _a === void 0 ? false : _a"
      },
      {
        "file": "node_modules/pdf-lib/es/api/PDFDocument.js",
        "quote": "this.isEncrypted = !!context.lookup(context.trailerInfo.Encrypt);"
      },
      {
        "file": "node_modules/pdf-lib/es/api/PDFDocument.js",
        "quote": "if (!ignoreEncryption && this.isEncrypted)"
      },
      {
        "file": "node_modules/pdf-lib/es/core/PDFObjectCopier.js",
        "quote": "// Remove the parent reference to prevent the whole donor document's page"
      },
      {
        "file": "node_modules/pdf-lib/es/core/PDFObjectCopier.js",
        "quote": "// Move any entries that the originalPage is inheriting from its parent"
      },
      {
        "file": "node_modules/pdf-lib/es/core/PDFObjectCopier.js",
        "quote": "// tree nodes directly into originalPage so they are preserved during"
      }
    ]
  },
  "pdf-merge": {
    "intro": [
      "파일을 목록에 올리면 그 자리에서 하나씩 열어 페이지 수를 확인합니다. 확인이 끝나면 파일 이름 아래에 페이지 수가 나오고, 열지 못한 파일에는 '열 수 없음' 표시가 붙습니다. 이 표시가 붙은 파일은 목록에 남아 있어도 합칠 때 건너뛰고, 합치기 버튼에 적힌 파일 수에서도 빠집니다. 버튼은 이런 파일을 뺀 나머지가 2개 이상일 때만 눌립니다.",
      "합치기를 누르면 빈 PDF를 새로 만든 뒤 목록 위에서부터 차례로, 파일마다 모든 페이지를 원래 순서 그대로 복사해 이어 붙입니다. 그래서 결과의 페이지 수는 목록에 표시된 페이지 수를 모두 더한 값과 같습니다. 원본 파일에 있던 책갈피(목차)와 문서 제목 같은 정보는 새 파일로 옮겨지지 않으며, 결과는 매번 'merged.pdf'라는 같은 이름으로 저장됩니다."
    ],
    "guide": {
      "title": "이런 경우엔 이렇게 됩니다",
      "items": [
        "같은 파일을 두 번 올리면 목록에도 두 번 들어가고 결과에도 두 번 합쳐집니다. 겹친 줄은 ✕로 빼 주세요",
        "PDF가 아닌 파일은 섞어서 골라도 목록에 올라가지 않습니다. 고른 파일이 모두 PDF가 아니면 'PDF 파일을 올려주세요' 안내만 나옵니다",
        "'열 수 없음'은 암호가 걸린 파일뿐 아니라 PDF로 읽히지 않는 파일에도 붙습니다. 파일 안에 암호화 설정이 있으면 평소 암호 없이 열리던 파일이라도 이 표시가 붙습니다",
        "아직 '확인 중...'인 파일이 있는 동안에는 합치기 버튼이 '페이지 확인 중...'으로 바뀌고 눌리지 않습니다. 확인이 끝나면 '열 수 없음' 파일만 빼고 합칠 수 있습니다"
      ]
    },
    "faq": [
      {
        "q": "크기가 다른 PDF를 합치면 페이지 크기가 맞춰지나요?",
        "a": "아니요. 페이지는 원본의 크기와 회전 방향을 그대로 지닌 채 복사되고, 크기를 맞추는 처리는 하지 않습니다. 크기가 다른 문서를 합치면 결과 파일에서도 페이지마다 크기가 다르게 보입니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "const { PDFDocument } = await import(\"pdf-lib\");"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "// 페이지 수 검사 (암호 PDF 조기 감지)"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "entry.pages = doc.getPageCount();"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "entry.pages = -1;"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "? \"⚠️ 열 수 없음 (암호 PDF?) — 병합에서 제외됨\""
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": ": `${entry.pages}페이지`}"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "? \"확인 중...\""
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "if (entry.pages === -1) continue;"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "const mergeable = entries.filter((e) => e.pages !== -1);"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "disabled={busy || checking || mergeable.length < 2}"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": ": `📑 ${mergeable.length}개 파일 합치기`}"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "const out = await PDFDocument.create();"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "for (const entry of entries) {"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "const pages = await out.copyPages(src, src.getPageIndices());"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "pages.forEach((p) => out.addPage(p));"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "a.download = \"merged.pdf\";"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "setEntries((cur) => [...cur, ...added]);"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "(f) => f.type === \"application/pdf\" || /\\.pdf$/i.test(f.name)"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "setError(\"PDF 파일을 올려주세요.\");"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "const src = await PDFDocument.load(await entry.file.arrayBuffer());"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "setError(\"병합 중 오류가 났습니다. 파일이 손상되지 않았는지 확인해 주세요.\");"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "ignoreEncryption: false,"
      },
      {
        "file": "node_modules/pdf-lib/es/api/PDFDocument.js",
        "quote": "this.isEncrypted = !!context.lookup(context.trailerInfo.Encrypt);"
      },
      {
        "file": "node_modules/pdf-lib/es/api/PDFDocument.js",
        "quote": "if (!ignoreEncryption && this.isEncrypted)"
      },
      {
        "file": "node_modules/pdf-lib/es/core/PDFObjectCopier.js",
        "quote": "// Remove the parent reference to prevent the whole donor document's page"
      },
      {
        "file": "node_modules/pdf-lib/es/core/PDFObjectCopier.js",
        "quote": "// tree nodes directly into originalPage so they are preserved during"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "const checking = entries.some((e) => e.pages === null);"
      },
      {
        "file": "src/app/tools/pdf-merge/page.tsx",
        "quote": "? \"페이지 확인 중...\""
      }
    ]
  },
  "kakao-analyzer": {
    "intro": [
      "파일은 한 줄씩 읽습니다. '2026년 8월 20일 오후 3:24, 이름 : 내용'(안드로이드), '2026. 8. 20. 오후 3:24, 이름 : 내용'(아이폰), 날짜 구분선 아래 '[이름] [오후 3:24] 내용'(PC) 모양인 줄이 메시지 하나이고, 나머지 줄은 바로 앞 메시지에 이어 붙입니다. 그래서 여러 줄짜리 메시지도 한 개로 세고, '이름 : 내용' 형태가 없는 입장·퇴장 알림은 메시지 수에 넣지 않습니다.",
      "선톡은 대화방 전체에 8시간 이상 메시지가 없다가 처음 보낸 메시지이고, 파일의 첫 메시지도 1회로 칩니다. 답장 시간은 상대가 연달아 보냈다면 그 마지막 메시지부터 잽니다. 답장에서 빼는 기준(6시간)과 선톡 기준(8시간)이 달라, 6~8시간 만에 온 메시지는 답장 시간에도 선톡에도 들어가지 않습니다."
    ],
    "guide": {
      "title": "결과가 예상과 다를 때 확인할 것",
      "items": [
        "'대화를 인식하지 못했습니다'는 메시지로 읽힌 줄이 10개 미만일 때 나옵니다. 텍스트 파일은 시각이 '오후 3:24'처럼 오전·오후로 적혀 있어야 합니다",
        "파일 안에서 이름이 다르게 적히면 같은 사람도 다른 사람으로 셉니다. 1:1 대화인데 참여자가 셋 이상으로 잡히면 케미 점수가 나오지 않습니다",
        "많이 쓴 단어는 띄어쓰기로만 나눠서 '회사'와 '회사에서'를 다른 단어로 셉니다. 링크와 ㅋ·ㅎ·ㅠ·ㅜ로만 된 말, '사진'·'이모티콘' 같은 단어는 뺍니다",
        "케미 점수는 55점에서 시작해 균형 점수를 더하는 방식이라 55점 아래로는 나오지 않고, 최고점은 99점입니다"
      ]
    },
    "faq": [
      {
        "q": "케미 카드를 공유하면 대화 내용도 보이나요?",
        "a": "아니요. 카드는 서버가 아니라 이 브라우저에서 그린 800×800 PNG 이미지(kakao-chemistry.png)로, 점수·두 사람의 이름·대화 기간과 메시지 수·답장이 더 빠른 사람과 그 시간이 적히고 메시지 글은 들어가지 않습니다. 이름은 파일에 적힌 대로 들어가니 올리기 전에 확인하세요."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "import { parseKakao, analyze, type Analysis } from \"./parser\";"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// 안드로이드: \"2026년 8월 20일 오후 3:24, 홍길동 : 안녕\""
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// iOS: \"2026. 8. 20. 오후 3:24, 홍길동 : 안녕\""
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// PC 날짜 구분선: \"--------------- 2026년 8월 20일 목요일 ---------------\""
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// PC 메시지: \"[홍길동] [오후 3:24] 안녕\""
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (m && pcDate) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "/^(\\d{4})년 (\\d{1,2})월 (\\d{1,2})일 (오전|오후) (\\d{1,2}):(\\d{2}), (.+?) : ([\\s\\S]*)$/;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "/^(\\d{4})\\. (\\d{1,2})\\. (\\d{1,2})\\. (오전|오후) (\\d{1,2}):(\\d{2}), (.+?) : ([\\s\\S]*)$/;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// 어떤 패턴에도 안 걸리면 직전 메시지의 연속 줄"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "messages[messages.length - 1].text += \"\\n\" + line;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// 시스템 메시지(입장·퇴장 등)는 author 패턴에 안 걸려 자연 제외됨"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const NEW_CONVO_MS = 8 * 60 * 60 * 1000; // 8시간 공백 후 첫 메시지 = 선톡"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (!prev || m.ts - prev.ts >= NEW_CONVO_MS) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const REPLY_CAP_MS = 6 * 60 * 60 * 1000;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "} else if (prev.author !== m.author && m.ts - prev.ts < REPLY_CAP_MS) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "stat.replies.push(m.ts - prev.ts);"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "if (messages.length < 10) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "\"대화를 인식하지 못했습니다. 카카오톡의 '대화 내용 내보내기(텍스트만)'로 저장한 원본 파일인지 확인해 주세요.\""
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const stat = byAuthor.get(m.author) ?? {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (authors.length === 2) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "for (const raw of m.text.split(/\\s+/)) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (STOPWORDS.has(w) || /^https?/.test(raw) || /^[ㅋㅎㅠㅜ]+$/.test(w)) continue;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "\"사진\", \"이모티콘\", \"동영상\", \"삭제된\","
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "// 케미 카드 PNG를 캔버스로 생성 — 서버 OG 대신 클라이언트 생성(민감 데이터 URL 노출 방지)"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "c.width = 800;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "c.height = 800;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "return c.toDataURL(\"image/png\");"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "a.download = \"kakao-chemistry.png\";"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "ctx.fillText(`${a.chemistry}%`, 400, 330);"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "const names = a.authors.map((s) => s.author).join(\" ♥ \");"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "`${a.periodDays}일간 ${a.total.toLocaleString()}개의 메시지`,"
      },
      {
        "file": "src/app/tools/kakao-analyzer/page.tsx",
        "quote": "`답장 빠른 사람: ${fast.author} (${fmtReply(fast.medianReplyMin)})`,"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "55 + countBal * 16 + startBal * 12 + replyBal * 8 + speedBonus * 8;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const speedBonus = Math.max(0, 1 - Math.min(ra, rb) / 120); // 둘 중 빠른 쪽이 2시간 이내면 가산"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "chemistry = Math.min(99, Math.round(score));"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// 케미 점수 (1:1만, 재미용): 대화량·선톡·답장속도 균형의 조합 → 55~99"
      }
    ]
  },
  "insta-dm": {
    "intro": [
      "ZIP을 올리면 브라우저 안에서 압축을 풀고, messages/inbox/대화방 폴더/message_숫자.json 형태의 파일만 골라 읽습니다. 한 대화방에 message_1.json, message_2.json처럼 파일이 여러 개면 하나로 합쳐 시간순으로 정렬하고, 보낸 사람이나 시각이 빠진 항목은 뺍니다. 메시지가 10개 미만인 대화방은 목록에 나오지 않고, 나머지는 메시지가 많은 순으로 상위 20개까지 보여줍니다.",
      "선톡은 대화의 첫 메시지와, 직전 메시지에서 8시간 이상 지나 보낸 메시지를 보낸 쪽에 셉니다. 답장 속도는 상대 메시지 바로 뒤 6시간 안에 보낸 메시지의 간격만 모아 중앙값으로 보여주므로, 6시간 이상 8시간 미만 지나 보낸 메시지는 답장에도 선톡에도 들어가지 않습니다. 새벽 대화는 0시부터 6시 전까지 보낸 메시지 비율입니다."
    ],
    "guide": {
      "title": "결과가 예상과 다를 때 확인할 것",
      "items": [
        "압축을 푼 JSON을 직접 올릴 때는 파일 이름이 'message_숫자.json'이어야 읽힙니다. 함께 올린 파일은 모두 한 대화로 합쳐지므로 한 번에 한 대화방 폴더의 파일만 올리세요",
        "답장 중앙값이 '-'로 나오면 그 사람이 상대 메시지 뒤 6시간 안에 답한 기록이 한 번도 없다는 뜻입니다",
        "많이 쓴 단어는 띄어쓰기로 잘라 세므로 '영화'와 '영화는'을 다른 단어로 봅니다. 한 글자 말, 링크, ㅋ·ㅎ·ㅠ·ㅜ로만 된 말, '근데'·'진짜' 같은 말은 빠집니다"
      ]
    },
    "faq": [
      {
        "q": "케미 점수는 어떻게 계산되나요?",
        "a": "메시지를 보낸 사람이 정확히 두 명인 대화에서만 계산합니다. 기본 55점에 메시지 수가 비슷할수록 최대 16점, 선톡 횟수가 비슷할수록 최대 12점, 답장 중앙값이 비슷할수록 최대 8점, 빠른 쪽 답장 중앙값이 짧을수록 최대 8점(2시간 이상이면 0점)을 더해, 결과는 55~99% 사이로만 나옵니다."
      },
      {
        "q": "첫 DM 날짜가 생각보다 늦게 나와요",
        "a": "첫 DM은 올린 파일 안에서 가장 이른 메시지의 날짜입니다. 압축을 푼 JSON을 직접 올렸다면 같은 대화방 폴더의 message_숫자.json 파일을 모두 함께 올렸는지 확인하세요."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "const zip = await JSZip.loadAsync(file);"
      },
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "\"use client\";"
      },
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "if (/messages\\/[^/]*inbox\\/[^/]+\\/message_\\d+\\.json$/i.test(entry.name)) {"
      },
      {
        "file": "src/app/tools/insta-dm/dmParser.ts",
        "quote": "// (경로, JSON 텍스트) 목록 → 스레드별 병합 (message_1.json, message_2.json … 합침)"
      },
      {
        "file": "src/app/tools/insta-dm/dmParser.ts",
        "quote": "messages: v.messages.sort((a, b) => a.ts - b.ts),"
      },
      {
        "file": "src/app/tools/insta-dm/dmParser.ts",
        "quote": "if (!raw.sender_name || !raw.timestamp_ms) continue;"
      },
      {
        "file": "src/app/tools/insta-dm/dmParser.ts",
        "quote": ".filter((t) => t.messages.length >= 10)"
      },
      {
        "file": "src/app/tools/insta-dm/dmParser.ts",
        "quote": ".sort((a, b) => b.messages.length - a.messages.length);"
      },
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "{threads.slice(0, 20).map((t) => ("
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const NEW_CONVO_MS = 8 * 60 * 60 * 1000; // 8시간 공백 후 첫 메시지 = 선톡"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (!prev || m.ts - prev.ts >= NEW_CONVO_MS) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const REPLY_CAP_MS = 6 * 60 * 60 * 1000;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "} else if (prev.author !== m.author && m.ts - prev.ts < REPLY_CAP_MS) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "medianReplyMin: number | null; // 답장 속도 중앙값(분)"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (date.getHours() < 6) night++;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "nightRatio: number; // 0~6시 비율"
      },
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "texts.push({ path: `messages/inbox/direct/${file.name}`, text: await file.text() });"
      },
      {
        "file": "src/app/tools/insta-dm/dmParser.ts",
        "quote": "const m = file.path.match(/messages\\/[^/]*inbox\\/([^/]+)\\/message_\\d+\\.json$/i);"
      },
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "if (min === null) return \"-\";"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (arr.length === 0) return null;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "for (const raw of m.text.split(/\\s+/)) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const w = raw.replace(/[^\\p{L}\\p{N}ㄱ-ㅎ]/gu, \"\");"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (w.length < 2 || w.length > 12) continue;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (STOPWORDS.has(w) || /^https?/.test(raw) || /^[ㅋㅎㅠㅜ]+$/.test(w)) continue;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "\"근데\", \"그리고\", \"그래서\", \"그럼\", \"진짜\", \"너무\", \"그냥\", \"저도\", \"나도\","
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "if (authors.length === 2) {"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "55 + countBal * 16 + startBal * 12 + replyBal * 8 + speedBonus * 8;"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const countBal = Math.min(a.count, b.count) / Math.max(a.count, b.count);"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "? Math.min(a.starts, b.starts) / Math.max(a.starts, b.starts, 1)"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const replyBal = Math.min(ra, rb) / Math.max(ra, rb, 1);"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const speedBonus = Math.max(0, 1 - Math.min(ra, rb) / 120); // 둘 중 빠른 쪽이 2시간 이내면 가산"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "chemistry = Math.min(99, Math.round(score));"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "// 케미 점수 (1:1만, 재미용): 대화량·선톡·답장속도 균형의 조합 → 55~99"
      },
      {
        "file": "src/app/tools/kakao-analyzer/parser.ts",
        "quote": "const firstTs = messages[0]?.ts ?? 0;"
      },
      {
        "file": "src/app/tools/insta-dm/page.tsx",
        "quote": "{new Date(result.firstTs).toLocaleDateString(\"ko-KR\")}"
      }
    ]
  },
  "insta-hidden": {
    "intro": [
      "ZIP을 올리면 브라우저 안에서 압축을 풀고 파일 이름으로 읽을 파일을 고릅니다. 이름에 blocked가 들어간 JSON은 차단 목록, hide_story는 스토리 숨김, pending_follow_requests는 수락 안 된 팔로우 요청, recently_unfollowed는 최근 언팔, close_friends는 친한 친구로 읽고, 폴더 위치와 대소문자는 따지지 않습니다. 이름에 이 다섯 단어가 없거나 .json이 아닌 파일은 열지 않습니다.",
      "고른 파일은 안쪽까지 훑어 아이디를 모두 모으고, 대소문자만 다른 같은 아이디는 항목마다 한 번만 셉니다. 결과는 항목별 개수와 @아이디 목록이며 날짜는 표시하지 않습니다. 아이디를 누르면 파일에 적힌 프로필 주소(없으면 instagram.com/아이디)가 새 창으로 열립니다."
    ],
    "guide": {
      "title": "결과가 비어 있거나 이상할 때",
      "items": [
        "'관련 파일을 찾지 못했습니다'가 뜨면 ZIP 안에 이름이 맞는 JSON이 하나도 없는 것입니다. JSON 형식으로, 연결 활동 항목을 포함해 받은 ZIP인지 확인하세요",
        "'기록이 없습니다'는 해당 파일이 없을 때와 파일은 있지만 비어 있을 때 똑같이 나옵니다. 이 도구는 둘을 구분하지 않습니다",
        "압축을 푼 JSON을 직접 올릴 때는 파일 이름을 바꾸지 마세요. 이름에 다섯 단어가 없는 JSON은 읽지 않으며, 그런 파일만 올리면 오류 안내 없이 모든 항목이 0으로 나옵니다",
        "내용이 깨져 읽히지 않는 파일은 건너뛰고 나머지 파일로 결과를 만듭니다"
      ]
    },
    "faq": [
      {
        "q": "예전에 받은 ZIP과 함께 올려도 되나요?",
        "a": "올릴 수는 있습니다. 여러 파일을 한 번에 고르면 같은 항목의 아이디를 합쳐 한 번씩만 셉니다. 다만 두 시점의 명단이 합쳐져 예전 ZIP에만 있는 기록도 함께 나오니, 지금 상태만 보려면 가장 최근 ZIP 하나만 올리세요."
      },
      {
        "q": "한 계정이 여러 항목에 나올 수 있나요?",
        "a": "네. 중복은 항목 안에서만 정리하므로, 한 아이디가 여러 항목의 파일에 들어 있으면 각 항목에 한 번씩 나옵니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "const zip = await JSZip.loadAsync(file);"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "\"use client\";"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "if (entry.dir || !entry.name.toLowerCase().endsWith(\".json\")) continue;"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "const base = entry.name.split(\"/\").pop()?.toLowerCase() ?? \"\";"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "if (CATEGORIES.some((c) => c.match.some((m) => base.includes(m)))) {"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "{ key: \"blocked\", label: \"내가 차단한 계정\", icon: \"🚫\", match: [\"blocked\"] },"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "{ key: \"hideStory\", label: \"스토리 숨김 대상\", icon: \"🙈\", match: [\"hide_story\"] },"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "{ key: \"pendingSent\", label: \"수락 안 된 팔로우 요청\", icon: \"⏳\", match: [\"pending_follow_requests\"] },"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "{ key: \"recentUnfollow\", label: \"최근 언팔한 계정\", icon: \"👋\", match: [\"recently_unfollowed\"] },"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "{ key: \"closeFriends\", label: \"친한 친구\", icon: \"💚\", match: [\"close_friends\"] },"
      },
      {
        "file": "src/app/tools/insta-follow-check/parser.ts",
        "quote": "// string_list_data 항목을 재귀적으로 수집 — 내보내기 포맷의 소소한 변형에 견디게"
      },
      {
        "file": "src/app/tools/insta-follow-check/parser.ts",
        "quote": "// (insta-hidden 등 같은 ZIP을 쓰는 다른 도구에서도 재사용)"
      },
      {
        "file": "src/app/tools/insta-follow-check/parser.ts",
        "quote": "if (typeof e.value === \"string\" && e.value.length > 0) {"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "collectPeople(json, result[cat.key]);"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "const k = p.username.toLowerCase();"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "for (const c of CATEGORIES) result[c.key] = dedupe(result[c.key]);"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "{list.length.toLocaleString()}"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "<span>@{p.username}</span>"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "<span className=\"text-xs text-[#606070]\">프로필 ↗</span>"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "href={p.href || `https://www.instagram.com/${p.username}/`}"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "target=\"_blank\""
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "if (!found && texts.length === 0) return null;"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "\"관련 파일을 찾지 못했습니다. '내 정보 다운로드' ZIP(JSON 형식, 연결 활동 포함)을 그대로 올렸는지 확인해 주세요.\""
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "기록이 없습니다 (내보내기에 이 항목이 없거나 0건)"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "} else if (file.name.toLowerCase().endsWith(\".json\")) {"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "texts.push({ name: file.name.toLowerCase(), text: await file.text() });"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "const cat = CATEGORIES.find((c) => c.match.some((m) => name.includes(m)));"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "if (!cat) continue;"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "/* 손상 파일 무시 */"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "for (const file of files) {"
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "accept=\".zip,.json,application/zip,application/json\""
      },
      {
        "file": "src/app/tools/insta-hidden/page.tsx",
        "quote": "multiple"
      }
    ]
  },
  "image-compress": {
    "intro": [
      "'목표 용량 맞춤'은 품질 5~95 범위를 절반씩 좁혀 가며 8번 시험 저장하고, 목표 안에 들어온 결과 가운데 품질이 가장 높은 것을 고릅니다. 목표를 10KB보다 작게 적거나 칸을 비우면 10KB로 계산합니다. '품질 직접 선택'은 5~95 사이 숫자를 받고, 범위를 벗어나면 가까운 끝값으로 바꿉니다.",
      "사진은 브라우저가 먼저 그림으로 풀어 낸 뒤, 가로 폭 제한을 골랐다면 크기를 줄이고 JPG나 WebP로 새로 저장합니다. PNG로 올린 사진도 결과는 이 두 형식 중 하나이고, 이름은 그대로 둔 채 확장자만 바뀝니다. WebP를 만들 수 없는 브라우저에서는 PNG로 저장되고 확장자도 .png가 됩니다. JPG로 저장할 때 투명한 부분은 흰색으로 채웁니다. 다시 그려 저장하는 방식이라 결과 파일에는 원본의 촬영 위치·기기 정보 같은 메타데이터가 옮겨지지 않습니다."
    ],
    "guide": {
      "title": "결과가 예상과 다를 때",
      "items": [
        "가로 폭 제한은 사진이 그보다 넓을 때만 줄이고, 작은 사진을 키우지는 않습니다. 기준은 가로 폭만 보므로 세로로 긴 사진은 가로가 기준보다 좁으면 크기가 그대로입니다",
        "결과가 원본보다 커져도 줄어든 비율은 0%로 표시됩니다. 비율 대신 앞뒤 용량 숫자를 비교하세요",
        "형식·목표·가로 폭 설정은 사진을 올리는 순간 적용됩니다. 설정을 바꿨다면 같은 사진을 다시 고르면 새 설정으로 다시 압축됩니다. 이름이 같아지는 사진은 ' (2)'처럼 번호를 붙여 서로 덮어쓰지 않게 합니다",
        "여러 장 중 한 장이라도 처리하지 못하면 결과가 하나도 나오지 않고 오류 안내만 뜹니다. 브라우저가 열지 못하는 형식이 섞였을 때도 같으니 문제가 된 사진을 빼고 다시 올려 보세요"
      ]
    },
    "faq": [
      {
        "q": "목표 용량보다 큰 결과가 나와요",
        "a": "가장 낮은 품질로도 목표 안에 들어오지 않으면, 그 최저 품질로 저장한 결과를 그대로 보여주기 때문입니다. 이때는 가로 폭 제한(1920·1280·800px)을 고른 뒤 사진을 다시 올리세요."
      },
      {
        "q": "화면에서는 목표 안인데 제출하는 곳에서 용량 초과라고 해요",
        "a": "이 도구는 1KB를 1,024바이트로 계산하고 표시합니다. 제출하는 곳이 다른 기준으로 용량을 잰다면 차이가 날 수 있으니, 목표를 제한보다 조금 낮게 잡아 다시 만들어 보세요."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const bmp = await createImageBitmap(file);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "\"use client\";"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "// 목표 용량(바이트)에 맞는 최고 품질을 이진 탐색"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "let lo = 0.05, hi = 0.95;"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "for (let i = 0; i < 8; i++) {"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "if (blob.size <= targetBytes) {"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "? await compressToTarget(bmp, type, Math.max(10, Number(targetKb)) * 1024)"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": ": await encode(bmp, type, Math.min(95, Math.max(5, Number(quality))) / 100);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "품질 (5~95)"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const [format, setFormat] = useState<\"jpeg\" | \"webp\">(\"jpeg\");"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const type = `image/${format}`;"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const ext = blob.type === \"image/webp\" ? \".webp\" : blob.type === \"image/png\" ? \".png\" : \".jpg\";"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const base = file.name.replace(/\\.[^.]+$/, \"\");"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "ctx.drawImage(bmp, 0, 0);"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "// canvas 재인코딩 — 픽셀만 다시 그리므로 EXIF·GPS 등 메타데이터가 모두 제거됨"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "if (maxWidth > 0 && bmp.width > maxWidth) {"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "resizeHeight: Math.round((bmp.height * maxWidth) / bmp.width),"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "<option value=\"1920\">1920px</option>"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "<option value=\"1280\">1280px</option>"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "<option value=\"800\">800px</option>"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "(−{Math.max(0, Math.round((1 - r.after / r.before) * 100))}%)"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "import { useRef, useState } from \"react\";"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const picked = e.target.files ? [...e.target.files] : [];"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "setResults([]);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "setResults(done);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "setError(\"이미지 처리 중 오류가 났습니다. 사진이 너무 크면 가로 폭 제한을 걸어보세요.\");"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "const bmp = await loadBitmap(file, Number(maxWidth) || 0);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "return best ?? encode(bmp, type, 0.05);"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "bytes >= 1024 * 1024"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "ctx.fillStyle = \"#ffffff\";"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "for (let n = 2; done.some((d) => d.name === name); n++) name = `${base} (${n})${ext}`;"
      },
      {
        "file": "src/app/tools/image-compress/page.tsx",
        "quote": "e.target.value = \"\";"
      }
    ]
  },
  "exif-remover": {
    "intro": [
      "정보를 지우는 방식은 단순합니다. 사진을 화면에 보이지 않는 캔버스에 다시 그린 뒤 그 그림만 새 파일로 저장하므로, 목록에 표시되지 않은 항목까지 포함해 원본의 메타데이터가 사본으로 옮겨지지 않습니다.",
      "저장 형식은 원본에 따라 정해집니다. PNG는 PNG로, JPG와 WebP는 JPG로 저장되고, 파일 이름에는 확장자 앞에 _clean이 붙어 원본과 구분됩니다. 사진이 여러 장이면 아래쪽 전체 저장 버튼이 photos_clean.zip 하나로 묶어 주고, 한 장뿐이면 ZIP 없이 그 파일만 내려받습니다."
    ],
    "guide": {
      "title": "이런 경우엔 이렇게 됩니다",
      "items": [
        "사진을 다시 고르면 이전 목록은 지워지고 새로 고른 사진만 남습니다. 함께 처리할 사진은 한 번에 선택하세요",
        "목록의 각 사진 옆 '지운 사본 저장'을 누르면 그 사진 한 장만 바로 내려받습니다",
        "사본이 제대로 지워졌는지 보려면 저장한 파일을 이 화면에 다시 올려 보세요. 원본에서 보이던 촬영 시각·기기 줄이 사라지고 '메타데이터가 없거나 이미 제거된 사진입니다'라고 나옵니다"
      ]
    },
    "faq": [
      {
        "q": "JPG·PNG·WebP 말고 다른 형식도 되나요?",
        "a": "이 세 가지만 받습니다. GIF·BMP처럼 다른 형식의 파일은 목록에 올라오지 않고, 다른 사진과 함께 골랐다면 안내 문구 없이 그 파일만 빠집니다. 고른 장수와 목록의 장수가 다르면 빠진 파일의 형식을 확인해 보세요."
      },
      {
        "q": "사진이 정말 서버로 가지 않나요?",
        "a": "이 페이지의 코드에는 사진을 밖으로 보내는 요청이 없습니다. 정보 읽기는 브라우저가 파일을 직접 열어 처리하고, 미리보기도 이 브라우저 안에서만 쓰는 임시 주소로 띄웁니다. 개발자 도구의 네트워크 탭을 열어 둔 채 사진을 올려 보면 사진 파일을 보내는 요청이 없는 것을 직접 확인할 수 있습니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "// canvas 재인코딩 — 픽셀만 다시 그리므로 EXIF·GPS 등 메타데이터가 모두 제거됨"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "const canvas = document.createElement(\"canvas\");"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "canvas.getContext(\"2d\")!.drawImage(bitmap, 0, 0);"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "pick: [\"DateTimeOriginal\", \"Make\", \"Model\", \"latitude\", \"longitude\","
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "const type = file.type === \"image/png\" ? \"image/png\" : \"image/jpeg\";"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "return name.replace(/\\.(jpe?g|png|webp)$/i, \"\") + \"_clean\" + (/\\.png$/i.test(name) ? \".png\" : \".jpg\");"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "a.download = \"photos_clean.zip\";"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "if (items.length === 1) {"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "await saveOne(items[0]);"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "setItems(parsed);"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "onClick={() => saveOne(item)}"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "{item.date && <p className=\"text-[#a0a0b0]\">촬영: {item.date}</p>}"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "{item.device && <p className=\"text-[#a0a0b0]\">기기: {item.device}</p>}"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "<p className=\"text-[#606070]\">메타데이터가 없거나 이미 제거된 사진입니다</p>"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "/* 메타데이터 없음 */"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "/^image\\/(jpeg|png|webp)$/.test(f.type)"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "if (files.length === 0) {"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "setError(\"JPG·PNG·WebP 이미지를 올려주세요. (HEIC는 미지원 — FAQ 참고)\");"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "accept=\"image/jpeg,image/png,image/webp\""
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "const meta = await exifr.parse(file, {"
      },
      {
        "file": "node_modules/exifr/dist/full.esm.mjs",
        "quote": "t&&e instanceof Blob?x(e,n,\"blob\",R)"
      },
      {
        "file": "node_modules/exifr/dist/full.esm.mjs",
        "quote": "readAsArrayBuffer(e)"
      },
      {
        "file": "src/app/tools/exif-remover/page.tsx",
        "quote": "url: URL.createObjectURL(file),"
      }
    ]
  },
  "webcam-test": {
    "intro": [
      "카메라를 켜면 가로 1280픽셀을 '희망값'으로 요청하고, 브라우저가 실제로 연 해상도를 미리보기 오른쪽 위에 표시합니다. 브라우저가 초당 프레임 수를 알려 주면 fps도 함께 나옵니다. 요청에 맞춰 열린 값이라 카메라의 최고 해상도와 다를 수 있습니다.",
      "마이크 게이지는 소리의 순간 최댓값을 따라 움직이며, 막대가 5% 이하면 회색, 그보다 크면 초록색, 70%를 넘으면 빨간색이 됩니다. 3초 녹음 버튼은 마이크가 꺼져 있으면 먼저 켠 뒤 녹음하고, 녹음이 끝나면 바로 아래에 재생기가 나타납니다. 다시 녹음하면 이전 녹음은 지워집니다."
    ],
    "guide": {
      "title": "결과가 이상할 때 확인할 것",
      "items": [
        "안내 문구로 원인을 나눌 수 있습니다 — '권한이 차단됐습니다'는 브라우저가 권한을 막은 경우이고, '카메라를 열 수 없습니다'는 권한 말고 다른 이유로 장치가 열리지 않은 경우라 다른 프로그램이 카메라를 쓰는 중인지부터 보면 됩니다",
        "미리보기 틀은 비율이 고정돼 있고 영상을 틀에 꽉 채워 보여 주므로 가장자리가 잘려 보일 수 있습니다. 실제 크기는 오른쪽 위 해상도 숫자로 판단하세요",
        "장치를 고르는 메뉴가 없어 브라우저가 기본으로 정한 카메라·마이크가 열립니다. 게이지가 움직이지 않아 '말해보세요' 안내가 뜨면, 헤드셋을 쓰는 경우 기본 장치가 헤드셋으로 잡혀 있는지 확인하세요"
      ]
    },
    "faq": [
      {
        "q": "왼쪽과 오른쪽 소리의 높이가 달라요",
        "a": "일부러 다르게 만든 것입니다. 왼쪽 버튼은 440Hz, 오른쪽 버튼은 660Hz 음을 한쪽 채널로만 0.6초 동안 작은 음량으로 보내므로, 이어폰 좌우가 바뀌었는지 음 높이로도 구분할 수 있습니다."
      },
      {
        "q": "'카메라 끄기'를 누르면 완전히 꺼지나요?",
        "a": "네. 끄기 버튼은 화면만 가리는 것이 아니라 카메라 사용 자체를 멈춥니다(마이크 끄기도 같습니다). 버튼을 누르지 않고 다른 페이지로 이동해도 카메라·마이크가 꺼지고 소리 재생 기능도 닫힙니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "video: { width: { ideal: 1280 } },"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "setCamInfo(`${s.width}×${s.height}${s.frameRate ? ` · ${Math.round(s.frameRate)}fps` : \"\"}`);"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "<span className=\"absolute top-2 right-2 text-xs bg-black/60 text-white rounded-lg px-2 py-1\">"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "for (const v of data) peak = Math.max(peak, Math.abs(v - 128));"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "setMicLevel(Math.min(100, Math.round((peak / 128) * 160)));"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "width: `${micLevel}%`,"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "backgroundColor: micLevel > 70 ? \"#EF4444\" : micLevel > 5 ? \"#22C55E\" : \"#606070\","
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "if (!micStreamRef.current) await toggleMic();"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "setTimeout(() => rec.state === \"recording\" && rec.stop(), 3000);"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "<audio controls src={recUrl} className=\"w-full mt-3 h-10\" />"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "if (recUrl) URL.revokeObjectURL(recUrl);"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "e instanceof DOMException && e.name === \"NotAllowedError\""
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "? \"권한이 차단됐습니다 — 주소창 자물쇠 아이콘에서 카메라를 허용하고 새로고침하세요.\""
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": ": \"카메라를 열 수 없습니다. 다른 앱(줌 등)이 사용 중인지 확인하세요.\""
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "<div className=\"rounded-xl overflow-hidden bg-black aspect-video mb-3 relative\">"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "<video ref={videoRef} autoPlay playsInline muted className=\"w-full h-full object-cover\" />"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "video: { width: { ideal: 1280 } },"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "const stream = await navigator.mediaDevices.getUserMedia({ audio: true });"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "{micOn && micLevel <= 2 && ("
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "말해보세요 — 게이지가 안 움직이면 입력 장치를 확인하세요."
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "osc.frequency.value = side === \"left\" ? 440 : 660;"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "const pan = new StereoPannerNode(ctx, { pan: side === \"left\" ? -1 : 1 });"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "gain.gain.value = 0.15;"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "osc.stop(ctx.currentTime + 0.6);"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "streamRef.current?.getTracks().forEach((t) => t.stop());"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "micStreamRef.current?.getTracks().forEach((t) => t.stop());"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "// 페이지 이탈 시 모든 장치 해제"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "audioCtxRef.current?.close().catch(() => {});"
      },
      {
        "file": "src/app/tools/webcam-test/page.tsx",
        "quote": "if (videoRef.current) videoRef.current.srcObject = stream;"
      }
    ]
  },
  "qr-generator": {
    "intro": [
      "QR에 담기는 글자는 탭마다 정해진 모양으로 만들어집니다. 링크는 http:// 나 https://로 시작하지 않으면(앞뒤 공백과 대소문자는 따지지 않습니다) 앞에 https://를 붙이고, 전화는 숫자와 +만 남긴 tel: 주소(숫자가 하나도 없으면 QR을 만들지 않습니다), 문자는 같은 번호에 미리 채울 내용(적은 경우)을 덧붙인 sms: 주소입니다. 와이파이는 암호 방식·이름·비밀번호를 WIFI: 형식으로 묶고, 세미콜론·쉼표·콜론·따옴표·역슬래시 앞에는 역슬래시를 붙여 자동으로 처리합니다.",
      "입력을 멈추면 잠시 뒤 QR이 저절로 다시 그려집니다. PNG와 SVG는 같은 설정(오류 정정 M 단계, 크기 640픽셀 지정)으로 함께 만들어지고, 화면의 흰 상자는 미리보기용이라 저장 파일에는 QR 둘레에 모듈(작은 네모) 2칸 너비의 흰 여백만 들어 있습니다."
    ],
    "guide": {
      "title": "이런 경우엔 이렇게 됩니다",
      "items": [
        "와이파이 비밀번호를 비우고 '비밀번호 없는 개방 네트워크'도 체크하지 않으면 빈 비밀번호가 담긴 QR이 만들어집니다. 비밀번호 칸은 가려지지 않고, 앞뒤 공백도 입력한 그대로 담깁니다",
        "글이 길어 QR 하나에 담을 수 있는 양을 넘으면 QR과 저장 버튼이 사라지고 '내용이 너무 길어 QR 하나에 담을 수 없습니다' 안내가 나옵니다. 글을 줄이거나 긴 글 대신 링크를 담으세요",
        "저장 파일 이름은 늘 qrcode.png·qrcode.svg로 같으니, 여러 개를 만들면 저장할 때마다 이름을 바꿔 두세요"
      ]
    },
    "faq": [
      {
        "q": "주소 앞에 https://를 꼭 입력해야 하나요?",
        "a": "아니요. http:// 나 https://로 시작하지 않는 주소에는 https://를 자동으로 붙여 담습니다. 반대로 http://로 입력한 주소는 https로 바꾸지 않고 그대로 담습니다."
      },
      {
        "q": "전화 탭과 문자 탭에 번호를 따로 넣어야 하나요?",
        "a": "아니요. 두 탭은 같은 번호 칸을 함께 써서 탭을 바꿔도 번호가 남아 있습니다. 하이픈·공백·괄호는 지워지고 숫자와 + 기호만 담깁니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "/^https?:\\/\\//i.test(urlTrim) ? urlTrim : `https://${urlTrim}`"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "? telDigits && `tel:${telDigits}`"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "`sms:${telDigits}"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "`WIFI:T:${wifiEnc === \"nopass\" ? \"nopass\" : \"WPA\"};S:${esc(ssid.trim())};${"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "wifiEnc === \"nopass\" ? \"\" : `P:${esc(wifiPw)};`"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const esc = (s: string) => s.replace(/([\\\\;,:\"'])/g, \"\\\\$1\");"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "// 와이파이 QR 표준 형식 — 특수문자는 이스케이프"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "? ssid.trim() &&"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "<input className={inputCls} placeholder=\"비밀번호\" value={wifiPw} onChange={(e) => setWifiPw(e.target.value)} />"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "비밀번호 없는 개방 네트워크"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const timer = setTimeout(async () => {"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "}, 250);"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const opts = { errorCorrectionLevel: \"M\" as const, margin: 2, width: 640 };"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const [pngUrl, svgStr] = await Promise.all(["
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "QRCode.toString(content, { ...opts, type: \"svg\" }),"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "<div className=\"bg-white rounded-2xl p-4 inline-block\">"
      },
      {
        "file": "node_modules/qrcode/lib/renderer/svg-tag.js",
        "quote": "const qrcodesize = size + opts.margin * 2"
      },
      {
        "file": "node_modules/qrcode/lib/renderer/utils.js",
        "quote": "const scaledMargin = opts.margin * scale"
      },
      {
        "file": "node_modules/qrcode/lib/renderer/svg-tag.js",
        "quote": "const width = !opts.width ? '' : 'width=\"' + opts.width + '\" height=\"' + opts.width + '\" '"
      },
      {
        "file": "node_modules/qrcode/lib/core/qrcode.js",
        "quote": "throw new Error('The amount of data is too big to be stored in a QR Code')"
      },
      {
        "file": "node_modules/qrcode/lib/browser.js",
        "quote": "reject(e)"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "setPng(pngUrl);"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "download=\"qrcode.png\""
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "a.download = \"qrcode.svg\";"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "{(mode === \"tel\" || mode === \"sms\") && ("
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "<input className={inputCls} inputMode=\"tel\" placeholder=\"010-1234-5678\" value={tel} onChange={(e) => setTel(e.target.value)} />"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const QRCode = await import(\"qrcode\");"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const telDigits = tel.replace(/[^\\d+]/g, \"\");"
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "setQrError(\"내용이 너무 길어 QR 하나에 담을 수 없습니다."
      },
      {
        "file": "src/app/tools/qr-generator/page.tsx",
        "quote": "const urlTrim = url.trim();"
      }
    ]
  },
  "passport-photo": {
    "intro": [
      "고를 수 있는 규격은 여권(온라인 재발급) 413×531, 증명사진 3×4cm 354×472, 반명함 2.5×3cm 295×354픽셀입니다. 어느 쪽이든 저장 파일은 고른 픽셀 크기와 똑같은 JPG이고, 파일 이름에 photo_413x531.jpg처럼 크기가 붙습니다.",
      "저장할 때는 화면의 미리보기가 아니라 원본 사진의 픽셀에서 틀 안쪽을 잘라, 규격 크기에 맞춰 새 JPG로 다시 그립니다. 원본 파일은 바뀌지 않습니다. 잘라 낸 부분이 규격보다 작으면(작은 사진을 크게 확대한 경우) 늘려 그리게 되어 흐릿해질 수 있는데, 도구가 따로 경고하지는 않습니다."
    ],
    "guide": {
      "title": "점선과 저장 범위 확인하기",
      "items": [
        "노란 점선은 사진 상자 위에서 8%(정수리)와 84%(턱) 높이에, 흰 세로 점선은 가운데에 있습니다. 여권 사진에 맞춘 위치라 다른 규격을 골라도 그대로이니, 제출 기준은 발급 기관의 최신 안내로 확인하세요",
        "저장되는 것은 밝게 보이는 틀 안쪽뿐입니다. 가로로 찍은 사진처럼 비율이 규격과 많이 다르면 틀이 상자보다 작아져 노란 점선이 틀 밖에 놓일 수 있으니, 이때는 밝은 틀 안에 정수리와 턱이 모두 들어오게 맞추세요",
        "확대는 처음 크기의 3배까지이고, 처음보다 작게 줄일 수는 없습니다. 머리 위와 어깨까지 여유 있게 찍힌 사진이 맞추기 쉽습니다"
      ]
    },
    "faq": [
      {
        "q": "규격을 바꾸거나 다른 사진을 고르면 처음부터 다시 해야 하나요?",
        "a": "규격 버튼은 사진을 그대로 둔 채 틀의 가로세로 비율만 바꿉니다. '다른 사진 선택'으로 새 사진을 고르면 위치와 확대는 처음 상태로 돌아가고, 고른 규격은 유지됩니다."
      },
      {
        "q": "사진을 골랐는데 저장이 안 돼요",
        "a": "브라우저가 그 사진 형식을 열지 못하면 저장 버튼 아래에 '이 사진을 열지 못해 저장하지 못했습니다' 안내가 뜹니다. 이때는 JPG 같은 다른 형식의 사진으로 다시 시도하세요."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "label: \"여권 (온라인 재발급)\","
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "w: 413,"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "h: 531,"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "label: \"증명사진 3×4cm\","
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "note: \"354×472px (300dpi) — 이력서·각종 서류용\","
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "label: \"반명함 2.5×3cm\","
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "note: \"295×354px (300dpi)\","
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "canvas.width = spec.w;"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "canvas.height = spec.h;"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(\"fail\"))), \"image/jpeg\", 0.92)"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "a.download = `photo_${spec.w}x${spec.h}.jpg`;"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "img.src = imgUrl;"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "onCropComplete={(_, px) => setArea(px)}"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "const mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "area.x, area.y, area.width, area.height,"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "0, 0, spec.w, spec.h"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "a.href = URL.createObjectURL(blob);"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "style={{ top: \"8%\" }}"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "style={{ top: \"84%\" }}"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": ">정수리</span>"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": ">턱</span>"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "style={{ left: \"50%\" }}"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "{/* 얼굴 가이드라인 — 여권: 머리가 세로 70~80% 차지 */}"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "정수리와 턱을 노란 점선 사이"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "<div className=\"absolute inset-0 pointer-events-none\">"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "aspect={spec.w / spec.h}"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "const fittingWidth = Math.min(width, containerWidth);"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "if (fittingWidth > fittingHeight * aspect) return {"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "box-shadow: 0 0 0 9999em;"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "color: rgba(0, 0, 0, 0.5);"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "min={1}"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "max={3}"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "const MAX_ZOOM = 3;"
      },
      {
        "file": "node_modules/react-easy-crop/index.js",
        "quote": "restrictPosition: true,"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "setCrop({ x: 0, y: 0 });"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "setZoom(1);"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "onClick={() => setSpec(s)}"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "if (!imgUrl || !area) return;"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "await img.decode();"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "} finally {"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "setImgUrl(URL.createObjectURL(file));"
      },
      {
        "file": "src/app/tools/passport-photo/page.tsx",
        "quote": "setSaveError(\"이 사진을 열지 못해 저장하지 못했습니다."
      }
    ]
  },
  "money-hangul": {
    "intro": [
      "입력칸에는 숫자만 남습니다. 쉼표·공백·'원'·마이너스 기호는 지워지고, 소수점이 있으면 그 아래(원 단위 미만)는 버립니다. '만'·'억' 같은 글자를 섞어 쓰면 그 글자는 빠지고 입력칸 아래에 안내가 뜹니다. 남은 숫자는 세 자리마다 쉼표를 넣어 다시 표시되고 변환은 이 숫자를 기준으로 하며, 0이거나 빈 칸이면 결과가 나오지 않습니다.",
      "세 결과는 같은 금액을 네 자리씩 끊어 만·억·조 단위로 읽습니다. 계약서용과 갖은자는 십·백·천 앞의 '일'까지 살려 1000만 원을 '일금일천만원정', '金壹仟萬원整'으로 적고, 읽기용은 '천만 원'처럼 '일'을 뺍니다. 읽기용은 맨 앞의 '일만'만 '만'으로 줄이고(만 오천 원) '일억'·'일조'는 그대로 두며, 만·억·조 뒤에서 띄어 씁니다."
    ],
    "guide": {
      "title": "결과가 이상할 때 확인할 것",
      "items": [
        "소수점이 있는 금액을 붙여 넣으면 원 단위 미만은 버리고, 그렇게 했다는 안내가 입력칸 아래에 뜹니다",
        "'만'·'억'을 글자로 섞어 쓰면 그 글자는 빠지고 숫자만 남아 금액이 달라집니다. 안내가 뜨면 숫자로 모두 입력하거나 50만~1억 금액 버튼을 쓰세요",
        "약 9천조 원보다 큰 금액은 끝자리를 정확히 다룰 수 없어 변환하지 않고, 그렇다는 안내만 나옵니다",
        "'복사'를 눌러도 '복사됨'으로 바뀌지 않으면 이 브라우저에서 클립보드를 쓸 수 없는 경우이니, 결과 글자를 직접 선택해 복사하세요"
      ]
    },
    "faq": [
      {
        "q": "갖은자 결과에 '원'만 한글로 나와요",
        "a": "이 변환기는 갖은자를 '金'으로 시작해 '원整'으로 끝나는 모양으로 만들어, 단위인 '원'은 한글로 둡니다. 문서 양식이 '원'까지 한자를 요구하면 복사한 뒤 그 글자만 고쳐 쓰세요."
      },
      {
        "q": "중간에 0이 많은 금액도 제대로 나오나요?",
        "a": "네. 네 자리 묶음 전체가 0이면 그 단위는 건너뛰고, 묶음 안의 0인 자리도 읽지 않습니다. 그래서 1억 원은 '일금일억원정', 읽기용으로는 '일억 원'이 됩니다."
      }
    ],
    "evidence": [
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "setRaw(v.split(\".\")[0].replace(/[^\\d]/g, \"\"));"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "raw.replace(/^0+/, \"\").replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\")"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "const amount = Number(raw || 0);"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "const valid = amount > 0 && result.contract !== \"\";"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "{valid && ("
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "amount > Number.MAX_SAFE_INTEGER"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "return { contract: \"\", gajeun: \"\", reading: \"\" };"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const group = amount % 10000;"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const BIG = [\"\", \"만\", \"억\", \"조\", \"경\"];"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const contractBody = convert(amount, DIGITS, SMALL, BIG, true);"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const gajeunBody = convert(amount, DIGITS_GAJEUN, SMALL_GAJEUN, BIG_GAJEUN, true);"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const digit = d === 1 && pos > 0 && !explicitOne ? \"\" : digits[d];"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const readingBody = convert(amount, DIGITS, SMALL, BIG, false)"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": ".replace(/^일만/, \"만\")"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "// 선두의 '일만'은 '만'으로 (만 오천 원) — 단 일억·일조는 '일'을 유지"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": ".replace(/(경|조|억|만)/g, \"$1 \")"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "reading: `${readingBody} 원`,"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "contract: `일금${contractBody}원정`,"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "gajeun: `金${gajeunBody}원整`,"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const DIGITS_GAJEUN = [\"\", \"壹\", \"貳\", \"參\", \"肆\", \"伍\", \"陸\", \"柒\", \"捌\", \"玖\"];"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "const SMALL_GAJEUN = [\"\", \"拾\", \"佰\", \"仟\"];"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "const PRESETS = [500_000, 1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000];"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "? `${p / 100_000_000}억`"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "? `${p / 10_000}만`"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "if (group > 0) {"
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "if (d === 0) continue;"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "await navigator.clipboard.writeText(value);"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "{copied ? \"✓ 복사됨\" : \"복사\"}"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "/* clipboard unavailable */"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "import { toHangul } from \"./converter\";"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "setDropped(/[만억조경천백십]/.test(v) ? \"unit\" : v.includes(\".\") ? \"decimal\" : null);"
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "소수점 아래(원 단위 미만)는 버리고 원 단위까지만 변환합니다."
      },
      {
        "file": "src/app/tools/money-hangul/page.tsx",
        "quote": "약 9천조 원보다 큰 금액은 정확히 다룰 수 없어 변환하지 않습니다."
      },
      {
        "file": "src/app/tools/money-hangul/converter.ts",
        "quote": "amount > Number.MAX_SAFE_INTEGER"
      }
    ]
  }
};
