import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";

export const metadata: Metadata = { title: "Umlage | VTG Rheinland-Pfalz" };

export default function UmlagePage() {
  return <MitgliederPlatzhalter title="Umlage" />;
}
