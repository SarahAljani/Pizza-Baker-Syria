import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Save, RotateCcw, Search, Loader2 } from "lucide-react";
import { CONTENT_SECTIONS } from "../contentSections";
import {
  loadAllContent,
  saveTranslationOverrides,
  getEffectiveText,
  mergeLanguagePatch,
} from "../storage";
import { Button, TextArea, Field, SectionCard, useToast } from "../ui";

function buildValues(translationOverrides) {
  const values = {};
  for (const section of CONTENT_SECTIONS) {
    for (const field of section.fields) {
      values[field.key] = {
        en: getEffectiveText(translationOverrides, "en", field.key),
        ar: getEffectiveText(translationOverrides, "ar", field.key),
      };
    }
  }
  return values;
}

export default function ContentTab() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [values, setValues] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState(() => new Set([CONTENT_SECTIONS[0].id]));
  const [query, setQuery] = useState("");
  const toast = useToast();

  const load = () => {
    setLoading(true);
    setLoadError(null);
    loadAllContent()
      .then(({ translationOverrides }) => {
        setValues(buildValues(translationOverrides));
        setDirty(false);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setText = (key, lang, text) => {
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: text } }));
    setDirty(true);
  };

  const toggleSection = (id) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filteredSections = useMemo(() => {
    if (!query.trim()) return CONTENT_SECTIONS;
    const q = query.toLowerCase();
    return CONTENT_SECTIONS.map((section) => ({
      ...section,
      fields: section.fields.filter(
        (f) =>
          f.label.toLowerCase().includes(q) ||
          f.key.toLowerCase().includes(q) ||
          (values[f.key]?.en || "").toLowerCase().includes(q),
      ),
    })).filter((section) => section.fields.length > 0);
  }, [query, values]);

  const saveAll = async () => {
    setSaving(true);
    try {
      // Re-fetch the shared translations blob right before merging, so a
      // save here doesn't clobber edits made concurrently from another tab.
      const { translationOverrides: latest } = await loadAllContent();
      const enPatch = {};
      const arPatch = {};
      for (const section of CONTENT_SECTIONS) {
        for (const field of section.fields) {
          enPatch[field.key] = values[field.key].en;
          arPatch[field.key] = values[field.key].ar;
        }
      }
      mergeLanguagePatch(latest, "en", enPatch);
      mergeLanguagePatch(latest, "ar", arPatch);
      await saveTranslationOverrides(latest);

      setDirty(false);
      toast("Page content saved — live on the site now.");
    } catch (err) {
      toast(err.message || "Couldn't save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard title="Page Content" subtitle="Loading...">
        <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading page content...
        </div>
      </SectionCard>
    );
  }

  if (loadError) {
    return (
      <SectionCard title="Page Content" subtitle="Couldn't load data">
        <div className="text-center py-16">
          <p className="text-red-400 text-sm mb-4">{loadError}</p>
          <Button onClick={load}>
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Page Content"
      subtitle="Text shown across the site, editable in English and Arabic"
      actions={
        <>
          {dirty && (
            <Button variant="ghost" onClick={load} disabled={saving}>
              <RotateCcw className="w-3.5 h-3.5" /> Discard
            </Button>
          )}
          <Button variant={dirty ? "primary" : "secondary"} onClick={saveAll} disabled={!dirty || saving}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Changes
          </Button>
        </>
      }
    >
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-3 w-4 h-4 text-brand-gold" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search page text..."
          className="w-full bg-bg-primary border border-border-primary focus:border-brand-gold text-text-primary text-sm pl-9 pr-3 py-2.5 focus:outline-none placeholder-text-tertiary rounded-none"
        />
      </div>

      <div className="space-y-3">
        {filteredSections.map((section) => {
          const isOpen = openSections.has(section.id) || !!query.trim();
          return (
            <div key={section.id} className="border border-border-primary">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-bg-primary hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <span className="font-serif text-base text-text-primary uppercase tracking-wide">
                  {section.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-brand-gold transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="p-4 space-y-4">
                  {section.fields.map((field) => {
                    const Input = field.long ? TextArea : Field;
                    return (
                      <div
                        key={field.key}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-border-primary/60 last:border-0 last:pb-0"
                      >
                        <Input
                          label={`${field.label} (EN)`}
                          value={values[field.key]?.en ?? ""}
                          onChange={(e) => setText(field.key, "en", e.target.value)}
                        />
                        <Input
                          label={`${field.label} (AR)`}
                          dir="rtl"
                          value={values[field.key]?.ar ?? ""}
                          onChange={(e) => setText(field.key, "ar", e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {filteredSections.length === 0 && (
          <p className="text-sm text-text-tertiary italic text-center py-8">
            No matching text found.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
