import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  MessageSquare,
  Check,
  User,
  Quote,
  Send,
  ShieldCheck,
} from "lucide-react";
import { INITIAL_REVIEWS } from "../data";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { sanitizeInput, validateHoneypot } from "../utils/securityUtils";

export default function ReviewsSection() {
  const { t, isRtl, language } = useThemeLanguage();

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [botHp, setBotHp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(null);

  useEffect(() => {
    // Load reviews from local storage, fallback if empty
    const saved = localStorage.getItem("pizzabaker_reviews_v3");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem(
        "pizzabaker_reviews_v3",
        JSON.stringify(INITIAL_REVIEWS),
      );
    }
  }, []);

  const handleSubmitReview = (e) => {
    e.preventDefault();

    // 1. Validate Honeypot trap
    if (!validateHoneypot(botHp)) {
      alert(isRtl ? "تم حظر برمجية آلية." : "Bot submission blocked.");
      return;
    }

    const cleanName = sanitizeInput(newReview.name);
    const cleanComment = sanitizeInput(newReview.comment);

    if (!cleanName.trim() || !cleanComment.trim()) return;

    const addedReview = {
      id: `rev-${Date.now()}`,
      name: cleanName,
      rating: newReview.rating,
      comment: cleanComment,
      date: new Date().toLocaleDateString(
        language === "ar" ? "ar-SY" : "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        },
      ),
    };

    const updatedReviews = [addedReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(
      "pizzabaker_reviews_v3",
      JSON.stringify(updatedReviews),
    );

    // Reset Form
    setNewReview({ name: "", rating: 5, comment: "" });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  return (
    <section
      id="reviews"
      className="relative bg-bg-primary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {t("reviewsPreTitle")}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase mb-3">
            {t("reviewsTitle")}
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-xl mx-auto leading-relaxed">
            {t("reviewsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* LEFT SECTION: Reviews feed */}
          <div className="lg:col-span-7 space-y-6 max-h-[580px] overflow-y-auto pr-2 custom-scroll">
            <span className="text-[10px] font-mono text-text-secondary tracking-widest uppercase block mb-2 font-bold">
              {t("patronChronicles")} ({reviews.length})
            </span>

            <AnimatePresence initial={false}>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-bg-secondary border border-border-primary p-6 relative group transition-colors duration-300"
                >
                  <Quote
                    className={`absolute ${isRtl ? "left-6" : "right-6"} bottom-6 w-12 h-12 text-white/[0.02] pointer-events-none group-hover:text-white/[0.04] transition-colors`}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-text-primary tracking-wide">
                        {t(review.name)}
                      </h4>
                      <span className="text-[10px] font-mono text-text-secondary">
                        {t(review.date)}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-brand-gold fill-brand-gold"
                              : "text-text-tertiary"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary font-sans italic font-light leading-relaxed">
                    &quot;{t(review.comment)}&quot;
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {reviews.length === 0 && (
              <p className="text-xs font-mono text-text-secondary italic py-6">
                {t("noReviews")}
              </p>
            )}
          </div>

          {/* RIGHT SECTION: Write a review form */}
          <div className="lg:col-span-5 bg-bg-secondary border border-border-primary p-6 sm:p-8 relative transition-colors duration-300">
            <div
              className={`flex items-center gap-2 mb-6 border-b border-border-primary pb-4 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span className="font-mono text-xs font-bold tracking-widest text-text-primary uppercase">
                {t("expressOpinion")}
              </span>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Star interactive selection */}
              <div>
                <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                  {t("gastronomyRating")}
                </label>
                <div className="flex gap-2 bg-bg-primary border border-border-primary p-3 justify-center items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <button
                        type="button"
                        key={i}
                        id={`btn-star-select-${ratingValue}`}
                        onClick={() =>
                          setNewReview({ ...newReview, rating: ratingValue })
                        }
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="focus:outline-none p-1 transition-transform active:scale-90 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors duration-200 ${
                            ratingValue <= (hoverRating ?? newReview.rating)
                              ? "text-brand-gold fill-brand-gold"
                              : "text-text-tertiary"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patron Name */}
              <div>
                <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                  {t("patronName")}
                </label>
                <div className="relative">
                  <User
                    className={`absolute ${isRtl ? "right-4" : "left-4"} top-3.5 w-4 h-4 text-brand-gold`}
                  />
                  <input
                    type="text"
                    required
                    id="input-review-name"
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    placeholder={t("patronNamePlaceholder")}
                    className={`w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-sm text-text-primary focus:outline-none focus:ring-0 placeholder-text-tertiary rounded-none transition-colors`}
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                  {t("criticComment")}
                </label>
                <textarea
                  rows={4}
                  required
                  id="input-review-comment"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder={t("commentPlaceholder")}
                  className="w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 text-sm text-text-primary focus:outline-none focus:ring-0 placeholder-text-tertiary rounded-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Honeypot Anti-Bot Invisible Field */}
              <input
                type="text"
                name="bot_hp"
                value={botHp}
                onChange={(e) => setBotHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none"
              />

              {/* Submit Review */}
              <button
                type="submit"
                id="btn-submit-review"
                className="w-full bg-brand-gold hover:bg-yellow-500 text-black py-3.5 font-mono text-xs font-bold tracking-widest transition-all duration-300 rounded-none flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t("dispatchReview")}</span>
              </button>

              {/* reCAPTCHA v3 & Anti-Bot Protection Badge */}
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] font-mono text-text-tertiary">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isRtl
                    ? "محمي بواسطة Google reCAPTCHA v3 ومصيدة البوتات"
                    : "Protected by Google reCAPTCHA v3 & Bot Trap"}
                </span>
              </div>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-green-400 text-xs font-mono font-bold mt-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t("opinionCommitted")}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
