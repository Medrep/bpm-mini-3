import type { LeadRecord } from "@my-bpm-mini/shared";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LeadFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mode: "create" | "edit";
  lead?: LeadRecord;
  errorMessage?: string | null;
};

export function LeadForm({ action, mode, lead, errorMessage }: LeadFormProps) {
  return (
    <form action={action} className="space-y-5">
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Lead Details" : "Edit Lead"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                defaultValue={lead?.full_name ?? ""}
                id="full_name"
                name="full_name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                defaultValue={lead?.company_name ?? ""}
                id="company_name"
                name="company_name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role_title">Role Title</Label>
              <Input
                defaultValue={lead?.role_title ?? ""}
                id="role_title"
                name="role_title"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input defaultValue={lead?.location ?? ""} id="location" name="location" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="linkedin_profile_url">LinkedIn Profile URL</Label>
              <Input
                defaultValue={lead?.linkedin_profile_url ?? ""}
                id="linkedin_profile_url"
                name="linkedin_profile_url"
                placeholder="https://www.linkedin.com/in/john-smith/"
              />
              <p className="text-[11px] leading-4 text-slate-500">
                Leave this blank when no profile is saved. The placeholder is only an example.
              </p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <input
                  defaultChecked={lead?.hiring_flag ?? false}
                  id="hiring_flag"
                  name="hiring_flag"
                  type="checkbox"
                />
                <div>
                  <Label htmlFor="hiring_flag">Hiring Flag</Label>
                  <p className="text-[13px] leading-5 text-slate-500">
                    Mark this lead if the company appears actively hiring.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="next_action">Next Action</Label>
              <Textarea
                className="min-h-[108px]"
                defaultValue={lead?.next_action ?? ""}
                id="next_action"
                name="next_action"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <Input
                defaultValue={lead?.follow_up_date ?? ""}
                id="follow_up_date"
                name="follow_up_date"
                type="date"
              />
              <p className="text-[11px] leading-4 text-slate-500">
                Leave empty unless this lead already has a real saved follow-up date.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Summary</CardTitle>
          <p className="text-[13px] leading-5 text-slate-500">
            Short optional internal summary of the lead.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Lead Summary</Label>
            <Textarea
              className="min-h-[108px]"
              defaultValue={lead?.notes ?? ""}
              id="notes"
              name="notes"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end">
        <Button type="submit">
          {mode === "create" ? "Create Lead" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
