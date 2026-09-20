import React from "react";
import { ArrowRight } from "lucide-react";

export default function Btn({ children, variant = "primary", size = "md", className = "", icon: Icon, iconRight, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5",
    marigold:
      "bg-[#F5A623] text-[#241503] shadow-lg shadow-amber-500/25 hover:bg-[#ffb733] hover:-translate-y-0.5",
    ghost:
      "bg-white/5 backdrop-blur border border-black/10 dark:border-white/10 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10",
    outline:
      "border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white",
    link: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 !px-0 !py-0 rounded-none",
    danger: "bg-rose-600 text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={17} strokeWidth={2.2} />}
      {children}
      {iconRight && <ArrowRight size={16} strokeWidth={2.2} />}
    </button>
  );
}
