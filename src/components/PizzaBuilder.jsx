import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  Check,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import {
  CUSTOM_TOPPINGS,
  INITIAL_MENU,
  getToppingPrice,
  getToppingWeight,
} from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

const CUSTOM_PIZZA_FILE_NAMES = {
  1: "1 The Classic Margherita.jpeg",
  2: "2 The Salami One.jpeg",
  3: "3 My Dream.jpeg",
  4: "4 Pizzabaker Special.jpeg",
  5: "5 Hawaii.jpeg",
  6: "6 Pepperoni.jpeg",
  7: "7 Mexicano.jpeg",
  8: "8 Meat Lover.jpeg",
  9: "9 The Marinated.jpeg",
  10: "10 Hot Pepper Beef.jpeg",
  11: "11 The Flame.jpeg",
  12: "12 Taco Chicken.jpeg",
  13: "13 Master Chicken.jpeg",
  14: "14 Master Favourite.jpeg",
  15: "15 Spark Baker.jpeg",
  16: "16 Chicken Deluxe.jpeg",
  17: "17 Pesto Chicken.jpeg",
  18: "18 Vegan.jpeg",
  19: "19 Kebab Pizza.jpeg",
  20: "20 Mr. Mix.jpeg",
  21: "21 Mr. X.jpeg",
  22: "22 The Double Decker.jpeg",
  23: "23 Chorizo.jpeg",
  24: "24 Hot Chicken.jpeg",
  25: "25 Chorizo.jpeg",
  26: "26.png",
  27: "27 Moby Tuna.jpeg",
  28: "28 Greek Special.jpeg",
  29: "29 Tropicana.jpeg",
  30: "30.png",
};

function PizzaBuilderImage({
  pizza,
  altText,
  className = "w-full h-full object-cover",
}) {
  const customFileName =
    CUSTOM_PIZZA_FILE_NAMES[pizza.number] ||
    `${pizza.number} ${pizza.name}.jpeg`;
  const defaultPath = `/pizza_images/${customFileName}`;
  const [attempt, setAttempt] = useState(0);

  let src = defaultPath;
  if (attempt === 1) {
    src = defaultPath.replace(/\.jpeg$/i, ".jpg");
  } else if (attempt >= 2) {
    src = pizza.image;
  }

  return (
    <img
      src={src}
      alt={altText || pizza.name}
      className={className}
      onError={() => {
        if (attempt < 2) setAttempt(attempt + 1);
      }}
    />
  );
}

export default function PizzaBuilder({ onAddCustomToCart }) {
  // State 1: Base Pizza selection (Default to Pizza #1 The Classic Margherita)
  const [selectedPizza, setSelectedPizza] = useState(INITIAL_MENU[0]);
  const [searchPizzaQuery, setSearchPizzaQuery] = useState("");
  const [pizzaCategoryFilter, setPizzaCategoryFilter] = useState("all");

  // State 2: Selected size
  const [size, setSize] = useState("medium"); // 'small' (20cm), 'medium' (30cm), 'large' (40cm), 'thin'

  // State 3: Selected extra toppings (IDs array)
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const { t, isRtl, language } = useThemeLanguage();

  // Filter base pizzas list
  const filteredPizzas = INITIAL_MENU.filter((pizza) => {
    if (
      pizzaCategoryFilter !== "all" &&
      pizza.category !== pizzaCategoryFilter
    ) {
      return false;
    }
    if (!searchPizzaQuery) return true;
    const q = searchPizzaQuery.toLowerCase();
    const numStr = pizza.number.toString();
    const nameEng = pizza.name.toLowerCase();
    const nameAr = t(`pizzas.${pizza.id}.name`).toLowerCase();
    return numStr.includes(q) || nameEng.includes(q) || nameAr.includes(q);
  });

  // Calculate pricing
  const basePrice = selectedPizza
    ? selectedPizza.prices[size] || selectedPizza.prices.medium
    : 900;

  const extraToppingsCost = selectedToppings.reduce((sum, toppingId) => {
    const topping = CUSTOM_TOPPINGS.find((t) => t.id === toppingId);
    return sum + (topping ? getToppingPrice(topping, size) : 0);
  }, 0);

  const totalPrice = basePrice + extraToppingsCost;

  // Split extra toppings into Animal vs Vegetarian
  const animalToppings = CUSTOM_TOPPINGS.filter((t) => t.type === "animal");
  const vegetarianToppings = CUSTOM_TOPPINGS.filter(
    (t) => t.type === "vegetarian",
  );

  const handleToppingToggle = (toppingId) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  const handleReset = () => {
    setSelectedToppings([]);
  };

  const handleAddToCart = () => {
    const extraToppingNames = selectedToppings
      .map((id) => {
        const tObj = CUSTOM_TOPPINGS.find((to) => to.id === id);
        if (!tObj) return "";
        const name = language === "ar" ? tObj.arabicName : t(tObj.name);
        const weight = getToppingWeight(tObj, size);
        return weight ? `${name} (${weight})` : name;
      })
      .filter(Boolean);

    const pizzaNameTranslated = t(`pizzas.${selectedPizza.id}.name`);
    const sizeLabel =
      size === "small"
        ? "20cm"
        : size === "medium"
          ? "30cm"
          : size === "large"
            ? "40cm"
            : "Thin";

    const customName =
      extraToppingNames.length > 0
        ? `${pizzaNameTranslated} (#${selectedPizza.number}) [${sizeLabel}] + ${extraToppingNames.join(", ")}`
        : `${pizzaNameTranslated} (#${selectedPizza.number}) [${sizeLabel}]`;

    onAddCustomToCart({
      name: customName,
      size,
      price: totalPrice,
      toppings: extraToppingNames,
      basePizzaId: selectedPizza.id,
      basePizzaNumber: selectedPizza.number,
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  // Helper coordinate mapping for scatter icons over pizza preview canvas
  const getToppingCoordinates = (toppingId) => {
    const map = {
      "topping-cheese": [
        { top: "35%", left: "30%", rotate: "15deg" },
        { top: "25%", left: "55%", rotate: "-10deg" },
        { top: "60%", left: "40%", rotate: "45deg" },
        { top: "50%", left: "65%", rotate: "120deg" },
      ],
      "topping-chicken": [
        { top: "25%", left: "35%", rotate: "10deg" },
        { top: "55%", left: "50%", rotate: "-30deg" },
        { top: "40%", left: "65%", rotate: "75deg" },
      ],
      "topping-nacho": [
        { top: "30%", left: "40%", rotate: "20deg" },
        { top: "60%", left: "30%", rotate: "-45deg" },
      ],
      "topping-mush": [
        { top: "28%", left: "38%", rotate: "20deg" },
        { top: "48%", left: "32%", rotate: "80deg" },
        { top: "38%", left: "58%", rotate: "-45deg" },
      ],
      "topping-pep": [
        { top: "22%", left: "25%", rotate: "45deg" },
        { top: "42%", left: "48%", rotate: "12deg" },
        { top: "30%", left: "65%", rotate: "-35deg" },
        { top: "65%", left: "35%", rotate: "70deg" },
      ],
      "topping-salami": [
        { top: "28%", left: "30%", rotate: "0deg" },
        { top: "50%", left: "55%", rotate: "30deg" },
      ],
      "topping-baconcut": [
        { top: "32%", left: "45%", rotate: "15deg" },
        { top: "58%", left: "35%", rotate: "-60deg" },
      ],
      "topping-onion": [
        { top: "20%", left: "45%", rotate: "10deg" },
        { top: "52%", left: "28%", rotate: "75deg" },
        { top: "45%", left: "62%", rotate: "-80deg" },
      ],
      "topping-pineapple": [
        { top: "25%", left: "32%", rotate: "0deg" },
        { top: "55%", left: "58%", rotate: "15deg" },
      ],
      "topping-corn": [
        { top: "35%", left: "50%", rotate: "0deg" },
        { top: "60%", left: "45%", rotate: "0deg" },
      ],
      "topping-jalapeno": [
        { top: "20%", left: "50%", rotate: "-15deg" },
        { top: "45%", left: "35%", rotate: "40deg" },
        { top: "65%", left: "55%", rotate: "-20deg" },
      ],
      "topping-pesto": [
        { top: "18%", left: "22%", rotate: "0deg" },
        { top: "48%", left: "52%", rotate: "45deg" },
      ],
      "topping-curry": [
        { top: "30%", left: "35%", rotate: "0deg" },
        { top: "50%", left: "50%", rotate: "0deg" },
      ],
      "topping-bell-pepper": [
        { top: "18%", left: "32%", rotate: "10deg" },
        { top: "32%", left: "22%", rotate: "50deg" },
        { top: "40%", left: "42%", rotate: "-30deg" },
      ],
      "topping-tomato-slices": [
        { top: "20%", left: "48%", rotate: "10deg" },
        { top: "54%", left: "48%", rotate: "30deg" },
      ],
    };

    return (
      map[toppingId] || [
        { top: "35%", left: "35%", rotate: "0deg" },
        { top: "55%", left: "55%", rotate: "20deg" },
      ]
    );
  };

  return (
    <section
      id="builder"
      className="relative bg-bg-primary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {isRtl ? "مُبتكر البيتزا الخاص بيكر" : "PIZZABAKER CUSTOMIZER"}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase mb-3">
            {isRtl ? "تخصيص بيتزا مع إضافات" : "CUSTOMIZE YOUR PIZZA"}
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-xl mx-auto leading-relaxed uppercase">
            {isRtl
              ? "اختر البيتزا الأساسية من قائمتنا الـ 30 ثم أضف المكونات الإضافية الرسمية بالوزن الدقيق"
              : "SELECT ANY OF OUR 30 PIZZAS AS A BASE AND ADD OFFICIAL PIZZABAKER EXTRA INGREDIENTS"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
          {/* LEFT PANEL: Visual Canvas & Real-time Bill Breakdown */}
          <div className="lg:col-span-5 flex flex-col items-center bg-bg-secondary border border-border-primary p-6 sm:p-8 relative transition-all sticky top-24">
            {/* Visual Canvas */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center shadow-2xl overflow-hidden bg-black/40 border-4 border-dashed border-border-primary p-2">
              {/* Dough / Base Pizza Image */}
              <motion.div
                className="relative w-full h-full rounded-full overflow-hidden"
                animate={{
                  scale:
                    size === "medium" || size === "thin"
                      ? 1.0
                      : size === "small"
                        ? 0.88
                        : 1.08,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <PizzaBuilderImage
                  key={selectedPizza.id}
                  pizza={selectedPizza}
                  altText={selectedPizza.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Overlaid Extra Toppings Scatter Canvas */}
                <div className="absolute inset-0 pointer-events-none">
                  <AnimatePresence>
                    {selectedToppings.map((toppingId) => {
                      const coordinates = getToppingCoordinates(toppingId);
                      const toppingObj = CUSTOM_TOPPINGS.find(
                        (t) => t.id === toppingId,
                      );

                      return coordinates.map((coord, idx) => (
                        <motion.div
                          key={`${toppingId}-${idx}`}
                          initial={{ opacity: 0, scale: 2, y: -40 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 12,
                            delay: idx * 0.05,
                          }}
                          className="absolute text-2xl select-none filter drop-shadow-md"
                          style={{
                            top: coord.top,
                            left: coord.left,
                            transform: `rotate(${coord.rotate})`,
                          }}
                        >
                          {toppingObj ? toppingObj.icon : "🍕"}
                        </motion.div>
                      ));
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Selected Base Pizza Badge */}
            <div className="mt-6 text-center space-y-1 w-full border-t border-border-primary/60 pt-4">
              <span className="inline-block bg-brand-burgundy text-white font-mono text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase mb-1">
                {isRtl
                  ? `البيتزا رقم ${selectedPizza.number}`
                  : `BASE PIZZA Nr ${selectedPizza.number}`}
              </span>
              <h3 className="font-serif text-xl text-text-primary font-medium uppercase block">
                {t(`pizzas.${selectedPizza.id}.name`)}
              </h3>
              <p className="text-[10px] text-text-secondary font-serif italic max-w-xs mx-auto">
                {t(`pizzas.${selectedPizza.id}.desc`)}
              </p>
            </div>

            {/* Price Breakdown Matrix */}
            <div className="mt-6 w-full bg-bg-primary/60 border border-border-primary p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-secondary">
                  {isRtl ? "سعر البيتزا الأساسية:" : "Base Pizza Price:"}
                </span>
                <span className="text-text-primary font-bold">
                  {basePrice} {isRtl ? "ل.س" : "SYP"}
                </span>
              </div>

              {selectedToppings.length > 0 && (
                <div className="flex justify-between items-center text-xs font-mono text-brand-gold">
                  <span>
                    {isRtl
                      ? `الإضافات (${selectedToppings.length}):`
                      : `Extra Ingredients (${selectedToppings.length}):`}
                  </span>
                  <span className="font-bold">
                    +{extraToppingsCost} {isRtl ? "ل.س" : "SYP"}
                  </span>
                </div>
              )}

              <div className="border-t border-border-primary pt-2.5 flex justify-between items-baseline">
                <span className="text-xs font-mono font-bold text-text-primary uppercase">
                  {isRtl ? "الإجمالي:" : "TOTAL PRICE:"}
                </span>
                <span className="font-mono text-2xl font-bold text-brand-gold">
                  {totalPrice}{" "}
                  <span className="text-xs text-text-primary font-normal">
                    {isRtl ? "ل.س" : "SYP"}
                  </span>
                </span>
              </div>
            </div>

            {/* Reset Extras Button */}
            {selectedToppings.length > 0 && (
              <button
                id="btn-builder-reset-extras"
                onClick={handleReset}
                className="mt-4 flex items-center gap-1.5 text-[10px] font-mono text-text-secondary hover:text-brand-gold transition-colors cursor-pointer uppercase"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isRtl ? "إلغاء الإضافات" : "CLEAR EXTRAS"}</span>
              </button>
            )}

            {/* Add To Cart Button */}
            <button
              id="btn-add-builder-custom-cart"
              onClick={handleAddToCart}
              className="w-full mt-6 py-4 bg-brand-gold hover:bg-yellow-500 text-black font-mono text-xs font-bold tracking-widest transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    {isRtl ? "تمت الإضافة للسلة!" : "ADDED TO BASKET!"}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isRtl
                      ? `أضف للسلة (${totalPrice} ل.س)`
                      : `ADD TO BASKET (${totalPrice} SYP)`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT PANEL: Pizza Customization Steps */}
          <div className="lg:col-span-7 space-y-10">
            {/* STEP 1: Select Base Pizza */}
            <div className="bg-bg-secondary border border-border-primary p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border-primary pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-gold text-black text-[10px] font-mono font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
                    {isRtl
                      ? "اختر البيتزا الأساسية (من 30 نوع)"
                      : "SELECT BASE PIZZA (1 - 30)"}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-brand-gold font-bold">
                  {selectedPizza.name} (# {selectedPizza.number})
                </span>
              </div>

              {/* Pizza Search Input */}
              <div className="relative">
                <Search
                  className={`absolute ${isRtl ? "right-3" : "left-3"} top-2.5 w-4 h-4 text-text-tertiary`}
                />
                <input
                  type="text"
                  value={searchPizzaQuery}
                  onChange={(e) => setSearchPizzaQuery(e.target.value)}
                  placeholder={
                    isRtl
                      ? "ابحث برقم البيتزا أو الاسم (مثلاً: 4 أو بيبروني)..."
                      : "Search by Pizza number or name (e.g. 4 or Pepperoni)..."
                  }
                  className={`w-full bg-bg-primary border border-border-primary p-2 text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-brand-gold ${isRtl ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"}`}
                />
              </div>

              {/* Pizza Selection Grid */}
              <div className="max-h-60 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-brand-gold/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredPizzas.map((pizza) => {
                    const isSelected = selectedPizza.id === pizza.id;
                    return (
                      <button
                        key={pizza.id}
                        onClick={() => setSelectedPizza(pizza)}
                        className={`p-2 border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-gold bg-brand-gold/10"
                            : "border-border-primary hover:border-white/20 bg-bg-primary/40"
                        }`}
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border-primary/60 bg-black/40">
                          <PizzaBuilderImage
                            key={pizza.id}
                            pizza={pizza}
                            altText={pizza.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 bg-brand-burgundy text-white font-mono text-[8px] font-bold px-1 py-0.2 rounded-tl">
                            #{pizza.number}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 leading-tight">
                          <span className="block text-xs font-serif font-medium text-text-primary truncate">
                            {t(`pizzas.${pizza.id}.name`)}
                          </span>
                          <span className="block text-[9px] font-mono text-brand-gold mt-0.5">
                            {pizza.prices[size] || pizza.prices.medium}{" "}
                            {isRtl ? "ل.س" : "SYP"}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-brand-gold flex-shrink-0 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 2: Select Diameter Size */}
            <div className="bg-bg-secondary border border-border-primary p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border-primary pb-3">
                <span className="w-5 h-5 rounded-full bg-brand-gold text-black text-[10px] font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
                  {isRtl ? "اختر الحجم (حجم البيتزا)" : "SELECT PIZZA SIZE"}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "small", label: "20cm", sub: isRtl ? "صغير" : "Small" },
                  {
                    id: "medium",
                    label: "30cm",
                    sub: isRtl ? "وسط" : "Medium",
                  },
                  { id: "large", label: "40cm", sub: isRtl ? "كبير" : "Large" },
                  {
                    id: "thin",
                    label: "Thin",
                    sub: isRtl ? "رقيقة" : "Crispy",
                  },
                ].map((sz) => {
                  const isSelected = size === sz.id;
                  const price = selectedPizza.prices[sz.id];
                  return (
                    <button
                      key={sz.id}
                      onClick={() => setSize(sz.id)}
                      className={`p-3 border transition-all text-left cursor-pointer ${
                        isSelected
                          ? "border-brand-gold bg-brand-gold/10 text-text-primary"
                          : "border-border-primary hover:border-white/20 text-text-secondary"
                      }`}
                    >
                      <span className="block font-mono text-[10px] font-bold uppercase text-brand-gold">
                        {sz.label} ({sz.sub})
                      </span>
                      <span className="block font-mono text-xs font-bold text-text-primary mt-1">
                        {price}{" "}
                        <span className="text-[9px] text-text-secondary">
                          {isRtl ? "ل.س" : "SYP"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Extra Ingredients & Pricing (Page 7 Official Items) */}
            <div className="bg-bg-secondary border border-border-primary p-5 sm:p-6 space-y-6">
              <div className="border-b border-border-primary pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-gold text-black text-[10px] font-mono font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">
                      {isRtl
                        ? "الإضافات والأسعار (قائمة بيتزا بيكر الرسمية)"
                        : "EXTRA INGREDIENTS & PRICING"}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-brand-gold font-bold">
                    {selectedToppings.length} {isRtl ? "مُختارة" : "SELECTED"}
                  </span>
                </div>
              </div>

              {/* 1. Animal Products Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-bg-primary/80 px-3 py-1.5 border-l-2 border-brand-gold">
                  <span className="font-mono text-[11px] font-bold text-text-primary uppercase">
                    {isRtl ? "١. منتجات حيوانية" : "1. Animal Products"}
                  </span>
                  <span className="font-mono text-[10px] text-brand-gold font-bold">
                    +{getToppingPrice({ type: "animal" }, size)}{" "}
                    {isRtl ? "ل.س / المكون" : "SYP / item"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {animalToppings.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id);
                    const weight = getToppingWeight(topping, size);
                    const price = getToppingPrice(topping, size);

                    return (
                      <button
                        key={topping.id}
                        onClick={() => handleToppingToggle(topping.id)}
                        className={`p-2.5 border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-gold bg-brand-gold/15 text-text-primary"
                            : "border-border-primary hover:border-white/20 bg-bg-primary/30 text-text-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">
                            {topping.icon}
                          </span>
                          <div className="leading-tight text-left">
                            <span className="block text-xs font-sans font-medium text-text-primary truncate">
                              {language === "ar"
                                ? topping.arabicName
                                : t(topping.name)}
                            </span>
                            {weight && (
                              <span className="block text-[9px] font-mono text-text-tertiary">
                                {isRtl
                                  ? `الوزن: ${weight}`
                                  : `Weight: ${weight}`}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <span className="text-[10px] font-mono font-bold text-brand-gold">
                            +{price} {isRtl ? "ل.س" : "SYP"}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-brand-gold bg-brand-gold text-black"
                                : "border-border-primary"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Vegetarian Ingredients Section */}
              <div className="space-y-3 pt-4 border-t border-border-primary/60">
                <div className="flex justify-between items-center bg-bg-primary/80 px-3 py-1.5 border-l-2 border-emerald-500">
                  <span className="font-mono text-[11px] font-bold text-text-primary uppercase">
                    {isRtl ? "٢. منتجات نباتية" : "2. Vegetarian Ingredients"}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">
                    +{getToppingPrice({ type: "vegetarian" }, size)}{" "}
                    {isRtl ? "ل.س / المكون" : "SYP / item"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {vegetarianToppings.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id);
                    const weight = getToppingWeight(topping, size);
                    const price = getToppingPrice(topping, size);

                    return (
                      <button
                        key={topping.id}
                        onClick={() => handleToppingToggle(topping.id)}
                        className={`p-2.5 border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-500/15 text-text-primary"
                            : "border-border-primary hover:border-white/20 bg-bg-primary/30 text-text-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">
                            {topping.icon}
                          </span>
                          <div className="leading-tight text-left">
                            <span className="block text-xs font-sans font-medium text-text-primary truncate">
                              {language === "ar"
                                ? topping.arabicName
                                : t(topping.name)}
                            </span>
                            {weight && (
                              <span className="block text-[9px] font-mono text-text-tertiary">
                                {isRtl
                                  ? `الوزن: ${weight}`
                                  : `Weight: ${weight}`}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <span className="text-[10px] font-mono font-bold text-emerald-400">
                            +{price} {isRtl ? "ل.س" : "SYP"}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500 text-black"
                                : "border-border-primary"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
