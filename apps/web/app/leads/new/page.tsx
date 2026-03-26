import { AppShell } from "@/components/shell/app-shell";
import { LeadForm } from "@/components/leads/lead-form";
import { decodeMessage } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";

import { createLeadAction } from "../actions";

type NewLeadPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewLeadPage({ searchParams }: NewLeadPageProps) {
  await requireAuthenticatedUser();
  const params = await searchParams;
  const errorMessage = decodeMessage(getValue(params.error));

  return (
    <AppShell
      activeSection="leads"
      description="Create a lead manually with the same fields used by the LinkedIn flow."
      title="Add Lead"
    >
      <LeadForm
        action={createLeadAction}
        errorMessage={errorMessage}
        mode="create"
      />
    </AppShell>
  );
}
