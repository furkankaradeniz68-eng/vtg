import type { Metadata } from "next";
import Link from "next/link";
import VobVolForm from "@/components/VobVolForm";

export const metadata: Metadata = { title: "Neue Zeile | VTG Bauleiter-Dashboard" };

export default function BauleiterNeuPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/bauleiter" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">Neue Zeile</h1>
      <VobVolForm action="/api/vob-vol/add" />
    </section>
  );
}
