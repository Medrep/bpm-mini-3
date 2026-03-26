import { normalizeLinkedInProfileUrl } from "@my-bpm-mini/shared";

export function getLinkedInProfileUrlFromPage(pageUrl: string) {
  const parsedUrl = new URL(pageUrl);

  if (
    !/^(www\.)?linkedin\.com$/i.test(parsedUrl.hostname) ||
    !parsedUrl.pathname.startsWith("/in/")
  ) {
    return null;
  }

  return normalizeLinkedInProfileUrl(parsedUrl.toString());
}

