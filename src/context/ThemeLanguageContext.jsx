import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const ThemeLanguageContext = createContext(null);

export function ThemeLanguageProvider({ children }) {
  // Load initial settings from localStorage, or default
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pizzabaker_theme') || 'dark';
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('pizzabaker_lang') || 'en';
  });

  // Track state transitions and persist
  useEffect(() => {
    localStorage.setItem('pizzabaker_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark', 'theme-dark');
      root.classList.remove('light', 'theme-light');
    } else {
      root.classList.add('light', 'theme-light');
      root.classList.remove('dark', 'theme-dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pizzabaker_lang', language);
    const root = window.document.documentElement;
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    root.setAttribute('dir', direction);
    root.setAttribute('lang', language);
    
    // Update body class for RTL specific styling if needed
    if (language === 'ar') {
      root.classList.add('rtl-active');
    } else {
      root.classList.remove('rtl-active');
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  // Safe translation helper with nesting (e.g., t('pizzas.pizza-1.name'))
  const t = (key) => {
    if (!key) return '';
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key; // return key if fallback missing
          }
        }
        return fallback;
      }
    }
    return result;
  };

  const isRtl = language === 'ar';

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        language,
        isRtl,
        t,
        toggleTheme,
        toggleLanguage,
      }}
    >
      <div className={`theme-${theme} font-sans ${isRtl ? 'font-arabic' : ''}`}>
        {children}
      </div>
    </ThemeLanguageContext.Provider>
  );
}

export function useThemeLanguage() {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
}
