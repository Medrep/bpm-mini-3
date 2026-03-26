import { leadFiltersSchema } from "@my-bpm-mini/shared";

import { AppShell } from "@/components/shell/app-shell";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadKanban } from "@/components/leads/lead-kanban";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadViewSwitcher } from "@/components/leads/lead-view-switcher";
import { decodeMessage } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";
import { listLeadsForPage } from "@/server/leads/lead-service";

type LeadsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getLeadView(value: string | string[] | undefined) {
  return getValue(value) === "kanban" ? "kanban" : "table";
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  await requireAuthenticatedUser();
  const params = await searchParams;
  const currentView = getLeadView(params.view);
  const filters = leadFiltersSchema.parse({
    q: getValue(params.q),
    status: getValue(params.status),
    hiring: getValue(params.hiring),
    sort: getValue(params.sort),
  });
  const leads = await listLeadsForPage(filters);
  const successMessage = decodeMessage(getValue(params.success));

  return (
    <AppShell
      activeSection="leads"
      ctaHref="/leads/new"
      ctaLabel="Add Lead"
      description="Search and review lead activity across your current pipeline."
      title="Lead Generation"
    >
      <div className="space-y-4">
        {successMessage ? (
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {successMessage}
          </div>
        ) : null}
        <LeadFilters currentView={currentView} filters={filters} />
        <LeadViewSwitcher currentView={currentView} filters={filters} />
        {currentView === "kanban" ? (
          <LeadKanban leads={leads} />
        ) : (
          <LeadTable leads={leads} />
        )}
      </div>
    </AppShell>
  );
}
