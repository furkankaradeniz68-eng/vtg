import { NextResponse } from "next/server";
import { syncBc } from "@/lib/bc-sync";
import { statistikText, syncUmringeVonBc, umringeAusBcAktiv } from "@/lib/bc-umringe";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Vercel Cron sendet automatisch "Authorization: Bearer $CRON_SECRET", wenn
// die Env-Var CRON_SECRET gesetzt ist. Zusaetzlich erreichbar per manuellem
// GET mit demselben Bearer-Token (z.B. fuer einen "Jetzt aktualisieren"-Button
// im Admin-Bereich, spaeter).
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET ist nicht gesetzt." }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mandantendaten und Verfahrensumringe laufen unabhaengig voneinander: scheitert das eine,
  // bleibt der letzte Stand des anderen trotzdem aktuell. Bei einem Fehler antwortet die Route
  // mit 502, damit Vercel den Lauf als fehlgeschlagen zeigt.
  const mandanten = await syncBc().then(
    (r) => ({ ok: true as const, ...r }),
    (e) => ({ ok: false as const, error: e instanceof Error ? e.message : "Unbekannter Fehler" }),
  );
  // Verfahrensumringe: erst nach Freigabe (BC_UMRINGE_QUELLE=produktion).
  const umringe = umringeAusBcAktiv()
    ? await syncUmringeVonBc("produktion").then(
        (r) => ({ ok: true as const, mandanten: Object.keys(r.daten.voll).length, protokoll: statistikText(r.statistik) }),
        (e) => ({ ok: false as const, error: e instanceof Error ? e.message : String(e) }),
      )
    : undefined;

  const body = { ok: mandanten.ok && (umringe?.ok ?? true), mandanten, ...(umringe ? { umringe } : {}) };
  // Nur zur Kontrolle im Vercel-Protokoll (Laufzeit-Logs); enthaelt keine Daten.
  console.info(`bc-sync: Mandantendaten ${mandanten.ok ? "ok" : "FEHLER"}${umringe ? `; Umringe ${umringe.ok ? `ok (${umringe.mandanten} Mandanten; ${umringe.protokoll})` : "FEHLER"}` : ""}`);
  return NextResponse.json(body, { status: body.ok ? 200 : 502 });
}
