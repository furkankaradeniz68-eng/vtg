import { NextResponse } from "next/server";
import { requireBauleiterSession } from "@/lib/auth";
import { updateVobVolRow, type VobVolRowInput } from "@/lib/vob-vol";

const FIELD_KEYS: (keyof VobVolRowInput)[] = [
  "prodNr",
  "jahr",
  "teilnehmergemeinschaft",
  "aussenstelle",
  "artDerLeistung",
  "umfangDerLeistung",
  "kwVon",
  "kwBis",
  "vobVol",
  "vergabeart",
  "kostenermittlung",
  "anzahlAufforderungen",
  "anzahlAngebote",
  "auftragsdatum",
  "auftragnehmer",
  "auftragssumme",
  "vorabinfo",
  "infoZuschlag",
];

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  await requireBauleiterSession();

  const form = await request.formData();
  const id = form.get("id");
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  const data = Object.fromEntries(FIELD_KEYS.map((key) => [key, str(form, key)])) as unknown as VobVolRowInput;

  await updateVobVolRow(id, data);

  return NextResponse.redirect(new URL("/bauleiter", request.url), 303);
}
