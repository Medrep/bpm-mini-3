import Link from "next/link";
import { LEAD_STATUSES, type LeadListFilters } from "@my-bpm-mini/shared";

import { Button, getButtonClasses } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type LeadFiltersProps = {
  filters: LeadListFilters;
  currentView: "table" | "kanban";
};

function getResetHref(currentView: LeadFiltersProps["currentView"]) {
  return currentView === "kanban" ? "/leads?view=kanban" : "/leads";
}

export function LeadFilters({ filters, currentView }: LeadFiltersProps) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 lg:grid-cols-[minmax(200px,2fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(200px,1fr)_auto]">
          {currentView === "kanban" ? (
            <input name="view" type="hidden" value="kanban" />
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="q">Search</Label>
            <Input
              defaultValue={filters.q}
              id="q"
              name="q"
              placeholder="Name or company"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={filters.status} id="status" name="status">
              <option value="all">All statuses</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hiring">Hiring Flag</Label>
            <Select defaultValue={filters.hiring} id="hiring" name="hiring">
              <option value="all">All leads</option>
              <option value="true">Hiring only</option>
              <option value="false">Not hiring</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sort">Sort</Label>
            <Select defaultValue={filters.sort} id="sort" name="sort">
              <option value="last_interaction_desc">Last interaction, newest</option>
              <option value="last_interaction_asc">Last interaction, oldest</option>
              <option value="date_added_desc">Date added, newest</option>
              <option value="date_added_asc">Date added, oldest</option>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit">Apply</Button>
            <Link className={getButtonClasses("ghost")} href={getResetHref(currentView)}>
              Reset
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
