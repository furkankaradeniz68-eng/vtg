type DownloadItem = {
  title: string;
  description?: string;
  href: string;
  meta?: string;
};

export default function DownloadList({ items }: { items: DownloadItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
      {items.map((item) => (
        <li key={item.href} className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-heading font-semibold text-neutral-900">
              {item.title}
            </p>
            {item.description && (
              <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
            )}
          </div>
          <a
            href={item.href}
            download
            className="shrink-0 rounded bg-vtg-orange px-4 py-2 text-sm font-heading font-bold uppercase tracking-wide text-neutral-900 hover:bg-vtg-yellow"
          >
            {item.meta ?? "Download"}
          </a>
        </li>
      ))}
    </ul>
  );
}
