import React, { useEffect, useState } from "react";
import { Building2, Briefcase, ShoppingBag, Megaphone, Clock } from "lucide-react";
import Card from "../components/ui/Card";
import { businessesAdminApi, jobsAdminApi, listingsApi, adsApi } from "../lib/api";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ businesses: 0, jobs: 0, listings: 0, ads: 0 });
  const [pending, setPending] = useState({ businesses: 0, jobs: 0, listings: 0, ads: 0 });

  useEffect(() => {
    Promise.all([businessesAdminApi.all(), jobsAdminApi.all(), listingsApi.list(), adsApi.all()]).then(
      ([businesses, jobs, listings, ads]) => {
        setCounts({ businesses: businesses.length, jobs: jobs.length, listings: listings.length, ads: ads.length });
        setPending({
          businesses: businesses.filter((b) => b.status === "pending").length,
          jobs: jobs.filter((j) => j.status === "pending").length,
          listings: listings.filter((l) => l.status === "pending").length,
          ads: ads.filter((a) => a.status === "pending" || a.needsMediaDesign).length,
        });
      }
    );
  }, []);

  const cards = [
    { icon: Building2, label: "Businesses", value: counts.businesses, pending: pending.businesses, tone: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" },
    { icon: Briefcase, label: "Jobs", value: counts.jobs, pending: pending.jobs, tone: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10" },
    { icon: ShoppingBag, label: "Listings", value: counts.listings, pending: pending.listings, tone: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10" },
    { icon: Megaphone, label: "Ads", value: counts.ads, pending: pending.ads, tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="text-sm text-slate-400 mt-1">Quick overview of what's live on APNAHUB right now.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 max-w-4xl">
        {cards.map((c) => (
          <Card key={c.label} className="p-6" hover={false}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${c.tone}`}>
              <c.icon size={20} />
            </div>
            <p className="font-display font-bold text-3xl text-slate-900 dark:text-white">{c.value}</p>
            <p className="text-sm text-slate-400 mt-1">{c.label}</p>
            {c.pending > 0 && (
              <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                <Clock size={11} /> {c.pending} pending review
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
