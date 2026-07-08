import type { Metadata } from "next";
import FinanzberichtSeite from "@/components/FinanzberichtSeite";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Einnahmen (Haushaltsjahr) | VTG Rheinland-Pfalz" };

export default async function EinnahmenHaushaltsjahrPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireSession();
  const { id } = await searchParams;
  const query = id ? `?id=${id}` : "";

  return (
    <FinanzberichtSeite
      kategorieSlug="einnahmen"
      ansicht="haushaltsjahr"
      verfahrenId={id}
      laufzeitHref={`/mitgliederbereich/einnahmen-laufzeit${query}`}
      haushaltsjahrHref={`/mitgliederbereich/einnahmen-haushaltsjahr${query}`}
    />
  );
}
