import type { VobVolRow } from "@/lib/vob-vol";

// Gemeinsames Formular fuer "Neue Zeile" (src/app/bauleiter/neu/page.tsx) und
// "Zeile bearbeiten" (src/app/bauleiter/[id]/bearbeiten/page.tsx). Alle 18
// Originalspalten sind bewusst freie Text-Felder (siehe vob-vol.ts) — die
// Quelldaten enthalten in vermeintlich numerischen Spalten echten Freitext.
export const inputClass =
  "w-full border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none";
export const labelClass = "mb-1 block text-sm font-medium text-neutral-800";
export const primaryButtonClass =
  "bg-vtg-yellow px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-vtg-orange hover:text-white";

const FIELDS: { key: keyof Omit<VobVolRow, "id" | "updatedAt">; label: string }[] = [
  { key: "prodNr", label: "ProdNr" },
  { key: "jahr", label: "Jahr" },
  { key: "teilnehmergemeinschaft", label: "Teilnehmergemeinschaft" },
  { key: "aussenstelle", label: "VTG Außenstelle" },
  { key: "artDerLeistung", label: "Art der Leistung" },
  { key: "umfangDerLeistung", label: "Umfang der Leistung" },
  { key: "kwVon", label: "KW von" },
  { key: "kwBis", label: "KW bis" },
  { key: "vobVol", label: "VOB/VOL" },
  { key: "vergabeart", label: "Vergabeart" },
  { key: "kostenermittlung", label: "Kostenermittlung [EUR]" },
  { key: "anzahlAufforderungen", label: "Anzahl Aufforderungen" },
  { key: "anzahlAngebote", label: "Anzahl Angebote" },
  { key: "auftragsdatum", label: "Auftragsdatum" },
  { key: "auftragnehmer", label: "Auftragnehmer" },
  { key: "auftragssumme", label: "Auftragssumme [EUR brutto]" },
  { key: "vorabinfo", label: "Vorabinfo §20(4)" },
  { key: "infoZuschlag", label: "Info Zuschlag §20(3)/§30(1)" },
];

export default function VobVolForm({ action, row }: { action: string; row?: VobVolRow }) {
  return (
    <form
      action={action}
      method="POST"
      className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4"
    >
      {row && <input type="hidden" name="id" value={row.id} />}
      {FIELDS.map(({ key, label }) => (
        <div key={key}>
          <label htmlFor={key} className={labelClass}>
            {label}
          </label>
          <input id={key} name={key} defaultValue={row?.[key] ?? ""} className={inputClass} />
        </div>
      ))}
      <button type="submit" className={`mt-2 self-start ${primaryButtonClass}`}>
        Speichern
      </button>
    </form>
  );
}
