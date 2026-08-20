import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("exif-remover");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="exif-remover">{children}</ToolShell>;
}
