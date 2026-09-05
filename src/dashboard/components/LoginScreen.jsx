import { useState, useEffect } from "react";
import { Lock, ShieldAlert, ChefHat, Globe } from "lucide-react";
import { Field, Button } from "../ui";
import { useDashboardLanguage } from "../DashboardLanguageContext";

export default function LoginScreen({ onLogin, lockedUntil }) {
  const { t, language, toggleLanguage, isRtl } = useDashboardLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!lockedUntil) {
      setSecondsLeft(0);
      return;
    }
    const update = () =>
      setSecondsLeft(Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 500);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const locked = secondsLeft > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked || busy) return;
    setBusy(true);
    setError("");
    const result = await onLogin(email, password);
    setBusy(false);
    if (!result.ok) {
      if (result.reason === "locked") {
        setError(t("errorLocked"));
      } else if (result.reason === "network") {
        setError(t("errorNetwork"));
      } else if (result.reason === "not_configured") {
        setError(t("errorNotConfigured"));
      } else {
        setError(t("errorInvalid"));
      }
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-burgundy/20 via-transparent to-transparent pointer-events-none" />

      <button
        onClick={toggleLanguage}
        className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono font-bold text-text-secondary hover:text-brand-gold transition-colors cursor-pointer`}
      >
        <Globe className="w-4 h-4 text-brand-gold" />
        <span>{language === "en" ? "العربية" : "English"}</span>
      </button>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-brand-burgundy/30 border border-brand-gold/30 flex items-center justify-center mb-4">
            <ChefHat className="w-7 h-7 text-brand-gold" />
          </div>
          <h1 className="font-serif text-2xl text-text-primary uppercase tracking-wide">
            {t("brandName")}
          </h1>
          <p className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase mt-1">
            {t("dashboardTitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-secondary border border-border-primary p-6 space-y-4"
        >
          <Field
            label={t("emailLabel")}
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={locked}
          />
          <Field
            label={t("passwordLabel")}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={locked}
          />

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-xs font-mono bg-red-950/40 border border-red-900/60 px-3 py-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {locked && (
            <p className="text-xs font-mono text-text-tertiary text-center">
              {t("lockedRetry", { seconds: secondsLeft })}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={busy || locked}>
            <Lock className="w-3.5 h-3.5" />
            {busy ? t("verifying") : t("signIn")}
          </Button>
        </form>

        <p className="text-center text-[10px] text-text-tertiary font-mono mt-6 tracking-wide">
          {t("restrictedAccess")}
        </p>
      </div>
    </div>
  );
}
