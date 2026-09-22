import type { Metadata } from "next";
import { UnitsList } from "@/components/UnitsList";
import { UNITS } from "@/lib/units";

export const metadata: Metadata = { title: "Units" };

export default function UnitsPage() {
  return <UnitsList units={UNITS} />;
}
