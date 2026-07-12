import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/ui/Modal";
import Snackbar from "../components/ui/Snackbar";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";
import { getAsset } from "../services/asset.service";

const assetProfiles = [
  { id: "AF-1001", name: "MacBook Pro 14-inch", status: "Assigned", category: "Computing", department: "Engineering", assignedTo: "Priya Shah", purchaseDate: "12 January 2025", warrantyExpiry: "12 January 2028", vendor: "Apple India", serialNumber: "C02X7K9JMD6T", location: "Bengaluru HQ · Floor 4" },
  { id: "AF-1002", name: "ThinkPad T14 Gen 4", status: "Assigned", category: "Computing", department: "Field Operations", assignedTo: "Daniel Moore", purchaseDate: "03 March 2025", warrantyExpiry: "03 March 2028", vendor: "Lenovo India", serialNumber: "PF4L2N8C", location: "Bengaluru HQ · Floor 2" },
  { id: "AF-1003", name: "Epson EB-FH06 Projector", status: "Maintenance", category: "Audio & Visual", department: "Facilities", assignedTo: "Unassigned", purchaseDate: "18 November 2024", warrantyExpiry: "18 November 2026", vendor: "Epson India", serialNumber: "X9H002841", location: "Bengaluru HQ · Meeting Room B-2" },
  { id: "AF-1004", name: "Dell UltraSharp 27", status: "Assigned", category: "Displays", department: "Design", assignedTo: "Aditi Rao", purchaseDate: "22 February 2025", warrantyExpiry: "22 February 2028", vendor: "Dell Technologies", serialNumber: "CN0U2728", location: "Bengaluru HQ · Floor 5" },
  { id: "AF-1005", name: "Logitech Rally Bar Mini", status: "Available", category: "Audio & Visual", department: "Facilities", assignedTo: "Unassigned", purchaseDate: "07 September 2024", warrantyExpiry: "07 September 2026", vendor: "Logitech India", serialNumber: "LRBM-88420", location: "Bengaluru HQ · IT Store" },
  { id: "AF-1006", name: "iPhone 15 Pro", status: "Assigned", category: "Mobile", department: "Sales", assignedTo: "Meera Nair", purchaseDate: "15 April 2025", warrantyExpiry: "15 April 2026", vendor: "Apple India", serialNumber: "G6T4P7W2", location: "Mumbai Office · Sales" },
  { id: "AF-1007", name: "Herman Miller Sayl", status: "Available", category: "Furniture", department: "People Operations", assignedTo: "Unassigned", purchaseDate: "21 June 2023", warrantyExpiry: "21 June 2028", vendor: "Herman Miller", serialNumber: "HMS-1225", location: "Bengaluru HQ · Furniture Store" },
  { id: "AF-1008", name: "HP EliteBook 840", status: "Retired", category: "Computing", department: "Finance", assignedTo: "Rohan Mehta", purchaseDate: "08 August 2023", warrantyExpiry: "08 August 2026", vendor: "HP India", serialNumber: "5CD3124ZQK", location: "Bengaluru HQ · Archive" },
];

const lifecycle = [
  { label: "Registered", date: "12 Jan 2025", detail: "Added to inventory by Rohan Mehta", complete: true },
  { label: "Allocated", date: "14 Jan 2025", detail: "Assigned to Priya Shah, Engineering", complete: true },
  { label: "Returned", date: "Not yet recorded", detail: "Asset is currently assigned", complete: false },
  { label: "Maintenance", date: "No maintenance yet", detail: "No open maintenance records", complete: false },
  { label: "Reallocated", date: "Not yet recorded", detail: "No reallocation history", complete: false },
];

const maintenanceRows = [
  { id: "maint-01", date: "18 Feb 2025", type: "Preventive check", vendor: "Apple India", outcome: "Passed", cost: "₹0" },
  { id: "maint-02", date: "27 May 2025", type: "Battery diagnostics", vendor: "In-house IT", outcome: "No issue found", cost: "₹0" },
];

const bookingRows = [
  { id: "book-01", requester: "Priya Shah", period: "14 Jan 2025 — Present", purpose: "Primary work device", status: "Active" },
  { id: "book-02", requester: "Aditi Rao", period: "12 Jan 2025 — 13 Jan 2025", purpose: "Device verification", status: "Completed" },
];

const activity = [
  { title: "Allocation confirmed", detail: "Priya Shah accepted the asset allocation.", time: "12 minutes ago", tone: "bg-blue-600" },
  { title: "Asset record updated", detail: "Serial number and warranty details verified by IT Ops.", time: "2 days ago", tone: "bg-emerald-600" },
  { title: "Purchase record attached", detail: "Invoice and vendor documentation added to the asset record.", time: "12 Jan 2025", tone: "bg-slate-500" },
];

const AssetDetails = () => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState("");

  useEffect(() => {
    getAsset(assetId)
      .then((data) => {
        setAsset(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [assetId]);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  const maintenanceColumns = [
    { key: "date", label: "Date" },
    { key: "type", label: "Service type", render: (row) => <span className="font-medium text-slate-900">{row.type}</span> },
    { key: "vendor", label: "Provider" },
    { key: "outcome", label: "Outcome" },
    { key: "cost", label: "Cost" },
  ];
  const bookingColumns = [
    { key: "requester", label: "Booked by", render: (row) => <span className="font-medium text-slate-900">{row.requester}</span> },
    { key: "period", label: "Period" },
    { key: "purpose", label: "Purpose" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status === "Active" ? "Assigned" : "Inactive"} /> },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (!asset) {
    return (
      <div className="flex min-h-120 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500">?</span>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Asset not found</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">The asset record you&apos;re looking for may have been removed or is not available in the current inventory.</p>
        <button type="button" onClick={() => navigate("/assets")} className="mt-6 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">Return to Asset Management</button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <button type="button" onClick={() => navigate("/assets")} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"><ArrowLeft size={16} aria-hidden="true" />Back to assets</button>

      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight text-slate-900">{asset.name}</h1><StatusBadge status={asset.status} /></div>
          <p className="mt-2 font-mono text-sm font-semibold text-slate-500">{assetId}</p>
        </div>
        <button type="button" onClick={() => setIsEditOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200"><Pencil size={16} aria-hidden="true" />Edit asset</button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="overview-heading">
        <div className="mb-5"><h2 id="overview-heading" className="text-base font-semibold text-slate-900">Overview</h2><p className="mt-1 text-sm text-slate-500">Ownership, procurement and identification details.</p></div>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
          {[['Category', asset.category], ['Department', asset.department], ['Assigned to', asset.assignedTo], ['Purchase date', asset.purchaseDate], ['Warranty expiry', asset.warrantyExpiry], ['Vendor', asset.vendor], ['Serial number', asset.serialNumber], ['Location', asset.location]].map(([term, detail]) => <div key={term}><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{term}</dt><dd className="mt-1.5 text-sm font-medium text-slate-800">{detail}</dd></div>)}
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="lifecycle-heading">
        <div className="mb-6"><h2 id="lifecycle-heading" className="text-base font-semibold text-slate-900">Lifecycle timeline</h2><p className="mt-1 text-sm text-slate-500">Key stages in this asset&apos;s operational history.</p></div>
        <ol className="grid gap-5 md:grid-cols-5">
          {lifecycle.map((stage, index) => <li key={stage.label} className="relative min-w-0"><div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${stage.complete ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>{index + 1}</div><p className="text-sm font-semibold text-slate-900">{stage.label}</p><p className="mt-1 text-xs font-medium text-slate-500">{stage.date}</p><p className="mt-2 text-xs leading-5 text-slate-500">{stage.detail}</p></li>)}
        </ol>
      </section>

      <div className="grid gap-7 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="maintenance-heading"><div className="border-b border-slate-100 px-6 py-5"><h2 id="maintenance-heading" className="text-base font-semibold text-slate-900">Maintenance history</h2><p className="mt-1 text-sm text-slate-500">Service and inspection records.</p></div><Table columns={maintenanceColumns} rows={maintenanceRows} emptyState={null} /></section>
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="booking-heading"><div className="border-b border-slate-100 px-6 py-5"><h2 id="booking-heading" className="text-base font-semibold text-slate-900">Booking history</h2><p className="mt-1 text-sm text-slate-500">Reservations and assignments.</p></div><Table columns={bookingColumns} rows={bookingRows} emptyState={null} /></section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="activity-heading"><div className="mb-5"><h2 id="activity-heading" className="text-base font-semibold text-slate-900">Activity timeline</h2><p className="mt-1 text-sm text-slate-500">Latest changes to this asset record.</p></div><ol className="space-y-5">{activity.map((event) => <li key={event.title} className="flex gap-4"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${event.tone}`} /><div><p className="text-sm font-medium text-slate-900">{event.title}</p><p className="mt-1 text-sm text-slate-500">{event.detail}</p><p className="mt-1.5 text-xs text-slate-400">{event.time}</p></div></li>)}</ol></section>

      <Modal isOpen={isEditOpen} title="Edit asset" onClose={() => setIsEditOpen(false)}><p className="text-sm leading-6 text-slate-600">The asset editing workflow is ready to connect to AssetFlow&apos;s backend inventory service.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setIsEditOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={() => { setIsEditOpen(false); setSnackbar("Asset editing is ready for backend integration."); }} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Continue</button></div></Modal>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default AssetDetails;
