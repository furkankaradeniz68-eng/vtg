import type { Metadata } from "next";
import FinanzberichtSeite from "@/components/FinanzberichtSeite";
import { requireSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sonstige Ausführungskosten/A2 (Haushaltsjahr) | VTG Rheinland-Pfalz",
};

export default async function SonstigeAusfuehrungskostenA2HaushaltsjahrPage({
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
      kategorieSlug="sonstige-ausfuehrungskosten-a2"
      ansicht="haushaltsjahr"
      verfahrenId={id}
      session={session}
      laufzeitHref={`/mitgliederbereich/sonstige-ausfuehrungskosten-a2-laufzeit${query}`}
      haushaltsjahrHref={`/mitgliederbereich/sonstige-ausfuehrungskosten-a2-haushaltsjahr${query}`}
    />
  );
}
