import React from "react";

export default function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-100 dark:border-white/[0.06] shadow-[0_2px_20px_-4px_rgba(15,23,42,0.06)] dark:shadow-none ${
        hover ? "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.18)] dark:hover:border-indigo-500/30" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
