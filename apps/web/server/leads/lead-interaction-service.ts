import type { SupabaseClient } from "@supabase/supabase-js";
import {
  leadInteractionCreateSchema,
  leadLookupSchema,
  type LeadInteractionCreateInput,
} from "@my-bpm-mini/shared";

import { createServerSupabaseClient } from "../auth/supabase";
import {
  createLeadInteractionRecord,
  getLeadById,
  getLeadInteractions,
} from "./lead-repository";

async function resolveSupabaseClient(supabaseClient?: SupabaseClient) {
  return supabaseClient ?? (await createServerSupabaseClient());
}

export async function listLeadInteractionsForLead(
  leadId: string,
  supabaseClient?: SupabaseClient,
) {
  const parsedLeadId = leadLookupSchema.parse({ id: leadId }).id;
  const supabase = await resolveSupabaseClient(supabaseClient);
  const existingLead = await getLeadById(supabase, parsedLeadId);

  if (!existingLead) {
    throw new Error("Lead not found.");
  }

  return getLeadInteractions(supabase, parsedLeadId);
}

export async function createLeadInteraction(
  leadId: string,
  input: LeadInteractionCreateInput,
  supabaseClient?: SupabaseClient,
) {
  const parsedLeadId = leadLookupSchema.parse({ id: leadId }).id;
  const parsedInput = leadInteractionCreateSchema.parse(input);
  const supabase = await resolveSupabaseClient(supabaseClient);
  const existingLead = await getLeadById(supabase, parsedLeadId);

  if (!existingLead) {
    throw new Error("Lead not found.");
  }

  return createLeadInteractionRecord(supabase, parsedLeadId, parsedInput);
}
