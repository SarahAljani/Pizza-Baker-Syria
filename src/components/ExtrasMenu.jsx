import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Check, Plus, Minus, Info } from "lucide-react";
import { EXTRAS_MENU } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function ExtrasMenu({ onAddToCart, cart }) {
  const { t, isRtl, language } = useThemeLanguage();
  const [selectedDrumstickSize, setSelectedDrumstickSize] =
    useState("three_pcs"); // Default chicken drumsticks size
  const [addedAlert, setAddedAlert] = useState(null);

  const handleAddClick = (item, size) => {
    onAddToCart(item, size);
    setAddedAlert(item.id);
    setTimeout(() => setAddedAlert(null), 2000);
  };

  const getQuantityInCart = (itemId, size) => {
    const itemInCart = cart.find((c) => c.id === itemId && c.size === size);
    return itemInCart ? itemInCart.quantity : 0;
  };

  return (
    <section
      id="extras"
      className="relative bg-bg-secondary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      {/* Visual background textures */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.025] text-text-primary">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="dots-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Section Header */}
        <div className="text-center mb-20">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {isRtl ? "إضافات ومكملات لذيذة" : "DELIGHTFUL ACCOMPANIMENTS"}
          </p>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-[1px] w-8 sm:w-16 bg-brand-gold/40" />
            <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase">
              ✦ {isRtl ? "المقبلات والحلويات" : "SIDES & DESSERTS"} ✦
            </h2>
            <div className="h-[1px] w-8 sm:w-16 bg-brand-gold/40" />
          </div>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-xl mx-auto leading-relaxed uppercase">
            {isRtl
              ? "أكمل وجبتك مع تشكيلة لذيذة ومميزة من الأطباق الجانبية والحلويات الغنية بالنوتيلا الشامية."
              : "COMPLETE YOUR MEAL WITH HAND-CRAFTED SIDES AND IRRESISTIBLE SWEET TREATS."}
          </p>
        </div>

        {/* Two-Column Layout for Snacks & Desserts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 max-w-6xl mx-auto">
          {/* COLUMN 1: SNACKS SECTION */}
          <div className="space-y-10">
            <div className="border-b border-border-primary pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest block mb-1">
                  {t("snacksPreTitle")}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal uppercase tracking-wide">
                  {t("snacks")}
                </h3>
              </div>
              <span className="text-xs font-mono text-text-tertiary bg-white/[0.02] border border-border-primary px-3 py-1 font-bold">
                {EXTRAS_MENU.snacks.length} {isRtl ? "أصناف" : "ITEMS"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {EXTRAS_MENU.snacks.map((snack) => {
                const isDrumsticks = snack.id === "snack-32";
                const currentSize = isDrumsticks
                  ? selectedDrumstickSize
                  : "standard";
                const currentPrice = snack.prices[currentSize];
                const quantityInCart = getQuantityInCart(snack.id, currentSize);

                return (
                  <motion.div
                    key={snack.id}
                    className="bg-bg-primary border border-border-primary flex flex-col sm:flex-row hover:border-brand-gold/20 transition-all duration-300 relative group overflow-hidden"
                    layout
                  >
                    {/* Badge number */}
                    <div
                      className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-brand-burgundy text-white font-mono text-[9px] font-black px-2 py-0.5 tracking-wider uppercase z-25 shadow-md`}
                    >
                      {isRtl ? `رقم ${snack.number}` : `Nr ${snack.number}`}
                    </div>

                    {/* Image */}
                    <div className="relative w-full sm:w-44 h-40 overflow-hidden bg-black/40 flex-shrink-0">
                      <img
                        src={snack.image}
                        alt={t(snack.translationKey)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${isRtl ? "sm:bg-gradient-to-l" : "sm:bg-gradient-to-r"} from-bg-primary via-transparent to-transparent`}
                      />
                    </div>

                    {/* Content body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 text-start">
                        <h4 className="font-serif text-lg text-text-primary font-medium group-hover:text-brand-soft-yellow transition-colors duration-300 uppercase">
                          {t(snack.translationKey)}
                        </h4>
                        <p className="text-xs text-text-secondary font-serif italic leading-relaxed">
                          {t(`${snack.translationKey}_desc`)}
                        </p>
                      </div>

                      {/* If item has custom sizes (Chicken Drumsticks) */}
                      {isDrumsticks && (
                        <div className="space-y-2 pt-2 border-t border-border-primary/60 text-start">
                          <span className="text-[9px] font-mono tracking-widest text-brand-gold block font-bold uppercase">
                            {isRtl ? "الكمية والقطع" : "PORTION SIZE"}
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() =>
                                setSelectedDrumstickSize("three_pcs")
                              }
                              className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                                selectedDrumstickSize === "three_pcs"
                                  ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                                  : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                              }`}
                            >
                              {t("three_pcs")} (400 SYP)
                            </button>
                            <button
                              onClick={() =>
                                setSelectedDrumstickSize("six_pcs")
                              }
                              className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                                selectedDrumstickSize === "six_pcs"
                                  ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                                  : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                              }`}
                            >
                              {t("six_pcs")} (700 SYP)
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Footer containing price and CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-border-primary/60">
                        <div className="text-start leading-tight">
                          <span className="text-[8px] font-mono text-text-secondary block uppercase">
                            {isRtl ? "السعر" : "PRICE"}
                          </span>
                          <span className="text-base font-mono font-bold text-text-primary">
                            {currentPrice}{" "}
                            <span className="text-[9px] text-brand-gold">
                              {isRtl ? "ل.س" : "SYP"}
                            </span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddClick(snack, currentSize)}
                          className="bg-brand-gold hover:bg-yellow-500 text-black px-4 py-2 font-mono text-[9px] font-bold tracking-widest transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          {quantityInCart > 0 ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>
                                {isRtl
                                  ? `في السلة (${quantityInCart})`
                                  : `IN CART (${quantityInCart})`}
                              </span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3" />
                              <span>{t("addToBasket")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Added Toast Overlay */}
                    {addedAlert === snack.id && (
                      <div className="absolute inset-x-0 bottom-0 bg-brand-burgundy py-1 text-center font-mono text-[8px] font-bold text-white tracking-widest uppercase z-10 animate-fade-in">
                        {isRtl
                          ? `تمت إضافة ${t(snack.translationKey)} إلى السلة!`
                          : `Added ${t(snack.translationKey)} to cart!`}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: DESSERTS SECTION */}
          <div className="space-y-10">
            <div className="border-b border-border-primary pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest block mb-1">
                  {t("dessertsPreTitle")}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal uppercase tracking-wide">
                  {t("desserts")}
                </h3>
              </div>
              <span className="text-xs font-mono text-text-tertiary bg-white/[0.02] border border-border-primary px-3 py-1 font-bold">
                {EXTRAS_MENU.desserts.length} {isRtl ? "أصناف" : "ITEMS"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {EXTRAS_MENU.desserts.map((dessert) => {
                const currentSize = "standard";
                const currentPrice = dessert.prices[currentSize];
                const quantityInCart = getQuantityInCart(
                  dessert.id,
                  currentSize,
                );

                return (
                  <motion.div
                    key={dessert.id}
                    className="bg-bg-primary border border-border-primary flex flex-col sm:flex-row hover:border-brand-gold/20 transition-all duration-300 relative group overflow-hidden"
                    layout
                  >
                    {/* Badge number */}
                    <div
                      className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-brand-burgundy text-white font-mono text-[9px] font-black px-2 py-0.5 tracking-wider uppercase z-25 shadow-md`}
                    >
                      {isRtl ? `رقم ${dessert.number}` : `Nr ${dessert.number}`}
                    </div>

                    {/* Image */}
                    <div className="relative w-full sm:w-44 h-40 overflow-hidden bg-black/40 flex-shrink-0">
                      <img
                        src={dessert.image}
                        alt={t(dessert.translationKey)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${isRtl ? "sm:bg-gradient-to-l" : "sm:bg-gradient-to-r"} from-bg-primary via-transparent to-transparent`}
                      />
                    </div>

                    {/* Content body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 text-start">
                        <h4 className="font-serif text-lg text-text-primary font-medium group-hover:text-brand-soft-yellow transition-colors duration-300 uppercase">
                          {t(dessert.translationKey)}
                        </h4>
                        <p className="text-xs text-text-secondary font-serif italic leading-relaxed">
                          {t(`${dessert.translationKey}_desc`)}
                        </p>
                      </div>

                      {/* Footer containing price and CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-border-primary/60">
                        <div className="text-start leading-tight">
                          <span className="text-[8px] font-mono text-text-secondary block uppercase">
                            {isRtl ? "السعر" : "PRICE"}
                          </span>
                          <span className="text-base font-mono font-bold text-text-primary">
                            {currentPrice}{" "}
                            <span className="text-[9px] text-brand-gold">
                              {isRtl ? "ل.س" : "SYP"}
                            </span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddClick(dessert, currentSize)}
                          className="bg-brand-gold hover:bg-yellow-500 text-black px-4 py-2 font-mono text-[9px] font-bold tracking-widest transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          {quantityInCart > 0 ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>
                                {isRtl
                                  ? `في السلة (${quantityInCart})`
                                  : `IN CART (${quantityInCart})`}
                              </span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3" />
                              <span>{t("addToBasket")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Added Toast Overlay */}
                    {addedAlert === dessert.id && (
                      <div className="absolute inset-x-0 bottom-0 bg-brand-burgundy py-1 text-center font-mono text-[8px] font-bold text-white tracking-widest uppercase z-10 animate-fade-in">
                        {isRtl
                          ? `تمت إضافة ${t(dessert.translationKey)} إلى السلة!`
                          : `Added ${t(dessert.translationKey)} to cart!`}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
