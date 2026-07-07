import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Umlage | VTG Rheinland-Pfalz" };

export default async function UmlagePage() {
  await requireSession();
  return <MitgliederPlatzhalter title="Umlage" />;
}
