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

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("pizzabaker_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart storage", e);
      }
    }
  }, []);

  // Save cart changes
  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("pizzabaker_cart", JSON.stringify(updatedCart));
  };

  // Add standard menu item to cart
  const handleAddToCart = (item, size) => {
    const existingIndex = cart.findIndex(
      (c) => c.id === item.id && c.size === size,
    );

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
    };
    saveCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  // Update item quantity inside cart drawer
  const handleUpdateQuantity = (id, size, delta) => {
    const index = cart.findIndex((c) => c.id === id && c.size === size);
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
  const handleRemoveItem = (id, size) => {
    const filtered = cart.filter((c) => !(c.id === id && c.size === size));
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
        <PizzaMenu onAddToCart={handleAddToCart} cart={cart} />

        {/* Snacks & Dessert Section */}
        <ExtrasMenu onAddToCart={handleAddToCart} cart={cart} />

        {/* Visual Pizza Builder */}
        <PizzaBuilder onAddCustomToCart={handleAddCustomToCart} />

        {/* Table Reservation Desk */}
        <ReservationSection />

        {/* Reviews Explorer with persistence */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenReservation={() => handleNavigate("reservation")}
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
    </div>
  );
}
