import React from "react";

export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
    open: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    closed: "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400",
    soon: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    verified: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
