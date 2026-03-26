import type { LeadRecord } from "@my-bpm-mini/shared";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LeadPlanningFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  lead: LeadRecord;
};

export function LeadPlanningForm({ action, lead }: LeadPlanningFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Action</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="next_action">Next Action</Label>
            <Textarea
              className="min-h-[108px]"
              defaultValue={lead.next_action ?? ""}
              id="next_action"
              name="next_action"
            />
          </div>

          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="follow_up_date">Follow-up Date</Label>
            <Input
              defaultValue={lead.follow_up_date ?? ""}
              id="follow_up_date"
              name="follow_up_date"
              type="date"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Next Action</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
