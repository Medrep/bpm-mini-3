"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CandidateListItem } from "@my-bpm-mini/shared";

import { Card } from "@/components/ui/card";

type CandidateTableProps = {
  candidates: CandidateListItem[];
};

export function CandidateTable({ candidates }: CandidateTableProps) {
  const router = useRouter();
  const openCandidate = (candidateId: string) => {
    router.push(`/candidates/${candidateId}`);
  };

  if (candidates.length === 0) {
    return (
      <Card className="px-5 py-8 text-center text-[13px] text-slate-500">
        No candidates match the current search.
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
              <th className="px-4 py-3 font-medium">Stack</th>
              <th className="px-4 py-3 font-medium">Years of Experience</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">English Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                aria-label={`Open candidate ${candidate.full_name}`}
                className="cursor-pointer transition hover:bg-slate-50 focus-within:bg-slate-50"
                onClick={() => openCandidate(candidate.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openCandidate(candidate.id);
                  }
                }}
                tabIndex={0}
              >
                <td className="px-4 py-3">
                  <Link
                    className="font-semibold text-slate-950"
                    href={`/candidates/${candidate.id}`}
                  >
                    {candidate.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {candidate.primary_stack}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {candidate.years_of_experience ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {candidate.location ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {candidate.rate ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {candidate.english_level ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
