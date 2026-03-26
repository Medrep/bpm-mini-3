import {
  createLeadFromExtension,
  extractLeadPreview,
  lookupLeadByLinkedInUrl,
  updateLeadStatusFromExtension,
} from "./api-client";
import { BACKGROUND_MESSAGE_TYPES } from "@/shared/constants";
import type {
  CreateLeadFromExtensionPayload,
  CreateLeadFromExtensionResponse,
  ExtensionAuthPayload,
  InitializeExtensionFlowPayload,
  InitializeExtensionFlowResponse,
  LinkedInProfileContext,
  ProfileCaptureBounds,
  UpdateExtensionStatusPayload,
  UpdateExtensionStatusResponse,
} from "@/shared/types";

function normalizeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "AUTH_REQUIRED") {
      return {
        error: "Authentication expired. Sign in again.",
        requiresAuth: true,
      };
    }

    return {
      error: error.message,
    };
  }

  return {
    error: "Unexpected extension error.",
  };
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}

async function getActiveLinkedInProfileContext() {
  const activeTab = await getActiveTab();

  if (!activeTab?.id || !activeTab.url) {
    throw new Error("Open a LinkedIn profile tab before using the extension.");
  }

  const context = (await chrome.tabs.sendMessage(activeTab.id, {
    type: BACKGROUND_MESSAGE_TYPES.GET_PROFILE_CONTEXT,
  })) as LinkedInProfileContext | undefined;

  if (!context?.isProfile || !context.linkedinProfileUrl) {
    throw new Error("Open a LinkedIn profile page before using the extension.");
  }

  return {
    activeTab,
    context,
  };
}

function clampBounds(
  bounds: ProfileCaptureBounds,
  imageWidth: number,
  imageHeight: number,
) {
  const scaleX = imageWidth / bounds.viewportWidth;
  const scaleY = imageHeight / bounds.viewportHeight;

  const x = Math.max(0, Math.floor(bounds.x * scaleX));
  const y = Math.max(0, Math.floor(bounds.y * scaleY));
  const width = Math.max(1, Math.floor(bounds.width * scaleX));
  const height = Math.max(1, Math.floor(bounds.height * scaleY));

  return {
    x: Math.min(x, imageWidth - 1),
    y: Math.min(y, imageHeight - 1),
    width: Math.min(width, imageWidth - x),
    height: Math.min(height, imageHeight - y),
  };
}

async function blobToDataUrl(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(
      ...bytes.slice(index, Math.min(index + 0x8000, bytes.length)),
    );
  }

  return `data:${blob.type};base64,${btoa(binary)}`;
}

async function captureProfileScreenshot(
  windowId: number,
  bounds: ProfileCaptureBounds,
) {
  const visibleScreenshot = await chrome.tabs.captureVisibleTab(windowId, {
    format: "png",
  });

  const screenshotResponse = await fetch(visibleScreenshot);
  const screenshotBlob = await screenshotResponse.blob();
  const imageBitmap = await createImageBitmap(screenshotBlob);
  const crop = clampBounds(bounds, imageBitmap.width, imageBitmap.height);
  const canvas = new OffscreenCanvas(crop.width, crop.height);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a screenshot canvas.");
  }

  context.drawImage(
    imageBitmap,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const croppedBlob = await canvas.convertToBlob({
    type: "image/png",
  });

  return blobToDataUrl(croppedBlob);
}

async function initializeExtensionFlow(
  auth: InitializeExtensionFlowPayload,
): Promise<InitializeExtensionFlowResponse> {
  try {
    const { activeTab, context } = await getActiveLinkedInProfileContext();
    const linkedinProfileUrl = context.linkedinProfileUrl;

    if (!linkedinProfileUrl) {
      throw new Error("Open a LinkedIn profile page before using the extension.");
    }

    const lookupResponse = await lookupLeadByLinkedInUrl(
      auth,
      linkedinProfileUrl,
    );

    if (lookupResponse.found) {
      return {
        mode: "existing",
        lead: lookupResponse.lead,
        linkedinProfileUrl,
      };
    }

    if (!context.captureBounds || activeTab.windowId === undefined) {
      throw new Error("Could not identify the visible LinkedIn profile area.");
    }

    const screenshotBase64 = await captureProfileScreenshot(
      activeTab.windowId,
      context.captureBounds,
    );
    const extractResponse = await extractLeadPreview(auth, {
      linkedinProfileUrl,
      screenshotBase64,
    });

    if (!extractResponse.success) {
      return {
        mode: "error",
        error: extractResponse.error,
      };
    }

    return {
      mode: "create",
      extracted: extractResponse.extracted,
      warnings: extractResponse.warnings,
    };
  } catch (error) {
    return {
      mode: "error",
      ...normalizeErrorMessage(error),
    };
  }
}

async function handleStatusUpdate(
  payload: UpdateExtensionStatusPayload,
): Promise<UpdateExtensionStatusResponse> {
  return updateLeadStatusFromExtension(payload, {
    leadId: payload.leadId,
    newStatus: payload.newStatus,
  });
}

async function handleCreateLead(
  payload: CreateLeadFromExtensionPayload,
): Promise<CreateLeadFromExtensionResponse> {
  try {
    const response = await createLeadFromExtension(payload, payload.lead);

    return response;
  } catch (error) {
    return {
      success: false,
      ...normalizeErrorMessage(error),
    };
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === BACKGROUND_MESSAGE_TYPES.INITIALIZE_EXTENSION_FLOW) {
    void initializeExtensionFlow(
      message.payload as InitializeExtensionFlowPayload,
    ).then(sendResponse);
    return true;
  }

  if (message?.type === BACKGROUND_MESSAGE_TYPES.UPDATE_EXTENSION_STATUS) {
    void handleStatusUpdate(message.payload as UpdateExtensionStatusPayload).then(
      sendResponse,
    );
    return true;
  }

  if (message?.type === BACKGROUND_MESSAGE_TYPES.CREATE_LEAD_FROM_EXTENSION) {
    void handleCreateLead(message.payload as CreateLeadFromExtensionPayload).then(
      sendResponse,
    );
    return true;
  }

  return false;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "",
  });
});
