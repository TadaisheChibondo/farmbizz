import { useState, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#why-choose-us" },
  { label: "Products", href: "#catalog" },
  { label: "Brands", href: "#brands" },
  { label: "Branches", href: "#branches" },
  { label: "Resources", href: "#resources" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

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
            className="h-12 sm:h-14 md:h-16 w-auto shrink-0"
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
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-emerald-700 transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Search & Contact Button */}
        <div className="hidden md:flex items-center gap-5">
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

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`md:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg transition ${
            isScrolled
              ? "text-stone-900 hover:bg-stone-100"
              : "text-white hover:bg-white/10"
          }`}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`md:hidden border-t border-stone-200 bg-white shadow-lg ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-3">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-stone-800 hover:bg-stone-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#resources"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 text-sm font-bold text-white hover:bg-emerald-900"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
