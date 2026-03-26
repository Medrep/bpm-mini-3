import { LEAD_STATUSES, type LeadStatus } from "@my-bpm-mini/shared";

type StatusDropdownProps = {
  value: LeadStatus;
  onChange: (value: LeadStatus) => void;
};

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  return (
    <label className="field">
      <span className="field-label">Status</span>
      <select
        className="input"
        value={value}
        onChange={(event) => onChange(event.target.value as LeadStatus)}
      >
        {LEAD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

