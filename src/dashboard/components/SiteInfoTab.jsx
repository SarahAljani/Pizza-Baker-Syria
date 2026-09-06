import { useEffect, useState } from "react";
import { ChevronDown, Save, RotateCcw, Loader2 } from "lucide-react";
import { loadAllContent, saveSettings, uploadImageFile, migrateEmbeddedImage } from "../storage";
import { Button, Field, TextArea, SectionCard, ImagePicker, useToast } from "../ui";
import { useDashboardLanguage } from "../DashboardLanguageContext";

const SECTION_KEYS = {
  menu: "sectionMenu",
  extras: "sectionExtras",
  builder: "sectionBuilder",
  reservation: "sectionReservation",
  reviews: "sectionReviews",
};

// SEO is editable per section — "home" covers the hero section and is also
// what link-preview crawlers (WhatsApp/Facebook) see for the bare site URL.
const SEO_SECTIONS = [
  { key: "home", labelKey: "sectionHome" },
  { key: "menu", labelKey: "sectionMenu" },
  { key: "extras", labelKey: "sectionExtras" },
  { key: "builder", labelKey: "sectionBuilder" },
  { key: "reservation", labelKey: "sectionReservation" },
  { key: "reviews", labelKey: "sectionReviews" },
];

export default function SiteInfoTab() {
  const { t } = useDashboardLanguage();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [openSeoSections, setOpenSeoSections] = useState(() => new Set(["home"]));
  const toast = useToast();

  const toggleSeoSection = (key) =>
    setOpenSeoSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const load = () => {
    setLoading(true);
    setLoadError(null);
    loadAllContent()
      .then(async ({ settings: loaded }) => {
        setSettings(loaded);
        setDirty(false);
        setLoading(false);

        // One-time cleanup: settings saved before uploads went through Blob
        // storage may still have the hero/share image embedded as a base64
        // data URL — migrate it to a hosted URL and persist automatically.
        const [newHero, newOg] = await Promise.all([
          migrateEmbeddedImage(loaded.heroImage),
          migrateEmbeddedImage(loaded.seo.ogImage),
        ]);
        if (newHero !== loaded.heroImage || newOg !== loaded.seo.ogImage) {
          const migrated = {
            ...loaded,
            heroImage: newHero,
            seo: { ...loaded.seo, ogImage: newOg },
          };
          setSettings(migrated);
          try {
            await saveSettings(migrated);
            toast(t("imagesOptimized"));
          } catch (err) {
            toast(err.message || t("couldntSave"), "error");
          }
        }
      })
      .catch((err) => {
        setLoadError(err.message);
        setLoading(false);
      });
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

  const setDelivery = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, [key]: Number(value) || 0 },
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

  const setSeoSection = (sectionKey, lang, field, value) => {
    setSettings((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        sections: {
          ...prev.seo.sections,
          [sectionKey]: {
            ...prev.seo.sections[sectionKey],
            [lang]: { ...prev.seo.sections[sectionKey][lang], [field]: value },
          },
        },
      },
    }));
    setDirty(true);
  };

  const setOgImage = (value) => {
    setSettings((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: value } }));
    setDirty(true);
  };

  const handleOgImageFile = async (file) => {
    setUploadingOg(true);
    try {
      const url = await uploadImageFile(file, 1200, 0.8);
      setOgImage(url);
    } catch (err) {
      toast(err.message || t("couldntReadImage"), "error");
    } finally {
      setUploadingOg(false);
    }
  };

  const setHeroImage = (value) => {
    set({ heroImage: value });
  };

  const handleHeroImageFile = async (file) => {
    setUploadingHero(true);
    try {
      const url = await uploadImageFile(file, 1600, 0.8);
      setHeroImage(url);
    } catch (err) {
      toast(err.message || t("couldntReadImage"), "error");
    } finally {
      setUploadingHero(false);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await saveSettings(settings);
      setDirty(false);
      toast(t("siteInfoSaved"));
    } catch (err) {
      toast(err.message || t("couldntSave"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard title={t("siteInfoTitle")} subtitle={t("loading")}>
        <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> {t("loading")}
        </div>
      </SectionCard>
    );
  }

  if (loadError) {
    return (
      <SectionCard title={t("siteInfoTitle")} subtitle={t("couldntLoad")}>
        <div className="text-center py-16">
          <p className="text-red-400 text-sm mb-4">{loadError}</p>
          <Button onClick={load}>
            <RotateCcw className="w-3.5 h-3.5" /> {t("retry")}
          </Button>
        </div>
      </SectionCard>
    );
  }

  const actions = (
    <>
      {dirty && (
        <Button variant="ghost" onClick={load} disabled={saving}>
          <RotateCcw className="w-3.5 h-3.5" /> {t("discard")}
        </Button>
      )}
      <Button variant={dirty ? "primary" : "secondary"} onClick={saveAll} disabled={!dirty || saving}>
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {t("saveChanges")}
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title={t("heroSectionTitle")}
        subtitle={t("heroSectionSubtitle")}
        actions={actions}
      >
        <ImagePicker
          label={t("heroImageField")}
          value={settings.heroImage}
          onChange={setHeroImage}
          onFile={handleHeroImageFile}
          loading={uploadingHero}
        />
      </SectionCard>

      <SectionCard
        title={t("contactSocialTitle")}
        subtitle={t("contactSocialSubtitle")}
        actions={actions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t("whatsappNumberLabel")}
            hint={t("whatsappNumberHint")}
            value={settings.whatsappNumber}
            onChange={(e) => set({ whatsappNumber: e.target.value.replace(/[^0-9]/g, "") })}
          />
          <Field
            label={t("facebookUrl")}
            value={settings.socialLinks.facebook}
            onChange={(e) => setSocial("facebook", e.target.value)}
          />
          <Field
            label={t("instagramUrl")}
            value={settings.socialLinks.instagram}
            onChange={(e) => setSocial("instagram", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title={t("deliveryTitle")}
        subtitle={t("deliverySubtitle")}
        actions={actions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t("deliveryFeeLabel")}
            hint={t("deliveryFeeHint")}
            type="number"
            min="0"
            value={settings.delivery.fee}
            onChange={(e) => setDelivery("fee", e.target.value)}
          />
          <Field
            label={t("freeThresholdLabel")}
            hint={t("freeThresholdHint")}
            type="number"
            min="0"
            value={settings.delivery.freeThreshold}
            onChange={(e) => setDelivery("freeThreshold", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title={t("sectionVisibilityTitle")}
        subtitle={t("sectionVisibilitySubtitle")}
        actions={actions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(SECTION_KEYS).map(([key, labelKey]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-3 bg-bg-primary border border-border-primary px-4 py-3 cursor-pointer"
            >
              <span className="text-sm text-text-primary">{t(labelKey)}</span>
              <input
                type="checkbox"
                checked={settings.sectionVisibility[key]}
                onChange={(e) => setVisibility(key, e.target.checked)}
                className="accent-brand-gold w-4 h-4"
              />
            </label>
          ))}
        </div>
        <p className="text-[10px] text-text-tertiary mt-3">{t("sectionVisibilityNote")}</p>
      </SectionCard>

      <SectionCard
        title={t("perSectionSeoTitle")}
        subtitle={t("perSectionSeoSubtitle")}
        actions={actions}
      >
        <div className="mb-5">
          <ImagePicker
            label={t("shareImageLabel")}
            value={settings.seo.ogImage}
            onChange={setOgImage}
            onFile={handleOgImageFile}
            loading={uploadingOg}
          />
          <p className="text-[10px] text-text-tertiary mt-2">{t("shareImageHint")}</p>
        </div>

        <div className="space-y-3">
          {SEO_SECTIONS.map(({ key, labelKey }) => {
            const isOpen = openSeoSections.has(key);
            const section = settings.seo.sections[key];
            return (
              <div key={key} className="border border-border-primary">
                <button
                  type="button"
                  onClick={() => toggleSeoSection(key)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-bg-primary hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base text-text-primary uppercase tracking-wide">
                    {t(labelKey)}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-gold transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label={t("titleEn")}
                      value={section.en.title}
                      onChange={(e) => setSeoSection(key, "en", "title", e.target.value)}
                    />
                    <Field
                      label={t("titleAr")}
                      dir="rtl"
                      value={section.ar.title}
                      onChange={(e) => setSeoSection(key, "ar", "title", e.target.value)}
                    />
                    <TextArea
                      label={t("descriptionEn")}
                      rows={3}
                      value={section.en.description}
                      onChange={(e) => setSeoSection(key, "en", "description", e.target.value)}
                    />
                    <TextArea
                      label={t("descriptionAr")}
                      dir="rtl"
                      rows={3}
                      value={section.ar.description}
                      onChange={(e) => setSeoSection(key, "ar", "description", e.target.value)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
