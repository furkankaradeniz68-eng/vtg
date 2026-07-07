import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";
import { requireInternSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Verfahrensauswahl | VTG Rheinland-Pfalz" };

export default async function VerfahrensauswahlPage() {
  await requireInternSession();
  return <MitgliederPlatzhalter title="Verfahrensauswahl" />;
}
