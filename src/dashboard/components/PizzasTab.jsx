import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, RotateCcw, Search, Loader2 } from "lucide-react";
import {
  loadAllContent,
  saveMenu,
  saveTranslationOverrides,
  getEffectivePizzaText,
  mergePizzaPatch,
  fileToCompressedDataUrl as compressImage,
} from "../storage";
import {
  Button,
  Field,
  TextArea,
  Select,
  Modal,
  ConfirmDialog,
  SectionCard,
  ImagePicker,
  useToast,
} from "../ui";
import { useDashboardLanguage } from "../DashboardLanguageContext";

const CATEGORIES = [
  { value: "classic", labelKey: "categoryClassic" },
  { value: "specialty", labelKey: "categorySpecialty" },
  { value: "chicken", labelKey: "categoryChicken" },
  { value: "meat", labelKey: "categoryMeat" },
  { value: "spicy", labelKey: "categorySpicy" },
  { value: "vegetarian", labelKey: "categoryVegetarian" },
];

const SIZES = [
  { value: "small", labelKey: "sizeSmall" },
  { value: "medium", labelKey: "sizeMedium" },
  { value: "large", labelKey: "sizeLarge" },
  { value: "thin", labelKey: "sizeThin" },
];

function buildEditModel(pizza, translationOverrides) {
  return {
    id: pizza.id,
    number: pizza.number,
    category: pizza.category,
    image: pizza.image,
    hoverImage: pizza.hoverImage || "",
    ingredients: (pizza.ingredients || []).join(", "),
    prices: { ...pizza.prices },
    nameEn: getEffectivePizzaText(translationOverrides, "en", pizza.id, "name") || pizza.name,
    nameAr: getEffectivePizzaText(translationOverrides, "ar", pizza.id, "name") || pizza.name,
    descEn:
      getEffectivePizzaText(translationOverrides, "en", pizza.id, "desc") || pizza.description,
    descAr:
      getEffectivePizzaText(translationOverrides, "ar", pizza.id, "desc") || pizza.description,
  };
}

function emptyPizza(nextNumber) {
  return {
    id: `pizza-${Date.now()}`,
    number: nextNumber,
    category: "classic",
    image: "",
    hoverImage: "",
    ingredients: "",
    prices: { small: 0, medium: 0, large: 0, thin: 0 },
    nameEn: "",
    nameAr: "",
    descEn: "",
    descAr: "",
  };
}

export default function PizzasTab() {
  const { t } = useDashboardLanguage();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [translationOverrides, setTranslationOverrides] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const load = () => {
    setLoading(true);
    setLoadError(null);
    loadAllContent()
      .then(({ menu, translationOverrides: overrides }) => {
        setTranslationOverrides(overrides);
        setPizzas(menu.map((p) => buildEditModel(p, overrides)));
        setDirty(false);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = pizzas.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.nameEn.toLowerCase().includes(q) ||
      String(p.number).includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    const nextNumber = Math.max(0, ...pizzas.map((p) => Number(p.number) || 0)) + 1;
    setEditing(emptyPizza(nextNumber));
    setIsNew(true);
  };

  const openEdit = (pizza) => {
    setEditing({ ...pizza, prices: { ...pizza.prices } });
    setIsNew(false);
  };

  const closeModal = () => setEditing(null);

  const commitEdit = (model) => {
    setPizzas((prev) => {
      const exists = prev.some((p) => p.id === model.id);
      if (exists) return prev.map((p) => (p.id === model.id ? model : p));
      return [...prev, model];
    });
    setDirty(true);
    setEditing(null);
  };

  const requestDelete = (pizza) => setDeleteTarget(pizza);

  const confirmDelete = () => {
    setPizzas((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDirty(true);
    setDeleteTarget(null);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const newMenu = pizzas.map((p) => ({
        id: p.id,
        number: Number(p.number) || 0,
        name: p.nameEn,
        description: p.descEn,
        ingredients: p.ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        category: p.category,
        prices: {
          small: Number(p.prices.small) || 0,
          medium: Number(p.prices.medium) || 0,
          large: Number(p.prices.large) || 0,
          thin: Number(p.prices.thin) || 0,
        },
        image: p.image,
        hoverImage: p.hoverImage,
      }));

      // Re-fetch the shared translations blob right before merging, so a
      // save here doesn't clobber edits made concurrently from another tab.
      const { translationOverrides: latest } = await loadAllContent();
      for (const p of pizzas) {
        mergePizzaPatch(latest, "en", p.id, { name: p.nameEn, desc: p.descEn });
        mergePizzaPatch(latest, "ar", p.id, { name: p.nameAr, desc: p.descAr });
      }

      await saveMenu(newMenu);
      await saveTranslationOverrides(latest);

      setTranslationOverrides(latest);
      setDirty(false);
      toast(t("pizzasSaved"));
    } catch (err) {
      toast(err.message || t("couldntSave"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SectionCard title={t("pizzasTitle")} subtitle={t("loading")}>
        <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> {t("loadingPizzas")}
        </div>
      </SectionCard>
    );
  }

  if (loadError) {
    return (
      <SectionCard title={t("pizzasTitle")} subtitle={t("couldntLoad")}>
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
      title={t("pizzasTitle")}
      subtitle={t("pizzasSubtitle", { count: pizzas.length })}
      actions={
        <>
          {dirty && (
            <Button variant="ghost" onClick={load} disabled={saving}>
              <RotateCcw className="w-3.5 h-3.5" /> {t("discard")}
            </Button>
          )}
          <Button
            variant={dirty ? "primary" : "secondary"}
            onClick={saveAll}
            disabled={!dirty || saving}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {t("saveChanges")}
          </Button>
          <Button onClick={openAdd} disabled={saving}>
            <Plus className="w-3.5 h-3.5" /> {t("addPizza")}
          </Button>
        </>
      }
    >
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-3 w-4 h-4 text-brand-gold" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPizzasPlaceholder")}
          className="w-full bg-bg-primary border border-border-primary focus:border-brand-gold text-text-primary text-sm pl-9 pr-3 py-2.5 focus:outline-none placeholder-text-tertiary rounded-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-primary">
              <th className="py-2 pr-3">{t("colNumber")}</th>
              <th className="py-2 pr-3">{t("colImage")}</th>
              <th className="py-2 pr-3">{t("colName")}</th>
              <th className="py-2 pr-3">{t("colCategory")}</th>
              <th className="py-2 pr-3">{t("colMediumPrice")}</th>
              <th className="py-2 pr-3 text-right">{t("colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border-primary/60 hover:bg-white/[0.02]"
              >
                <td className="py-2.5 pr-3 font-mono text-text-secondary">
                  {p.number}
                </td>
                <td className="py-2.5 pr-3">
                  <div className="w-10 h-10 bg-bg-primary border border-border-primary overflow-hidden">
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-text-primary font-medium">
                  {p.nameEn || <span className="text-text-tertiary italic">{t("untitled")}</span>}
                </td>
                <td className="py-2.5 pr-3 text-text-secondary capitalize">
                  {p.category}
                </td>
                <td className="py-2.5 pr-3 font-mono text-text-primary">
                  {p.prices.medium} SYP
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-text-secondary hover:text-brand-gold transition-colors cursor-pointer"
                      aria-label={t("edit")}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => requestDelete(p)}
                      className="p-1.5 text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
                      aria-label={t("delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-text-tertiary text-sm">
                  {t("noPizzasMatch")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <PizzaFormModal
          model={editing}
          isNew={isNew}
          onClose={closeModal}
          onSave={commitEdit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t("deletePizzaTitle")}
          message={t("deletePizzaMessage", {
            name: deleteTarget.nameEn || t("thisPizza"),
          })}
          confirmLabel={t("delete")}
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </SectionCard>
  );
}

function PizzaFormModal({ model, isNew, onClose, onSave }) {
  const { t } = useDashboardLanguage();
  const [form, setForm] = useState(model);
  const toast = useToast();

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const setPrice = (size, value) =>
    setForm((prev) => ({ ...prev, prices: { ...prev.prices, [size]: value } }));

  const handleFile = async (file) => {
    try {
      const dataUrl = await compressImage(file);
      set({ image: dataUrl });
    } catch {
      toast(t("couldntReadImage"), "error");
    }
  };

  const handleHoverFile = async (file) => {
    try {
      const dataUrl = await compressImage(file);
      set({ hoverImage: dataUrl });
    } catch {
      toast(t("couldntReadImage"), "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nameEn.trim()) {
      toast(t("nameEnRequired"), "error");
      return;
    }
    onSave(form);
  };

  return (
    <Modal title={isNew ? t("addPizzaModalTitle") : t("editPizzaModalTitle")} onClose={onClose} wide>
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field
            label={t("menuNumber")}
            type="number"
            value={form.number}
            onChange={(e) => set({ number: e.target.value })}
          />
          <Select
            label={t("category")}
            value={form.category}
            onChange={(e) => set({ category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {t(c.labelKey)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-widest text-brand-gold font-bold uppercase mb-1.5">
            {t("pricesLabel")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SIZES.map((size) => (
              <Field
                key={size.value}
                label={t(size.labelKey)}
                type="number"
                value={form.prices[size.value]}
                onChange={(e) => setPrice(size.value, e.target.value)}
              />
            ))}
          </div>
        </div>

        <Field
          label={t("ingredientsLabel")}
          hint={t("ingredientsHint")}
          value={form.ingredients}
          onChange={(e) => set({ ingredients: e.target.value })}
        />

        <ImagePicker
          label={t("mainImage")}
          value={form.image}
          onChange={(url) => set({ image: url })}
          onFile={handleFile}
        />

        <ImagePicker
          label={t("hoverImage")}
          value={form.hoverImage}
          onChange={(url) => set({ hoverImage: url })}
          onFile={handleHoverFile}
        />
        <p className="text-[10px] text-text-tertiary -mt-3">{t("hoverImageHint")}</p>

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
