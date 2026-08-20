import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("qr-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="qr-generator">{children}</ToolShell>;
}
