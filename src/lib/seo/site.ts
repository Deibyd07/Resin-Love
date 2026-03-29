const FALLBACK_SITE_URL = "https://resinlove.co";

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return FALLBACK_SITE_URL;
  }

  try {
    return new URL(siteUrl).toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}
