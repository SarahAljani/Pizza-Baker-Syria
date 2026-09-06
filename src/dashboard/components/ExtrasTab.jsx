import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, RotateCcw, X, Loader2 } from "lucide-react";
import {
  loadAllContent,
  saveExtras,
  saveTranslationOverrides,
  getEffectiveText,
  mergeLanguagePatch,
  uploadImageFile,
  migrateEmbeddedImage,
} from "../storage";
import {
  Button,
  Field,
  TextArea,
  Modal,
  ConfirmDialog,
  SectionCard,
  ImagePicker,
  useToast,
} from "../ui";
import { useDashboardLanguage } from "../DashboardLanguageContext";

// Snacks/desserts/sauces/drinks all share the exact same data shape and
// CRUD UI — this list is what drives the generic rendering below instead of
// hand-duplicating a block of JSX per category.
const CATEGORIES = [
  { key: "snacks", titleKey: "snacksTitle", addModalKey: "addSnackModalTitle" },
  { key: "desserts", titleKey: "dessertsTitle", addModalKey: "addDessertModalTitle" },
  { key: "sauces", titleKey: "saucesTitle", addModalKey: "addSauceModalTitle" },
  { key: "drinks", titleKey: "drinksTitle", addModalKey: "addDrinkModalTitle" },
];

function slugify(name) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "item"
  );
}

function buildEditModel(item, translationOverrides) {
  return {
    id: item.id,
    number: item.number,
    translationKey: item.translationKey,
    image: item.image,
    nameEn: getEffectiveText(translationOverrides, "en", item.translationKey) || item.name,
    nameAr: getEffectiveText(translationOverrides, "ar", item.translationKey) || item.arabicName,
    descEn: getEffectiveText(translationOverrides, "en", `${item.translationKey}_desc`) || "",
    descAr: getEffectiveText(translationOverrides, "ar", `${item.translationKey}_desc`) || "",
    prices: Object.entries(item.prices || {}).map(([size, price]) => ({
      size,
      price,
    })),
  };
}

function toExtraItem(item) {
  const pricesObj = {};
  for (const { size, price } of item.prices) {
    if (size) pricesObj[size] = Number(price) || 0;
  }
  return {
    id: item.id,
    number: Number(item.number) || 0,
    name: item.nameEn,
    arabicName: item.nameAr,
    translationKey: item.translationKey,
    prices: pricesObj,
    sizes: item.prices.map((p) => p.size).filter(Boolean),
    image: item.image,
  };
}

function emptyItem(category, nextNumber) {
  return {
    id: `${category}-${Date.now()}`,
    number: nextNumber,
    translationKey: "",
    image: "",
    nameEn: "",
    nameAr: "",
    descEn: "",
    descAr: "",
    prices: [{ size: "standard", price: 0 }],
  };
}

function ItemGrid({ title, items, onAdd, onEdit, onDelete }) {
  const { t } = useDashboardLanguage();
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg text-text-primary uppercase tracking-wide">
          {title}
        </h3>
        <Button onClick={onAdd}>
          <Plus className="w-3.5 h-3.5" /> {t("add")}
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-bg-primary border border-border-primary p-3"
          >
            <div className="w-12 h-12 flex-shrink-0 bg-bg-secondary border border-border-primary overflow-hidden">
              {item.image && (
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary font-medium truncate">
                {item.nameEn || <span className="italic text-text-tertiary">{t("untitled")}</span>}
              </p>
              <p className="text-[10px] font-mono text-text-secondary">
                {item.prices.map((p) => `${p.size}: ${p.price}`).join(" · ")} SYP
              </p>
            </div>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-text-secondary hover:text-brand-gold transition-colors cursor-pointer"
              aria-label={t("edit")}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-1.5 text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
              aria-label={t("delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-text-tertiary italic py-4 text-center">
            {t("noItemsYet")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExtrasTab() {
  const { t } = useDashboardLanguage();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [extras, setExtras] = useState({ snacks: [], desserts: [], sauces: [], drinks: [] });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    setLoadError(null);
    loadAllContent()
      .then(async ({ extras: rawExtras, translationOverrides: overrides }) => {
        const byCategory = {};
        for (const { key } of CATEGORIES) {
          byCategory[key] = rawExtras[key].map((i) => buildEditModel(i, overrides));
        }
        setExtras(byCategory);
        setDirty(false);
        setLoading(false);

        // One-time cleanup: items saved before uploads went through Blob
        // storage may still have images embedded as base64 data URLs —
        // that's what makes the whole extras blob too large to save.
        let migrated = false;
        for (const { key } of CATEGORIES) {
          for (const item of byCategory[key]) {
            const newImage = await migrateEmbeddedImage(item.image);
            if (newImage !== item.image) {
              item.image = newImage;
              migrated = true;
            }
          }
        }

        if (migrated) {
          const refreshed = {};
          for (const { key } of CATEGORIES) refreshed[key] = [...byCategory[key]];
          setExtras(refreshed);
          try {
            const payload = {};
            for (const { key } of CATEGORIES) payload[key] = byCategory[key].map(toExtraItem);
            await saveExtras(payload);
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

  const openAdd = (category) => {
    const allNumbers = CATEGORIES.flatMap(({ key }) =>
      extras[key].map((i) => Number(i.number) || 0),
    );
    const nextNumber = Math.max(0, ...allNumbers) + 1;
    setEditing({ category, model: emptyItem(category, nextNumber), isNew: true });
  };

  const openEdit = (category, item) => {
    setEditing({ category, model: { ...item, prices: item.prices.map((p) => ({ ...p })) }, isNew: false });
  };

  const commit = (category, model) => {
    setExtras((prev) => {
      const list = prev[category];
      const exists = list.some((i) => i.id === model.id);
      const nextList = exists
        ? list.map((i) => (i.id === model.id ? model : i))
        : [...list, model];
      return { ...prev, [category]: nextList };
    });
    setDirty(true);
    setEditing(null);
  };

  const confirmDelete = () => {
    const { category, id } = deleteTarget;
    setExtras((prev) => ({
      ...prev,
      [category]: prev[category].filter((i) => i.id !== id),
    }));
    setDirty(true);
    setDeleteTarget(null);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Re-fetch the shared translations blob right before merging, so a
      // save here doesn't clobber edits made concurrently from another tab.
      const { translationOverrides: latest } = await loadAllContent();
      const allItems = CATEGORIES.flatMap(({ key }) => extras[key]);
      for (const item of allItems) {
        mergeLanguagePatch(latest, "en", {
          [item.translationKey]: item.nameEn,
          [`${item.translationKey}_desc`]: item.descEn,
        });
        mergeLanguagePatch(latest, "ar", {
          [item.translationKey]: item.nameAr,
          [`${item.translationKey}_desc`]: item.descAr,
        });
      }

      const payload = {};
      for (const { key } of CATEGORIES) payload[key] = extras[key].map(toExtraItem);
      await saveExtras(payload);
      await saveTranslationOverrides(latest);

      setDirty(false);
      toast(t("extrasSaved"));
    } catch (err) {
      toast(err.message || t("couldntSave"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard title={t("extrasTitle")} subtitle={t("loading")}>
        <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> {t("loading")}
        </div>
      </SectionCard>
    );
  }

  if (loadError) {
    return (
      <SectionCard title={t("extrasTitle")} subtitle={t("couldntLoad")}>
        <div className="text-center py-16">
          <p className="text-red-400 text-sm mb-4">{loadError}</p>
          <Button onClick={load}>
            <RotateCcw className="w-3.5 h-3.5" /> {t("retry")}
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title={t("extrasTitle")}
      subtitle={t("extrasSubtitle")}
      actions={
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
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {CATEGORIES.map(({ key, titleKey }) => (
          <ItemGrid
            key={key}
            title={t(titleKey)}
            items={extras[key]}
            onAdd={() => openAdd(key)}
            onEdit={(item) => openEdit(key, item)}
            onDelete={(item) => setDeleteTarget({ category: key, id: item.id })}
          />
        ))}
      </div>

      {editing && (
        <ExtraFormModal
          category={editing.category}
          model={editing.model}
          isNew={editing.isNew}
          onClose={() => setEditing(null)}
          onSave={(model) => commit(editing.category, model)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t("deleteItemTitle")}
          message={t("deleteItemMessage")}
          confirmLabel={t("delete")}
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </SectionCard>
  );
}

function ExtraFormModal({ category, model, isNew, onClose, onSave }) {
  const { t } = useDashboardLanguage();
  const [form, setForm] = useState(() => ({
    ...model,
    translationKey: model.translationKey || "",
  }));
  const [uploadingImage, setUploadingImage] = useState(false);
  const toast = useToast();

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const setPriceRow = (idx, patch) =>
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    }));

  const addPriceRow = () =>
    setForm((prev) => ({ ...prev, prices: [...prev.prices, { size: "", price: 0 }] }));

  const removePriceRow = (idx) =>
    setForm((prev) => ({ ...prev, prices: prev.prices.filter((_, i) => i !== idx) }));

  const handleFile = async (file) => {
    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file);
      set({ image: url });
    } catch (err) {
      toast(err.message || t("couldntReadImage"), "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nameEn.trim()) {
      toast(t("nameEnRequired"), "error");
      return;
    }
    const key = form.translationKey.trim() || slugify(form.nameEn);
    onSave({ ...form, translationKey: key });
  };

  const modalTitle = isNew
    ? t(CATEGORIES.find((c) => c.key === category)?.addModalKey || "add")
    : t("editItemModalTitle");

  return (
    <Modal title={modalTitle} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t("nameEnglish")}
            value={form.nameEn}
            onChange={(e) => set({ nameEn: e.target.value })}
            required
          />
          <Field
            label={t("nameArabic")}
            dir="rtl"
            value={form.nameAr}
            onChange={(e) => set({ nameAr: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextArea
            label={t("descEnglish")}
            rows={2}
            value={form.descEn}
            onChange={(e) => set({ descEn: e.target.value })}
          />
          <TextArea
            label={t("descArabic")}
            dir="rtl"
            rows={2}
            value={form.descAr}
            onChange={(e) => set({ descAr: e.target.value })}
          />
        </div>

        <Field
          label={t("menuNumber")}
          type="number"
          value={form.number}
          onChange={(e) => set({ number: e.target.value })}
        />

        <div>
          <p className="text-[10px] font-mono tracking-widest text-brand-gold font-bold uppercase mb-1.5">
            {t("pricesLabel")}
          </p>
          <p className="text-[10px] text-text-tertiary mb-2">{t("pricesRowHint")}</p>
          <div className="space-y-2">
            {form.prices.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  className="flex-1 bg-bg-primary border border-border-primary focus:border-brand-gold text-text-primary text-sm px-3 py-2 focus:outline-none rounded-none"
                  placeholder={t("sizeKeyPlaceholder")}
                  value={row.size}
                  onChange={(e) => setPriceRow(idx, { size: e.target.value })}
                />
                <input
                  type="number"
                  className="w-28 bg-bg-primary border border-border-primary focus:border-brand-gold text-text-primary text-sm px-3 py-2 focus:outline-none rounded-none"
                  placeholder={t("pricePlaceholder")}
                  value={row.price}
                  onChange={(e) => setPriceRow(idx, { price: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removePriceRow(idx)}
                  className="p-2 text-text-secondary hover:text-red-400 cursor-pointer"
                  aria-label={t("removeSize")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="ghost" className="mt-2" onClick={addPriceRow}>
            <Plus className="w-3.5 h-3.5" /> {t("addSizeOption")}
          </Button>
        </div>

        <ImagePicker
          value={form.image}
          onChange={(url) => set({ image: url })}
          onFile={handleFile}
          loading={uploadingImage}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("apply")}</Button>
        </div>
      </form>
    </Modal>
  );
}
