// Offene-Posten-Listen je DLR aus BC (Entity openLedgerExportFiles, siehe bc-client.ts).
// Jeder DLR darf nur die Liste der eigenen DLR-Ziffer laden (OP1 fuer DLR 1 usw.); Admin und
// die DLR-gleichgestellten Logins mit Sicht auf alle Mandanten sehen alle neun und das ZIP.
import { downloadBcMedia, listBcOpenLedgerFiles, type BcOpenLedgerEntry } from "@/lib/bc-client";
import { DLR_ZIFFER_ZU_DIENSTSITZ } from "@/lib/bc-companies";

export type OffenePostenDatei = {
  ziffer: string; // "1".."9" oder "alle" (ZIP)
  bezeichnung: string;
  filename: string;
  snapshotDateTime: string;
  byteSize?: number;
};

export const DLR_ZIFFERN = Object.keys(DLR_ZIFFER_ZU_DIENSTSITZ).sort();

// DLR-Ziffer eines DLR-Logins: der Benutzername ist der Dienstsitz (siehe DLR_ZIFFER_ZU_DIENSTSITZ).
export function zifferFuerBenutzer(username: string): string | undefined {
  return DLR_ZIFFERN.find((z) => DLR_ZIFFER_ZU_DIENSTSITZ[z].includes(username));
}

export function bezeichnungFuerZiffer(ziffer: string): string {
  return ziffer === "alle" ? "Alle DLR (ZIP)" : `DLR ${ziffer} (${DLR_ZIFFER_ZU_DIENSTSITZ[ziffer]?.join(" / ") ?? ""})`;
}

function zuDatei(e: BcOpenLedgerEntry): OffenePostenDatei | null {
  const ziffer = e.fileType === "zip" ? "alle" : e.groupCode;
  if (e.fileType !== "zip" && !DLR_ZIFFERN.includes(ziffer)) return null;
  return { ziffer, bezeichnung: bezeichnungFuerZiffer(ziffer), filename: e.filename, snapshotDateTime: e.snapshotDateTime, byteSize: e.byteSize };
}

// Aktuelle Dateien (je DLR eine, dazu das ZIP), nach DLR sortiert, ZIP zuletzt.
export async function getOffenePostenDateien(): Promise<OffenePostenDatei[]> {
  const eintraege = await listBcOpenLedgerFiles();
  return eintraege
    .map(zuDatei)
    .filter((d): d is OffenePostenDatei => d !== null)
    .sort((a, b) => (a.ziffer === "alle" ? 1 : b.ziffer === "alle" ? -1 : Number(a.ziffer) - Number(b.ziffer)));
}

export async function ladeOffenePostenDatei(
  ziffer: string,
): Promise<{ filename: string; contentType?: string; buffer: ArrayBuffer } | null> {
  const eintraege = await listBcOpenLedgerFiles();
  const e = eintraege.find((x) => (ziffer === "alle" ? x.fileType === "zip" : x.fileType === "xlsx" && x.groupCode === ziffer));
  if (!e) return null;
  return { filename: e.filename, contentType: e.contentType, buffer: await downloadBcMedia(e) };
}
