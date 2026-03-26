import Link from "next/link";
import {
  LEAD_STATUSES,
  type LeadListItem,
  type LeadStatus,
} from "@my-bpm-mini/shared";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/utils";

type LeadKanbanProps = {
  leads: LeadListItem[];
};

function compareLeads(left: LeadListItem, right: LeadListItem) {
  const leftInteraction = Date.parse(left.last_interaction_date ?? "");
  const rightInteraction = Date.parse(right.last_interaction_date ?? "");

  if (leftInteraction !== rightInteraction) {
    return rightInteraction - leftInteraction;
  }

  const leftAdded = Date.parse(left.date_added ?? "");
  const rightAdded = Date.parse(right.date_added ?? "");

  if (leftAdded !== rightAdded) {
    return rightAdded - leftAdded;
  }

  return left.full_name.localeCompare(right.full_name);
}

function groupLeadsByStatus(leads: LeadListItem[]) {
  const grouped = Object.fromEntries(
    LEAD_STATUSES.map((status) => [status, [] as LeadListItem[]]),
  ) as Record<LeadStatus, LeadListItem[]>;

  for (const lead of leads) {
    grouped[lead.status].push(lead);
  }

  for (const status of LEAD_STATUSES) {
    grouped[status].sort(compareLeads);
  }

  return grouped;
}

export function LeadKanban({ leads }: LeadKanbanProps) {
  if (leads.length === 0) {
    return (
      <Card className="px-5 py-8 text-center text-[13px] text-slate-500">
        No leads match the current filters.
      </Card>
    );
  }

  const groupedLeads = groupLeadsByStatus(leads);

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-4">
        {LEAD_STATUSES.map((status) => {
          const statusLeads = groupedLeads[status];

          return (
            <Card key={status} className="w-[272px] shrink-0 bg-white/92">
              <CardHeader className="border-b border-slate-200/80 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-[15px]">{status}</CardTitle>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {statusLeads.length}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-4">
                {statusLeads.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-5 text-center text-[13px] text-slate-500">
                    No leads in this status.
                  </div>
                ) : (
                  statusLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      className="block rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-teal-200 hover:bg-teal-50/60"
                      href={`/leads/${lead.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {lead.full_name}
                          </p>
                          <p className="mt-0.5 text-[13px] text-slate-600">
                            {lead.company_name}
                          </p>
                        </div>
                        {lead.hiring_flag ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
                            Hiring
                          </span>
                        ) : null}
                      </div>

                      {lead.role_title ? (
                        <p className="mt-2.5 text-[13px] font-medium text-slate-700">
                          {lead.role_title}
                        </p>
                      ) : null}

                      <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-slate-500">
                        <p className="break-words">
                          <span className="font-medium text-slate-700">
                            Last interaction:
                          </span>{" "}
                          {formatDateTime(lead.last_interaction_date)}
                        </p>
                        {lead.follow_up_date ? (
                          <p className="break-words">
                            <span className="font-medium text-slate-700">
                              Follow-up:
                            </span>{" "}
                            {formatDate(lead.follow_up_date)}
                          </p>
                        ) : null}
                        {lead.next_action ? (
                          <p className="break-words">
                            <span className="font-medium text-slate-700">
                              Next action:
                            </span>{" "}
                            {lead.next_action}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
