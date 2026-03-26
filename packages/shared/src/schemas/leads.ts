import { z } from "zod";

import {
  LEAD_STATUSES,
  LEAD_STATUS_CHANGE_SOURCES,
} from "../constants/lead-statuses";

const optionalTrimmedString = z.preprocess((value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
}, z.string().nullable());

const nullableIsoDateString = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable());

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const leadStatusChangeSourceSchema = z.enum(LEAD_STATUS_CHANGE_SOURCES);

export const leadUpsertSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  company_name: z.string().trim().min(1, "Company name is required."),
  role_title: optionalTrimmedString,
  location: optionalTrimmedString,
  linkedin_profile_url: optionalTrimmedString,
  hiring_flag: z.boolean().default(false),
  notes: optionalTrimmedString,
  next_action: optionalTrimmedString,
  follow_up_date: nullableIsoDateString,
});

export const createLeadSchema = leadUpsertSchema;

export const updateLeadSchema = leadUpsertSchema;

export const leadStatusUpdateSchema = z.object({
  new_status: leadStatusSchema,
  changed_via: leadStatusChangeSourceSchema,
});

export const leadInteractionCreateSchema = z.object({
  body: z.string().trim().min(1, "Interaction body is required."),
});

export const leadFiltersSchema = z.object({
  q: z.string().trim().optional().transform((value) => (value ? value : "")),
  status: z
    .union([leadStatusSchema, z.literal("all")])
    .optional()
    .transform((value) => value ?? "all"),
  hiring: z
    .union([z.literal("all"), z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => value ?? "all"),
  sort: z
    .enum([
      "last_interaction_desc",
      "last_interaction_asc",
      "date_added_desc",
      "date_added_asc",
    ])
    .optional()
    .transform((value) => value ?? "last_interaction_desc"),
});

export const leadLookupSchema = z.object({
  id: z.string().uuid(),
});

export type LeadUpsertInput = z.infer<typeof leadUpsertSchema>;
export type LeadStatusUpdateInput = z.infer<typeof leadStatusUpdateSchema>;
export type LeadInteractionCreateInput = z.infer<
  typeof leadInteractionCreateSchema
>;
export type LeadFiltersInput = z.infer<typeof leadFiltersSchema>;
