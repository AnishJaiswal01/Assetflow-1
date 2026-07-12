import { useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";

const tabs = [
  { id: "departments", label: "Departments" },
  { id: "categories", label: "Categories" },
  { id: "employees", label: "Employees" },
];

const organizationData = {
  departments: [
    { id: "dept-engineering", name: "Engineering", lead: "Aditi Rao", parent: "—", status: "Active" },
    { id: "dept-facilities", name: "Facilities", lead: "Rohan Mehta", parent: "—", status: "Active" },
    { id: "dept-field-ops", name: "Field Operations (East)", lead: "Sana Iqbal", parent: "Field Operations", status: "Inactive" },
  ],
  categories: [
    { id: "cat-computing", name: "Computing", code: "COMP", description: "Laptops, desktops and accessories", status: "Active" },
    { id: "cat-av", name: "Audio & Visual", code: "AV", description: "Displays, projectors and meeting equipment", status: "Active" },
    { id: "cat-furniture", name: "Furniture", code: "FURN", description: "Workspace and facility furniture", status: "Inactive" },
  ],
  employees: [],
};

const columnsByTab = {
  departments: [
    { key: "name", label: "Department", render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
    { key: "lead", label: "Department head" },
    { key: "parent", label: "Parent department" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ],
  categories: [
    { key: "name", label: "Category", render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ],
  employees: [
    { key: "name", label: "Employee" },
    { key: "department", label: "Department" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ],
};

const singularLabels = {
  departments: "department",
  categories: "category",
  employees: "employee",
};

const Departments = () => {
  const [activeTab, setActiveTab] = useState("departments");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const activeLabel = singularLabels[activeTab];
  const tableColumns = [
    ...columnsByTab[activeTab],
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex justify-end gap-3 whitespace-nowrap">
          <button type="button" onClick={() => setNotice(`Edit ${row.name} is ready to connect.`)} className="text-xs font-semibold text-slate-600 hover:text-blue-700">Edit</button>
          <button type="button" onClick={() => setNotice(`Delete ${row.name} is ready to connect.`)} className="text-xs font-semibold text-slate-600 hover:text-rose-700">Delete</button>
        </div>
      ),
    },
  ];
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return organizationData[activeTab];

    return organizationData[activeTab].filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [activeTab, query]);

  const emptyState = (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Users size={20} aria-hidden="true" /></span>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">No {activeTab} found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {query ? "Try a different search term." : `Add the first ${activeLabel} to make it available across AssetFlow.`}
      </p>
      {!query && <button type="button" onClick={() => setNotice(`Add ${activeLabel} flow is ready to connect.`)} className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-800">Add {activeLabel}</button>}
    </div>
  );

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Organization setup</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Admin only</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">Manage the master data used across assets, allocations and bookings.</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Organization data">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => { setActiveTab(tab.id); setQuery(""); setNotice(""); }}
                className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setNotice(`Add ${activeLabel} flow is ready to connect.`)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200">
            <Plus size={17} aria-hidden="true" /> Add {activeLabel}
          </button>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Changes here will populate downstream AssetFlow workflows.</p>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search {activeTab}</span>
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeTab}...`} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" />
          </label>
        </div>

        {notice && <div className="mx-5 mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div>}
        <Table columns={tableColumns} rows={rows} emptyState={emptyState} />
      </section>
    </div>
  );
};

export default Departments;
