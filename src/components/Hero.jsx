import { motion } from "motion/react";
import { ChevronDown, Sparkles, ChefHat } from "lucide-react";
import { IMAGES } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function Hero({ onNavigate, onOpenReservation }) {
  const { language, t, isRtl } = useThemeLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Pizza Baker Journey"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Radial Dark Overlays to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-brand-burgundy/80 border border-brand-gold/30 px-3.5 py-1 rounded-full mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-brand-soft-yellow font-semibold uppercase">
            {t("heroBadge")}
          </span>
        </motion.div>

        {/* Small Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs sm:text-sm font-mono tracking-[0.3em] text-brand-gold font-bold mb-3 uppercase"
        >
          {t("heroSubtitle")}
        </motion.p>

        {/* Big Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-4xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal tracking-tight mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none uppercase"
        >
          {language === "ar" ? (
            <span>{t("heroTitle")}</span>
          ) : (
            <>
              PIZZA BAKER
              <br />
              {/* <span className="italic text-brand-soft-yellow">JOURNEY</span> */}
            </>
          )}
        </motion.h1>

        {/* Elegant divider */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "120px" }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-6"
        />

        {/* Subtitle list of attributes */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xs sm:text-sm md:text-base font-sans tracking-wide text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("heroDesc")}
        </motion.p>

        {/* Action Button cluster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <button
            id="btn-hero-menu"
            onClick={() => onNavigate("menu")}
            className="w-full sm:w-auto bg-brand-gold hover:bg-yellow-500 text-black px-8 py-3.5 font-mono text-xs font-bold tracking-widest transition-all duration-300 rounded-none shadow-lg shadow-brand-gold/10 cursor-pointer hover:shadow-brand-gold/20 active:scale-[0.98]"
          >
            {t("heroDiscover")}
          </button>
          <button
            id="btn-hero-build"
            onClick={() => onNavigate("builder")}
            className="w-full sm:w-auto bg-brand-burgundy/40 hover:bg-brand-burgundy/60 text-white border border-brand-gold/25 hover:border-brand-gold px-8 py-3.5 font-mono text-xs font-bold tracking-widest transition-all duration-300 rounded-none cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ChefHat className="w-4 h-4 text-brand-gold" />
            <span>{t("builderTitle")}</span>
          </button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <motion.button
          id="btn-scroll-down"
          onClick={() => onNavigate("menu")}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="text-brand-gold hover:text-white transition-colors duration-300 focus:outline-none flex flex-col items-center cursor-pointer"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] text-gray-500 mb-2 uppercase">
            {isRtl ? "انزل للأسفل" : "Scroll down"}
          </span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
}
