import CalcShell from "@/components/calculators/CalcShell";
import { buildCalcMetadata } from "@/data/calculators";

export const metadata = buildCalcMetadata("car-tax");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="car-tax">{children}</CalcShell>;
}
