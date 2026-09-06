import React, { useEffect } from "react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { SITE_SETTINGS } from "../data";

export default function SEOHead({ activeSection }) {
  const { language, isRtl } = useThemeLanguage();

  useEffect(() => {
    // 1. Update <html> tag attributes for Web Crawlers & Accessibility
    document.documentElement.lang = language === "ar" ? "ar" : "en";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";

    // 2. Look up this section's SEO text (editable from the dashboard),
    // falling back to "home" for the hero section or anything unrecognized.
    const sections = SITE_SETTINGS.seo.sections;
    const sectionKey = activeSection && sections[activeSection] ? activeSection : "home";
    const entry = sections[sectionKey][language] || sections.home[language];
    const title = entry.title;
    const description = entry.description;

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

    const ogImageUrl = SITE_SETTINGS.seo.ogImage;
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", ogImageUrl);
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute("content", ogImageUrl);
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", title);
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute("content", description);

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
