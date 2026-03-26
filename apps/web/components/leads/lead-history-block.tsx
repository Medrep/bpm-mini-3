import type { LeadStatusHistoryRecord } from "@my-bpm-mini/shared";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

export function LeadHistoryBlock({
  history,
}: {
  history: LeadStatusHistoryRecord[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-[13px] text-slate-500">
            No status changes have been recorded yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-200 px-3.5 py-3"
              >
                <p className="text-[13px] font-medium text-slate-900">
                  {entry.previous_status ?? "Initial"} → {entry.new_status}
                </p>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  {entry.changed_via} • {formatDateTime(entry.changed_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
