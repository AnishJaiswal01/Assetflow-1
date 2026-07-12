const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status.toLowerCase();

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[normalizedStatus] ?? statusStyles.inactive}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
