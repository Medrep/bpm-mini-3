import { getVisibleProfileCaptureBounds } from "./screenshot";
import { getLinkedInProfileUrlFromPage } from "./url";
import type { LinkedInProfileContext } from "@/shared/types";

export function detectLinkedInProfileContext(): LinkedInProfileContext {
  const linkedinProfileUrl = getLinkedInProfileUrlFromPage(window.location.href);

  if (!linkedinProfileUrl) {
    return {
      isProfile: false,
      linkedinProfileUrl: null,
      captureBounds: null,
    };
  }

  return {
    isProfile: true,
    linkedinProfileUrl,
    captureBounds: getVisibleProfileCaptureBounds(),
  };
}

