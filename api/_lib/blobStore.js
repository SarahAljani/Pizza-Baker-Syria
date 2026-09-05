import { get, put, del } from "@vercel/blob";

// Reads a JSON blob by its fixed pathname. Returns null if it has never been
// saved yet (first run) or its content is somehow corrupt.
export async function readJson(pathname) {
  const blob = await get(pathname, { access: "public", useCache: false });
  if (!blob) return null;
  const text = await new Response(blob.stream).text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Overwrites the JSON blob at a fixed pathname. allowOverwrite is required
// since every save reuses the same pathname rather than creating a new blob.
export async function writeJson(pathname, value) {
  await put(pathname, JSON.stringify(value), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

// Deletes a JSON blob, restoring the site to its built-in defaults for that
// key (readJson returns null for a missing blob, and every caller already
// falls back to defaults in that case). A no-op if it never existed.
export async function deleteJson(pathname) {
  try {
    await del(pathname);
  } catch {
    // Already gone or never existed — nothing to do.
  }
}
