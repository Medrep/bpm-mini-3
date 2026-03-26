import { updateLeadSchema } from "@my-bpm-mini/shared";
import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import { getLeadDetail, updateLead } from "@/server/leads/lead-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  const detail = await getLeadDetail(id, supabase);

  if (!detail) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const { id } = await context.params;
  const payload = updateLeadSchema.parse(body);
  const lead = await updateLead(id, payload, supabase);

  return NextResponse.json({ success: true, lead });
}
