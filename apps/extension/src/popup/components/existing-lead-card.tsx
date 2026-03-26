import type { ExtensionLeadSummary, LeadStatus } from "@my-bpm-mini/shared";

import { StatusDropdown } from "./status-dropdown";

type ExistingLeadCardProps = {
  lead: ExtensionLeadSummary;
  selectedStatus: LeadStatus;
  isSaving: boolean;
  message?: string | null;
  onStatusChange: (value: LeadStatus) => void;
  onSave: () => void;
};

export function ExistingLeadCard({
  lead,
  selectedStatus,
  isSaving,
  message,
  onStatusChange,
  onSave,
}: ExistingLeadCardProps) {
  return (
    <div className="panel">
      <p className="panel-kicker">Existing Lead</p>
      <p className="panel-title">{lead.full_name}</p>
      <p className="panel-copy">
        {lead.company_name}
        {lead.role_title ? ` • ${lead.role_title}` : ""}
      </p>
      <StatusDropdown value={selectedStatus} onChange={onStatusChange} />
      {message ? <p className="inline-message">{message}</p> : null}
      <button
        className="button"
        disabled={isSaving}
        onClick={onSave}
        type="button"
      >
        {isSaving ? "Saving..." : "Save Status"}
      </button>
    </div>
  );
}

