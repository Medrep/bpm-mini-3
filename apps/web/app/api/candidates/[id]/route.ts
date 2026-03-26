import { updateCandidateSchema } from "@my-bpm-mini/shared";
import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import {
  getCandidateDetail,
  updateCandidate,
} from "@/server/candidates/candidate-service";

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
  const candidate = await getCandidateDetail(id, supabase);

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate });
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
  const payload = updateCandidateSchema.parse(body);
  const candidate = await updateCandidate(id, payload, supabase);

  return NextResponse.json({ success: true, candidate });
}

