export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return res.status(500).json({ error: "BACKEND_URL not configured" });
  }

  const target = `${backendUrl.replace(/\/$/, "")}/${req.url.replace(/^\//, "")}`;
  const method = req.method;
  const headers = { ...req.headers, host: undefined };
  delete headers["host"];

  const body = method === "GET" || method === "HEAD" ? null : req.body;

  try {
    const response = await fetch(target, { method, headers, body });
    const data = await response.json().catch(() => response.text());
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Backend unreachable", details: err.message });
  }
}
