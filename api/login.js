import {
  checkCredentials,
  signSessionToken,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
  clientIp,
} from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.DASHBOARD_EMAIL || !process.env.DASHBOARD_PASSWORD) {
    return res.status(500).json({ error: "Dashboard is not configured" });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many attempts. Try again shortly." });
  }

  let body;
  try {
    body = req.body || {};
  } catch {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { email, password } = body;
  if (!checkCredentials(email, password)) {
    recordFailedAttempt(ip);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  clearAttempts(ip);
  const { token, expiresAt } = signSessionToken();
  return res.status(200).json({ token, expiresAt });
}
