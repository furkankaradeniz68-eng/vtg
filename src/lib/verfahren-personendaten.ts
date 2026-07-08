// Personenbezogene Verfahrensdaten (TG-Vorsitzender Name/Adresse, Koordinaten).
// Analog zu credentials.ts liegen diese Daten ausschliesslich in der
// git-ignorierten VERFAHREN_PERSONENDATEN_JSON env var, nicht im Repo.

type Personendaten = {
  vorsitzender: { name: string; strasse: string; plzOrt: string };
  koordinaten?: { lat: number; lng: number };
};

type PersonendatenMap = Record<string, Personendaten>;

let cached: PersonendatenMap | null = null;

function loadPersonendaten(): PersonendatenMap {
  if (cached) return cached;
  const raw = process.env.VERFAHREN_PERSONENDATEN_JSON;
  if (!raw) throw new Error("VERFAHREN_PERSONENDATEN_JSON ist nicht gesetzt.");
  const parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as Record<
    string,
    { vorsitzender: Personendaten["vorsitzender"]; koordinaten: Personendaten["koordinaten"] | null }
  >;
  cached = Object.fromEntries(
    Object.entries(parsed).map(([nr, v]) => [
      nr,
      { vorsitzender: v.vorsitzender, koordinaten: v.koordinaten ?? undefined },
    ]),
  );
  return cached;
}

export function getPersonendaten(nr: string): Personendaten | undefined {
  return loadPersonendaten()[nr];
}
