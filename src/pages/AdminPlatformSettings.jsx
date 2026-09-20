import React, { useEffect, useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import { platformSettingsApi } from "../lib/api";

const FIELD_GROUPS = [
  {
    title: "Advertisements",
    fields: [
      { key: "adsRequireApproval", label: "Require admin approval before an ad goes live", type: "checkbox" },
      { key: "adAutoSlide", label: "Auto-slide the Advertisement Hub carousel", type: "checkbox" },
      { key: "adVideoAutoplay", label: "Autoplay video ads (muted, with a sound toggle)", type: "checkbox" },
      { key: "adSlideDurationSeconds", label: "Photo ad display duration (seconds)", type: "number" },
    ],
  },
  {
    title: "Marketplace Commission",
    fields: [
      { key: "productCommissionType", label: "Product commission type", type: "select", options: ["percent", "fixed"] },
      { key: "productCommissionValue", label: "Product commission value (% or ₹)", type: "number" },
    ],
  },
  {
    title: "Booking Commission",
    fields: [
      { key: "bookingCommissionType", label: "Booking commission type", type: "select", options: ["percent", "fixed"] },
      { key: "bookingCommissionValue", label: "Booking commission value (% or ₹)", type: "number" },
    ],
  },
  {
    title: "Payouts & Media",
    fields: [
      { key: "payoutReleaseRule", label: "Seller payout release rule", type: "select", options: ["on_delivery", "manual", "immediate"] },
      { key: "defaultPhotoLimit", label: "Default photo limit (fallback if a plan doesn't set one)", type: "number" },
      { key: "defaultVideoLimit", label: "Default video limit (fallback if a plan doesn't set one)", type: "number" },
    ],
  },
];

export default function AdminPlatformSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { platformSettingsApi.get().then(setSettings); }, []);

  const update = (key, value) => { setSettings({ ...settings, [key]: value }); setSaved(false); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await platformSettingsApi.update(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="p-8 text-sm text-slate-400">Loading settings…</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <SettingsIcon size={22} className="text-indigo-500" />
        <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Platform Settings</h1>
      </div>
      <p className="text-sm text-slate-400 mb-8">
        Every business rule below starts at zero/off until you set it — nothing is hard-coded into the app.
      </p>

      <form onSubmit={save} className="space-y-6">
        {FIELD_GROUPS.map((group) => (
          <Card key={group.title} className="p-6" hover={false}>
            <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4">{group.title}</h2>
            <div className="space-y-4">
              {group.fields.map((f) => (
                <div key={f.key} className="flex items-center justify-between gap-4">
                  <label className="text-sm text-slate-600 dark:text-slate-300 flex-1">{f.label}</label>
                  {f.type === "checkbox" ? (
                    <input type="checkbox" checked={Boolean(settings[f.key])} onChange={(e) => update(f.key, e.target.checked)} className="w-4 h-4 shrink-0" />
                  ) : f.type === "select" ? (
                    <select value={settings[f.key]} onChange={(e) => update(f.key, e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-indigo-400 text-slate-700 dark:text-slate-200 w-40 shrink-0">
                      {f.options.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={settings[f.key] ?? 0}
                      onChange={(e) => update(f.key, Number(e.target.value))}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-indigo-400 text-slate-700 dark:text-slate-200 w-28 shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {error && <p className="text-sm text-rose-500">{error}</p>}
        <div className="flex items-center gap-3">
          <Btn variant="primary" icon={Save} type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</Btn>
          {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">Saved</span>}
        </div>
      </form>
    </div>
  );
}
