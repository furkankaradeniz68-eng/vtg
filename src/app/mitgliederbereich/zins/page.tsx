import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";

export const metadata: Metadata = { title: "Zins | VTG Rheinland-Pfalz" };

export default function ZinsPage() {
  return <MitgliederPlatzhalter title="Zins" />;
}
