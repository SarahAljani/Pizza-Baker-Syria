// All dashboard persistence goes through /api/content, a tiny serverless
// function backed by Vercel Blob storage — see api/content.js. There's no
// database: three JSON files (menu, extras, translations) are read/written
// wholesale. Reads are public; writes require the session token from login.
import { DEFAULT_MENU, DEFAULT_EXTRAS, DEFAULT_SETTINGS } from "../data";
import { DEFAULT_TRANSLATIONS } from "../translations";
import { getSessionToken } from "./useDashboardAuth";

async function apiGetAll() {
  const res = await fetch("/api/content");
  if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
  return res.json(); // { menu, extras, translations, settings }
}

async function apiPut(key, value) {
  const token = getSessionToken();
  const res = await fetch(`/api/content?key=${key}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(value),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Your session expired — please log in again.");
    throw new Error(`Failed to save (${res.status})`);
  }
}

async function apiDelete(key) {
  const token = getSessionToken();
  const res = await fetch(`/api/content?key=${key}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Your session expired — please log in again.");
    throw new Error(`Failed to reset (${res.status})`);
  }
}

// One network round trip per tab load: returns everything a tab could need.
// { menu, extras, translationOverrides } — each already falls back to the
// site's built-in defaults if nothing has been saved yet.
export async function loadAllContent() {
  const { menu, extras, translations, settings } = await apiGetAll();
  return {
    menu: Array.isArray(menu) && menu.length ? menu : structuredClone(DEFAULT_MENU),
    extras:
      extras && Array.isArray(extras.snacks) && Array.isArray(extras.desserts)
        ? extras
        : structuredClone(DEFAULT_EXTRAS),
    translationOverrides: translations && typeof translations === "object" ? translations : { en: {}, ar: {} },
    settings: mergeSettingsWithDefaults(settings),
  };
}

function mergeSettingsWithDefaults(settings) {
  const merged = structuredClone(DEFAULT_SETTINGS);
  if (settings?.socialLinks) Object.assign(merged.socialLinks, settings.socialLinks);
  if (typeof settings?.whatsappNumber === "string" && settings.whatsappNumber) {
    merged.whatsappNumber = settings.whatsappNumber;
  }
  if (settings?.sectionVisibility) Object.assign(merged.sectionVisibility, settings.sectionVisibility);
  if (settings?.seo?.en) Object.assign(merged.seo.en, settings.seo.en);
  if (settings?.seo?.ar) Object.assign(merged.seo.ar, settings.seo.ar);
  if (typeof settings?.seo?.ogImage === "string" && settings.seo.ogImage) {
    merged.seo.ogImage = settings.seo.ogImage;
  }
  return merged;
}

export async function saveMenu(menuArray) {
  await apiPut("menu", menuArray);
}

export async function saveExtras(extrasObj) {
  await apiPut("extras", extrasObj);
}

export async function saveTranslationOverrides(overrides) {
  await apiPut("translations", overrides);
}

export async function saveSettings(settingsObj) {
  await apiPut("settings", settingsObj);
}

// Pure helpers for reading effective (override-aware) text out of an
// already-loaded translationOverrides object — no network calls, so tabs can
// call these once per field without adding requests.
export function getEffectiveText(translationOverrides, lang, key) {
  if (translationOverrides[lang]?.[key] !== undefined) {
    return translationOverrides[lang][key];
  }
  return DEFAULT_TRANSLATIONS[lang]?.[key] ?? "";
}

export function getEffectivePizzaText(translationOverrides, lang, pizzaId, field) {
  const override = translationOverrides[lang]?.pizzas?.[pizzaId]?.[field];
  if (override !== undefined) return override;
  return DEFAULT_TRANSLATIONS[lang]?.pizzas?.[pizzaId]?.[field] ?? "";
}

// Pure helpers that merge a patch into an already-loaded overrides object
// (mutating and returning it), so a tab can batch many field edits into a
// single GET + single PUT on save instead of one round trip per field.
export function mergeLanguagePatch(translationOverrides, lang, patch) {
  translationOverrides[lang] = { ...(translationOverrides[lang] || {}), ...patch };
  return translationOverrides;
}

export function mergePizzaPatch(translationOverrides, lang, pizzaId, patch) {
  translationOverrides[lang] = translationOverrides[lang] || {};
  translationOverrides[lang].pizzas = translationOverrides[lang].pizzas || {};
  translationOverrides[lang].pizzas[pizzaId] = {
    ...(translationOverrides[lang].pizzas[pizzaId] || {}),
    ...patch,
  };
  return translationOverrides;
}

export function exportBackup({ menu, extras, translationOverrides, settings }) {
  return {
    exportedAt: new Date().toISOString(),
    menu,
    extras,
    translations: translationOverrides,
    settings,
  };
}

export function downloadBackup(content) {
  const backup = exportBackup(content);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pizzabaker-backup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importBackup(json) {
  if (json.menu) await apiPut("menu", json.menu);
  if (json.extras) await apiPut("extras", json.extras);
  if (json.translations) await apiPut("translations", json.translations);
  if (json.settings) await apiPut("settings", json.settings);
}

export async function resetAllDashboardData() {
  await Promise.all([
    apiDelete("menu"),
    apiDelete("extras"),
    apiDelete("translations"),
    apiDelete("settings"),
  ]);
}

// Compresses/resizes an uploaded image file client-side and returns a data
// URL, so a handful of photo uploads don't blow past reasonable payload
// sizes for the content JSON.
export function fileToCompressedDataUrl(file, maxDim = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image file"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
