"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { header2Nav, header2SecondRow, type MemberRole } from "@/lib/nav";

export default function Header2({ role }: { role: MemberRole | null }) {
  const pathname = usePathname();

  if (!role) return null;

  const items = header2Nav[role];
  const secondRow = header2SecondRow[role];

  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`inline-block border-b-2 py-0.5 text-sm ${
                    active
                      ? "border-vtg-yellow text-neutral-900"
                      : "border-transparent text-neutral-700 hover:text-vtg-orange"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {secondRow && (
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 pb-2">
            {secondRow.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`inline-block border-b-2 py-0.5 text-sm ${
                      active
                        ? "border-vtg-yellow text-neutral-900"
                        : "border-transparent text-neutral-700 hover:text-vtg-orange"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
