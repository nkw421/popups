import { Routes, Route, Navigate } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/site/Home";
import Project from "./pages/site/Project";
import Features from "./pages/site/Features";
import UseCases from "./pages/site/UseCases";
import TechStack from "./pages/site/TechStack";
import News from "./pages/site/News";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminParticipants from "./pages/admin/Participants";
import AdminCheckin from "./pages/admin/Checkin";
import AdminPayments from "./pages/admin/Payments";
import AdminNotices from "./pages/admin/Notices";
import AdminCommunity from "./pages/admin/Community";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/features" element={<Features />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/tech" element={<TechStack />} />
        <Route path="/news" element={<News />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="participants" element={<AdminParticipants />} />
        <Route path="checkin" element={<AdminCheckin />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
