import type { CandidateRecord } from "@my-bpm-mini/shared";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CandidateFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mode: "create" | "edit";
  candidate?: CandidateRecord;
  errorMessage?: string | null;
};

export function CandidateForm({
  action,
  mode,
  candidate,
  errorMessage,
}: CandidateFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Candidate Details" : "Edit Candidate"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                defaultValue={candidate?.full_name ?? ""}
                id="full_name"
                name="full_name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="primary_stack">Primary Stack</Label>
              <Input
                defaultValue={candidate?.primary_stack ?? ""}
                id="primary_stack"
                name="primary_stack"
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                defaultValue={candidate?.linkedin_url ?? ""}
                id="linkedin_url"
                name="linkedin_url"
                placeholder="https://www.linkedin.com/in/jane-doe/"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                defaultValue={candidate?.location ?? ""}
                id="location"
                name="location"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                defaultValue={candidate?.years_of_experience ?? ""}
                id="years_of_experience"
                name="years_of_experience"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="english_level">English Level</Label>
              <Input
                defaultValue={candidate?.english_level ?? ""}
                id="english_level"
                name="english_level"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rate">Rate</Label>
              <Input defaultValue={candidate?.rate ?? ""} id="rate" name="rate" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="original_cv_file_path">Original CV File Path</Label>
              <Input
                defaultValue={candidate?.original_cv_file_path ?? ""}
                id="original_cv_file_path"
                name="original_cv_file_path"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="formatted_cv_file_path">Formatted CV File Path</Label>
              <Input
                defaultValue={candidate?.formatted_cv_file_path ?? ""}
                id="formatted_cv_file_path"
                name="formatted_cv_file_path"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                className="min-h-[108px]"
                defaultValue={candidate?.notes ?? ""}
                id="notes"
                name="notes"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button type="submit">
              {mode === "create" ? "Create Candidate" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
