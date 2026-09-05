import { useEffect, useState } from "react";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { loadAllContent, saveSettings, fileToCompressedDataUrl } from "../storage";
import { Button, Field, TextArea, SectionCard, ImagePicker, useToast } from "../ui";

const SECTION_LABELS = {
  menu: "Pizza Menu",
  extras: "Sides & Desserts",
  builder: "Pizza Builder",
  reservation: "Reservations",
  reviews: "Reviews",
};

export default function SiteInfoTab() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    setLoadError(null);
    loadAllContent()
      .then(({ settings: loaded }) => {
        setSettings(loaded);
        setDirty(false);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const setSocial = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
    setDirty(true);
  };

  const setVisibility = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [key]: value },
    }));
    setDirty(true);
  };

  const setSeo = (lang, key, value) => {
    setSettings((prev) => ({
      ...prev,
      seo: { ...prev.seo, [lang]: { ...prev.seo[lang], [key]: value } },
    }));
    setDirty(true);
  };

  const setOgImage = (value) => {
    setSettings((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: value } }));
    setDirty(true);
  };

  const handleOgImageFile = async (file) => {
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 1200, 0.8);
      setOgImage(dataUrl);
    } catch {
      toast("Could not read that image file.", "error");
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await saveSettings(settings);
      setDirty(false);
      toast("Site info saved — live on the site now.");
    } catch (err) {
      toast(err.message || "Couldn't save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard title="Site Info" subtitle="Loading...">
        <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </div>
      </SectionCard>
    );
  }

  if (loadError) {
    return (
      <SectionCard title="Site Info" subtitle="Couldn't load data">
        <div className="text-center py-16">
          <p className="text-red-400 text-sm mb-4">{loadError}</p>
          <Button onClick={load}>
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </Button>
        </div>
      </SectionCard>
    );
  }

  const actions = (
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
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Contact & Social"
        subtitle="WhatsApp ordering number and social media links"
        actions={actions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="WhatsApp Number"
            hint="International format, digits only, no + or spaces (e.g. 963983923768)"
            value={settings.whatsappNumber}
            onChange={(e) => set({ whatsappNumber: e.target.value.replace(/[^0-9]/g, "") })}
          />
          <Field
            label="Facebook URL"
            value={settings.socialLinks.facebook}
            onChange={(e) => setSocial("facebook", e.target.value)}
          />
          <Field
            label="Instagram URL"
            value={settings.socialLinks.instagram}
            onChange={(e) => setSocial("instagram", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Section Visibility"
        subtitle="Show or hide entire sections of the site"
        actions={actions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(SECTION_LABELS).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-3 bg-bg-primary border border-border-primary px-4 py-3 cursor-pointer"
            >
              <span className="text-sm text-text-primary">{label}</span>
              <input
                type="checkbox"
                checked={settings.sectionVisibility[key]}
                onChange={(e) => setVisibility(key, e.target.checked)}
                className="accent-brand-gold w-4 h-4"
              />
            </label>
          ))}
        </div>
        <p className="text-[10px] text-text-tertiary mt-3">
          The Home/Hero section and Footer are always shown.
        </p>
      </SectionCard>

      <SectionCard
        title="Default SEO"
        subtitle="Title and description used for search engines and link previews on the home page"
        actions={actions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Title (EN)"
            value={settings.seo.en.title}
            onChange={(e) => setSeo("en", "title", e.target.value)}
          />
          <Field
            label="Title (AR)"
            dir="rtl"
            value={settings.seo.ar.title}
            onChange={(e) => setSeo("ar", "title", e.target.value)}
          />
          <TextArea
            label="Description (EN)"
            rows={3}
            value={settings.seo.en.description}
            onChange={(e) => setSeo("en", "description", e.target.value)}
          />
          <TextArea
            label="Description (AR)"
            dir="rtl"
            rows={3}
            value={settings.seo.ar.description}
            onChange={(e) => setSeo("ar", "description", e.target.value)}
          />
        </div>

        <div className="mt-5">
          <ImagePicker
            label="Share / Social Preview Image"
            value={settings.seo.ogImage}
            onChange={setOgImage}
            onFile={handleOgImageFile}
          />
          <p className="text-[10px] text-text-tertiary mt-2">
            Shown as the thumbnail when the site link is shared. Updates
            instantly for Google. WhatsApp, Facebook, and Twitter cache link
            previews and only refresh them on the next deploy — a small delay
            for those specifically is expected.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
