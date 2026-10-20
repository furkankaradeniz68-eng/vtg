import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBcToken } from "@/lib/bc-client";
import { BC_RLP_BASE_URL } from "@/lib/bc-config";

// Vorlaeufiges, rein LESENDES Hilfsmittel (nur Admin) zum Nachsehen, was die BC-API der
// Gruppe "rlp" liefert, z.B. ob die Offenen Posten bereits bereitgestellt werden.
//   /api/bc-probe                       -> Liste aller Entities (EntitySets) der API-Gruppe
//   /api/bc-probe?entity=NAME           -> Felder dieser Entity und die ersten Datensaetze
//                                          (ohne Dateiinhalte, nur Metadaten)
// Nach der Klaerung wieder entfernen.
export const maxDuration = 60;

const text = (body: string, status = 200) =>
  new NextResponse(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

async function bcGet(url: string): Promise<Response> {
  return fetch(url, { headers: { Authorization: `Bearer ${await getBcToken()}`, Accept: "application/json, application/xml" } });
}

export async function GET(request: Request) {
  const session = await getSession();
  if (session?.role !== "admin") return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });

  const entity = new URL(request.url).searchParams.get("entity");
  try {
    if (!entity) {
      // Metadaten der API-Gruppe (ohne Company-Segment)
      const groupBase = BC_RLP_BASE_URL.replace(/\/companies\(.*$/, "");
      const res = await bcGet(`${groupBase}/$metadata`);
      if (!res.ok) return text(`$metadata nicht abrufbar: HTTP ${res.status}`, 502);
      const xml = await res.text();
      const sets = [...xml.matchAll(/<EntitySet Name="([^"]+)" EntityType="([^"]+)"/g)].map((m) => `${m[1]}  (${m[2]})`);
      return text([`Entities der API-Gruppe rlp (${sets.length}):`, ...sets].join("\n"));
    }
    if (!/^[A-Za-z][A-Za-z0-9_]{1,60}$/.test(entity)) return text("Ungültiger Entity-Name.", 400);
    const res = await bcGet(`${BC_RLP_BASE_URL}/${entity}?$top=15`);
    if (!res.ok) return text(`${entity}: HTTP ${res.status}${res.status === 404 ? " (Entity existiert in dieser API-Gruppe nicht)" : ""}`, res.status === 404 ? 404 : 502);
    const data = (await res.json()) as { value?: Record<string, unknown>[] };
    const rows = data.value ?? [];
    const zeilen = [`${entity}: ${rows.length} Datensätze (erste 15)`];
    if (rows[0]) zeilen.push(`Felder: ${Object.keys(rows[0]).join(", ")}`);
    for (const r of rows) {
      zeilen.push(
        Object.entries(r)
          .filter(([k]) => !k.endsWith("@odata.mediaEditLink") && k !== "@odata.etag")
          .map(([k, v]) => `${k}=${typeof v === "string" ? v.slice(0, 80) : JSON.stringify(v)}`)
          .join(" · "),
      );
    }
    return text(zeilen.join("\n"));
  } catch (e) {
    return text(`Fehler: ${e instanceof Error ? e.message : String(e)}`, 502);
  }
}
