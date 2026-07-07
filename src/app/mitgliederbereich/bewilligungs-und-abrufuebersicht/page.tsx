import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";

export const metadata: Metadata = { title: "Bewilligungs- und Abrufübersicht | VTG Rheinland-Pfalz" };

export default function BewilligungsUndAbrufuebersichtPage() {
  return <MitgliederPlatzhalter title="Bewilligungs- und Abrufübersicht" />;
}
