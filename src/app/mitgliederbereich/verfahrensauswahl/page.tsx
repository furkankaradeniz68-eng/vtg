import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";

export const metadata: Metadata = { title: "Verfahrensauswahl | VTG Rheinland-Pfalz" };

export default function VerfahrensauswahlPage() {
  return <MitgliederPlatzhalter title="Verfahrensauswahl" />;
}
