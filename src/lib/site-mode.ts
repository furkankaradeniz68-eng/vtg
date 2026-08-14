import { isFileHref } from "@/lib/nav";

// Manche Domains (z. B. eine Landesverband-Domain wie VTG NRW, deployed als
// eigenes Vercel-Projekt auf demselben Repo) sollen bewusst nur die
// Startseite und den kompletten Mitgliederbereich/Login zeigen — nicht den
// vollen Webauftritt (News, Satzung, Kontakt-Unterseiten usw.). Welche
// Hostnamen das betrifft, wird über die Env-Var PORTAL_HOSTS gesteuert
// (kommagetrennte Liste, z. B. "vtg-nrw.de,www.vtg-nrw.de"). Ist die Liste
// leer, verhält sich jede Domain wie bisher (voller Umfang) — das
// Hauptprojekt "vtg" lässt PORTAL_HOSTS ungesetzt und ist dadurch nie
// betroffen.
export function getPortalHosts(): string[] {
  return (process.env.PORTAL_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function isPortalHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const hostname = host.toLowerCase().split(":")[0];
  return getPortalHosts().includes(hostname);
}

// Pflichtseiten nach TMG, die auch auf der reduzierten Portal-Domain
// erreichbar bleiben müssen.
const PORTAL_EXTRA_ALLOWED_PATHS = ["/impressum", "/datenschutzerklaerung"];

// Prüft, ob ein Pfad auf der Portal-Domain erreichbar sein darf:
// Startseite, Login, kompletter Mitgliederbereich, API-Routen, Next.js-
// interne Pfade, echte Dateien (PDF/ZIP/Bilder — u. a. für Downloads im
// Mitgliederbereich) sowie die gesetzlichen Pflichtseiten.
export function isAllowedOnPortal(pathname: string): boolean {
  if (isFileHref(pathname)) return true;
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/mitgliederbereich")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (PORTAL_EXTRA_ALLOWED_PATHS.includes(pathname)) return true;
  return false;
}
