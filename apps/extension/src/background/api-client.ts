import {
  extensionCreateLeadResponseSchema,
  extensionExtractResponseSchema,
  extensionLookupResponseSchema,
  leadStatusSchema,
} from "@my-bpm-mini/shared";

import type {
  ExtensionAuthPayload,
  UpdateExtensionStatusResponse,
} from "@/shared/types";

function buildHeaders(accessToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

function normalizeBaseUrl(appBaseUrl: string) {
  return appBaseUrl.replace(/\/+$/, "");
}

async function parseErrorResponse(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export async function lookupLeadByLinkedInUrl(
  auth: ExtensionAuthPayload,
  linkedinProfileUrl: string,
) {
  const response = await fetch(
    `${normalizeBaseUrl(auth.appBaseUrl)}/api/extension/lookup`,
    {
      method: "POST",
      headers: buildHeaders(auth.accessToken),
      body: JSON.stringify({
        linkedin_profile_url: linkedinProfileUrl,
      }),
    },
  );

  if (response.status === 401) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return extensionLookupResponseSchema.parse(await response.json());
}

export async function extractLeadPreview(
  auth: ExtensionAuthPayload,
  payload: {
    linkedinProfileUrl: string;
    screenshotBase64: string;
  },
) {
  const response = await fetch(
    `${normalizeBaseUrl(auth.appBaseUrl)}/api/extension/extract`,
    {
      method: "POST",
      headers: buildHeaders(auth.accessToken),
      body: JSON.stringify({
        linkedin_profile_url: payload.linkedinProfileUrl,
        screenshot_base64: payload.screenshotBase64,
      }),
    },
  );

  if (response.status === 401) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return extensionExtractResponseSchema.parse(await response.json());
}

export async function createLeadFromExtension(
  auth: ExtensionAuthPayload,
  lead: {
    full_name: string;
    company_name: string;
    role_title: string | null;
    location: string | null;
    linkedin_profile_url: string;
  },
) {
  const response = await fetch(
    `${normalizeBaseUrl(auth.appBaseUrl)}/api/extension/create-lead`,
    {
      method: "POST",
      headers: buildHeaders(auth.accessToken),
      body: JSON.stringify(lead),
    },
  );

  if (response.status === 401) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return extensionCreateLeadResponseSchema.parse(await response.json());
}

export async function updateLeadStatusFromExtension(
  auth: ExtensionAuthPayload,
  payload: {
    leadId: string;
    newStatus: string;
  },
): Promise<UpdateExtensionStatusResponse> {
  const response = await fetch(
    `${normalizeBaseUrl(auth.appBaseUrl)}/api/leads/${payload.leadId}/status`,
    {
      method: "POST",
      headers: buildHeaders(auth.accessToken),
      body: JSON.stringify({
        new_status: payload.newStatus,
        changed_via: "extension",
      }),
    },
  );

  if (response.status === 401) {
    return {
      success: false,
      error: "Authentication expired. Sign in again.",
      requiresAuth: true,
    };
  }

  if (!response.ok) {
    return {
      success: false,
      error: await parseErrorResponse(response),
    };
  }

  const payloadJson = (await response.json()) as {
    success: true;
    lead: {
      id: string;
      full_name: string;
      company_name: string;
      role_title: string | null;
      status: unknown;
    };
  };

  return {
    success: true,
    lead: {
      id: payloadJson.lead.id,
      full_name: payloadJson.lead.full_name,
      company_name: payloadJson.lead.company_name,
      role_title: payloadJson.lead.role_title,
      status: leadStatusSchema.parse(payloadJson.lead.status),
    },
  };
}

