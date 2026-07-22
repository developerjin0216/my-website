import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("jeonse-fee");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="jeonse-fee">{children}</CalcShell>;
}
