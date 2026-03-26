import { leadInteractionCreateSchema } from "@my-bpm-mini/shared";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import {
  createLeadInteraction,
  listLeadInteractionsForLead,
} from "@/server/leads/lead-interaction-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function notFoundResponse() {
  return NextResponse.json({ error: "Lead not found" }, { status: 404 });
}

function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const interactions = await listLeadInteractionsForLead(id, supabase);

    return NextResponse.json({ interactions });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequestResponse(error.issues[0]?.message ?? "Invalid request.");
    }

    if (error instanceof Error && error.message === "Lead not found.") {
      return notFoundResponse();
    }

    throw error;
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { id } = await context.params;
    const payload = leadInteractionCreateSchema.parse(body);
    const interaction = await createLeadInteraction(id, payload, supabase);

    return NextResponse.json({ success: true, interaction }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequestResponse(error.issues[0]?.message ?? "Invalid request.");
    }

    if (error instanceof Error && error.message === "Lead not found.") {
      return notFoundResponse();
    }

    throw error;
  }
}
