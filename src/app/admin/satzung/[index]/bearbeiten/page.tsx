import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSatzungParagraph } from "@/lib/satzung-inhalt";

export const metadata: Metadata = { title: "Satzung bearbeiten | VTG Rheinland-Pfalz" };

const inputClass = "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
const primaryButtonClass = "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

export default async function SatzungBearbeitenPage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index: rawIndex } = await params;
  const index = Number(rawIndex);
  if (!Number.isInteger(index) || index < 0) notFound();

  const paragraph = await getSatzungParagraph(index);
  if (!paragraph) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/admin?tab=ueberuns" className="mb-6 inline-block text-sm text-vtg-orange hover:underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-6 font-heading text-lg font-bold text-neutral-900">{paragraph.title} bearbeiten</h1>

      <form
        action="/api/satzung-inhalt/update"
        method="POST"
        className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input type="hidden" name="index" value={index} />
        <div>
          <label htmlFor="body" className={labelClass}>Text</label>
          <textarea
            id="body"
            name="body"
            required
            defaultValue={paragraph.body}
            rows={18}
            className={`${inputClass} font-mono`}
          />
          <p className="mt-1 text-xs text-neutral-500">
            Absätze durch eine Leerzeile trennen. Die Paragraphen-Überschrift selbst ist hier nicht änderbar.
          </p>
        </div>
        <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
          Speichern
        </button>
      </form>
    </section>
  );
}
