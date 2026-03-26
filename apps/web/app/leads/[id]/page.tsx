import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadInteractionsBlock } from "@/components/leads/lead-interactions-block";
import { LeadHistoryBlock } from "@/components/leads/lead-history-block";
import { LeadPlanningForm } from "@/components/leads/lead-planning-form";
import { LeadProfileForm } from "@/components/leads/lead-profile-form";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { LeadStatusSelect } from "@/components/leads/lead-status-select";
import { SameCompanyBlock } from "@/components/leads/same-company-block";
import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decodeMessage, formatDateTime } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";
import { getLeadDetail } from "@/server/leads/lead-service";

import {
  addLeadInteractionAction,
  updateLeadPlanAction,
  updateLeadProfileAction,
  updateLeadStatusAction,
} from "../actions";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  await requireAuthenticatedUser();
  const [{ id }, rawSearchParams] = await Promise.all([params, searchParams]);
  const detail = await getLeadDetail(id);

  if (!detail) {
    notFound();
  }

  const errorMessage = decodeMessage(getValue(rawSearchParams.error));
  const successMessage = decodeMessage(getValue(rawSearchParams.success));
  const profileAction = updateLeadProfileAction.bind(null, detail.lead.id);
  const planAction = updateLeadPlanAction.bind(null, detail.lead.id);
  const statusAction = updateLeadStatusAction.bind(null, detail.lead.id);
  const addInteractionAction = addLeadInteractionAction.bind(null, detail.lead.id);

  return (
    <AppShell
      activeSection="leads"
      description={`${detail.lead.company_name} • ${detail.lead.role_title ?? "Role not set"}`}
      title={detail.lead.full_name}
    >
      <div className="space-y-4">
        {successMessage ? (
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {successMessage}
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_320px]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lead Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Date added</p>
                  <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                    {formatDateTime(detail.lead.date_added)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last interaction</p>
                  <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                    {formatDateTime(detail.lead.last_interaction_date)}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">LinkedIn profile</p>
                  {detail.lead.linkedin_profile_url ? (
                    <Link
                      className="mt-1 inline-flex text-sm font-medium text-teal-700 underline decoration-teal-300 underline-offset-4"
                      href={detail.lead.linkedin_profile_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open profile
                    </Link>
                  ) : (
                    <p className="mt-0.5 text-[13px] text-slate-500">No LinkedIn URL saved.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <LeadProfileForm action={profileAction} lead={detail.lead} />

            <LeadInteractionsBlock
              action={addInteractionAction}
              interactions={detail.interactions}
            />

            <LeadPlanningForm action={planAction} lead={detail.lead} />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <LeadStatusBadge status={detail.lead.status} />
                <form action={statusAction} className="space-y-2.5">
                  <LeadStatusSelect defaultValue={detail.lead.status} name="new_status" />
                  <Button type="submit">Save Status</Button>
                </form>
              </CardContent>
            </Card>

            <SameCompanyBlock leads={detail.sameCompanyLeads} />
            <LeadHistoryBlock history={detail.history} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
