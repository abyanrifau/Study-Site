import type { Metadata } from "next";
import { Settings } from "@/components/Settings";
import { UNITS } from "@/lib/units";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <Settings units={UNITS} />;
}
