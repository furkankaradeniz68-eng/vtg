"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SimpleTable from "@/components/SimpleTable";
import type { PersonEntry } from "@/lib/personen";

export default function PersonenSearchTable({
  people,
  pageLabels,
}: {
  people: PersonEntry[];
  pageLabels: Record<string, string>;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => {
      const haystack = [p.name, p.role, pageLabels[p.page] ?? p.page, p.section ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, people, pageLabels]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Person suchen (Name, Rolle, Seite, Bereich)…"
        className="mb-4 w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
      />
      {filtered.length > 0 ? (
        <SimpleTable
          columns={["Foto", "Name", "Rolle", "Seite / Bereich", ""]}
          rows={filtered.map((p) => [
            p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                width={40}
                height={56}
                className="h-14 w-10 rounded object-cover"
              />
            ) : (
              <span className="block h-14 w-10 rounded bg-neutral-100" />
            ),
            p.name,
            p.role,
            <span key={`${p.id}-page`}>
              {pageLabels[p.page] ?? p.page}
              {p.section && <span className="block text-xs text-neutral-500">{p.section}</span>}
            </span>,
            <div key={`${p.id}-actions`} className="flex items-center gap-3">
              <Link
                href={`/admin/personen/${p.id}/bearbeiten`}
                className="text-sm text-vtg-orange hover:underline"
              >
                Bearbeiten
              </Link>
              <form action="/api/personen/delete" method="POST">
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-sm text-red-600 hover:underline">
                  Entfernen
                </button>
              </form>
            </div>,
          ])}
        />
      ) : (
        <p className="text-base leading-relaxed text-neutral-700">Keine Person gefunden.</p>
      )}
    </div>
  );
}
