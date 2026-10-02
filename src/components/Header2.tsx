"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { header2Nav, header2SecondRow, isFileHref, type NavItem, type MemberRole } from "@/lib/nav";

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="ml-1 inline-block h-3.5 w-3.5 align-text-bottom"
    >
      <path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14.5v1a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Header2Link({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon?: NavItem["icon"];
  children: React.ReactNode;
}) {
  const className = `inline-block border-b-2 py-0.5 text-sm ${
    active
      ? "border-vtg-yellow text-neutral-900"
      : "border-transparent text-neutral-700 hover:text-vtg-orange"
  }`;

  if (isFileHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        {icon === "download" && <DownloadIcon />}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      {icon === "download" && <DownloadIcon />}
    </Link>
  );
}

// Loest href fuer ein Nav-Item auf. Items mit hrefPrefix haengen vom gerade
// gewaehlten Verfahren ab (?id=... auf Verfahrensauswahl/Verfahrensdaten) -
// ohne Auswahl gibt es (noch) kein Ziel, das Item wird dann deaktiviert
// dargestellt statt verlinkt.
function resolveHref(item: NavItem, selectedId: string | null): string | null {
  if (!item.hrefPrefix) return item.href;
  return selectedId ? `${item.hrefPrefix}${selectedId}` : null;
}

function Header2Item({
  item,
  pathname,
  selectedId,
}: {
  item: NavItem;
  pathname: string;
  selectedId: string | null;
}) {
  const href = resolveHref(item, selectedId);

  if (href === null) {
    return (
      <span
        title="Bitte zuerst ein Verfahren auswählen"
        className="inline-block cursor-not-allowed border-b-2 border-transparent py-0.5 text-sm text-neutral-400"
      >
        {item.label}
        {item.icon === "download" && <DownloadIcon />}
      </span>
    );
  }

  return (
    <Header2Link href={href} active={pathname === href} icon={item.icon}>
      {item.label}
    </Header2Link>
  );
}

export default function Header2({
  role,
  ownNr,
  portalMode = false,
}: {
  role: MemberRole | null;
  // Eigene Produktnummer des Mandanten (= session.username bei "abonnent"),
  // von RootLayout durchgereicht. Ersetzt fuer Abonnenten die ?id=... Query,
  // die nur Interne ueber die Verfahrensauswahl setzen - ein Mandant waehlt
  // sein Verfahren nicht, er hat immer genau eines.
  ownNr?: string | null;
  portalMode?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = role === "abonnent" ? (ownNr ?? null) : searchParams.get("id");

  if (!role) return null;

  const items = header2Nav[role].filter((item) => !(portalMode && item.hideOnPortal));
  const secondRow = header2SecondRow[role];

  return (
    <div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2">
        {items.map((item) => (
          <li key={item.href}>
            <Header2Item item={item} pathname={pathname} selectedId={selectedId} />
          </li>
        ))}
      </ul>
      {secondRow && (
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 pb-2">
          {secondRow.map((item) => (
            <li key={item.href}>
              <Header2Item item={item} pathname={pathname} selectedId={selectedId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
