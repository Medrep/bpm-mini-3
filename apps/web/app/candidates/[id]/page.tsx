import Link from "next/link";
import { notFound } from "next/navigation";

import { CandidateForm } from "@/components/candidates/candidate-form";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { decodeMessage, formatDateTime } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";
import { getCandidateDetail } from "@/server/candidates/candidate-service";

import { updateCandidateAction } from "../actions";

type CandidateDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CandidateDetailPage({
  params,
  searchParams,
}: CandidateDetailPageProps) {
  await requireAuthenticatedUser();
  const [{ id }, rawSearchParams] = await Promise.all([params, searchParams]);
  const candidate = await getCandidateDetail(id);

  if (!candidate) {
    notFound();
  }

  const errorMessage = decodeMessage(getValue(rawSearchParams.error));
  const successMessage = decodeMessage(getValue(rawSearchParams.success));
  const updateAction = updateCandidateAction.bind(null, candidate.id);

  return (
    <AppShell
      activeSection="candidates"
      description={`${candidate.primary_stack} • ${candidate.location ?? "Location not set"}`}
      title={candidate.full_name}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Candidate Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Primary stack</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {candidate.primary_stack}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {candidate.location ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Years of experience</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {candidate.years_of_experience ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">English level</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {candidate.english_level ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Rate</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {candidate.rate ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {formatDateTime(candidate.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Updated</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-900">
                {formatDateTime(candidate.updated_at)}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-slate-500">LinkedIn profile</p>
              {candidate.linkedin_url ? (
                <Link
                  className="mt-1 inline-flex text-sm font-medium text-teal-700 underline decoration-teal-300 underline-offset-4"
                  href={candidate.linkedin_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open profile
                </Link>
              ) : (
                  <p className="mt-0.5 text-[13px] text-slate-500">No LinkedIn URL saved.</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-slate-500">Notes</p>
              <p className="mt-0.5 whitespace-pre-wrap text-[13px] font-medium text-slate-900">
                {candidate.notes ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Original CV file</p>
              <p className="mt-0.5 break-all text-[13px] font-medium text-slate-900">
                {candidate.original_cv_file_path ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Formatted CV file</p>
              <p className="mt-0.5 break-all text-[13px] font-medium text-slate-900">
                {candidate.formatted_cv_file_path ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <CandidateForm
          action={updateAction}
          candidate={candidate}
          errorMessage={errorMessage}
          mode="edit"
        />
      </div>
    </AppShell>
  );
}
