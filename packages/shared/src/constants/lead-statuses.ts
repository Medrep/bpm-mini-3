export const LEAD_STATUSES = [
  "Radar",
  "Connection Sent",
  "Connected",
  "Message Sent",
  "Conversation",
  "Interested",
  "Future Contact",
  "Ignored",
  "Rejected",
  "Not Interested",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_CHANGE_SOURCES = ["app", "extension"] as const;

export type LeadStatusChangeSource = (typeof LEAD_STATUS_CHANGE_SOURCES)[number];

