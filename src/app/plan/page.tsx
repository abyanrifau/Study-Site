import type { Metadata } from "next";
import { PlanView } from "@/components/PlanView";

export const metadata: Metadata = { title: "Revision plan" };

export default function PlanPage() {
  return <PlanView />;
}
