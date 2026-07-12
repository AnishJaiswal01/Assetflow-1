import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import Modal from "../components/ui/Modal";
import Snackbar from "../components/ui/Snackbar";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";

const allocations = [
  { id: "alloc-01", assetId: "AF-1001", asset: "MacBook Pro 14-inch", department: "Engineering", employee: "Priya Shah", status: "Assigned", updated: "12 minutes ago", history: [{ date: "14 Jan 2025", event: "Allocated to Priya Shah", detail: "Engineering · Approved by Rohan Mehta" }, { date: "12 Jan 2025", event: "Registered in inventory", detail: "Received from Apple India · Condition: new" }] },
  { id: "alloc-02", assetId: "AF-1002", asset: "ThinkPad T14 Gen 4", department: "Field Operations", employee: "Daniel Moore", status: "Assigned", updated: "38 minutes ago", history: [{ date: "03 Mar 2025", event: "Allocated to Daniel Moore", detail: "Field Operations · Approved by Sana Iqbal" }, { date: "28 Feb 2025", event: "Returned by Arjun Nair", detail: "Condition verified · IT Store" }] },
  { id: "alloc-03", assetId: "AF-1004", asset: "Dell UltraSharp 27", department: "Design", employee: "Aditi Rao", status: "Assigned", updated: "Yesterday", history: [{ date: "24 Feb 2025", event: "Allocated to Aditi Rao", detail: "Design · Desk allocation" }, { date: "22 Feb 2025", event: "Registered in inventory", detail: "Received from Dell Technologies" }] },
  { id: "alloc-04", assetId: "AF-1005", asset: "Logitech Rally Bar Mini", department: "Facilities", employee: "Unassigned", status: "Available", updated: "Yesterday", history: [{ date: "07 Sep 2024", event: "Registered in inventory", detail: "Available for room booking" }] },
  { id: "alloc-05", assetId: "AF-1006", asset: "iPhone 15 Pro", department: "Sales", employee: "Meera Nair", status: "Assigned", updated: "2 days ago", history: [{ date: "16 Apr 2025", event: "Allocated to Meera Nair", detail: "Sales · Mobile device policy accepted" }, { date: "15 Apr 2025", event: "Registered in inventory", detail: "Received from Apple India" }] },
  { id: "alloc-06", assetId: "AF-1007", asset: "Herman Miller Sayl", department: "People Operations", employee: "Unassigned", status: "Available", updated: "3 days ago", history: [{ date: "21 Jun 2023", event: "Registered in inventory", detail: "Held in furniture store" }] },
];

const departments = ["All departments", ...new Set(allocations.map((allocation) => allocation.department))];
const employees = ["All employees", ...new Set(allocations.map((allocation) => allocation.employee))];
const statuses = ["All statuses", "Assigned", "Available"];
const potentialOwners = ["Aditi Rao", "Daniel Moore", "Meera Nair", "Priya Shah", "Rohan Mehta", "Sana Iqbal"];

const Allocations = () => {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [employee, setEmployee] = useState("All employees");
  const [status, setStatus] = useState("All statuses");
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [snackbar, setSnackbar] = useState("");
  const transferPanelRef = useRef(null);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  useEffect(() => {
    if (selectedAllocation) {
      transferPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedAllocation]);

  const filteredAllocations = useMemo(() => allocations.filter((allocation) => {
    const matchesQuery = `${allocation.assetId} ${allocation.asset} ${allocation.employee}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (department === "All departments" || allocation.department === department) && (employee === "All employees" || allocation.employee === employee) && (status === "All statuses" || allocation.status === status);
  }), [query, department, employee, status]);

  const chooseAllocation = (allocation) => {
    setSelectedAllocation(allocation);
    setNewOwner("");
    setReason("");
    setFormError("");
  };

  const submitTransferRequest = (event) => {
    event.preventDefault();
    if (!newOwner || !reason.trim()) {
      setFormError("Choose a new owner and provide a reason before submitting the request.");
      return;
    }
    setFormError("");
    setSnackbar(`Transfer request for ${selectedAllocation.assetId} submitted for review.`);
    setReason("");
    setNewOwner("");
  };

  const columns = [
    { key: "assetId", label: "Asset ID", render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.assetId}</span> },
    { key: "asset", label: "Asset", render: (row) => <span className="font-medium text-slate-900">{row.asset}</span> },
    { key: "department", label: "Department" },
    { key: "employee", label: "Assigned to" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "updated", label: "Last updated" },
    { key: "actions", label: "", render: (row) => <button type="button" onClick={() => row.status === "Assigned" ? chooseAllocation(row) : setIsAllocateOpen(true)} className="whitespace-nowrap text-xs font-semibold text-blue-700 transition-colors hover:text-blue-800">{row.status === "Assigned" ? "Request transfer" : "Allocate"}</button> },
  ];

  const emptyState = <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">⌕</span><h2 className="mt-4 text-sm font-semibold text-slate-900">No allocations found</h2><p className="mt-1 text-sm text-slate-500">Try changing the filters or search for another asset.</p></div>;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Allocation &amp; Transfer</h1><p className="mt-2 text-sm text-slate-500">Manage asset ownership while preserving allocation controls and audit history.</p></div>
        <button type="button" onClick={() => setIsAllocateOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200"><Plus size={17} aria-hidden="true" />Allocate Asset</button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1"><span className="sr-only">Search allocations</span><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets, IDs or employees..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" /></label>
          {[{ label: "Department", value: department, setValue: setDepartment, options: departments }, { label: "Employee", value: employee, setValue: setEmployee, options: employees }, { label: "Status", value: status, setValue: setStatus, options: statuses }].map((filter) => <div key={filter.label}><label htmlFor={filter.label} className="sr-only">{filter.label}</label><select id={filter.label} value={filter.value} onChange={(event) => filter.setValue(event.target.value)} className="h-10 min-w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100">{filter.options.map((option) => <option key={option}>{option}</option>)}</select></div>)}
        </div>
        <div className="flex items-center justify-between px-5 py-4"><p className="text-sm text-slate-500">{filteredAllocations.length} asset allocations</p><p className="text-xs text-slate-400">Select an allocation to view history</p></div>
        <Table columns={columns} rows={filteredAllocations} emptyState={emptyState} stickyHeader getRowClassName={(row) => row.id === selectedAllocation?.id ? "bg-blue-50/70 shadow-[inset_3px_0_0_#2563eb] hover:bg-blue-50" : ""} />
      </section>

      {selectedAllocation && <section ref={transferPanelRef} className="rounded-xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm transition-all duration-300" aria-labelledby="selected-allocation-heading">
        <div className="flex flex-col justify-between gap-3 border-b border-blue-100 pb-5 lg:flex-row lg:items-start"><div><p className="font-mono text-xs font-semibold text-blue-600">{selectedAllocation.assetId}</p><h2 id="selected-allocation-heading" className="mt-1 text-lg font-semibold text-slate-900">Transfer request for {selectedAllocation.asset}</h2></div><StatusBadge status={selectedAllocation.status} /></div>
        {selectedAllocation.status === "Assigned" ? <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3"><p className="text-sm font-semibold text-rose-900">Direct reallocation is blocked</p><p className="mt-1 text-sm text-rose-700">This asset is already allocated to {selectedAllocation.employee} ({selectedAllocation.department}). Submit a transfer request to preserve ownership controls and the audit trail.</p></div> : <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"><p className="text-sm font-semibold text-emerald-900">This asset is available for allocation</p><p className="mt-1 text-sm text-emerald-700">Use the allocation workflow to assign it to an employee.</p></div>}
        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <form onSubmit={submitTransferRequest} className="rounded-lg border border-slate-200 p-5"><div><h3 className="text-base font-semibold text-slate-900">Transfer request</h3><p className="mt-1 text-sm text-slate-500">A request will be routed for approval before ownership changes.</p></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Current owner<input readOnly value={selectedAllocation.employee} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600" /></label><label className="text-sm font-medium text-slate-700">New owner<select value={newOwner} onChange={(event) => setNewOwner(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100"><option value="">Select employee</option>{potentialOwners.filter((owner) => owner !== selectedAllocation.employee).map((owner) => <option key={owner}>{owner}</option>)}</select></label></div><label className="mt-4 block text-sm font-medium text-slate-700">Reason<textarea value={reason} onChange={(event) => setReason(event.target.value)} rows="4" placeholder="Explain why the asset should be transferred..." className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100" /></label>{formError && <p className="mt-3 text-sm font-medium text-rose-700">{formError}</p>}<button type="submit" className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">Submit Request</button></form>
          <div><h3 className="text-base font-semibold text-slate-900">Allocation history</h3><p className="mt-1 text-sm text-slate-500">Recorded ownership and condition events.</p><ol className="mt-5 space-y-5 border-l border-slate-200 pl-5">{selectedAllocation.history.map((entry) => <li key={`${entry.date}-${entry.event}`} className="relative"><span className="absolute -left-[1.82rem] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" /><p className="text-sm font-semibold text-slate-900">{entry.event}</p><p className="mt-1 text-sm text-slate-500">{entry.detail}</p><p className="mt-1 text-xs font-medium text-slate-400">{entry.date}</p></li>)}</ol></div>
        </div>
      </section>}

      <Modal isOpen={isAllocateOpen} title="Allocate an asset" onClose={() => setIsAllocateOpen(false)}><p className="text-sm leading-6 text-slate-600">The available-asset allocation form is ready to connect to AssetFlow&apos;s backend approval service.</p><div className="mt-6 flex justify-end"><button type="button" onClick={() => { setIsAllocateOpen(false); setSnackbar("Asset allocation is ready for backend integration."); }} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Continue</button></div></Modal>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default Allocations;
