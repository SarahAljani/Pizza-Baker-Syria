import { put } from "@vercel/blob";
import { verifySessionToken, getBearerToken } from "./_lib/auth.js";

// Uploaded photos are meant to be publicly visible on the site (they're
// product photos, not private data), so they're stored as their own public
// Blob object with a real URL — never embedded as base64 inside menu.json/
// extras.json/settings.json. Embedding them there is what caused those blobs
// to grow past Vercel's ~4.5MB request body limit as more photos piled up.
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
  const filename = `pbdash/uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  try {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("upload failed", err);
    return res.status(500).json({ error: "Failed to upload image" });
  }
}
