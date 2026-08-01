import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Users,
  Clock,
  Mail,
  User,
  Ticket,
  ChefHat,
  ShieldCheck,
} from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import {
  sanitizeInput,
  validateEmail,
  validateHoneypot,
  generateRecaptchaToken,
} from "../utils/securityUtils";

export default function ReservationSection() {
  const { t, isRtl, language } = useThemeLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "2026-07-10",
    time: "19:30",
    guests: 4,
    specialRequests: "",
  });
  const [botHp, setBotHp] = useState("");
  const [ticket, setTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Honeypot Anti-Bot Field
    if (!validateHoneypot(botHp)) {
      alert(
        isRtl ? "تم كشف نشاط آلي مشبوه." : "Automated bot activity detected.",
      );
      return;
    }

    setIsSubmitting(true);

    const cleanName = sanitizeInput(formData.name);
    const cleanEmail = sanitizeInput(formData.email);
    const cleanRequests = sanitizeInput(formData.specialRequests);

    // 2. Generate reCAPTCHA v3 Score Token
    const recaptchaToken = await generateRecaptchaToken("reservation");

    // Construct the email components according to user request
    const recipients = "adnan195662@gmail.com,info@pizzabakersyria.com";
    const subject = encodeURIComponent(
      `Table Reservation at Pizza Baker Syria - ${cleanName}`,
    );
    const bodyContent = `Hello Pizza Baker Syria Team,

I would like to book a table with the following details:

- Full Name: ${cleanName}
- Email Address: ${cleanEmail}
- Reservation Date: ${formData.date}
- Arrival Time: ${formData.time}
- Guest Size: ${formData.guests} people
- Special Requests: ${cleanRequests || "None"}
- Anti-Bot Token: ${recaptchaToken.slice(0, 15)}...

Please confirm my reservation. Thank you!`;

    const body = encodeURIComponent(bodyContent);
    const mailtoUrl = `mailto:${recipients}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      const newReservation = {
        id: `res-${Math.floor(Math.random() * 100000)}`,
        name: cleanName,
        email: cleanEmail,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        specialRequests: cleanRequests,
      };
      setTicket(newReservation);
      setIsSubmitting(false);

      // Open mail client to complete the booking
      window.location.href = mailtoUrl;
    }, 1200);
  };

  const handleReset = () => {
    setTicket(null);
    setFormData({
      name: "",
      email: "",
      date: "2026-07-10",
      time: "19:30",
      guests: 4,
      specialRequests: "",
    });
  };

  return (
    <section
      id="reservation"
      className="relative bg-bg-primary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {t("reservePreTitle")}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase mb-3">
            {t("reserveTitle")}
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-xl mx-auto leading-relaxed">
            {t("reserveDesc")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-bg-secondary border border-border-primary p-6 sm:p-10 relative transition-all">
          <div className="absolute inset-0 bg-brand-gold/[0.01] pointer-events-none" />

          <AnimatePresence mode="wait">
            {!ticket ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                      {t("fullName")}
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute ${isRtl ? "right-4" : "left-4"} top-3.5 w-4 h-4 text-brand-gold`}
                      />
                      <input
                        type="text"
                        required
                        id="input-res-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={t("fullNamePlaceholder")}
                        className={`w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-sm text-text-primary focus:outline-none focus:ring-0 placeholder-text-tertiary rounded-none transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                      {t("emailAddress")}
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute ${isRtl ? "right-4" : "left-4"} top-3.5 w-4 h-4 text-brand-gold`}
                      />
                      <input
                        type="email"
                        required
                        id="input-res-email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder={t("emailPlaceholder")}
                        className={`w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-sm text-text-primary focus:outline-none focus:ring-0 placeholder-text-tertiary rounded-none transition-colors`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Reservation Date */}
                  <div>
                    <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                      {t("arrivalDate")}
                    </label>
                    <div className="relative">
                      <Calendar
                        className={`absolute ${isRtl ? "right-4" : "left-4"} top-3.5 w-4 h-4 text-brand-gold`}
                      />
                      <input
                        type="date"
                        required
                        id="input-res-date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className={`w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm text-text-primary focus:outline-none focus:ring-0 rounded-none transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Reservation Time */}
                  <div>
                    <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                      {t("timeSlot")}
                    </label>
                    <div className="relative">
                      <Clock
                        className={`absolute ${isRtl ? "right-4" : "left-4"} top-3.5 w-4 h-4 text-brand-gold`}
                      />
                      <input
                        type="time"
                        required
                        id="input-res-time"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className={`w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-sm text-text-primary focus:outline-none focus:ring-0 rounded-none transition-colors`}
                      />
                    </div>
                  </div>

                  {/* Guests size Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-mono text-text-secondary tracking-wider block uppercase">
                        {t("guestNumber")}
                      </label>
                      <span className="font-mono text-xs font-bold text-brand-gold">
                        {formData.guests}{" "}
                        {language === "ar"
                          ? t("guestUnit")
                          : formData.guests === 1
                            ? "PERSON"
                            : "PEOPLE"}
                      </span>
                    </div>

                    <div className="relative flex items-center h-[50px] bg-bg-primary border border-border-primary px-4">
                      <Users
                        className={`w-4 h-4 text-brand-gold ${isRtl ? "ml-4" : "mr-4"} flex-shrink-0`}
                      />
                      <input
                        type="range"
                        min="1"
                        max="12"
                        id="input-res-guests"
                        value={formData.guests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guests: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-1 bg-white/15 appearance-none rounded-lg cursor-pointer accent-brand-gold focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="text-[10px] font-mono text-text-secondary tracking-wider block mb-2 uppercase">
                    {isRtl
                      ? "طلبات خاصة (اختياري)"
                      : "SPECIAL REQUESTS (OPTIONAL)"}
                  </label>
                  <textarea
                    rows={3}
                    id="input-res-requests"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder={
                      isRtl
                        ? "مثال: طاولة قرب الفرن الحجري، إطلالة على الشارع، ملاحظات الحساسية..."
                        : "E.g. Table near the woodfired brick oven, window view, allergy notes..."
                    }
                    className="w-full bg-bg-primary border border-border-primary hover:border-white/20 focus:border-brand-gold p-3.5 text-sm text-text-primary focus:outline-none focus:ring-0 placeholder-text-tertiary rounded-none transition-colors resize-none"
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

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-submit-reservation"
                  disabled={isSubmitting}
                  className="w-full bg-brand-gold hover:bg-yellow-500 text-black py-4 font-mono text-xs font-bold tracking-widest transition-all duration-300 rounded-none flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      />
                      <span>
                        {isRtl
                          ? "جاري تحضير بريد الحجز..."
                          : "PREPARING RESERVATION EMAIL..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <ChefHat className="w-4 h-4" />
                      <span>
                        {isRtl
                          ? "تأكيد الحجز عبر البريد الإلكتروني"
                          : "SECURE RESERVATION BY EMAIL"}
                      </span>
                    </>
                  )}
                </button>

                {/* reCAPTCHA v3 & Anti-Bot Protection Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-text-tertiary">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isRtl
                      ? "محمي بواسطة Google reCAPTCHA v3 ودرع حظر البوتات"
                      : "Protected by Google reCAPTCHA v3 & Anti-Bot Guard"}
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 px-4"
              >
                {/* Successful Table Ticket style */}
                <div className="max-w-md mx-auto bg-bg-primary border-2 border-brand-gold p-8 relative shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-burgundy via-brand-gold to-brand-burgundy" />

                  <div className="w-14 h-14 bg-brand-gold/10 border border-brand-gold/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Ticket className="w-6 h-6 text-brand-gold" />
                  </div>

                  <h3 className="font-serif text-2xl text-text-primary font-normal mb-1 tracking-wide uppercase">
                    {isRtl ? "تم بدء البريد" : "EMAIL INITIATED"}
                  </h3>
                  <p className="text-[10px] font-mono text-brand-gold tracking-widest uppercase mb-6">
                    PIZZA BAKER SYRIA
                  </p>

                  <div className="space-y-4 border-t border-b border-border-primary py-5 text-left mb-6 font-mono text-xs text-text-primary">
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">
                        {isRtl ? "رقم المرجع" : "REFERENCE ID"}
                      </span>
                      <span className="text-text-primary font-bold">
                        {ticket.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">
                        {isRtl ? "الاسم الكامل" : "FULL NAME"}
                      </span>
                      <span className="text-text-primary font-bold">
                        {ticket.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">
                        {isRtl ? "عدد الأشخاص" : "PARTY SIZE"}
                      </span>
                      <span className="text-text-primary font-bold text-brand-gold">
                        {ticket.guests}{" "}
                        {language === "ar" ? t("guestUnit") : "PEOPLE"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary uppercase">
                        {isRtl ? "التاريخ والوقت" : "DATE & TIME"}
                      </span>
                      <span className="text-text-primary font-bold">
                        {ticket.date} @ {ticket.time}
                      </span>
                    </div>
                    {ticket.specialRequests && (
                      <div className="border-t border-border-primary pt-3 mt-3">
                        <span className="text-text-secondary uppercase block mb-1">
                          {isRtl ? "ملاحظات خاصة" : "NOTES"}
                        </span>
                        <p className="text-text-secondary italic text-[11px] font-sans leading-relaxed">
                          &quot;{ticket.specialRequests}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-text-secondary font-sans text-xs italic font-light mb-6">
                    {isRtl ? (
                      <span>
                        لقد قمنا بفتح تطبيق البريد الإلكتروني الخاص بك لإرسال
                        الحجز إلى{" "}
                        <strong className="text-text-primary">
                          adnan195662@gmail.com
                        </strong>{" "}
                        و{" "}
                        <strong className="text-text-primary">
                          info@pizzabakersyria.com
                        </strong>
                        .
                      </span>
                    ) : (
                      <span>
                        We have launched your email client to send this booking
                        to{" "}
                        <strong className="text-text-primary">
                          adnan195662@gmail.com
                        </strong>{" "}
                        and{" "}
                        <strong className="text-text-primary">
                          info@pizzabakersyria.com
                        </strong>
                        .
                      </span>
                    )}
                  </div>

                  <button
                    id="btn-book-another"
                    onClick={handleReset}
                    className="bg-transparent border border-border-primary hover:border-brand-gold hover:text-brand-gold text-text-secondary px-6 py-2.5 font-mono text-[10px] tracking-widest font-bold transition-colors cursor-pointer"
                  >
                    {isRtl ? "حجز طاولة أخرى" : "BOOK ANOTHER TABLE"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
