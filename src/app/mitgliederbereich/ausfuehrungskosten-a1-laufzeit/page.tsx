import type { Metadata } from "next";
import FinanzberichtSeite from "@/components/FinanzberichtSeite";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Ausführungskosten/A1 (Laufzeit) | VTG Rheinland-Pfalz" };

export default async function AusfuehrungskostenA1LaufzeitPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await requireSession();
  const { id: rawId } = await searchParams;
  const id = rawId ?? (session.role === "abonnent" ? session.username : undefined);
  const query = id ? `?id=${id}` : "";

  return (
    <FinanzberichtSeite
      kategorieSlug="ausfuehrungskosten-a1"
      ansicht="laufzeit"
      verfahrenId={id}
      session={session}
      laufzeitHref={`/mitgliederbereich/ausfuehrungskosten-a1-laufzeit${query}`}
      haushaltsjahrHref={`/mitgliederbereich/ausfuehrungskosten-a1-haushaltsjahr${query}`}
    />
  );
}
