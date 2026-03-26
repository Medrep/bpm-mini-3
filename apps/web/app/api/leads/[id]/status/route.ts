import { leadStatusUpdateSchema } from "@my-bpm-mini/shared";
import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import { updateLeadStatus } from "@/server/leads/lead-status-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const { id } = await context.params;
  const payload = leadStatusUpdateSchema.parse(body);
  const lead = await updateLeadStatus(id, payload, supabase);

  return NextResponse.json({ success: true, lead });
}
