import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PizzaMenu from "./components/PizzaMenu";
import ExtrasMenu from "./components/ExtrasMenu";
import PizzaBuilder from "./components/PizzaBuilder";
import ReservationSection from "./components/ReservationSection";
import ReviewsSection from "./components/ReviewsSection";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import SecurityShieldModal from "./components/SecurityShieldModal";
import SEOHead from "./components/SEOHead";
import { SecurityErrorBoundary } from "./components/SecurityErrorBoundary";
import { SITE_SETTINGS } from "./data";
import {
  secureStorage,
  initConsoleSecurityWarning,
  enforceFrameSecurity,
  fetchCSRFToken,
} from "./utils/securityUtils";

// Identifies a cart line: same id+size merges quantity, but a pizza with
// different removed ingredients or different sauce/drink add-ons is kept as
// its own separate line.
function getLineKey(id, size, excludedIngredients, addons) {
  const exclSuffix =
    excludedIngredients && excludedIngredients.length
      ? `|excl:${[...excludedIngredients].sort().join(",")}`
      : "";
  const addonsSuffix =
    addons && addons.length
      ? `|addons:${addons.map((a) => a.translationKey).sort().join(",")}`
      : "";
  return `${id}|${size}${exclSuffix}${addonsSuffix}`;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Initialize Client-Side Security Layer on Mount
  useEffect(() => {
    initConsoleSecurityWarning();
    enforceFrameSecurity();
    fetchCSRFToken();

    // Carts saved before lineKey existed won't have one — backfill so
    // quantity/remove buttons keep working for anything already in a cart.
    const withLineKeys = (items) =>
      items.map((item) =>
        item.lineKey
          ? item
          : {
              ...item,
              lineKey: getLineKey(item.id, item.size, item.excludedIngredients, item.addons),
            },
      );

    // Load encrypted cart from secure storage
    const savedCart = secureStorage.getItem("pizzabaker_cart");
    if (savedCart && Array.isArray(savedCart)) {
      setCart(withLineKeys(savedCart));
    } else {
      // Backward compatibility check for plain local storage
      const plainSaved = localStorage.getItem("pizzabaker_cart");
      if (plainSaved) {
        try {
          const parsed = withLineKeys(JSON.parse(plainSaved));
          setCart(parsed);
          secureStorage.setItem("pizzabaker_cart", parsed);
          localStorage.removeItem("pizzabaker_cart");
        } catch (e) {
          console.warn("[Security] Could not migrate legacy cart storage");
        }
      }
    }
  }, []);

  // Save cart changes securely
  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    secureStorage.setItem("pizzabaker_cart", updatedCart);
  };

  // Add standard menu item to cart (no ingredient customization)
  const handleAddToCart = (item, size) => {
    const lineKey = getLineKey(item.id, size);
    const existingIndex = cart.findIndex((c) => c.lineKey === lineKey);

    // Support custom/standard sizes for pizzas and extras
    const itemPrice =
      item.prices[size] !== undefined
        ? item.prices[size]
        : item.prices.standard || item.prices.medium || 0;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const newItem = {
        id: item.id,
        name: item.name,
        translationKey: item.translationKey || null,
        size,
        price: itemPrice,
        quantity: 1,
        lineKey,
      };
      saveCart([...cart, newItem]);
    }
  };

  // Add a pizza to cart from the detail popup, with any unwanted ingredients
  // unchecked and any sauces/drinks selected — kept as its own cart line so
  // it never merges with a plain add or a differently-customized one.
  const handleAddPizzaWithExclusions = (pizza, size, excludedIngredients, addons) => {
    const lineKey = getLineKey(pizza.id, size, excludedIngredients, addons);
    const existingIndex = cart.findIndex((c) => c.lineKey === lineKey);
    const addonsTotal = (addons || []).reduce((sum, a) => sum + a.price, 0);
    const itemPrice = (pizza.prices[size] ?? pizza.prices.medium ?? 0) + addonsTotal;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const newItem = {
        id: pizza.id,
        name: pizza.name,
        size,
        price: itemPrice,
        quantity: 1,
        lineKey,
        excludedIngredients:
          excludedIngredients && excludedIngredients.length
            ? excludedIngredients
            : undefined,
        addons: addons && addons.length ? addons : undefined,
      };
      saveCart([...cart, newItem]);
    }
  };

  // Add custom built pizza to cart
  const handleAddCustomToCart = (customPizza) => {
    const customId = `custom-pizza-${Date.now()}`;
    const newItem = {
      id: customId,
      name: customPizza.name,
      size: customPizza.size,
      price: customPizza.price,
      quantity: 1,
      customToppings: customPizza.toppings,
      isCustom: true,
      lineKey: getLineKey(customId, customPizza.size),
    };
    saveCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  // Update item quantity inside cart drawer
  const handleUpdateQuantity = (lineKey, delta) => {
    const index = cart.findIndex((c) => c.lineKey === lineKey);
    if (index > -1) {
      const updated = [...cart];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      saveCart(updated);
    }
  };

  // Remove single item from cart
  const handleRemoveItem = (lineKey) => {
    const filtered = cart.filter((c) => c.lineKey !== lineKey);
    saveCart(filtered);
  };

  // Clear entire cart on checkout
  const handleClearCart = () => {
    saveCart([]);
  };

  // Navigate to standard element section smoothly
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 70; // Header spacing offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Intersection observer to track which section is currently viewed on scroll
  useEffect(() => {
    const sections = [
      "hero",
      "menu",
      "extras",
      "builder",
      "reviews",
      "reservation",
    ];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SecurityErrorBoundary>
      {/* Dynamic SEO Head Manager */}
      <SEOHead activeSection={activeSection} />

      <div className="relative min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-brand-gold selection:text-black transition-colors duration-300">
        {/* Premium Translucent Header Navbar */}
        <Navbar
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenReservation={() => handleNavigate("reservation")}
        />

        {/* Main Sections */}
        <main>
          {/* Hero Section */}
          <Hero
            onNavigate={handleNavigate}
            onOpenReservation={() => handleNavigate("reservation")}
          />

          {/* Pizza Menu Section */}
          {SITE_SETTINGS.sectionVisibility.menu && (
            <PizzaMenu
              onAddToCart={handleAddToCart}
              onAddCustomizedToCart={handleAddPizzaWithExclusions}
              cart={cart}
            />
          )}

          {/* Snacks & Dessert Section */}
          {SITE_SETTINGS.sectionVisibility.extras && (
            <ExtrasMenu onAddToCart={handleAddToCart} cart={cart} />
          )}

          {/* Visual Pizza Builder */}
          {SITE_SETTINGS.sectionVisibility.builder && (
            <PizzaBuilder onAddCustomToCart={handleAddCustomToCart} />
          )}

          {/* Table Reservation Desk */}
          {SITE_SETTINGS.sectionVisibility.reservation && (
            <ReservationSection />
          )}

          {/* Reviews Explorer with persistence */}
          {SITE_SETTINGS.sectionVisibility.reviews && <ReviewsSection />}
        </main>

        {/* Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenReservation={() => handleNavigate("reservation")}
          onOpenSecurity={() => setIsSecurityOpen(true)}
        />

        {/* Sliding Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        {/* Interactive Comprehensive Security Shield Modal */}
        <SecurityShieldModal
          isOpen={isSecurityOpen}
          onClose={() => setIsSecurityOpen(false)}
        />
      </div>
    </SecurityErrorBoundary>
  );
}
