import type { SupabaseClient } from "@supabase/supabase-js";
import {
  extensionCreateLeadRequestSchema,
  extensionExtractRequestSchema,
  extensionLeadPreviewSchema,
  extensionLookupRequestSchema,
  type ExtensionCreateLeadResponse,
  type ExtensionLeadSummary,
  type ExtensionLookupResponse,
} from "@my-bpm-mini/shared";

import { createLead } from "../leads/lead-service";
import { getLeadByNormalizedLinkedInUrl } from "../leads/lead-repository";
import { extractLeadFromScreenshotWithOpenAi } from "./openai-vision-service";

function mapLeadSummary(lead: {
  id: string;
  full_name: string;
  company_name: string;
  role_title: string | null;
  status: ExtensionLeadSummary["status"];
}): ExtensionLeadSummary {
  return {
    id: lead.id,
    full_name: lead.full_name,
    company_name: lead.company_name,
    role_title: lead.role_title,
    status: lead.status,
  };
}

export async function lookupLeadForExtension(
  supabase: SupabaseClient,
  input: unknown,
): Promise<ExtensionLookupResponse> {
  const parsed = extensionLookupRequestSchema.parse(input);
  const lead = await getLeadByNormalizedLinkedInUrl(
    supabase,
    parsed.linkedin_profile_url,
  );

  if (!lead) {
    return {
      found: false,
    };
  }

  return {
    found: true,
    lead: mapLeadSummary(lead),
  };
}

export async function extractLeadPreviewForExtension(input: unknown) {
  const parsed = extensionExtractRequestSchema.parse(input);
  const extractedLead = await extractLeadFromScreenshotWithOpenAi(
    parsed.screenshot_base64,
  );

  return {
    success: true as const,
    extracted: extensionLeadPreviewSchema.parse({
      ...extractedLead,
      linkedin_profile_url: parsed.linkedin_profile_url,
    }),
    warnings: [],
  };
}

export async function createLeadForExtension(
  supabase: SupabaseClient,
  input: unknown,
): Promise<ExtensionCreateLeadResponse> {
  const parsed = extensionCreateLeadRequestSchema.parse(input);
  const result = await createLead(
    {
      full_name: parsed.full_name,
      company_name: parsed.company_name,
      role_title: parsed.role_title,
      location: parsed.location,
      linkedin_profile_url: parsed.linkedin_profile_url,
      hiring_flag: false,
      notes: null,
      next_action: null,
      follow_up_date: null,
    },
    supabase,
  );

  return {
    success: true,
    created: result.created,
    lead: mapLeadSummary(result.lead),
  };
}

