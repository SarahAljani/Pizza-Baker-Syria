import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Check,
  ShieldCheck,
  MapPin,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { SITE_SETTINGS } from "../data";
import {
  generateRecaptchaToken,
  getCachedCSRFToken,
} from "../utils/securityUtils";
import { requestUserLocation } from "../utils/geolocation";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationErrorReason, setLocationErrorReason] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const { t, isRtl, language } = useThemeLanguage();

  const LOCATION_ERROR_MESSAGES = {
    denied: {
      en: "Location access was blocked. Please allow location for this site in your browser's site settings, then tap Checkout again.",
      ar: "تم حظر الوصول إلى الموقع. الرجاء السماح بالوصول للموقع من إعدادات المتصفح، ثم اضغط على إتمام الطلب مرة أخرى.",
    },
    timeout: {
      en: "Couldn't get your location in time. Please check that Location Services are turned on for your device and browser, then try again.",
      ar: "تعذر تحديد موقعك في الوقت المناسب. الرجاء التأكد من تفعيل خدمة الموقع (Location Services) على جهازك والمتصفح، ثم حاول مرة أخرى.",
    },
    unavailable: {
      en: "Couldn't determine your location. Please check that Location Services are turned on for your device and browser, then try again.",
      ar: "تعذر تحديد موقعك. الرجاء التأكد من تفعيل خدمة الموقع (Location Services) على جهازك والمتصفح، ثم حاول مرة أخرى.",
    },
    unsupported: {
      en: "Your browser doesn't support sharing location, so we can't place this order here. Please try a different browser.",
      ar: "متصفحك لا يدعم مشاركة الموقع، لذا لا يمكن إتمام الطلب من هنا. الرجاء تجربة متصفح آخر.",
    },
  };

  const { fee: deliveryFeeAmount, freeThreshold } = SITE_SETTINGS.delivery;
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : deliveryFeeAmount;
  const total = subtotal + deliveryFee;

  // A GPS link when geolocation succeeded, or a customer-typed address when
  // it didn't — either way checkout always has *some* location line, never
  // "not shared", since staff need to know where to deliver either way.
  const buildOrderMessage = (locationLine) => {
    let messageText = "";
    if (language === "ar") {
      messageText = `مرحباً بيتزا بيكر! أود تقديم طلب بيتزا مميز (التركيز على المكونات الطازجة والصلصات المدهشة):\n\n`;
      messageText += `📍 *الموقع:* ${locationLine}\n\n`;
      cart.forEach((item, index) => {
        const itemSize =
          item.size === "small"
            ? "صغير"
            : item.size === "medium"
              ? "وسط"
              : item.size === "large"
                ? "كبير"
                : item.size === "thin"
                  ? "رقيقة"
                  : item.size === "three_pcs"
                    ? "٣ قطع"
                    : item.size === "six_pcs"
                      ? "٦ قطع"
                      : item.size === "standard"
                        ? "عادي"
                        : item.size || "عادي";
        const itemName = item.id.startsWith("custom-pizza")
          ? item.name
          : item.id.startsWith("pizza-")
            ? t(`pizzas.${item.id}.name`)
            : t(item.translationKey || item.id);
        messageText += `${index + 1}. *${itemName}* (حجم/نوع: ${itemSize})\n`;
        messageText += `   الكمية: ${item.quantity}\n`;
        messageText += `   السعر: ${item.price} ل.س للواحدة\n`;
        if (item.customToppings && item.customToppings.length > 0) {
          messageText += `   المكونات الإضافية:\n`;
          item.customToppings.forEach((top) => {
            messageText += `    - ${top}\n`;
          });
        }
        if (item.excludedIngredients && item.excludedIngredients.length > 0) {
          messageText += `   بدون: ${item.excludedIngredients.join("، ")}\n`;
        }
        if (item.addons && item.addons.length > 0) {
          messageText += `   إضافات: ${item.addons.map((a) => t(a.translationKey)).join("، ")}\n`;
        }
        messageText += `\n`;
      });
      messageText += `*القيمة الإجمالية للطلب:* ${total} ل.س\n`;
      if (deliveryFee === 0) {
        messageText += `*التوصيل:* مجاني\n`;
      } else {
        messageText += `*رسوم التوصيل:* ${deliveryFee} ل.س\n`;
      }
      messageText += `\nالرجاء تأكيد الطلب والبدء في إعداد رحلة البيتزا الاستثنائية من الصفر فوراً! شكراً لكم!`;
    } else {
      messageText = `Hello Pizza Baker! I would like to place a new signature pizza order featuring premium ingredients and rich sauces:\n\n`;
      messageText += `📍 *Location:* ${locationLine}\n\n`;
      cart.forEach((item, index) => {
        const itemSize =
          item.size === "small"
            ? "SMALL"
            : item.size === "medium"
              ? "MEDIUM"
              : item.size === "large"
                ? "LARGE"
                : item.size === "thin"
                  ? "THIN"
                  : item.size === "three_pcs"
                    ? "3 PIECES"
                    : item.size === "six_pcs"
                      ? "6 PIECES"
                      : item.size === "standard"
                        ? "STANDARD"
                        : item.size
                          ? item.size.toUpperCase()
                          : "STANDARD";
        messageText += `${index + 1}. *${item.name}* (${itemSize})\n`;
        messageText += `   Quantity: ${item.quantity}\n`;
        messageText += `   Price: ${item.price} SYP each\n`;
        if (item.customToppings && item.customToppings.length > 0) {
          messageText += `   Toppings:\n`;
          item.customToppings.forEach((top) => {
            messageText += `    - ${top}\n`;
          });
        }
        if (item.excludedIngredients && item.excludedIngredients.length > 0) {
          messageText += `   Without: ${item.excludedIngredients.join(", ")}\n`;
        }
        if (item.addons && item.addons.length > 0) {
          messageText += `   Added: ${item.addons.map((a) => t(a.translationKey)).join(", ")}\n`;
        }
        messageText += `\n`;
      });
      messageText += `*Total Order Value:* ${total} SYP\n`;
      if (deliveryFee === 0) {
        messageText += `*Delivery:* FREE\n`;
      } else {
        messageText += `*Delivery Fee:* ${deliveryFee} SYP\n`;
      }
      messageText += `\nPlease confirm and begin crafting my custom pizza journey order!`;
    }

    return messageText;
  };

  const openWhatsAppWithMessage = (messageText) => {
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${SITE_SETTINGS.whatsappNumber}&text=${encodedText}`;

    setCheckoutStep("success");

    // Navigate the current tab rather than opening a new one. Opening a
    // blank tab up front (to dodge popup blockers around the earlier
    // `await`) was the previous approach, but on mobile that backgrounds
    // the tab the geolocation permission prompt needs to appear in — many
    // mobile browsers refuse to show that prompt (or throttle JS entirely)
    // in a tab that's no longer focused, which is exactly why this worked
    // on desktop but not on phones. A same-tab redirect has no popup-blocker
    // risk in the first place, since it's not opening anything new.
    window.location.href = whatsappUrl;
  };

  const handleCheckout = async () => {
    setLocationErrorReason(null);
    setGettingLocation(true);
    const locationResult = await requestUserLocation();
    setGettingLocation(false);

    if (locationResult.success) {
      openWhatsAppWithMessage(buildOrderMessage(locationResult.link));
      return;
    }

    // Browser geolocation is genuinely unreliable — permission can be
    // granted and it can still fail (OS-level Location Services off, no
    // GPS/network fix available, etc.). Rather than block a real order
    // over that, fall back to asking the customer to type their address
    // instead of giving up entirely.
    setLocationErrorReason(locationResult.reason);
  };

  const handleManualAddressCheckout = () => {
    if (!manualAddress.trim()) return;
    openWhatsAppWithMessage(buildOrderMessage(manualAddress.trim()));
  };

  const handleReset = () => {
    onClearCart();
    setCheckoutStep("cart");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Sliding drawer sheet */}
          <motion.div
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed ${isRtl ? "left-0 border-r" : "right-0 border-l"} top-0 bottom-0 w-full max-w-md bg-bg-secondary border-border-primary z-50 flex flex-col justify-between shadow-2xl transition-colors duration-300`}
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            {/* Drawer Header */}
            <div className="bg-bg-primary border-b border-border-primary p-5 flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                <h2 className="font-mono text-xs font-bold tracking-widest text-text-primary uppercase">
                  {checkoutStep === "cart" && t("yourBasket")}
                  {checkoutStep === "success" && t("orderCompleted")}
                </h2>
              </div>
              <button
                id="btn-close-cart"
                aria-label="Close Basket"
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main drawer body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scroll">
              {checkoutStep === "cart" && (
                <>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-text-tertiary border border-border-primary">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-lg text-text-primary font-medium">
                        {t("basketIsEmpty")}
                      </h3>
                      <p className="text-xs text-text-secondary max-w-xs font-sans leading-relaxed">
                        {t("basketEmptyDesc")}
                      </p>
                      <button
                        id="btn-cart-empty-close"
                        onClick={onClose}
                        className="bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-all px-5 py-2 font-mono text-[10px] tracking-widest font-bold cursor-pointer"
                      >
                        {t("browseMenu")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div
                          key={item.lineKey}
                          className="flex items-start justify-between border-b border-border-primary pb-5 last:border-0 last:pb-0 transition-colors"
                        >
                          <div className="space-y-1.5 flex-1 pr-4 pl-4 text-start">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-serif text-base text-text-primary font-medium tracking-wide">
                                {item.id.startsWith("custom-pizza")
                                  ? item.name
                                  : item.id.startsWith("pizza-")
                                    ? language === "ar"
                                      ? t(`pizzas.${item.id}.name`)
                                      : item.name
                                    : language === "ar"
                                      ? t(item.translationKey || item.id)
                                      : item.name}
                              </h3>
                              <span className="bg-brand-burgundy border border-brand-gold/30 text-brand-soft-yellow font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-wider uppercase">
                                {t(item.size)}
                              </span>
                            </div>

                            {/* Custom toppings composition */}
                            {item.customToppings &&
                              item.customToppings.length > 0 && (
                                <div className="bg-bg-primary border border-border-primary p-2 rounded text-[10px] text-text-secondary font-mono space-y-0.5 transition-colors">
                                  <span className="text-text-tertiary block uppercase font-bold mb-1">
                                    {t("composition")}:
                                  </span>
                                  {item.customToppings.map((top, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1"
                                    >
                                      <span className="text-brand-gold">›</span>
                                      <span>{top}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Removed ingredients for a customized pizza */}
                            {item.excludedIngredients &&
                              item.excludedIngredients.length > 0 && (
                                <div className="bg-bg-primary border border-border-primary p-2 rounded text-[10px] text-text-secondary font-mono space-y-0.5 transition-colors">
                                  <span className="text-text-tertiary block uppercase font-bold mb-1">
                                    {isRtl ? "بدون" : "Without"}:
                                  </span>
                                  {item.excludedIngredients.map((ing, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1"
                                    >
                                      <span className="text-red-400">×</span>
                                      <span>{ing}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Sauces/drinks added to a customized pizza */}
                            {item.addons && item.addons.length > 0 && (
                              <div className="bg-bg-primary border border-border-primary p-2 rounded text-[10px] text-text-secondary font-mono space-y-0.5 transition-colors">
                                <span className="text-text-tertiary block uppercase font-bold mb-1">
                                  {isRtl ? "إضافات" : "Added"}:
                                </span>
                                {item.addons.map((addon, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1"
                                  >
                                    <span className="text-brand-gold">+</span>
                                    <span>
                                      {t(addon.translationKey)} ({addon.price} {isRtl ? "ل.س" : "SYP"})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <span className="font-mono text-xs text-brand-gold font-bold block">
                              {item.price} {isRtl ? "ل.س" : "SYP"}{" "}
                              {isRtl ? "للوحدة" : "each"}
                            </span>
                          </div>

                          {/* Quantity selector */}
                          <div className="flex flex-col items-end gap-2.5">
                            <div className="flex items-center border border-border-primary bg-bg-primary transition-colors">
                              <button
                                id={`btn-cart-minus-${item.lineKey}`}
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  onUpdateQuantity(item.lineKey, -1)
                                }
                                className="px-2 py-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 font-mono text-xs text-text-primary font-bold">
                                {item.quantity}
                              </span>
                              <button
                                id={`btn-cart-plus-${item.lineKey}`}
                                aria-label="Increase quantity"
                                onClick={() =>
                                  onUpdateQuantity(item.lineKey, 1)
                                }
                                className="px-2 py-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              id={`btn-cart-remove-${item.lineKey}`}
                              onClick={() => onRemoveItem(item.lineKey)}
                              className="text-[10px] font-mono text-text-tertiary hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{t("remove")}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Success order dispatched state */}
              {checkoutStep === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-text-primary font-normal uppercase">
                      {t("whatsappInitiated")}
                    </h3>
                    <p className="text-[10px] font-mono text-brand-gold tracking-widest uppercase">
                      {t("preparingInOven")}
                    </p>
                  </div>

                  {/* Receipt overview */}
                  <div className="bg-bg-primary border border-border-primary p-5 w-full font-mono text-xs text-start text-text-secondary space-y-2.5 transition-colors">
                    <div className="text-center border-b border-border-primary pb-3 mb-2">
                      <span className="font-serif text-sm text-text-primary font-bold block uppercase tracking-wider">
                        {isRtl
                          ? "فاتورة خباز البيتزا سوريا"
                          : "PIZZA BAKER SYRIA RECEIPT"}
                      </span>
                      <span className="text-[9px] text-text-tertiary block mt-0.5">
                        JULY 05, 2026 - UTC
                      </span>
                    </div>

                    {cart.map((item) => (
                      <div
                        key={item.lineKey}
                        className="flex justify-between"
                      >
                        <span>
                          {item.quantity}x{" "}
                          {item.id.startsWith("custom-pizza")
                            ? item.name
                            : item.id.startsWith("pizza-")
                              ? language === "ar"
                                ? t(`pizzas.${item.id}.name`)
                                : item.name
                              : language === "ar"
                                ? t(item.translationKey || item.id)
                                : item.name}{" "}
                          ({t(item.size).toUpperCase()})
                        </span>
                        <span className="text-text-primary">
                          {item.price * item.quantity} {isRtl ? "ل.س" : "SYP"}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-border-primary pt-3 mt-3 space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span>{t("subtotal")}</span>
                        <span>
                          {subtotal} {isRtl ? "ل.س" : "SYP"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>{t("delivery")}</span>
                        <span>
                          {deliveryFee === 0
                            ? t("free")
                            : `${deliveryFee} ${isRtl ? "ل.س" : "SYP"}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-text-primary font-bold text-sm border-t border-dashed border-border-primary pt-2">
                        <span>{t("totalComp")}</span>
                        <span className="text-brand-gold">
                          {total} {isRtl ? "ل.س" : "SYP"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary italic max-w-xs font-sans leading-relaxed">
                    {t("redirectWarning")}
                  </p>

                  <button
                    id="btn-basket-done"
                    onClick={handleReset}
                    className="w-full bg-brand-gold hover:bg-yellow-500 text-black py-3.5 font-mono text-xs font-bold tracking-widest transition-all cursor-pointer"
                  >
                    {t("placeAnother")}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom calculation summary */}
            {checkoutStep === "cart" && cart.length > 0 && (
              <div className="bg-bg-primary border-t border-border-primary p-5 space-y-4 transition-colors">
                <div className="space-y-2 font-mono text-xs text-text-secondary text-start">
                  <div className="flex justify-between">
                    <span>{t("subtotal")}</span>
                    <span className="text-text-primary">
                      {subtotal} {isRtl ? "ل.س" : "SYP"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("delivery")}</span>
                    <span className="text-text-primary">
                      {deliveryFee === 0 ? (
                        <span className="text-green-400 font-bold">
                          {t("free")}
                        </span>
                      ) : (
                        `${deliveryFee} ${isRtl ? "ل.س" : "SYP"}`
                      )}
                    </span>
                  </div>

                  {subtotal < freeThreshold && (
                    <span
                      className={`text-[9px] font-sans text-brand-gold block ${isRtl ? "text-left" : "text-right"}`}
                    >
                      {language === "ar" ? (
                        <span>
                          أضف بقيمة{" "}
                          <strong className="text-text-primary font-semibold">
                            {freeThreshold - subtotal} ل.س
                          </strong>{" "}
                          إضافية للتوصيل المجاني!
                        </span>
                      ) : (
                        <span>
                          Add{" "}
                          <strong className="text-white font-semibold">
                            {freeThreshold - subtotal} SYP
                          </strong>{" "}
                          more for FREE delivery!
                        </span>
                      )}
                    </span>
                  )}

                  <div className="border-t border-border-primary pt-3 mt-3 flex justify-between text-text-primary font-bold text-sm">
                    <span>{isRtl ? "المجموع الإجمالي" : "TOTAL ORDER"}</span>
                    <span className="text-brand-gold">
                      {total} {isRtl ? "ل.س" : "SYP"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    id="btn-drawer-checkout"
                    onClick={handleCheckout}
                    disabled={gettingLocation}
                    className="flex-1 bg-brand-gold hover:bg-yellow-500 text-black py-4 font-mono text-xs font-bold tracking-widest transition-all rounded-none flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/5 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>
                          {isRtl ? "جارٍ تحديد الموقع..." : "Getting your location..."}
                        </span>
                      </>
                    ) : (
                      <span>{t("checkoutWhatsApp")}</span>
                    )}
                  </button>

                  {locationErrorReason && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-red-400 text-[11px] font-sans leading-relaxed bg-red-950/40 border border-red-900/60 px-3 py-2.5">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{LOCATION_ERROR_MESSAGES[locationErrorReason][language]}</span>
                      </div>

                      <div className="space-y-2 bg-bg-primary border border-border-primary px-3 py-3">
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold block font-bold uppercase">
                          {isRtl ? "أو اكتب عنوان التوصيل" : "Or type your delivery address"}
                        </span>
                        <input
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                          placeholder={isRtl ? "الحي، الشارع، أقرب معلم..." : "Neighborhood, street, nearest landmark..."}
                          className="w-full bg-bg-secondary border border-border-primary focus:border-brand-gold text-text-primary text-sm px-3 py-2.5 focus:outline-none placeholder-text-tertiary rounded-none"
                        />
                        <button
                          onClick={handleManualAddressCheckout}
                          disabled={!manualAddress.trim()}
                          className="w-full bg-brand-gold hover:bg-yellow-500 text-black py-2.5 font-mono text-[11px] font-bold tracking-widest transition-all rounded-none cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isRtl ? "متابعة عبر الواتساب" : "Continue via WhatsApp"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-text-tertiary">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                    <span>
                      {isRtl
                        ? "موقعك مطلوب لإتمام الطلب عبر الواتساب"
                        : "Your location is required to complete the order via WhatsApp"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-text-tertiary">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {isRtl
                        ? "محمي بـ Google reCAPTCHA v3 وتشفير الطلبات"
                        : "Protected by Google reCAPTCHA v3 & Encrypted Checkout"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
