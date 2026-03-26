import { BACKGROUND_MESSAGE_TYPES } from "@/shared/constants";

import { detectLinkedInProfileContext } from "./linkedin-detector";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === BACKGROUND_MESSAGE_TYPES.GET_PROFILE_CONTEXT) {
    sendResponse(detectLinkedInProfileContext());
  }
});

