import crypto from "crypto";

const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function sessionSecret() {
  const email = process.env.DASHBOARD_EMAIL || "";
  const password = process.env.DASHBOARD_PASSWORD || "";
  return crypto.createHash("sha256").update(`pbdash:${email}:${password}`).digest();
}

export function checkCredentials(email, password) {
  const validEmail = process.env.DASHBOARD_EMAIL;
  const validPassword = process.env.DASHBOARD_PASSWORD;
  if (!validEmail || !validPassword) return false;
  if (typeof email !== "string" || typeof password !== "string") return false;
  return (
    email.trim().toLowerCase() === validEmail.trim().toLowerCase() &&
    password === validPassword
  );
}

// A minimal signed session token: base64url(payload) + "." + HMAC signature,
// keyed off the dashboard credentials themselves so no extra secret env var
// is needed. Good enough for gating a small admin panel, not a bank vault.
export function signSessionToken() {
  const payload = { exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", sessionSecret())
    .update(payloadB64)
    .digest("base64url");
  return { token: `${payloadB64}.${sig}`, expiresAt: payload.exp };
}

export function verifySessionToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return false;
  const [payloadB64, sig] = token.split(".");
  const expectedSig = crypto
    .createHmac("sha256", sessionSecret())
    .update(payloadB64)
    .digest("base64url");

  const sigBuf = Buffer.from(sig || "");
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    return typeof payload.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

export function getBearerToken(req) {
  const header = req.headers["authorization"] || "";
  const match = /^Bearer (.+)$/.exec(header);
  return match ? match[1] : null;
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

// Best-effort brute-force throttling, scoped to one warm serverless
// instance. It resets on cold start, so treat it as a deterrent, not a
// guarantee — the credential check itself is what actually protects this.
const attempts = new Map();

export function isRateLimited(ip) {
  const rec = attempts.get(ip);
  return !!rec && rec.lockedUntil > Date.now();
}

export function recordFailedAttempt(ip) {
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, lockedUntil: 0 };
  rec.count += 1;
  if (rec.count >= 5) {
    rec.lockedUntil = now + 60_000;
    rec.count = 0;
  }
  attempts.set(ip, rec);
}

export function clearAttempts(ip) {
  attempts.delete(ip);
}
