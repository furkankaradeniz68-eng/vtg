import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { del } from "@vercel/blob";
import { BLOB_TOKEN } from "@/lib/blob-token";
import { ALTER_BLOB_PATHNAME, statistikText, syncUmringeVonBc, type UmringeZiel } from "@/lib/bc-umringe";
import { leereUmringeCache } from "@/lib/verfahren-umringe";

// Holt die Verfahrensumringe aus BC in den Speicher (nur Admin). Standard: BC-Sandbox fuer die
// Admin-Testansicht der Karte (Verfahrensdaten, ?quelle=bc). Mit ?ziel=produktion die
// echten BC-Daten fuer die oeffentliche Karte (die erst mit BC_UMRINGE_QUELLE=produktion
// verwendet werden); der naechtliche Abgleich macht das danach automatisch. Mit &voll=1
// werden alle Geometrien unabhaengig vom Hash neu geladen.
export const maxDuration = 300;

export async function GET(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }
  const ziel: UmringeZiel = new URL(request.url).searchParams.get("ziel") === "produktion" ? "produktion" : "test";
  const vollstaendig = new URL(request.url).searchParams.get("voll") === "1";
  const start = Date.now();
  try {
    const { daten: d, statistik } = await syncUmringeVonBc(ziel, { vollstaendig });
    leereUmringeCache();
    await del(ALTER_BLOB_PATHNAME, { token: BLOB_TOKEN }).catch(() => {});
    const teil = Object.values(d.voll).reduce((s, v) => s + v.coordinates.length, 0);
    const punkteVoll = Object.values(d.voll).reduce((s, v) => s + v.coordinates.reduce((a, p) => a + p.reduce((b, r) => b + r.length, 0), 0), 0);
    const punkteUeb = Object.values(d.uebersicht).reduce((s, v) => s + v.coordinates.reduce((a, p) => a + p.reduce((b, r) => b + r.length, 0), 0), 0);
    return new NextResponse(
      [
        `Abgleich der Verfahrensumringe aus BC (${d.umgebung}, Ziel: ${ziel}) abgeschlossen in ${((Date.now() - start) / 1000).toFixed(1)} s.`,
        `Änderungen laut Hash${vollstaendig ? " (vollständiger Abgleich erzwungen)" : ""}: ${statistikText(statistik)}`,
        `Datensätze: ${d.anzahlDatensaetze} · Mandanten: ${Object.keys(d.voll).length} · Teilpolygone: ${teil}`,
        `Punkte voll: ${punkteVoll.toLocaleString("de-DE")} · vereinfacht (Gesamtkarte): ${punkteUeb.toLocaleString("de-DE")}`,
        ``,
        ziel === "test"
          ? `Testansicht: Verfahrensdaten eines Verfahrens öffnen und an die Adresse &quelle=bc anhängen.`
          : `Gespeichert für die öffentliche Karte. Sie wird erst verwendet, wenn BC_UMRINGE_QUELLE=produktion gesetzt ist.`,
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
