import { leadFiltersSchema, createLeadSchema } from "@my-bpm-mini/shared";
import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import { createLead, listLeadsForPage } from "@/server/leads/lead-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const filters = leadFiltersSchema.parse({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    hiring: searchParams.get("hiring") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });
  const leads = await listLeadsForPage(filters, supabase);

  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const payload = createLeadSchema.parse(body);
  const result = await createLead(payload, supabase);

  return NextResponse.json(
    {
      success: true,
      created: result.created,
      lead: result.lead,
    },
    { status: result.created ? 201 : 200 },
  );
}
