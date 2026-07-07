import type { Metadata } from "next";
import MitgliederPlatzhalter from "@/components/MitgliederPlatzhalter";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Zins | VTG Rheinland-Pfalz" };

export default async function ZinsPage() {
  await requireSession();
  return <MitgliederPlatzhalter title="Zins" />;
}
