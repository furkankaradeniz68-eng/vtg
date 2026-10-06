export default function SimpleTable({
  columns,
  rows,
  compact = false,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  // Punkt 12 (Nacharbeiten-PDF): Fuer kleine Tabellen in schmalen Spalten
  // (z.B. Umlage) erzwingt die Standardbreite min-w-[420px] unnoetiges
  // Scrollen/Ueberlauf. compact=true verzichtet darauf und nutzt engeres
  // Zellen-Padding, ohne die anderen SimpleTable-Nutzungen zu beeinflussen.
  compact?: boolean;
}) {
  const cellPadding = compact ? "px-3 py-1.5" : "p-3";
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className={`w-full border-collapse text-sm ${compact ? "" : "min-w-[420px]"}`}>
        <thead>
          <tr className="border-b border-neutral-300 bg-vtg-yellow text-left">
            {columns.map((col) => (
              <th key={col} className={`${cellPadding} font-heading`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-100">
              {row.map((cell, j) => (
                <td key={j} className={`${cellPadding} text-neutral-700`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
