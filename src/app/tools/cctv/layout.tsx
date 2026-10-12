import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("cctv");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="cctv">{children}</ToolShell>;
}
