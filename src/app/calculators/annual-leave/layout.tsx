import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("annual-leave");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="annual-leave">{children}</CalcShell>;
}
