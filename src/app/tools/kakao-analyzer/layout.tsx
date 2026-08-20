import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("kakao-analyzer");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="kakao-analyzer">{children}</ToolShell>;
}
