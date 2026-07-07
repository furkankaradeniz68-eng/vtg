import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";

export const metadata: Metadata = { title: "Verfahrensdaten | VTG Rheinland-Pfalz" };

export default function VerfahrensdatenPage() {
  return <MitgliederPlatzhalter title="Verfahrensdaten" />;
}
