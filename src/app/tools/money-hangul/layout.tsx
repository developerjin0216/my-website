import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("money-hangul");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="money-hangul">{children}</ToolShell>;
}
