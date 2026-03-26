import type {
  LeadFiltersInput,
  LeadStatusUpdateInput,
  LeadUpsertInput,
} from "../schemas/leads";
import type {
  LeadStatus,
  LeadStatusChangeSource,
} from "../constants/lead-statuses";

export type LeadWriteInput = LeadUpsertInput;
export type LeadListFilters = LeadFiltersInput;
export type LeadStatusUpdate = LeadStatusUpdateInput;

export type LeadRecord = {
  id: string;
  full_name: string;
  company_name: string;
  role_title: string | null;
  location: string | null;
  linkedin_profile_url: string | null;
  linkedin_profile_url_normalized: string | null;
  status: LeadStatus;
  hiring_flag: boolean;
  notes: string | null;
  next_action: string | null;
  follow_up_date: string | null;
  date_added: string;
  last_interaction_date: string;
  created_at: string;
  updated_at: string;
};

export type LeadListItem = LeadRecord;

export type LeadStatusHistoryRecord = {
  id: string;
  lead_id: string;
  previous_status: LeadStatus | null;
  new_status: LeadStatus;
  changed_at: string;
  changed_via: LeadStatusChangeSource;
};

export type LeadInteractionRecord = {
  id: string;
  lead_id: string;
  body: string;
  created_at: string;
  created_via: "app";
};
