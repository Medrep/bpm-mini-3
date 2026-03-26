import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import { lookupLeadForExtension } from "@/server/extension/extension-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const { user, supabase } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  const payload = await request.json();
  const response = await lookupLeadForExtension(supabase, payload);

  return NextResponse.json(response);
}

