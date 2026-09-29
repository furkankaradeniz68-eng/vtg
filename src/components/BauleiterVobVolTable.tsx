"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { VobVolRow } from "@/lib/vob-vol";

// 421 Zeilen sind zu viel fuer eine ungefilterte Liste, daher ein einfacher
// Jahr-Filter (Client-Komponente, Server laedt alle Zeilen einmal). Default
// ist das neueste Jahr im Datenbestand.
export default function BauleiterVobVolTable({ rows }: { rows: VobVolRow[] }) {
  const years = useMemo(() => {
    const set = new Set(rows.map((r) => r.jahr).filter(Boolean));
    return Array.from(set).sort((a, b) => b.localeCompare(a, "de", { numeric: true }));
  }, [rows]);

  const [selectedYear, setSelectedYear] = useState<string>(years[0] ?? "");

  const filtered = useMemo(() => {
    if (!selectedYear) return rows;
    return rows.filter((r) => r.jahr === selectedYear);
  }, [rows, selectedYear]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="jahr-filter" className="text-sm font-medium text-neutral-800">
            Jahr
          </label>
          <select
            id="jahr-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded border border-neutral-300 px-2 py-1 text-sm focus:border-vtg-orange focus:outline-none"
          >
            <option value="">Alle Jahre</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/bauleiter/neu"
          className="bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white"
        >
          Neue Zeile
        </Link>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-vtg-yellow text-left">
                <th className="p-3 font-heading">ProdNr</th>
                <th className="p-3 font-heading">Jahr</th>
                <th className="p-3 font-heading">Teilnehmergemeinschaft</th>
                <th className="p-3 font-heading">Auftragnehmer</th>
                <th className="p-3 font-heading">Auftragssumme</th>
                <th className="p-3 font-heading"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-neutral-100">
                  <td className="p-3 text-neutral-700">{row.prodNr}</td>
                  <td className="p-3 text-neutral-700">{row.jahr}</td>
                  <td className="p-3 text-neutral-700">{row.teilnehmergemeinschaft}</td>
                  <td className="p-3 text-neutral-700">{row.auftragnehmer}</td>
                  <td className="p-3 text-neutral-700">{row.auftragssumme}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/bauleiter/${row.id}/bearbeiten`}
                      className="text-sm text-vtg-orange hover:underline"
                    >
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-neutral-700">Keine Zeilen für dieses Jahr.</p>
      )}
    </div>
  );
}
