import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`group fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-sm"
          : "bg-transparent hover:bg-white hover:shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/farmbizz-logo-transparent.png"
            alt="Farmbiz Logo"
            className="h-16 w-auto shrink-0"
          />
        </div>

        {/* Centre: Navigation Links */}
        <div
          className={`hidden md:flex items-center gap-7 font-medium text-sm transition-colors ${
            isScrolled
              ? "text-stone-900"
              : "text-white group-hover:text-stone-900"
          }`}
        >
          <a href="#home" className="hover:text-emerald-700 transition">
            Home
          </a>
          <a href="#why-choose-us" className="hover:text-emerald-700 transition">
            About Us
          </a>
          <a href="#catalog" className="hover:text-emerald-700 transition">
            Products
          </a>
          <a href="#brands" className="hover:text-emerald-700 transition">
            Brands
          </a>
          <a href="#branches" className="hover:text-emerald-700 transition">
            Branches
          </a>
          <a href="#resources" className="hover:text-emerald-700 transition">
            Resources
          </a>
        </div>

        {/* Right: Search & Contact Button */}
        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            className={`hover:text-emerald-700 transition cursor-pointer p-1 ${
              isScrolled
                ? "text-stone-900"
                : "text-white group-hover:text-stone-900"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          <a
            href="#resources"
            className="rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2.5 text-sm font-bold transition shadow-sm cursor-pointer"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
