import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Check } from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

const SIZES = ["small", "medium", "large", "thin"];

export default function PizzaDetailModal({ pizza, onClose, onAddToCart }) {
  const { t, isRtl } = useThemeLanguage();
  const [size, setSize] = useState("medium");
  const [excluded, setExcluded] = useState(() => new Set());
  const [added, setAdded] = useState(false);

  if (!pizza) return null;

  const price = pizza.prices[size] ?? pizza.prices.medium ?? 0;

  const toggleIngredient = (ingredient) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) next.delete(ingredient);
      else next.add(ingredient);
      return next;
    });
  };

  const handleAdd = () => {
    onAddToCart(pizza, size, Array.from(excluded));
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          dir={isRtl ? "rtl" : "ltr"}
          className="relative w-full max-w-lg my-6 bg-bg-secondary border border-border-primary shadow-2xl"
        >
          {/* Image header */}
          <div className="relative h-56 overflow-hidden bg-black/40">
            <img
              src={pizza.image}
              alt={t(`pizzas.${pizza.id}.name`)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-black/40" />
            <button
              onClick={onClose}
              aria-label="Close"
              className={`absolute top-3 ${isRtl ? "left-3" : "right-3"} w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer`}
            >
              <X className="w-4 h-4" />
            </button>
            <div
              className={`absolute bottom-3 ${isRtl ? "right-3" : "left-3"} bg-brand-burgundy text-white font-mono text-[10px] font-black px-2.5 py-1 tracking-wider uppercase shadow-md`}
            >
              {isRtl ? `رقم ${pizza.number}` : `Nr ${pizza.number}`}
            </div>
          </div>

          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto custom-scroll">
            <div>
              <h3 className="font-serif text-2xl text-text-primary uppercase tracking-wide">
                {t(`pizzas.${pizza.id}.name`)}
              </h3>
              <p className="text-sm text-text-secondary font-serif italic mt-1">
                {t(`pizzas.${pizza.id}.desc`)}
              </p>
            </div>

            {/* Size selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-brand-gold block font-bold uppercase">
                {isRtl ? "حجم البيتزا" : "DIAMETER SIZE"}
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-2 text-[10px] font-mono tracking-tighter transition-all cursor-pointer ${
                      size === s
                        ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                        : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {t(s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredient checkboxes */}
            {pizza.ingredients && pizza.ingredients.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-brand-gold block font-bold uppercase">
                  {isRtl
                    ? "المكونات (ألغِ تحديد ما لا ترغب به)"
                    : "INGREDIENTS (UNCHECK WHAT YOU DON'T WANT)"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {pizza.ingredients.map((ingredient) => {
                    const isExcluded = excluded.has(ingredient);
                    return (
                      <label
                        key={ingredient}
                        className={`flex items-center gap-2 px-3 py-2 border cursor-pointer select-none transition-colors ${
                          isExcluded
                            ? "border-border-primary text-text-tertiary line-through"
                            : "border-border-primary hover:border-brand-gold/40 text-text-primary"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!isExcluded}
                          onChange={() => toggleIngredient(ingredient)}
                          className="accent-brand-gold w-3.5 h-3.5 flex-shrink-0"
                        />
                        <span className="text-xs font-sans">{t(ingredient)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer with price + add button */}
          <div className="border-t border-border-primary p-5 flex items-center justify-between gap-4 bg-bg-primary">
            <div className="text-start leading-tight">
              <span className="text-[8px] font-mono text-text-secondary block uppercase">
                {isRtl ? "السعر" : "PRICE"}
              </span>
              <span className="text-lg font-mono font-bold text-text-primary">
                {price} <span className="text-[10px] text-brand-gold">{isRtl ? "ل.س" : "SYP"}</span>
              </span>
            </div>
            <button
              onClick={handleAdd}
              className="bg-brand-gold hover:bg-yellow-500 text-black px-5 py-3 font-mono text-xs font-bold tracking-widest transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isRtl ? "أُضيف!" : "ADDED!"}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t("addToBasket")}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
