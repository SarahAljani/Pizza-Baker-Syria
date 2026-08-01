import { Facebook, Instagram, MessageCircle, ShieldCheck } from "lucide-react";
import { IMAGES } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function Footer({
  onNavigate,
  onOpenReservation,
  onOpenSecurity,
}) {
  const { t, isRtl } = useThemeLanguage();

  const footerLinks = [
    { labelKey: "home", section: "hero" },
    { labelKey: "menu", section: "menu" },
    { labelKey: "builder", section: "builder" },
    { labelKey: "reviews", section: "reviews" },
    { labelKey: "bookTable", section: "reservation" },
  ];

  const handleLinkClick = (sectionId) => {
    if (sectionId === "reservation") {
      onOpenReservation();
    } else {
      onNavigate(sectionId);
    }
  };

  return (
    <footer
      id="footer"
      className="relative text-text-primary py-16 sm:py-24 px-4 overflow-hidden border-t border-border-primary transition-colors duration-300"
      style={{
        backgroundImage: `url(${IMAGES.footerBg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-translucent overlay to blend the ingredients backdrop based on the active theme */}
      <div className="absolute inset-0 bg-bg-primary/85 dark:bg-bg-primary/90 z-0 transition-colors duration-300" />

      {/* Footer contents */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Navigation Links */}
        <div
          className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 text-[11px] font-mono tracking-[0.2em] font-bold text-text-primary ${isRtl ? "flex-row-reverse" : ""}`}
        >
          {footerLinks.map((link, idx) => (
            <button
              key={idx}
              id={`footer-link-${idx}`}
              onClick={() => handleLinkClick(link.section)}
              className="hover:text-brand-gold transition-colors duration-300 relative uppercase cursor-pointer"
            >
              {t(link.labelKey)}
            </button>
          ))}
        </div>

        {/* Feedback email line */}
        <p className="text-xs sm:text-sm font-sans tracking-wide text-text-secondary mb-6 font-medium">
          {t("footerFeedback")}{" "}
          <a
            href="mailto:info@pizzabakersyria.com"
            id="footer-email-link"
            className="text-brand-gold hover:text-yellow-500 font-bold transition-colors cursor-pointer underline"
          >
            info@pizzabakersyria.com
          </a>
        </p>

        {/* Social Media icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <a
            href="https://facebook.com"
            id="footer-social-fb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-9 h-9 bg-text-primary hover:bg-brand-gold text-bg-primary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
          >
            <Facebook className="w-4 h-4 fill-current" strokeWidth={0} />
          </a>
          <a
            href="https://instagram.com"
            id="footer-social-ig"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 bg-text-primary hover:bg-brand-gold text-bg-primary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/963939333189"
            id="footer-social-wa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-9 h-9 bg-text-primary hover:bg-brand-gold text-bg-primary rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
            title="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        {/* Brand narrative */}
        <p className="text-xs sm:text-sm font-sans font-light italic leading-relaxed text-text-secondary max-w-2xl mb-8">
          {t("footerDesc")}
        </p>

        {/* Copyright notice & Security badge */}
        <div className="h-[1px] w-1/4 bg-border-primary mb-6 transition-colors duration-300" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-[10px] font-mono tracking-widest text-text-tertiary">
            {t("footerCopyright")}
          </p>
          <button
            onClick={onOpenSecurity}
            id="btn-footer-security"
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[10px] rounded-full border border-emerald-500/30 transition-all cursor-pointer shadow-sm hover:scale-105"
            title="Inspect Website Security Shield"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isRtl
                ? "حماية الموقع مفعلة 100%"
                : "Security Shield Active 100%"}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
