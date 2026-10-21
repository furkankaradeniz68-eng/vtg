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

  try {
    const result = await syncBc();
    // Verfahrensumringe: erst nach Freigabe (BC_UMRINGE_QUELLE=produktion). Ein Fehler hier
    // laesst den Abgleich der Mandantendaten nicht scheitern; der letzte Stand bleibt erhalten.
    let umringe: string | undefined;
    if (umringeAusBcAktiv()) {
      umringe = await syncUmringeVonBc("produktion")
        .then((r) => `ok (${Object.keys(r.daten.voll).length} Mandanten; ${statistikText(r.statistik)})`)
        .catch((e) => `Fehler: ${e instanceof Error ? e.message : String(e)}`);
    }
    return NextResponse.json({ ok: true, ...result, ...(umringe ? { umringe } : {}) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unbekannter Fehler" }, { status: 502 });
  }
}
