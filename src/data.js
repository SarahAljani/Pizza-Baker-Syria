import heroImage from "./assets/images/bistro_hero_1783274357884.jpg";
import footerBgImage from "./assets/images/footer_ingredients_1783274399702.jpg";

// High quality ambient illustrations (pizza photos live in /public/pizza_images)
export const IMAGES = {
  hero: heroImage,
  footerBg: footerBgImage,
};

// Site-wide settings editable from the dashboard: social links, the WhatsApp
// number used for ordering, which sections are shown, and default SEO text.
export const SITE_SETTINGS = {
  heroImage: IMAGES.hero,
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
  whatsappNumber: "963983923768",
  delivery: {
    fee: 200,
    freeThreshold: 3000,
  },
  sectionVisibility: {
    menu: true,
    extras: true,
    builder: true,
    reservation: true,
    reviews: false,
  },
  seo: {
    // Shown when the site link is shared (WhatsApp/Facebook/Twitter/Google).
    ogImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200",
    // Title/description per section, swapped in by SEOHead.jsx as the
    // visitor scrolls — "home" is the fallback used for the hero section
    // and for static (non-JS) contexts like link-preview crawlers.
    sections: {
      home: {
        en: {
          title:
            "Pizza Baker Syria | Premium Italian Oven-Baked Pizza, Snacks & Nutella Desserts",
          description:
            "Syria’s premier Italian pizzeria offering over 30 signature pizzas, garlic bread, chicken drumsticks, and Nutella desserts.",
        },
        ar: {
          title:
            "بيتزا بيكر سوريا | Pizza Baker Syria - أشهى بيتزا إيطالية حرارية ومقبلات وحلويات نوتيلا",
          description:
            "المطعم الأرقى للبيتزا الإيطالية الفاخرة في سوريا. استمتع بأكثر من 30 صنف بيتزا حرارية، خبزة الثوم، دبابيس الدجاج، وحلويات نوتيلا فواكه وبستاشيو.",
        },
      },
      menu: {
        en: {
          title: "Artisanal Pizza Menu | Pizza Baker Syria",
          description:
            "Explore over 30 authentic oven-baked Italian pizzas with premium melting cheeses and signature sauces.",
        },
        ar: {
          title: "قائمة البيتزا الإيطالية | بيتزا بيكر سوريا (Pizza Baker)",
          description:
            "تصفح أكثر من 30 صنف بيتزا إيطالية حرارية فاخرة بأشهى الصلصات والأجبا الموزاريلا المذوبة. طلب أونلاين وتوصيل سريع في سوريا.",
        },
      },
      extras: {
        en: {
          title: "Sides, Sauces & Drinks | Pizza Baker Syria",
          description:
            "Crispy garlic bread and chicken drumsticks, Nutella dessert pizzas, dipping sauces, and cold drinks.",
        },
        ar: {
          title: "المقبلات والصلصات والمشروبات | بيتزا بيكر سوريا",
          description:
            "خبزة الثوم ودبابيس الدجاج المقرمشة، حلويات البيتزا بالنوتيلا، صلصات التغميس، والمشروبات الباردة.",
        },
      },
      builder: {
        en: {
          title: "Custom Pizza Builder | Design Your Pizza | Pizza Baker",
          description:
            "Interactive artisanal pizza creator: select your dough type, signature sauces, cheeses, and rich toppings.",
        },
        ar: {
          title: "صانع البيتزا التفاعلي | صمم بيتزا أحلامك | بيتزا بيكر",
          description:
            "صمم بيتزا إيطالية حرارية مخصصة باختيار نوع العجينة، الصلصة، الأجبان والمكونات الفاخرة خطوة بخطوة.",
        },
      },
      reservation: {
        en: {
          title: "Book a Table | Table Reservation Desk | Pizza Baker Syria",
          description:
            "Reserve your dining table at Pizza Baker Syria for an exceptional Italian culinary journey.",
        },
        ar: {
          title: "حجز طاولات مطعم بيتزا بيكر سوريا | Reservation Desk",
          description:
            "احجز طاولتك الخاصة في مطعم بيتزا بيكر سوريا بسهولة وسرعة للاستمتاع بأجمل الأجواء وأشهى الأطباق الإيطالية.",
        },
      },
      reviews: {
        en: {
          title: "Customer Reviews & Ratings | Pizza Baker Syria",
          description:
            "Read verified reviews and testimonials from pizza lovers about our food quality and service.",
        },
        ar: {
          title: "تقييمات وآراء العملاء | بيتزا بيكر سوريا",
          description:
            "اقرأ آراء عشاق البيتزا والعملاء في سوريا حول تجربة مطعم بيتزا بيكر وتقييمات الوجبات والخدمة الفائقة.",
        },
      },
    },
  },
};

export const DEFAULT_SETTINGS = structuredClone(SITE_SETTINGS);

export function applySettingsOverride(settings) {
  if (!settings) return;
  if (typeof settings.heroImage === "string" && settings.heroImage) {
    SITE_SETTINGS.heroImage = settings.heroImage;
  }
  if (settings.socialLinks) {
    Object.assign(SITE_SETTINGS.socialLinks, settings.socialLinks);
  }
  if (typeof settings.whatsappNumber === "string" && settings.whatsappNumber) {
    SITE_SETTINGS.whatsappNumber = settings.whatsappNumber;
  }
  if (settings.delivery) {
    Object.assign(SITE_SETTINGS.delivery, settings.delivery);
  }
  if (settings.sectionVisibility) {
    Object.assign(SITE_SETTINGS.sectionVisibility, settings.sectionVisibility);
  }
  if (typeof settings.seo?.ogImage === "string" && settings.seo.ogImage) {
    SITE_SETTINGS.seo.ogImage = settings.seo.ogImage;
  }
  // Backward-compat: settings saved before per-section SEO existed had a
  // flat { en, ar } shape for the whole site — migrate that into the new
  // "home" section so already-customized SEO isn't silently dropped.
  if (settings.seo?.en) Object.assign(SITE_SETTINGS.seo.sections.home.en, settings.seo.en);
  if (settings.seo?.ar) Object.assign(SITE_SETTINGS.seo.sections.home.ar, settings.seo.ar);
  if (settings.seo?.sections) {
    for (const key of Object.keys(SITE_SETTINGS.seo.sections)) {
      const section = settings.seo.sections[key];
      if (!section) continue;
      if (section.en) Object.assign(SITE_SETTINGS.seo.sections[key].en, section.en);
      if (section.ar) Object.assign(SITE_SETTINGS.seo.sections[key].ar, section.ar);
    }
  }
}

export const INITIAL_MENU = [
  {
    id: "pizza-1",
    number: 1,
    name: "The Classic Margherita",
    description: "Sauce, Cheese",
    ingredients: ["Sauce", "Cheese"],
    category: "classic",
    prices: { small: 400, medium: 800, large: 1250, thin: 800 },
    image: "/pizza_images/1 The Classic Margherita.jpeg",
    hoverImage: "/pizza_images/1.jpg",
  },
  {
    id: "pizza-2",
    number: 2,
    name: "The Salami One",
    description: "Sauce, Cheese, Beef salami, Mushroom",
    ingredients: ["Sauce", "Cheese", "Salami", "Mushroom"],
    category: "classic",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1000 },
    image: "/pizza_images/2 The Salami One.jpeg",
    hoverImage: "/pizza_images/2.jpg",
  },
  {
    id: "pizza-3",
    number: 3,
    name: "My Dream",
    description: "Sauce, Minced Beef, Cheese, pepper",
    ingredients: ["Sauce", "Minced beef", "Cheese", "Bell pepper"],
    category: "specialty",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/3 My Dream.jpeg",
    hoverImage: "/pizza_images/3.jpg",
  },
  {
    id: "pizza-4",
    number: 4,
    name: "Pizzabaker Special",
    description: "Sauce, Minced Beef, Onion, Cheese, Bacon cut",
    ingredients: ["Sauce", "Minced beef", "Onion", "Cheese", "Beef bacon cut"],
    category: "specialty",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/4 Pizzabaker Special.jpeg",
    hoverImage: "/pizza_images/4.jpg",
  },
  {
    id: "pizza-5",
    number: 5,
    name: "Hawaii",
    description: "Sauce, Minced Beef, Onion, Cheese, Pineapple",
    ingredients: ["Sauce", "Minced beef", "Onion", "Cheese", "Pineapple"],
    category: "specialty",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/5 Hawaii.jpeg",
    hoverImage: "/pizza_images/5.jpg",
  },
  {
    id: "pizza-6",
    number: 6,
    name: "Pepperoni",
    description: "Sauce, Onion, Cheese, Pepperoni, pepper",
    ingredients: ["Sauce", "Onion", "Cheese", "Pepperoni", "Bell pepper"],
    category: "meat",
    prices: { small: 550, medium: 1100, large: 1600, thin: 1100 },
    image: "/pizza_images/6 Pepperoni.jpeg",
    hoverImage: "/pizza_images/6.jpg",
  },
  {
    id: "pizza-7",
    number: 7,
    name: "Mexicano",
    description:
      "Sauce, Garlic, Nacho chips, Chili, Marinated beef, Chicken, Corn",
    ingredients: [
      "Sauce",
      "Garlic",
      "Nacho chips",
      "Cheese",
      "Chili",
      "Marinated beef slices",
      "Chicken pieces",
      "Corn",
    ],
    category: "spicy",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/7 Mexicano.jpeg",
    hoverImage: "/pizza_images/7.jpg",
  },
  {
    id: "pizza-8",
    number: 8,
    name: "Meat Lover",
    description: "Sauce, Garlic, Cheese, Bacon cut, Marinated beef",
    ingredients: [
      "Sauce",
      "Garlic",
      "Cheese",
      "Beef bacon cut",
      "Marinated beef slices",
    ],
    category: "meat",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/8 Meat Lover.jpeg",
    hoverImage: "/pizza_images/8.jpg",
  },
  {
    id: "pizza-9",
    number: 9,
    name: "The Marinated One",
    description: "Sauce, Onion, Cheese, Mushroom, Marinated beef",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Mushroom",
      "Marinated beef slices",
    ],
    category: "meat",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/9 The Marinated.jpeg",
    hoverImage: "/pizza_images/9.jpg",
  },
  {
    id: "pizza-10",
    number: 10,
    name: "Hot Pepper Beef",
    description: "Sauce, Onion, Cheese, Mushroom, pepper, Pepper beef",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Mushroom",
      "Bell pepper",
      "Marinated beef slices",
    ],
    category: "spicy",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/10 Hot Pepper Beef.jpeg",
    hoverImage: "/pizza_images/10.jpg",
  },
  {
    id: "pizza-11",
    number: 11,
    name: "The Flame",
    description:
      "Taco sauce, Minced meat, Taco spice, Nacho chips, Cheese, Jalapeño",
    ingredients: [
      "Tacosauce",
      "Minced beef",
      "Seasoning mix",
      "Nacho chips",
      "Cheese",
      "Jalapeño",
    ],
    category: "spicy",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/11 The Flame.jpeg",
    hoverImage: "/pizza_images/11.jpg",
  },
  {
    id: "pizza-12",
    number: 12,
    name: "Taco Chicken",
    description:
      "Taco sauce, Taco spice, Nacho chips, Cheese, Jalapeño, Marinated chicken",
    ingredients: [
      "Tacosauce",
      "Seasoning mix",
      "Nacho chips",
      "Cheese",
      "Jalapeño",
      "Chicken pieces",
    ],
    category: "spicy",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/12 Taco Chicken.jpeg",
    hoverImage: "/pizza_images/12.jpg",
  },
  {
    id: "pizza-13",
    number: 13,
    name: "Master Chicken",
    description: "Sauce, Onion, Cheese, Mushroom, Corn, Chicken",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Mushroom",
      "Corn",
      "Chicken pieces",
    ],
    category: "chicken",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/13 Master Chicken.jpeg",
    hoverImage: "/pizza_images/13.jpg",
  },
  {
    id: "pizza-14",
    number: 14,
    name: "Master Favourite",
    description: "Sauce, Minced Beef, Cheese, Pineapple, Luxury Beef bacon",
    ingredients: [
      "Sauce",
      "Minced beef",
      "Cheese",
      "Pineapple",
      "Beef bacon slices",
    ],
    category: "specialty",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/14 Master Favourite.jpeg",
    hoverImage: "/pizza_images/14.jpg",
  },
  {
    id: "pizza-15",
    number: 15,
    name: "Spark Baker",
    description: "Sauce, Minced Meat, Onion, Garlic, Cheese and Jalapeños",
    ingredients: [
      "Sauce",
      "Minced beef",
      "Onion",
      "Garlic",
      "Cheese",
      "Jalapeño",
    ],
    category: "spicy",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/15 Spark Baker.jpeg",
    hoverImage: "/pizza_images/15.jpg",
  },
  {
    id: "pizza-16",
    number: 16,
    name: "Chicken Deluxe",
    description: "Sauce, Onion, Cheese, pepper, Chicken, Luxury Beef bacon",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Bell pepper",
      "Chicken pieces",
      "Beef bacon slices",
    ],
    category: "chicken",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/16 Chicken Deluxe.jpeg",
    hoverImage: "/pizza_images/16.jpg",
  },
  {
    id: "pizza-17",
    number: 17,
    name: "Chicken Pesto",
    description: "Sauce, Tomato, Chili, Marinated Chicken, Pesto",
    ingredients: [
      "Sauce",
      "Fresh tomato slices",
      "Cheese",
      "Chili",
      "Chicken pieces",
      "Pesto",
    ],
    category: "chicken",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/17 Pesto Chicken.jpeg",
    hoverImage: "/pizza_images/17.jpg",
  },
  {
    id: "pizza-18",
    number: 18,
    name: "Vegan",
    description: "Sauce, Onion, Cheese, pepper, Corn, Mushroom, Pineapple",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Bell pepper",
      "Corn",
      "Mushroom",
      "Pineapple",
    ],
    category: "vegetarian",
    prices: { small: 500, medium: 950, large: 1450, thin: 950 },
    image: "/pizza_images/18 Vegan.jpeg",
    hoverImage: "/pizza_images/18.jpg",
  },
  {
    id: "pizza-19",
    number: 19,
    name: "Pizza Kebab",
    description: "Taco sauce, Cheese, Kebab beef, Corn, Jalapeño, Red onion",
    ingredients: [
      "Tacosauce",
      "Cheese",
      "Marinated beef slices",
      "Corn",
      "Jalapeño",
      "Onion",
    ],
    category: "specialty",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/19 Kebab Pizza.jpeg",
    hoverImage: "/pizza_images/19.jpg",
  },
  {
    id: "pizza-20",
    number: 20,
    name: "Mr. Mix",
    description: "Sauce, Cheese, Beef salami, Beef bacon cut",
    ingredients: ["Sauce", "Cheese", "Salami", "Beef bacon cut"],
    category: "meat",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/20 Mr. Mix.jpeg",
    hoverImage: "/pizza_images/20.jpg",
  },
  {
    id: "pizza-21",
    number: 21,
    name: "Mr. X",
    description: "Sauce, Minced Beef, Onion, Cheese, Pepperoni, Pineapple",
    ingredients: [
      "Sauce",
      "Minced beef",
      "Onion",
      "Cheese",
      "Pepperoni",
      "Pineapple",
    ],
    category: "specialty",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/21 Mr. X.jpeg",
    hoverImage: "/pizza_images/21.jpg",
  },
  {
    id: "pizza-22",
    number: 22,
    name: "The Double Decker",
    description: "Sauce, Minced Beef, Beef salami, Cheese, Oregano",
    ingredients: ["Sauce", "Minced beef", "Cheese", "Salami", "Oregano"],
    category: "meat",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/22 The Double Decker.jpeg",
    hoverImage: "/pizza_images/22.jpg",
  },
  {
    id: "pizza-23",
    number: 23,
    name: "Chorizo Special",
    description: "Sauce, Chorizo, Onion, Cheese, Minced Beef",
    ingredients: ["Sauce", "Beef chorizo", "Onion", "Cheese", "Minced beef"],
    category: "meat",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/23 Chorizo.jpeg",
    hoverImage: "/pizza_images/23.jpg",
  },
  {
    id: "pizza-24",
    number: 24,
    name: "Chicken Hot",
    description: "Sauce, Cheese, Beef Bacon, Pineapple, Hot chicken",
    ingredients: [
      "Sauce",
      "Cheese",
      "Chicken pieces",
      "Beef bacon cut",
      "Pineapple",
    ],
    category: "chicken",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/24 Hot Chicken.jpeg",
    hoverImage: "/pizza_images/24.jpg",
  },
  {
    id: "pizza-25",
    number: 25,
    name: "Chorizo",
    description: "Sauce, Tomato, Chorizo, Pesto, Oregano",
    ingredients: [
      "Sauce",
      "Fresh tomato slices",
      "Cheese",
      "Beef chorizo",
      "Pesto",
      "Oregano",
    ],
    category: "meat",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/25 Chorizo.jpeg",
    hoverImage: "/pizza_images/25.jpg",
  },
  {
    id: "pizza-26",
    number: 26,
    name: "Four Seasons",
    description:
      "Sauce, Cheese, mushroom pepper, onion, corn, olives, Feferoni, Fresh Tomato Slices, Jalapeño, oregano",
    ingredients: [
      "Sauce",
      "Onion",
      "Cheese",
      "Bell pepper",
      "Corn",
      "Mushroom",
      "Pineapple",
      "Fresh tomato slices",
      "Oregano",
    ],
    category: "vegetarian",
    prices: { small: 500, medium: 1000, large: 1550, thin: 1000 },
    image: "/pizza_images/26.jpg",
    hoverImage: "/pizza_images/26.jpg",
  },
  {
    id: "pizza-27",
    number: 27,
    name: "Tuna Moby",
    description: "Sauce, Cheese, Tuna, Feta cheese, Onion",
    ingredients: ["Sauce", "Onion", "Cheese"],
    category: "vegetarian",
    prices: { small: 500, medium: 1050, large: 1600, thin: 1050 },
    image: "/pizza_images/27 Moby Tuna.jpeg",
    hoverImage: "/pizza_images/27.jpg",
  },
  {
    id: "pizza-28",
    number: 28,
    name: "Greek Special",
    description: "Sauce, Cheese, Feta cheese, Pepper, Feferoni, olives",
    ingredients: ["Sauce", "Cheese", "Chili", "Onion", "Bell pepper"],
    category: "vegetarian",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/28 Greek Special.jpeg",
    hoverImage: "",
  },
  {
    id: "pizza-29",
    number: 29,
    name: "Tropicana",
    description: "Sauce, Cheese, Chicken, Banana, Pineapple, Curry Spice",
    ingredients: [
      "Sauce",
      "Cheese",
      "Chicken pieces",
      "Pineapple",
      "Curry spice",
    ],
    category: "specialty",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/29 Tropicana.jpeg",
    hoverImage: "/pizza_images/29.jpg",
  },
  {
    id: "pizza-30",
    number: 30,
    name: "BBQ",
    description: "Sauce, Cheese, Red onion, Corn, Minced Beef",
    ingredients: ["Sauce", "Cheese", "Beef bacon cut", "Corn", "Onion"],
    category: "meat",
    prices: { small: 600, medium: 1100, large: 1650, thin: 1100 },
    image: "/pizza_images/30.jpg",
    hoverImage: "/pizza_images/30.jpg",
  },
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Abdullah Alhamwi",
    rating: 5,
    comment: "review1_comment",
    date: "July 2, 2026",
  },
  {
    id: "rev-2",
    name: "Saral Aljani",
    rating: 5,
    comment: "review2_comment",
    date: "June 28, 2026",
  },
  {
    id: "rev-3",
    name: "Haitham Jlailati",
    rating: 5,
    comment: "review3_comment",
    date: "June 15, 2026",
  },
];

export const getToppingWeight = (topping, size) => {
  if (!topping || !topping.weights) return "";
  if (size === "small") return topping.weights["20cm"] || "";
  if (size === "medium" || size === "thin")
    return topping.weights["30cm"] || topping.weights["thin"] || "";
  if (size === "large") return topping.weights["40cm"] || "";
  return "";
};

export const getToppingPrice = (topping, size) => {
  if (!topping) return 0;
  const isAnimal = topping.type === "animal";
  if (size === "small") return isAnimal ? 25 : 5;
  if (size === "medium" || size === "thin") return isAnimal ? 50 : 15;
  if (size === "large") return isAnimal ? 100 : 25;
  return isAnimal ? 50 : 15;
};

// Official 19 Extra Ingredients from Page 7 of Pizzabaker Menu
export const CUSTOM_TOPPINGS = [
  // 1. Animal Products (منتجات حيوانية) - Page 7
  {
    id: "topping-cheese",
    name: "Cheese",
    arabicName: "جبنة",
    type: "animal",
    weights: { "20cm": "30 g", "30cm": "80 g", "40cm": "130 g", thin: "80 g" },
    icon: "🧀",
  },
  {
    id: "topping-chicken",
    name: "Chicken pieces",
    arabicName: "قطع دجاج",
    type: "animal",
    weights: { "20cm": "10 g", "30cm": "30 g", "40cm": "40 g", thin: "30 g" },
    icon: "🍗",
  },
  {
    id: "topping-nacho",
    name: "Nacho chips",
    arabicName: "ناشو شيبس",
    type: "animal",
    weights: { "20cm": "5 g", "30cm": "10 g", "40cm": "30 g", thin: "10 g" },
    icon: "🌮",
  },
  {
    id: "topping-mush",
    name: "Mushroom",
    arabicName: "فطر",
    type: "animal",
    weights: { "20cm": "5 g", "30cm": "10 g", "40cm": "30 g", thin: "10 g" },
    icon: "🍄",
  },
  {
    id: "topping-salami",
    name: "Salami",
    arabicName: "سلامي",
    type: "animal",
    weights: { "20cm": "30 g", "30cm": "60 g", "40cm": "115 g", thin: "60 g" },
    icon: "🍕",
  },
  {
    id: "topping-pep",
    name: "Pepperoni",
    arabicName: "بيبيروني",
    type: "animal",
    weights: { "20cm": "15 g", "30cm": "30 g", "40cm": "55 g", thin: "30 g" },
    icon: "🍕",
  },
  {
    id: "topping-baconcut",
    name: "Beef bacon cut",
    arabicName: "بيكن بقري مقطع",
    type: "animal",
    weights: { "20cm": "30 g", "30cm": "80 g", "40cm": "130 g", thin: "80 g" },
    icon: "🥓",
  },
  {
    id: "topping-marinated-beef",
    name: "Marinated beef slices",
    arabicName: "شرائح لحم بقري",
    type: "animal",
    weights: { "20cm": "5 g", "30cm": "10 g", "40cm": "15 g", thin: "10 g" },
    icon: "🥩",
  },
  {
    id: "topping-minced",
    name: "Minced beef",
    arabicName: "لحم بقري مفروم",
    type: "animal",
    weights: {
      "20cm": "50 g",
      "30cm": "130 g",
      "40cm": "220 g",
      thin: "130 g",
    },
    icon: "🥩",
  },
  {
    id: "topping-chorizo",
    name: "Beef chorizo",
    arabicName: "شوريزو بقري",
    type: "animal",
    weights: { "20cm": "10 g", "30cm": "30 g", "40cm": "40 g", thin: "30 g" },
    icon: "🌭",
  },
  {
    id: "topping-bacon-slices",
    name: "Beef bacon slices",
    arabicName: "شرائح بيكن بقري",
    type: "animal",
    weights: {
      "20cm": "50 g",
      "30cm": "130 g",
      "40cm": "220 g",
      thin: "130 g",
    },
    icon: "🥓",
  },

  // 2. Vegetarian Ingredients (منتجات نباتية) - Page 7
  {
    id: "topping-onion",
    name: "Onion",
    arabicName: "بصل",
    type: "vegetarian",
    weights: { "20cm": "30 g", "30cm": "80 g", "40cm": "130 g", thin: "80 g" },
    icon: "🧅",
  },
  {
    id: "topping-pineapple",
    name: "Pineapple",
    arabicName: "أناناس",
    type: "vegetarian",
    weights: { "20cm": "30 g", "30cm": "80 g", "40cm": "130 g", thin: "80 g" },
    icon: "🍍",
  },
  {
    id: "topping-corn",
    name: "Corn",
    arabicName: "ذرة",
    type: "vegetarian",
    weights: {
      "20cm": "50 g",
      "30cm": "130 g",
      "40cm": "220 g",
      thin: "130 g",
    },
    icon: "🌽",
  },
  {
    id: "topping-jalapeno",
    name: "Jalapeño",
    arabicName: "هالبينيو",
    type: "vegetarian",
    weights: { "20cm": "30 g", "30cm": "60 g", "40cm": "115 g", thin: "60 g" },
    icon: "🌶️",
  },
  {
    id: "topping-pesto",
    name: "Pesto",
    arabicName: "بيستو",
    type: "vegetarian",
    weights: { "20cm": "5 g", "30cm": "10 g", "40cm": "30 g", thin: "10 g" },
    icon: "🟢",
  },
  {
    id: "topping-curry",
    name: "Curry spice",
    arabicName: "بهار كاري",
    type: "vegetarian",
    weights: {
      "20cm": "little",
      "30cm": "little",
      "40cm": "little",
      thin: "little",
    },
    icon: "🌾",
  },
  {
    id: "topping-bell-pepper",
    name: "Bell pepper",
    arabicName: "فليفلة",
    type: "vegetarian",
    weights: {
      "20cm": "little",
      "30cm": "little",
      "40cm": "little",
      thin: "little",
    },
    icon: "🫑",
  },
  {
    id: "topping-tomato-slices",
    name: "Fresh tomato slices",
    arabicName: "شرائح بندورة فريش",
    type: "vegetarian",
    weights: { "20cm": "5 g", "30cm": "10 g", "40cm": "30 g", thin: "10 g" },
    icon: "🍅",
  },
];

// Pristine copies captured before any dashboard overrides are applied below,
// used by the dashboard's "Reset to Default" and export/import tooling.
export const DEFAULT_MENU = structuredClone(INITIAL_MENU);

export const EXTRAS_MENU = {
  snacks: [
    {
      id: "snack-31",
      number: 31,
      name: "Garlic Bread",
      arabicName: "خبزة الثوم",
      translationKey: "garlic_bread",
      prices: { small: 350, large: 700 },
      sizes: ["small", "large"],
      localImageNames: [
        "garlic_bread.jpeg",
        "garlic_bread.jpg",
        "garlic_bread.png",
        "1.jpeg",
        "1.png",
        "garlic.jpeg",
      ],
      image: "/snacks/garlic_bread.png",
    },
    {
      id: "snack-32",
      number: 32,
      name: "Chicken Drumsticks",
      arabicName: "دبابيس دجاج",
      translationKey: "chicken_drumsticks",
      prices: { three_pcs: 400, six_pcs: 700 },
      sizes: ["three_pcs", "six_pcs"],
      localImageNames: [
        "chicken_drumsticks.jpeg",
        "chicken_drumsticks.jpg",
        "chicken_drumsticks.png",
        "2.jpeg",
        "2.png",
        "drumsticks.jpeg",
      ],
      image: "/snacks/chicken_drumsticks.png",
    },
  ],
  desserts: [
    {
      id: "dessert-33",
      number: 33,
      name: "Nutella Pure",
      arabicName: "نوتيلا بيور",
      translationKey: "pure_nutella",
      prices: { standard: 500 },
      localImageNames: [
        "nutella_pure.jpeg",
        "nutella_pure.jpg",
        "nutella_pure.png",
        "1.jpeg",
        "1.png",
        "pure_nutella.jpeg",
      ],
      image: "/dessert/nutella_pure.png",
    },
    {
      id: "dessert-34",
      number: 34,
      name: "Nutella Pistachio",
      arabicName: "نوتيلا بستاشيو",
      translationKey: "nutella_pistachio",
      prices: { standard: 600 },
      localImageNames: [
        "nutella_pistachio.jpeg",
        "nutella_pistachio.jpg",
        "nutella_pistachio.png",
        "2.jpeg",
        "2.png",
        "pistachio.jpeg",
      ],
      image: "/dessert/nutella_pistachio.png",
    },
    {
      id: "dessert-35",
      number: 35,
      name: "Nutella with Banana",
      arabicName: "نوتيلا بالموز",
      translationKey: "nutella_banana",
      prices: { standard: 600 },
      localImageNames: [
        "nutella_banana.jpeg",
        "nutella_banana.jpg",
        "nutella_banana.png",
        "3.jpeg",
        "3.png",
        "banana.jpeg",
      ],
      image: "/dessert/nutella_banana.png",
    },
    {
      id: "dessert-36",
      number: 36,
      name: "Nutella with Strawberry",
      arabicName: "نوتيلا بالفريز",
      translationKey: "nutella_strawberry",
      prices: { standard: 600 },
      localImageNames: [
        "nutella_strawberry.jpeg",
        "nutella_strawberry.jpg",
        "nutella_strawberry.png",
        "4.jpeg",
        "4.png",
        "strawberry.jpeg",
      ],
      image: "/dessert/nutella_strawberry.png",
    },
    {
      id: "dessert-37",
      number: 37,
      name: "Fruity Nutella",
      arabicName: "نوتيلا فواكه",
      translationKey: "fruity_nutella",
      prices: { standard: 700 },
      localImageNames: [
        "fruity_nutella.jpeg",
        "fruity_nutella.jpg",
        "fruity_nutella.png",
        "5.jpeg",
        "5.png",
        "fruity.jpeg",
      ],
      image: "/dessert/fruity_nutella.png",
    },
    {
      id: "dessert-38",
      number: 38,
      name: "Fruity Pistachio Nutella",
      arabicName: "نوتيلا بستاشيو فواكه",
      translationKey: "fruity_pistachio_nutella",
      prices: { standard: 750 },
      localImageNames: [
        "fruity_pistachio_nutella.jpeg",
        "fruity_pistachio_nutella.jpg",
        "fruity_pistachio_nutella.png",
        "6.jpeg",
        "6.png",
        "fruity_pistachio.jpeg",
      ],
      image: "/dessert/fruity_pistachio_nutella.png",
    },
  ],
  sauces: [
    {
      id: "sauce-39",
      number: 39,
      name: "Mayonnaise",
      arabicName: "مايونيز",
      translationKey: "sauce_mayonnaise",
      prices: { standard: 100 },
      image: "",
    },
    {
      id: "sauce-40",
      number: 40,
      name: "BBQ Sauce",
      arabicName: "صوص الباربكيو",
      translationKey: "sauce_bbq",
      prices: { standard: 100 },
      image: "",
    },
  ],
  drinks: [
    {
      id: "drink-41",
      number: 41,
      name: "Pepsi",
      arabicName: "بيبسي",
      translationKey: "drink_pepsi",
      prices: { standard: 150 },
      image: "",
    },
    {
      id: "drink-42",
      number: 42,
      name: "Water",
      arabicName: "مياه",
      translationKey: "drink_water",
      prices: { standard: 100 },
      image: "",
    },
  ],
};

// Pristine copy captured before any dashboard overrides are applied below.
export const DEFAULT_EXTRAS = structuredClone(EXTRAS_MENU);

// Applies edits saved from the dashboard (fetched from /api/content by
// main.jsx before the app renders). Mutating the exported arrays/objects in
// place keeps every existing import of INITIAL_MENU pointed at the same
// reference, so components don't need to know an override was applied.
export function applyMenuOverride(menu) {
  if (Array.isArray(menu) && menu.length) {
    INITIAL_MENU.length = 0;
    INITIAL_MENU.push(...menu);
  }
}

// Same idea for EXTRAS_MENU (snacks, desserts, sauces, drinks).
export function applyExtrasOverride(extras) {
  for (const category of Object.keys(EXTRAS_MENU)) {
    if (Array.isArray(extras?.[category])) {
      EXTRAS_MENU[category].length = 0;
      EXTRAS_MENU[category].push(...extras[category]);
    }
  }
}
