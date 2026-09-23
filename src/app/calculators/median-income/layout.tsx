import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("median-income");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="median-income">{children}</CalcShell>;
}
