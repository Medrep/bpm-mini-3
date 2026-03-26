import type {
  ExtensionCreateLeadRequest,
  ExtensionLeadPreview,
  ExtensionLeadSummary,
  LeadStatus,
} from "@my-bpm-mini/shared";

export type ProfileCaptureBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
};

export type LinkedInProfileContext = {
  isProfile: boolean;
  linkedinProfileUrl: string | null;
  captureBounds: ProfileCaptureBounds | null;
};

export type ExtensionAuthPayload = {
  appBaseUrl: string;
  accessToken: string;
};

export type InitializeExtensionFlowPayload = ExtensionAuthPayload;

export type InitializeExtensionFlowResponse =
  | {
      mode: "existing";
      lead: ExtensionLeadSummary;
      linkedinProfileUrl: string;
    }
  | {
      mode: "create";
      extracted: ExtensionLeadPreview;
      warnings: string[];
    }
  | {
      mode: "error";
      error: string;
      requiresAuth?: boolean;
    };

export type UpdateExtensionStatusPayload = ExtensionAuthPayload & {
  leadId: string;
  newStatus: LeadStatus;
};

export type UpdateExtensionStatusResponse =
  | {
      success: true;
      lead: ExtensionLeadSummary;
    }
  | {
      success: false;
      error: string;
      requiresAuth?: boolean;
    };

export type CreateLeadFromExtensionPayload = ExtensionAuthPayload & {
  lead: ExtensionCreateLeadRequest;
};

export type CreateLeadFromExtensionResponse =
  | {
      success: true;
      created: boolean;
      lead: ExtensionLeadSummary;
    }
  | {
      success: false;
      error: string;
      requiresAuth?: boolean;
    };

