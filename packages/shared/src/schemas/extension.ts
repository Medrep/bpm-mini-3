import { z } from "zod";

import { leadStatusSchema } from "./leads";

const nullableTrimmedString = z.preprocess((value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized === "" ? null : normalized;
}, z.string().nullable());

const requiredLinkedInUrlSchema = z
  .string()
  .trim()
  .min(1, "LinkedIn profile URL is required.");

export const extensionLeadSummarySchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  company_name: z.string(),
  role_title: z.string().nullable(),
  status: leadStatusSchema,
});

export const extensionLookupRequestSchema = z.object({
  linkedin_profile_url: requiredLinkedInUrlSchema,
});

export const extensionLookupResponseSchema = z.union([
  z.object({
    found: z.literal(true),
    lead: extensionLeadSummarySchema,
  }),
  z.object({
    found: z.literal(false),
  }),
]);

export const extractedLeadFromScreenshotSchema = z.object({
  full_name: nullableTrimmedString,
  company_name: nullableTrimmedString,
  role_title: nullableTrimmedString,
  location: nullableTrimmedString,
});

export const extensionLeadPreviewSchema = extractedLeadFromScreenshotSchema.extend({
  linkedin_profile_url: requiredLinkedInUrlSchema,
});

export const extensionExtractRequestSchema = z.object({
  linkedin_profile_url: requiredLinkedInUrlSchema,
  screenshot_base64: z
    .string()
    .trim()
    .regex(
      /^data:image\/(?:png|jpeg|jpg|webp);base64,/i,
      "Screenshot must be a base64 image data URL.",
    ),
});

export const extensionExtractSuccessResponseSchema = z.object({
  success: z.literal(true),
  extracted: extensionLeadPreviewSchema,
  warnings: z.array(z.string()),
});

export const extensionExtractFailureResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const extensionExtractResponseSchema = z.union([
  extensionExtractSuccessResponseSchema,
  extensionExtractFailureResponseSchema,
]);

export const extensionCreateLeadRequestSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required."),
  company_name: z.string().trim().min(1, "Company name is required."),
  role_title: nullableTrimmedString,
  location: nullableTrimmedString,
  linkedin_profile_url: requiredLinkedInUrlSchema,
});

export const extensionCreateLeadResponseSchema = z.object({
  success: z.literal(true),
  created: z.boolean(),
  lead: extensionLeadSummarySchema,
});

export type ExtensionLookupRequestInput = z.infer<
  typeof extensionLookupRequestSchema
>;
export type ExtensionLeadPreviewInput = z.infer<typeof extensionLeadPreviewSchema>;
export type ExtensionCreateLeadRequestInput = z.infer<
  typeof extensionCreateLeadRequestSchema
>;
export type ExtractedLeadFromScreenshotInput = z.infer<
  typeof extractedLeadFromScreenshotSchema
>;

