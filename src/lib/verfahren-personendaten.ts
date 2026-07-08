// Personenbezogene Verfahrensdaten (TG-Vorsitzender Name/Adresse, Koordinaten).
// Analog zu credentials.ts liegen diese Daten ausschliesslich in privatem
// Vercel-Blob-Speicher, nicht im Repo. Der ~60KB-JSON-Payload wuerde zusammen
// mit CREDENTIALS_JSON/SESSION_SECRET das 64KB-Gesamtlimit fuer Vercel-Env-Vars
// sprengen, daher kein Env-Var-Ansatz hier (siehe BLOB_READ_WRITE_TOKEN).

import { get } from "@vercel/blob";

const BLOB_PATHNAME = "verfahren-personendaten.json";

type Personendaten = {
  vorsitzender: { name: string; strasse: string; plzOrt: string };
  koordinaten?: { lat: number; lng: number };
};

type PersonendatenMap = Record<string, Personendaten>;

let cachedPromise: Promise<PersonendatenMap> | null = null;

async function loadPersonendaten(): Promise<PersonendatenMap> {
  if (!cachedPromise) {
    cachedPromise = (async () => {
      const result = await get(BLOB_PATHNAME, { access: "private" });
      if (!result || result.statusCode !== 200) {
        throw new Error("Verfahren-Personendaten-Blob nicht gefunden.");
      }
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text) as Record<
        string,
        { vorsitzender: Personendaten["vorsitzender"]; koordinaten: Personendaten["koordinaten"] | null }
      >;
      return Object.fromEntries(
        Object.entries(parsed).map(([nr, v]) => [
          nr,
          { vorsitzender: v.vorsitzender, koordinaten: v.koordinaten ?? undefined },
        ]),
      );
    })();
  }
  return cachedPromise;
}

export async function getPersonendaten(nr: string): Promise<Personendaten | undefined> {
  const map = await loadPersonendaten();
  return map[nr];
}
