import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useDashboardLanguage } from "./DashboardLanguageContext";

// ---- Basic form atoms, styled to match the public site's visual identity ----

export function Label({ children, hint }) {
  return (
    <label className="block mb-1.5">
      <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold uppercase">
        {children}
      </span>
      {hint && (
        <span className="block text-[10px] text-text-tertiary font-sans normal-case tracking-normal mt-0.5">
          {hint}
        </span>
      )}
    </label>
  );
}

const inputClasses =
  "w-full bg-bg-primary border border-border-primary focus:border-brand-gold text-text-primary text-sm px-3 py-2.5 focus:outline-none placeholder-text-tertiary transition-colors rounded-none";

export function Field({ label, hint, ...props }) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <input className={inputClasses} {...props} />
    </div>
  );
}

export function TextArea({ label, hint, rows = 3, ...props }) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <textarea rows={rows} className={`${inputClasses} resize-y`} {...props} />
    </div>
  );
}

export function Select({ label, hint, children, ...props }) {
  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <select className={inputClasses} {...props}>
        {children}
      </select>
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase transition-all rounded-none cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-gold hover:bg-yellow-500 text-black",
    secondary:
      "bg-transparent border border-border-secondary hover:border-brand-gold text-text-primary",
    danger: "bg-red-900/80 hover:bg-red-800 text-white border border-red-700",
    ghost: "bg-transparent hover:bg-white/5 text-text-secondary",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ---- Modal ----

export function Modal({ title, onClose, children, wide }) {
  const { t, isRtl } = useDashboardLanguage();
  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`bg-bg-secondary border border-border-secondary w-full ${wide ? "max-w-3xl" : "max-w-lg"} my-6 shadow-2xl`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border-primary">
          <h3 className="font-serif text-lg sm:text-xl text-text-primary uppercase tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-brand-gold transition-colors cursor-pointer"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, danger }) {
  const { t } = useDashboardLanguage();
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel || t("confirm")}
        </Button>
      </div>
    </Modal>
  );
}

// ---- Toast notifications ----

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 border shadow-xl font-mono text-xs font-bold tracking-wide max-w-sm ${
              t.type === "error"
                ? "bg-red-950 border-red-700 text-red-100"
                : "bg-bg-secondary border-brand-gold/40 text-text-primary"
            }`}
          >
            {t.type === "error" ? (
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ---- Layout helpers ----

export function SectionCard({ title, subtitle, actions, children }) {
  return (
    <div className="bg-bg-secondary border border-border-primary">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-border-primary">
        <div>
          <h2 className="font-serif text-xl text-text-primary uppercase tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function ImagePicker({ value, onChange, onFile, label, loading }) {
  const { t } = useDashboardLanguage();
  return (
    <div>
      <Label>{label ?? t("imageLabel")}</Label>
      <div className="flex items-start gap-3">
        <div className="relative w-20 h-20 flex-shrink-0 bg-bg-primary border border-border-primary overflow-hidden">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary text-[9px] font-mono uppercase">
              {t("noImage")}
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-brand-gold animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className={inputClasses}
            placeholder={t("pasteImageUrl")}
            value={value?.startsWith("data:") ? "" : value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
          />
          <label
            className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wide ${loading ? "text-text-tertiary cursor-wait" : "text-text-secondary hover:text-brand-gold cursor-pointer"}`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
                e.target.value = "";
              }}
            />
            {loading ? t("uploading") : t("uploadPhotoHint")}
          </label>
        </div>
      </div>
    </div>
  );
}
