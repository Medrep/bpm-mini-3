import Link from "next/link";
import type { LeadListFilters } from "@my-bpm-mini/shared";

import { getButtonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LeadViewSwitcherProps = {
  currentView: "table" | "kanban";
  filters: LeadListFilters;
};

function buildViewHref(
  view: LeadViewSwitcherProps["currentView"],
  filters: LeadListFilters,
) {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.hiring !== "all") {
    params.set("hiring", filters.hiring);
  }

  if (filters.sort !== "last_interaction_desc") {
    params.set("sort", filters.sort);
  }

  if (view === "kanban") {
    params.set("view", "kanban");
  }

  const query = params.toString();
  return query ? `/leads?${query}` : "/leads";
}

export function LeadViewSwitcher({
  currentView,
  filters,
}: LeadViewSwitcherProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white/90 px-4 py-3.5 shadow-lg shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] font-medium text-slate-900">View</p>
        <p className="text-[13px] leading-5 text-slate-500">
          Switch between table and pipeline board using the current filters.
        </p>
      </div>

      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
        <Link
          aria-current={currentView === "table" ? "page" : undefined}
          className={cn(
            getButtonClasses(currentView === "table" ? "default" : "ghost"),
            "min-w-[96px] rounded-lg px-3 py-1.5",
          )}
          href={buildViewHref("table", filters)}
        >
          Table
        </Link>
        <Link
          aria-current={currentView === "kanban" ? "page" : undefined}
          className={cn(
            getButtonClasses(currentView === "kanban" ? "default" : "ghost"),
            "min-w-[96px] rounded-lg px-3 py-1.5",
          )}
          href={buildViewHref("kanban", filters)}
        >
          Kanban
        </Link>
      </div>
    </div>
  );
}
