import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Btn from "../components/ui/Btn";
import Modal from "../components/ui/Modal";
import Card from "../components/ui/Card";

/**
 * columns: [{ key, label, type? ("text" | "number" | "checkbox"), width? }]
 * `key` maps to the field name on the resource object.
 */
export default function ResourceManager({ title, subtitle, api, columns, emptyItem, idKey = "id" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = creating new
  const [form, setForm] = useState(emptyItem);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.list().then((data) => { setItems(data); setLoading(false); });
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyItem); setModalOpen(true); setError(""); };
  const openEdit = (item) => { setEditing(item); setForm(item); setModalOpen(true); setError(""); };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await api.update(editing[idKey], form);
      else await api.create(form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name || item.title}"?`)) return;
    try {
      await api.remove(item[idKey]);
      load();
    } catch (err) {
      setError(err.message || "Delete failed. Is the backend running?");
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <Btn variant="primary" icon={Plus} onClick={openCreate}>Add new</Btn>
      </div>

      {error && (
        <div className="mb-4 text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <Card hover={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 text-left text-slate-400 text-xs uppercase tracking-wide">
                {columns.map((c) => <th key={c.key} className="px-5 py-3 font-medium">{c.label}</th>)}
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-slate-400">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-slate-400">No records yet.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item[idKey]} className="border-b border-slate-50 dark:border-white/[0.04] last:border-0">
                    {columns.map((c) => (
                      <td key={c.key} className="px-5 py-3 text-slate-700 dark:text-slate-200">
                        {c.type === "checkbox" ? (item[c.key] ? "Yes" : "No") : String(item[c.key] ?? "")}
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-indigo-500"><Pencil size={14} /></button>
                        <button onClick={() => remove(item)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">{editing ? "Edit" : "Add"} {title.replace(/s$/, "")}</h2>
            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={18} /></button>
          </div>
          <form onSubmit={save} className="space-y-3">
            {columns.map((c) => (
              <div key={c.key}>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">{c.label}</label>
                {c.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[c.key])}
                    onChange={(e) => setForm({ ...form, [c.key]: e.target.checked })}
                    className="w-4 h-4"
                  />
                ) : c.type === "list" ? (
                  <input
                    type="text"
                    placeholder="Comma-separated, e.g. Featured badge, Priority support"
                    value={Array.isArray(form[c.key]) ? form[c.key].join(", ") : (form[c.key] ?? "")}
                    onChange={(e) => setForm({ ...form, [c.key]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-indigo-400 text-slate-700 dark:text-slate-200"
                  />
                ) : (
                  <input
                    type={c.type === "number" ? "number" : "text"}
                    value={form[c.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [c.key]: c.type === "number" ? Number(e.target.value) : e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-indigo-400 text-slate-700 dark:text-slate-200"
                  />
                )}
              </div>
            ))}
            {error && <p className="text-xs text-rose-500">{error}</p>}
            <Btn variant="primary" className="w-full mt-2" type="submit">{editing ? "Save changes" : "Create"}</Btn>
          </form>
        </Card>
      </Modal>
    </div>
  );
}
