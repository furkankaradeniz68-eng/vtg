import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

// Liefert perspektivisch die naechtliche BC-ZIP (XLSX je Mandant, alle
// Mandanten zusammen) fuer DLRs. Anbindung folgt, sobald Erik die BC-
// Schnittstelle dafuer erweitert hat (Freigabe durch Maximilian steht noch
// aus) - bis dahin bewusst nur Zugriffsschutz + Platzhalter, damit beim
// spaeteren Anschluss nur noch der eigentliche BC-Abruf ergaenzt werden muss.
export async function GET() {
  const session = await requireSession();
  if (session.role !== "dlr" && session.role !== "admin") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  return NextResponse.json(
    { error: "TG-Einzeldaten-Export ist noch nicht angebunden." },
    { status: 503 },
  );
}
