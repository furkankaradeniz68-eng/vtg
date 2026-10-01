"use client";

import { useMemo, useState } from "react";
import SimpleTable from "@/components/SimpleTable";

const pageButtonClass =
  "rounded border border-neutral-300 px-3 py-1.5 text-sm hover:border-vtg-orange hover:text-vtg-orange disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:text-neutral-700";

export default function PaginatedTable({
  columns,
  rows,
  pageSize = 8,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  pageSize?: number;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = useMemo(
    () => rows.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [rows, currentPage, pageSize],
  );

  return (
    <div>
      <SimpleTable columns={columns} rows={pageRows} />
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={pageButtonClass}
          >
            ‹ Zurück
          </button>
          <span className="text-sm text-neutral-600">
            Seite {currentPage + 1} von {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className={pageButtonClass}
          >
            Weiter ›
          </button>
        </div>
      )}
    </div>
  );
}
