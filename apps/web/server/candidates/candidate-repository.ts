import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CandidateListFilters,
  CandidateListItem,
  CandidateRecord,
  CandidateWriteInput,
} from "@my-bpm-mini/shared";

type CandidateQueryClient = SupabaseClient;
type CandidateQueryBuilder = any;

function sanitizeSearchTerm(value: string) {
  return value.replace(/[,%_]/g, "").trim();
}

function mapCandidateWriteInput(input: CandidateWriteInput) {
  return {
    full_name: input.full_name.trim(),
    primary_stack: input.primary_stack.trim(),
    linkedin_url: input.linkedin_url,
    location: input.location,
    years_of_experience: input.years_of_experience,
    english_level: input.english_level,
    rate: input.rate,
    notes: input.notes,
    original_cv_file_path: input.original_cv_file_path,
    formatted_cv_file_path: input.formatted_cv_file_path,
  };
}

export async function listCandidates(
  supabase: CandidateQueryClient,
  filters: CandidateListFilters,
) {
  let query = supabase.from("candidates").select("*") as CandidateQueryBuilder;

  if (filters.q) {
    const term = sanitizeSearchTerm(filters.q);

    if (term) {
      query = query.or(
        `full_name.ilike.%${term}%,primary_stack.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query.order("updated_at", { ascending: false }).limit(200);

  if (error) {
    throw error;
  }

  return (data ?? []) as CandidateListItem[];
}

export async function getCandidateById(
  supabase: CandidateQueryClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CandidateRecord | null;
}

export async function createCandidateRecord(
  supabase: CandidateQueryClient,
  input: CandidateWriteInput,
) {
  const { data, error } = await supabase
    .from("candidates")
    .insert(mapCandidateWriteInput(input))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as CandidateRecord;
}

export async function updateCandidateRecord(
  supabase: CandidateQueryClient,
  candidateId: string,
  input: CandidateWriteInput,
) {
  const { data, error } = await supabase
    .from("candidates")
    .update(mapCandidateWriteInput(input))
    .eq("id", candidateId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as CandidateRecord;
}

