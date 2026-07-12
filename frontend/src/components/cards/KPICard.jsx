const toneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

const KPICard = ({ label, value, detail, trend, tone = "blue", icon: Icon }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={17} strokeWidth={1.8} className="text-slate-500" aria-hidden="true" />}
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ${toneClasses[tone]}`}>{trend}</span>
    </div>
    <p className="mt-3 text-3xl font-semibold leading-none tracking-tight text-slate-900">{value}</p>
    <p className="mt-2 text-xs text-slate-500">{detail}</p>
  </article>
);

export default KPICard;
