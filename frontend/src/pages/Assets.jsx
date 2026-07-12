import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import Snackbar from "../components/ui/Snackbar";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";

import { getAssets } from "../services/asset.service";

const Assets = () => {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");

  const [page, setPage] = useState(1);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [snackbar, setSnackbar] = useState("");

  const pageSize = 5;

  useEffect(() => {
    getAssets()
      .then((data) => {
        setAssets(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

const categories = [
  "All categories",
  ...new Set(assets.map((asset) => asset.category))
];

const departments = [
  "All departments",
  ...new Set(assets.map((asset) => asset.department))
];

console.log("ASSETS", assets);
console.log("CATEGORIES", categories);
console.log("DEPARTMENTS", departments);

const statuses = ["All statuses", "available", "assigned", "maintenance", "retired"];

useEffect(() => {
  const timeoutId = window.setTimeout(() => setIsLoading(false), 550);
  return () => window.clearTimeout(timeoutId);
}, []);

useEffect(() => {
  if (!snackbar) return undefined;

  const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);

  return () => window.clearTimeout(timeoutId);
}, [snackbar]);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const matchesQuery = Object.values(asset).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        );

        return (
          matchesQuery &&
          (category === "All categories" || asset.category === category) &&
          (department === "All departments" || asset.department === department) &&
          (status === "All statuses" || asset.status === status)
        );
      }),
    [assets, query, category, department, status]
  );

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const pageRows = filteredAssets.slice((page - 1) * pageSize, page * pageSize);
  const resetFilters = () => { setQuery(""); setCategory("All categories"); setDepartment("All departments"); setStatus("All statuses"); setPage(1); };

  const columns = [
    { key: "id", label: "Asset ID", render: (asset) => <span className="font-mono text-xs font-semibold text-slate-700">{asset.id}</span> },
    { key: "name", label: "Asset name", render: (asset) => <span className="font-medium text-slate-900">{asset.name}</span> },
    { key: "asset_tag", label: "Asset Tag" },
    { key: "category", label: "Category" },
    { key: "department", label: "Department" },
    { key: "purchaseDate", label: "Purchase date" },
    { key: "status", label: "Status", render: (asset) => <StatusBadge status={asset.status} /> },
    { key: "updated", label: "Last updated" },
    {
      key: "actions",
      label: "",
      render: (asset) => <div className="flex justify-end gap-3 whitespace-nowrap"><button type="button" onClick={() => navigate(`/assets/${asset.id}`)} className="text-xs font-semibold text-blue-700 hover:text-blue-800">View</button><button type="button" onClick={() => setSnackbar(`Edit ${asset.id} is ready for backend integration.`)} className="text-xs font-semibold text-slate-600 hover:text-slate-900">Edit</button></div>,
    },
  ];

  const emptyState = <div className="flex flex-col items-center px-6 py-16 text-center"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">⌕</div><h3 className="mt-4 text-sm font-semibold text-slate-900">No assets found</h3><p className="mt-1 max-w-sm text-sm text-slate-500">Try adjusting your filters or register a new asset to add it to inventory.</p><button type="button" onClick={resetFilters} className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800">Reset filters</button></div>;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Asset Management</h1><p className="mt-2 text-sm text-slate-500">Track inventory, ownership and lifecycle status across your organization.</p></div>
        <button type="button" onClick={() => setIsRegisterOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200"><Plus size={17} aria-hidden="true" />Register Asset</button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1"><span className="sr-only">Search assets</span><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search assets, assignees or IDs..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" /></label>
          {[{ value: category, setValue: setCategory, options: categories, label: "Category" }, { value: department, setValue: setDepartment, options: departments, label: "Department" }, { value: status, setValue: setStatus, options: statuses, label: "Status" }].map((filter) => <div key={filter.label}><label htmlFor={filter.label} className="sr-only">{filter.label}</label><select id={filter.label} value={filter.value} onChange={(event) => { filter.setValue(event.target.value); setPage(1); }} className="h-10 min-w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100">{filter.options.map((option) => <option key={option}>{option}</option>)}</select></div>)}
          <button type="button" onClick={resetFilters} className="shrink-0 px-2 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-blue-700">Reset filters</button>
        </div>
        <div className="flex items-center justify-between px-5 py-4"><p className="text-sm text-slate-500">{filteredAssets.length} assets in inventory</p><p className="text-xs text-slate-400">Updated just now</p></div>
        {isLoading ? <div className="space-y-px border-t border-slate-100 p-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div> : <Table columns={columns} rows={pageRows} emptyState={emptyState} stickyHeader />}
        {!isLoading && filteredAssets.length > 0 && <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4"><p className="text-sm text-slate-500">Page {page} of {totalPages}</p><div className="flex gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div>}
      </section>

      <Modal isOpen={isRegisterOpen} title="Register a new asset" onClose={() => setIsRegisterOpen(false)}><p className="text-sm leading-6 text-slate-600">The registration workflow is ready to connect to AssetFlow&apos;s backend inventory service.</p><div className="mt-6 flex justify-end"><button type="button" onClick={() => setIsRegisterOpen(false)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Understood</button></div></Modal>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default Assets;
