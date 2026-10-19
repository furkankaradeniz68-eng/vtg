import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { erstelleUmringeBericht } from "@/lib/bc-umringe-pruefung";

// Vorlaeufige Testseite fuer die Umstellung der Karte auf BC-Daten: ruft die BC-
// Sandbox (nur lesend) ab und liefert einen Bericht. Nur fuer den Admin; laeuft
// serverseitig mit den vorhandenen BC-Zugangsdaten, die dabei nie ausgegeben werden.
// Nach der Umstellung wieder entfernen.
export const maxDuration = 300;

export async function GET() {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }
  const bericht = await erstelleUmringeBericht();
  return new NextResponse(bericht, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
