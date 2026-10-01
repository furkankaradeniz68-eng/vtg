"use client";

import { useMemo, useState } from "react";
import SimpleTable from "@/components/SimpleTable";
import type { UserStat, AnalyticsEvent } from "@/lib/analytics";

type UserSortKey = "username" | "role" | "logins" | "lastLogin" | "downloads" | "lastDownload";
type SortDir = "asc" | "desc";

function formatDateTimeShort(iso: string): string {
  return new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}

const headerButtonClass = "flex items-center gap-1 hover:text-vtg-orange";

function sortIndicator(active: boolean, dir: SortDir): string {
  if (!active) return "";
  return dir === "asc" ? " ▲" : " ▼";
}

export default function AnalyticsOverview({
  userStats,
  recentEvents,
  roleLabels,
}: {
  userStats: UserStat[];
  recentEvents: AnalyticsEvent[];
  roleLabels: Record<string, string>;
}) {
  const [userQuery, setUserQuery] = useState("");
  const [sortKey, setSortKey] = useState<UserSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [eventQuery, setEventQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    let list = userStats;
    if (q) {
      list = list.filter((u) => {
        const haystack = [u.username, roleLabels[u.role] ?? u.role].join(" ").toLowerCase();
        return haystack.includes(q);
      });
    }
    if (!sortKey) return list;
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "username":
          cmp = a.username.localeCompare(b.username);
          break;
        case "role":
          cmp = (roleLabels[a.role] ?? a.role).localeCompare(roleLabels[b.role] ?? b.role);
          break;
        case "logins":
          cmp = a.loginCount - b.loginCount;
          break;
        case "lastLogin":
          cmp = (a.lastLoginAt ?? "").localeCompare(b.lastLoginAt ?? "");
          break;
        case "downloads":
          cmp = a.downloadCount - b.downloadCount;
          break;
        case "lastDownload":
          cmp = (a.lastDownloadAt ?? "").localeCompare(b.lastDownloadAt ?? "");
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [userQuery, userStats, roleLabels, sortKey, sortDir]);

  const filteredEvents = useMemo(() => {
    const q = eventQuery.trim().toLowerCase();
    if (!q) return recentEvents;
    return recentEvents.filter((e) => {
      const haystack = [e.username, roleLabels[e.role] ?? e.role, e.type === "login" ? "Login" : "Download", e.label ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [eventQuery, recentEvents, roleLabels]);

  function toggleSort(key: UserSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Benutzer suchen (Name, Rolle)…"
          className="w-full max-w-sm border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
        />
        {sortKey && (
          <button
            type="button"
            onClick={() => setSortKey(null)}
            className="text-sm text-neutral-500 hover:text-vtg-orange hover:underline"
          >
            Sortierung zurücksetzen
          </button>
        )}
      </div>

      {filteredUsers.length > 0 ? (
        <div className="mb-12 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-vtg-yellow text-left">
                <th className="p-3 font-heading">
                  <button type="button" onClick={() => toggleSort("username")} className={headerButtonClass}>
                    Benutzer{sortIndicator(sortKey === "username", sortDir)}
                  </button>
                </th>
                <th className="p-3 font-heading">
                  <button type="button" onClick={() => toggleSort("role")} className={headerButtonClass}>
                    Rolle{sortIndicator(sortKey === "role", sortDir)}
                  </button>
                </th>
                <th className="p-3 font-heading">
                  <button type="button" onClick={() => toggleSort("logins")} className={headerButtonClass}>
                    Logins{sortIndicator(sortKey === "logins", sortDir)}
                  </button>
                </th>
                <th className="p-3 font-heading">
                  <button type="button" onClick={() => toggleSort("lastLogin")} className={headerButtonClass}>
                    Letzter Login{sortIndicator(sortKey === "lastLogin", sortDir)}
                  </button>
                </th>
                <th className="p-3 font-heading">
                  <button type="button" onClick={() => toggleSort("downloads")} className={headerButtonClass}>
                    Downloads{sortIndicator(sortKey === "downloads", sortDir)}
                  </button>
                </th>
                <th className="p-3 font-heading">
                  <button type="button" onClick={() => toggleSort("lastDownload")} className={headerButtonClass}>
                    Letzter Download{sortIndicator(sortKey === "lastDownload", sortDir)}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.username} className="border-b border-neutral-100">
                  <td className="p-3 text-neutral-700">{u.username}</td>
                  <td className="p-3 text-neutral-700">{roleLabels[u.role] ?? u.role}</td>
                  <td className="p-3 text-neutral-700">{u.loginCount}</td>
                  <td className="p-3 text-neutral-700">{u.lastLoginAt ? formatDateTimeShort(u.lastLoginAt) : "–"}</td>
                  <td className="p-3 text-neutral-700">{u.downloadCount}</td>
                  <td className="p-3 text-neutral-700">
                    {u.lastDownloadAt ? formatDateTimeShort(u.lastDownloadAt) : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mb-12 text-base leading-relaxed text-neutral-700">Kein Benutzer gefunden.</p>
      )}

      <h2 className="mb-4 font-heading text-lg font-bold text-neutral-900">Letzte Aktivität</h2>
      <input
        type="text"
        value={eventQuery}
        onChange={(e) => setEventQuery(e.target.value)}
        placeholder="Aktivität suchen (Benutzer, Rolle, Aktion, Details)…"
        className="mb-4 w-full max-w-sm border border-neutral-300 px-3 py-2 text-sm focus:border-vtg-yellow focus:outline-none"
      />
      {filteredEvents.length > 0 ? (
        <SimpleTable
          columns={["Zeitpunkt", "Benutzer", "Rolle", "Aktion", "Details"]}
          rows={filteredEvents.map((e) => [
            formatDateTimeShort(e.at),
            e.username,
            roleLabels[e.role] ?? e.role,
            e.type === "login" ? "Login" : "Download",
            e.label ?? "–",
          ])}
        />
      ) : (
        <p className="text-base leading-relaxed text-neutral-700">Keine Aktivität gefunden.</p>
      )}
    </>
  );
}
