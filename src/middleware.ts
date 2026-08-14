import { NextResponse, type NextRequest } from "next/server";
import { isAllowedOnPortal, isPortalHost } from "@/lib/site-mode";

// Blockt auf einer als "Portal"-Domain markierten Domain (siehe
// src/lib/site-mode.ts) alle Seiten ausser Startseite, Login und
// Mitgliederbereich mit einem echten 404 — der volle Webauftritt bleibt
// ausschliesslich auf der Hauptdomain (Projekt "vtg") erreichbar.
export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (!isPortalHost(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (isAllowedOnPortal(pathname)) {
    return NextResponse.next();
  }

  const notFoundUrl = new URL("/portal-not-found", request.url);
  return NextResponse.rewrite(notFoundUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
