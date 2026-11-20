import Link from "next/link";
import { getCalc } from "@/data/calculators";
import { getGuide } from "@/data/guides";
import { getHelp } from "@/data/help";

// 섹션을 넘나드는 '이어서 볼 것' 카드 (서버 컴포넌트).
//
// /help 는 다른 /help 글로만, /calculators 는 다른 계산기로만 이어졌습니다.
// 급한 상황 글에서 금액을 확인하는 계산기로 넘어가는 길, 계산기에서 같은 상황의
// 대처법으로 돌아가는 길을 카드 하나로 통일해 두었습니다(lib/crossLinks.ts 참고).
// 아이콘·제목·설명은 원본 데이터에서 그대로 가져오고 여기서 새로 쓰지 않습니다.

export type RelatedKind = "계산기" | "가이드" | "대처법";

export interface RelatedItem {
  href: string;
  title: string;
  description: string;
  icon: string;
  kind: RelatedKind;
}

const KIND_STYLE: Record<RelatedKind, string> = {
  계산기: "text-[#27AE60] border-[#27AE60]/40",
  가이드: "text-accent border-accent/40",
  대처법: "text-[#5B86E5] border-[#5B86E5]/40",
};

export function calcItems(ids: string[]): RelatedItem[] {
  return ids.map((id) => {
    const c = getCalc(id);
    return {
      href: `/calculators/${id}`,
      title: c.name,
      description: c.card,
      icon: c.icon,
      kind: "계산기" as const,
    };
  });
}

export function guideItems(ids: string[]): RelatedItem[] {
  return ids.map((id) => {
    const g = getGuide(id);
    return {
      href: `/guides/${id}`,
      title: g.title,
      description: g.description,
      icon: g.icon,
      kind: "가이드" as const,
    };
  });
}

export function helpItems(ids: string[]): RelatedItem[] {
  return ids.map((id) => {
    const t = getHelp(id);
    return {
      href: `/help/${id}`,
      title: t.title,
      description: t.description,
      icon: t.icon,
      kind: "대처법" as const,
    };
  });
}

export default function RelatedCards({
  title,
  lead,
  items,
}: {
  title: string;
  lead?: string;
  items: RelatedItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="px-5 pb-4">
      <h2 className="text-base font-bold mb-3">{title}</h2>
      {lead && (
        <p className="text-xs text-[#a0a0b0] leading-relaxed mb-3 break-keep">
          {lead}
        </p>
      )}
      <div className="space-y-2.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start justify-between gap-3 rounded-xl px-4 py-3 bg-card border border-[#2a3a5a] hover:border-accent transition-colors"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#e8e8f0] break-keep">
                <span aria-hidden="true">{item.icon}</span> {item.title}
              </span>
              <span className="block text-xs text-[#a0a0b0] mt-1 leading-relaxed line-clamp-2 break-keep">
                {item.description}
              </span>
            </span>
            <span
              className={`shrink-0 text-[10px] rounded-full border px-2 py-0.5 mt-0.5 ${KIND_STYLE[item.kind]}`}
            >
              {item.kind}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
