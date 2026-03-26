import { LEAD_STATUSES, type LeadStatus } from "@my-bpm-mini/shared";

import { Select } from "@/components/ui/select";

type LeadStatusSelectProps = {
  name: string;
  defaultValue: LeadStatus;
  className?: string;
};

export function LeadStatusSelect({
  name,
  defaultValue,
  className,
}: LeadStatusSelectProps) {
  return (
    <Select className={className} defaultValue={defaultValue} name={name}>
      {LEAD_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </Select>
  );
}

