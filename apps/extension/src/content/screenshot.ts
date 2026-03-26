import type { ProfileCaptureBounds } from "@/shared/types";

const PROFILE_SECTION_SELECTORS = [
  "main .pv-top-card",
  "main .ph5.pb5",
  "main section.artdeco-card",
  "main [data-view-name='profile-topcard']",
];

function rectFromElement(element: Element | null) {
  if (!(element instanceof HTMLElement)) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width < 240 || rect.height < 120) {
    return null;
  }

  return rect;
}

function getFallbackBounds(): ProfileCaptureBounds {
  const horizontalPadding = 24;
  const width = Math.max(320, window.innerWidth - horizontalPadding * 2);
  const height = Math.min(Math.round(window.innerHeight * 0.5), 620);

  return {
    x: horizontalPadding,
    y: 12,
    width,
    height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

export function getVisibleProfileCaptureBounds(): ProfileCaptureBounds {
  for (const selector of PROFILE_SECTION_SELECTORS) {
    const rect = rectFromElement(document.querySelector(selector));

    if (!rect) {
      continue;
    }

    const x = Math.max(16, rect.left - 8);
    const y = Math.max(0, rect.top - 12);
    const width = Math.min(window.innerWidth - x - 16, rect.width + 16);
    const height = Math.min(
      window.innerHeight - y - 12,
      Math.max(240, Math.min(rect.height + 24, window.innerHeight * 0.6)),
    );

    return {
      x,
      y,
      width,
      height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  }

  return getFallbackBounds();
}

