"use server";

import type { LeadStatus } from "@my-bpm-mini/shared";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { ZodError } from "zod";

import { encodeMessage } from "@/lib/utils";
import { requireAuthenticatedUser } from "@/server/auth/guards";
import { createLead, getLeadRecord, updateLead } from "@/server/leads/lead-service";
import { createLeadInteraction } from "@/server/leads/lead-interaction-service";
import { updateLeadStatus } from "@/server/leads/lead-status-service";

function getLeadInputFromFormData(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? ""),
    company_name: String(formData.get("company_name") ?? ""),
    role_title: String(formData.get("role_title") ?? ""),
    location: String(formData.get("location") ?? ""),
    linkedin_profile_url: String(formData.get("linkedin_profile_url") ?? ""),
    hiring_flag: formData.get("hiring_flag") === "on",
    notes: String(formData.get("notes") ?? ""),
    next_action: String(formData.get("next_action") ?? ""),
    follow_up_date: String(formData.get("follow_up_date") ?? ""),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Invalid input.";
  }

  return error instanceof Error ? error.message : "Unexpected error.";
}

async function requireLeadForUpdate(leadId: string) {
  const lead = await getLeadRecord(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  return lead;
}

export async function createLeadAction(formData: FormData) {
  await requireAuthenticatedUser();

  try {
    const result = await createLead(getLeadInputFromFormData(formData));

    revalidatePath("/leads");

    if (result.created) {
      redirect(`/leads/${result.lead.id}?success=${encodeMessage("Lead created.")}`);
    }

    redirect(
      `/leads/${result.lead.id}?success=${encodeMessage(
        "Lead already existed. Opened the current record.",
      )}`,
    );
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/leads/new?error=${encodeMessage(getErrorMessage(error))}`);
  }
}

export async function updateLeadAction(leadId: string, formData: FormData) {
  await requireAuthenticatedUser();

  try {
    await updateLead(leadId, getLeadInputFromFormData(formData));
    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    redirect(`/leads/${leadId}?success=${encodeMessage("Lead updated.")}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/leads/${leadId}?error=${encodeMessage(getErrorMessage(error))}`);
  }
}

export async function updateLeadProfileAction(
  leadId: string,
  formData: FormData,
) {
  await requireAuthenticatedUser();

  try {
    const existingLead = await requireLeadForUpdate(leadId);

    await updateLead(leadId, {
      full_name: String(formData.get("full_name") ?? ""),
      company_name: String(formData.get("company_name") ?? ""),
      role_title: String(formData.get("role_title") ?? ""),
      location: String(formData.get("location") ?? ""),
      linkedin_profile_url: String(formData.get("linkedin_profile_url") ?? ""),
      hiring_flag: formData.get("hiring_flag") === "on",
      notes: String(formData.get("notes") ?? ""),
      next_action: existingLead.next_action ?? "",
      follow_up_date: existingLead.follow_up_date ?? "",
    });
    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    redirect(`/leads/${leadId}?success=${encodeMessage("Lead updated.")}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/leads/${leadId}?error=${encodeMessage(getErrorMessage(error))}`);
  }
}

export async function updateLeadStatusAction(leadId: string, formData: FormData) {
  await requireAuthenticatedUser();

  try {
    await updateLeadStatus(leadId, {
      new_status: String(formData.get("new_status") ?? "") as LeadStatus,
      changed_via: "app",
    });
    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    redirect(`/leads/${leadId}?success=${encodeMessage("Status updated.")}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/leads/${leadId}?error=${encodeMessage(getErrorMessage(error))}`);
  }
}

export async function addLeadInteractionAction(
  leadId: string,
  formData: FormData,
) {
  await requireAuthenticatedUser();

  try {
    await createLeadInteraction(leadId, {
      body: String(formData.get("body") ?? ""),
    });
    revalidatePath(`/leads/${leadId}`);
    redirect(`/leads/${leadId}?success=${encodeMessage("Interaction added.")}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/leads/${leadId}?error=${encodeMessage(getErrorMessage(error))}`);
  }
}

export async function updateLeadPlanAction(leadId: string, formData: FormData) {
  await requireAuthenticatedUser();

  try {
    const existingLead = await requireLeadForUpdate(leadId);

    await updateLead(leadId, {
      full_name: existingLead.full_name,
      company_name: existingLead.company_name,
      role_title: existingLead.role_title ?? "",
      location: existingLead.location ?? "",
      linkedin_profile_url: existingLead.linkedin_profile_url ?? "",
      hiring_flag: existingLead.hiring_flag,
      notes: existingLead.notes ?? "",
      next_action: String(formData.get("next_action") ?? ""),
      follow_up_date: String(formData.get("follow_up_date") ?? ""),
    });
    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    redirect(`/leads/${leadId}?success=${encodeMessage("Next action updated.")}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/leads/${leadId}?error=${encodeMessage(getErrorMessage(error))}`);
  }
}
