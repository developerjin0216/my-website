import type { Metadata } from "next";
import CalcShell from "@/components/calculators/CalcShell";
import { getCalc } from "@/data/calculators";

const calc = getCalc("bmi");

export const metadata: Metadata = {
  title: calc.metaTitle,
  description: calc.metaDescription,
  keywords: calc.keywords,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalcShell id="bmi">{children}</CalcShell>;
}
