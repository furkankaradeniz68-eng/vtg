import type { Metadata } from "next";
import FinanzberichtSeite from "@/components/FinanzberichtSeite";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Einnahmen (Laufzeit) | VTG Rheinland-Pfalz" };

export default async function EinnahmenLaufzeitPage({
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
      ansicht="laufzeit"
      verfahrenId={id}
      laufzeitHref={`/mitgliederbereich/einnahmen-laufzeit${query}`}
      haushaltsjahrHref={`/mitgliederbereich/einnahmen-haushaltsjahr${query}`}
    />
  );
}
