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
} from "lucide-react";
import { TOWNS } from "../data/branches";

/* -------------------------------------------------------------------------- */
/* Map configuration                                                          */
/* -------------------------------------------------------------------------- */

// Tile source. OpenStreetMap's public server is fine for a prototype, but its
// policy is for light use. Before going live, set VITE_MAP_TILE_URL (and
// VITE_MAP_ATTRIBUTION) in your .env to a provider you have an account with.
const TILE_URL =
  import.meta.env.VITE_MAP_TILE_URL ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  import.meta.env.VITE_MAP_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Rough bounding box of Zimbabwe: [[south, west], [north, east]]
const ZIM_BOUNDS = [
  [-22.5, 25.2],
  [-15.5, 33.1],
];
// How far the map can be panned (a little wider than Zimbabwe)
const MAX_BOUNDS = [
  [-24.5, 23.0],
  [-13.5, 35.5],
];

// If the visitor is further than this from every branch, we don't use their
// location (they're probably abroad, and a 1,500 km "nearest" isn't useful).
const FAR_KM = 600;

/* -------------------------------------------------------------------------- */
/* Branch data (static, so it lives outside the component)                    */
/* -------------------------------------------------------------------------- */

const branchLocations = [...TOWNS.slice(1), "Farmbiz Genetics"];
const filterOptions = ["All Locations", ...branchLocations];

// TODO: lat/lng below are approximate town-centre points. For the client demo,
// replace each with the exact spot: open the address in Google Maps,
// right-click the pin, click the coordinates to copy them.
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
  // Branches without full details yet: listed in the directory, not on the map
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

// Straight-line (great-circle) distance in km
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

// Teardrop pin as a Leaflet divIcon, so it matches the site's emerald palette.
// Icons are cached so markers don't get a new icon object on every render.
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
      iconAnchor: [18, 44], // the tip of the pin sits exactly on the coordinate
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

// Pulsing dot for the visitor's own location
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
/* Map controller: moves the map when selection, filters or location change   */
/* -------------------------------------------------------------------------- */

function MapController({ activeBranch, points, userPos, fitWithUser }) {
  const map = useMap();
  const firstRun = useRef(true);

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
        // Show the visitor and their nearest branch together
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Locations");

  // Nearest-branch feature
  const [userPos, setUserPos] = useState(null);
  const [nearestId, setNearestId] = useState(null);
  const [fitWithUser, setFitWithUser] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState(null); // { tone: "error" | "info", text }

  const cardRefs = useRef({});

  // Distance from the visitor to every branch that has coordinates
  const distances = useMemo(() => {
    if (!userPos) return {};
    return Object.fromEntries(
      MAPPED.map((b) => [b.id, distanceKm(userPos, b)]),
    );
  }, [userPos]);

  // Filter logic: town tabs AND the search bar. Sorted by distance once we
  // know where the visitor is (branches without coordinates go last).
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

  const activeBranch =
    mappedVisible.find((b) => b.id === activeBranchId) ?? null;
  const nearestBranch = MAPPED.find((b) => b.id === nearestId) ?? null;

  // Select a branch (from a card or a pin). Picking one manually ends the
  // "show me and my nearest branch" view.
  const selectBranch = (id, { toggle = false } = {}) => {
    setFitWithUser(false);
    setActiveBranchId((current) => (toggle && current === id ? null : id));
  };

  // Scroll the directory to the active card (desktop only: on phones the list
  // sits below the map and jumping the page would be jarring)
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

        // Make sure the nearest branch isn't hidden by an active filter
        setSearchTerm("");
        setSelectedFilter("All Locations");
        setUserPos(here);
        setNearestId(nearest.branch.id);
        setActiveBranchId(nearest.branch.id);
        setFitWithUser(true);
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
            {/* Nearest-branch control + status */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleFindNearest}
                disabled={locating}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-800 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-70"
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
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
                >
                  <X className="h-4 w-4" />
                  Clear location
                </button>
              )}

              <p
                role="status"
                aria-live="polite"
                className={`text-sm ${
                  geoNotice?.tone === "error"
                    ? "text-red-700"
                    : "text-stone-600"
                }`}
              >
                {geoNotice
                  ? geoNotice.text
                  : userPos && nearestBranch
                    ? `Nearest to you: ${nearestBranch.name}, about ${formatKm(distances[nearestBranch.id])} away in a straight line.`
                    : ""}
              </p>
            </div>

            {/* Interactive map (isolate keeps Leaflet's z-indexes from
                leaking over your navbar or modals) */}
            <div className="relative isolate w-full aspect-square md:aspect-[4/3] bg-stone-100 rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <MapContainer
                bounds={ZIM_BOUNDS}
                maxBounds={MAX_BOUNDS}
                maxBoundsViscosity={0.9}
                minZoom={5}
                maxZoom={17}
                zoomSnap={0.5}
                scrollWheelZoom={false} // don't hijack page scrolling
                dragging={!L.Browser.mobile} // phones: one finger scrolls the page, two fingers move the map
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

                {/* Line from the visitor to their nearest branch */}
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
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 bg-white border border-stone-200 rounded-xl p-3 sm:p-6 shadow-sm">
              <div className="text-center border-r border-stone-100">
                <span className="block text-2xl font-black text-emerald-800">
                  13+
                </span>
                <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider mt-1 block">
                  Locations*
                </span>
              </div>
              <div className="text-center border-r border-stone-100 flex flex-col items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-[10px] sm:text-xs text-stone-600 font-semibold leading-tight">
                  Nationwide
                  <br />
                  Coverage
                </span>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-[10px] sm:text-xs text-stone-600 font-semibold leading-tight">
                  Serving Farmers
                  <br />
                  Since 2016
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Directory & Filters */}
          <div className="lg:col-span-5 flex flex-col lg:h-[650px]">
            {/* Search Field */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by town or branch name..."
                aria-label="Search branches by town or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm"
              />
            </div>

            {/* Town Filters */}
            <div
              className="flex flex-nowrap gap-2 mb-6 overflow-x-auto overscroll-x-contain pb-2"
              role="region"
              aria-label="Filter branches by location. Scroll horizontally to view all locations."
              tabIndex={0}
            >
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilter(option);
                    setActiveBranchId(null);
                    setFitWithUser(false);
                  }}
                  className={`shrink-0 min-h-11 px-4 py-2 rounded-full text-xs font-bold transition-colors border ${
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
            <div className="space-y-4 pb-4 pr-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar">
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
                  const isNearest = userPos && nearestId === branch.id;
                  const km = distances[branch.id];

                  return (
                    <div
                      key={branch.id}
                      ref={(el) => (cardRefs.current[branch.id] = el)}
                      onClick={() => selectBranch(branch.id)}
                      className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10 shadow-md"
                          : "border-stone-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Branch Hierarchy Header */}
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          {branch.town}
                          {km !== undefined && (
                            <span className="ml-2 font-semibold normal-case tracking-normal text-stone-500">
                              {formatKm(km)} away
                            </span>
                          )}
                        </span>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {isNearest && (
                            <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                              <LocateFixed className="w-3 h-3" /> Nearest to you
                            </span>
                          )}
                          {branch.isHeadOffice && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                              <Building2 className="w-3 h-3" /> Head Office
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-stone-900 mb-4">
                        {branch.name}
                      </h3>

                      {/* Contact Information */}
                      {branch.address || branch.phone || branch.hours ? (
                        <address className="not-italic space-y-3 mb-6">
                          {branch.address && (
                            <div className="flex items-start gap-3 text-sm text-stone-600">
                              <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                              <span>{branch.address}</span>
                            </div>
                          )}
                          {branch.phone && (
                            <div className="flex items-center gap-3 text-sm text-stone-600">
                              <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                              <a
                                href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-emerald-700 hover:underline"
                              >
                                {branch.phone}
                              </a>
                            </div>
                          )}
                          {branch.hours && (
                            <div className="flex items-start gap-3 text-sm text-stone-600">
                              <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                              <span>{branch.hours}</span>
                            </div>
                          )}
                        </address>
                      ) : (
                        <p className="mb-6 text-sm text-stone-500">
                          Address and contact details are not listed yet.
                        </p>
                      )}

                      {/* Actions */}
                      {branch.phone && branch.address && (
                        <div className="grid grid-cols-2 gap-3">
                          <a
                            href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 text-sm font-bold transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Call Branch
                          </a>
                          <a
                            href={directionsUrl(branch)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-sm font-bold transition-colors"
                          >
                            <Navigation className="w-4 h-4" />
                            Get Directions
                          </a>
                        </div>
                      )}
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
