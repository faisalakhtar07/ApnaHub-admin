import React, { useEffect, useState } from "react";
import { Briefcase, Check, X as XIcon, Ban, Trash2, MapPin } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";
import Modal from "../components/ui/Modal";
import { jobsAdminApi } from "../lib/api";

const STATUS_TONE = { pending: "soon", approved: "open", rejected: "closed", suspended: "closed", closed: "neutral" };
const FILTERS = ["all", "pending", "approved", "rejected", "suspended", "closed"];

export default function AdminJobModeration() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => {
    setLoading(true);
    jobsAdminApi.all().then(setItems).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id, status, reason = "") => {
    try {
      await jobsAdminApi.setStatus(id, status, reason);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmReject = async () => {
    await setStatus(rejectTarget._id, "rejected", rejectReason);
    setRejectTarget(null);
    setRejectReason("");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this job post permanently?")) return;
    try {
      await jobsAdminApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const visible = filter === "all" ? items : items.filter((j) => j.status === filter);

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Job Listings</h1>
      <p className="text-sm text-slate-400 mt-1">Review jobs submitted by employers, or manage ones you've added yourself.</p>

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
        <p className="text-sm text-slate-400">No jobs in this filter.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((j) => (
            <Card key={j._id} className="p-4" hover={false}>
              <div className="flex items-center gap-4">
                {j.companyLogo ? (
                  <img src={j.companyLogo} className="w-16 h-16 rounded-xl object-cover shrink-0" alt={j.title} />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 shrink-0"><Briefcase size={18} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white truncate">{j.title}</p>
                  <p className="text-xs text-slate-400">{j.companyName} · {j.owner?.name || "Unknown"} ({j.owner?.phone}) · {new Date(j.createdAt).toLocaleDateString()}</p>
                  {j.city && <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><MapPin size={11} /> {j.city}</p>}
                </div>
                <Badge tone={STATUS_TONE[j.status] || "neutral"}>{j.status}</Badge>
                <div className="flex gap-1.5 shrink-0">
                  {j.status === "pending" && (
                    <>
                      <Btn variant="primary" size="sm" icon={Check} onClick={() => setStatus(j._id, "approved")}>Approve</Btn>
                      <Btn variant="danger" size="sm" icon={XIcon} onClick={() => setRejectTarget(j)}>Reject</Btn>
                    </>
                  )}
                  {j.status === "approved" && (
                    <Btn variant="outline" size="sm" icon={Ban} onClick={() => setStatus(j._id, "suspended")}>Suspend</Btn>
                  )}
                  {j.status === "suspended" && (
                    <Btn variant="primary" size="sm" icon={Check} onClick={() => setStatus(j._id, "approved")}>Reinstate</Btn>
                  )}
                  <button onClick={() => remove(j._id)} className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500"><Trash2 size={14} /></button>
                </div>
              </div>
              {j.status === "rejected" && j.rejectionReason && (
                <p className="text-xs text-rose-500 mt-3 pl-20">Rejection reason: {j.rejectionReason}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={Boolean(rejectTarget)} onClose={() => setRejectTarget(null)}>
        <Card className="p-6" hover={false}>
          <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-1">Reject "{rejectTarget?.title}"</h2>
          <p className="text-xs text-slate-400 mb-4">This reason is shown to the employer in their dashboard.</p>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Salary information is missing"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-rose-400 text-slate-700 dark:text-slate-200 resize-none mb-4"
          />
          <Btn variant="danger" className="w-full" onClick={confirmReject}>Confirm rejection</Btn>
        </Card>
      </Modal>
    </div>
  );
}
