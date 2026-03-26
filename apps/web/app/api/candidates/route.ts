import { candidateFiltersSchema, createCandidateSchema } from "@my-bpm-mini/shared";
import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import {
  createCandidate,
  listCandidatesForPage,
} from "@/server/candidates/candidate-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const filters = candidateFiltersSchema.parse({
    q: searchParams.get("q") ?? undefined,
  });
  const candidates = await listCandidatesForPage(filters, supabase);

  return NextResponse.json({ candidates });
}

export async function POST(request: Request) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const payload = createCandidateSchema.parse(body);
  const candidate = await createCandidate(payload, supabase);

  return NextResponse.json({ success: true, candidate }, { status: 201 });
}

