const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-sky-50 text-sky-700 ring-sky-600/20",
  "in progress": "bg-violet-50 text-violet-700 ring-violet-600/20",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  verified: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  missing: "bg-rose-50 text-rose-700 ring-rose-600/20",
  damaged: "bg-orange-50 text-orange-700 ring-orange-600/20",
  available: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  booked: "bg-blue-50 text-blue-700 ring-blue-600/20",
  assigned: "bg-blue-50 text-blue-700 ring-blue-600/20",
  maintenance: "bg-amber-50 text-amber-700 ring-amber-600/20",
  retired: "bg-slate-100 text-slate-600 ring-slate-500/20",
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
