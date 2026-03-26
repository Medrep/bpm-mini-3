const LINKEDIN_HOSTS = new Set(["linkedin.com", "www.linkedin.com"]);

export function normalizeLinkedInProfileUrl(
  input: string | null | undefined,
): string | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, "");

    if (LINKEDIN_HOSTS.has(hostname)) {
      return `https://${hostname}${pathname}`;
    }

    return `https://${hostname}${pathname}`;
  } catch {
    return trimmed.replace(/[?#].*$/, "").replace(/\/+$/, "") || null;
  }
}

