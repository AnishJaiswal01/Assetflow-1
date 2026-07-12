import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Modal from "../components/ui/Modal";
import Snackbar from "../components/ui/Snackbar";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";

const initialAuditAssets = [
  { id: "audit-01", assetId: "AF-1001", name: "MacBook Pro 14-inch", department: "Engineering", location: "Bengaluru HQ · Desk E12", employee: "Priya Shah", status: "Verified", remarks: "Serial number and condition confirmed." },
  { id: "audit-02", assetId: "AF-1002", name: "ThinkPad T14 Gen 4", department: "Field Operations", location: "Bengaluru HQ · Desk F08", employee: "Daniel Moore", status: "Pending", remarks: "" },
  { id: "audit-03", assetId: "AF-1004", name: "Dell UltraSharp 27", department: "Engineering", location: "Bengaluru HQ · Desk E15", employee: "Aditi Rao", status: "Damaged", remarks: "Display has a visible panel crack; photo evidence required." },
  { id: "audit-04", assetId: "AF-1005", name: "Logitech Rally Bar Mini", department: "Facilities", location: "Meeting Room C-4", employee: "Unassigned", status: "Verified", remarks: "Installed and operational." },
  { id: "audit-05", assetId: "AF-1006", name: "iPhone 15 Pro", department: "Sales", location: "Mumbai Office · Sales", employee: "Meera Nair", status: "Missing", remarks: "Employee confirmation pending; last location was Mumbai Office." },
  { id: "audit-06", assetId: "AF-1007", name: "Herman Miller Sayl", department: "People Operations", location: "Bengaluru HQ · Furniture Store", employee: "Unassigned", status: "Pending", remarks: "" },
];

const departments = ["All departments", ...new Set(initialAuditAssets.map((asset) => asset.department))];
const statuses = ["All statuses", "Verified", "Missing", "Damaged", "Pending"];

const Audit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState(initialAuditAssets);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("Pending");
  const [remarks, setRemarks] = useState("");
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [snackbar, setSnackbar] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 550);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  const filteredAssets = useMemo(() => assets.filter((asset) => `${asset.assetId} ${asset.name} ${asset.location} ${asset.employee}`.toLowerCase().includes(query.trim().toLowerCase()) && (department === "All departments" || asset.department === department) && (status === "All statuses" || asset.status === status)), [assets, query, department, status]);
  const discrepancies = assets.filter((asset) => asset.status === "Missing" || asset.status === "Damaged");
  const missingCount = discrepancies.filter((asset) => asset.status === "Missing").length;
  const damagedCount = discrepancies.filter((asset) => asset.status === "Damaged").length;
  const verifiedCount = assets.filter((asset) => asset.status === "Verified").length;

  const openVerification = (asset) => {
    setSelectedAsset(asset);
    setVerificationStatus(asset.status);
    setRemarks(asset.remarks);
  };

  const saveVerification = () => {
    setAssets((current) => current.map((asset) => asset.id === selectedAsset.id ? { ...asset, status: verificationStatus, remarks } : asset));
    setSelectedAsset(null);
    setSnackbar(`${selectedAsset.assetId} marked as ${verificationStatus.toLowerCase()} in this audit cycle.`);
  };

  const columns = [
    { key: "assetId", label: "Asset ID", render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.assetId}</span> },
    { key: "name", label: "Asset name", render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
    { key: "location", label: "Expected location" },
    { key: "employee", label: "Assigned employee" },
    { key: "status", label: "Verification status", render: (row) => <StatusBadge status={row.status} /> },
  ];
  const emptyState = <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">⌕</span><h2 className="mt-4 text-sm font-semibold text-slate-900">No audit assets found</h2><p className="mt-1 text-sm text-slate-500">Try adjusting your search or verification filters.</p></div>;

  return (
    <div className="space-y-7">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><p className="text-sm font-medium text-blue-700">Active audit campaign</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Q3 2026 Physical Asset Verification</h1><p className="mt-2 text-sm text-slate-500">Engineering &amp; shared operations · 1 July — 15 July 2026</p></div><button type="button" onClick={() => setIsCloseOpen(true)} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">Close Audit Cycle</button></div><div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned auditors</p><p className="mt-1.5 text-sm font-medium text-slate-800">Aditi Rao, Sana Iqbal</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Progress summary</p><p className="mt-1.5 text-sm font-medium text-slate-800">{verifiedCount} verified of {assets.length} expected assets</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Remaining</p><p className="mt-1.5 text-sm font-medium text-slate-800">{assets.filter((asset) => asset.status === "Pending").length} assets pending verification</p></div></div></section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row xl:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Search audit assets</span><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search asset IDs, names, locations or employees..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" /></label><div><label htmlFor="audit-department" className="sr-only">Department</label><select id="audit-department" value={department} onChange={(event) => setDepartment(event.target.value)} className="h-10 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">{departments.map((option) => <option key={option}>{option}</option>)}</select></div><div><label htmlFor="audit-status" className="sr-only">Verification status</label><select id="audit-status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 min-w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">{statuses.map((option) => <option key={option}>{option}</option>)}</select></div></div><div className="flex items-center justify-between px-5 py-4"><p className="text-sm text-slate-500">{filteredAssets.length} assets expected for verification</p><p className="text-xs text-slate-400">Click a row to verify</p></div>{isLoading ? <div className="space-y-px border-t border-slate-100 p-5">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div> : <Table columns={columns} rows={filteredAssets} emptyState={emptyState} stickyHeader onRowClick={openVerification} getRowClassName={(row) => row.id === selectedAsset?.id ? "bg-blue-50/70" : ""} />}</section>

      <section className={`rounded-xl border p-5 shadow-sm transition-colors ${discrepancies.length ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`} aria-labelledby="discrepancy-heading"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 id="discrepancy-heading" className={`text-base font-semibold ${discrepancies.length ? "text-amber-900" : "text-emerald-900"}`}>Discrepancy summary</h2><p className={`mt-1 text-sm ${discrepancies.length ? "text-amber-700" : "text-emerald-700"}`}>{discrepancies.length ? `${discrepancies.length} assets flagged for follow-up in the current audit cycle.` : "No discrepancies have been recorded in this audit cycle."}</p></div>{discrepancies.length > 0 && <div className="flex gap-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Missing</p><p className="mt-1 text-xl font-semibold text-amber-900">{missingCount}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Damaged</p><p className="mt-1 text-xl font-semibold text-amber-900">{damagedCount}</p></div></div>}</div></section>

      <Modal isOpen={Boolean(selectedAsset)} title="Verify asset" onClose={() => setSelectedAsset(null)}>{selectedAsset && <div className="space-y-5"><div className="rounded-lg bg-slate-50 p-4"><p className="font-mono text-xs font-semibold text-slate-500">{selectedAsset.assetId}</p><p className="mt-1 text-sm font-semibold text-slate-900">{selectedAsset.name}</p><p className="mt-1 text-sm text-slate-500">Expected at {selectedAsset.location}</p></div><div><p className="text-sm font-medium text-slate-700">Verification result</p><div className="mt-2 grid grid-cols-2 gap-2">{["Verified", "Missing", "Damaged", "Pending"].map((option) => <button key={option} type="button" onClick={() => setVerificationStatus(option)} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${verificationStatus === option ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{option}</button>)}</div></div><label className="block text-sm font-medium text-slate-700">Remarks<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows="3" placeholder="Add verification notes or observed condition..." className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100" /></label><div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">Evidence attachments will be available when backend file storage is connected.</div><div className="flex justify-end gap-3"><button type="button" onClick={() => setSelectedAsset(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={saveVerification} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save verification</button></div></div>}</Modal>
      <Modal isOpen={isCloseOpen} title="Close audit cycle" onClose={() => setIsCloseOpen(false)}><p className="text-sm leading-6 text-slate-600">Closing this audit will generate a verification report and send any discrepancies for backend processing.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setIsCloseOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={() => { setIsCloseOpen(false); setSnackbar("Audit report generated and ready for backend processing."); }} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Close audit cycle</button></div></Modal>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default Audit;
