import { Dashboard } from "@/components/Dashboard";
import { UNITS } from "@/lib/units";

export default function HomePage() {
  return <Dashboard units={UNITS} />;
}
