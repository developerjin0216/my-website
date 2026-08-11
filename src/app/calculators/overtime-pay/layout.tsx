import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("overtime-pay");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="overtime-pay">{children}</CalcShell>;
}
