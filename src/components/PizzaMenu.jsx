import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Check, Flame, User, Users, Search } from "lucide-react";
import { INITIAL_MENU } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function PizzaMenu({ onAddToCart, cart }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState({}); // { [pizzaId]: 'small' | 'medium' | 'large' }
  const [addedAlert, setAddedAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, isRtl, language } = useThemeLanguage();

  // Categories mapper
  const categories = [
    { id: "all", label: t("allRecipes").toUpperCase() },
    { id: "classic", label: t("classic").toUpperCase() },
    { id: "meat", label: t("meat").toUpperCase() },
    { id: "chicken", label: t("chicken").toUpperCase() },
    { id: "spicy", label: t("spicy").toUpperCase() },
    { id: "vegetarian", label: t("vegetarian").toUpperCase() },
  ];

  const handleAddClick = (pizza, size) => {
    onAddToCart(pizza, size);
    setAddedAlert(pizza.id);
    setTimeout(() => setAddedAlert(null), 2000);
  };

  const getPizzaSize = (pizzaId) => {
    return selectedSizes[pizzaId] || "medium"; // Default to medium size
  };

  const setPizzaSize = (pizzaId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [pizzaId]: size }));
  };

  const getQuantityInCart = (pizzaId, size) => {
    const item = cart.find((c) => c.id === pizzaId && c.size === size);
    return item ? item.quantity : 0;
  };

  // Filter menu items based on chosen tab & search query
  const filteredMenu = INITIAL_MENU.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory,
  ).filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const numStr = item.number.toString();
    const nativeName = item.name.toLowerCase();
    const translatedName = t(`pizzas.${item.id}.name`).toLowerCase();
    const translatedDesc = t(`pizzas.${item.id}.desc`).toLowerCase();

    return (
      numStr.includes(q) ||
      nativeName.includes(q) ||
      translatedName.includes(q) ||
      translatedDesc.includes(q)
    );
  });

  return (
    <section
      id="menu"
      className="relative bg-bg-primary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      {/* Decorative background sketch */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] text-text-primary">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="pizza-pattern-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10,10 C 20,20 40,0 50,15 C 60,30 30,50 40,65 C 50,80 80,60 90,75 C 100,90 70,110 80,120"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="25"
              cy="85"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="75"
              cy="35"
              r="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pizza-pattern-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {t("menuPreTitle")}
          </p>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-[1px] w-8 sm:w-16 bg-brand-gold/40" />
            <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase">
              ✦ {t("menuTitle")} ✦
            </h2>
            <div className="h-[1px] w-8 sm:w-16 bg-brand-gold/40" />
          </div>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-xl mx-auto leading-relaxed uppercase">
            {t("menuDesc")}
          </p>

          {/* Size Rule guidelines card */}
          <div className="mt-8 inline-grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 bg-bg-secondary border border-border-primary p-4 sm:p-6 text-left max-w-2xl mx-auto transition-all">
            <div className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold mt-1" />
              <div>
                <span className="block font-mono text-[10px] text-text-secondary font-bold uppercase">
                  {isRtl ? "حجم صغير (٢٠ سم)" : "SMALL SIZE (20CM)"}
                </span>
                <span className="block font-serif text-xs text-text-primary italic">
                  {isRtl ? "وجبة سخية لشخص واحد" : "Generous 1 Person meal"}
                </span>
              </div>
            </div>
            <div
              className={`flex items-start gap-2.5 border-t sm:border-t-0 border-border-primary pt-3 sm:pt-0 ${isRtl ? "sm:border-r sm:pr-6 sm:border-l-0" : "sm:border-l sm:pl-6"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brand-soft-yellow mt-1" />
              <div>
                <span className="block font-mono text-[10px] text-text-secondary font-bold uppercase">
                  {isRtl ? "حجم وسط (٣٠ سم)" : "MEDIUM SIZE (30CM)"}
                </span>
                <span className="block font-serif text-xs text-text-primary italic">
                  {isRtl
                    ? "مثالية لشخص إلى شخصين"
                    : "Perfect for 1 to 2 Persons"}
                </span>
              </div>
            </div>
            <div
              className={`flex items-start gap-2.5 border-t sm:border-t-0 border-border-primary pt-3 sm:pt-0 ${isRtl ? "sm:border-r sm:pr-6 sm:border-l-0" : "sm:border-l sm:pl-6"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brand-brown mt-1" />
              <div>
                <span className="block font-mono text-[10px] text-text-secondary font-bold uppercase">
                  {isRtl ? "حجم كبير (٤٠ سم)" : "LARGE SIZE (40CM)"}
                </span>
                <span className="block font-serif text-xs text-text-primary italic">
                  {isRtl
                    ? "مثالية لشخصين إلى ٣ أشخاص"
                    : "Ideal for 2 to 3 Persons"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bilingual Search Input */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search
            className={`absolute ${isRtl ? "right-4" : "left-4"} top-3.5 w-4.5 h-4.5 text-brand-gold`}
          />
          <input
            type="text"
            id="input-menu-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className={`w-full bg-bg-secondary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3 ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-sm text-text-primary focus:outline-none placeholder-text-tertiary transition-colors rounded-none`}
          />
        </div>

        {/* Category filtering navigation tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16 border-b border-border-primary pb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`btn-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 font-mono text-[10px] font-bold tracking-widest transition-all cursor-pointer rounded-none border ${
                selectedCategory === cat.id
                  ? "bg-brand-gold border-brand-gold text-black font-extrabold"
                  : "bg-transparent border-border-primary text-text-secondary hover:text-text-primary hover:border-white/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pizza recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((pizza) => {
              const currentSize = getPizzaSize(pizza.id);
              const currentPrice =
                currentSize === "small"
                  ? pizza.prices.small
                  : currentSize === "medium"
                    ? pizza.prices.medium
                    : currentSize === "large"
                      ? pizza.prices.large
                      : pizza.prices.thin;

              const quantityInCart = getQuantityInCart(pizza.id, currentSize);

              return (
                <motion.div
                  layout
                  key={pizza.id}
                  id={`pizza-card-${pizza.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-bg-secondary border border-border-primary flex flex-col justify-between hover:border-brand-gold/20 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Pizza card badge header */}
                  <div
                    className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-brand-burgundy text-white font-mono text-[9px] font-black px-2 py-0.5 tracking-wider uppercase z-20 shadow-md`}
                  >
                    {isRtl ? `رقم ${pizza.number}` : `Nr ${pizza.number}`}
                  </div>

                  {/* Pizza visual illustration */}
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img
                      src={pizza.image}
                      alt={t(`pizzas.${pizza.id}.name`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
                  </div>

                  {/* Pizza Info Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-xl text-text-primary font-medium group-hover:text-brand-soft-yellow transition-colors duration-300 uppercase">
                          {t(`pizzas.${pizza.id}.name`)}
                        </h3>
                        {pizza.category === "spicy" && (
                          <Flame className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-text-secondary font-serif italic line-clamp-3 leading-relaxed">
                        {t(`pizzas.${pizza.id}.desc`)}
                      </p>

                      {/* Ingredients tags list */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pizza.ingredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="text-[8px] font-mono tracking-wider font-bold bg-bg-primary border border-border-primary text-text-secondary px-1.5 py-0.5"
                          >
                            {t(ing)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Diameter Sizes Selection */}
                    <div className="space-y-3 pt-3 border-t border-border-primary">
                      <span className="text-[9px] font-mono tracking-widest text-brand-gold block font-bold uppercase">
                        {isRtl ? "قطر البيتزا" : "DIAMETER SIZE"}
                      </span>
                      <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
                        <button
                          id={`btn-size-${pizza.id}-small`}
                          onClick={() => setPizzaSize(pizza.id, "small")}
                          className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                            currentSize === "small"
                              ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                              : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                          }`}
                        >
                          {t("small")} (20cm)
                        </button>
                        <button
                          id={`btn-size-${pizza.id}-medium`}
                          onClick={() => setPizzaSize(pizza.id, "medium")}
                          className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                            currentSize === "medium"
                              ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                              : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                          }`}
                        >
                          {t("medium")} (30cm)
                        </button>
                        <button
                          id={`btn-size-${pizza.id}-large`}
                          onClick={() => setPizzaSize(pizza.id, "large")}
                          className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                            currentSize === "large"
                              ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                              : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                          }`}
                        >
                          {t("large")} (40cm)
                        </button>
                        <button
                          id={`btn-size-${pizza.id}-thin`}
                          onClick={() => setPizzaSize(pizza.id, "thin")}
                          className={`py-1 text-[9px] font-mono tracking-tighter transition-all cursor-pointer ${
                            currentSize === "thin"
                              ? "bg-brand-burgundy border border-brand-gold text-white font-bold"
                              : "bg-transparent border border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5"
                          }`}
                        >
                          {t("thin")}
                        </button>
                      </div>

                      {/* Person Serving guidelines */}
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-secondary uppercase">
                        {currentSize === "small" ? (
                          <>
                            <User className="w-3 h-3 text-brand-gold" />
                            <span>
                              {isRtl ? "تكفي شخص واحد" : "SERVES 1 PERSON"}
                            </span>
                          </>
                        ) : currentSize === "medium" ? (
                          <>
                            <Users className="w-3 h-3 text-brand-soft-yellow" />
                            <span>
                              {isRtl
                                ? "تكفي شخص إلى شخصين"
                                : "SERVES 1 - 2 PERSONS"}
                            </span>
                          </>
                        ) : currentSize === "large" ? (
                          <>
                            <Users className="w-3 h-3 text-brand-brown" />
                            <span>
                              {isRtl
                                ? "تكفي شخصين إلى ٣ أشخاص"
                                : "SERVES 2 - 3 PERSONS"}
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-brand-gold animate-pulse" />
                            <span>
                              {isRtl
                                ? "رقيقة ومقرمشة لشخص واحد"
                                : "THIN & CRISPY FOR 1"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between border-t border-border-primary pt-4">
                      <div className="text-left leading-tight">
                        <span className="text-[8px] font-mono text-text-secondary block uppercase">
                          {isRtl ? "السعر" : "PRICE"}
                        </span>
                        <span className="text-lg font-mono font-bold text-text-primary">
                          {currentPrice}{" "}
                          <span className="text-[10px] text-brand-gold">
                            {isRtl ? "ل.س" : "SYP"}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          id={`btn-add-menu-${pizza.id}`}
                          onClick={() => handleAddClick(pizza, currentSize)}
                          className="bg-brand-gold hover:bg-yellow-500 text-black px-4 py-2 font-mono text-[10px] font-bold tracking-widest transition-all rounded-none flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          {quantityInCart > 0 ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>
                                {isRtl
                                  ? `في السلة (${quantityInCart})`
                                  : `IN CART (${quantityInCart})`}
                              </span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{t("addToBasket")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {addedAlert === pizza.id && (
                      <div className="absolute inset-x-0 bottom-0 bg-brand-burgundy py-1 text-center font-mono text-[9px] font-bold text-white tracking-widest uppercase z-10 animate-fade-in">
                        {isRtl
                          ? `تمت إضافة ${t(`pizzas.${pizza.id}.name`)} (${t(currentSize).toUpperCase()}) إلى السلة!`
                          : `Added ${t(`pizzas.${pizza.id}.name`)} (${currentSize.toUpperCase()}) to cart!`}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
