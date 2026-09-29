import type { Metadata } from "next";
import { getAllVobVolRows } from "@/lib/vob-vol";
import BauleiterVobVolTable from "@/components/BauleiterVobVolTable";

export const metadata: Metadata = { title: "Bauleiter-Dashboard | VTG Rheinland-Pfalz" };

export default async function BauleiterPage() {
  const rows = await getAllVobVolRows();

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-lg font-bold text-neutral-900">VOB/VOL-Vergaben</h1>
      <p className="mb-6 text-sm text-neutral-600">
        Zeilen hinzufügen, bearbeiten oder entfernen. Das öffentliche PDF auf der Website wird bei
        jedem Download live aus diesen Daten erzeugt.
      </p>
      <BauleiterVobVolTable rows={rows} />
    </section>
  );
}
