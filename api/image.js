import { get } from "@vercel/blob";

const CONTENT_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

// The Blob store backing this project is configured for private access only
// (confirmed by a live BlobError when /api/upload tried access: "public"),
// so an uploaded photo's raw Blob URL can't be used directly in an <img>
// tag — it requires the read-write token to fetch. This endpoint proxies it:
// public, unauthenticated GET in, private Blob read out. Every upload gets a
// unique, immutable filename, so this is cached aggressively and for a long
// time — one real fetch per photo, ever.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const path = req.query?.path;
  if (typeof path !== "string" || !path.startsWith("pbdash/uploads/")) {
    return res.status(400).json({ error: "Invalid path" });
  }

  try {
    const blob = await get(path, { access: "private" });
    if (!blob) {
      return res.status(404).json({ error: "Not found" });
    }

    const buffer = Buffer.from(await new Response(blob.stream).arrayBuffer());
    const extension = path.split(".").pop()?.toLowerCase();
    const contentType = blob.contentType || CONTENT_TYPES[extension] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(buffer);
  } catch (err) {
    console.error("image proxy failed", err);
    return res.status(500).json({ error: "Failed to load image" });
  }
}
