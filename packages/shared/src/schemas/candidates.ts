import { z } from "zod";

const optionalTrimmedString = z.preprocess((value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
}, z.string().nullable());

export const candidateUpsertSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  primary_stack: z.string().trim().min(1, "Primary stack is required."),
  linkedin_url: optionalTrimmedString,
  location: optionalTrimmedString,
  years_of_experience: optionalTrimmedString,
  english_level: optionalTrimmedString,
  rate: optionalTrimmedString,
  notes: optionalTrimmedString,
  original_cv_file_path: optionalTrimmedString,
  formatted_cv_file_path: optionalTrimmedString,
});

export const createCandidateSchema = candidateUpsertSchema;

export const updateCandidateSchema = candidateUpsertSchema;

export const candidateFiltersSchema = z.object({
  q: z.string().trim().optional().transform((value) => (value ? value : "")),
});

export const candidateLookupSchema = z.object({
  id: z.string().uuid(),
});

export type CandidateUpsertInput = z.infer<typeof candidateUpsertSchema>;
export type CandidateFiltersInput = z.infer<typeof candidateFiltersSchema>;

