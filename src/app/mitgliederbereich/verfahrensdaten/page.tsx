import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Verfahrensdaten | VTG Rheinland-Pfalz" };

export default async function VerfahrensdatenPage() {
  await requireSession();
  return <MitgliederPlatzhalter title="Verfahrensdaten" />;
}
