import { createContext, useContext, useEffect, useState } from "react";
import { translate } from "./i18n";

const DashboardLanguageContext = createContext(null);

const STORAGE_KEY = "pbdash_lang";

export function DashboardLanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  const isRtl = language === "ar";

  // The dashboard manages its own <html> dir/lang independently of the
  // public site (which sets its own based on the visitor's language choice
  // and defaults to Arabic in index.html's static markup).
  useEffect(() => {
    const root = document.documentElement;
    const prevDir = root.getAttribute("dir");
    const prevLang = root.getAttribute("lang");
    root.setAttribute("dir", isRtl ? "rtl" : "ltr");
    root.setAttribute("lang", language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage failures (private browsing, quota, etc.)
    }
    return () => {
      if (prevDir === null) root.removeAttribute("dir");
      else root.setAttribute("dir", prevDir);
      if (prevLang === null) root.removeAttribute("lang");
      else root.setAttribute("lang", prevLang);
    };
  }, [language, isRtl]);

  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "ar" : "en"));

  const t = (key, vars) => translate(language, key, vars);

  return (
    <DashboardLanguageContext.Provider value={{ language, isRtl, toggleLanguage, t }}>
      <div className={isRtl ? "font-arabic" : ""}>{children}</div>
    </DashboardLanguageContext.Provider>
  );
}

export function useDashboardLanguage() {
  const ctx = useContext(DashboardLanguageContext);
  if (!ctx) {
    throw new Error("useDashboardLanguage must be used within DashboardLanguageProvider");
  }
  return ctx;
}
