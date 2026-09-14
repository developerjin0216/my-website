import type { ReactElement, ReactNode } from "react";
import type { ArtKey } from "@/data/escape";

// 방탈출 퍼즐 삽화 — 전부 손으로 그린 인라인 SVG입니다.
//
// 왜 SVG인가: 퍼즐에 필요한 관찰 정보를 글 목록으로 주면 읽는 순간 답이 보입니다.
// 그림으로 옮기면 세어보고 비교해야 해서 난이도가 올라가고, 저작권 문제도 없으며,
// 서버 렌더되어 레이아웃 이동 없이 SEO에도 안전합니다.
//
// ESCAPE_ART가 ArtKey 전체를 덮는 Record라, 데이터에 새 art 키를 추가하고 여기에
// 그림을 만들지 않으면 타입 검사에서 걸립니다.

const PAPER = "#e6e0d0"; // 누런 종이
const PAPER_DARK = "#d6cdb8";
const INK = "#2f2f3a";
const INK_FADE = "#6b665f"; // 바랜 잉크
const GOLD = "#ffd700";

/** 사람 실루엣 — 필름 컷·사진 속 인물 */
function Figure({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={INK} opacity="0.75">
      <circle cx="0" cy="-6" r="3.2" />
      <path d="M-4.2 0 Q0 -2.5 4.2 0 L3.4 9 L-3.4 9 Z" />
    </g>
  );
}

/** 종이 한 장 */
function Paper({
  x,
  y,
  w,
  h,
  tilt = 0,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tilt?: number;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect
        width={w}
        height={h}
        rx="2"
        fill={PAPER}
        stroke={PAPER_DARK}
        strokeWidth="1"
      />
      {children}
    </g>
  );
}

function Frame({ children, viewBox }: { children: ReactNode; viewBox: string }) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      className="w-full h-auto rounded-xl bg-[#12192b] border border-[#2a3a5a]"
      style={{ display: "block" }}
    >
      {children}
    </svg>
  );
}

// ───────────────────────── 1. 접수대장 ─────────────────────────

const LEDGER_ROWS: [string, string, string, "" | "cancel" | "taken"][] = [
  ["0311", "김영호", "증명 2매", ""],
  ["0312", "정미숙", "가족 1매", ""],
  ["0313", "강태수", "여권 4매", ""],
  ["0314", "서미라", "단체 1매", "cancel"],
  ["0315", "오경자", "돌 3매", ""],
  ["0316", "남궁현", "증명 2매", ""],
  ["0318", "이정옥", "여권 2매", ""],
  ["0319", "김영호", "증명 2매", "cancel"],
  ["0320", "박정우", "가족 2매", "taken"],
  ["0321", "정미숙", "가족 2매", ""],
  ["0322", "강태수", "여권 4매", ""],
];

function Ledger(): ReactElement {
  return (
    <Frame viewBox="0 0 320 260">
      <Paper x={20} y={14} w={280} h={232}>
        <text x="14" y="22" fontSize="11" fill={INK} fontWeight="700">
          접 수 대 장
        </text>
        <text x="196" y="22" fontSize="9" fill={INK_FADE}>
          1998년 3월
        </text>
        <line x1="12" y1="30" x2="268" y2="30" stroke={INK} strokeWidth="1" />
        <text x="16" y="44" fontSize="8" fill={INK_FADE}>
          번호
        </text>
        <text x="70" y="44" fontSize="8" fill={INK_FADE}>
          성명
        </text>
        <text x="140" y="44" fontSize="8" fill={INK_FADE}>
          내용
        </text>
        <text x="212" y="44" fontSize="8" fill={INK_FADE}>
          비고
        </text>
        {LEDGER_ROWS.map(([no, name, item, mark], i) => {
          const y = 62 + i * 16;
          return (
            <g key={no}>
              <line
                x1="12"
                y1={y + 4}
                x2="268"
                y2={y + 4}
                stroke={PAPER_DARK}
                strokeWidth="0.5"
              />
              <text x="16" y={y} fontSize="10" fill={INK} fontWeight="600">
                {no}
              </text>
              <text x="70" y={y} fontSize="10" fill={INK}>
                {name}
              </text>
              <text x="140" y={y} fontSize="10" fill={INK}>
                {item}
              </text>
              {mark === "cancel" && (
                <>
                  <line
                    x1="14"
                    y1={y - 3}
                    x2="200"
                    y2={y - 3}
                    stroke="#a33"
                    strokeWidth="1.2"
                  />
                  <text x="212" y={y} fontSize="9" fill="#a33">
                    취소
                  </text>
                </>
              )}
              {mark === "taken" && (
                <text x="212" y={y} fontSize="9" fill="#2c6e49">
                  ✓찾아감
                </text>
              )}
            </g>
          );
        })}
      </Paper>
    </Frame>
  );
}

// ───────────────────────── 2. 봉투 꽂이 ─────────────────────────

function EnvelopeRack(): ReactElement {
  const slots = ["김", "남궁", null, "서", "이"];
  const names = [
    "강태수",
    "김영호",
    "남궁현",
    "박정우",
    "박한수",
    "서미라",
    "오경자",
    "이정옥",
    "정미숙",
  ];
  return (
    <Frame viewBox="0 0 320 250">
      <text x="20" y="20" fontSize="10" fill={GOLD}>
        봉투 꽂이 (성 가나다순)
      </text>
      {slots.map((s, i) => {
        const x = 20 + i * 57;
        return (
          <g key={i}>
            <rect
              x={x}
              y={30}
              width="50"
              height="62"
              rx="3"
              fill={s ? PAPER : "none"}
              stroke={s ? PAPER_DARK : "#4a5a7a"}
              strokeWidth="1"
              strokeDasharray={s ? "0" : "3 3"}
            />
            {s ? (
              <>
                <rect x={x} y={30} width="50" height="16" fill={PAPER_DARK} />
                <text
                  x={x + 25}
                  y={42}
                  fontSize="10"
                  fill={INK}
                  textAnchor="middle"
                  fontWeight="700"
                >
                  {s}
                </text>
                <path
                  d={`M${x + 4} 50 L${x + 25} 66 L${x + 46} 50`}
                  fill="none"
                  stroke={PAPER_DARK}
                  strokeWidth="1"
                />
              </>
            ) : (
              <text
                x={x + 25}
                y={65}
                fontSize="18"
                fill="#4a5a7a"
                textAnchor="middle"
              >
                ?
              </text>
            )}
          </g>
        );
      })}
      <line x1="16" y1="96" x2="304" y2="96" stroke="#3a4a6a" strokeWidth="2" />

      {/* 바닥에 떨어진 봉투 */}
      <g transform="translate(22 112) rotate(-6)">
        <rect width="96" height="52" rx="2" fill={PAPER} stroke={PAPER_DARK} />
        <path d="M2 2 L48 32 L94 2" fill="none" stroke={PAPER_DARK} />
        <text x="12" y="44" fontSize="8" fill={INK_FADE}>
          받는 사람
        </text>
        <rect x="46" y="36" width="42" height="10" fill="#b9ae95" opacity="0.8" />
        <text x="52" y="44" fontSize="7" fill="#8a7f68">
          번져 지워짐
        </text>
      </g>

      {/* 명함꽂이 단골 명단 */}
      <g transform="translate(140 106)">
        <rect width="160" height="128" rx="3" fill={PAPER} stroke={PAPER_DARK} />
        <text x="10" y="18" fontSize="9" fill={INK} fontWeight="700">
          명함꽂이 · 단골 명단
        </text>
        <line x1="8" y1="24" x2="152" y2="24" stroke={PAPER_DARK} />
        {names.map((n, i) => (
          <text
            key={n}
            x={12 + (i % 2) * 74}
            y={40 + Math.floor(i / 2) * 18}
            fontSize="10"
            fill={INK}
          >
            {n}
          </text>
        ))}
      </g>
    </Frame>
  );
}

// ───────────────────────── 3. 벽에 걸린 사진 ─────────────────────────

// [달력 연도, 왼쪽 끝 잘린 인물 있음] — 걸린 순서는 연도순이 아님
const WALL: [number, boolean][] = [
  [1994, true],
  [2005, false],
  [1981, true],
  [1997, true],
  [1985, true],
  [1990, true],
];

function PhotoWall(): ReactElement {
  return (
    <Frame viewBox="0 0 320 230">
      {WALL.map(([year, hasMan], i) => {
        const x = 18 + (i % 3) * 98;
        const y = 18 + Math.floor(i / 3) * 104;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect width="86" height="88" rx="2" fill="#5a4a32" />
            <rect x="5" y="5" width="76" height="78" fill="#cfc6b0" />
            {/* 벽에 걸린 달력 */}
            <rect x="58" y="10" width="19" height="15" fill={PAPER} stroke="#9a9080" strokeWidth="0.5" />
            <rect x="58" y="10" width="19" height="4" fill="#a33" />
            <text x="67.5" y="22" fontSize="6.5" fill={INK} textAnchor="middle" fontWeight="700">
              {year}
            </text>
            {/* 사람들 */}
            <Figure x={30} y={62} s={1.1} />
            <Figure x={45} y={62} s={1.1} />
            <Figure x={60} y={62} s={1.1} />
            {/* 왼쪽 끝에서 반쯤 잘린 사람 */}
            {hasMan && (
              <g>
                <clipPath id={`clip-${i}`}>
                  <rect x="5" y="40" width="10" height="43" />
                </clipPath>
                <g clipPath={`url(#clip-${i})`}>
                  <Figure x={12} y={62} s={1.1} />
                </g>
              </g>
            )}
            <rect x="5" y="5" width="76" height="78" fill="none" stroke="#3a3226" strokeWidth="0.8" />
          </g>
        );
      })}
    </Frame>
  );
}

// ───────────────────────── 4. 서류 세 장 ─────────────────────────

function Documents(): ReactElement {
  return (
    <Frame viewBox="0 0 320 230">
      <Paper x={16} y={16} w={140} h={96} tilt={-2}>
        <text x="10" y="18" fontSize="9" fill={INK} fontWeight="700">
          사업자등록증
        </text>
        <line x1="8" y1="24" x2="132" y2="24" stroke={PAPER_DARK} />
        <text x="10" y="42" fontSize="8" fill={INK_FADE}>
          상호
        </text>
        <text x="52" y="42" fontSize="9" fill={INK}>
          한빛사진관
        </text>
        <text x="10" y="60" fontSize="8" fill={INK_FADE}>
          대표
        </text>
        <text x="52" y="60" fontSize="9" fill={INK}>
          조성일
        </text>
        <text x="10" y="78" fontSize="8" fill={INK_FADE}>
          개업연월일
        </text>
        <text x="66" y="78" fontSize="10" fill={INK} fontWeight="700">
          1998. 04. 02.
        </text>
      </Paper>

      <Paper x={170} y={22} w={134} h={82} tilt={3}>
        <text x="10" y="18" fontSize="9" fill={INK} fontWeight="700">
          임대차계약서
        </text>
        <line x1="8" y1="24" x2="126" y2="24" stroke={PAPER_DARK} />
        <text x="10" y="44" fontSize="8" fill={INK_FADE}>
          계약 갱신일
        </text>
        <text x="10" y="62" fontSize="10" fill={INK} fontWeight="700">
          1994. 04. 02.
        </text>
      </Paper>

      {/* 액자 뒷면 — 볼펜 메모 */}
      <g transform="translate(60 126)">
        <rect width="200" height="88" rx="2" fill="#6b5a3e" />
        <rect x="8" y="8" width="184" height="72" fill="#7d6a4a" />
        <text x="20" y="34" fontSize="8" fill="#e4d9be">
          — 액자 뒷면 —
        </text>
        <text
          x="20"
          y="58"
          fontSize="13"
          fill="#f0e6cc"
          fontStyle="italic"
          letterSpacing="0.5"
        >
          개업 기념 1981. 4. 2.
        </text>
      </g>
    </Frame>
  );
}

// ───────────────────────── 5. 필름 선반 ─────────────────────────

// 뒤섞인 연도 — 1990~2001 중 1998만 없음
const SHELF_TOP = [1995, 1991, 1999, 1993, 2001, 1990];
const SHELF_BOTTOM = [1997, 1994, 2000, 1992, 1996];

function Shelf(): ReactElement {
  const box = (year: number, x: number, y: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <rect width="44" height="46" rx="2" fill="#8a7a5e" stroke="#5f5340" />
      <rect x="4" y="8" width="36" height="14" fill={PAPER} stroke={PAPER_DARK} strokeWidth="0.5" />
      <text x="22" y="19" fontSize="9.5" fill={INK} textAnchor="middle" fontWeight="700">
        {year}
      </text>
      <line x1="4" y1="32" x2="40" y2="32" stroke="#5f5340" strokeWidth="0.7" />
      <line x1="4" y1="38" x2="40" y2="38" stroke="#5f5340" strokeWidth="0.7" />
    </g>
  );
  return (
    <Frame viewBox="0 0 320 190">
      <rect x="10" y="12" width="300" height="166" rx="3" fill="#241d14" />
      {SHELF_TOP.map((y, i) => box(y, 20 + i * 48, 22, `t${y}`))}
      <rect x="14" y="70" width="292" height="5" fill="#4a3f2c" />
      {SHELF_BOTTOM.map((y, i) => box(y, 20 + i * 48, 84, `b${y}`))}
      <rect x="14" y="132" width="292" height="5" fill="#4a3f2c" />
      <text x="20" y="160" fontSize="9" fill="#8a9ab0">
        선반 두 단 · 정리하다 만 상태
      </text>
    </Frame>
  );
}

// ───────────────────────── 6. 롤 번호 대조표 ─────────────────────────

const RULE_ROWS: [string, string, string][] = [
  ["1995", "0128", "95128"],
  ["2001", "0007", "01007"],
  ["1988", "0245", "88245"],
  ["2003", "0045", "?"],
];

function RuleCard(): ReactElement {
  return (
    <Frame viewBox="0 0 320 190">
      <Paper x={26} y={16} w={268} h={158}>
        <text x="14" y="22" fontSize="11" fill={INK} fontWeight="700">
          롤 번호 대조표
        </text>
        <line x1="12" y1="30" x2="256" y2="30" stroke={INK} />
        {["접수 연도", "접수번호", "롤 번호"].map((h, i) => (
          <text key={h} x={22 + i * 82} y="46" fontSize="9" fill={INK_FADE}>
            {h}
          </text>
        ))}
        {RULE_ROWS.map(([y, no, roll], i) => {
          const ty = 70 + i * 24;
          const isBlank = roll === "?";
          return (
            <g key={y}>
              <line x1="12" y1={ty + 6} x2="256" y2={ty + 6} stroke={PAPER_DARK} strokeWidth="0.6" />
              <text x="22" y={ty} fontSize="11" fill={INK}>
                {y}
              </text>
              <text x="104" y={ty} fontSize="11" fill={INK}>
                {no}
              </text>
              <text
                x="186"
                y={ty}
                fontSize="12"
                fill={isBlank ? "#a33" : INK}
                fontWeight="700"
              >
                {roll}
              </text>
            </g>
          );
        })}
      </Paper>
    </Frame>
  );
}

// ───────────────────────── 7. 자물쇠 ─────────────────────────

function Lock(): ReactElement {
  return (
    <Frame viewBox="0 0 320 190">
      <path
        d="M120 84 L120 58 A40 40 0 0 1 200 58 L200 84"
        fill="none"
        stroke="#9aa4b4"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <rect x="72" y="82" width="176" height="82" rx="10" fill="#3d4757" stroke="#6a7688" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={86 + i * 32} y={100} width="24" height="46" rx="3" fill="#1c2331" />
          <text x={98 + i * 32} y={129} fontSize="16" fill="#8c98ac" textAnchor="middle" fontFamily="monospace">
            0
          </text>
          <path d={`M${92 + i * 32} 108 l6 -5 l6 5`} fill="none" stroke="#5a6678" strokeWidth="1.2" />
          <path d={`M${92 + i * 32} 138 l6 5 l6 -5`} fill="none" stroke="#5a6678" strokeWidth="1.2" />
        </g>
      ))}
      <text x="252" y="76" fontSize="11" fill={GOLD} fontFamily="monospace">
        ROLL
      </text>
      <path d="M246 64 l40 0" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
    </Frame>
  );
}

// ───────────────────────── 8. 약품통 ─────────────────────────

// [이름, 남은 비율] — 먼저 쓰는 약품일수록 적게 남음
const BOTTLES: [string, number][] = [
  ["정착", 0.7],
  ["수세", 0.9],
  ["현상", 0.2],
  ["정지", 0.45],
];

function Chemicals(): ReactElement {
  return (
    <Frame viewBox="0 0 320 200">
      {BOTTLES.map(([name, ratio], i) => {
        const x = 26 + i * 72;
        const bodyTop = 44;
        const bodyH = 108;
        const liquidH = bodyH * ratio;
        return (
          <g key={name}>
            <rect x={x + 16} y={30} width="18" height="16" rx="2" fill="#4a5568" />
            <rect
              x={x}
              y={bodyTop}
              width="50"
              height={bodyH}
              rx="5"
              fill="#1c2331"
              stroke="#5a6678"
              strokeWidth="1.5"
            />
            <rect
              x={x + 3}
              y={bodyTop + (bodyH - liquidH) - 1}
              width="44"
              height={liquidH - 2}
              rx="3"
              fill="#3b6ea5"
              opacity="0.85"
            />
            {/* 눈금 */}
            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={x + 34}
                y1={bodyTop + bodyH * (1 - t)}
                x2={x + 47}
                y2={bodyTop + bodyH * (1 - t)}
                stroke="#8c98ac"
                strokeWidth="0.8"
              />
            ))}
            <rect x={x + 4} y={bodyTop + 30} width="42" height="18" rx="2" fill={PAPER} />
            <text
              x={x + 25}
              y={bodyTop + 43}
              fontSize="11"
              fill={INK}
              textAnchor="middle"
              fontWeight="700"
            >
              {name}
            </text>
            <text x={x + 25} y={172} fontSize="9" fill="#8a9ab0" textAnchor="middle">
              {i + 1}번 통
            </text>
          </g>
        );
      })}
      <text x="26" y="192" fontSize="9" fill="#6b7a90">
        같은 날 새로 채운 네 통 · 눈금을 비교할 것
      </text>
    </Frame>
  );
}

// ───────────────────────── 9. 두 권의 장부 ─────────────────────────

// [일, 성명, 내용, 필체] — a: 눌러쓴 각진 글씨 / b: 흘려 쓴 둥근 글씨
const MARCH: [string, string, string, "a" | "b"][] = [
  ["02", "김영호", "증명 2매", "a"],
  ["03", "정미숙", "가족 1매", "a"],
  ["05", "강태수", "여권 4매", "a"],
  ["06", "서미라", "단체 1매", "a"],
  ["09", "오경자", "돌 3매", "a"],
  ["10", "김영호", "증명 2매", "a"],
  ["12", "남궁현", "증명 2매", "a"],
  ["13", "이정옥", "여권 2매", "a"],
  ["15", "강태수", "여권 4매", "a"],
  ["16", "오경자", "돌 3매", "a"],
  ["18", "김영호", "증명 2매", "b"],
  ["19", "서미라", "단체 1매", "b"],
  ["20", "이정옥", "증명 2매", "b"],
  ["23", "정미숙", "가족 2매", "b"],
  ["24", "남궁현", "증명 2매", "b"],
  ["26", "강태수", "여권 4매", "b"],
  ["27", "오경자", "돌 3매", "b"],
];

function TwoLedgers(): ReactElement {
  return (
    <Frame viewBox="0 0 320 330">
      <Paper x={20} y={12} w={280} h={306}>
        <text x="14" y="22" fontSize="11" fill={INK} fontWeight="700">
          접 수 일 지
        </text>
        <text x="200" y="22" fontSize="9" fill={INK_FADE}>
          1998년 3월
        </text>
        <line x1="12" y1="30" x2="268" y2="30" stroke={INK} />
        {MARCH.map(([d, name, item, hand], i) => {
          const y = 48 + i * 16;
          const angular = hand === "a";
          return (
            <g key={d}>
              <line x1="12" y1={y + 4} x2="268" y2={y + 4} stroke={PAPER_DARK} strokeWidth="0.4" />
              <text
                x="16"
                y={y}
                fontSize="10"
                fill={INK}
                fontWeight={angular ? "700" : "400"}
                fontStyle={angular ? "normal" : "italic"}
                letterSpacing={angular ? "0.6" : "-0.2"}
              >
                3. {d}
              </text>
              <text
                x="74"
                y={y}
                fontSize="10"
                fill={INK}
                fontWeight={angular ? "700" : "400"}
                fontStyle={angular ? "normal" : "italic"}
                letterSpacing={angular ? "0.6" : "-0.2"}
              >
                {name}
              </text>
              <text
                x="150"
                y={y}
                fontSize="10"
                fill={INK}
                fontWeight={angular ? "700" : "400"}
                fontStyle={angular ? "normal" : "italic"}
                letterSpacing={angular ? "0.6" : "-0.2"}
              >
                {item}
              </text>
            </g>
          );
        })}
      </Paper>
      <text x="20" y="328" fontSize="8" fill="#6b7a90">
        굵고 각진 글씨 / 기울어진 둥근 글씨 — 쉬는 날은 줄 자체가 없음
      </text>
    </Frame>
  );
}

// ───────────────────────── 10. 필름 스트립 ─────────────────────────

const CUTS: [number, number][] = [
  [21, 2],
  [22, 3],
  [23, 1],
  [24, 4],
  [25, 3],
  [26, 0],
];

function Filmstrip(): ReactElement {
  return (
    <Frame viewBox="0 0 320 230">
      {/* 접수증 */}
      <Paper x={80} y={12} w={160} h={52}>
        <text x="12" y="18" fontSize="8" fill={INK_FADE}>
          접 수 증
        </text>
        <text x="12" y="34" fontSize="9.5" fill={INK} fontWeight="700">
          롤 98317
        </text>
        <text x="12" y="47" fontSize="9" fill={INK}>
          조건: 4인 가족 전원 · 1매
        </text>
      </Paper>

      {/* 필름 */}
      <rect x="8" y="84" width="304" height="104" fill="#1a1208" />
      {[0, 1].map((row) =>
        Array.from({ length: 19 }, (_, i) => (
          <rect
            key={`${row}-${i}`}
            x={14 + i * 16}
            y={row === 0 ? 89 : 174}
            width="8"
            height="7"
            rx="1.5"
            fill="#0c0906"
          />
        ))
      )}
      {CUTS.map(([no, people], i) => {
        const x = 14 + i * 49;
        return (
          <g key={no}>
            <rect x={x} y={102} width="45" height="64" fill="#d8cfae" />
            {Array.from({ length: people }, (_, k) => (
              <Figure key={k} x={x + 10 + k * 8.5} y={144} s={0.85} />
            ))}
            {people === 0 && (
              <>
                <rect x={x} y={102} width="45" height="64" fill="#b8b09a" opacity="0.6" />
                <text x={x + 22} y={138} fontSize="7" fill="#6b6456" textAnchor="middle">
                  초점 흐림
                </text>
              </>
            )}
            <text x={x + 22} y={200} fontSize="10" fill={GOLD} textAnchor="middle" fontFamily="monospace">
              {no}
            </text>
          </g>
        );
      })}
      <text x="12" y="222" fontSize="8" fill="#6b7a90">
        현상해 걸어둔 필름 스트립 · 컷 번호는 아래에
      </text>
    </Frame>
  );
}

// ───────────────────────── 11. 간판 ─────────────────────────

function Signboard(): ReactElement {
  return (
    <Frame viewBox="0 0 320 190">
      <rect x="16" y="34" width="288" height="108" rx="4" fill="#6b5636" stroke="#493a24" strokeWidth="2" />
      <rect x="24" y="42" width="272" height="92" fill="#7b6440" />
      {/* 덧칠 벗겨진 얼룩 */}
      <ellipse cx="120" cy="88" rx="86" ry="40" fill="#8c744c" opacity="0.5" />

      {/* 앞 두 글자 — 아래쪽 획 자국만 남음 */}
      <g stroke="#413523" strokeWidth="3.4" fill="none" strokeLinecap="round">
        {/* 첫 글자: 세로 기둥 + 가로획 + 받침 가로선 */}
        <path d="M46 68 L46 96" />
        <path d="M46 82 L70 82" />
        <path d="M70 66 L70 96" />
        <path d="M40 108 L78 108" />
        {/* 둘째 글자: ㅅ 갈래 + 아래 모음, 받침 없음 */}
        <path d="M108 68 L96 92" />
        <path d="M108 68 L120 92" />
        <path d="M108 96 L108 106" />
      </g>
      <text x="42" y="126" fontSize="7.5" fill="#c9b48a">
        받침 있음
      </text>
      <text x="94" y="126" fontSize="7.5" fill="#c9b48a">
        받침 없음
      </text>

      {/* 뒤 세 글자 — 선명 */}
      <text x="150" y="100" fontSize="38" fill="#2e2417" fontWeight="800" letterSpacing="2">
        사진관
      </text>

      <text x="16" y="164" fontSize="9" fill="#8a9ab0">
        받쳐둔 자리에서 나온 나무 간판 · 덧칠 아래 눌린 자국
      </text>
      <text x="16" y="178" fontSize="9" fill="#6b7a90">
        지금 간판은 「한빛사진관」
      </text>
    </Frame>
  );
}

// ───────────────────────── 12. 마지막 봉투 ─────────────────────────

function EnvelopeArt(): ReactElement {
  return (
    <Frame viewBox="0 0 320 190">
      <g transform="translate(46 26)">
        <rect width="228" height="138" rx="3" fill={PAPER} stroke={PAPER_DARK} strokeWidth="1.5" />
        <path d="M2 2 L114 78 L226 2" fill="none" stroke={PAPER_DARK} strokeWidth="1.2" />
        <text x="26" y="102" fontSize="11" fill={INK_FADE}>
          받는 사람
        </text>
        <line x1="84" y1="104" x2="196" y2="104" stroke={INK} strokeWidth="1" />
        <text x="200" y="102" fontSize="11" fill={INK_FADE}>
          님
        </text>
        <text x="26" y="124" fontSize="8.5" fill={INK_FADE}>
          접수 1998. 03. 17. · 롤 98317 · 1매
        </text>
      </g>
      <text x="46" y="180" fontSize="9" fill="#6b7a90">
        스물여덟 해 동안 꽂이에서 자리를 지킨 봉투
      </text>
    </Frame>
  );
}

// ───────────────────────── 내보내기 ─────────────────────────

export const ESCAPE_ART: Record<ArtKey, () => ReactElement> = {
  ledger: Ledger,
  "envelope-rack": EnvelopeRack,
  "photo-wall": PhotoWall,
  documents: Documents,
  shelf: Shelf,
  "rule-card": RuleCard,
  lock: Lock,
  chemicals: Chemicals,
  "two-ledgers": TwoLedgers,
  filmstrip: Filmstrip,
  signboard: Signboard,
  envelope: EnvelopeArt,
};

export default function EscapeArt({ art }: { art: ArtKey }): ReactElement {
  const Art = ESCAPE_ART[art];
  return <Art />;
}
