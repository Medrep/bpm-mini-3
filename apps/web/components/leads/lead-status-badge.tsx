import type { LeadStatus } from "@my-bpm-mini/shared";

import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<LeadStatus, string> = {
  Radar: "bg-slate-100 text-slate-700",
  "Connection Sent": "bg-sky-100 text-sky-700",
  Connected: "bg-cyan-100 text-cyan-700",
  "Message Sent": "bg-indigo-100 text-indigo-700",
  Conversation: "bg-amber-100 text-amber-800",
  Interested: "bg-emerald-100 text-emerald-800",
  "Future Contact": "bg-violet-100 text-violet-700",
  Ignored: "bg-slate-200 text-slate-700",
  Rejected: "bg-rose-100 text-rose-700",
  "Not Interested": "bg-orange-100 text-orange-700",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
