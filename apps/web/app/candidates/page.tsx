import { candidateFiltersSchema } from "@my-bpm-mini/shared";

import { CandidateFilters } from "@/components/candidates/candidate-filters";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { AppShell } from "@/components/shell/app-shell";
import { decodeMessage } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";
import { listCandidatesForPage } from "@/server/candidates/candidate-service";

type CandidatesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CandidatesPage({
  searchParams,
}: CandidatesPageProps) {
  await requireAuthenticatedUser();
  const params = await searchParams;
  const filters = candidateFiltersSchema.parse({
    q: getValue(params.q),
  });
  const candidates = await listCandidatesForPage(filters);
  const successMessage = decodeMessage(getValue(params.success));

  return (
    <AppShell
      activeSection="candidates"
      ctaHref="/candidates/new"
      ctaLabel="Add Candidate"
      description="Track ATS and talent-pool candidates with a lightweight searchable list."
      title="ATS / Talent Pool"
    >
      <div className="space-y-4">
        {successMessage ? (
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {successMessage}
          </div>
        ) : null}
        <CandidateFilters filters={filters} />
        <CandidateTable candidates={candidates} />
      </div>
    </AppShell>
  );
}
