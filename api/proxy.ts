export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return res.status(500).json({ error: "BACKEND_URL not configured" });
  }

  // Forward original request to backend
  const target = `${backendUrl.replace(/\/$/, "")}${req.url}`;
  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
        "x-forwarded-host": req.headers.host,
        "x-forwarded-proto": "https",
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });
    const data = await response.json().catch(() => response.text());
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Backend unreachable", details: err.message });
  }
}
