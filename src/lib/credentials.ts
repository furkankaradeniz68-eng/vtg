import bcrypt from "bcryptjs";
import type { SessionRole } from "@/lib/auth";

type AbonnentCredential = { username: string; passwordHash: string; label: string; dlr: string };
type DlrCredential = { username: string; passwordHash: string; dlrNr: string };
type AdminCredential = { username: string; passwordHash: string };

type CredentialsData = {
  abonnent: AbonnentCredential[];
  dlr: DlrCredential[];
  admin: AdminCredential[];
};

let cached: CredentialsData | null = null;

function loadCredentials(): CredentialsData {
  if (cached) return cached;
  const raw = process.env.CREDENTIALS_JSON;
  if (!raw) throw new Error("CREDENTIALS_JSON ist nicht gesetzt.");
  // Base64-encoded: bcrypt hashes contain `$`, which Next's .env loader
  // (dotenv-expand) otherwise treats as a variable reference and strips.
  cached = JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as CredentialsData;
  return cached;
}

export type VerifiedUser = { role: SessionRole; username: string } | null;

export async function verifyCredentials(username: string, password: string): Promise<VerifiedUser> {
  const creds = loadCredentials();
  const name = username.trim();

  const admin = creds.admin.find((a) => a.username === name);
  if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
    return { role: "admin", username: admin.username };
  }

  const dlr = creds.dlr.find((d) => d.username === name);
  if (dlr && (await bcrypt.compare(password, dlr.passwordHash))) {
    return { role: "dlr", username: dlr.username };
  }

  const abonnent = creds.abonnent.find((a) => a.username === name);
  if (abonnent && (await bcrypt.compare(password, abonnent.passwordHash))) {
    return { role: "abonnent", username: abonnent.username };
  }

  return null;
}
