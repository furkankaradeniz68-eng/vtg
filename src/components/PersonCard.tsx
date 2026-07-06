import Image from "next/image";
import type { SVGProps } from "react";

export type Person = {
  name: string;
  role: string;
  address?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  image?: string;
};

function IconWrap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-neutral-400"
      {...props}
    />
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconWrap {...props}>
      <path d="M3 5c0 9.4 6.6 16 16 16l2-4-5-2-1.5 1.5A12.4 12.4 0 0 1 7.5 9.5L9 8 7 3z" />
    </IconWrap>
  );
}

function MobileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconWrap {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </IconWrap>
  );
}

function FaxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconWrap {...props}>
      <path d="M6 8V3h9l3 3v2" />
      <rect x="4" y="8" width="16" height="9" rx="1" />
      <rect x="8" y="13" width="8" height="6" />
      <path d="M8 11h.01" />
    </IconWrap>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconWrap {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconWrap>
  );
}

function PersonPlaceholder() {
  return (
    <svg
      viewBox="0 0 96 96"
      className="h-24 w-24 shrink-0 rounded bg-neutral-100"
      aria-hidden="true"
    >
      <circle cx="48" cy="38" r="16" fill="#242530" />
      <path d="M16 88c0-17.7 14.3-32 32-32s32 14.3 32 32" fill="#242530" />
    </svg>
  );
}

export default function PersonCard({ person }: { person: Person }) {
  return (
    <div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      {person.image ? (
        <Image
          src={person.image}
          alt={person.name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded object-cover"
        />
      ) : (
        <PersonPlaceholder />
      )}
      <div className="min-w-0">
        <p className="font-heading font-bold text-neutral-900">{person.name}</p>
        <p className="text-sm text-neutral-600">{person.role}</p>
        <div className="mt-2 space-y-1 text-sm text-neutral-700">
          {person.address && <p>{person.address}</p>}
          {person.phone && (
            <p className="flex items-center gap-1.5">
              <PhoneIcon /> {person.phone}
            </p>
          )}
          {person.mobile && (
            <p className="flex items-center gap-1.5">
              <MobileIcon /> {person.mobile}
            </p>
          )}
          {person.fax && (
            <p className="flex items-center gap-1.5">
              <FaxIcon /> {person.fax}
            </p>
          )}
          {person.email && (
            <p className="flex items-center gap-1.5">
              <MailIcon />
              <a href={`mailto:${person.email}`} className="text-vtg-orange hover:underline">
                {person.email}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
