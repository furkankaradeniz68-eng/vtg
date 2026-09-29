// Zugangsdaten fuer die einzelne, geteilte "Bauleiter"-Kennung (Dashboard fuer
// VOB/VOL-Zeilen-CRUD unter /bauleiter). Bewusst NICHT in der bestehenden
// CREDENTIALS_JSON-Env-Var (admin/dlr, bcrypt-Hashes) untergebracht: deren
// aktueller Klartext-Inhalt ist hier nicht bekannt und eine Aenderung an einem
// production secret braucht eine gesonderte Freigabe. Stattdessen dasselbe
// Blob-JSON-Single-Entry-Muster wie site-images.ts/stellenausschreibung.ts —
// admin-los pflegbar (bei Bedarf ueber den Blob-Store direkt), kein Eingriff
// in Vercel-Env-Vars noetig.
import { put, get } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";

const META_PATHNAME = "bauleiter-credentials.json";

export type BauleiterCredential = {
  username: string;
  passwordHash: string;
  updatedAt: string;
};

// bcrypt-Hash von "Vtg-Bauleiter26" (laut vom Nutzer gelieferter CSV), einmalig
// zur Implementierungszeit generiert.
const DEFAULT_CREDENTIAL: BauleiterCredential = {
  username: "Bauleiter",
  passwordHash: "$2b$10$SCG5bh4Qgbk2mk.sgCJlo.DiH7ONUCQK6yD7Pz19AARx4Y8nQwGfq",
  updatedAt: new Date(0).toISOString(),
};

async function loadCredential(): Promise<BauleiterCredential> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) {
    await saveCredential(DEFAULT_CREDENTIAL);
    return DEFAULT_CREDENTIAL;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as BauleiterCredential;
}

async function saveCredential(credential: BauleiterCredential): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(credential), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

export async function verifyBauleiterCredential(username: string, password: string): Promise<boolean> {
  const credential = await loadCredential();
  if (username.trim() !== credential.username) return false;
  return bcrypt.compare(password, credential.passwordHash);
}
