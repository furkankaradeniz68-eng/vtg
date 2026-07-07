import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";

export const metadata: Metadata = { title: "Energiekostenzuschlag | VTG Rheinland-Pfalz" };

export default function EnergiekostenzuschlagPage() {
  return <MitgliederPlatzhalter title="Energiekostenzuschlag" />;
}
