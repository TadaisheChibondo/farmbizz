import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoriesSection from "./components/CategoriesSection";
import WhyChooseUs from "./components/WhyChooseUs";
import BrandsSection from "./components/BrandsSection";
import CatalogSection from "./components/CatalogSection";
import BranchSection from "./components/BranchSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import QuoteDrawer from "./components/QuoteDrawer";

export default function App() {
  const [quoteItems, setQuoteItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // NEW: State to sync the Categories grid with the Catalog filter
  const [activeCategory, setActiveCategory] = useState("All");

  const handleAddToQuote = (item) => {
    setQuoteItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (indexToRemove) => {
    setQuoteItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  // NEW: Function to handle a click from the Categories Section
  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <Hero />
        {/* Pass the handler to the Categories section */}
        <CategoriesSection onSelectCategory={handleCategorySelect} />
        <WhyChooseUs />
        <BrandsSection />
        {/* Pass the active state to the Catalog section */}
        <CatalogSection
          onAddToQuote={handleAddToQuote}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <BranchSection />
        <CTASection />
      </main>

      <Footer />

      <QuoteDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={quoteItems}
        onRemove={handleRemoveItem}
        onClear={handleClearQuote}
      />
    </div>
  );
}
