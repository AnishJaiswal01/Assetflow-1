import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import Modal from "../components/ui/Modal";
import Snackbar from "../components/ui/Snackbar";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";

const requests = [
  { id: "MNT-2048", asset: "Epson EB-FH06 Projector", category: "Audio & Visual", reportedBy: "Rohan Mehta", priority: "High", status: "Pending", technician: "Unassigned", created: "08 Jun 2026", completion: "Awaiting assessment", notes: "Projector powers on but does not display an input signal.", timeline: [{ event: "Request raised", time: "Today, 9:20 AM", detail: "Reported by Rohan Mehta" }] },
  { id: "MNT-2047", asset: "MacBook Pro 14-inch", category: "Computing", reportedBy: "Priya Shah", priority: "Medium", status: "In Progress", technician: "Kiran Patel", created: "07 Jun 2026", completion: "10 Jun 2026", notes: "Battery health alert requires diagnostics and calibration.", timeline: [{ event: "Technician assigned", time: "Today, 8:45 AM", detail: "Assigned to Kiran Patel" }, { event: "Request approved", time: "07 Jun 2026, 4:10 PM", detail: "Approved by IT Operations" }, { event: "Request raised", time: "07 Jun 2026, 2:30 PM", detail: "Reported by Priya Shah" }] },
  { id: "MNT-2046", asset: "Logitech Rally Bar Mini", category: "Audio & Visual", reportedBy: "Sana Iqbal", priority: "Low", status: "Approved", technician: "Naveen Kumar", created: "06 Jun 2026", completion: "11 Jun 2026", notes: "Intermittent microphone connection in Meeting Room B-2.", timeline: [{ event: "Request approved", time: "06 Jun 2026, 3:15 PM", detail: "Scheduled for technician review" }, { event: "Request raised", time: "06 Jun 2026, 11:20 AM", detail: "Reported by Sana Iqbal" }] },
  { id: "MNT-2045", asset: "HP EliteBook 840", category: "Computing", reportedBy: "Rohan Mehta", priority: "Medium", status: "Resolved", technician: "Kiran Patel", created: "04 Jun 2026", completion: "05 Jun 2026", notes: "Keyboard replaced and device returned to the Finance inventory pool.", timeline: [{ event: "Request resolved", time: "05 Jun 2026, 5:05 PM", detail: "Keyboard replaced · Quality check passed" }, { event: "Technician assigned", time: "04 Jun 2026, 1:20 PM", detail: "Assigned to Kiran Patel" }, { event: "Request raised", time: "04 Jun 2026, 9:10 AM", detail: "Reported by Rohan Mehta" }] },
  { id: "MNT-2044", asset: "Herman Miller Sayl", category: "Furniture", reportedBy: "Meera Nair", priority: "Low", status: "Pending", technician: "Unassigned", created: "03 Jun 2026", completion: "Awaiting assessment", notes: "Chair armrest needs inspection and adjustment.", timeline: [{ event: "Request raised", time: "03 Jun 2026, 10:45 AM", detail: "Reported by Meera Nair" }] },
];

const priorityStyles = { High: "bg-rose-50 text-rose-700 ring-rose-600/20", Medium: "bg-amber-50 text-amber-700 ring-amber-600/20", Low: "bg-slate-100 text-slate-600 ring-slate-500/20" };
const priorities = ["All priorities", "High", "Medium", "Low"];
const statuses = ["All statuses", "Pending", "Approved", "In Progress", "Resolved"];
const categories = ["All categories", ...new Set(requests.map((request) => request.category))];

const Maintenance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All priorities");
  const [status, setStatus] = useState("All statuses");
  const [category, setCategory] = useState("All categories");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [snackbar, setSnackbar] = useState("");
  const detailsPanelRef = useRef(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 550);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  useEffect(() => {
    if (selectedRequest) {
      detailsPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedRequest]);

  const filteredRequests = useMemo(() => requests.filter((request) => {
    const matchesQuery = `${request.id} ${request.asset} ${request.reportedBy} ${request.technician}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (priority === "All priorities" || request.priority === priority) && (status === "All statuses" || request.status === status) && (category === "All categories" || request.category === category);
  }), [query, priority, status, category]);

  const columns = [
    { key: "id", label: "Request ID", render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.id}</span> },
    { key: "asset", label: "Asset", render: (row) => <span className="font-medium text-slate-900">{row.asset}</span> },
    { key: "reportedBy", label: "Reported by" },
    { key: "priority", label: "Priority", render: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityStyles[row.priority]}`}>{row.priority}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "technician", label: "Assigned technician" },
    { key: "created", label: "Created date" },
    { key: "actions", label: "", render: (row) => <button type="button" onClick={() => setSelectedRequest(row)} className="whitespace-nowrap text-xs font-semibold text-blue-700 transition-colors hover:text-blue-800">View details</button> },
  ];

  const emptyState = <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">⌕</span><h2 className="mt-4 text-sm font-semibold text-slate-900">No maintenance requests found</h2><p className="mt-1 text-sm text-slate-500">Try modifying the filters or search for a different request.</p></div>;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance Management</h1><p className="mt-2 text-sm text-slate-500">Track service requests, technician work and asset recovery across your organization.</p></div><button type="button" onClick={() => setIsRequestOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200"><Plus size={17} aria-hidden="true" />Raise Maintenance Request</button></section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row xl:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Search maintenance requests</span><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search request IDs, assets or people..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" /></label>{[{ label: "Priority", value: priority, setValue: setPriority, options: priorities }, { label: "Status", value: status, setValue: setStatus, options: statuses }, { label: "Category", value: category, setValue: setCategory, options: categories }].map((filter) => <div key={filter.label}><label htmlFor={`maintenance-${filter.label}`} className="sr-only">{filter.label}</label><select id={`maintenance-${filter.label}`} value={filter.value} onChange={(event) => filter.setValue(event.target.value)} className="h-10 min-w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100">{filter.options.map((option) => <option key={option}>{option}</option>)}</select></div>)}</div><div className="flex items-center justify-between px-5 py-4"><p className="text-sm text-slate-500">{filteredRequests.length} maintenance requests</p><p className="text-xs text-slate-400">Updated just now</p></div>{isLoading ? <div className="space-y-px border-t border-slate-100 p-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div> : <Table columns={columns} rows={filteredRequests} emptyState={emptyState} stickyHeader getRowClassName={(row) => row.id === selectedRequest?.id ? "bg-blue-50/70 shadow-[inset_3px_0_0_#2563eb] hover:bg-blue-50" : ""} />}</section>

      {selectedRequest && <section ref={detailsPanelRef} className="rounded-xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm transition-all duration-300" aria-labelledby="maintenance-detail-heading"><div className="flex flex-col justify-between gap-3 border-b border-blue-100 pb-5 lg:flex-row lg:items-start"><div><p className="font-mono text-xs font-semibold text-blue-600">{selectedRequest.id}</p><h2 id="maintenance-detail-heading" className="mt-1 text-lg font-semibold text-slate-900">Viewing maintenance details for {selectedRequest.asset}</h2></div><StatusBadge status={selectedRequest.status} /></div><div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"><div><h3 className="text-base font-semibold text-slate-900">Request details</h3><dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned technician</dt><dd className="mt-1.5 text-sm font-medium text-slate-800">{selectedRequest.technician}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Estimated completion</dt><dd className="mt-1.5 text-sm font-medium text-slate-800">{selectedRequest.completion}</dd></div><div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</dt><dd className="mt-1.5 text-sm leading-6 text-slate-700">{selectedRequest.notes}</dd></div></dl></div><div><h3 className="text-base font-semibold text-slate-900">Timeline</h3><ol className="mt-5 space-y-5 border-l border-slate-200 pl-5">{selectedRequest.timeline.map((entry) => <li key={`${entry.time}-${entry.event}`} className="relative"><span className="absolute left-[1.82rem] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" /><p className="text-sm font-semibold text-slate-900">{entry.event}</p><p className="mt-1 text-sm text-slate-500">{entry.detail}</p><p className="mt-1 text-xs font-medium text-slate-400">{entry.time}</p></li>)}</ol></div></div></section>}

      <Modal isOpen={isRequestOpen} title="Raise maintenance request" onClose={() => setIsRequestOpen(false)}><div className="space-y-4"><label className="block text-sm font-medium text-slate-700">Asset<select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option>Select asset</option><option>MacBook Pro 14-inch</option><option>Epson EB-FH06 Projector</option><option>Logitech Rally Bar Mini</option></select></label><label className="block text-sm font-medium text-slate-700">Issue type<select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option>Select issue type</option><option>Hardware fault</option><option>Software issue</option><option>Preventive maintenance</option></select></label><label className="block text-sm font-medium text-slate-700">Priority<select className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option>Medium</option><option>High</option><option>Low</option></select></label><label className="block text-sm font-medium text-slate-700">Description<textarea rows="3" placeholder="Describe the issue..." className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100" /></label><div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">Attachments can be added when backend file storage is connected.</div><div className="flex justify-end"><button type="button" onClick={() => { setIsRequestOpen(false); setSnackbar("Maintenance request is ready for backend submission."); }} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Submit request</button></div></div></Modal>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default Maintenance;
