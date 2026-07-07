import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";
import { requireInternSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Bewilligungs- und Abrufübersicht | VTG Rheinland-Pfalz" };

export default async function BewilligungsUndAbrufuebersichtPage() {
  await requireInternSession();
  return <MitgliederPlatzhalter title="Bewilligungs- und Abrufübersicht" />;
}
