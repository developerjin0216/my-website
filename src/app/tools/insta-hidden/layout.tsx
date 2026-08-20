import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("insta-hidden");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="insta-hidden">{children}</ToolShell>;
}
