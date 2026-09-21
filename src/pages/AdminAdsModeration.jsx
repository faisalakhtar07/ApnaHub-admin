import React, { useEffect, useState } from "react";
import { Star, Check, X as XIcon, Ban, Eye, ImagePlus, Upload } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";
import Modal from "../components/ui/Modal";
import { adsApi } from "../lib/api";

const STATUS_TONE = { pending: "soon", approved: "open", active: "open", rejected: "closed", suspended: "closed", expired: "neutral", draft: "neutral" };
const FILTERS = ["all", "pending", "needs media", "approved", "rejected", "suspended", "expired"];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminAdsModeration() {
  const [ads, setAds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mediaModalAd, setMediaModalAd] = useState(null);
  const [mediaImages, setMediaImages] = useState([]);
  const [savingMedia, setSavingMedia] = useState(false);

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

  const openMediaModal = (ad) => { setMediaModalAd(ad); setMediaImages(ad.images || []); };
  const closeMediaModal = () => { setMediaModalAd(null); setMediaImages([]); };

  const addMediaFiles = async (fileList) => {
    const files = Array.from(fileList).slice(0, 6 - mediaImages.length);
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setMediaImages((prev) => [...prev, ...dataUrls].slice(0, 6));
  };

  const saveMedia = async () => {
    setSavingMedia(true);
    try {
      await adsApi.setMedia(mediaModalAd._id, { images: mediaImages });
      closeMediaModal();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingMedia(false);
    }
  };

  const visible =
    filter === "all" ? ads :
    filter === "needs media" ? ads.filter((a) => a.needsMediaDesign) :
    ads.filter((a) => a.status === filter);

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
                  {ad.needsMediaDesign && <Badge tone="soon">Needs Media</Badge>}
                </div>
                <p className="text-xs text-slate-400">{ad.category} · {ad.owner?.name || "Unknown"} ({ad.owner?.phone}) · {new Date(ad.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge tone={STATUS_TONE[ad.status] || "neutral"}>{ad.status}</Badge>
              <div className="flex gap-1.5 shrink-0">
                {ad.needsMediaDesign && (
                  <Btn variant="marigold" size="sm" icon={ImagePlus} onClick={() => openMediaModal(ad)}>Add media</Btn>
                )}
                {ad.status === "pending" && !ad.needsMediaDesign && (
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

      <Modal open={Boolean(mediaModalAd)} onClose={closeMediaModal}>
        <Card className="p-6" hover={false}>
          <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-1">Design media for "{mediaModalAd?.title}"</h2>
          <p className="text-xs text-slate-400 mb-4">Upload the banner/photo you've created for this advertiser. This clears their "needs media" flag so you can approve the ad next.</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {mediaImages.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                <img src={src} className="w-full h-full object-cover" alt={`Design ${i + 1}`} />
              </div>
            ))}
            {mediaImages.length < 6 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer">
                <Upload size={18} />
                <span className="text-[11px] font-medium">Upload</span>
                <input type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addMediaFiles(e.target.files)} />
              </label>
            )}
          </div>
          <Btn variant="primary" className="w-full" onClick={saveMedia} disabled={savingMedia || mediaImages.length === 0}>
            {savingMedia ? "Saving…" : "Save media & clear flag"}
          </Btn>
        </Card>
      </Modal>
    </div>
  );
}
