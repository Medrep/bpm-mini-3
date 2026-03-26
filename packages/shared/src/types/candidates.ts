import type {
  CandidateFiltersInput,
  CandidateUpsertInput,
} from "../schemas/candidates";

export type CandidateWriteInput = CandidateUpsertInput;
export type CandidateListFilters = CandidateFiltersInput;

export type CandidateRecord = {
  id: string;
  full_name: string;
  primary_stack: string;
  linkedin_url: string | null;
  location: string | null;
  years_of_experience: string | null;
  english_level: string | null;
  rate: string | null;
  notes: string | null;
  original_cv_file_path: string | null;
  formatted_cv_file_path: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateListItem = CandidateRecord;

