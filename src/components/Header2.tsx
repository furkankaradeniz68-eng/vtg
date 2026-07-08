"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { header2Nav, header2SecondRow, isFileHref, type MemberRole } from "@/lib/nav";

function Header2Link({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const className = `inline-block border-b-2 py-0.5 text-sm ${
    active
      ? "border-vtg-yellow text-neutral-900"
      : "border-transparent text-neutral-700 hover:text-vtg-orange"
  }`;

  if (isFileHref(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Header2({ role }: { role: MemberRole | null }) {
  const pathname = usePathname();

  if (!role) return null;

  const items = header2Nav[role];
  const secondRow = header2SecondRow[role];

  return (
    <div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2">
        {items.map((item) => (
          <li key={item.href}>
            <Header2Link href={item.href} active={pathname === item.href}>
              {item.label}
            </Header2Link>
          </li>
        ))}
      </ul>
      {secondRow && (
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 pb-2">
          {secondRow.map((item) => (
            <li key={item.href}>
              <Header2Link href={item.href} active={pathname === item.href}>
                {item.label}
              </Header2Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
