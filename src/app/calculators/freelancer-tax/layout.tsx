import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("freelancer-tax");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="freelancer-tax">{children}</CalcShell>;
}
