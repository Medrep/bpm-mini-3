import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import {
  createLeadSchema,
  leadFiltersSchema,
  leadLookupSchema,
  updateLeadSchema,
  type LeadListFilters,
  type LeadWriteInput,
} from "@my-bpm-mini/shared";
import { createServerSupabaseClient } from "../auth/supabase";
import {
  createLeadRecord,
  getLeadById,
  getLeadInteractions,
  getLeadByNormalizedLinkedInUrl,
  getLeadStatusHistory,
  getSameCompanyLeads,
  listLeads,
  updateLeadRecord,
} from "./lead-repository";

function isUniqueConstraintViolation(error: unknown) {
  const candidate = error as PostgrestError | undefined;
  return candidate?.code === "23505";
}

async function resolveSupabaseClient(supabaseClient?: SupabaseClient) {
  return supabaseClient ?? (await createServerSupabaseClient());
}

export async function listLeadsForPage(
  filters: LeadListFilters,
  supabaseClient?: SupabaseClient,
) {
  const parsedFilters = leadFiltersSchema.parse(filters);
  const supabase = await resolveSupabaseClient(supabaseClient);

  return listLeads(supabase, parsedFilters);
}

export async function getLeadDetail(
  leadId: string,
  supabaseClient?: SupabaseClient,
) {
  const parsed = leadLookupSchema.parse({ id: leadId });
  const supabase = await resolveSupabaseClient(supabaseClient);
  const lead = await getLeadById(supabase, parsed.id);

  if (!lead) {
    return null;
  }

  const [sameCompanyLeads, history, interactions] = await Promise.all([
    getSameCompanyLeads(supabase, lead.company_name, lead.id),
    getLeadStatusHistory(supabase, lead.id),
    getLeadInteractions(supabase, lead.id),
  ]);

  return {
    lead,
    sameCompanyLeads,
    history,
    interactions,
  };
}

export async function getLeadRecord(
  leadId: string,
  supabaseClient?: SupabaseClient,
) {
  const parsed = leadLookupSchema.parse({ id: leadId });
  const supabase = await resolveSupabaseClient(supabaseClient);

  return getLeadById(supabase, parsed.id);
}

export async function createLead(
  input: LeadWriteInput,
  supabaseClient?: SupabaseClient,
) {
  const parsed = createLeadSchema.parse(input);
  const supabase = await resolveSupabaseClient(supabaseClient);
  const existingLead = await getLeadByNormalizedLinkedInUrl(
    supabase,
    parsed.linkedin_profile_url,
  );

  if (existingLead) {
    return {
      created: false,
      lead: existingLead,
    };
  }

  try {
    const lead = await createLeadRecord(supabase, parsed);
    return {
      created: true,
      lead,
    };
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      const duplicateLead = await getLeadByNormalizedLinkedInUrl(
        supabase,
        parsed.linkedin_profile_url,
      );

      if (duplicateLead) {
        return {
          created: false,
          lead: duplicateLead,
        };
      }
    }

    throw error;
  }
}

export async function updateLead(
  leadId: string,
  input: LeadWriteInput,
  supabaseClient?: SupabaseClient,
) {
  const parsedLeadId = leadLookupSchema.parse({ id: leadId }).id;
  const parsedInput = updateLeadSchema.parse(input);
  const supabase = await resolveSupabaseClient(supabaseClient);
  const existingLead = await getLeadByNormalizedLinkedInUrl(
    supabase,
    parsedInput.linkedin_profile_url,
  );

  if (existingLead && existingLead.id !== parsedLeadId) {
    throw new Error("Another lead already uses this LinkedIn profile URL.");
  }

  return updateLeadRecord(supabase, parsedLeadId, parsedInput);
}
