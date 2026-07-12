import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import Allocations from "./pages/Allocations";
import Bookings from "./pages/Bookings";
import Maintenance from "./pages/Maintenance";
import Audit from "./pages/Audit";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organization" element={<Departments />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:assetId" element={<AssetDetails />} />
          <Route path="allocation" element={<Allocations />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="audit" element={<Audit />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
