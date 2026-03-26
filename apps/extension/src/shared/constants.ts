const configuredDefaultAppBaseUrl = import.meta.env.VITE_DEFAULT_APP_BASE_URL?.trim();

export const DEFAULT_APP_BASE_URL = configuredDefaultAppBaseUrl
  ? configuredDefaultAppBaseUrl.replace(/\/+$/, "")
  : "http://127.0.0.1:3000";
export const APP_BASE_URL_STORAGE_KEY = "my-bpm-mini:app-base-url";

export const BACKGROUND_MESSAGE_TYPES = {
  INITIALIZE_EXTENSION_FLOW: "my-bpm-mini/initialize-extension-flow",
  UPDATE_EXTENSION_STATUS: "my-bpm-mini/update-extension-status",
  CREATE_LEAD_FROM_EXTENSION: "my-bpm-mini/create-lead-from-extension",
  GET_PROFILE_CONTEXT: "my-bpm-mini/get-profile-context",
} as const;
