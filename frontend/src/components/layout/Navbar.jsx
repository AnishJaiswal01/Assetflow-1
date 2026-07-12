import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/organization": "Organization Setup",
  "/assets": "Assets",
  "/allocation": "Allocation & Transfer",
  "/bookings": "Resource Booking",
  "/maintenance": "Maintenance",
  "/audit": "Audit",
  "/reports": "Reports",
  "/notifications": "Notifications",
};

const Navbar = () => {
  const { pathname } = useLocation();
  const pageTitle = pageTitles[pathname] ?? "AssetFlow";

  return (
    <div className="flex h-16 items-center justify-between gap-6 px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="shrink-0">
        <ol className="flex items-center gap-2 text-sm">
          <li className="font-medium text-slate-500">Home</li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li className="font-medium text-slate-800" aria-current="page">{pageTitle}</li>
        </ol>
      </nav>

      <div className="flex items-center gap-4">
        <label className="relative hidden w-72 md:block">
          <span className="sr-only">Search</span>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="search"
            placeholder="Search assets, bookings..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-3 focus:ring-blue-100"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-3 focus:ring-blue-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            AD
          </span>
          <span className="hidden text-left lg:block">
            <span className="block text-sm font-medium text-slate-800">Admin User</span>
            <span className="block text-xs text-slate-500">Administrator</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
