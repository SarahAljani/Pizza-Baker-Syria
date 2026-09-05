import { readJson, writeJson, deleteJson } from "./_lib/blobStore.js";
import { verifySessionToken, getBearerToken } from "./_lib/auth.js";

const KEYS = {
  menu: "pbdash/menu.json",
  extras: "pbdash/extras.json",
  translations: "pbdash/translations.json",
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const key = req.query?.key;

    try {
      if (key) {
        if (!KEYS[key]) return res.status(400).json({ error: "Unknown key" });
        const value = await readJson(KEYS[key]);
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({ value });
      }

      const [menu, extras, translations] = await Promise.all([
        readJson(KEYS.menu),
        readJson(KEYS.extras),
        readJson(KEYS.translations),
      ]);
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ menu, extras, translations });
    } catch (err) {
      console.error("content GET failed", err);
      return res.status(500).json({ error: "Failed to load content" });
    }
  }

  if (req.method === "PUT") {
    const token = getBearerToken(req);
    if (!verifySessionToken(token)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const key = req.query?.key;
    if (!key || !KEYS[key]) {
      return res.status(400).json({ error: "Unknown key" });
    }

    let body;
    try {
      body = req.body;
    } catch {
      return res.status(400).json({ error: "Invalid request body" });
    }
    if (body === undefined || body === null) {
      return res.status(400).json({ error: "Missing body" });
    }

    try {
      await writeJson(KEYS[key], body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("content PUT failed", err);
      return res.status(500).json({ error: "Failed to save content" });
    }
  }

  if (req.method === "DELETE") {
    const token = getBearerToken(req);
    if (!verifySessionToken(token)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const key = req.query?.key;
    if (!key || !KEYS[key]) {
      return res.status(400).json({ error: "Unknown key" });
    }

    try {
      await deleteJson(KEYS[key]);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("content DELETE failed", err);
      return res.status(500).json({ error: "Failed to reset content" });
    }
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
