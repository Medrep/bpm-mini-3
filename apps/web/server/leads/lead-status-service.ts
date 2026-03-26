import type { SupabaseClient } from "@supabase/supabase-js";
import {
  leadLookupSchema,
  leadStatusUpdateSchema,
  type LeadStatusUpdate,
} from "@my-bpm-mini/shared";

import { createServerSupabaseClient } from "../auth/supabase";
import { getLeadById, updateLeadStatusRecord } from "./lead-repository";

async function resolveSupabaseClient(supabaseClient?: SupabaseClient) {
  return supabaseClient ?? (await createServerSupabaseClient());
}

export async function updateLeadStatus(
  leadId: string,
  input: LeadStatusUpdate,
  supabaseClient?: SupabaseClient,
) {
  const parsedLeadId = leadLookupSchema.parse({ id: leadId }).id;
  const parsedInput = leadStatusUpdateSchema.parse(input);
  const supabase = await resolveSupabaseClient(supabaseClient);
  const existingLead = await getLeadById(supabase, parsedLeadId);

  if (!existingLead) {
    throw new Error("Lead not found.");
  }

  if (existingLead.status === parsedInput.new_status) {
    return existingLead;
  }

  return updateLeadStatusRecord(supabase, parsedLeadId, parsedInput);
}
