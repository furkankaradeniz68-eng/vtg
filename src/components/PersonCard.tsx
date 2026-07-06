import Image from "next/image";

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
        <div className="h-24 w-24 shrink-0 rounded bg-neutral-100" />
      )}
      <div className="min-w-0">
        <p className="font-heading font-bold text-neutral-900">{person.name}</p>
        <p className="text-sm text-neutral-600">{person.role}</p>
        <div className="mt-2 space-y-0.5 text-sm text-neutral-700">
          {person.address && <p>{person.address}</p>}
          {person.phone && <p>Tel. {person.phone}</p>}
          {person.mobile && <p>Mobil {person.mobile}</p>}
          {person.fax && <p>Fax {person.fax}</p>}
          {person.email && (
            <p>
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
