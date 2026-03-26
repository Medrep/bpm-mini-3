import type {
  ExtensionCreateLeadRequestInput,
  ExtensionLeadPreviewInput,
  ExtensionLookupRequestInput,
  ExtractedLeadFromScreenshotInput,
} from "../schemas/extension";
import type { z } from "zod";

import {
  extensionCreateLeadResponseSchema,
  extensionExtractResponseSchema,
  extensionLeadSummarySchema,
  extensionLookupResponseSchema,
} from "../schemas/extension";

export type ExtensionLookupRequest = ExtensionLookupRequestInput;
export type ExtensionLeadSummary = z.infer<typeof extensionLeadSummarySchema>;
export type ExtensionLookupResponse = z.infer<typeof extensionLookupResponseSchema>;
export type ExtractedLeadFromScreenshot = ExtractedLeadFromScreenshotInput;
export type ExtensionLeadPreview = ExtensionLeadPreviewInput;
export type ExtensionExtractResponse = z.infer<typeof extensionExtractResponseSchema>;
export type ExtensionCreateLeadRequest = ExtensionCreateLeadRequestInput;
export type ExtensionCreateLeadResponse = z.infer<
  typeof extensionCreateLeadResponseSchema
>;
