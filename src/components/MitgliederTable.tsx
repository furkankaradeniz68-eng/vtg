"use client";

import { useMemo, useState } from "react";
import { mitglieder } from "@/lib/mitglieder";

export default function MitgliederTable() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mitglieder;
    return mitglieder.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nr.includes(q) ||
        m.dlr.toLowerCase().includes(q) ||
        m.dienstsitz.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Teilnehmergemeinschaft, DLR oder Dienstsitz suchen…"
        className="mb-4 w-full rounded border border-neutral-300 px-4 py-2 text-sm focus:border-vtg-orange focus:outline-none"
      />
      <p className="mb-3 text-sm text-neutral-500">
        {filtered.length} von {mitglieder.length} Teilnehmergemeinschaften
      </p>
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-neutral-50 text-left">
              <th className="p-3 font-heading">Produkt-Nr.</th>
              <th className="p-3 font-heading">TG-Name</th>
              <th className="p-3 font-heading">Zuständiges DLR</th>
              <th className="p-3 font-heading">Dienstsitz</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.nr} className="border-b border-neutral-100">
                <td className="p-3 text-neutral-600">{m.nr}</td>
                <td className="p-3 text-neutral-900">{m.name}</td>
                <td className="p-3 text-neutral-600">{m.dlr}</td>
                <td className="p-3 text-neutral-600">{m.dienstsitz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
