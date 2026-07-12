import { useEffect, useState } from "react";
import { Boxes, ClipboardCheck, FileBarChart, Repeat2, Wrench } from "lucide-react";
import KPICard from "../components/cards/KPICard";
import Snackbar from "../components/ui/Snackbar";

const summary = [
  { label: "Total assets", value: "128", detail: "Across 12 departments", trend: "+8 this quarter", tone: "blue", icon: Boxes },
  { label: "Active allocations", value: "76", detail: "59% of tracked inventory", trend: "12 pending review", tone: "violet", icon: Repeat2 },
  { label: "Open maintenance", value: "4", detail: "2 high-priority requests", trend: "Needs attention", tone: "amber", icon: Wrench },
  { label: "Active bookings", value: "9", detail: "Across rooms and equipment", trend: "3 today", tone: "emerald", icon: ClipboardCheck },
  { label: "Audit discrepancies", value: "2", detail: "1 missing · 1 damaged", trend: "Follow up", tone: "rose", icon: FileBarChart },
];

const utilization = [
  { label: "Engineering", value: 82, count: "28 active assets", color: "bg-blue-600" },
  { label: "Field Operations", value: 74, count: "18 active assets", color: "bg-violet-600" },
  { label: "Sales", value: 68, count: "14 active assets", color: "bg-sky-600" },
  { label: "Facilities", value: 45, count: "9 active assets", color: "bg-slate-500" },
];

const Reports = () => {
  const [snackbar, setSnackbar] = useState("");

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reports &amp; Analytics</h1><p className="mt-2 text-sm text-slate-500">Operational intelligence synthesized from the current AssetFlow workflow data.</p></div><button type="button" onClick={() => setSnackbar("Report export is ready for backend processing.")} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200">Export Report</button></section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" aria-label="Key performance indicators">{summary.map((metric) => <KPICard key={metric.label} {...metric} />)}</section>

      <section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div><h2 className="text-base font-semibold text-slate-900">Asset utilization by department</h2><p className="mt-1 text-sm text-slate-500">Allocated and actively used inventory.</p></div><div className="mt-6 space-y-5">{utilization.map((item) => <div key={item.label}><div className="flex justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{item.label}</span><span className="text-slate-500">{item.value}% · {item.count}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} /></div></div>)}</div></article><article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-base font-semibold text-slate-900">Maintenance frequency</h2><p className="mt-1 text-sm text-slate-500">Requests recorded in the current quarter.</p><div className="mt-6 grid h-44 grid-cols-6 items-end gap-3 border-b border-slate-100 px-2">{[36, 52, 28, 68, 46, 74].map((height, index) => <div key={index} className="flex h-full items-end"><div className="w-full rounded-t-md bg-amber-400/80" style={{ height: `${height}%` }} /></div>)}</div><div className="mt-3 flex justify-between text-xs text-slate-400"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></article><article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-base font-semibold text-slate-900">Allocation distribution</h2><p className="mt-1 text-sm text-slate-500">Current ownership across operational groups.</p><div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100"><span className="bg-blue-600" style={{ width: "37%" }} /><span className="bg-violet-600" style={{ width: "24%" }} /><span className="bg-sky-500" style={{ width: "18%" }} /><span className="bg-slate-400" style={{ width: "21%" }} /></div><div className="mt-5 grid grid-cols-2 gap-4 text-sm"><p className="text-slate-600"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600" />Engineering <strong className="text-slate-900">37%</strong></p><p className="text-slate-600"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-violet-600" />Operations <strong className="text-slate-900">24%</strong></p><p className="text-slate-600"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-sky-500" />Sales <strong className="text-slate-900">18%</strong></p><p className="text-slate-600"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-slate-400" />Other <strong className="text-slate-900">21%</strong></p></div></article><article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-base font-semibold text-slate-900">Booking utilization</h2><p className="mt-1 text-sm text-slate-500">Shared resource bookings for the current work week.</p><div className="mt-6 grid grid-cols-5 gap-3">{[{ day: "Mon", value: "78%" }, { day: "Tue", value: "64%" }, { day: "Wed", value: "91%" }, { day: "Thu", value: "72%" }, { day: "Fri", value: "48%" }].map((item) => <div key={item.day} className="rounded-lg bg-slate-50 p-3 text-center"><p className="text-xs font-semibold text-slate-500">{item.day}</p><p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p></div>)}</div><p className="mt-5 text-sm text-slate-500">Meeting Room B-2 and Lab Station 03 remain the highest-demand resources.</p></article></section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div><h2 className="text-base font-semibold text-slate-900">Operational insights</h2><p className="mt-1 text-sm text-slate-500">Data points that may need an operational response.</p></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[{ title: "Most frequently used", value: "Meeting Room B-2", detail: "18 bookings this month", tone: "border-blue-200 bg-blue-50" }, { title: "Idle assets", value: "7 assets", detail: "No activity for over 60 days", tone: "border-slate-200 bg-slate-50" }, { title: "Nearing maintenance", value: "4 assets", detail: "Inspection due within 14 days", tone: "border-amber-200 bg-amber-50" }, { title: "Warranty expiry", value: "3 assets", detail: "Coverage ends within 90 days", tone: "border-rose-200 bg-rose-50" }].map((insight) => <article key={insight.title} className={`rounded-lg border p-4 ${insight.tone}`}><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{insight.title}</p><p className="mt-2 text-base font-semibold text-slate-900">{insight.value}</p><p className="mt-1 text-sm text-slate-600">{insight.detail}</p></article>)}</div></section>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default Reports;
