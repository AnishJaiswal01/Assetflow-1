import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, ClipboardCheck, Search, ShieldAlert, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snackbar from "../components/ui/Snackbar";

const tabs = ["All", "Alerts", "Approvals", "Bookings", "Maintenance"];
const notifications = [
  { id: "note-01", category: "Approvals", title: "Transfer request submitted", description: "Priya Shah requested transfer of AF-1001 to Aditi Rao.", time: "12 minutes ago", priority: "High", icon: ClipboardCheck, tone: "bg-violet-100 text-violet-700", to: "/allocation" },
  { id: "note-02", category: "Bookings", title: "Booking confirmed", description: "Meeting Room B-2 is booked today from 2:00 PM to 3:00 PM.", time: "28 minutes ago", priority: "Normal", icon: CalendarDays, tone: "bg-blue-100 text-blue-700", to: "/bookings" },
  { id: "note-03", category: "Maintenance", title: "Maintenance requested", description: "A display issue was reported for Epson EB-FH06 Projector.", time: "1 hour ago", priority: "High", icon: Wrench, tone: "bg-amber-100 text-amber-700", to: "/maintenance" },
  { id: "note-04", category: "Alerts", title: "Audit discrepancy detected", description: "AF-1006 is marked missing in the Q3 physical verification cycle.", time: "2 hours ago", priority: "Critical", icon: ShieldAlert, tone: "bg-rose-100 text-rose-700", to: "/audit" },
  { id: "note-05", category: "Approvals", title: "Asset allocated", description: "Dell UltraSharp 27 was allocated to Aditi Rao in Design.", time: "Yesterday", priority: "Normal", icon: CheckCircle2, tone: "bg-emerald-100 text-emerald-700", to: "/allocation" },
  { id: "note-06", category: "Bookings", title: "Booking cancelled", description: "Lab Station 03 booking was released by Daniel Moore.", time: "Yesterday", priority: "Normal", icon: CalendarDays, tone: "bg-slate-100 text-slate-700", to: "/bookings" },
  { id: "note-07", category: "Maintenance", title: "Maintenance completed", description: "HP EliteBook 840 keyboard replacement passed quality checks.", time: "2 days ago", priority: "Normal", icon: Wrench, tone: "bg-emerald-100 text-emerald-700", to: "/maintenance" },
  { id: "note-08", category: "Alerts", title: "Warranty nearing expiry", description: "Coverage for Epson EB-FH06 Projector expires in 60 days.", time: "3 days ago", priority: "High", icon: Bell, tone: "bg-amber-100 text-amber-700", to: "/assets/AF-1003" },
  { id: "note-09", category: "Alerts", title: "Asset overdue for return", description: "ThinkPad T14 Gen 4 has not been returned after its allocation period.", time: "4 days ago", priority: "High", icon: ShieldAlert, tone: "bg-rose-100 text-rose-700", to: "/assets/AF-1002" },
];

const priorityClasses = { Critical: "bg-rose-100 text-rose-700", High: "bg-amber-100 text-amber-700", Normal: "bg-slate-100 text-slate-600" };

const Notifications = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [snackbar, setSnackbar] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  const filteredNotifications = useMemo(() => notifications.filter((notification) => (activeTab === "All" || notification.category === activeTab) && `${notification.title} ${notification.description}`.toLowerCase().includes(query.trim().toLowerCase())), [activeTab, query]);
  const openNotification = (notification) => {
    setSelectedNotification(notification);
    if (notification.to) navigate(notification.to);
    else setSnackbar("Notification detail is ready for backend integration.");
  };

  return (
    <div className="space-y-7"><section><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notifications &amp; Activity</h1><p className="mt-2 text-sm text-slate-500">A centralized feed of operational activity, approvals and asset alerts.</p></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Notification filters">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>{tab}</button>)}</div><label className="relative mb-4 w-full sm:w-72"><span className="sr-only">Search notifications</span><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activity..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" /></label></div>{isLoading ? <div className="space-y-px p-5">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-100" />)}</div> : filteredNotifications.length > 0 ? <ol className="divide-y divide-slate-100">{filteredNotifications.map((notification) => { const Icon = notification.icon; return <li key={notification.id}><button type="button" onClick={() => openNotification(notification)} className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 ${selectedNotification?.id === notification.id ? "bg-blue-50/60" : ""}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.tone}`}><Icon size={18} aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="flex flex-col justify-between gap-2 sm:flex-row"><span className="text-sm font-semibold text-slate-900">{notification.title}</span><span className={`w-fit rounded-full px-2 py-1 text-[11px] font-semibold ${priorityClasses[notification.priority]}`}>{notification.priority}</span></span><span className="mt-1 block text-sm text-slate-600">{notification.description}</span><span className="mt-2 block text-xs text-slate-400">{notification.time}</span></span></button></li>; })}</ol> : <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Bell size={20} /></span><h2 className="mt-4 text-sm font-semibold text-slate-900">No notifications found</h2><p className="mt-1 text-sm text-slate-500">Try a different search term or activity filter.</p></div>}</section><Snackbar message={snackbar} /></div>
  );
};

export default Notifications;
