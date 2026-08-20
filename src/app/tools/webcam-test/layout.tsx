import ToolShell from "@/components/tools/ToolShell";
import { buildToolMetadata } from "@/data/tools";

export const metadata = buildToolMetadata("webcam-test");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolShell id="webcam-test">{children}</ToolShell>;
}
