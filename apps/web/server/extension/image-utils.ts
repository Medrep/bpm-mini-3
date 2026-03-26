const IMAGE_DATA_URL_PATTERN =
  /^data:(image\/(?:png|jpeg|jpg|webp));base64,([a-z0-9+/=\s]+)$/i;

export function parseImageDataUrl(dataUrl: string) {
  const match = dataUrl.trim().match(IMAGE_DATA_URL_PATTERN);

  if (!match) {
    throw new Error("Screenshot must be a valid base64 image data URL.");
  }

  const [, mimeType, base64Payload] = match;

  return {
    mimeType,
    base64Payload: base64Payload.replace(/\s+/g, ""),
  };
}

