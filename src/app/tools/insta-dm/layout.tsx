import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("insta-dm");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="insta-dm">{children}</ToolShell>;
}
