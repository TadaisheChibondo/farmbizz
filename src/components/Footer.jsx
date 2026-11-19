import { MapPin, Phone, Mail } from "lucide-react";
import { PUBLIC_CONTACTS } from "../data/branches";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="resources"
      className="bg-stone-950 text-stone-300 pt-20 pb-8 border-t border-stone-800"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand & Description (Takes up 2 columns on lg screens) */}
          <div className="lg:col-span-2">
            <img
              src="/farmbizz-logo-transparent.png"
              alt="Farmbiz Logo"
              className="h-16 w-auto shrink-0"
            />
            <p className="text-sm text-stone-400 leading-relaxed mb-6 max-w-sm">
              "The Business of Farming." Providing a quality and consistent
              service that meets customer expectations and delivers results in
              crop farming and animal husbandry across Zimbabwe.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-700 hover:text-white transition-colors"
              >
                <span className="font-bold text-sm">f</span>
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-700 hover:text-white transition-colors"
              >
                <span className="font-bold text-sm">X</span>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-700 hover:text-white transition-colors"
              >
                <span className="text-lg leading-none">◎</span>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-700 hover:text-white transition-colors"
              >
                <span className="font-bold text-xs">in</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <a
                  href="#home"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#brands"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Brands
                </a>
              </li>
              <li>
                <a
                  href="#branches"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Branches
                </a>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Categories
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <a
                  href="#catalog"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Seeds & Seedlings
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fertilizers
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Crop Protection
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Animal Health
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Stock Feeds
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Head Office: Harare, Zimbabwe</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  {PUBLIC_CONTACTS.phones[0]}
                  <br />
                  {PUBLIC_CONTACTS.phones[1]}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${PUBLIC_CONTACTS.email}`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {PUBLIC_CONTACTS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            &copy; {currentYear} Farmbiz Private Limited. All rights reserved.
          </p>
          <p>
            Designed & Developed by{" "}
            <a
              href="https://tadaishechibondo.co.zw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 font-semibold hover:text-emerald-400 transition-colors"
            >
              Tadaishe Chibondo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
