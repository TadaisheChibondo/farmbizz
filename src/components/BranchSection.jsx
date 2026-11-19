import { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function BranchSection() {
  const [activeBranchId, setActiveBranchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Locations");

  const cardRefs = useRef({});

  // Branch data with hierarchy, contact actions, and approximate Zimbabwe SVG coordinates (0-100%)
  const branches = [
    {
      id: "hre-hq",
      town: "Harare",
      name: "Harare Head Office",
      isHeadOffice: true,
      address: "Cnr 5th & Robert Mugabe Way, Amtec Complex, Harare",
      phone: "+263 24 279 0396",
      hours: "Mon-Fri: 8am - 5pm, Sat: 8am - 1pm",
      coords: { x: "68%", y: "28%" },
    },
    {
      id: "byo-main",
      town: "Bulawayo",
      name: "Bulawayo Branch",
      isHeadOffice: false,
      address: "No. 1 Selous Building, Cnr 10th / Jason Moyo, Bulawayo",
      phone: "+263 785 202 555",
      hours: "Mon-Fri: 8am - 5pm, Sat: 8am - 1pm",
      coords: { x: "32%", y: "65%" },
    },
    {
      id: "mutare-depot",
      town: "Mutare",
      name: "Mutare Depot",
      isHeadOffice: false,
      address: "Mutare Central, Mutare",
      phone: "+263 773 303 064",
      hours: "Mon-Fri: 8am - 5pm, Sat: Closed",
      coords: { x: "90%", y: "42%" },
    },
    {
      id: "chiredzi-branch",
      town: "Chiredzi",
      name: "Farmbiz Chiredzi",
      isHeadOffice: false,
      address: "733 Msasa Road, Chiredzi",
      phone: "+263 773 303 064",
      hours: "Mon-Fri: 8am - 5pm, Sat: 8am - 1pm",
      coords: { x: "75%", y: "78%" },
    },
  ];

  const filterOptions = [
    "All Locations",
    "Harare",
    "Bulawayo",
    "Mutare",
    "Chiredzi",
  ];

  // Filter logic: Check town tabs AND the search bar
  const visibleBranches = branches.filter((branch) => {
    const matchesTab =
      selectedFilter === "All Locations" || branch.town === selectedFilter;
    const matchesSearch =
      branch.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Auto-scroll to a card when its map marker is clicked
  useEffect(() => {
    if (activeBranchId && cardRefs.current[activeBranchId]) {
      cardRefs.current[activeBranchId].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeBranchId]);

  return (
    <section
      id="branches"
      className="py-20 bg-stone-50 border-y border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="mb-12">
          <p className="text-emerald-700 font-semibold tracking-wide uppercase text-sm mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Our Nationwide Presence
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Find a Farmbiz branch near you.
          </h2>
        </div>

        {/* Two-Column Directory Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Map & Statistics */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Interactive SVG Map Container */}
            <div className="relative w-full aspect-square md:aspect-[4/3] bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex items-center justify-center p-6">
              {/* Simplified SVG Path of Zimbabwe */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-emerald-50 drop-shadow-md"
                fill="currentColor"
                stroke="#10b981"
                strokeWidth="0.5"
              >
                <path d="M 22 35 Q 35 15 50 12 L 65 8 Q 80 18 90 42 Q 95 55 82 72 L 62 95 L 45 92 Q 25 78 15 50 Z" />
              </svg>

              {/* Map Markers */}
              {branches.map((branch) => {
                const isActive = activeBranchId === branch.id;
                const isVisible = visibleBranches.some(
                  (b) => b.id === branch.id,
                );

                if (!isVisible) return null; // Hide markers filtered out by search

                return (
                  <div
                    key={branch.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    style={{ left: branch.coords.x, top: branch.coords.y }}
                    onClick={() =>
                      setActiveBranchId(isActive ? null : branch.id)
                    }
                  >
                    {/* Active Pulse */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 animate-ping scale-150"></div>
                    )}

                    {/* Marker Pin */}
                    <div
                      className={`relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full shadow-md transition-all duration-300 ${
                        isActive
                          ? "bg-emerald-700 text-white scale-110 ring-4 ring-emerald-100"
                          : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    {/* Tooltip */}
                    <div
                      className={`absolute top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded transition-all duration-200 whitespace-nowrap z-20 pointer-events-none ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                      }`}
                    >
                      {branch.town}
                      {/* Small triangle pointer for tooltip */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Location Statistics Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <div className="text-center border-r border-stone-100">
                <span className="block text-2xl font-black text-emerald-800">
                  13+
                </span>
                <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider mt-1 block">
                  Locations*
                </span>
              </div>
              <div className="text-center border-r border-stone-100 flex flex-col items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs text-stone-600 font-semibold leading-tight">
                  Nationwide
                  <br />
                  Coverage
                </span>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs text-stone-600 font-semibold leading-tight">
                  Serving Farmers
                  <br />
                  Since 2016
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Directory & Filters */}
          <div className="lg:col-span-5 flex flex-col h-[650px]">
            {/* Search Field */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by town or branch name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm"
              />
            </div>

            {/* Town Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilter(option);
                    setActiveBranchId(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                    selectedFilter === option
                      ? "bg-stone-800 text-white border-stone-800"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Scrollable Branch Directory */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 custom-scrollbar">
              {visibleBranches.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl border border-stone-200">
                  <p className="text-stone-500 text-sm">
                    No branches found matching your search.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("All Locations");
                    }}
                    className="mt-4 text-emerald-700 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                visibleBranches.map((branch) => {
                  const isActive = activeBranchId === branch.id;

                  return (
                    <div
                      key={branch.id}
                      ref={(el) => (cardRefs.current[branch.id] = el)}
                      onClick={() => setActiveBranchId(branch.id)}
                      className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10 shadow-md"
                          : "border-stone-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Branch Hierarchy Header */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          {branch.town}
                        </span>
                        {branch.isHeadOffice && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            <Building2 className="w-3 h-3" /> Head Office
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-stone-900 mb-4">
                        {branch.name}
                      </h3>

                      {/* Contact Information */}
                      <address className="not-italic space-y-3 mb-6">
                        <div className="flex items-start gap-3 text-sm text-stone-600">
                          <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                          <span>{branch.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                          <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                          {/* tel: link makes the number tap-to-call on mobile */}
                          <a
                            href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                            className="hover:text-emerald-700 hover:underline"
                          >
                            {branch.phone}
                          </a>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-stone-600">
                          <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                          <span>{branch.hours}</span>
                        </div>
                      </address>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 text-sm font-bold transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call Branch
                        </a>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-sm font-bold transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
