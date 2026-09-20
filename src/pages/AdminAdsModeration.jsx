import React, { useEffect, useState } from "react";
import { Star, Check, X as XIcon, Ban, Eye } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";
import { adsApi } from "../lib/api";

const STATUS_TONE = { pending: "soon", approved: "open", active: "open", rejected: "closed", suspended: "closed", expired: "neutral", draft: "neutral" };
const FILTERS = ["all", "pending", "approved", "rejected", "suspended", "expired"];

export default function AdminAdsModeration() {
  const [ads, setAds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adsApi.all().then(setAds).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id, status) => {
    try {
      await adsApi.setStatus(id, status);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFeature = async (id) => {
    try {
      await adsApi.toggleFeature(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const visible = filter === "all" ? ads : ads.filter((a) => a.status === filter);

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Advertisement Moderation</h1>
      <p className="text-sm text-slate-400 mt-1">Approve, reject, suspend, or pin advertisements posted through the subscription system.</p>

      <div className="flex items-center gap-2 mt-6 mb-4 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-colors ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-4 py-2.5 rounded-xl">{error}</div>}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-400">No advertisements in this filter.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((ad) => (
            <Card key={ad._id} className="p-4 flex items-center gap-4" hover={false}>
              {ad.images?.[0] ? (
                <img src={ad.images[0]} className="w-16 h-16 rounded-xl object-cover shrink-0" alt={ad.title} />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 shrink-0"><Eye size={18} /></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800 dark:text-white truncate">{ad.title}</p>
                  {ad.featured && <Star size={13} className="text-amber-500 fill-current shrink-0" />}
                </div>
                <p className="text-xs text-slate-400">{ad.category} · {ad.owner?.name || "Unknown"} ({ad.owner?.phone}) · {new Date(ad.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge tone={STATUS_TONE[ad.status] || "neutral"}>{ad.status}</Badge>
              <div className="flex gap-1.5 shrink-0">
                {ad.status === "pending" && (
                  <>
                    <Btn variant="primary" size="sm" icon={Check} onClick={() => setStatus(ad._id, "approved")}>Approve</Btn>
                    <Btn variant="danger" size="sm" icon={XIcon} onClick={() => setStatus(ad._id, "rejected")}>Reject</Btn>
                  </>
                )}
                {(ad.status === "approved" || ad.status === "active") && (
                  <Btn variant="outline" size="sm" icon={Ban} onClick={() => setStatus(ad._id, "suspended")}>Suspend</Btn>
                )}
                {ad.status === "suspended" && (
                  <Btn variant="primary" size="sm" icon={Check} onClick={() => setStatus(ad._id, "approved")}>Reinstate</Btn>
                )}
                <button onClick={() => toggleFeature(ad._id)} className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${ad.featured ? "bg-amber-500 border-amber-500 text-white" : "border-slate-200 dark:border-white/15 text-slate-400 hover:text-amber-500"}`}>
                  <Star size={14} className={ad.featured ? "fill-current" : ""} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
