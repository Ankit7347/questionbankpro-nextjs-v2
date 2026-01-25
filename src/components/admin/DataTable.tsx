import React, { useMemo, useState, useEffect } from "react";

export type DataTableColumn<T> = {
  label: string;
  accessor: keyof T;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  currentPage: number;
  total: number;
  limit: number;
  showSearch?: boolean;
  showDbSearch?: boolean;
  onDbSearch?: (query: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  renderActions?: (row: T) => React.ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
  dataLoading?: boolean;
};

export default function DataTable<T>({
  data,
  columns,
  currentPage,
  total,
  limit,
  showSearch = true,
  showDbSearch = false,
  onDbSearch,
  onPageChange,
  onLimitChange,
  renderActions,
  getRowKey,
  dataLoading = false,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const [localQuery, setLocalQuery] = useState("");
  const [dbQuery, setDbQuery] = useState("");

  useEffect(() => {
    if (!onDbSearch) return;
    const t = setTimeout(() => {
      if (dbQuery.length === 0 || dbQuery.length >= 3) {
        onDbSearch(dbQuery);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [dbQuery, onDbSearch]);

  const filteredData = useMemo(() => {
    if (!localQuery) return data;
    const q = localQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((c) =>
        String(row[c.accessor] ?? "").toLowerCase().includes(q)
      )
    );
  }, [localQuery, data, columns]);

  // Shared classes for inputs/selects to keep it DRY
  const inputClasses = "block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:placeholder:text-slate-500";

  const btnClasses = "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700";

  return (
    <div className="w-full space-y-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      {/* Header / Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-1 min-w-[300px]">
          {showSearch && (
            <input
              placeholder="Search in table..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className={inputClasses}
            />
          )}

          {showDbSearch && (
            <input
              placeholder="Global search..."
              value={dbQuery}
              onChange={(e) => setDbQuery(e.target.value)}
              className={inputClasses}
            />
          )}
        </div>

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-slate-800 dark:text-white dark:ring-slate-700"
        >
          {[25, 100, 200, 500].map((n) => (
            <option key={n} value={n}>Show {n}</option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800/50">
            <tr>
              {columns.map((c) => (
                <th key={String(c.accessor)} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  {c.label}
                </th>
              ))}
              {renderActions && <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-900 dark:divide-slate-700">
            {dataLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {/* Modern Spinner */}
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Fetching data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="p-8 text-center text-gray-500 dark:text-slate-400">No results found</td></tr>
            ) : (
              filteredData.map((row, i) => (
            <tr key={getRowKey ? getRowKey(row, i) : i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              {columns.map((c) => (
                <td key={String(c.accessor)} className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                  {String(row[c.accessor])}
                </td>
              ))}
              {renderActions && <td className="px-4 py-3 text-right text-sm font-medium">{renderActions(row)}</td>}
            </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-700">
        <div className="text-sm text-gray-700 dark:text-slate-400">
          Showing page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
        </div>
        <div className="flex space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={btnClasses}
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={btnClasses}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}