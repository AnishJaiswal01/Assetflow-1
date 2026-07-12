import { NavLink } from "react-router-dom";
import {
  Bell,
  Boxes,
  ClipboardCheck,
  FileBarChart,
  Gauge,
  Landmark,
  Repeat2,
  Settings2,
  Wrench,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", to: "/", icon: Gauge, end: true },
  { label: "Organization Setup", to: "/organization", icon: Landmark },
  { label: "Assets", to: "/assets", icon: Boxes },
  { label: "Allocation & Transfer", to: "/allocation", icon: Repeat2 },
  { label: "Resource Booking", to: "/bookings", icon: ClipboardCheck },
  { label: "Maintenance", to: "/maintenance", icon: Wrench },
  { label: "Audit", to: "/audit", icon: Settings2 },
  { label: "Reports", to: "/reports", icon: FileBarChart },
  { label: "Notifications", to: "/notifications", icon: Bell },
];

const Sidebar = () => {
  return (
    <div className="m-3 flex h-[calc(100%-1.5rem)] flex-col rounded-2xl border border-white/80 bg-white/75 px-3 py-5 shadow-[0_8px_30px_rgb(15_23_42/0.06)] backdrop-blur-xl">
      <NavLink
        to="/"
        className="mb-8 flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/80"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
          AF
        </span>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          AssetFlow
        </span>
      </NavLink>

      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigation.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.25 : 1.8}
                  className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-slate-100 px-3 pt-4 text-xs text-slate-400">
        Asset management platform
      </div>
    </div>
  );
};

export default Sidebar;
