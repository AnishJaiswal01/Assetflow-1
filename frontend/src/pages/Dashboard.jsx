import { useEffect, useState } from "react";
import { Bell, Boxes, ClipboardCheck, Gauge, Repeat2, Settings2 } from "lucide-react";
import KPICard from "../components/cards/KPICard";

const metrics = [
  { label: "Available assets", value: "128", detail: "Ready for allocation", trend: "+8 this month", tone: "emerald", icon: Boxes },
  { label: "Allocated assets", value: "76", detail: "Across 12 departments", trend: "59% of inventory", tone: "blue", icon: Gauge },
  { label: "Assets in maintenance", value: "4", detail: "2 due back this week", trend: "Needs review", tone: "amber", icon: Settings2 },
  { label: "Active bookings", value: "9", detail: "3 scheduled for today", trend: "+2 today", tone: "violet", icon: ClipboardCheck },
  { label: "Pending transfers", value: "3", detail: "Awaiting manager approval", trend: "Action required", tone: "rose", icon: Repeat2 },
  { label: "Upcoming returns", value: "12", detail: "Due within the next 7 days", trend: "Plan ahead", tone: "slate", icon: Bell },
];

const activities = [
  { initials: "PM", name: "Priya Shah", action: "allocated MacBook Pro 14\"", meta: "to Design · 12 minutes ago", tone: "bg-blue-600" },
  { initials: "RB", name: "Room B-2", action: "booking confirmed", meta: "Today, 2:00 PM – 3:00 PM", tone: "bg-violet-600" },
  { initials: "AF", name: "Projector AF-0062", action: "maintenance resolved", meta: "by Facilities · 38 minutes ago", tone: "bg-emerald-600" },
  { initials: "DM", name: "Daniel Moore", action: "submitted a transfer request", meta: "ThinkPad T14 · 1 hour ago", tone: "bg-amber-600" },
];

const getGreeting = (hour) => {
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const getRelativeTimestamp = (timestamp, now) => {
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  if (minutes < 1) return "Updated just now";
  if (minutes === 1) return "Updated 1 minute ago";
  if (minutes < 60) return `Updated ${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  return `Updated ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
};

const Dashboard = () => {
  const [now, setNow] = useState(() => new Date());
  const [lastSyncedAt] = useState(() => new Date(Date.now() - 2 * 60 * 1000));

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  const greeting = getGreeting(now.getHours());
  const currentDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{greeting}, Admin</h2>
          <p className="mt-1 text-sm text-slate-500">{currentDate}</p>
          <p className="mt-3 text-sm text-slate-500">Here&apos;s a snapshot of your organization&apos;s asset operations.</p>
        </div>
        <p className="text-sm text-slate-500">{getRelativeTimestamp(lastSyncedAt, now)}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Asset overview metrics">
        {metrics.map((metric) => <KPICard key={metric.label} {...metric} />)}
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Overdue asset alert">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">!</span>
          <div>
            <p className="text-sm font-semibold text-rose-900">3 assets are overdue for return</p>
            <p className="mt-1 text-sm text-rose-700">Follow up with the assigned employees to keep inventory records accurate.</p>
          </div>
        </div>
        <button type="button" className="shrink-0 text-sm font-semibold text-rose-700 transition-colors hover:text-rose-900">Review overdue assets</button>
      </section>

      <section aria-labelledby="quick-actions-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="quick-actions-heading" className="text-base font-semibold text-slate-900">Quick actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <button type="button" className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200">Register asset</button>
          <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-slate-200">Book resource</button>
          <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-slate-200">Raise request</button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="recent-activity-heading">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="recent-activity-heading" className="text-base font-semibold text-slate-900">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-500">Latest changes across your workspace</p>
          </div>
          <button type="button" className="text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800">View all</button>
        </div>
        <ol className="divide-y divide-slate-100">
          {activities.map(({ initials, name, action, meta, tone }) => (
            <li key={`${name}-${action}`} className="flex items-center gap-4 px-5 py-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${tone}`}>{initials}</span>
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700"><span className="font-semibold text-slate-900">{name}</span> {action}</p>
                <p className="mt-1 text-xs text-slate-500">{meta}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Dashboard;
