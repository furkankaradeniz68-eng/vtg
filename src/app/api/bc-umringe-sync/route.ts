import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { syncUmringeVonBc } from "@/lib/bc-umringe";

// Vorlaeufig: holt die Verfahrensumringe aus der BC-Sandbox in den Speicher (nur Admin).
// Die Admin-Testansicht der Karte (Verfahrensdaten, ?quelle=bc) liest sie von dort.
export const maxDuration = 300;

export async function GET() {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }
  const start = Date.now();
  try {
    const d = await syncUmringeVonBc();
    const teil = Object.values(d.voll).reduce((s, v) => s + v.coordinates.length, 0);
    const punkteVoll = Object.values(d.voll).reduce((s, v) => s + v.coordinates.reduce((a, p) => a + p.reduce((b, r) => b + r.length, 0), 0), 0);
    const punkteUeb = Object.values(d.uebersicht).reduce((s, v) => s + v.coordinates.reduce((a, p) => a + p.reduce((b, r) => b + r.length, 0), 0), 0);
    return new NextResponse(
      [
        `Abgleich der Verfahrensumringe aus BC (${d.umgebung}) abgeschlossen in ${((Date.now() - start) / 1000).toFixed(1)} s.`,
        `Datensätze: ${d.anzahlDatensaetze} · Mandanten: ${Object.keys(d.voll).length} · Teilpolygone: ${teil}`,
        `Punkte voll: ${punkteVoll.toLocaleString("de-DE")} · vereinfacht (Gesamtkarte): ${punkteUeb.toLocaleString("de-DE")}`,
        ``,
        `Testansicht: Verfahrensdaten eines Verfahrens öffnen und an die Adresse &quelle=bc anhängen.`,
      ].join("\n"),
      { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } },
    );
  } catch (err) {
    return new NextResponse(`Abgleich fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`, {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
