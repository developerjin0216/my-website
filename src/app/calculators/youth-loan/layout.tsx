import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("youth-loan");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="youth-loan">{children}</CalcShell>;
}
