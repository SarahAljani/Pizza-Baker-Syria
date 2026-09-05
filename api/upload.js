import { put } from "@vercel/blob";
import { verifySessionToken, getBearerToken } from "./_lib/auth.js";

// Uploaded photos are stored as their own Blob object instead of embedded as
// base64 inside menu.json/extras.json/settings.json — embedding them there
// is what caused those blobs to grow past Vercel's ~4.5MB request body limit
// as more photos piled up.
//
// The store backing this project is configured for private access only
// (confirmed live: access: "public" throws "Cannot use public access on a
// private store"), so every upload is private too, and the URL returned
// here points at /api/image (a public read proxy) rather than the raw,
// auth-required Blob URL — that's what actually goes into an <img src>.
const MAX_DECODED_BYTES = 4 * 1024 * 1024; // 4MB, comfortably under the limit

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = getBearerToken(req);
  if (!verifySessionToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { dataUrl } = req.body || {};
  if (typeof dataUrl !== "string") {
    return res.status(400).json({ error: "Missing dataUrl" });
  }

  const match = /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    return res.status(400).json({ error: "Unsupported image data" });
  }

  const [, mimeType, base64Data] = match;
  const buffer = Buffer.from(base64Data, "base64");

  if (buffer.byteLength > MAX_DECODED_BYTES) {
    return res.status(413).json({
      error: `Image is too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB). Please use a smaller photo.`,
    });
  }

  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg").replace(/[^a-z0-9]/gi, "") || "jpg";
  const pathname = `pbdash/uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  try {
    await put(pathname, buffer, {
      access: "private",
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return res.status(200).json({ url: `/api/image?path=${encodeURIComponent(pathname)}` });
  } catch (err) {
    console.error("upload failed", err);
    return res.status(500).json({ error: "Failed to upload image" });
  }
}
