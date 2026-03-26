import type { LeadInteractionRecord } from "@my-bpm-mini/shared";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils";

type LeadInteractionsBlockProps = {
  action: (formData: FormData) => void | Promise<void>;
  interactions: LeadInteractionRecord[];
};

export function LeadInteractionsBlock({
  action,
  interactions,
}: LeadInteractionsBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={action} className="space-y-2.5">
          <Textarea
            className="min-h-[96px]"
            id="body"
            name="body"
            placeholder="Add a new interaction note..."
            required
          />
          <div className="flex justify-end">
            <Button type="submit">Add Interaction</Button>
          </div>
        </form>

        {interactions.length === 0 ? (
          <p className="text-[13px] text-slate-500">No interactions recorded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="rounded-xl border border-slate-200 px-3.5 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-medium text-slate-900">
                    {formatDateTime(interaction.created_at)}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {interaction.created_via}
                  </span>
                </div>
                <p className="mt-2.5 whitespace-pre-wrap text-[13px] leading-5 text-slate-700">
                  {interaction.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
