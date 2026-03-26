import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  LeadInteractionCreateInput,
  LeadInteractionRecord,
  LeadListFilters,
  LeadListItem,
  LeadRecord,
  LeadStatusHistoryRecord,
  LeadStatusUpdate,
  LeadWriteInput,
} from "@my-bpm-mini/shared";
import { normalizeLinkedInProfileUrl } from "@my-bpm-mini/shared";

type LeadQueryClient = SupabaseClient;
type LeadQueryBuilder = any;

function applyLeadSort(
  query: LeadQueryBuilder,
  sort: LeadListFilters["sort"],
) {
  switch (sort) {
    case "date_added_asc":
      return query.order("date_added", { ascending: true });
    case "date_added_desc":
      return query.order("date_added", { ascending: false });
    case "last_interaction_asc":
      return query.order("last_interaction_date", { ascending: true });
    case "last_interaction_desc":
    default:
      return query.order("last_interaction_date", { ascending: false });
  }
}

function sanitizeSearchTerm(value: string) {
  return value.replace(/[,%_]/g, "").trim();
}

function mapLeadWriteInput(input: LeadWriteInput) {
  const normalizedUrl = normalizeLinkedInProfileUrl(input.linkedin_profile_url);

  return {
    full_name: input.full_name.trim(),
    company_name: input.company_name.trim(),
    role_title: input.role_title,
    location: input.location,
    linkedin_profile_url: input.linkedin_profile_url,
    linkedin_profile_url_normalized: normalizedUrl,
    hiring_flag: input.hiring_flag,
    notes: input.notes,
    next_action: input.next_action,
    follow_up_date: input.follow_up_date,
  };
}

export async function listLeads(
  supabase: LeadQueryClient,
  filters: LeadListFilters,
) {
  let query = supabase.from("leads").select("*") as LeadQueryBuilder;

  if (filters.q) {
    const term = sanitizeSearchTerm(filters.q);
    if (term) {
      query = query.or(
        `full_name.ilike.%${term}%,company_name.ilike.%${term}%`,
      );
    }
  }

  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.hiring !== "all") {
    query = query.eq("hiring_flag", filters.hiring === "true");
  }

  const sortedQuery = applyLeadSort(query, filters.sort).limit(200);
  const { data, error } = await sortedQuery;

  if (error) {
    throw error;
  }

  return (data ?? []) as LeadListItem[];
}

export async function getLeadById(supabase: LeadQueryClient, id: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as LeadRecord | null;
}

export async function getLeadByNormalizedLinkedInUrl(
  supabase: LeadQueryClient,
  linkedinUrl: string | null | undefined,
) {
  const normalizedUrl = normalizeLinkedInProfileUrl(linkedinUrl);

  if (!normalizedUrl) {
    return null;
  }

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("linkedin_profile_url_normalized", normalizedUrl)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as LeadRecord | null;
}

export async function getSameCompanyLeads(
  supabase: LeadQueryClient,
  companyName: string,
  excludeLeadId: string,
) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("company_name", companyName)
    .neq("id", excludeLeadId)
    .order("last_interaction_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LeadListItem[];
}

export async function getLeadStatusHistory(
  supabase: LeadQueryClient,
  leadId: string,
) {
  const { data, error } = await supabase
    .from("lead_status_history")
    .select("*")
    .eq("lead_id", leadId)
    .order("changed_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LeadStatusHistoryRecord[];
}

export async function getLeadInteractions(
  supabase: LeadQueryClient,
  leadId: string,
) {
  const { data, error } = await supabase
    .from("lead_interactions")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LeadInteractionRecord[];
}

export async function createLeadRecord(
  supabase: LeadQueryClient,
  input: LeadWriteInput,
) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      ...mapLeadWriteInput(input),
      status: "Radar",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as LeadRecord;
}

export async function updateLeadRecord(
  supabase: LeadQueryClient,
  leadId: string,
  input: LeadWriteInput,
) {
  const { data, error } = await supabase
    .from("leads")
    .update(mapLeadWriteInput(input))
    .eq("id", leadId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as LeadRecord;
}

export async function createLeadInteractionRecord(
  supabase: LeadQueryClient,
  leadId: string,
  input: LeadInteractionCreateInput,
) {
  const { data, error } = await supabase
    .from("lead_interactions")
    .insert({
      lead_id: leadId,
      body: input.body,
      created_via: "app",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as LeadInteractionRecord;
}

export async function updateLeadStatusRecord(
  supabase: LeadQueryClient,
  leadId: string,
  input: LeadStatusUpdate,
) {
  const { data, error } = await supabase.rpc("update_lead_status", {
    p_lead_id: leadId,
    p_new_status: input.new_status,
    p_changed_via: input.changed_via,
  });

  if (error) {
    throw error;
  }

  return data as LeadRecord;
}
