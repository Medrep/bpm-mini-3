import { extractedLeadFromScreenshotSchema } from "@my-bpm-mini/shared";

import { parseImageDataUrl } from "./image-utils";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const EXTRACTION_SCHEMA = {
  name: "linkedin_lead_extraction",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      full_name: {
        type: ["string", "null"],
      },
      company_name: {
        type: ["string", "null"],
      },
      role_title: {
        type: ["string", "null"],
      },
      location: {
        type: ["string", "null"],
      },
    },
    required: ["full_name", "company_name", "role_title", "location"],
  },
} as const;

function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  return apiKey;
}

export async function extractLeadFromScreenshotWithOpenAi(
  screenshotBase64: string,
) {
  const { mimeType, base64Payload } = parseImageDataUrl(screenshotBase64);
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getOpenAiApiKey()}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Extract only the visible LinkedIn profile fields requested. Return null when a field is unclear. Do not infer hidden data or add extra fields.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Read this LinkedIn profile screenshot and extract full_name, company_name, role_title, and location only.",
            },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${base64Payload}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...EXTRACTION_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI extraction request failed.");
  }

  const payload = (await response.json()) as {
    output_text?: string;
  };

  if (!payload.output_text) {
    throw new Error("OpenAI extraction returned no structured output.");
  }

  const parsedJson = JSON.parse(payload.output_text);
  const parsed = extractedLeadFromScreenshotSchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error("OpenAI extraction returned invalid fields.");
  }

  return parsed.data;
}

