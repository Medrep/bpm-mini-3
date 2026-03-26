import { CandidateForm } from "@/components/candidates/candidate-form";
import { AppShell } from "@/components/shell/app-shell";
import { decodeMessage } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";

import { createCandidateAction } from "../actions";

type NewCandidatePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewCandidatePage({
  searchParams,
}: NewCandidatePageProps) {
  await requireAuthenticatedUser();
  const params = await searchParams;
  const errorMessage = decodeMessage(getValue(params.error));

  return (
    <AppShell
      activeSection="candidates"
      description="Add a candidate record without introducing stages or pipeline complexity."
      title="Add Candidate"
    >
      <CandidateForm
        action={createCandidateAction}
        errorMessage={errorMessage}
        mode="create"
      />
    </AppShell>
  );
}

