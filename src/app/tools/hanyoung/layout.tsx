import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("hanyoung");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="hanyoung">{children}</ToolShell>;
}
