import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("severance");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="severance">{children}</CalcShell>;
}
