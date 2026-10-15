import { NextResponse, type NextRequest } from "next/server";
import { isAllowedOnPortal, isPortalHost } from "@/lib/site-mode";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_EXP_COOKIE_NAME,
  SESSION_IDLE_TIMEOUT_SECONDS,
  sessionCookieOptions,
  sessionExpCookieOptions,
  sessionExpCookieValue,
  verifySessionToken,
} from "@/lib/auth";

// Gleitender Inaktivitaets-Timeout: jede echte Anfrage einer gueltigen Session
// verlaengert sie wieder auf 60 Minuten. Ohne Anfrage fuer 60 Minuten laeuft
// der Token (und das Cookie) ab -> requireSession() leitet auf /login.
// Hier statt in den Seiten, weil nur Proxy/Route Handler Cookies setzen koennen.
// Nur echte Nutzeraktionen verlaengern die Sitzung: Seitenaufrufe, Wechsel von Link
// zu Link und ausgeloeste Abrufe/Formulare. Nicht dazu zaehlen Vorab-Ladungen
// (Prefetch) und nachgeladene Dateien wie Bilder oder Schriften; Mausbewegungen
// erzeugen ohnehin keine Anfrage. Die Restzeit-Leiste im Kopf der Seite zeigt genau
// diese Frist an.
const NICHT_AKTIVITAET_DEST = new Set([
  "image", "style", "script", "font", "audio", "video", "track", "manifest", "worker", "object", "embed", "report",
]);

function istNutzeraktivitaet(request: NextRequest): boolean {
  const h = request.headers;
  if (h.get("next-router-prefetch") || h.get("purpose") === "prefetch" || h.get("sec-purpose")?.includes("prefetch")) {
    return false;
  }
  const dest = h.get("sec-fetch-dest");
  return !(dest && NICHT_AKTIVITAET_DEST.has(dest));
}

function verlaengereSession(request: NextRequest, response: NextResponse): NextResponse {
  const { pathname } = request.nextUrl;
  // Login/Logout setzen das Cookie selbst - nicht dazwischenfunken, sonst
  // wuerde ein Logout durch das erneuerte Cookie wieder aufgehoben.
  if (pathname === "/api/login" || pathname === "/api/logout") return response;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session || !istNutzeraktivitaet(request)) return response;

  const exp = Date.now() + SESSION_IDLE_TIMEOUT_SECONDS * 1000;
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken({ ...session, exp }), sessionCookieOptions());
  response.cookies.set(SESSION_EXP_COOKIE_NAME, sessionExpCookieValue(exp), sessionExpCookieOptions());
  return response;
}

// Blockt auf einer als "Portal"-Domain markierten Domain (siehe
// src/lib/site-mode.ts) alle Seiten ausser Startseite, Login und
// Mitgliederbereich mit einem echten 404 — der volle Webauftritt bleibt
// ausschliesslich auf der Hauptdomain (Projekt "vtg") erreichbar.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (!isPortalHost(host)) {
    return verlaengereSession(request, NextResponse.next());
  }

  const { pathname } = request.nextUrl;
  if (isAllowedOnPortal(pathname)) {
    return verlaengereSession(request, NextResponse.next());
  }

  const notFoundUrl = new URL("/portal-not-found", request.url);
  return NextResponse.rewrite(notFoundUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
