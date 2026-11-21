import { useState, useRef, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Building2,
  LocateFixed,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";
import { TOWNS } from "../data/branches";

/* -------------------------------------------------------------------------- */
/* Map configuration                                                          */
/* -------------------------------------------------------------------------- */

const TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  import.meta.env.VITE_MAP_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ZIM_BOUNDS = [
  [-22.5, 25.2],
  [-15.5, 33.1],
];
const MAX_BOUNDS = [
  [-24.5, 23.0],
  [-13.5, 35.5],
];

const FAR_KM = 600;

/* -------------------------------------------------------------------------- */
/* Branch data (static, so it lives outside the component)                    */
/* -------------------------------------------------------------------------- */

const branchLocations = [...TOWNS.slice(1), "Farmbiz Genetics"];
const filterOptions = ["All Locations", ...branchLocations];

const BRANCHES = [
  {
    id: "hre-hq",
    town: "Harare",
    name: "Harare Head Office",
    isHeadOffice: true,
    address: "Cnr 5th & Robert Mugabe Way, Amtec Complex, Harare",
    phone: "+263 24 279 0396",
    hours: "Mon-Fri: 8am - 5pm, Sat: 8am - 1pm",
    lat: -17.831,
    lng: 31.049,
  },
  {
    id: "byo-main",
    town: "Bulawayo",
    name: "Bulawayo Branch",
    isHeadOffice: false,
    address: "No. 1 Selous Building, Cnr 10th / Jason Moyo, Bulawayo",
    phone: "+263 785 202 555",
    hours: "Mon-Fri: 8am - 5pm, Sat: 8am - 1pm",
    lat: -20.153,
    lng: 28.585,
  },
  {
    id: "mutare-depot",
    town: "Mutare",
    name: "Mutare Depot",
    isHeadOffice: false,
    address: "Mutare Central, Mutare",
    phone: "+263 773 303 064",
    hours: "Mon-Fri: 8am - 5pm, Sat: Closed",
    lat: -18.973,
    lng: 32.67,
  },
  {
    id: "chiredzi-branch",
    town: "Chiredzi",
    name: "Farmbiz Chiredzi",
    isHeadOffice: false,
    address: "733 Msasa Road, Chiredzi",
    phone: "+263 773 303 064",
    hours: "Mon-Fri: 8am - 5pm, Sat: 8am - 1pm",
    lat: -21.05,
    lng: 31.667,
  },
  ...branchLocations
    .filter(
      (town) => !["Harare", "Bulawayo", "Mutare", "Chiredzi"].includes(town),
    )
    .map((town) => ({
      id: `location-${town.toLowerCase().replace(/\s+/g, "-")}`,
      town,
      name: town === "Farmbiz Genetics" ? town : `${town} Branch`,
    })),
];

const hasCoords = (b) => typeof b.lat === "number" && typeof b.lng === "number";
const MAPPED = BRANCHES.filter(hasCoords);

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const toRad = (deg) => (deg * Math.PI) / 180;

function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatKm(km) {
  if (km < 1) return "under 1 km";
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

function directionsUrl(branch) {
  if (hasCoords(branch)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`;
}

const iconCache = {};
function getPinIcon(isActive, isHeadOffice) {
  const key = `${isActive}-${isHeadOffice}`;
  if (!iconCache[key]) {
    const fill = isHeadOffice
      ? isActive
        ? "#d97706"
        : "#f59e0b"
      : isActive
        ? "#047857"
        : "#059669";
    const scale = isActive ? 1.25 : 1;
    iconCache[key] = L.divIcon({
      className: "",
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      tooltipAnchor: [0, -40],
      html: `<svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true"
        style="transform:scale(${scale});transform-origin:50% 100%;transition:transform .2s;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
        <path d="M18 43C18 43 33 28 33 17.5C33 9 26.3 2 18 2C9.7 2 3 9 3 17.5C3 28 18 43 18 43Z" fill="${fill}" stroke="#fff" stroke-width="2.5"/>
        <circle cx="18" cy="17.5" r="6" fill="#fff"/>
      </svg>`,
    });
  }
  return iconCache[key];
}

const userIcon = L.divIcon({
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: `<span class="relative flex h-[18px] w-[18px]">
      <span class="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60 motion-safe:animate-ping"></span>
      <span class="relative inline-flex h-[18px] w-[18px] rounded-full border-2 border-white bg-sky-600 shadow"></span>
    </span>`,
});

/* -------------------------------------------------------------------------- */
/* Map controller: moves & resizes map cleanly across breakpoints              */
/* -------------------------------------------------------------------------- */

function MapController({ activeBranch, points, userPos, fitWithUser }) {
  const map = useMap();
  const firstRun = useRef(true);

  useEffect(() => {
    const container = map.getContainer();
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: false });
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const animate = !prefersReducedMotion && !firstRun.current;
    firstRun.current = false;

    const fit = (bounds, options) =>
      animate
        ? map.flyToBounds(bounds, { ...options, duration: 0.8 })
        : map.fitBounds(bounds, { ...options, animate: false });
    const focus = (latlng, zoom) =>
      animate
        ? map.flyTo(latlng, zoom, { duration: 0.8 })
        : map.setView(latlng, zoom, { animate: false });

    if (activeBranch) {
      if (fitWithUser && userPos) {
        fit(
          L.latLngBounds([
            [userPos.lat, userPos.lng],
            [activeBranch.lat, activeBranch.lng],
          ]),
          { padding: [70, 70], maxZoom: 11 },
        );
      } else {
        focus(
          [activeBranch.lat, activeBranch.lng],
          Math.max(map.getZoom(), 10),
        );
      }
      return;
    }

    if (points.length === 1) {
      focus([points[0].lat, points[0].lng], 10);
    } else if (points.length > 1) {
      fit(L.latLngBounds(points.map((p) => [p.lat, p.lng])), {
        padding: [56, 56],
        maxZoom: 8,
      });
    } else {
      fit(ZIM_BOUNDS, { padding: [10, 10] });
    }
  }, [activeBranch, points, userPos, fitWithUser, map]);

  return null;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function BranchSection() {
  const [activeBranchId, setActiveBranchId] = useState(null);
  const [expandedBranchId, setExpandedBranchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Locations");
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [mobileView, setMobileView] = useState("list");

  const [userPos, setUserPos] = useState(null);
  const [nearestId, setNearestId] = useState(null);
  const [fitWithUser, setFitWithUser] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState(null);

  const cardRefs = useRef({});

  const distances = useMemo(() => {
    if (!userPos) return {};
    return Object.fromEntries(
      MAPPED.map((b) => [b.id, distanceKm(userPos, b)]),
    );
  }, [userPos]);

  const visibleBranches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = BRANCHES.filter((branch) => {
      const matchesTab =
        selectedFilter === "All Locations" || branch.town === selectedFilter;
      const matchesSearch =
        branch.town.toLowerCase().includes(term) ||
        branch.name.toLowerCase().includes(term) ||
        (branch.address ?? "").toLowerCase().includes(term);
      return matchesTab && matchesSearch;
    });
    if (!userPos) return list;
    return [...list].sort((a, b) => {
      const da = distances[a.id];
      const db = distances[b.id];
      if (da === undefined && db === undefined) return 0;
      if (da === undefined) return 1;
      if (db === undefined) return -1;
      return da - db;
    });
  }, [searchTerm, selectedFilter, userPos, distances]);

  const mappedVisible = useMemo(
    () => visibleBranches.filter(hasCoords),
    [visibleBranches],
  );
  const displayedBranches = showAllBranches
    ? visibleBranches
    : visibleBranches.slice(0, 5);

  const activeBranch =
    mappedVisible.find((b) => b.id === activeBranchId) ?? null;
  const nearestBranch = MAPPED.find((b) => b.id === nearestId) ?? null;

  const selectBranch = (id, { toggle = false } = {}) => {
    setFitWithUser(false);
    const nextId = toggle && activeBranchId === id ? null : id;
    setActiveBranchId(nextId);
    setExpandedBranchId(nextId);
  };

  useEffect(() => {
    if (!activeBranchId) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    cardRefs.current[activeBranchId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [activeBranchId]);

  const clearLocation = () => {
    setUserPos(null);
    setNearestId(null);
    setFitWithUser(false);
    setGeoNotice(null);
  };

  const handleFindNearest = () => {
    if (!("geolocation" in navigator)) {
      setGeoNotice({
        tone: "error",
        text: "Your browser can’t share its location. Search by town instead.",
      });
      return;
    }

    setLocating(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const here = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const [nearest] = MAPPED.map((b) => ({
          branch: b,
          km: distanceKm(here, b),
        })).sort((a, b) => a.km - b.km);

        setLocating(false);

        if (nearest.km > FAR_KM) {
          clearLocation();
          setGeoNotice({
            tone: "info",
            text: `You’re about ${formatKm(nearest.km)} from our nearest branch (${nearest.branch.town}), so we’ve left the map as it is.`,
          });
          return;
        }

        setSearchTerm("");
        setSelectedFilter("All Locations");
        setUserPos(here);
        setNearestId(nearest.branch.id);
        setActiveBranchId(nearest.branch.id);
        setExpandedBranchId(nearest.branch.id);
        setFitWithUser(true);
        setShowAllBranches(false);
      },
      (error) => {
        setLocating(false);
        const messages = {
          1: "Location access was blocked. Allow it in your browser settings, or search by town instead.",
          2: "We couldn’t work out your location. Search by town instead.",
          3: "Finding your location took too long. Try again, or search by town.",
        };
        setGeoNotice({
          tone: "error",
          text: messages[error.code] ?? messages[2],
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <section
      id="branches"
      className="py-10 sm:py-16 lg:py-20 bg-stone-50 border-y border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="mb-6 sm:mb-10 lg:mb-12">
          <p className="text-emerald-700 font-semibold tracking-wide uppercase text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Our Nationwide Presence
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Find a Farmbiz branch near you.
          </h2>
        </div>

        {/* Responsive Layout:
            Mobile (< lg): 1. Search & Filters -> 2. Map & Stats -> 3. Branch Cards
            Desktop (lg+): Left 7 cols = Map & Stats; Right 5 cols = Search & Filters above Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-x-12 lg:gap-y-0">
          {/* 1. SEARCH & LOCATION FILTERS */}
          <div className="order-1 lg:order-none lg:col-start-8 lg:col-span-5 lg:row-start-1 flex flex-col">
            <div className="relative mb-3 sm:mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by town or branch name..."
                aria-label="Search branches by town or name"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowAllBranches(false);
                }}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm"
              />
            </div>

            <div
              className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 sm:pb-2 lg:mb-4"
              role="region"
              aria-label="Filter branches by location. Scroll horizontally to view all locations."
              tabIndex={0}
            >
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(option);
                    setActiveBranchId(null);
                    setExpandedBranchId(null);
                    setFitWithUser(false);
                    setShowAllBranches(false);
                  }}
                  className={`shrink-0 min-h-10 sm:min-h-11 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-colors border cursor-pointer ${
                    selectedFilter === option
                      ? "bg-stone-800 text-white border-stone-800"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div
              className="grid grid-cols-2 gap-2 lg:hidden"
              role="group"
              aria-label="Choose branch directory view"
            >
              {[
                { id: "list", label: "List" },
                { id: "map", label: "Map" },
              ].map((view) => (
                <button
                  key={view.id}
                  type="button"
                  aria-pressed={mobileView === view.id}
                  onClick={() => setMobileView(view.id)}
                  className={`min-h-10 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                    mobileView === view.id
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-stone-200 bg-white text-stone-700"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. MAP, NEAREST CONTROL & STATISTICS */}
          <div className={`${mobileView === "map" ? "flex" : "hidden lg:flex"} order-2 lg:order-none lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-2 flex-col`}>
            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handleFindNearest}
                disabled={locating}
                className="inline-flex w-full sm:w-auto min-h-12 sm:min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-70 cursor-pointer"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4" />
                )}
                {locating ? "Finding you…" : "Find my nearest branch"}
              </button>

              {userPos && (
                <button
                  type="button"
                  onClick={clearLocation}
                  className="inline-flex w-full sm:w-auto min-h-10 sm:min-h-11 items-center justify-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Clear location
                </button>
              )}

              {(geoNotice || (userPos && nearestBranch)) && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-xs sm:text-sm ${
                    geoNotice?.tone === "error"
                      ? "text-red-700"
                      : "text-stone-600"
                  }`}
                >
                  {geoNotice
                    ? geoNotice.text
                    : `Nearest to you: ${nearestBranch.name}, about ${formatKm(distances[nearestBranch.id])} away in a straight line.`}
                </p>
              )}
            </div>

            <div className="relative isolate w-full h-[280px] sm:h-[340px] md:h-auto md:aspect-[4/3] bg-stone-100 rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <MapContainer
                bounds={ZIM_BOUNDS}
                maxBounds={MAX_BOUNDS}
                maxBoundsViscosity={0.9}
                minZoom={5}
                maxZoom={17}
                zoomSnap={0.5}
                scrollWheelZoom={false}
                dragging={!L.Browser.mobile}
                className="h-full w-full"
                aria-label="Map of Farmbiz branch locations in Zimbabwe"
              >
                <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

                <MapController
                  activeBranch={activeBranch}
                  points={mappedVisible}
                  userPos={userPos}
                  fitWithUser={fitWithUser}
                />

                {userPos && fitWithUser && activeBranch && (
                  <Polyline
                    positions={[
                      [userPos.lat, userPos.lng],
                      [activeBranch.lat, activeBranch.lng],
                    ]}
                    pathOptions={{
                      color: "#047857",
                      weight: 2,
                      dashArray: "6 8",
                    }}
                  />
                )}

                {userPos && (
                  <Marker
                    position={[userPos.lat, userPos.lng]}
                    icon={userIcon}
                    interactive={false}
                    keyboard={false}
                  />
                )}

                {mappedVisible.map((branch) => {
                  const isActive = activeBranchId === branch.id;
                  return (
                    <Marker
                      key={branch.id}
                      position={[branch.lat, branch.lng]}
                      icon={getPinIcon(isActive, branch.isHeadOffice)}
                      title={branch.name}
                      alt={branch.name}
                      zIndexOffset={
                        isActive ? 1000 : branch.isHeadOffice ? 500 : 0
                      }
                      riseOnHover
                      eventHandlers={{
                        click: () => selectBranch(branch.id, { toggle: true }),
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -4]}>
                        {branch.town}
                        {branch.isHeadOffice ? " (Head Office)" : ""}
                      </Tooltip>
                    </Marker>
                  );
                })}
              </MapContainer>

              {visibleBranches.length > 0 && mappedVisible.length === 0 && (
                <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg bg-stone-900/90 px-3 py-2 text-xs font-semibold text-white">
                  This location isn’t on the map yet.
                </div>
              )}
            </div>

            {/* Location Statistics Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 bg-white border border-stone-200 rounded-xl p-3 sm:p-6 shadow-sm">
              <div className="text-center border-r border-stone-100">
                <span className="block text-xl sm:text-2xl font-black text-emerald-800">
                  13+
                </span>
                <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider mt-1 block">
                  Locations*
                </span>
              </div>
              <div className="text-center border-r border-stone-100 flex flex-col items-center justify-center">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mb-1" />
                <span className="text-[10px] sm:text-xs text-stone-600 font-semibold leading-tight">
                  Nationwide
                  <br />
                  Coverage
                </span>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mb-1" />
                <span className="text-[10px] sm:text-xs text-stone-600 font-semibold leading-tight">
                  Serving Farmers
                  <br />
                  Since 2016
                </span>
              </div>
            </div>
          </div>

          {/* 3. BRANCH CARDS LIST */}
          <div className={`${mobileView === "list" ? "flex" : "hidden lg:flex"} order-3 lg:order-none lg:col-start-8 lg:col-span-5 lg:row-start-2 flex-col lg:h-[530px]`}>
            <div className="space-y-3 sm:space-y-4 pb-2 sm:pb-4 lg:pr-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar">
              {visibleBranches.length === 0 ? (
                <div className="text-center p-6 sm:p-8 bg-white rounded-xl border border-stone-200">
                  <p className="text-stone-500 text-sm">
                    No branches found matching your search.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("All Locations");
                      setShowAllBranches(false);
                    }}
                    className="mt-3 text-emerald-700 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                displayedBranches.map((branch) => {
                  const isExpanded = expandedBranchId === branch.id;
                  const isNearest = userPos && nearestId === branch.id;
                  const km = distances[branch.id];

                  return (
                    <div
                      key={branch.id}
                      ref={(el) => (cardRefs.current[branch.id] = el)}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 ${
                        isExpanded
                          ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10 shadow-md"
                          : "border-stone-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`branch-details-${branch.id}`}
                        onClick={() =>
                          setExpandedBranchId((current) =>
                            current === branch.id ? null : branch.id,
                          )
                        }
                        className="flex w-full items-center justify-between gap-3 text-left cursor-pointer"
                      >
                        <span className="min-w-0">
                          <span className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                            <span>{branch.town}</span>
                            {km !== undefined && (
                              <span className="font-semibold normal-case tracking-normal text-stone-500">
                                {formatKm(km)} away
                              </span>
                            )}
                            {isNearest && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-800">
                                <LocateFixed className="h-3 w-3" /> Nearest
                              </span>
                            )}
                            {branch.isHeadOffice && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                                <Building2 className="h-3 w-3" /> Head Office
                              </span>
                            )}
                          </span>
                          <span className="block text-base font-bold text-stone-900 sm:text-lg">
                            {branch.name}
                          </span>
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-5 w-5 shrink-0 text-stone-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        id={`branch-details-${branch.id}`}
                        hidden={!isExpanded}
                        className="mt-4 border-t border-stone-200 pt-4"
                      >
                        {branch.address || branch.phone || branch.hours ? (
                          <address className="mb-4 space-y-3 not-italic">
                            {branch.address && (
                              <div className="flex items-start gap-3 text-sm text-stone-600">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                                <span>{branch.address}</span>
                              </div>
                            )}
                            {branch.phone && (
                              <div className="flex items-center gap-3 text-sm text-stone-600">
                                <Phone className="h-4 w-4 shrink-0 text-stone-400" />
                                <a
                                  href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                                  className="hover:text-emerald-700 hover:underline"
                                >
                                  {branch.phone}
                                </a>
                              </div>
                            )}
                            {branch.hours && (
                              <div className="flex items-start gap-3 text-sm text-stone-600">
                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                                <span>{branch.hours}</span>
                              </div>
                            )}
                          </address>
                        ) : (
                          <p className="mb-4 text-sm text-stone-500">
                            Address and contact details are not listed yet.
                          </p>
                        )}

                        {branch.phone && branch.address && (
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <a
                              href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                              className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900 sm:text-sm"
                            >
                              <Phone className="h-4 w-4" />
                              Call Branch
                            </a>
                            <a
                              href={directionsUrl(branch)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-900 sm:text-sm"
                            >
                              <Navigation className="h-4 w-4" />
                              Get Directions
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {visibleBranches.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllBranches((showing) => !showing)}
                className="mt-3 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-emerald-800 transition-colors hover:bg-stone-100 lg:mt-4"
              >
                {showAllBranches
                  ? "Show fewer branches"
                  : `Show all ${visibleBranches.length} branches`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}