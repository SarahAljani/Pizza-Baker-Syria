import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Check, RefreshCw } from 'lucide-react';
import { CUSTOM_TOPPINGS } from '../data';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export default function PizzaBuilder({ onAddCustomToCart }) {
  const [size, setSize] = useState('medium');
  const [crust, setCrust] = useState('Classic Neapolitan');
  const [sauce, setSauce] = useState('San Marzano Tomato');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t, isRtl, language } = useThemeLanguage();

  const crustTranslations = {
    'Classic Neapolitan': { en: 'Classic Neapolitan', ar: 'نابولي كلاسيكية' },
    'Crispy Thin': { en: 'Crispy Thin', ar: 'رقيقة مقرمشة' },
    'Gluten-Free': { en: 'Gluten-Free', ar: 'خالية من الغلوتين' },
    'Garlic Butter Crust': { en: 'Garlic Butter Crust', ar: 'عجينة بالثوم والزبدة' },
  };

  const sauceTranslations = {
    'San Marzano Tomato': { en: 'San Marzano Tomato', ar: 'طماطم سان مارزانو' },
    'White Truffle Cream': { en: 'White Truffle Cream', ar: 'كريمة الترفل البيضاء' },
    'Herb Pesto': { en: 'Herb Pesto', ar: 'بيستو الأعشاب' },
    'Spicy Diavola': { en: 'Spicy Diavola', ar: 'ديافولا حارة' },
  };

  // Custom base prices in Syrian Pounds
  const getBasePrice = (sz) => {
    if (sz === 'small') return 650;
    if (sz === 'medium') return 1000;
    return 1350;
  };

  const basePrice = getBasePrice(size);
  const toppingsCost = selectedToppings.reduce((sum, toppingId) => {
    const topping = CUSTOM_TOPPINGS.find((t) => t.id === toppingId);
    return sum + (topping ? topping.price : 0);
  }, 0);
  const totalPrice = basePrice + toppingsCost;

  const handleToppingToggle = (toppingId) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  const handleReset = () => {
    setSelectedToppings([]);
    setCrust('Classic Neapolitan');
    setSauce('San Marzano Tomato');
    setSize('medium');
  };

  const handleAddToCart = () => {
    const crustName = crustTranslations[crust]?.[language] || crust;
    const sauceName = sauceTranslations[sauce]?.[language] || sauce;
    const translatedToppings = selectedToppings.map(id => {
      const tObj = CUSTOM_TOPPINGS.find(to => to.id === id);
      return tObj ? t(tObj.name) : '';
    }).filter(Boolean);

    const name = language === 'ar'
      ? `بيتزا مبتكرة - حجم ${size === 'small' ? 'صغير' : size === 'medium' ? 'وسط' : 'كبير'}`
      : `Custom ${size === 'small' ? 'Small' : size === 'medium' ? 'Medium' : 'Large'} Pizza`;

    onAddCustomToCart({
      name,
      size,
      price: totalPrice,
      toppings: [
        language === 'ar' ? `نوع العجينة: ${crustName}` : `Crust: ${crust}`,
        language === 'ar' ? `نوع الصلصة: ${sauceName}` : `Sauce: ${sauce}`,
        ...translatedToppings
      ],
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  const crustOptions = ['Classic Neapolitan', 'Crispy Thin', 'Gluten-Free', 'Garlic Butter Crust'];
  const sauceOptions = ['San Marzano Tomato', 'White Truffle Cream', 'Herb Pesto', 'Spicy Diavola'];

  // Visual ingredient dots positioned on the custom pizza circle container
  const toppingCoordinates = {
    'topping-moz': [
      { top: '35%', left: '30%', rotate: '15deg' },
      { top: '25%', left: '55%', rotate: '-10deg' },
      { top: '60%', left: '40%', rotate: '45deg' },
      { top: '50%', left: '65%', rotate: '120deg' },
      { top: '45%', left: '20%', rotate: '-40deg' },
    ],
    'topping-burrata': [
      { top: '20%', left: '40%', rotate: '0deg' },
      { top: '55%', left: '25%', rotate: '30deg' },
      { top: '50%', left: '55%', rotate: '-20deg' },
    ],
    'topping-pep': [
      { top: '22%', left: '25%', rotate: '45deg' },
      { top: '42%', left: '48%', rotate: '12deg' },
      { top: '30%', left: '65%', rotate: '-35deg' },
      { top: '65%', left: '35%', rotate: '70deg' },
      { top: '58%', left: '58%', rotate: '110deg' },
      { top: '50%', left: '18%', rotate: '-15deg' },
    ],
    'topping-mush': [
      { top: '28%', left: '38%', rotate: '20deg' },
      { top: '48%', left: '32%', rotate: '80deg' },
      { top: '38%', left: '58%', rotate: '-45deg' },
      { top: '62%', left: '48%', rotate: '140deg' },
    ],
    'topping-arugula': [
      { top: '18%', left: '32%', rotate: '10deg' },
      { top: '32%', left: '22%', rotate: '50deg' },
      { top: '40%', left: '42%', rotate: '-30deg' },
      { top: '28%', left: '52%', rotate: '100deg' },
      { top: '58%', left: '28%', rotate: '75deg' },
      { top: '52%', left: '62%', rotate: '-80deg' },
      { top: '68%', left: '45%', rotate: '15deg' },
    ],
    'topping-basil': [
      { top: '30%', left: '45%', rotate: '-15deg' },
      { top: '50%', left: '38%', rotate: '40deg' },
      { top: '42%', left: '55%', rotate: '95deg' },
    ],
    'topping-pesto': [
      { top: '15%', left: '15%', rotate: '0deg' },
      { top: '50%', left: '50%', rotate: '45deg' },
      { top: '75%', left: '35%', rotate: '-30deg' },
      { top: '35%', left: '70%', rotate: '120deg' },
    ],
    'topping-olive': [
      { top: '26%', left: '28%', rotate: '0deg' },
      { top: '34%', left: '48%', rotate: '0deg' },
      { top: '44%', left: '24%', rotate: '0deg' },
      { top: '58%', left: '52%', rotate: '0deg' },
      { top: '48%', left: '68%', rotate: '0deg' },
    ],
    'topping-tomato': [
      { top: '20%', left: '48%', rotate: '10deg' },
      { top: '40%', left: '35%', rotate: '-50deg' },
      { top: '54%', left: '48%', rotate: '30deg' },
      { top: '38%', left: '65%', rotate: '115deg' },
    ],
  };

  return (
    <section
      id="builder"
      className="relative bg-bg-primary py-24 sm:py-32 overflow-hidden border-b border-border-primary transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.4em] text-brand-gold font-bold uppercase mb-2">
            {t('builderPreTitle')}
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-text-primary font-normal tracking-wide uppercase mb-3">
            {t('builderTitle')}
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-widest max-w-lg mx-auto leading-relaxed">
            {t('builderDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* LEFT PANEL: Interactive Visual Pizza Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-bg-secondary border border-border-primary p-8 sm:p-12 relative transition-all">
            
            {/* Visual Pizza Canvas container */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center shadow-2xl overflow-hidden bg-orange-950/20 border-4 border-dashed border-border-primary p-2">
              
              {/* Dough Base */}
              <motion.div
                className={`absolute w-[92%] h-[92%] rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.6)] border-[12px] transition-all duration-500 ${
                  crust === 'Garlic Butter Crust'
                    ? 'border-[#caa759] bg-[#e6ce9e]'
                    : crust === 'Crispy Thin'
                    ? 'border-[#a37e42] bg-[#d7bf95]'
                    : crust === 'Gluten-Free'
                    ? 'border-[#be9d60] bg-[#e1cbad]'
                    : 'border-[#bc903b] bg-[#e8dbb2]' // Neapolitan
                }`}
                animate={{ scale: size === 'medium' ? 1.0 : size === 'small' ? 0.88 : 1.08 }}
              >
                {/* Sauce Layer */}
                <motion.div
                  className={`absolute inset-4 rounded-full transition-all duration-500 ${
                    sauce === 'San Marzano Tomato'
                      ? 'bg-red-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]'
                      : sauce === 'White Truffle Cream'
                      ? 'bg-yellow-50/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]'
                      : sauce === 'Herb Pesto'
                      ? 'bg-emerald-900/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]'
                      : 'bg-red-950 shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]' // Spicy Diavola
                  }`}
                />

                {/* Scattered Toppings Canvas */}
                <div className="absolute inset-4 rounded-full overflow-hidden pointer-events-none">
                  <AnimatePresence>
                    {selectedToppings.map((toppingId) => {
                      const coordinates = toppingCoordinates[toppingId] || [];
                      const toppingObj = CUSTOM_TOPPINGS.find((t) => t.id === toppingId);

                      return coordinates.map((coord, index) => (
                        <motion.div
                          key={`${toppingId}-${index}`}
                          initial={{ opacity: 0, scale: 2, y: -50 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: index * 0.05 }}
                          className="absolute text-2xl sm:text-3xl select-none"
                          style={{
                            top: coord.top,
                            left: coord.left,
                            transform: `rotate(${coord.rotate})`,
                          }}
                        >
                          {toppingObj ? toppingObj.icon : '🍕'}
                        </motion.div>
                      ));
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Price display tag */}
            <div className="mt-8 flex items-center justify-between w-full border-t border-border-primary pt-6">
              <div className="text-left">
                <span className="text-[10px] font-mono text-text-secondary block uppercase">
                  {t('totalComp')}
                </span>
                <span className="font-mono text-3xl text-text-primary font-bold block mt-1">
                  {totalPrice} <span className="text-sm font-semibold text-brand-gold">{isRtl ? 'ل.س' : 'SYP'}</span>
                </span>
              </div>

              <button
                id="btn-builder-reset"
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-brand-gold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إعادة البدء' : 'START OVER'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Customizable ingredients selectors */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Step 1: Select Size */}
            <div>
              <label className="text-[10px] font-mono text-brand-gold tracking-widest uppercase block mb-3 font-bold">
                {t('selectSize')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  id="btn-size-builder-small"
                  onClick={() => setSize('small')}
                  className={`border p-3 text-left transition-all cursor-pointer ${
                    size === 'small'
                      ? 'border-brand-gold bg-brand-gold/10 text-text-primary'
                      : 'border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="block font-mono text-[9px] tracking-widest uppercase font-bold text-text-secondary">
                    {t('small').toUpperCase()} (20CM)
                  </span>
                  <span className="block font-mono text-sm font-bold mt-1">
                    {getBasePrice('small')} <span className="text-[10px] text-brand-gold font-semibold">{isRtl ? 'ل.س' : 'SYP'}</span>
                  </span>
                </button>

                <button
                  id="btn-size-builder-medium"
                  onClick={() => setSize('medium')}
                  className={`border p-3 text-left transition-all cursor-pointer ${
                    size === 'medium'
                      ? 'border-brand-gold bg-brand-gold/10 text-text-primary'
                      : 'border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="block font-mono text-[9px] tracking-widest uppercase font-bold text-text-secondary">
                    {t('medium').toUpperCase()} (30CM)
                  </span>
                  <span className="block font-mono text-sm font-bold mt-1">
                    {getBasePrice('medium')} <span className="text-[10px] text-brand-gold font-semibold">{isRtl ? 'ل.س' : 'SYP'}</span>
                  </span>
                </button>

                <button
                  id="btn-size-builder-large"
                  onClick={() => setSize('large')}
                  className={`border p-3 text-left transition-all cursor-pointer ${
                    size === 'large'
                      ? 'border-brand-gold bg-brand-gold/10 text-text-primary'
                      : 'border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="block font-mono text-[9px] tracking-widest uppercase font-bold text-text-secondary">
                    {t('large').toUpperCase()} (40CM)
                  </span>
                  <span className="block font-mono text-sm font-bold mt-1">
                    {getBasePrice('large')} <span className="text-[10px] text-brand-gold font-semibold">{isRtl ? 'ل.س' : 'SYP'}</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Select Crust */}
            <div>
              <label className="text-[10px] font-mono text-brand-gold tracking-widest uppercase block mb-3 font-bold">
                {isRtl ? '٢. اختر نوع العجينة' : '2. CHOOSE CRUST STYLE'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {crustOptions.map((opt) => (
                  <button
                    key={opt}
                    id={`btn-crust-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setCrust(opt)}
                    className={`border px-4 py-2.5 text-xs font-sans tracking-wider transition-all cursor-pointer text-left ${
                      crust === opt
                        ? 'border-brand-gold bg-brand-gold/5 text-text-primary font-bold'
                        : 'border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {crustTranslations[opt]?.[language] || opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Sauce */}
            <div>
              <label className="text-[10px] font-mono text-brand-gold tracking-widest uppercase block mb-3 font-bold">
                {isRtl ? '٣. اختر صلصة الأساس' : '3. SELECT SAUCE BASE'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sauceOptions.map((opt) => (
                  <button
                    key={opt}
                    id={`btn-sauce-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSauce(opt)}
                    className={`border px-4 py-2.5 text-xs font-sans tracking-wider transition-all cursor-pointer text-left ${
                      sauce === opt
                        ? 'border-brand-gold bg-brand-gold/5 text-text-primary font-bold'
                        : 'border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {sauceTranslations[opt]?.[language] || opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Toggle Premium Toppings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-mono text-brand-gold tracking-widest uppercase block font-bold">
                  {t('layerToppings')}
                </label>
                <span className="text-[10px] font-mono text-text-secondary">
                  {selectedToppings.length} {isRtl ? 'مُختارة' : 'SELECTED'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CUSTOM_TOPPINGS.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      id={`btn-topping-${topping.id}`}
                      onClick={() => handleToppingToggle(topping.id)}
                      className={`border p-3 flex items-center justify-between transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-brand-gold bg-brand-gold/10 text-text-primary font-semibold'
                          : 'border-border-primary hover:border-white/10 text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{topping.icon}</span>
                        <div className="leading-tight">
                          <span className="block text-[10px] font-sans tracking-wide">
                            {t(topping.name)}
                          </span>
                          <span className="block text-[9px] font-mono text-brand-gold font-bold">
                            +{topping.price} {isRtl ? 'ل.س' : 'SYP'}
                          </span>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Final checkout custom order CTA */}
            <div className="pt-4">
              <button
                id="btn-add-builder-to-cart"
                onClick={handleAddToCart}
                disabled={selectedToppings.length === 0}
                className={`w-full py-4 font-mono text-xs font-bold tracking-widest transition-all duration-300 rounded-none flex items-center justify-center gap-2.5 cursor-pointer ${
                  selectedToppings.length === 0
                    ? 'bg-white/5 border border-border-primary text-text-tertiary cursor-not-allowed'
                    : 'bg-brand-gold hover:bg-yellow-500 text-black shadow-lg shadow-brand-gold/5'
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isRtl ? 'تمت الإضافة للسلة بنجاح!' : 'CUSTOM PIZZA ADDED TO CART!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {isRtl
                        ? `أضف بيتزا مبتكرة بسعر (${totalPrice} ل.س)`
                        : `ADD CUSTOM PIZZA (${totalPrice} SYP)`}
                    </span>
                  </>
                )}
              </button>

              {selectedToppings.length === 0 && (
                <span className="text-[10px] font-sans text-text-secondary block text-center mt-2.5">
                  {isRtl
                    ? 'الرجاء اختيار مكون إضافي واحد على الأقل للبدء بالخبز.'
                    : 'Select at least one ingredient toppings to enable baking.'}
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
