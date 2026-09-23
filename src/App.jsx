import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBusinessModeration from "./pages/AdminBusinessModeration";
import AdminJobModeration from "./pages/AdminJobModeration";
import AdminListings from "./pages/AdminListings";
import AdminSubscriptionPlans from "./pages/AdminSubscriptionPlans";
import AdminAdsModeration from "./pages/AdminAdsModeration";
import AdminPlatformSettings from "./pages/AdminPlatformSettings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="businesses" element={<AdminBusinessModeration />} />
        <Route path="jobs" element={<AdminJobModeration />} />
        <Route path="listings" element={<AdminListings />} />
        <Route path="subscription-plans" element={<AdminSubscriptionPlans />} />
        <Route path="ads" element={<AdminAdsModeration />} />
        <Route path="settings" element={<AdminPlatformSettings />} />
      </Route>
    </Routes>
  );
}
