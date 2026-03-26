import type { CandidateListFilters } from "@my-bpm-mini/shared";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, getButtonClasses } from "@/components/ui/button";
import Link from "next/link";

export function CandidateFilters({
  filters,
}: {
  filters: CandidateListFilters;
}) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-base">Search</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 lg:grid-cols-[minmax(220px,2fr)_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="q">Name or Stack</Label>
            <Input
              defaultValue={filters.q}
              id="q"
              name="q"
              placeholder="Jane Doe or React"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit">Apply</Button>
            <Link className={getButtonClasses("ghost")} href="/candidates">
              Reset
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
