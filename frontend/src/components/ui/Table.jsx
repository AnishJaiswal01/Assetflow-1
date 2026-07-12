const Table = ({ columns, rows, emptyState }) => {
  if (rows.length === 0) return emptyState;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50/80">
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
            <tr key={row.id} className="transition-colors hover:bg-slate-50/80">
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
