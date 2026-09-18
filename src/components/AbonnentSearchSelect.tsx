"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Abonnent = { username: string; label: string };

export default function AbonnentSearchSelect({
  abonnenten,
  name = "username",
}: {
  abonnenten: Abonnent[];
  name?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Abonnent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return abonnenten;
    return abonnenten.filter((a) => a.label.toLowerCase().includes(q) || a.username.toLowerCase().includes(q));
  }, [query, abonnenten]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected?.username ?? ""} required />
      <input
        type="text"
        value={selected ? `${selected.label} (${selected.username})` : query}
        onChange={(e) => {
          setSelected(null);
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Mandant suchen…"
        autoComplete="off"
        className="w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
      />
      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-neutral-300 bg-white shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((a) => (
              <li key={a.username}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(a);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-vtg-yellow/40"
                >
                  {a.label} ({a.username})
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-neutral-500">Kein Treffer.</li>
          )}
        </ul>
      )}
    </div>
  );
}
