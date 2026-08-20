import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("passport-photo");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="passport-photo">{children}</ToolShell>;
}
