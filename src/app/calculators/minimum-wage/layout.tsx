import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("minimum-wage");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="minimum-wage">{children}</CalcShell>;
}
