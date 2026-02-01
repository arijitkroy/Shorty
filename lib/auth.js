export function validateApiKey(req, res) {
  if (req.method === "OPTIONS") return true;

  const apiKey = req.headers["x-api-key"];
  const serverKey = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY;

  if (!serverKey) {
    console.error("API_KEY is not defined in environment variables.");
    res.status(500).json({ error: "Server configuration error" });
    return false;
  }

  if (apiKey !== serverKey) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  const referer = req.headers.referer;
  const origin = req.headers.origin;
  const allowedUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const isAllowedOrigin =
    (referer && referer.startsWith(allowedUrl)) ||
    (origin && origin === allowedUrl);

  if (!isAllowedOrigin && process.env.NODE_ENV !== "development") {
      if (allowedUrl) {
          res.status(403).json({ error: "Forbidden: External access denied" });
          return false;
      }
  }

  return true;
}
