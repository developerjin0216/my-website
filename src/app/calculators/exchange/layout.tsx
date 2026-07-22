import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("exchange");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="exchange">{children}</CalcShell>;
}
