const Table = ({ columns, rows, emptyState, stickyHeader = false, getRowClassName, onRowClick }) => {
  if (rows.length === 0) return emptyState;

  return (
    <div className={stickyHeader ? "max-h-140 overflow-auto" : "overflow-x-auto"}>
      <table className="w-full min-w-180 text-left">
        <thead className={`border-b border-slate-200 bg-slate-50/80 ${stickyHeader ? "sticky top-0 z-10 backdrop-blur" : ""}`}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={row.id} onClick={() => onRowClick?.(row)} className={`transition-colors hover:bg-slate-50/80 ${onRowClick ? "cursor-pointer" : ""} ${getRowClassName?.(row) ?? ""}`}>
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 text-sm text-slate-600">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
