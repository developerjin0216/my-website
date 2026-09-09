import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnShell from "@/components/en/EnShell";
import { Sec, GuideTable } from "@/components/guides/GuideShell";
import { buildEnMetadata, enGuides } from "@/data/guidesEn";
import { enGuideContent } from "@/data/guidesEnContent";

// Data-driven /en guide renderer — serves guides whose body lives in
// guidesEnContent.ts. The original six hand-written JSX guides have their own
// static folders, which take precedence over this dynamic route.

export function generateStaticParams() {
  return Object.keys(enGuideContent).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!enGuideContent[id] || !enGuides.some((g) => g.id === id)) return {};
  return buildEnMetadata(id);
}

export default async function EnDataGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = enGuideContent[id];
  if (!content || !enGuides.some((g) => g.id === id)) notFound();

  return (
    <EnShell id={id}>
      <p className="text-sm text-[#c0c8d8] leading-relaxed">{content.intro}</p>
      {content.sections.map((sec) => (
        <Sec key={sec.title} title={sec.title}>
          {sec.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {sec.table && (
            <GuideTable headers={sec.table.headers} rows={sec.table.rows} />
          )}
        </Sec>
      ))}
    </EnShell>
  );
}
