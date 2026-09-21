import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { notificationsApi } from "../lib/api";
import { playHeavyNotificationSound } from "../lib/sound";

const POLL_MS = 15000;

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const prevUnreadRef = useRef(null);

  const poll = async () => {
    try {
      const list = await notificationsApi.mine();
      const unread = list.filter((n) => !n.read).length;
      if (prevUnreadRef.current !== null && unread > prevUnreadRef.current) {
        playHeavyNotificationSound();
      }
      prevUnreadRef.current = unread;
      setNotifications(list);
    } catch {
      // ignore transient failures — next poll will retry
    }
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openNotification = async (n) => {
    setOpen(false);
    if (!n.read) {
      try { await notificationsApi.markRead(n._id); } catch { /* ignore */ }
    }
    navigate(n.link || "/dashboard");
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      prevUnreadRef.current = 0;
    } catch { /* ignore */ }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#131B2E] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 px-4 py-8 text-center">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => openNotification(n)}
                  className="w-full text-left px-4 py-3 border-b border-slate-50 dark:border-white/[0.04] last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 flex gap-2.5"
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-indigo-500"}`} />
                  <div className="min-w-0">
                    <p className={`text-sm ${n.read ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-white font-medium"}`}>{n.title}</p>
                    {n.message && <p className="text-xs text-slate-400 mt-0.5 truncate">{n.message}</p>}
                    <p className="text-[11px] text-slate-300 dark:text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
