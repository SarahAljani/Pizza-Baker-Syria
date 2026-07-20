import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag, Check } from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const { t, isRtl, language } = useThemeLanguage();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal >= 3000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    // Construct WhatsApp message content
    let messageText = "";
    if (language === "ar") {
      messageText = `مرحباً بيتزا بيكر! أود تقديم طلب بيتزا مميز (التركيز على المكونات الطازجة والصلصات المدهشة):\n\n`;
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
        messageText += `${index + 1}. *${item.name}* (حجم/نوع: ${itemSize})\n`;
        messageText += `   الكمية: ${item.quantity}\n`;
        messageText += `   السعر: ${item.price} ل.س للواحدة\n`;
        if (item.customToppings && item.customToppings.length > 0) {
          messageText += `   المكونات الإضافية:\n`;
          item.customToppings.forEach((top) => {
            messageText += `    - ${top}\n`;
          });
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

    const encodedText = encodeURIComponent(messageText);
    // Syrian WhatsApp number provided: 0939333189 -> International format: 963939333189
    const whatsappUrl = `https://api.whatsapp.com/send?phone=963939333189&text=${encodedText}`;

    // Switch step to success
    setCheckoutStep("success");

    // Redirect to WhatsApp chat
    window.open(whatsappUrl, "_blank");
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
                <span className="font-mono text-xs font-bold tracking-widest text-text-primary uppercase">
                  {checkoutStep === "cart" && t("yourBasket")}
                  {checkoutStep === "success" && t("orderCompleted")}
                </span>
              </div>
              <button
                id="btn-close-cart"
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
                      <h4 className="font-serif text-lg text-text-primary font-medium">
                        {t("basketIsEmpty")}
                      </h4>
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
                          key={`${item.id}-${item.size}`}
                          className="flex items-start justify-between border-b border-border-primary pb-5 last:border-0 last:pb-0 transition-colors"
                        >
                          <div className="space-y-1.5 flex-1 pr-4 pl-4 text-start">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif text-base text-text-primary font-medium tracking-wide">
                                {item.name}
                              </h4>
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

                            <span className="font-mono text-xs text-brand-gold font-bold block">
                              {item.price} {isRtl ? "ل.س" : "SYP"}{" "}
                              {isRtl ? "للوحدة" : "each"}
                            </span>
                          </div>

                          {/* Quantity selector */}
                          <div className="flex flex-col items-end gap-2.5">
                            <div className="flex items-center border border-border-primary bg-bg-primary transition-colors">
                              <button
                                id={`btn-cart-minus-${item.id}-${item.size}`}
                                onClick={() =>
                                  onUpdateQuantity(item.id, item.size, -1)
                                }
                                className="px-2 py-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 font-mono text-xs text-text-primary font-bold">
                                {item.quantity}
                              </span>
                              <button
                                id={`btn-cart-plus-${item.id}-${item.size}`}
                                onClick={() =>
                                  onUpdateQuantity(item.id, item.size, 1)
                                }
                                className="px-2 py-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              id={`btn-cart-remove-${item.id}-${item.size}`}
                              onClick={() => onRemoveItem(item.id, item.size)}
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
                    <h4 className="font-serif text-2xl text-text-primary font-normal uppercase">
                      {t("whatsappInitiated")}
                    </h4>
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
                        key={`${item.id}-${item.size}`}
                        className="flex justify-between"
                      >
                        <span>
                          {item.quantity}x {item.name} (
                          {t(item.size).toUpperCase()})
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

                  {subtotal < 3000 && (
                    <span
                      className={`text-[9px] font-sans text-brand-gold block ${isRtl ? "text-left" : "text-right"}`}
                    >
                      {language === "ar" ? (
                        <span>
                          أضف بقيمة{" "}
                          <strong className="text-text-primary font-semibold">
                            {3000 - subtotal} ل.س
                          </strong>{" "}
                          إضافية للتوصيل المجاني!
                        </span>
                      ) : (
                        <span>
                          Add{" "}
                          <strong className="text-white font-semibold">
                            {3000 - subtotal} SYP
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

                <div className="flex gap-3 pt-2">
                  <button
                    id="btn-drawer-checkout"
                    onClick={handleCheckout}
                    className="flex-1 bg-brand-gold hover:bg-yellow-500 text-black py-4 font-mono text-xs font-bold tracking-widest transition-all rounded-none flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/5 cursor-pointer active:scale-[0.98]"
                  >
                    <span>{t("checkoutWhatsApp")}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
