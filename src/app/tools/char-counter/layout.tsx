import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("char-counter");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="char-counter">{children}</ToolShell>;
}
