"use client";

import { useMemo, useState } from "react";
import { mitglieder, type Mitglied } from "@/lib/mitglieder";

type SortKey = keyof Mitglied;
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "nr", label: "Produkt-Nr." },
  { key: "name", label: "TG-Name" },
  { key: "dlr", label: "zuständiges DLR" },
  { key: "dienstsitz", label: "Dienstsitz" },
];

const pageSizeOptions = [10, 25, 50, 100];

function SortIcon({ state }: { state: "asc" | "desc" | null }) {
  return (
    <span className="ml-1 inline-flex flex-col align-middle leading-none">
      <svg viewBox="0 0 10 6" className={`h-[5px] w-[8px] ${state === "asc" ? "text-neutral-900" : "text-neutral-300"}`}>
        <path d="M5 0 10 6H0Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 10 6" className={`mt-[2px] h-[5px] w-[8px] ${state === "desc" ? "text-neutral-900" : "text-neutral-300"}`}>
        <path d="M5 6 0 0h10Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}

export default function MitgliederTable() {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

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

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => a[sortKey].localeCompare(b[sortKey], "de") * dir);
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  const pageRows = sorted.slice(start - 1, end);

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded border border-neutral-300 px-2 py-1 focus:border-vtg-orange focus:outline-none"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          Einträge anzeigen
        </label>
        <label className="flex items-center gap-2">
          Suchen:
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="rounded border border-neutral-300 px-3 py-1 focus:border-vtg-orange focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-300 bg-vtg-yellow text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="cursor-pointer select-none p-3 font-heading"
                >
                  {col.label}
                  <SortIcon state={sortKey === col.key ? sortDir : null} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((m) => (
              <tr key={m.nr} className="border-b border-neutral-100">
                <td className="p-3 text-neutral-600">{m.nr}</td>
                <td className="p-3 text-neutral-900">{m.name}</td>
                <td className="p-3 text-neutral-600">{m.dlr}</td>
                <td className="p-3 text-neutral-600">{m.dienstsitz}</td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-neutral-500">
                  Keine Einträge vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <p>
          {start} bis {end} von {total} Einträgen
          {query.trim() && ` (gefiltert von ${mitglieder.length} Einträgen)`}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border border-neutral-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ❮
          </button>
          {pageNumbers(currentPage, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2">
                …
              </span>
            ) : (
              <button
                type="button"
                key={p}
                onClick={() => goToPage(p)}
                className={`rounded border px-3 py-1 ${
                  p === currentPage
                    ? "border-vtg-orange bg-vtg-orange text-white"
                    : "border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border border-neutral-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
}
