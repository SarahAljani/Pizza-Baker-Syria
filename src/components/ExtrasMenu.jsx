import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Check } from "lucide-react";
import { EXTRAS_MENU } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

// Any item can define an arbitrary set of price sizes (e.g. { standard },
// { small, large }, { three_pcs, six_pcs }) — read them from its own prices
// object instead of assuming a fixed shape.
const getSizeKeys = (item) => Object.keys(item.prices || {});

function ExtrasColumn({ preTitleKey, titleKey, items, cart, onAdd }) {
  const { t, isRtl } = useThemeLanguage();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedAlert, setAddedAlert] = useState(null);

  const getCurrentSize = (item) => {
    const keys = getSizeKeys(item);
    return selectedSizes[item.id] || keys[0] || "standard";
  };
  const setItemSize = (itemId, size) =>
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));

  const getQuantityInCart = (itemId, size) => {
    const itemInCart = cart.find((c) => c.id === itemId && c.size === size);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const handleAddClick = (item, size) => {
    onAdd(item, size);
    setAddedAlert(item.id);
    setTimeout(() => setAddedAlert(null), 2000);
  };

  return (
    <div className="space-y-10">
      <div className="border-b border-border-primary pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest block mb-1">
            {t(preTitleKey)}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal uppercase tracking-wide">
            {t(titleKey)}
          </h3>
        </div>
        <span className="text-xs font-mono text-text-tertiary bg-white/[0.02] border border-border-primary px-3 py-1 font-bold">
          {items.length} {isRtl ? "أصناف" : "ITEMS"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {items.map((item) => {
          const sizeKeys = getSizeKeys(item);
          const hasMultipleSizes = sizeKeys.length > 1;
          const currentSize = getCurrentSize(item);
          const currentPrice = item.prices[currentSize];
          const quantityInCart = getQuantityInCart(item.id, currentSize);

          return (
            <motion.div
              key={item.id}
              className="bg-bg-primary border border-border-primary flex flex-col sm:flex-row hover:border-brand-gold/20 transition-all duration-300 relative group overflow-hidden"
              layout
            >
              {/* Badge number */}
              <div
                className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-brand-burgundy text-white font-mono text-[9px] font-black px-2 py-0.5 tracking-wider uppercase z-25 shadow-md`}
              >
                {isRtl ? `رقم ${item.number}` : `Nr ${item.number}`}
              </div>

              {/* Image */}
              <div className="relative w-full sm:w-44 h-40 overflow-hidden bg-black/40 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={t(item.translationKey)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-tertiary text-[9px] font-mono uppercase">
                    {t(item.translationKey)}
                  </div>
                )}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${isRtl ? "sm:bg-gradient-to-l" : "sm:bg-gradient-to-r"} from-bg-primary via-transparent to-transparent`}
                />
              </div>

              {/* Content body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 text-start">
                  <h4 className="font-serif text-lg text-text-primary font-medium group-hover:text-brand-soft-yellow transition-colors duration-300 uppercase">
                    {t(item.translationKey)}
                  </h4>
                  {t(`${item.translationKey}_desc`) && (
                    <p className="text-xs text-text-secondary font-serif italic leading-relaxed">
                      {t(`${item.translationKey}_desc`)}
                    </p>
                  )}
                </div>

                {/* If item defines more than one price size */}
                {hasMultipleSizes && (
                  <div className="space-y-2 pt-2 border-t border-border-primary/60 text-start">
                    <span className="text-[9px] font-mono tracking-widest text-brand-gold block font-bold uppercase">
                      {isRtl ? "الكمية والقطع" : "PORTION SIZE"}
                    </span>
                    <div
                      className="grid gap-1.5"
                      style={{
                        gridTemplateColumns: `repeat(${sizeKeys.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {sizeKeys.map((sizeKey) => (
                        <button
                          key={sizeKey}
                          onClick={() => setItemSize(item.id, sizeKey)}
                          className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                            currentSize === sizeKey
                              ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                              : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                          }`}
                        >
                          {t(sizeKey)} ({item.prices[sizeKey]} SYP)
                        </button>
                      ))}
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
                    onClick={() => handleAddClick(item, currentSize)}
                    className="bg-brand-gold hover:bg-yellow-500 text-black px-4 py-2 font-mono text-[9px] font-bold tracking-widest transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    {quantityInCart > 0 ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>
                          {isRtl ? `في السلة (${quantityInCart})` : `IN CART (${quantityInCart})`}
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
              {addedAlert === item.id && (
                <div className="absolute inset-x-0 bottom-0 bg-brand-burgundy py-1 text-center font-mono text-[8px] font-bold text-white tracking-widest uppercase z-10 animate-fade-in">
                  {isRtl
                    ? `تمت إضافة ${t(item.translationKey)} إلى السلة!`
                    : `Added ${t(item.translationKey)} to cart!`}
                </div>
              )}
            </motion.div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-text-tertiary italic text-center py-8">
            {isRtl ? "لا توجد أصناف بعد." : "Nothing here yet."}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExtrasMenu({ onAddToCart, cart }) {
  const { isRtl } = useThemeLanguage();

  const COLUMNS = [
    { key: "snacks", preTitleKey: "snacksPreTitle", titleKey: "snacks" },
    { key: "desserts", preTitleKey: "dessertsPreTitle", titleKey: "desserts" },
    { key: "sauces", preTitleKey: "saucesPreTitle", titleKey: "sauces" },
    { key: "drinks", preTitleKey: "drinksPreTitle", titleKey: "drinks" },
  ];

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
              ✦ {isRtl ? "المقبلات والصلصات والمشروبات" : "SIDES, SAUCES & DRINKS"} ✦
            </h2>
            <div className="h-[1px] w-8 sm:w-16 bg-brand-gold/40" />
          </div>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-xl mx-auto leading-relaxed uppercase">
            {isRtl
              ? "أكمل وجبتك مع تشكيلة لذيذة ومميزة من الأطباق الجانبية والحلويات والصلصات والمشروبات."
              : "COMPLETE YOUR MEAL WITH SIDES, DESSERTS, SAUCES, AND DRINKS."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 max-w-6xl mx-auto">
          {COLUMNS.map(({ key, preTitleKey, titleKey }) => (
            <ExtrasColumn
              key={key}
              preTitleKey={preTitleKey}
              titleKey={titleKey}
              items={EXTRAS_MENU[key]}
              cart={cart}
              onAdd={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
