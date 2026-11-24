// Zugangsdaten fuer die einzelne, geteilte "Bauleiter"-Kennung (Dashboard fuer
// VOB/VOL-Zeilen-CRUD unter /bauleiter). Bewusst NICHT in der bestehenden
// CREDENTIALS_JSON-Env-Var (admin/dlr, bcrypt-Hashes) untergebracht: deren
// aktueller Klartext-Inhalt ist hier nicht bekannt und eine Aenderung an einem
// production secret braucht eine gesonderte Freigabe. Stattdessen dasselbe
// Blob-JSON-Single-Entry-Muster wie site-images.ts/stellenausschreibung.ts —
// admin-los pflegbar (bei Bedarf ueber den Blob-Store direkt), kein Eingriff
// in Vercel-Env-Vars noetig.
import bcrypt from "bcryptjs";
import { ladeOderLegeAn, zurAnzeige } from "@/lib/blob-json";

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
  return ladeOderLegeAn<BauleiterCredential>(META_PATHNAME, DEFAULT_CREDENTIAL);
}

export async function verifyBauleiterCredential(username: string, password: string): Promise<boolean> {
  // Bei einem Lesefehler keine Anmeldung als Bauleiter (auch nicht mit den
  // Startdaten); die uebrigen Anmeldewege in verifyCredentials laufen weiter.
  const credential = await zurAnzeige<BauleiterCredential | null>(loadCredential, null);
  if (!credential) return false;
  if (username.trim() !== credential.username) return false;
  return bcrypt.compare(password, credential.passwordHash);
}
