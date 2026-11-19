import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import ScrollItem from "./ScrollItem";

export default function CategoriesSection({ onSelectCategory }) {
  // The 'exactMatch' field matches the CATEGORIES array in catalog.js perfectly
  // so the catalog filter knows exactly which category to activate.
  const categories = [
    {
      id: "seeds",
      name: "Seeds & Seedlings",
      exactMatch: "Crop Seed & Seedlings",
      description: "Maize, vegetables, small grains and seedlings.",
      image:
        "https://images.unsplash.com/photo-1592982537447-6f233400df83?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "fertilizers",
      name: "Fertilizers",
      exactMatch: "Fertilizers",
      description: "Nutritional solutions for improved crop development.",
      image:
        "https://images.unsplash.com/photo-1627920769840-692ab8c6d1da?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "crop-protection",
      name: "Crop Protection",
      exactMatch: "Crop Protection",
      description: "Herbicides, pesticides and agricultural chemicals.",
      image:
        "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=2071&auto=format&fit=crop",
    },
    {
      id: "animal-health",
      name: "Animal Health",
      exactMatch: "Veterinary & Animal Health",
      description: "Veterinary medicines, vaccines and treatments.",
      image:
        "https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "stock-feeds",
      name: "Stock Feeds",
      exactMatch: "Stock Feeds",
      description: "Nutrition solutions for livestock.",
      image:
        "https://images.unsplash.com/photo-1544421111-66551b68ce48?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "farming-equipment",
      name: "Farming Equipment",
      exactMatch: "Tools & Equipment",
      description: "Agricultural tools, implements and protective clothing.",
      image:
        "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=1964&auto=format&fit=crop",
    },
  ];

  return (
    <section id="categories" className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-emerald-700 font-semibold tracking-wide uppercase text-sm mb-2">
              What We Stock
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Product Categories
            </h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.exactMatch)}
                className="text-left group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col cursor-pointer w-full"
              >
                {/* Image Container with Zoom on Hover */}
                <div className="relative h-56 w-full overflow-hidden bg-stone-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-stone-600 text-sm flex-1 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Explore Button / Link Indicator */}
                  <div className="inline-flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                    Explore Category
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Wrap the Grid in a Staggered ScrollReveal */}
        <ScrollReveal stagger={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              // Wrap each card in a ScrollItem
              <ScrollItem key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.exactMatch)}
                  className="text-left group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col cursor-pointer w-full"
                >
                  {/* ... rest of the card content remains exactly the same ... */}
                </button>
              </ScrollItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
