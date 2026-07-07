import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Energiekostenzuschlag | VTG Rheinland-Pfalz" };

export default async function EnergiekostenzuschlagPage() {
  await requireSession();
  return <MitgliederPlatzhalter title="Energiekostenzuschlag" />;
}
