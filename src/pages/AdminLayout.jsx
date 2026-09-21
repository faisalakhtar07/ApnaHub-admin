import React from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Briefcase, ShoppingBag, LogOut, ShieldCheck, CreditCard, Megaphone, Settings } from "lucide-react";
import { adminAuthApi } from "../lib/api";
import NotificationBell from "./NotificationBell";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Businesses", to: "/businesses", icon: Building2 },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
  { label: "Listings", to: "/listings", icon: ShoppingBag },
  { label: "Subscription Plans", to: "/subscription-plans", icon: CreditCard },
  { label: "Ad Moderation", to: "/ads", icon: Megaphone },
  { label: "Platform Settings", to: "/settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  if (!adminAuthApi.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    adminAuthApi.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B1120]">
      <aside className="w-64 shrink-0 bg-[#0B1120] text-slate-300 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center">
            <ShieldCheck size={15} className="text-white" />
          </span>
          <span className="font-display font-bold text-white text-sm">APNAHUB Admin</span>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-indigo-500/15 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white w-full">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 flex items-center justify-end px-6 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-[#0B1120]">
          <NotificationBell />
        </header>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
