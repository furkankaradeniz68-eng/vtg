// Einfaches Event-Log fuer den Analytics-Tab im Admin-Bereich: wer hat sich
// wie oft eingeloggt, wer hat wie oft welche Datei heruntergeladen. Analog zu
// downloads.ts liegen die Daten in privatem Vercel-Blob-Speicher, nicht im
// Repo oder einer Datenbank (die es in diesem Projekt bewusst nicht gibt).
import { put, get } from "@vercel/blob";
import { BLOB_TOKEN, blobAbortSignal } from "@/lib/blob-token";
import type { SessionRole } from "@/lib/auth";

const META_PATHNAME = "analytics-events.json";

// Deckelt die Log-Datei auf die juengsten Events, damit sie nicht unbegrenzt
// waechst (bei taeglichem Betrieb reichen ein paar tausend Events fuer
// mehrere Monate Historie).
const MAX_EVENTS = 5000;

export type AnalyticsEventType = "login" | "download";

export type AnalyticsEvent = {
  type: AnalyticsEventType;
  username: string;
  role: SessionRole;
  // Bei Downloads z. B. der Dateiname/Berichtstitel, bei Logins ungenutzt.
  label?: string;
  at: string;
};

async function loadEvents(): Promise<AnalyticsEvent[]> {
  const result = await get(META_PATHNAME, {
    access: "private",
    useCache: false,
    token: BLOB_TOKEN,
    abortSignal: blobAbortSignal(),
  }).catch(() => null);
  if (!result || result.statusCode !== 200) return [];
  const text = await new Response(result.stream).text();
  try {
    return JSON.parse(text) as AnalyticsEvent[];
  } catch {
    return [];
  }
}

async function saveEvents(events: AnalyticsEvent[]): Promise<void> {
  await put(META_PATHNAME, JSON.stringify(events), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: BLOB_TOKEN,
  });
}

// Bewusst fehlertolerant: ein haengender/fehlschlagender Blob-Zugriff beim
// Mitschreiben darf niemals den eigentlichen Login- oder Download-Vorgang
// zum Scheitern bringen — Analytics ist "best effort".
export async function recordEvent(event: Omit<AnalyticsEvent, "at">): Promise<void> {
  try {
    const events = await loadEvents();
    events.push({ ...event, at: new Date().toISOString() });
    const trimmed = events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events;
    await saveEvents(trimmed);
  } catch {
    // still swallow — siehe Kommentar oben.
  }
}

export type UserStat = {
  username: string;
  role: SessionRole;
  loginCount: number;
  lastLoginAt?: string;
  downloadCount: number;
  lastDownloadAt?: string;
};

// Aggregiert die Rohevents pro Benutzer fuer die Uebersichtstabelle im
// Admin-Bereich. Sortiert nach Gesamtaktivitaet (Logins + Downloads) absteigend.
export async function getUserStats(): Promise<UserStat[]> {
  const events = await loadEvents();
  const byUser = new Map<string, UserStat>();

  for (const e of events) {
    let stat = byUser.get(e.username);
    if (!stat) {
      stat = { username: e.username, role: e.role, loginCount: 0, downloadCount: 0 };
      byUser.set(e.username, stat);
    }
    // Neuestes Event gewinnt bei der angezeigten Rolle (falls sich die
    // Rolle eines Benutzers je aendert).
    stat.role = e.role;
    if (e.type === "login") {
      stat.loginCount += 1;
      if (!stat.lastLoginAt || e.at > stat.lastLoginAt) stat.lastLoginAt = e.at;
    } else {
      stat.downloadCount += 1;
      if (!stat.lastDownloadAt || e.at > stat.lastDownloadAt) stat.lastDownloadAt = e.at;
    }
  }

  return Array.from(byUser.values()).sort(
    (a, b) => b.loginCount + b.downloadCount - (a.loginCount + a.downloadCount),
  );
}

// Juengste Rohevents fuer den Aktivitaets-Feed, neueste zuerst.
export async function getRecentEvents(limit = 50): Promise<AnalyticsEvent[]> {
  const events = await loadEvents();
  return events.slice(-limit).reverse();
}
