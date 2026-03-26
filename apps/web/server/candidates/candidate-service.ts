import type { SupabaseClient } from "@supabase/supabase-js";
import {
  candidateFiltersSchema,
  candidateLookupSchema,
  createCandidateSchema,
  updateCandidateSchema,
  type CandidateListFilters,
  type CandidateWriteInput,
} from "@my-bpm-mini/shared";

import { createServerSupabaseClient } from "../auth/supabase";
import {
  createCandidateRecord,
  getCandidateById,
  listCandidates,
  updateCandidateRecord,
} from "./candidate-repository";

async function resolveSupabaseClient(supabaseClient?: SupabaseClient) {
  return supabaseClient ?? (await createServerSupabaseClient());
}

export async function listCandidatesForPage(
  filters: CandidateListFilters,
  supabaseClient?: SupabaseClient,
) {
  const parsedFilters = candidateFiltersSchema.parse(filters);
  const supabase = await resolveSupabaseClient(supabaseClient);

  return listCandidates(supabase, parsedFilters);
}

export async function getCandidateDetail(
  candidateId: string,
  supabaseClient?: SupabaseClient,
) {
  const parsedId = candidateLookupSchema.parse({ id: candidateId }).id;
  const supabase = await resolveSupabaseClient(supabaseClient);

  return getCandidateById(supabase, parsedId);
}

export async function createCandidate(
  input: CandidateWriteInput,
  supabaseClient?: SupabaseClient,
) {
  const parsedInput = createCandidateSchema.parse(input);
  const supabase = await resolveSupabaseClient(supabaseClient);

  return createCandidateRecord(supabase, parsedInput);
}

export async function updateCandidate(
  candidateId: string,
  input: CandidateWriteInput,
  supabaseClient?: SupabaseClient,
) {
  const parsedId = candidateLookupSchema.parse({ id: candidateId }).id;
  const parsedInput = updateCandidateSchema.parse(input);
  const supabase = await resolveSupabaseClient(supabaseClient);

  return updateCandidateRecord(supabase, parsedId, parsedInput);
}
