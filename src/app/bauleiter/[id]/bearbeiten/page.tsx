import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVobVolRow } from "@/lib/vob-vol";
import VobVolForm from "@/components/VobVolForm";

export const metadata: Metadata = { title: "Zeile bearbeiten | VTG Bauleiter-Dashboard" };

export default async function BauleiterBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getVobVolRow(id);
  if (!row) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/bauleiter" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Zeile bearbeiten</h1>

      <VobVolForm action="/api/vob-vol/update" row={row} />

      <form action="/api/vob-vol/delete" method="POST" className="mt-4">
        <input type="hidden" name="id" value={row.id} />
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Zeile entfernen
        </button>
      </form>
    </section>
  );
}
