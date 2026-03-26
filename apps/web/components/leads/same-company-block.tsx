import Link from "next/link";
import type { LeadListItem } from "@my-bpm-mini/shared";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SameCompanyBlock({ leads }: { leads: LeadListItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Same Company</CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="text-[13px] text-slate-500">
            No other leads share this company name.
          </p>
        ) : (
          <div className="space-y-2.5">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 transition hover:border-teal-200 hover:bg-teal-50/70"
                href={`/leads/${lead.id}`}
              >
                <div>
                  <p className="text-[13px] font-medium text-slate-900">
                    {lead.full_name}
                  </p>
                  <p className="text-[13px] text-slate-500">
                    {lead.role_title ?? "Role not set"}
                  </p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
