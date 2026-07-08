import type { FinanzZeile } from "@/lib/finanzbericht-beispieldaten";

function formatEuro(n: number) {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function FinanzberichtTabelle({
  planLabel,
  zeilen,
}: {
  planLabel: string;
  zeilen: readonly FinanzZeile[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-3"></th>
            <th className="p-3 text-right font-heading">Ausgaben</th>
            <th className="p-3 text-right font-heading">{planLabel}</th>
            <th className="p-3 text-right font-heading">Differenz</th>
          </tr>
        </thead>
        <tbody>
          {zeilen.map((zeile, i) => {
            const hervorgehoben = zeile.typ === "gruppe" || zeile.typ === "gesamt";
            const differenz = zeile.plan - zeile.ausgaben;
            return (
              <tr
                key={i}
                className={
                  hervorgehoben
                    ? "bg-vtg-yellow font-medium text-neutral-900"
                    : "border-b border-neutral-100 text-neutral-700"
                }
              >
                <td className="p-3">{zeile.konto}</td>
                <td className="p-3 text-right">{formatEuro(zeile.ausgaben)}</td>
                <td className="p-3 text-right">{formatEuro(zeile.plan)}</td>
                <td className="p-3 text-right">{formatEuro(differenz)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
