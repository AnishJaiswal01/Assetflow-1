import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, List, Plus, Search } from "lucide-react";
import Modal from "../components/ui/Modal";
import Snackbar from "../components/ui/Snackbar";
import StatusBadge from "../components/ui/StatusBadge";
import Table from "../components/ui/Table";

const resources = [
  { id: "RES-01", name: "Meeting Room B-2", type: "Meeting room", location: "Bengaluru HQ · Floor 2", capacity: "8 people", availability: "Booked" },
  { id: "RES-02", name: "Meeting Room A-1", type: "Meeting room", location: "Bengaluru HQ · Floor 1", capacity: "12 people", availability: "Available" },
  { id: "RES-03", name: "Epson EB-FH06 Projector", type: "Projector", location: "IT Store", capacity: "Portable", availability: "Maintenance" },
  { id: "RES-04", name: "Logitech Rally Bar Mini", type: "Conference equipment", location: "Meeting Room C-4", capacity: "12 people", availability: "Available" },
  { id: "RES-05", name: "Electronics Lab Station 03", type: "Lab equipment", location: "Bengaluru HQ · Lab", capacity: "4 people", availability: "Booked" },
  { id: "RES-06", name: "Sony A7 IV Camera Kit", type: "Lab equipment", location: "Creative Studio", capacity: "Portable", availability: "Available" },
];

const initialBookings = [
  { id: "BK-1024", resourceId: "RES-01", resource: "Meeting Room B-2", date: "2026-06-08", start: "14:00", end: "15:00", bookedBy: "Priya Shah", purpose: "Design sprint review" },
  { id: "BK-1025", resourceId: "RES-05", resource: "Electronics Lab Station 03", date: "2026-06-08", start: "10:00", end: "12:00", bookedBy: "Daniel Moore", purpose: "Sensor calibration" },
  { id: "BK-1026", resourceId: "RES-04", resource: "Logitech Rally Bar Mini", date: "2026-06-09", start: "11:30", end: "12:30", bookedBy: "Meera Nair", purpose: "Sales enablement call" },
  { id: "BK-1027", resourceId: "RES-02", resource: "Meeting Room A-1", date: "2026-06-10", start: "09:00", end: "10:30", bookedBy: "Aditi Rao", purpose: "Leadership stand-up" },
];

const resourceTypes = ["All resource types", ...new Set(resources.map((resource) => resource.type))];
const availabilityStatuses = ["All availability", "Available", "Booked", "Maintenance"];
const formatTime = (time) => new Date(`2026-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const Bookings = () => {
  const [view, setView] = useState("list");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All resource types");
  const [availability, setAvailability] = useState("All availability");
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookings, setBookings] = useState(initialBookings);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [form, setForm] = useState({ resourceId: "", date: "2026-06-08", start: "09:00", end: "10:00", purpose: "" });
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState("");
  const historyPanelRef = useRef(null);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeoutId = window.setTimeout(() => setSnackbar(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  useEffect(() => {
    if (selectedResource) {
      historyPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedResource]);

  const filteredResources = useMemo(() => resources.filter((resource) => `${resource.name} ${resource.type} ${resource.location}`.toLowerCase().includes(query.trim().toLowerCase()) && (type === "All resource types" || resource.type === type) && (availability === "All availability" || resource.availability === availability)), [query, type, availability]);
  const selectedBookings = selectedResource ? bookings.filter((booking) => booking.resourceId === selectedResource.id) : [];

  const columns = [
    { key: "name", label: "Resource", render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
    { key: "type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "capacity", label: "Capacity" },
    { key: "availability", label: "Availability", render: (row) => <StatusBadge status={row.availability} /> },
    { key: "actions", label: "", render: (row) => <div className="flex justify-end gap-3 whitespace-nowrap"><button type="button" onClick={() => { setSelectedResource(row); }} className="text-xs font-semibold text-blue-700 hover:text-blue-800">View history</button><button type="button" disabled={row.availability === "Maintenance"} onClick={() => { setForm((current) => ({ ...current, resourceId: row.id })); setFormError(""); setIsBookingOpen(true); }} className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40">Book</button></div> },
  ];

  const submitBooking = (event) => {
    event.preventDefault();
    if (!form.resourceId || !form.date || !form.start || !form.end || !form.purpose.trim()) {
      setFormError("Choose a resource, date and time range, then add a booking purpose.");
      return;
    }
    if (form.start >= form.end) {
      setFormError("The end time must be later than the start time.");
      return;
    }
    const overlap = bookings.some((booking) => booking.resourceId === form.resourceId && booking.date === form.date && form.start < booking.end && form.end > booking.start);
    if (overlap) {
      setFormError("This resource is already booked during the selected time. Choose a different time slot.");
      return;
    }
    const resource = resources.find((item) => item.id === form.resourceId);
    setBookings((current) => [...current, { id: `BK-${1028 + current.length}`, resourceId: resource.id, resource: resource.name, date: form.date, start: form.start, end: form.end, bookedBy: "Admin User", purpose: form.purpose }]);
    setIsBookingOpen(false);
    setFormError("");
    setForm({ resourceId: "", date: "2026-06-08", start: "09:00", end: "10:00", purpose: "" });
    setSnackbar(`${resource.name} has been reserved in this local booking preview.`);
  };

  const emptyState = <div className="flex flex-col items-center justify-center px-6 py-16 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">⌕</span><h2 className="mt-4 text-sm font-semibold text-slate-900">No resources found</h2><p className="mt-1 text-sm text-slate-500">Try adjusting the search or availability filters.</p></div>;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Resource Booking</h1><p className="mt-2 text-sm text-slate-500">Reserve shared spaces and equipment while keeping availability visible to every team.</p></div><button type="button" onClick={() => { setFormError(""); setIsBookingOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200"><Plus size={17} aria-hidden="true" />Book Resource</button></section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row xl:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Search resources</span><Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources, types or locations..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100" /></label><div><label htmlFor="resource-type" className="sr-only">Resource type</label><select id="resource-type" value={type} onChange={(event) => setType(event.target.value)} className="h-10 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">{resourceTypes.map((option) => <option key={option}>{option}</option>)}</select></div><div><label htmlFor="availability" className="sr-only">Availability</label><select id="availability" value={availability} onChange={(event) => setAvailability(event.target.value)} className="h-10 min-w-36 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">{availabilityStatuses.map((option) => <option key={option}>{option}</option>)}</select></div><div className="flex rounded-lg border border-slate-200 p-1"><button type="button" onClick={() => setView("list")} aria-label="List view" className={`rounded-md p-2 ${view === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}><List size={17} /></button><button type="button" onClick={() => setView("calendar")} aria-label="Calendar view" className={`rounded-md p-2 ${view === "calendar" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}><CalendarDays size={17} /></button></div></div><div className="flex items-center justify-between px-5 py-4"><p className="text-sm text-slate-500">{filteredResources.length} shared resources</p><p className="text-xs text-slate-400">Availability updated just now</p></div>{view === "list" ? <Table columns={columns} rows={filteredResources} emptyState={emptyState} stickyHeader getRowClassName={(row) => row.id === selectedResource?.id ? "bg-blue-50/70 shadow-[inset_3px_0_0_#2563eb] hover:bg-blue-50" : ""} /> : <div className="border-t border-slate-100 p-5"><div className="grid gap-3 md:grid-cols-5">{["Mon 8", "Tue 9", "Wed 10", "Thu 11", "Fri 12"].map((day, index) => <div key={day} className="min-h-44 rounded-lg border border-slate-200 bg-slate-50/60 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</p>{bookings.filter((booking) => booking.date === `2026-06-${String(8 + index).padStart(2, "0")}`).map((booking) => <div key={booking.id} className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-2"><p className="text-xs font-semibold text-blue-900">{booking.resource}</p><p className="mt-1 text-xs text-blue-700">{formatTime(booking.start)} — {formatTime(booking.end)}</p></div>)}</div>)}</div><p className="mt-4 text-xs text-slate-500">Calendar preview displays scheduled mock bookings for the current work week.</p></div>}</section>

      {selectedResource && <section ref={historyPanelRef} className="rounded-xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm transition-all duration-300" aria-labelledby="history-heading"><div className="flex flex-col justify-between gap-3 border-b border-blue-100 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Booking history</p><h2 id="history-heading" className="mt-1 text-lg font-semibold text-slate-900">Viewing booking history for {selectedResource.name}</h2><p className="mt-1 text-sm text-slate-500">{selectedResource.location}</p></div><StatusBadge status={selectedResource.availability} /></div>{selectedBookings.length > 0 ? <ol className="mt-5 divide-y divide-blue-100">{selectedBookings.map((booking) => <li key={booking.id} className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-slate-900">{booking.purpose}</p><p className="mt-1 text-sm text-slate-500">{booking.bookedBy} · {booking.date}</p></div><p className="text-sm font-medium text-slate-700">{formatTime(booking.start)} — {formatTime(booking.end)}</p></li>)}</ol> : <p className="mt-5 text-sm text-slate-500">No bookings have been recorded for this resource.</p>}</section>}

      <Modal isOpen={isBookingOpen} title="Book a resource" onClose={() => setIsBookingOpen(false)}><form onSubmit={submitBooking} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Resource<select value={form.resourceId} onChange={(event) => setForm((current) => ({ ...current, resourceId: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"><option value="">Select resource</option>{resources.filter((resource) => resource.availability !== "Maintenance").map((resource) => <option key={resource.id} value={resource.id}>{resource.name}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-slate-700">Date<input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label><label className="block text-sm font-medium text-slate-700">Purpose<input value={form.purpose} onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))} placeholder="Team meeting" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label></div><div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-slate-700">Start time<input type="time" value={form.start} onChange={(event) => setForm((current) => ({ ...current, start: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label><label className="block text-sm font-medium text-slate-700">End time<input type="time" value={form.end} onChange={(event) => setForm((current) => ({ ...current, end: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" /></label></div>{formError && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{formError}</p>}<div className="flex justify-end"><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Confirm booking</button></div></form></Modal>
      <Snackbar message={snackbar} />
    </div>
  );
};

export default Bookings;
