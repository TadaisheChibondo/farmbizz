import { useState } from "react";
import { Search, PlusCircle, Eye } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/catalog";
import ProductDetailsModal from "./ProductDetailsModal";

export default function CatalogSection({
  onAddToQuote,
  activeCategory,
  setActiveCategory,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const openDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section id="catalog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-emerald-700 font-semibold tracking-wide uppercase text-sm mb-2">
              Browse Catalogue
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Products &amp; Farm Inputs
            </h2>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product or brand..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Category Pills */}
          <div className="w-full lg:w-64 shrink-0">
            <h3 className="font-bold text-stone-900 mb-4 px-2">Categories</h3>
            <div className="flex flex-row lg:flex-col flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-11 px-4 py-2.5 rounded-lg text-left text-sm font-medium transition cursor-pointer ${
                      active
                        ? "bg-emerald-800 text-white shadow-sm"
                        : "bg-transparent text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div
            className="flex-1 min-w-0 max-h-none overflow-visible pr-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 lg:max-h-[70vh] lg:overflow-y-auto lg:overscroll-y-auto lg:pr-2"
            role="region"
            aria-label="Catalog products"
            tabIndex={0}
          >
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500">
                No products found. Adjust your search or category filter.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
                  >
                    {/* Product Image Wrapper */}
                    <div className="h-48 bg-stone-100 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                        {item.brand}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-stone-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 mb-4 flex-1 line-clamp-2">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-between text-sm mb-5 pt-4 border-t border-stone-100">
                        <span className="text-stone-500">Packaging:</span>
                        <span className="font-semibold text-stone-900">
                          {item.unit}
                        </span>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() => openDetails(item)}
                          className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold py-2.5 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                        <button
                          onClick={() => onAddToQuote(item)}
                          className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2.5 transition cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Quote
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the Modal (Hidden unless isModalOpen is true) */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddQuote={onAddToQuote}
      />
    </section>
  );
}
