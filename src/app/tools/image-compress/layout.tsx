import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("image-compress");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="image-compress">{children}</ToolShell>;
}
