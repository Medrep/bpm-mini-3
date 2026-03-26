"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LeadListItem } from "@my-bpm-mini/shared";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

type LeadTableProps = {
  leads: LeadListItem[];
};

export function LeadTable({ leads }: LeadTableProps) {
  const router = useRouter();
  const openLead = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  if (leads.length === 0) {
    return (
      <Card className="px-5 py-8 text-center text-[13px] text-slate-500">
        No leads match the current filters.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-[13px]">
          <thead className="bg-slate-50/80 text-left text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role / Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Hiring Flag</th>
              <th className="px-4 py-3 font-medium">Date Added</th>
              <th className="px-4 py-3 font-medium">Last Interaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                aria-label={`Open lead ${lead.full_name}`}
                className="cursor-pointer transition hover:bg-slate-50 focus-within:bg-slate-50"
                onClick={() => openLead(lead.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLead(lead.id);
                  }
                }}
                tabIndex={0}
              >
                <td className="px-4 py-3">
                  <Link className="font-semibold text-slate-950" href={`/leads/${lead.id}`}>
                    {lead.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="font-medium text-slate-900">
                    {lead.role_title ?? "Role not set"}
                  </div>
                  <div>{lead.company_name}</div>
                </td>
                <td className="px-4 py-3">
                  <LeadStatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {lead.hiring_flag ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span suppressHydrationWarning>
                    {formatDateTime(lead.date_added)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span suppressHydrationWarning>
                    {formatDateTime(lead.last_interaction_date)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
