export type DataTableProps<T> = {
  data: T[];
  columns: { label: string; accessor: keyof T }[];
  currentPage: number;
  total: number;
  limit: number;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  renderActions?: (row: T) => React.ReactNode;
  dataLoading?: boolean; // Data-level
};
export default function DataTable<T>({
    data,
    columns,
    currentPage,
    total,
    limit,
    onSearch,
    onPageChange,
    onLimitChange,
    renderActions,
    dataLoading
}: DataTableProps<T>) {
    const totalPages = Math.ceil(total / limit);
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <input
                    type="text"
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search..."
                    className="border px-2 py-1 rounded"
                />
                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="border px-2 py-1 rounded"
                >
                    {[5, 10, 25, 50].map((num) => (
                        <option key={num} value={num}>
                            Show {num}
                        </option>
                    ))}
                </select>
            </div>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        {columns.map((col) => (
                            <th key={String(col.accessor)} className="text-left p-2 border">
                                {col.label}
                            </th>
                        ))}
                        {renderActions && <th className="p-2 border">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {dataLoading ? (
                        <tr>
                            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center p-4">
                                Loading data...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center p-4 text-gray-500">
                                No data found
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx} className="border-t">
                                {columns.map((col) => (
                                    <td key={String(col.accessor)} className="p-2 border">
                                        {String(row[col.accessor])}
                                    </td>
                                ))}
                                {renderActions && (
                                    <td className="p-2 border">{renderActions(row)}</td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-between mt-4 items-center">
                <div>
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border px-3 py-1 rounded"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border px-3 py-1 rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
