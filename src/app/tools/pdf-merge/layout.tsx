import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("pdf-merge");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="pdf-merge">{children}</ToolShell>;
}
