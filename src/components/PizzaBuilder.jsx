import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  Check,
  RefreshCw,
  Sparkles,
  TrendingDown,
  Percent,
  Zap,
} from "lucide-react";
import { CUSTOM_TOPPINGS, INITIAL_MENU } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

// Ingredient matching mappings to link custom builder state with original database menu records
const TOPPING_TO_INGREDIENT_MAP = {
  "topping-cheese": "Cheese",
  "topping-ham": "Ham",
  "topping-mush": "Mushroom",
  "topping-minced": "Minced meat",
  "topping-pepper": "Red pepper",
  "topping-onion": "Onion",
  "topping-baconcut": "Baconcut",
  "topping-pineapple": "Pineapple",
  "topping-pep": "Pepperoni",
  "topping-garlic": "Garlic",
  "topping-nacho": "Nacho chips",
  "topping-chili": "Chili",
  "topping-marinated-beef": "Marinated beef",
  "topping-chicken": "Chicken",
  "topping-corn": "Corn",
  "topping-pepper-beef": "Pepper beef",
  "topping-jalapeno": "Jalapeño",
  "topping-marinated-chicken": "Marinated chicken",
  "topping-luxury-bacon": "Luxury bacon",
  "topping-tomato": "Tomato",
  "topping-pesto": "Pesto",
  "topping-kebab": "Kebab meat",
  "topping-red-onion": "Red onion",
  "topping-oregano": "Oregano",
  "topping-chorizo": "Chorizo",
  "topping-hot-chicken": "Hot chicken",
  "topping-squash": "Squash",
  "topping-feta": "Feta cheese",
  "topping-pork": "Pork",
};

const CRUST_TO_INGREDIENTS = {
  "Classic Neapolitan": ["Cheese", "Sauce"],
  "Crispy Thin": ["Cheese", "Sauce", "Oregano"],
  "Gluten-Free": ["Cheese", "Sauce"],
  "Garlic Butter Crust": ["Cheese", "Sauce", "Garlic"],
};

const SAUCE_TO_INGREDIENTS = {
  "San Marzano Tomato": ["Sauce"],
  "White Truffle Cream": ["Cheese"],
  "Herb Pesto": ["Pesto"],
  "Spicy Diavola": ["Chili"],
};

export default function PizzaBuilder({ onAddCustomToCart }) {
  const [size, setSize] = useState("medium");
  const [crust, setCrust] = useState("Classic Neapolitan");
  const [sauce, setSauce] = useState("San Marzano Tomato");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t, isRtl, language } = useThemeLanguage();

  const crustTranslations = {
    "Classic Neapolitan": { en: "Classic Neapolitan", ar: "نابولي كلاسيكية" },
    "Crispy Thin": { en: "Crispy Thin", ar: "رقيقة مقرمشة" },
    "Gluten-Free": { en: "Gluten-Free", ar: "خالية من الغلوتين" },
    "Garlic Butter Crust": {
      en: "Garlic Butter Crust",
      ar: "عجينة بالثوم والزبدة",
    },
  };

  const sauceTranslations = {
    "San Marzano Tomato": { en: "San Marzano Tomato", ar: "طماطم سان مارزانو" },
    "White Truffle Cream": {
      en: "White Truffle Cream",
      ar: "كريمة الترفل البيضاء",
    },
    "Herb Pesto": { en: "Herb Pesto", ar: "بيستو الأعشاب" },
    "Spicy Diavola": { en: "Spicy Diavola", ar: "ديافولا حارة" },
  };

  // Custom base prices matched with Margherita from INITIAL_MENU in Syrian Pounds
  const getBasePrice = (sz) => {
    if (sz === "small") return 450;
    if (sz === "medium") return 900;
    if (sz === "large") return 1400;
    if (sz === "thin") return 900;
    return 900;
  };

  const getToppingMultiplier = (sz) => {
    if (sz === "small") return 0.5;
    if (sz === "medium" || sz === "thin") return 1.0;
    if (sz === "large") return 1.5;
    return 1.0;
  };

  const basePrice = getBasePrice(size);
  const toppingMultiplier = getToppingMultiplier(size);
  const toppingsCost = selectedToppings.reduce((sum, toppingId) => {
    const topping = CUSTOM_TOPPINGS.find((t) => t.id === toppingId);
    return sum + (topping ? Math.round(topping.price * toppingMultiplier) : 0);
  }, 0);

  // 1. Get all equivalent ingredients from user's custom pizza
  const getCustomIngredientsList = () => {
    const list = [];
    const crustIngs = CRUST_TO_INGREDIENTS[crust] || ["Cheese", "Sauce"];
    const sauceIngs = SAUCE_TO_INGREDIENTS[sauce] || ["Sauce"];

    crustIngs.forEach((ing) => {
      if (!list.includes(ing)) list.push(ing);
    });
    sauceIngs.forEach((ing) => {
      if (!list.includes(ing)) list.push(ing);
    });

    selectedToppings.forEach((tId) => {
      const ingName = TOPPING_TO_INGREDIENT_MAP[tId];
      if (ingName && !list.includes(ingName)) {
        list.push(ingName);
      }
    });

    return list;
  };

  const customIngredients = getCustomIngredientsList();

  // 2. Compute closest matching menu pizza and its similarity
  const findClosestMenuPizza = () => {
    let bestMatch = null;
    let highestSim = 0;

    INITIAL_MENU.forEach((pizza) => {
      const pizzaIngs = pizza.ingredients || [];
      if (pizzaIngs.length === 0) return;

      const intersect = pizzaIngs.filter((ing) =>
        customIngredients.includes(ing),
      );

      const matchScore =
        intersect.length / Math.max(pizzaIngs.length, customIngredients.length);

      if (matchScore > highestSim) {
        highestSim = matchScore;
        bestMatch = pizza;
      }
    });

    if (!bestMatch || selectedToppings.length === 0) {
      return {
        pizza: INITIAL_MENU[0], // Margherita
        similarity: selectedToppings.length === 0 ? 100 : 40,
      };
    }

    return {
      pizza: bestMatch,
      similarity: Math.round(highestSim * 100),
    };
  };

  const { pizza: closestPizza, similarity: matchSimilarity } =
    findClosestMenuPizza();

  // If the built pizza matches 100% one of the menu pizzas, use the real menu price of that pizza.
  const totalPrice =
    matchSimilarity === 100 && closestPizza
      ? closestPizza.prices[size] || basePrice + toppingsCost
      : basePrice + toppingsCost;

  // 3. Precise price prediction based on matching menu pizza and adjustments
  const getPredictedMenuPrice = (sz) => {
    if (!closestPizza) return getBasePrice(sz);

    const baseRetail = closestPizza.prices[sz] || getBasePrice(sz);
    const mult = getToppingMultiplier(sz);

    const pizzaIngs = closestPizza.ingredients || [];
    const extraIngredients = customIngredients.filter(
      (ing) => !pizzaIngs.includes(ing),
    );
    const missingIngredients = pizzaIngs.filter(
      (ing) => !customIngredients.includes(ing),
    );

    let extraCost = 0;
    extraIngredients.forEach((ingName) => {
      const toppingId = Object.keys(TOPPING_TO_INGREDIENT_MAP).find(
        (key) => TOPPING_TO_INGREDIENT_MAP[key] === ingName,
      );
      if (toppingId) {
        const topping = CUSTOM_TOPPINGS.find((t) => t.id === toppingId);
        if (topping) {
          extraCost += topping.price * mult;
        }
      } else {
        extraCost += 60 * mult;
      }
    });

    let missingCost = 0;
    missingIngredients.forEach((ingName) => {
      const toppingId = Object.keys(TOPPING_TO_INGREDIENT_MAP).find(
        (key) => TOPPING_TO_INGREDIENT_MAP[key] === ingName,
      );
      if (toppingId) {
        const topping = CUSTOM_TOPPINGS.find((t) => t.id === toppingId);
        if (topping) {
          missingCost += topping.price * mult;
        }
      } else {
        missingCost += 60 * mult;
      }
    });

    let adjustedRetail = baseRetail + extraCost - missingCost;
    const minPrice = getBasePrice(sz);
    return Math.max(minPrice, Math.round(adjustedRetail));
  };

  // 4. Taste Profile Live Analytics
  const getFlavorProfile = () => {
    let cheesy = 25;
    let meaty = 0;
    let veggie = 0;
    let spicy = 0;
    let herbaceous = 0;

    if (crust === "Garlic Butter Crust") {
      cheesy += 15;
      herbaceous += 10;
    }
    if (sauce === "White Truffle Cream") {
      cheesy += 20;
    }
    if (sauce === "Herb Pesto") {
      herbaceous += 35;
    }
    if (sauce === "Spicy Diavola") {
      spicy += 40;
    }

    selectedToppings.forEach((tId) => {
      if (tId === "topping-cheese" || tId === "topping-feta") cheesy += 35;
      if (
        tId.includes("meat") ||
        tId === "topping-ham" ||
        tId.includes("chicken") ||
        tId.includes("beef") ||
        tId === "topping-pep" ||
        tId === "topping-chorizo" ||
        tId === "topping-pork" ||
        tId === "topping-baconcut" ||
        tId === "topping-luxury-bacon"
      ) {
        meaty += 50;
        if (
          tId.includes("hot") ||
          tId.includes("chili") ||
          tId.includes("jalapeno") ||
          tId.includes("chorizo") ||
          tId === "topping-pep"
        ) {
          spicy += 25;
        }
      }
      if (
        tId === "topping-mush" ||
        tId === "topping-pepper" ||
        tId.includes("onion") ||
        tId === "topping-corn" ||
        tId === "topping-tomato" ||
        tId === "topping-squash" ||
        tId === "topping-pineapple"
      ) {
        veggie += 30;
      }
      if (tId === "topping-chili" || tId === "topping-jalapeno") {
        spicy += 40;
      }
      if (tId === "topping-pesto" || tId === "topping-oregano") {
        herbaceous += 35;
      }
    });

    return {
      cheesy: Math.min(100, cheesy),
      meaty: Math.min(100, meaty),
      veggie: Math.min(100, veggie),
      spicy: Math.min(100, spicy),
      herbaceous: Math.min(100, herbaceous),
    };
  };

  const flavor = getFlavorProfile();

  const handleToppingToggle = (toppingId) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  const handleReset = () => {
    setSelectedToppings([]);
    setCrust("Classic Neapolitan");
    setSauce("San Marzano Tomato");
    setSize("medium");
  };

  const handleAddToCart = () => {
    const translatedToppings = selectedToppings
      .map((id) => {
        const tObj = CUSTOM_TOPPINGS.find((to) => to.id === id);
        return tObj ? t(tObj.name) : "";
      })
      .filter(Boolean);

    const name =
      language === "ar"
        ? `بيتزا مبتكرة - حجم ${size === "small" ? "صغير" : size === "medium" ? "وسط" : size === "large" ? "كبير" : "رقيقة"}`
        : `Custom ${size === "small" ? "Small" : size === "medium" ? "Medium" : size === "large" ? "Large" : "Thin"} Pizza`;

    onAddCustomToCart({
      name,
      size,
      price: totalPrice,
      toppings: [...translatedToppings],
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  const crustOptions = [
    "Classic Neapolitan",
    "Crispy Thin",
    "Gluten-Free",
    "Garlic Butter Crust",
  ];
  const sauceOptions = [
    "San Marzano Tomato",
    "White Truffle Cream",
    "Herb Pesto",
    "Spicy Diavola",
  ];

  // Dynamic visual coordinates resolver for live canvas rendering
  const getToppingCoordinates = (toppingId) => {
    const specificMap = {
      "topping-cheese": [
        { top: "35%", left: "30%", rotate: "15deg" },
        { top: "25%", left: "55%", rotate: "-10deg" },
        { top: "60%", left: "40%", rotate: "45deg" },
        { top: "50%", left: "65%", rotate: "120deg" },
        { top: "45%", left: "20%", rotate: "-40deg" },
      ],
      "topping-feta": [
        { top: "20%", left: "40%", rotate: "0deg" },
        { top: "55%", left: "25%", rotate: "30deg" },
        { top: "50%", left: "55%", rotate: "-20deg" },
      ],
      "topping-pep": [
        { top: "22%", left: "25%", rotate: "45deg" },
        { top: "42%", left: "48%", rotate: "12deg" },
        { top: "30%", left: "65%", rotate: "-35deg" },
        { top: "65%", left: "35%", rotate: "70deg" },
        { top: "58%", left: "58%", rotate: "110deg" },
        { top: "50%", left: "18%", rotate: "-15deg" },
      ],
      "topping-mush": [
        { top: "28%", left: "38%", rotate: "20deg" },
        { top: "48%", left: "32%", rotate: "80deg" },
        { top: "38%", left: "58%", rotate: "-45deg" },
        { top: "62%", left: "48%", rotate: "140deg" },
      ],
      "topping-pepper": [
        { top: "18%", left: "32%", rotate: "10deg" },
        { top: "32%", left: "22%", rotate: "50deg" },
        { top: "40%", left: "42%", rotate: "-30deg" },
        { top: "28%", left: "52%", rotate: "100deg" },
        { top: "58%", left: "28%", rotate: "75deg" },
        { top: "52%", left: "62%", rotate: "-80deg" },
        { top: "68%", left: "45%", rotate: "15deg" },
      ],
      "topping-oregano": [
        { top: "30%", left: "45%", rotate: "-15deg" },
        { top: "50%", left: "38%", rotate: "40deg" },
        { top: "42%", left: "55%", rotate: "95deg" },
      ],
      "topping-pesto": [
        { top: "15%", left: "15%", rotate: "0deg" },
        { top: "50%", left: "50%", rotate: "45deg" },
        { top: "75%", left: "35%", rotate: "-30deg" },
        { top: "35%", left: "70%", rotate: "120deg" },
      ],
      "topping-olive": [
        { top: "26%", left: "28%", rotate: "0deg" },
        { top: "34%", left: "48%", rotate: "0deg" },
        { top: "44%", left: "24%", rotate: "0deg" },
        { top: "58%", left: "52%", rotate: "0deg" },
        { top: "48%", left: "68%", rotate: "0deg" },
      ],
      "topping-tomato": [
        { top: "20%", left: "48%", rotate: "10deg" },
        { top: "40%", left: "35%", rotate: "-50deg" },
        { top: "54%", left: "48%", rotate: "30deg" },
        { top: "38%", left: "65%", rotate: "115deg" },
      ],
    };

    if (specificMap[toppingId]) {
      return specificMap[toppingId];
    }

    // Smart fallback categories to ensure visually distinct placements for all 29 toppings
    if (
      toppingId.includes("pep") ||
      toppingId.includes("meat") ||
      toppingId.includes("chicken") ||
      toppingId.includes("beef") ||
      toppingId.includes("ham") ||
      toppingId.includes("bacon") ||
      toppingId.includes("chorizo") ||
      toppingId.includes("pork") ||
      toppingId.includes("minced")
    ) {
      return specificMap["topping-pep"];
    }
    if (
      toppingId.includes("onion") ||
      toppingId.includes("chili") ||
      toppingId.includes("jalapeno") ||
      toppingId.includes("garlic") ||
      toppingId.includes("corn") ||
      toppingId.includes("nacho")
    ) {
      return specificMap["topping-olive"];
    }
    if (
      toppingId.includes("tomato") ||
      toppingId.includes("squash") ||
      toppingId.includes("pineapple") ||
      toppingId.includes("mush")
    ) {
      return specificMap["topping-tomato"];
    }
    if (
      toppingId.includes("pesto") ||
      toppingId.includes("oregano") ||
      toppingId.includes("basil") ||
      toppingId.includes("arugula") ||
      toppingId.includes("pepper")
    ) {
      return specificMap["topping-pepper"];
    }

    return specificMap["topping-cheese"];
  };

  return (
    <section
      id="builder"
      className="relative bg-bg-primary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {t("builderPreTitle")}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase mb-3">
            {t("builderTitle")}
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-lg mx-auto leading-relaxed">
            {t("builderDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* LEFT PANEL: Interactive Visual Pizza Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-bg-secondary border border-border-primary p-8 sm:p-12 relative transition-all">
            {/* Visual Pizza Canvas container */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center shadow-2xl overflow-hidden bg-orange-950/20 border-4 border-dashed border-border-primary p-2">
              {/* Dough Base */}
              <motion.div
                className={`absolute w-[92%] h-[92%] rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.6)] border-[12px] transition-all duration-500 ${
                  crust === "Garlic Butter Crust"
                    ? "border-[#caa759] bg-[#e6ce9e]"
                    : crust === "Crispy Thin"
                      ? "border-[#a37e42] bg-[#d7bf95]"
                      : crust === "Gluten-Free"
                        ? "border-[#be9d60] bg-[#e1cbad]"
                        : "border-[#bc903b] bg-[#e8dbb2]" // Neapolitan
                }`}
                animate={{
                  scale:
                    size === "medium" || size === "thin"
                      ? 1.0
                      : size === "small"
                        ? 0.88
                        : 1.08,
                }}
              >
                {/* Sauce Layer */}
                <motion.div
                  className={`absolute inset-4 rounded-full transition-all duration-500 ${
                    sauce === "San Marzano Tomato"
                      ? "bg-red-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"
                      : sauce === "White Truffle Cream"
                        ? "bg-yellow-50/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]"
                        : sauce === "Herb Pesto"
                          ? "bg-emerald-900/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"
                          : "bg-red-950 shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]" // Spicy Diavola
                  }`}
                />

                {/* Scattered Toppings Canvas */}
                <div className="absolute inset-4 rounded-full overflow-hidden pointer-events-none">
                  <AnimatePresence>
                    {selectedToppings.map((toppingId) => {
                      const coordinates = getToppingCoordinates(toppingId);
                      const toppingObj = CUSTOM_TOPPINGS.find(
                        (t) => t.id === toppingId,
                      );

                      return coordinates.map((coord, index) => (
                        <motion.div
                          key={`${toppingId}-${index}`}
                          initial={{ opacity: 0, scale: 2, y: -50 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 10,
                            delay: index * 0.05,
                          }}
                          className="absolute text-2xl sm:text-3xl select-none"
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

            {/* Price display tag */}
            <div className="mt-8 flex items-center justify-between w-full border-t border-border-primary pt-6">
              <div className="text-left">
                <span className="text-[10px] font-mono text-text-secondary block uppercase">
                  {t("totalComp")}
                </span>
                <span className="font-mono text-3xl text-text-primary font-bold block mt-1">
                  {totalPrice.toFixed(2)}{" "}
                  <span className="text-sm font-semibold text-brand-gold">
                    {isRtl ? "ل.س" : "SYP"}
                  </span>
                </span>
              </div>

              <button
                id="btn-builder-reset"
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-brand-gold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isRtl ? "إعادة البدء" : "START OVER"}</span>
              </button>
            </div>

            {/* AI Smart Price Predictor Deck */}
            <div className="mt-6 w-full border-t border-border-primary/60 pt-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-brand-gold font-bold uppercase">
                <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                <span>{t("pricePredictor")}</span>
              </div>

              {/* Recipe Similarity Match Card */}
              <div className="bg-white/[0.02] border border-border-primary p-4 space-y-3 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <Percent className="w-12 h-12 text-brand-gold" />
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block">
                      {t("closestMatch")}
                    </span>
                    <span className="text-sm font-serif text-text-primary block font-medium mt-1">
                      {closestPizza
                        ? t(`pizzas.${closestPizza.id}.name`)
                        : t("customPizzaDefaultName")}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block">
                      {t("similarity")}
                    </span>
                    <span className="text-sm font-mono text-brand-gold font-bold block mt-1">
                      {matchSimilarity}%
                    </span>
                  </div>
                </div>

                {/* Similarity meter progress bar */}
                <div className="w-full bg-border-primary/40 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-brand-gold h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${matchSimilarity}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Savings Indicator */}
                {selectedToppings.length > 0 && matchSimilarity < 100 && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/20 px-2.5 py-1.5 border border-emerald-500/10">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>
                      {t("saveSyp").replace(
                        "{amount}",
                        getPredictedMenuPrice(size) - totalPrice > 0
                          ? (getPredictedMenuPrice(size) - totalPrice).toFixed(
                              2,
                            )
                          : "0.00",
                      )}{" "}
                      ({t("customSavingsDesc")})
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Estimated Prices Matrix */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block">
                  {t("predictForSizes")}
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {["small", "medium", "large", "thin"].map((sz) => {
                    const estMenuValue = getPredictedMenuPrice(sz);
                    const bPrice =
                      matchSimilarity === 100 && closestPizza
                        ? closestPizza.prices[sz] ||
                          getBasePrice(sz) + toppingsCost
                        : getBasePrice(sz) + toppingsCost;
                    const isCurrentSize = size === sz;

                    return (
                      <div
                        key={sz}
                        className={`p-2 border transition-all text-left flex flex-col justify-between ${
                          isCurrentSize
                            ? "border-brand-gold bg-brand-gold/[0.04]"
                            : "border-border-primary/40 bg-white/[0.01]"
                        }`}
                      >
                        <span className="text-[8px] font-mono text-text-secondary uppercase font-bold block">
                          {t(sz)}
                        </span>

                        <div className="mt-1.5 leading-none">
                          <span className="text-[11px] font-mono font-bold text-text-primary block">
                            {bPrice.toFixed(2)}
                            <span className="text-[8px] text-text-secondary ml-0.5">
                              {isRtl ? "ل.س" : "SYP"}
                            </span>
                          </span>
                          {matchSimilarity < 100 && (
                            <span className="text-[8px] font-mono text-brand-gold line-through block mt-0.5 opacity-70">
                              {estMenuValue.toFixed(2)} {isRtl ? "ل.س" : "SYP"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Taste Profile Live Analytics */}
              <div className="space-y-3 bg-white/[0.01] border border-border-primary/40 p-4">
                <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block">
                  {t("tasteProfile")}
                </span>

                <div className="space-y-2">
                  {/* Cheesy */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span>{t("cheesy")}</span>
                      <span>{flavor.cheesy}%</span>
                    </div>
                    <div className="w-full bg-border-primary/20 h-1">
                      <motion.div
                        className="bg-amber-400 h-full"
                        animate={{ width: `${flavor.cheesy}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Meaty */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span>{t("meaty")}</span>
                      <span>{flavor.meaty}%</span>
                    </div>
                    <div className="w-full bg-border-primary/20 h-1">
                      <motion.div
                        className="bg-red-500 h-full"
                        animate={{ width: `${flavor.meaty}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Veggie */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span>{t("veggie")}</span>
                      <span>{flavor.veggie}%</span>
                    </div>
                    <div className="w-full bg-border-primary/20 h-1">
                      <motion.div
                        className="bg-emerald-500 h-full"
                        animate={{ width: `${flavor.veggie}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Spicy */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span>{t("spicy")}</span>
                      <span>{flavor.spicy}%</span>
                    </div>
                    <div className="w-full bg-border-primary/20 h-1">
                      <motion.div
                        className="bg-orange-500 h-full"
                        animate={{ width: `${flavor.spicy}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Herbaceous */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span>{t("herbaceous")}</span>
                      <span>{flavor.herbaceous}%</span>
                    </div>
                    <div className="w-full bg-border-primary/20 h-1">
                      <motion.div
                        className="bg-teal-500 h-full"
                        animate={{ width: `${flavor.herbaceous}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Customizable ingredients selectors */}
          <div className="lg:col-span-6 space-y-8">
            {/* Step 1: Select Size */}
            <div>
              <label className="text-[10px] font-mono text-brand-gold tracking-widest uppercase block mb-3 font-bold">
                {t("selectSize")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  id="btn-size-builder-small"
                  onClick={() => setSize("small")}
                  className={`border p-2.5 text-left transition-all cursor-pointer ${
                    size === "small"
                      ? "border-brand-gold bg-brand-gold/10 text-text-primary"
                      : "border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="block font-mono text-[8px] tracking-widest uppercase font-bold text-text-secondary">
                    {t("small").toUpperCase()} (20CM)
                  </span>
                  <span className="block font-mono text-xs font-bold mt-1">
                    {getBasePrice("small").toFixed(2)}{" "}
                    <span className="text-[9px] text-brand-gold font-semibold">
                      {isRtl ? "ل.س" : "SYP"}
                    </span>
                  </span>
                </button>

                <button
                  id="btn-size-builder-medium"
                  onClick={() => setSize("medium")}
                  className={`border p-2.5 text-left transition-all cursor-pointer ${
                    size === "medium"
                      ? "border-brand-gold bg-brand-gold/10 text-text-primary"
                      : "border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="block font-mono text-[8px] tracking-widest uppercase font-bold text-text-secondary">
                    {t("medium").toUpperCase()} (30CM)
                  </span>
                  <span className="block font-mono text-xs font-bold mt-1">
                    {getBasePrice("medium").toFixed(2)}{" "}
                    <span className="text-[9px] text-brand-gold font-semibold">
                      {isRtl ? "ل.س" : "SYP"}
                    </span>
                  </span>
                </button>

                <button
                  id="btn-size-builder-large"
                  onClick={() => setSize("large")}
                  className={`border p-2.5 text-left transition-all cursor-pointer ${
                    size === "large"
                      ? "border-brand-gold bg-brand-gold/10 text-text-primary"
                      : "border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="block font-mono text-[8px] tracking-widest uppercase font-bold text-text-secondary">
                    {t("large").toUpperCase()} (40CM)
                  </span>
                  <span className="block font-mono text-xs font-bold mt-1">
                    {getBasePrice("large").toFixed(2)}{" "}
                    <span className="text-[9px] text-brand-gold font-semibold">
                      {isRtl ? "ل.س" : "SYP"}
                    </span>
                  </span>
                </button>

                <button
                  id="btn-size-builder-thin"
                  onClick={() => setSize("thin")}
                  className={`border p-2.5 text-left transition-all cursor-pointer ${
                    size === "thin"
                      ? "border-brand-gold bg-brand-gold/10 text-text-primary"
                      : "border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="block font-mono text-[8px] tracking-widest uppercase font-bold text-text-secondary">
                    {t("thin").toUpperCase()} (CRISPY)
                  </span>
                  <span className="block font-mono text-xs font-bold mt-1">
                    {getBasePrice("thin").toFixed(2)}{" "}
                    <span className="text-[9px] text-brand-gold font-semibold">
                      {isRtl ? "ل.س" : "SYP"}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Step 4: Toggle Premium Toppings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-mono text-brand-gold tracking-widest uppercase block font-bold">
                  {t("layerToppings")}
                </label>
                <span className="text-[10px] font-mono text-text-secondary">
                  {selectedToppings.length} {isRtl ? "مُختارة" : "SELECTED"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CUSTOM_TOPPINGS.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      id={`btn-topping-${topping.id}`}
                      onClick={() => handleToppingToggle(topping.id)}
                      className={`border p-3 flex items-center justify-between transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-brand-gold bg-brand-gold/10 text-text-primary font-semibold"
                          : "border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{topping.icon}</span>
                        <div className="leading-tight">
                          <span className="block text-[10px] font-sans tracking-wide">
                            {t(topping.name)}
                          </span>
                          <span className="block text-[9px] font-mono text-brand-gold font-bold">
                            +
                            {Math.round(
                              topping.price * toppingMultiplier,
                            ).toFixed(2)}{" "}
                            {isRtl ? "ل.س" : "SYP"}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Final checkout custom order CTA */}
            <div className="pt-4">
              <button
                id="btn-add-builder-to-cart"
                onClick={handleAddToCart}
                disabled={selectedToppings.length === 0}
                className={`w-full py-4 font-mono text-xs font-bold tracking-widest transition-all duration-300 rounded-none flex items-center justify-center gap-2.5 cursor-pointer ${
                  selectedToppings.length === 0
                    ? "bg-white/5 border border-border-primary text-text-tertiary cursor-not-allowed"
                    : "bg-brand-gold hover:bg-yellow-500 text-black shadow-lg shadow-brand-gold/5"
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>
                      {isRtl
                        ? "تمت الإضافة للسلة بنجاح!"
                        : "CUSTOM PIZZA ADDED TO CART!"}
                    </span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {isRtl
                        ? `أضف بيتزا مبتكرة بسعر (${totalPrice.toFixed(2)} ل.س)`
                        : `ADD CUSTOM PIZZA (${totalPrice.toFixed(2)} SYP)`}
                    </span>
                  </>
                )}
              </button>

              {selectedToppings.length === 0 && (
                <span className="text-[10px] font-sans text-text-secondary block text-center mt-2.5">
                  {isRtl
                    ? "الرجاء اختيار مكون إضافي واحد على الأقل للبدء بالخبز."
                    : "Select at least one ingredient toppings to enable baking."}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
