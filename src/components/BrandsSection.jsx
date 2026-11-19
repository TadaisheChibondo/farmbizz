import { Shield } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import ScrollItem from "./ScrollItem";

export default function BrandsSection() {
  // Placeholder array for the brands they stock.
  // Once the contract is secured, you swap the 'name' out for actual <img> tags of supplier logos.
  const brands = [
    { id: 1, name: "AgriSeeds" },
    { id: 2, name: "Seed Co Partners" },
    { id: 3, name: "Premium Fertilizers" },
    { id: 4, name: "VetCare Suppliers" },
    { id: 5, name: "CropProtect Intl." },
    { id: 6, name: "FarmTech Implements" },
  ];

  return (
    <section
      id="brands"
      className="py-20 bg-stone-100 border-y border-stone-200"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Container */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Trusted Brands. Proven Results.
            </h2>
            <p className="text-stone-600 mt-4 text-sm md:text-base leading-relaxed">
              Quality agricultural solutions sourced from established suppliers
              and manufacturers.
            </p>
          </div>
        </ScrollReveal>

        {/* Logos Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {brands.map((brand) => (
              <ScrollItem key={brand.id}>
                <div
                  key={brand.id}
                  className="bg-white border border-stone-200 rounded-xl h-24 flex items-center justify-center p-4 grayscale hover:grayscale-0 hover:border-emerald-300 hover:shadow-md transition-all duration-500 cursor-pointer group"
                >
                  {/* Text acts as a placeholder for a real logo image */}
                  <span className="font-extrabold text-stone-400 group-hover:text-emerald-700 text-center text-xs md:text-sm uppercase tracking-widest transition-colors duration-500">
                    {brand.name}
                  </span>
                </div>
              </ScrollItem>
            ))}
          </div>
        </ScrollReveal>

        {/* Trust Indicator */}
        <ScrollReveal>
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              Guaranteed authentic agricultural inputs
            </div>
            ``
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
