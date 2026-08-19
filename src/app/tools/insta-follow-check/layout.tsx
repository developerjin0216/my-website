import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("insta-follow-check");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="insta-follow-check">{children}</ToolShell>;
}
