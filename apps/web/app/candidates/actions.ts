"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";

import { encodeMessage } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";
import {
  createCandidate,
  updateCandidate,
} from "@/server/candidates/candidate-service";

function getCandidateInputFromFormData(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? ""),
    primary_stack: String(formData.get("primary_stack") ?? ""),
    linkedin_url: String(formData.get("linkedin_url") ?? ""),
    location: String(formData.get("location") ?? ""),
    years_of_experience: String(formData.get("years_of_experience") ?? ""),
    english_level: String(formData.get("english_level") ?? ""),
    rate: String(formData.get("rate") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    original_cv_file_path: String(formData.get("original_cv_file_path") ?? ""),
    formatted_cv_file_path: String(formData.get("formatted_cv_file_path") ?? ""),
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error.";
}

export async function createCandidateAction(formData: FormData) {
  await requireAuthenticatedUser();

  try {
    const candidate = await createCandidate(getCandidateInputFromFormData(formData));

    revalidatePath("/candidates");
    redirect(
      `/candidates/${candidate.id}?success=${encodeMessage("Candidate created.")}`,
    );
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/candidates/new?error=${encodeMessage(getErrorMessage(error))}`);
  }
}

export async function updateCandidateAction(
  candidateId: string,
  formData: FormData,
) {
  await requireAuthenticatedUser();

  try {
    await updateCandidate(candidateId, getCandidateInputFromFormData(formData));
    revalidatePath("/candidates");
    revalidatePath(`/candidates/${candidateId}`);
    redirect(
      `/candidates/${candidateId}?success=${encodeMessage("Candidate updated.")}`,
    );
  } catch (error) {
    unstable_rethrow(error);
    redirect(
      `/candidates/${candidateId}?error=${encodeMessage(getErrorMessage(error))}`,
    );
  }
}
