function extractFromPath(path, prefix) {
  const normalizedPrefix = `${prefix}/`;
  const startIndex = path.indexOf(normalizedPrefix);
  if (startIndex === -1) {
    return null;
  }

  const value = path.slice(startIndex + normalizedPrefix.length).split("/")[0];
  return value && value.length >= 11 ? value.slice(0, 11) : null;
}

export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  const directIdMatch = trimmed.match(/^[a-zA-Z0-9_-]{11}$/);
  if (directIdMatch) {
    return directIdMatch[0];
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const shortId = parsed.pathname.replace("/", "").slice(0, 11);
      return shortId || null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const watchId = parsed.searchParams.get("v");
      if (watchId && watchId.length >= 11) {
        return watchId.slice(0, 11);
      }

      const liveId = extractFromPath(parsed.pathname, "live");
      if (liveId) {
        return liveId;
      }

      const shortsId = extractFromPath(parsed.pathname, "shorts");
      if (shortsId) {
        return shortsId;
      }

      const embedId = extractFromPath(parsed.pathname, "embed");
      if (embedId) {
        return embedId;
      }
    }
  } catch {
    const fallbackPatterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of fallbackPatterns) {
      const match = trimmed.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }
  }

  return null;
}

export function toYouTubeThumbnail(url) {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
