import React, { useEffect } from "react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function SEOHead({ activeSection }) {
  const { language, isRtl } = useThemeLanguage();

  useEffect(() => {
    // 1. Update <html> tag attributes for Web Crawlers & Accessibility
    document.documentElement.lang = language === "ar" ? "ar" : "en";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";

    // 2. Define dynamic SEO titles and descriptions per active section & language
    let title = "";
    let description = "";

    if (language === "ar") {
      switch (activeSection) {
        case "menu":
          title = "قائمة البيتزا الإيطالية | بيتزا بيكر سوريا (Pizza Baker)";
          description =
            "تصفح أكثر من 30 صنف بيتزا إيطالية حرارية فاخرة بأشهى الصلصات والأجبا الموزاريلا المذوبة. طلب أونلاين وتوصيل سريع في سوريا.";
          break;
        case "snacks":
          title =
            "المقبلات والوجبات الخفيفة | خبزة الثوم ودبابيس الدجاج | بيتزا بيكر";
          description =
            "قائمة مقبلات بيتزا بيكر سوريا المقرمشة: خبزة الثوم الشهية، دبابيس الدجاج المتبلة والمخبوزة بالفرن الحراري.";
          break;
        case "desserts":
          title = "حلويات البيتزا بالنوتيلا والفاكهة | بيتزا بيكر سوريا";
          description =
            "أفخر حلويات البيتزا الإيطالية: نوتيلا بيور، نوتيلا بستاشيو، نوتيلا بالموز والفريز ونوتيلا فواكه وبستاشيو الملكية.";
          break;
        case "builder":
          title = "صانع البيتزا التفاعلي | صمم بيتزا أحلامك | بيتزا بيكر";
          description =
            "صمم بيتزا إيطالية حرارية مخصصة باختيار نوع العجينة، الصلصة، الأجبان والمكونات الفاخرة خطوة بخطوة.";
          break;
        case "reservation":
          title = "حجز طاولات مطعم بيتزا بيكر سوريا | Reservation Desk";
          description =
            "احجز طاولتك الخاصة في مطعم بيتزا بيكر سوريا بسهولة وسرعة للاستمتاع بأجمل الأجواء وأشهى الأطباق الإيطالية.";
          break;
        case "reviews":
          title = "تقييمات وآراء العملاء | بيتزا بيكر سوريا";
          description =
            "اقرأ آراء عشاق البيتزا والعملاء في سوريا حول تجربة مطعم بيتزا بيكر وتقييمات الوجبات والخدمة الفائقة.";
          break;
        default:
          title =
            "بيتزا بيكر سوريا | Pizza Baker Syria - أشهى بيتزا إيطالية حرارية ومقبلات وحلويات نوتيلا";
          description =
            "المطعم الأرقى للبيتزا الإيطالية الفاخرة في سوريا. استمتع بأكثر من 30 صنف بيتزا حرارية، خبزة الثوم، دبابيس الدجاج، وحلويات نوتيلا فواكه وبستاشيو.";
          break;
      }
    } else {
      switch (activeSection) {
        case "menu":
          title = "Artisanal Pizza Menu | Pizza Baker Syria";
          description =
            "Explore over 30 authentic oven-baked Italian pizzas with premium melting cheeses and signature sauces.";
          break;
        case "snacks":
          title =
            "Appetizers & Snacks | Garlic Bread & Chicken Drumsticks | Pizza Baker";
          description =
            "Crispy starters including artisanal garlic bread and oven-baked tender chicken drumsticks.";
          break;
        case "desserts":
          title = "Nutella Pizza Desserts | Pizza Baker Syria";
          description =
            "Delectable dessert pizzas featuring Pure Nutella, Nutella Pistachio, Fresh Banana, Strawberry, and Fruity Nutella.";
          break;
        case "builder":
          title = "Custom Pizza Builder | Design Your Pizza | Pizza Baker";
          description =
            "Interactive artisanal pizza creator: select your dough type, signature sauces, cheeses, and rich toppings.";
          break;
        case "reservation":
          title = "Book a Table | Table Reservation Desk | Pizza Baker Syria";
          description =
            "Reserve your dining table at Pizza Baker Syria for an exceptional Italian culinary journey.";
          break;
        case "reviews":
          title = "Customer Reviews & Ratings | Pizza Baker Syria";
          description =
            "Read verified reviews and testimonials from pizza lovers about our food quality and service.";
          break;
        default:
          title =
            "Pizza Baker Syria | Premium Italian Oven-Baked Pizza, Snacks & Nutella Desserts";
          description =
            "Syria’s premier Italian pizzeria offering over 30 signature pizzas, garlic bread, chicken drumsticks, and Nutella desserts.";
          break;
      }
    }

    // 3. Update document title
    document.title = title;

    // 4. Update Meta Description tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 5. Update Open Graph Meta tags dynamically
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    // 6. Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const sectionHash =
        activeSection && activeSection !== "hero" ? `#${activeSection}` : "";
      const langParam = language === "en" ? "?lang=en" : "";
      canonical.setAttribute(
        "href",
        `https://pizzabaker.app/${langParam}${sectionHash}`,
      );
    }
  }, [language, isRtl, activeSection]);

  return null; // Side-effect component for head metadata
}
