import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("card-deduction");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="card-deduction">{children}</CalcShell>;
}
