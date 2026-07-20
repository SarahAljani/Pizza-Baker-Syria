import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Calendar,
  Globe,
  Sun,
  Moon,
  Facebook,
  Instagram,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function Navbar({
  cart,
  onOpenCart,
  activeSection,
  onNavigate,
  onOpenReservation,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, language, t, toggleTheme, toggleLanguage, isRtl } =
    useThemeLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: "hero", label: t("home") },
    { id: "menu", label: t("menu") },
    { id: "extras", label: t("extras") },
    { id: "builder", label: t("builder") },
    { id: "reviews", label: t("reviews") },
    { id: "reservation", label: t("bookTable") },
  ];

  const handleLinkClick = (id) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-glass-bg backdrop-blur-xl border-b border-border-primary py-3 shadow-lg"
            : "bg-gradient-to-b from-black/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Nav (Desktop) */}
            <div className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest text-text-secondary">
              {navLinks.slice(0, 3).map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`hover:text-brand-gold transition-all duration-300 relative py-1 cursor-pointer ${
                    activeSection === link.id
                      ? "text-brand-gold font-semibold"
                      : ""
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-brand-gold"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Logo */}
            <div className="flex-1 md:flex-none text-center">
              <button
                id="navbar-logo"
                onClick={() => handleLinkClick("hero")}
                className="inline-block cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="https://i.ibb.co/MynDPF0d/Frame-252.png"
                  alt="Pizza Baker Logo"
                  referrerPolicy="no-referrer"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </button>
            </div>

            {/* Right Nav (Desktop) */}
            <div className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest text-text-secondary">
              {navLinks.slice(3).map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`hover:text-brand-gold transition-all duration-300 relative py-1 cursor-pointer ${
                    activeSection === link.id
                      ? "text-brand-gold font-semibold"
                      : ""
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-brand-gold"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}

              {/* Social Media Links */}
              <div className="flex items-center gap-3 border-l border-border-primary pl-4">
                <a
                  href="https://facebook.com"
                  id="header-social-fb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-text-secondary hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4 fill-current" strokeWidth={0} />
                </a>
                <a
                  href="https://instagram.com"
                  id="header-social-ig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-text-secondary hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>

              {/* Theme Switcher */}
              <button
                id="btn-nav-theme"
                onClick={toggleTheme}
                className="p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                title={theme === "dark" ? t("lightMode") : t("darkMode")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4.5 h-4.5 text-brand-gold" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Language Switcher */}
              <button
                id="btn-nav-lang"
                onClick={toggleLanguage}
                className="p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300 flex items-center gap-1 cursor-pointer font-mono font-bold text-[11px]"
                title="Switch Language"
              >
                <Globe className="w-4 h-4 text-brand-gold" />
                <span>{language === "en" ? "العربية" : "English"}</span>
              </button>

              {/* Cart Button */}
              <button
                id="btn-nav-cart"
                onClick={onOpenCart}
                className="relative p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {totalCartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-brand-gold text-black text-[9px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {totalCartItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Mobile Controls */}
            <div
              className={`flex md:hidden items-center ${isRtl ? "space-x-reverse space-x-2" : "space-x-2"}`}
            >
              {/* Theme Switcher Mobile */}
              <button
                id="btn-nav-theme-mobile"
                onClick={toggleTheme}
                className="p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                title={theme === "dark" ? t("lightMode") : t("darkMode")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4.5 h-4.5 text-brand-gold" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Language Switcher Mobile */}
              <button
                id="btn-nav-lang-mobile"
                onClick={toggleLanguage}
                className="p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300 flex items-center gap-1 cursor-pointer font-mono font-bold text-[11px]"
              >
                <Globe className="w-4 h-4 text-brand-gold" />
                <span>{language === "en" ? "AR" : "EN"}</span>
              </button>

              {/* Cart for Mobile */}
              <button
                id="btn-nav-cart-mobile"
                onClick={onOpenCart}
                className="relative p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-gold text-black text-[9px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Burger Menu Button */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-text-secondary hover:text-brand-gold transition-colors duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[54px] left-0 right-0 z-40 bg-bg-secondary/95 backdrop-blur-2xl md:hidden border-b border-border-primary"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 font-mono text-center text-xs tracking-widest text-text-secondary">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-mobile-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`block w-full py-2.5 hover:bg-white/5 hover:text-brand-gold transition-all rounded ${
                    activeSection === link.id
                      ? "text-brand-gold bg-white/5 font-semibold"
                      : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="h-[1px] bg-border-primary my-3" />
              {/* Mobile Social Icons */}
              <div className="flex items-center justify-center gap-6 py-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-text-primary hover:bg-brand-gold text-bg-primary rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                >
                  <Facebook
                    className="w-4.5 h-4.5 fill-current"
                    strokeWidth={0}
                  />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-text-primary hover:bg-brand-gold text-bg-primary rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
