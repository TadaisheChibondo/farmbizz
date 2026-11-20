import { useState, useEffect } from "react";
import { ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // High-quality Unsplash placeholders for Crop Farming, Machinery, and Animal Husbandry
  const slides = [
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop", // Healthy Maize
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop", // Tractor in field
    "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=2070&auto=format&fit=crop", // Cattle
  ];

  // Automatically cycle through images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      id="home"
      className="relative min-h-screen min-h-[100svh] w-full flex items-center justify-center overflow-hidden py-24 sm:py-28"
    >
      {/* Background Slider Setup */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide}
            alt={`Agriculture background ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay Tint - ensures white text is always readable */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Hero Content - relative and z-20 to sit above the background and overlay */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 w-full text-center flex flex-col items-center">
        {/* Established Slogan */}
        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm md:text-base mb-4 drop-shadow-sm">
          The Business of Farming
        </span>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
          <span className="text-emerald-400">Farmbiz:</span> Growing
          Agriculture. <br className="hidden sm:block" />
          Empowering Farmers.
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 text-stone-200 text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed drop-shadow-sm">
          From quality seeds and fertilizers to crop protection and animal
          health solutions, Farmbiz provides farmers across Zimbabwe with the
          products and expertise they need to grow.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#catalog"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-3.5 text-sm md:text-base font-bold transition shadow-lg cursor-pointer"
          >
            Explore Our Products
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#branches"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm text-white px-8 py-3.5 text-sm md:text-base font-bold transition shadow-lg cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            Find a Branch
          </a>
        </div>

        {/* Manual Slide Indicators (Dots) */}
        <div className="mt-8 flex gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-current={index === currentSlide ? "true" : undefined}
              aria-label={`Go to slide ${index + 1}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-emerald-500 w-6"
                    : "bg-white/50 hover:bg-white/80 w-2"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
