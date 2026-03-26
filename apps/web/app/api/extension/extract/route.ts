import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext } from "@/server/auth/request-auth";
import { extractLeadPreviewForExtension } from "@/server/extension/extension-service";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const { user } = await getAuthenticatedRequestContext(request);

  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const payload = await request.json();
    const response = await extractLeadPreviewForExtension(payload);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OCR extraction failed";

    return NextResponse.json(
      {
        success: false,
        error: message || "OCR extraction failed",
      },
      { status: 200 },
    );
  }
}

