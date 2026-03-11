import { useState, useMemo, useRef, useEffect, useCallback } from "react";

/**
 * @typedef {Object} Practice
 * @property {number} id
 * @property {string} title
 * @property {string} url
 * @property {string} brand
 * @property {string} dim
 * @property {string} topic
 * @property {string} inf
 * @property {number} year
 * @property {string} country
 * @property {string} org
 * @property {string} desc
 * @property {string} img
 * @property {boolean} award
 */

/* ==== SECTION: DATA LAYER ==== */

/* ──────────────────────────────────────────────────────────────────────────────
   PRACTICE DATA  (34 merged records)
   Schema: { id, title, url, brand, dim, topic, inf, year, country, org, desc, img, award }
   ────────────────────────────────────────────────────────────────────────────── */
const PRACTICES = [
  { id: 1, title: "Vegetation Management in Rights of Way", url: "https://renewables-grid.eu/database/vegetation-management-in-rights-of-way/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2023, country: "Finland", org: "Fingrid", desc: "Fingrid's vegetation management system focuses on careful maintenance of rights of way, creating habitats through artificial snags and decaying wood.", img: "https://renewables-grid.eu/app/uploads/2025/09/Fingrid-IVM_1-644x398-c-default.jpg", award: false },
  { id: 2, title: "VegeLine \u2013 Vegetation Management System", url: "https://renewables-grid.eu/database/vegeline-vegetation-management-system/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2023, country: "Slovenia", org: "ELES", desc: "ELES uses optimization tools and asset management software to integrate biodiversity protection with grid expansion and invasive species management.", img: "https://renewables-grid.eu/app/uploads/2025/09/ELES_VegeLine-322x196-c-default.png", award: false },
  { id: 3, title: "Tennet's Inspiration Guide", url: "https://renewables-grid.eu/database/tennets-inspiration-guide/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2023, country: "Germany", org: "TenneT", desc: "56 methods for conserving nature around powerlines \u2014 from insect sanctuaries to mowing regimes like sinus management.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT-Guide_1-322x196-c-default.png", award: false },
  { id: 4, title: "Ecological Corridor Management", url: "https://renewables-grid.eu/database/ecological-corridor-management/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2021, country: "Germany", org: "E.ON, Westnetz", desc: "A 13,000km ecological corridor network across Europe, finding 5x more biodiversity in managed grid corridors.", img: "https://renewables-grid.eu/app/uploads/2025/09/IVM-Westnetz_1-322x196-c-default.jpg", award: true },
  { id: 5, title: "Autonomous IoT Device to Repel Birds", url: "https://renewables-grid.eu/database/autonomous-iot-device-to-repel-birds-from-power-lines/", brand: "RGI", dim: "Nature", topic: "Bird protection", inf: "Grids", year: 2021, country: "Spain", org: "Energiot, Iberdrola", desc: "An innovative IoT solution using sound and light to deter birds from power lines without causing harm.", img: "", award: false },
  { id: 6, title: "Bird Protection System", url: "https://renewables-grid.eu/database/bird-protection-system-2/", brand: "RGI", dim: "Nature", topic: "Bird protection", inf: "Onshore wind", year: 2024, country: "Poland", org: "Bioseco", desc: "Visual modules and advanced algorithms detect, track and deter birds to minimise mortality at wind farms.", img: "https://renewables-grid.eu/app/uploads/2025/09/BIOSECO_Photo_4-322x196-c-default.jpg", award: true },
  { id: 7, title: "e-faunalert Mobile Application", url: "https://renewables-grid.eu/database/e-faunalert-mobile-application-2/", brand: "RGI", dim: "Nature", topic: "Bird protection", inf: "Grids", year: 2024, country: "Europe", org: "IUCN", desc: "Mobile app enabling citizen science data collection on power line wildlife interactions across the Mediterranean.", img: "https://renewables-grid.eu/app/uploads/2025/09/IUCN_Photo_1-644x398-c-default.jpg", award: true },
  { id: 8, title: "Environmentally Friendly Bird Protection", url: "https://renewables-grid.eu/database/environmentally-friendly-and-cost-effective-bird-protection/", brand: "RGI", dim: "Nature", topic: "Bird protection", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "Drones install Firefly wire markers on high-voltage lines to reduce bird collisions in Wageningen.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__Photo_1-min-scaled-644x398-c-default.jpg", award: true },
  { id: 9, title: "LIFE Safe Grid for Burgas", url: "https://renewables-grid.eu/database/life-safe-grid-for-burgas/", brand: "RGI", dim: "Nature", topic: "Bird protection", inf: "Grids", year: 2024, country: "Bulgaria", org: "Elektrorazpredelenie Yug", desc: "EU LIFE-funded project conserving threatened bird species in the Burgas Lakes region through grid retrofitting.", img: "", award: true },
  { id: 10, title: "Better Biodiversity in Vegetation Contracts", url: "https://renewables-grid.eu/database/better-consideration-of-biodiversity-in-vegetation-management-contracts/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2024, country: "France", org: "RTE", desc: "RTE ceased vegetation activities during sensitive periods (March-August) to protect nesting birds and wildlife.", img: "", award: true },
  { id: 11, title: "Hydrogen-Powered Drill for HV Cable Installation", url: "https://renewables-grid.eu/database/hydrogen-powered-drill-for-emission-free-installation-of-hv-cables/", brand: "RGI", dim: "Technology", topic: "Circularity and supply chains", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "Emission-free drilling for grid enforcement using hydrogen power in environmentally sensitive areas.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/3/4/csm_TenneT__H2_Photo_1_c1de2ac13e.jpg", award: true },
  { id: 12, title: "Grid Orchards: Heritage 'Ermelo' Oranges", url: "https://renewables-grid.eu/database/grid-orchards-promoting-heritage-ermelo-oranges-in-grid-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2024, country: "Portugal", org: "REN", desc: "Preserving endangered Ermelo orange trees within powerline corridors, converting them into productive orchards.", img: "", award: true },
  { id: 13, title: "Ecosystems on Princess Elisabeth Island", url: "https://renewables-grid.eu/database/resilient-ecosystems-development-on-princess-elisabeth-island/", brand: "OCEaN", dim: "Nature", topic: "Offshore energy and nature", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Ocean Ecostructures", desc: "Turning the world's first artificial energy island foundation into a giant artificial reef for marine life.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/4/2/csm_Ocean_Eco_1-min_c2ee8a3c93.png", award: true },
  { id: 14, title: "Nature-Inclusive Design for Energy Island", url: "https://renewables-grid.eu/database/nature-inclusive-design-approach-planned-for-the-princess-elisabeth-island/", brand: "OCEaN", dim: "Nature", topic: "Offshore energy and nature", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Elia", desc: "A nature-inclusive design approach demonstrating how offshore renewables can coexist with marine biodiversity.", img: "", award: true },
  { id: 15, title: "Virtual Presentation of Grid Projects", url: "https://renewables-grid.eu/database/virtual-presentation-of-grid-projects-and-environmental-constraints/", brand: "RGI", dim: "Technology", topic: "Spatial optimisation", inf: "Grids", year: 2024, country: "Portugal", org: "REN", desc: "The VeR project revolutionises field visits using augmented reality to visualise grid infrastructure constraints.", img: "", award: true },
  { id: 16, title: "First Grid-Forming 300 MVAr STATCOM", url: "https://renewables-grid.eu/database/first-grid-forming-300-mvar-statcom-in-germany/", brand: "RGI", dim: "Technology", topic: "Climate adaptation and resilience", inf: "Grids", year: 2024, country: "Germany", org: "Amprion", desc: "Addressing grid stability with reactive power support and grid-forming control, operating nearly silently.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/6/4/csm_Amprion_Photo_3-min_675517bf39.jpg", award: true },
  { id: 17, title: "Open Energy Modelling Initiative", url: "https://renewables-grid.eu/database/open-energy-modelling-initiative-openmod/", brand: "RGI", dim: "Technology", topic: "Energy system planning", inf: "Energy system", year: 2024, country: "Europe", org: "openmod", desc: "Promoting open science for energy system decarbonisation through transparent data sharing and collaboration.", img: "", award: true },
  { id: 18, title: "SuedLink Digital Portal", url: "https://renewables-grid.eu/database/bye-bye-paper-floods-digital-energy-transition-with-the-suedlink-portal/", brand: "RGI", dim: "People", topic: "Public acceptance and engagement", inf: "Grids", year: 2024, country: "Germany", org: "TransnetBW", desc: "Digital communication and contract processing with property owners involved in electricity grid projects.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/b/c/csm_Transnet__Ph2_a89434df99.png", award: true },
  { id: 19, title: "EmPOWER Your Environment", url: "https://renewables-grid.eu/database/empower-your-environment/", brand: "RGI", dim: "People", topic: "Public acceptance and engagement", inf: "Grids", year: 2024, country: "Poland", org: "PSE", desc: "Enhancing community well-being and sustainable development near energy infrastructure through direct engagement.", img: "", award: true },
  { id: 20, title: "EirGrid Community Forum", url: "https://renewables-grid.eu/database/eirgrid-community-forum/", brand: "RGI", dim: "People", topic: "Public acceptance and engagement", inf: "Grids", year: 2024, country: "Ireland", org: "EirGrid", desc: "Independently facilitated forums fostering early community involvement in grid infrastructure projects.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/a/f/csm_EirGrid_Picture_2_7c7df407b5.jpg", award: true },
  { id: 21, title: "NaturaConnect Ecological Network", url: "https://renewables-grid.eu/database/naturaconnect/", brand: "GINGR", dim: "Nature", topic: "Nature conservation and restoration", inf: "Energy system", year: 2022, country: "Europe", org: "NaturaConnect", desc: "22 partners from 15 EU countries building a Trans-European Nature Network to connect protected areas.", img: "", award: false },
  { id: 22, title: "SafeLines4Birds Mediterranean", url: "#", brand: "SL4B", dim: "Nature", topic: "Bird protection", inf: "Grids", year: 2023, country: "Europe", org: "BirdLife", desc: "Reducing bird electrocution and collision through systematic retrofitting of dangerous power line designs.", img: "", award: false },
  { id: 23, title: "XR@TransnetBW Immersive Grid Planning", url: "https://renewables-grid.eu/database/xr-transnetbw/", brand: "RGI", dim: "People", topic: "Public acceptance and engagement", inf: "Grids", year: 2023, country: "Germany", org: "TransnetBW", desc: "Extended reality turns infrastructure projects into immersive experiences before they exist.", img: "", award: false },
  { id: 24, title: "e-Gridmap Renewable Connection Tool", url: "https://renewables-grid.eu/database/e-gridmap/", brand: "RGI", dim: "Technology", topic: "Energy system planning", inf: "Grids", year: 2020, country: "Estonia", org: "Elering", desc: "One-click tool calculating renewable connection costs, reducing the location assessment from 3 months to seconds.", img: "", award: false },
  { id: 25, title: "Moonshot", url: "https://renewables-grid.eu/database/moonshot/", brand: "RGI", dim: "Technology", topic: "Circularity and supply chains", inf: "Offshore wind", year: 2024, country: "Netherlands", org: "ECHT regie in transitie", desc: "The Moonshot practice fosters collaboration between academia, policy, and industry to enhance sustainability of the wind sector.", img: "https://renewables-grid.eu/app/uploads/2025/09/ECHT_Regie_Photo_1-scaled-644x398-c-default.jpg", award: true },
  { id: 26, title: "Agri-PV", url: "https://renewables-grid.eu/database/agri-pv/", brand: "RGI", dim: "Technology", topic: "Spatial optimisation", inf: "Solar", year: 2022, country: "USA", org: "Jack's Solar Garden", desc: "Researchers use the land under solar panels to study microclimates and how vegetation grows within the solar array.", img: "https://renewables-grid.eu/app/uploads/2024/11/Database_tech-scaled.png", award: true },
  { id: 27, title: "SPEED-E", url: "https://renewables-grid.eu/database/speed-e/", brand: "RGI", dim: "Technology", topic: "Energy system planning", inf: "Energy system", year: 2022, country: "Portugal", org: "REN", desc: "World's first EV power supply solution through the very-high voltage network for high power charging.", img: "https://renewables-grid.eu/app/uploads/2025/09/SPEED-E_2-scaled-322x196-c-default.jpg", award: true },
  { id: 28, title: "Bio Transport", url: "https://renewables-grid.eu/database/bio-transport/", brand: "RGI", dim: "Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2022, country: "Spain", org: "Red Electrica, CSIC", desc: "Scientific evaluation of the potential of the grid to enhance biodiversity.", img: "https://renewables-grid.eu/app/uploads/2025/09/BioTransport-1-digging-322x196-c-default.png", award: true },
  { id: 29, title: "Digital Citizen Information Market", url: "https://renewables-grid.eu/database/digital-citizen-information-market/", brand: "RGI", dim: "People", topic: "Creating awareness and capacity building", inf: "Grids", year: 2022, country: "Germany", org: "Amprion", desc: "Stakeholders invited to attend livestream events in virtual space.", img: "https://renewables-grid.eu/app/uploads/2025/09/Digital-Information-Market_Amprion_01-322x196-c-default.jpg", award: true },
  { id: 30, title: "Shaping Our Electricity Future", url: "https://renewables-grid.eu/database/shaping-our-electricity-future/", brand: "RGI", dim: "People", topic: "Public acceptance and engagement", inf: "Grids", year: 2022, country: "Ireland", org: "EirGrid, SONI", desc: "Build trust, new relationships, and raise awareness of the need for grid development.", img: "https://renewables-grid.eu/app/uploads/2025/09/Database_social-scaled.png", award: true },
  { id: 31, title: "Kriegers Flak \u2013 Combined Grid Solution", url: "https://renewables-grid.eu/database/x-flex/", brand: "RGI", dim: "Technology", topic: "Energy system planning", inf: "Offshore wind", year: 2021, country: "Denmark", org: "50Hertz, Energinet", desc: "World's first hybrid interconnector \u2014 effectively manages fluctuations in supply and demand.", img: "https://renewables-grid.eu/app/uploads/2025/09/50Herz__Kriegers_Flak_1-322x196-c-default.jpg", award: true },
  { id: 32, title: "Site Wind Right Tool", url: "https://renewables-grid.eu/database/site-wind-right-tool/", brand: "RGI", dim: "Technology", topic: "Spatial optimisation", inf: "Onshore wind", year: 2021, country: "USA", org: "The Nature Conservancy", desc: "Highlights areas with lowest potential for conflict, allowing impacts to be avoided to the maximum extent possible.", img: "https://renewables-grid.eu/app/uploads/2025/09/Site_Wind_Right_Map_Screenshot-322x196-c-default.png", award: true },
  { id: 33, title: "Italian Wind Parks Travel Guide", url: "https://renewables-grid.eu/database/italian-wind-parks-travel-guide/", brand: "RGI", dim: "People", topic: "Creating awareness and capacity building", inf: "Onshore wind", year: 2021, country: "Italy", org: "Legambiente", desc: "First guide in the world about wind park tourism \u2014 a new positive touristic approach to wind plants.", img: "https://renewables-grid.eu/app/uploads/2025/09/Database_nature-scaled.png", award: true },
  { id: 34, title: "COMPILE: Community Power in Energy Islands", url: "https://renewables-grid.eu/database/compile-integrating-community-power-in-energy-islands/", brand: "RGI", dim: "People", topic: "Public acceptance and engagement", inf: "Energy system", year: 2021, country: "Slovenia", org: "University of Ljubljana", desc: "Results obtained by real implementation of the solutions and progress beyond pure research.", img: "https://renewables-grid.eu/app/uploads/2025/09/Database_social-scaled.png", award: true },
];

/*
 * WordPress REST API integration (future)
 * Replace static PRACTICES with:
 * const [practices, setPractices] = useState(PRACTICES);
 * useEffect(() => {
 *   fetch("https://atlas.renewables-grid.eu/wp-json/eta/v1/practices")
 *     .then(r => r.json())
 *     .then(data => setPractices(data.practices))
 *     .catch(() => {});
 * }, []);
 */

/* ── Dimension-to-Topics mapping ── */
const DIMENSION_TOPICS = {
  Nature: ["Bird protection", "Integrated vegetation management", "Nature conservation and restoration", "Offshore energy and nature"],
  Technology: ["Circularity and supply chains", "Climate adaptation and resilience", "Energy system planning", "Spatial optimisation"],
  People: ["Creating awareness and capacity building", "Public acceptance and engagement"],
};

/* ── Brand links ── */
const BRAND_LINKS = {
  RGI: "https://renewables-grid.eu",
  OCEaN: "https://offshore-coalition.eu",
  GINGR: "https://gingr.org",
  SL4B: "https://safelines4birds.eu",
};

/* ══════════════════════════════════════════════════════════════════════════════
   COLOUR TOKENS  (from Figma branding frame)
   ══════════════════════════════════════════════════════════════════════════════ */
const PURPLE   = "#58044D";
const CREAM    = "#FFF8E5";
const CHARCOAL = "#424244";
const LTGREY   = "#C9C9C9";
const ITEMS_PER_PAGE = 7;

/* Derived filter option lists */
const allTopics    = [...new Set(PRACTICES.map(p => p.topic))].sort();
const allBrands    = [...new Set(PRACTICES.map(p => p.brand))].sort();
const allDims      = [...new Set(PRACTICES.map(p => p.dim))].sort();
const allCountries = [...new Set(PRACTICES.map(p => p.country))].sort();
const allYears     = [...new Set(PRACTICES.map(p => p.year))].sort((a, b) => b - a);
const allInfra     = [...new Set(PRACTICES.map(p => p.inf))].sort();
const allOrgs      = [...new Set(PRACTICES.map(p => p.org))].sort();

/* ── Helper: get filtered topics based on selected dimensions ── */
function getFilteredTopics(selectedDims) {
  if (!selectedDims.length) return allTopics;
  const topics = new Set();
  selectedDims.forEach(dim => {
    if (DIMENSION_TOPICS[dim]) {
      DIMENSION_TOPICS[dim].forEach(t => topics.add(t));
    }
  });
  return [...topics].sort();
}

/* ==== SECTION: REUSABLE COMPONENTS ==== */

/* ══════════════════════════════════════════════════════════════════════════════
   INLINE SVG ICONS
   ══════════════════════════════════════════════════════════════════════════════ */
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const IconListView = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const IconGridView = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="4" y="2" width="16" height="20" rx="1" /><line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" />
    <line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" />
    <line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" />
    <rect x="10" y="18" width="4" height="4" />
  </svg>
);

const IconLayers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   GREYSCALE RGI LOGO
   ══════════════════════════════════════════════════════════════════════════════ */
function GreyscaleRGILogo() {
  return (
    <svg className="w-[200px] h-auto opacity-80" viewBox="0 0 15905.4 4798.3" xmlns="http://www.w3.org/2000/svg">
      <g>
        <g>
          <path fill="#C9C9C9" d="M1114.1,2310.9l-316.3-696.4H335.1v696.4H125V637.2h656.3c195.9,0,332.8,54.2,424.9,148.7c80.3,85,132.2,193.6,132.2,339.9s-47.2,245.5-127.5,330.5c-49.6,52-120.4,92.2-200.6,118l335.2,736.6H1114.1z M781.2,830.8H335.1v587.8h446.2c198.3,0,339.9-80.3,339.9-292.7S979.5,830.8,781.2,830.8z"/>
          <path fill="#C9C9C9" d="M2537.4,1779.8h-845.1c0,108.5,42.5,226.6,115.7,299.7c54.3,54.3,127.5,85,219.5,85c94.5,0,172.3-26,221.9-77.9c33-33.1,54.3-66.1,70.8-129.8h195.9c-16.5,118-87.3,228.9-184.1,295c-85,56.7-191.2,89.7-304.5,89.7c-167.6,0-304.5-70.8-396.6-179.5c-99.1-115.6-148.7-273.9-148.7-443.8c0-144,25.9-271.4,92-382.4c85-144,243.2-250.2,450.9-250.2c153.4,0,276.2,59,363.6,153.4c96.8,106.2,153.4,259.6,151.1,420.2L2537.4,1779.8z M2261.2,1364.3c-49.6-66.1-129.9-108.6-236.1-108.6c-217.2,0-323.4,177-328.1,351.8h637.3C2334.4,1517.8,2308.4,1428,2261.2,1364.3z"/>
          <path fill="#C9C9C9" d="M3500.5,2310.9v-757.7c0-179.5-73.2-285.7-262-285.7c-115.7,0-207.7,75.5-259.6,184.1c-40.1,87.3-42.5,212.4-42.5,304.6v554.7h-200.6V1116.4h174.7l16.5,179.4c61.4-136.9,226.6-210,361.2-210c271.5,0,413.1,162.8,413.1,439.1v786H3500.5z"/>
          <path fill="#C9C9C9" d="M4959.3,1779.8h-845.1c0,108.5,42.5,226.6,115.7,299.7c54.3,54.3,127.5,85,219.5,85c94.5,0,172.3-26,221.9-77.9c33-33.1,54.3-66.1,70.8-129.8H4938c-16.5,118-87.3,228.9-184.1,295c-85,56.7-191.2,89.7-304.5,89.7c-167.6,0-304.5-70.8-396.6-179.5c-99.1-115.6-148.7-273.9-148.7-443.8c0-144,25.9-271.4,92-382.4c85-144,243.2-250.2,450.9-250.2c153.4,0,276.2,59,363.6,153.4c96.8,106.2,153.4,259.6,151.1,420.2L4959.3,1779.8z M4683.1,1364.3c-49.6-66.1-129.9-108.6-236.1-108.6c-217.2,0-323.4,177-328.1,351.8h637.4C4756.3,1517.8,4730.3,1428,4683.1,1364.3z"/>
          <path fill="#C9C9C9" d="M6432.2,2310.9h-193.6l-311.6-913.6l-318.7,913.6h-191.2l-306.9-1194.5h198.3l229,901.8l304.5-887.7h172.3l299.8,887.7l231.3-901.8h195.9L6432.2,2310.9z"/>
          <path fill="#C9C9C9" d="M7825,2327.4c-106.2,0-172.3-80.2-172.3-181.7h-4.7c-68.5,120.4-217.2,195.9-384.8,195.9c-273.9,0-410.8-184.1-410.8-368.3c0-153.4,99.1-354.1,424.9-373l363.6-21.3v-87.4c0-59-7.1-132.2-61.4-181.7c-40.1-37.8-99.1-61.4-195.9-61.4c-108.6,0-177,30.7-217.2,70.8c-37.8,37.8-59,85-59,144h-195.9c2.3-108.6,42.5-186.5,103.9-250.3c80.3-85,221.9-127.4,368.2-127.4c231.3,0,363.6,99.1,420.2,228.9c23.6,54.3,35.4,115.7,35.4,184.2v578.4c0,63.8,26,80.3,66.1,80.3c21.3,0,51.9-7.1,51.9-7.1v148.7C7914.7,2320.4,7874.6,2327.4,7825,2327.4z M7640.9,1734.9l-321.1,18.9c-120.4,7.1-262,63.7-262,214.9c0,106.2,66.1,205.3,236.1,205.3c92.1,0,181.8-30.7,245.5-96.8c70.8-73.2,101.5-172.3,101.5-271.5V1734.9z"/>
          <path fill="#C9C9C9" d="M9066.6,2211.8c-77.9,80.2-191.2,129.8-337.6,129.8c-134.6,0-288-66.1-356.4-186.6l-14.2,155.8h-177V606.6H8382v649.1c63.7-108.6,217.2-169.9,347-169.9c139.3,0,250.2,47.2,328.2,120.4c120.4,115.7,181.8,304.5,181.8,509.9C9238.9,1914.3,9179.9,2096.1,9066.6,2211.8z M8696,1255.7c-87.3,0-146.4,35.4-193.6,77.9c-99.1,87.3-132.2,231.3-132.2,380.1c0,148.7,33.1,292.7,132.2,380.1c47.2,42.4,106.2,77.8,193.6,77.8c266.8,0,337.6-238.4,337.6-457.9C9033.5,1494.2,8962.7,1255.7,8696,1255.7z"/>
          <path fill="#C9C9C9" d="M9734.6,2325.1c-174.7,0-250.3-103.9-250.3-292.7V606.6h200.6v1414c0,80.3,26,122.7,108.6,122.7c66.1,0,82.6-2.3,82.6-2.3v169.9C9876.2,2310.9,9831.3,2325.1,9734.6,2325.1z"/>
          <path fill="#C9C9C9" d="M11080,1779.8h-845.1c0,108.5,42.5,226.6,115.7,299.7c54.2,54.3,127.5,85,219.5,85c94.5,0,172.3-26,222-77.9c33-33.1,54.3-66.1,70.8-129.8h195.9c-16.5,118-87.4,228.9-184.1,295c-85,56.7-191.3,89.7-304.6,89.7c-167.5,0-304.4-70.8-396.6-179.5c-99.1-115.6-148.7-273.9-148.7-443.8c0-144,25.9-271.4,92.1-382.4c85-144,243.2-250.2,450.9-250.2c153.4,0,276.1,59,363.5,153.4c96.8,106.2,153.4,259.6,151.1,420.2L11080,1779.8z M10803.8,1364.3c-49.6-66.1-129.8-108.6-236-108.6c-217.2,0-323.5,177-328.2,351.8h637.4C10877,1517.8,10851.1,1428,10803.8,1364.3z"/>
          <path fill="#C9C9C9" d="M12210.7,2207c-92.1,94.4-233.7,134.6-389.5,134.6c-148.7,0-285.7-35.4-387.2-134.6c-73.2-70.8-115.7-172.3-115.7-273.8h200.7c2.3,82.6,40.1,144,96.8,186.4c54.2,40.2,139.3,54.3,214.8,54.3c82.6,0,158.2-14.1,219.6-66.1c33.1-25.9,59-75.5,59-129.8c0-89.7-63.7-153.4-186.5-169.9c-52-7.1-186.5-23.6-269.1-35.4c-179.4-28.3-292.7-139.4-292.7-321.1c0-92.1,44.9-179.4,99.2-233.7c77.8-80.3,203-132.2,351.6-132.2c158.2,0,299.9,49.5,380.1,151c52,63.8,85,132.2,85,229.1h-200.6c-2.4-61.4-33.1-118.1-68.5-148.7c-49.5-44.9-115.6-63.8-195.9-63.8c-47.2,0-82.6,0-139.2,23.6c-75.6,30.6-120.4,94.4-120.4,160.5c0,99.2,61.4,141.6,160.5,155.8c66.1,9.5,160.5,18.9,288,40.1c170,28.4,304.5,151.2,304.5,330.5C12305.1,2067.8,12267.4,2148,12210.7,2207z"/>
          <path fill="#C9C9C9" d="M1114.7,4498.5l-33.8-191.6C1002,4437.5,826.2,4530,646,4530c-160,0-315.5-51.9-430.4-164.6C53.4,4207.8,8.3,3987,8.3,3700.8c0-254.6,33.8-489,207.3-658C330.5,2930.1,486,2871.6,646,2871.6c180.3,0,347,63.1,457.4,180.3c76.6,81.2,130.7,182.5,137.5,310.9h-209.6c-6.7-74.4-31.5-126.1-72.1-175.7c-72.1-85.6-182.5-126.1-313.2-126.1c-108.2,0-214.1,42.8-290.7,121.6c-130.7,135.2-139.7,351.6-139.7,518.3c0,160,11.3,389.8,144.2,524.9c76.6,78.9,178,115,286.2,115c112.6,0,218.6-38.3,290.7-110.4c105.9-103.6,137.5-259.2,137.5-405.5H646v-187h608.4v860.7H1114.7z"/>
          <path fill="#C9C9C9" d="M2050.1,3536.3c-90.1,0-164.5,40.5-216.3,90.1c-92.4,87.9-103.6,245.6-103.6,365v507h-189.3V3358.2h169l15.8,200.6c58.6-139.7,196-207.3,340.2-207.3c29.3,0,60.9,2.3,90.1,6.7v187.1C2122.2,3538.5,2083.8,3536.3,2050.1,3536.3z"/>
          <path fill="#C9C9C9" d="M2347.6,3097v-225.4h223.1V3097H2347.6z M2361.2,4498.5V3358.2h196v1140.3H2361.2z"/>
          <path fill="#C9C9C9" d="M3638.9,4498.5l-13.5-148.7c-65.4,114.9-211.8,178-340.2,178c-139.7,0-247.9-47.4-322.3-124c-108.2-110.4-164.5-283.9-164.5-473.1c0-196,58.6-376.3,173.5-486.7c74.4-69.8,180.3-114.9,313.2-114.9c123.9,0,270.4,58.6,331.2,162.3v-619.7h191.5v1626.9H3638.9z M3501.4,3565.6c-45.1-40.6-101.4-74.4-184.8-74.4c-254.6,0-322.2,227.5-322.2,437.1c0,209.6,67.6,437.1,322.2,437.1c83.4,0,139.7-33.8,184.8-74.2c94.6-83.4,126.2-220.8,126.2-362.9C3627.6,3786.4,3596.1,3648.9,3501.4,3565.6z"/>
          <path fill="#C9C9C9" d="M4806.4,4498.5V2900.9h205v1597.6H4806.4z"/>
          <path fill="#C9C9C9" d="M6086.4,4498.5v-723.3c0-171.3-69.9-272.7-250.1-272.7c-110.4,0-198.3,72.1-247.8,175.8c-38.3,83.3-40.6,202.8-40.6,290.7v529.5h-191.5V3358.2h166.7l15.8,171.4c58.6-130.8,216.3-200.6,344.7-200.6c259.1,0,394.4,155.5,394.4,419.1v750.4H6086.4z"/>
          <path fill="#C9C9C9" d="M6616.2,3097v-225.4h223.1V3097H6616.2z M6629.7,4498.5V3358.2h196v1140.3H6629.7z"/>
          <path fill="#C9C9C9" d="M7607.8,4514.2c-245.6,0-313.2-155.4-313.2-308.6v-682.7h-220.8v-164.6h220.8v-290.6l191.5-45v335.6h338v164.6h-338v660.3c0,110.3,47.3,155.4,153.2,155.4c81.1,0,196-20.2,196-20.2v164.4C7783.5,4496.2,7713.7,4514.2,7607.8,4514.2z"/>
          <path fill="#C9C9C9" d="M8099.1,3097v-225.4h223.1V3097H8099.1z M8112.7,4498.5V3358.2h196v1140.3H8112.7z"/>
          <path fill="#C9C9C9" d="M9467,4514.2c-101.4,0-164.5-76.6-164.5-173.5h-4.5c-65.3,114.9-207.3,187-367.3,187c-261.4,0-392-175.7-392-351.5c0-146.5,94.6-338.1,405.6-356.1l347-20.3v-83.3c0-56.3-6.8-126.2-58.6-173.5c-38.3-36.1-94.7-58.5-187.1-58.5c-103.6,0-169,29.3-207.3,67.6c-36,36.1-56.3,81.2-56.3,137.4h-187c2.3-103.6,40.6-178,99.2-238.8c76.6-81.2,211.8-121.7,351.5-121.7c220.8,0,347,94.7,401.1,218.6c22.6,51.9,33.8,110.4,33.8,175.7v552.1c0,60.8,24.8,76.6,63.1,76.6c20.2,0,49.5-6.8,49.5-6.8v141.9C9552.6,4507.5,9514.3,4514.2,9467,4514.2z M9291.3,3948.6l-306.5,18c-114.9,6.7-250.1,60.9-250.1,205.1c0,101.4,63.1,195.9,225.3,195.9c87.9,0,173.5-29.3,234.3-92.3c67.6-69.8,96.9-164.4,96.9-259.2V3948.6z"/>
          <path fill="#C9C9C9" d="M10204.1,4514.2c-245.6,0-313.2-155.4-313.2-308.6v-682.7h-220.8v-164.6h220.8v-290.6l191.5-45v335.6h338.1v164.6h-338.1v660.3c0,110.3,47.4,155.4,153.3,155.4c81.2,0,196-20.2,196-20.2v164.4C10379.8,4496.2,10309.9,4514.2,10204.1,4514.2z"/>
          <path fill="#C9C9C9" d="M10695.4,3097v-225.4h223.1V3097H10695.4z M10708.9,4498.5V3358.2h196v1140.3H10708.9z"/>
          <path fill="#C9C9C9" d="M11770.3,4498.5h-207.3l-421.3-1140.3h200.5l329,914.9l317.7-914.9h193.8L11770.3,4498.5z"/>
          <path fill="#C9C9C9" d="M13280.3,3991.5h-806.7c0,103.6,40.6,216.3,110.4,286.2c51.8,51.7,121.7,81.2,209.5,81.2c90.2,0,164.6-24.9,211.9-74.4c31.5-31.5,51.8-63.2,67.6-124h187c-15.7,112.7-83.3,218.6-175.7,281.6c-81.1,54.2-182.5,85.7-290.7,85.7c-159.9,0-290.7-67.6-378.5-171.2c-94.7-110.4-142-261.4-142-423.7c0-137.5,24.7-259.1,87.8-365c81.2-137.5,232.2-238.9,430.4-238.9c146.5,0,263.7,56.4,347.1,146.5c92.3,101.4,146.4,247.8,144.2,401.1L13280.3,3991.5z M13016.6,3594.9c-47.3-63.1-123.9-103.6-225.4-103.6c-207.3,0-308.6,168.9-313.2,335.6h608.4C13086.5,3741.4,13061.7,3655.7,13016.6,3594.9z"/>
        </g>
        <g>
          <path fill="#999" d="M13495.8,941.4L13495.8,941.4c-235.6,235.6-352.6,542.9-352.8,851.7l0,0c0.2,308.8,117.2,616.1,352.8,851.8l0,0c236.5,236.2,545.8,352.4,857.3,352.8l0,0c306.2-0.3,611.4-118.3,846.2-352.6l0,0c235.6-235.9,352.7-543.2,352.8-852l0,0c0-160.5-31.7-320.8-95.2-470.6l261.4-270.2c124.6,230.4,187.1,486,187.1,740.8l0,0c0.2,398-152.5,797.7-456.2,1101.5l0,0c-301.8,302-699.1,456.4-1096,456.2l0,0c-0.3,0-0.6,0-1.1,0l0,0c-398.8,0-800.8-151-1106-456.2l0,0c-303.9-303.8-456.5-703.4-456.3-1101.5l0,0c-0.2-398.2,152.5-797.7,456.3-1101.5l0,0l0,0c305.6-305.7,708-456.6,1107-456.2l0,0c275.3-0.2,550.7,74,794.3,220.5L14892.7,718c-169.3-86.2-354.2-129.3-539.5-129.3l0,0C14041.6,588.7,13732.4,704.9,13495.8,941.4L13495.8,941.4"/>
          <g>
            <polygon fill="#999" points="14403.1,1546.1 15494.2,447.8 15744.7,696.6 14653.5,1794.9 14403.1,1546.1"/>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SORT DROPDOWN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A \u2013 Z" },
  { value: "za", label: "Z \u2013 A" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Sort practices"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C9C9C9] text-sm text-[#424244] hover:border-[#58044D] transition-colors bg-white"
      >
        <span>{current.label}</span>
        <IconChevronDown />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                opt.value === value
                  ? "text-[#58044D] font-medium bg-[#FFF8E5]"
                  : "text-[#424244] hover:bg-[#FFF8E5]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   FILTER DROPDOWN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
function FilterDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const active = selected.length > 0;

  const toggle = (val) => {
    const next = selected.includes(val)
      ? selected.filter((s) => s !== val)
      : [...selected, val];
    onChange(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Filter by ${label}`}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
          active
            ? "bg-[#58044D] text-white border-[#58044D]"
            : "bg-white text-[#58044D] border-[#58044D]"
        }`}
      >
        <span>{label}{active ? ` (${selected.length})` : ""}</span>
        {active ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          >
            <IconX />
          </span>
        ) : (
          <IconPlus />
        )}
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-64 max-h-60 overflow-y-auto rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
          {options.map((opt) => (
            <label
              key={String(opt)}
              className="flex items-center gap-2 px-4 py-1.5 hover:bg-[#FFF8E5] cursor-pointer text-sm text-[#424244]"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="accent-[#58044D] w-4 h-4"
              />
              <span>{String(opt)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PLACEHOLDER IMAGE
   ══════════════════════════════════════════════════════════════════════════════ */
const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='370' fill='%23e2e2e2'%3E%3Crect width='600' height='370'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

/* ==== SECTION: MAIN APPLICATION ==== */

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
export default function EnergyTransitionAtlas() {
  /* ── URL param helpers ── */
  const getParam = (key) => new URLSearchParams(window.location.search).get(key) || "";
  const getParamList = (key) => { const v = getParam(key); return v ? v.split(",") : []; };

  /* ── Routing ── */
  const [currentPage, setCurrentPage] = useState(() => window.location.hash || "#/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* ── state (initialised from URL params) ── */
  const [search, setSearch] = useState(() => getParam("q"));
  const [selTopics, setSelTopics] = useState(() => getParamList("topic"));
  const [selBrands, setSelBrands] = useState(() => getParamList("brand"));
  const [selDims, setSelDims] = useState(() => getParamList("dim"));
  const [selCountries, setSelCountries] = useState(() => getParamList("country"));
  const [selYears, setSelYears] = useState(() => getParamList("year").map(Number).filter(Boolean));
  const [selInfra, setSelInfra] = useState(() => getParamList("inf"));
  const [selOrgs, setSelOrgs] = useState(() => getParamList("org"));
  const [awardOnly, setAwardOnly] = useState(() => getParam("award") === "1");
  const [viewMode, setViewMode] = useState(() => getParam("view") || "grid");
  const [sortMode, setSortMode] = useState(() => getParam("sort") || "newest");
  const [moreOptions, setMoreOptions] = useState(false);
  const [page, setPage] = useState(() => parseInt(getParam("page"), 10) || 1);

  /* ── Scroll state ── */
  const heroRef = useRef(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  /* ── Mobile filter panel ── */
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  /* ── Form states ── */
  const [submitForm, setSubmitForm] = useState({ title:"", url:"", brand:"", dim:"", topic:"", inf:"", year:"", country:"", org:"", desc:"", img:"" });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name:"", email:"", message:"" });
  const [contactSuccess, setContactSuccess] = useState(false);

  /* ── Hash change listener ── */
  useEffect(() => {
    const onHash = () => {
      setCurrentPage(window.location.hash || "#/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* ── sync state -> URL (only on home page) ── */
  useEffect(() => {
    if (currentPage !== "#/" && currentPage !== "") return;
    const p = new URLSearchParams();
    if (search) p.set("q", search);
    if (selDims.length) p.set("dim", selDims.join(","));
    if (selTopics.length) p.set("topic", selTopics.join(","));
    if (selBrands.length) p.set("brand", selBrands.join(","));
    if (selInfra.length) p.set("inf", selInfra.join(","));
    if (selCountries.length) p.set("country", selCountries.join(","));
    if (selYears.length) p.set("year", selYears.join(","));
    if (selOrgs.length) p.set("org", selOrgs.join(","));
    if (awardOnly) p.set("award", "1");
    if (viewMode !== "grid") p.set("view", viewMode);
    if (sortMode !== "newest") p.set("sort", sortMode);
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    const url = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, viewMode, sortMode, page, currentPage]);

  /* ── IntersectionObserver for hero ── */
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [currentPage]);

  /* ── Scroll listener for back-to-top ── */
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Click-outside for menu dropdown ── */
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── Escape key closes menu ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── reset page when filters or sort change ── */
  useEffect(() => { setPage(1); }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, sortMode]);

  /* ── Cascading topic filter: clear invalid topics when dims change ── */
  useEffect(() => {
    if (!selDims.length) return;
    const valid = getFilteredTopics(selDims);
    setSelTopics(prev => prev.filter(t => valid.includes(t)));
  }, [selDims]);

  /* ── Available topics based on selected dimensions ── */
  const availableTopics = useMemo(() => getFilteredTopics(selDims), [selDims]);

  /* ── filtered + sorted results ── */
  const filtered = useMemo(() => {
    let results = PRACTICES.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.title} ${p.desc} ${p.org} ${p.topic} ${p.country}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (selTopics.length && !selTopics.includes(p.topic)) return false;
      if (selBrands.length && !selBrands.includes(p.brand)) return false;
      if (selDims.length && !selDims.includes(p.dim)) return false;
      if (selCountries.length && !selCountries.includes(p.country)) return false;
      if (selYears.length && !selYears.includes(p.year)) return false;
      if (selInfra.length && !selInfra.includes(p.inf)) return false;
      if (selOrgs.length && !selOrgs.includes(p.org)) return false;
      if (awardOnly && !p.award) return false;
      return true;
    });
    switch (sortMode) {
      case "oldest": results.sort((a, b) => a.year - b.year); break;
      case "az":     results.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za":     results.sort((a, b) => b.title.localeCompare(a.title)); break;
      default:       results.sort((a, b) => b.year - a.year); break;
    }
    return results;
  }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* ── pagination range (truncated: 1 2 ... 10 style) ── */
  const paginationNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, totalPages, page, page - 1, page + 1]);
    const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  }, [totalPages, page]);

  /* ── basic filters (always visible) ── */
  const basicFilters = [
    { label: "Infrastructure", options: allInfra, selected: selInfra, onChange: setSelInfra },
    { label: "Theme", options: allDims, selected: selDims, onChange: setSelDims },
    { label: "Topic", options: availableTopics, selected: selTopics, onChange: setSelTopics },
  ];

  /* ── expanded filters ── */
  const expandedFilters = [
    { label: "Year", options: allYears.map(String), selected: selYears.map(String), onChange: (arr) => setSelYears(arr.map(Number)) },
    { label: "Location", options: allCountries, selected: selCountries, onChange: setSelCountries },
    { label: "Organisation", options: allOrgs, selected: selOrgs, onChange: setSelOrgs },
    { label: "Atlas Partner", options: allBrands, selected: selBrands, onChange: setSelBrands },
    { label: "RGI Awards", options: ["Yes"], selected: awardOnly ? ["Yes"] : [], onChange: (arr) => setAwardOnly(arr.includes("Yes")) },
  ];

  /* ── active filter chips ── */
  const activeChips = useMemo(() => {
    const chips = [];
    if (search) chips.push({ label: "Search", value: search, onRemove: () => setSearch("") });
    selDims.forEach((v) => chips.push({ label: "Theme", value: v, onRemove: () => setSelDims((s) => s.filter((x) => x !== v)) }));
    selInfra.forEach((v) => chips.push({ label: "Infrastructure", value: v, onRemove: () => setSelInfra((s) => s.filter((x) => x !== v)) }));
    selTopics.forEach((v) => chips.push({ label: "Topic", value: v, onRemove: () => setSelTopics((s) => s.filter((x) => x !== v)) }));
    selYears.forEach((v) => chips.push({ label: "Year", value: String(v), onRemove: () => setSelYears((s) => s.filter((x) => x !== v)) }));
    selCountries.forEach((v) => chips.push({ label: "Location", value: v, onRemove: () => setSelCountries((s) => s.filter((x) => x !== v)) }));
    selOrgs.forEach((v) => chips.push({ label: "Organisation", value: v, onRemove: () => setSelOrgs((s) => s.filter((x) => x !== v)) }));
    selBrands.forEach((v) => chips.push({ label: "Partner", value: v, onRemove: () => setSelBrands((s) => s.filter((x) => x !== v)) }));
    if (awardOnly) chips.push({ label: "Awards", value: "Winners only", onRemove: () => setAwardOnly(false) });
    return chips;
  }, [search, selDims, selInfra, selTopics, selYears, selCountries, selOrgs, selBrands, awardOnly]);

  const clearAllFilters = () => {
    setSearch(""); setSelTopics([]); setSelBrands([]); setSelDims([]);
    setSelCountries([]); setSelYears([]); setSelInfra([]); setSelOrgs([]);
    setAwardOnly(false);
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = useCallback((hash) => {
    window.location.hash = hash;
    setMenuOpen(false);
  }, []);

  /* ── Submit form topics based on selected dim ── */
  const submitFormTopics = useMemo(() => {
    if (!submitForm.dim) return [];
    return DIMENSION_TOPICS[submitForm.dim] || [];
  }, [submitForm.dim]);

  const isHome = currentPage === "#/" || currentPage === "" || currentPage === "#";

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col font-['Kantumruy_Pro']">
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=League+Gothic&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');`}</style>

      {/* ─── 1. Brand Bar ─── */}
      <div className="bg-[#424244] px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          {Object.entries(BRAND_LINKS).map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="text-white text-xs font-semibold tracking-wider hover:text-[#FFF8E5] transition-colors">
              {name}
            </a>
          ))}
        </div>
      </div>

      {/* ─── 2. Header Bar (sticky) ─── */}
      <header className="sticky top-0 z-40 bg-[#58044D] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className={`font-['League_Gothic'] text-[#FFF8E5] text-xl tracking-widest uppercase transition-opacity duration-300 cursor-pointer ${
              scrolledPastHero ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
              else navigateTo("#/");
            }}
          >
            Energy Transition Atlas
          </h1>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Navigation menu"
              className="border border-[#FFF8E5] text-[#FFF8E5] px-5 py-1.5 rounded-full text-sm font-medium tracking-wide hover:bg-[#FFF8E5] hover:text-[#58044D] transition-colors"
            >
              MENU
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
                <button onClick={() => navigateTo("#/")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">Home</button>
                <button onClick={() => navigateTo("#about")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">About</button>
                <button onClick={() => navigateTo("#submit")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">Submit a Practice</button>
                <button onClick={() => navigateTo("#contact")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">Contact</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── 3. Hero Section ─── */}
      <section ref={heroRef} className="bg-[#58044D] px-6 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`font-['League_Gothic'] text-white text-5xl lg:text-7xl uppercase tracking-wide leading-tight ${!isHome ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`}
            onClick={() => { if (!isHome) navigateTo("#/"); }}
          >
            Energy Transition Atlas
          </h2>
          <p className="mt-4 text-[#FFF8E5] text-lg lg:text-xl font-light max-w-3xl leading-relaxed opacity-90">
            Explore a growing collection of real-world energy transition practices from across organisations and projects. A shared navigator breaking down silos between partners, sectors, and borders.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         PAGE ROUTING
         ═══════════════════════════════════════════════════════════════════════ */}

      {/* ─── ABOUT PAGE ─── */}
      {currentPage === "#about" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#58044D] text-4xl lg:text-5xl uppercase tracking-wide mb-8">About the Atlas</h2>
            <div className="space-y-6 text-[#424244] leading-relaxed">
              <p>The Energy Transition Atlas is a shared platform that brings together proven best practices from across the energy transition. It serves as a navigator and search hub, providing a single access point for practices contributed by multiple organisations and initiatives.</p>
              <p>Rather than hosting full content, the Atlas links out to the source websites of each practice, keeping content management decentralised while offering unified discovery, filtering, and search.</p>
              <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide mt-8">Contributing Partners</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {Object.entries(BRAND_LINKS).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-white rounded-xl border border-[#C9C9C9] hover:border-[#58044D] hover:shadow-md transition-all"
                  >
                    <span className="text-[#58044D] font-bold text-lg">{name}</span>
                    <span className="block text-xs text-[#424244] opacity-60 mt-1">{url}</span>
                  </a>
                ))}
              </div>
              <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide mt-8">Our Vision</h3>
              <p>We believe the energy transition should be Nature-Positive and People-Positive. The Atlas aims to break down silos between organisations, sectors, and borders by making successful approaches discoverable and shareable.</p>
            </div>
          </div>
        </section>
      )}

      {/* ─── SUBMIT PAGE ─── */}
      {currentPage === "#submit" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#58044D] text-4xl lg:text-5xl uppercase tracking-wide mb-8">Submit a Practice</h2>
            {submitSuccess ? (
              <div className="bg-white rounded-xl p-8 text-center border border-[#C9C9C9]">
                <p className="text-[#58044D] font-bold text-xl mb-2">Thank you for your submission!</p>
                <p className="text-[#424244] opacity-70">We will review your practice and add it to the Atlas soon.</p>
                <button
                  onClick={() => { setSubmitSuccess(false); setSubmitForm({ title:"", url:"", brand:"", dim:"", topic:"", inf:"", year:"", country:"", org:"", desc:"", img:"" }); }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#58044D] text-white text-sm font-medium hover:bg-[#58044D]/90 transition-colors"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitSuccess(true); }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-[#424244] mb-1">Practice Title</label>
                  <input type="text" required value={submitForm.title} onChange={(e) => setSubmitForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#424244] mb-1">Source URL</label>
                  <input type="url" required value={submitForm.url} onChange={(e) => setSubmitForm(f => ({ ...f, url: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Source Organisation</label>
                    <p className="text-xs text-[#424244] opacity-60 mb-2">The organisation or website where this practice is published</p>
                    <input type="text" required value={submitForm.brand} onChange={(e) => setSubmitForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. TenneT, RTE, IUCN..." className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Theme</label>
                    <select required value={submitForm.dim} onChange={(e) => setSubmitForm(f => ({ ...f, dim: e.target.value, topic: "" }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors">
                      <option value="">Select...</option>
                      <option value="Nature">Nature</option>
                      <option value="Technology">Technology</option>
                      <option value="People">People</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#424244] mb-1">Topic</label>
                  <select required value={submitForm.topic} onChange={(e) => setSubmitForm(f => ({ ...f, topic: e.target.value }))} disabled={!submitForm.dim} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors disabled:opacity-50">
                    <option value="">Select...</option>
                    {submitFormTopics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Infrastructure</label>
                    <select required value={submitForm.inf} onChange={(e) => setSubmitForm(f => ({ ...f, inf: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors">
                      <option value="">Select...</option>
                      <option value="Grids">Grids</option>
                      <option value="Solar">Solar</option>
                      <option value="Onshore wind">Onshore Wind</option>
                      <option value="Offshore wind">Offshore Wind</option>
                      <option value="Energy system">Energy System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Year</label>
                    <input type="number" required min="2000" max="2030" value={submitForm.year} onChange={(e) => setSubmitForm(f => ({ ...f, year: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Country</label>
                    <input type="text" required value={submitForm.country} onChange={(e) => setSubmitForm(f => ({ ...f, country: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Organisation</label>
                    <input type="text" required value={submitForm.org} onChange={(e) => setSubmitForm(f => ({ ...f, org: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#424244] mb-1">Description</label>
                  <textarea required rows={4} value={submitForm.desc} onChange={(e) => setSubmitForm(f => ({ ...f, desc: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#424244] mb-1">Featured Image URL</label>
                  <input type="url" value={submitForm.img} onChange={(e) => setSubmitForm(f => ({ ...f, img: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                </div>
                <button type="submit" className="px-8 py-2.5 rounded-full bg-[#58044D] text-white text-sm font-medium hover:bg-[#58044D]/90 transition-colors">
                  Submit Practice
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* ─── CONTACT PAGE ─── */}
      {currentPage === "#contact" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#58044D] text-4xl lg:text-5xl uppercase tracking-wide mb-8">Contact</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: RGI info */}
              <div className="space-y-4 text-[#424244]">
                <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide">Renewables Grid Initiative</h3>
                <p className="leading-relaxed">
                  Manfred-von-Richthofen-Str. 4<br />
                  12101 Berlin<br />
                  Germany
                </p>
                <p>
                  <a href="mailto:communication@renewables-grid.eu" className="text-[#58044D] font-medium hover:underline">
                    communication@renewables-grid.eu
                  </a>
                </p>
              </div>
              {/* Right: Contact form */}
              <div>
                {contactSuccess ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-[#C9C9C9]">
                    <p className="text-[#58044D] font-bold text-xl mb-2">Thank you!</p>
                    <p className="text-[#424244] opacity-70">We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#424244] mb-1">Name</label>
                      <input type="text" required value={contactForm.name} onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#424244] mb-1">Email</label>
                      <input type="email" required value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#424244] mb-1">Message</label>
                      <textarea required rows={5} value={contactForm.message} onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                    </div>
                    <button type="submit" className="px-8 py-2.5 rounded-full bg-[#58044D] text-white text-sm font-medium hover:bg-[#58044D]/90 transition-colors">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── HOME PAGE ─── */}
      {isHome && (
        <>
          {/* ─── 4. Filter Section ─── */}
          <section className="bg-[#FFF8E5] px-6 py-6">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Desktop: All controls in one row — filters left, search right */}
              <div className="hidden md:flex items-center gap-3 flex-wrap">
                {basicFilters.map((f) => (
                  <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
                ))}
                <button
                  onClick={() => setMoreOptions(!moreOptions)}
                  aria-label={moreOptions ? "Hide additional filters" : "Show additional filters"}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-colors ${
                    moreOptions
                      ? "bg-[#58044D] text-white border-[#58044D]"
                      : "border-[#C9C9C9] text-[#424244] hover:border-[#58044D] bg-white"
                  }`}
                >
                  {moreOptions ? <IconX /> : <IconSettings />}
                  <span>More Options</span>
                </button>
                <SortDropdown value={sortMode} onChange={setSortMode} />
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-2.5 rounded-full border transition-colors ${
                    viewMode === "list"
                      ? "border-[#58044D] text-[#58044D] bg-white"
                      : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
                  }`}
                >
                  <IconListView />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-2.5 rounded-full border transition-colors ${
                    viewMode === "grid"
                      ? "border-[#58044D] text-[#58044D] bg-white"
                      : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
                  }`}
                >
                  <IconGridView />
                </button>
                <div className="ml-auto relative min-w-[200px] max-w-[220px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424244] opacity-50">
                    <IconSearch />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search practices..."
                    aria-label="Search practices"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] placeholder:text-[#C9C9C9] focus:outline-none focus:border-[#58044D] transition-colors"
                  />
                </div>
              </div>

              {/* Desktop: Expanded filters — left-aligned, compact */}
              {moreOptions && (
                <div className="hidden md:flex items-center gap-3 flex-wrap">
                  {expandedFilters.map((f) => (
                    <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
                  ))}
                </div>
              )}

              {/* Mobile: Infrastructure + Theme + More Filters + Search icon + Sort */}
              <div className="flex md:hidden items-center gap-2 flex-wrap">
                <FilterDropdown label={basicFilters[0].label} options={basicFilters[0].options} selected={basicFilters[0].selected} onChange={basicFilters[0].onChange} />
                <FilterDropdown label={basicFilters[1].label} options={basicFilters[1].options} selected={basicFilters[1].selected} onChange={basicFilters[1].onChange} />
                <button
                  onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                  aria-label="Toggle additional filters"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    filterPanelOpen
                      ? "bg-[#58044D] text-white border-[#58044D]"
                      : "bg-white text-[#58044D] border-[#58044D]"
                  }`}
                >
                  <IconSettings />
                  <span>More</span>
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    aria-label="Toggle search"
                    className={`p-2.5 rounded-full border transition-colors ${
                      mobileSearchOpen
                        ? "border-[#58044D] text-[#58044D] bg-white"
                        : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
                    }`}
                  >
                    <IconSearch />
                  </button>
                  <SortDropdown value={sortMode} onChange={setSortMode} />
                </div>
              </div>

              {/* Mobile: Expandable search bar */}
              {mobileSearchOpen && (
                <div className="md:hidden">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424244] opacity-50">
                      <IconSearch />
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search practices..."
                      aria-label="Search practices"
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] placeholder:text-[#C9C9C9] focus:outline-none focus:border-[#58044D] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Mobile: Expanded filter panel (Topic + expanded filters + view toggles) */}
              {filterPanelOpen && (
                <div className="md:hidden flex flex-col gap-3">
                  <FilterDropdown label={basicFilters[2].label} options={basicFilters[2].options} selected={basicFilters[2].selected} onChange={basicFilters[2].onChange} />
                  {expandedFilters.map((f) => (
                    <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
                  ))}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                      className={`p-2.5 rounded-full border transition-colors ${
                        viewMode === "list"
                          ? "border-[#58044D] text-[#58044D] bg-white"
                          : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
                      }`}
                    >
                      <IconListView />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      className={`p-2.5 rounded-full border transition-colors ${
                        viewMode === "grid"
                          ? "border-[#58044D] text-[#58044D] bg-white"
                          : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
                      }`}
                    >
                      <IconGridView />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ─── Active Filter Chips ─── */}
          {activeChips.length > 0 && (
            <div className="bg-[#FFF8E5] border-b border-[#C9C9C9] px-6 py-3">
              <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
                {activeChips.map((chip, i) => (
                  <span
                    key={`${chip.label}-${chip.value}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58044D]/10 text-[#58044D] text-xs font-medium"
                  >
                    <span className="opacity-60">{chip.label}:</span> {chip.value}
                    <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter: ${chip.value}`} className="ml-0.5 hover:text-[#58044D]/70 transition-colors">
                      <IconX />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#58044D] font-medium hover:underline ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* ─── 5. Results ─── */}
          <section className="flex-1 bg-[#FFF8E5] px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Result count */}
              <p className="text-sm text-[#424244] opacity-60 mb-6" aria-live="polite">
                {filtered.length} practice{filtered.length !== 1 ? "s" : ""} found
              </p>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#58044D]/10 flex items-center justify-center mx-auto mb-4 text-[#58044D]">
                    <IconSearch />
                  </div>
                  <p className="text-[#424244] opacity-50 text-lg">No practices match your current filters.</p>
                  <button onClick={clearAllFilters} className="mt-4 text-sm text-[#58044D] font-medium hover:underline">
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Grid / Picture View */}
              {viewMode === "grid" && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pageItems.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block hover:-translate-y-1 hover:shadow-lg transition-all duration-200 rounded-xl"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={p.img || placeholderImg}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-48 object-cover bg-[#e2e2e2] transition-transform duration-300 group-hover:scale-105"
                        />
                        {p.award && (
                          <span className="absolute top-2.5 right-2.5 bg-[#58044D] text-[#FFF8E5] rounded-full p-1.5 shadow-md" title="Grid Award Winner">
                            <IconAward />
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-[#424244] opacity-60 flex-wrap">
                        <span className="flex items-center gap-1"><IconPin />{p.country}</span>
                        <span className="flex items-center gap-1"><IconCalendar />{p.year}</span>
                        <span className="flex items-center gap-1"><IconBuilding />{p.org}</span>
                        <span className="flex items-center gap-1"><IconLayers />{p.inf}</span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-[#424244] group-hover:text-[#58044D] transition-colors leading-snug">
                        {p.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs border border-[#58044D] text-[#58044D] rounded-full px-3 py-0.5">
                          {p.dim}
                        </span>
                        <span className="text-xs border border-[#58044D] text-[#58044D] rounded-full px-3 py-0.5">
                          {p.brand}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && filtered.length > 0 && (
                <div className="divide-y divide-[#C9C9C9]">
                  {pageItems.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-4 px-3 -mx-3 rounded-lg group hover:bg-white/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#424244] group-hover:text-[#58044D] transition-colors">
                          {p.title}
                        </h3>
                        {p.award && (
                          <span className="text-[#58044D]" title="Grid Award Winner"><IconAward /></span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-4 text-xs text-[#424244] opacity-60 flex-wrap">
                        <span className="flex items-center gap-1"><IconPin />{p.country}</span>
                        <span className="flex items-center gap-1"><IconCalendar />{p.year}</span>
                        <span className="flex items-center gap-1"><IconBuilding />{p.org}</span>
                        <span className="flex items-center gap-1"><IconLayers />{p.inf}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* ─── 6. Pagination ─── */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-10">
                  <button
                    onClick={() => { setPage(Math.max(1, page - 1)); scrollToTop(); }}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="p-2 rounded-full hover:bg-white/60 disabled:opacity-30 text-[#424244] transition-colors"
                  >
                    <IconChevronLeft />
                  </button>
                  {paginationNumbers.map((n, i) =>
                    n === "..." ? (
                      <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-[#424244] opacity-50">...</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => { setPage(n); scrollToTop(); }}
                        aria-label={`Page ${n}`}
                        aria-current={n === page ? "page" : undefined}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          n === page
                            ? "bg-[#58044D] text-white"
                            : "text-[#424244] hover:bg-white/60"
                        }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => { setPage(Math.min(totalPages, page + 1)); scrollToTop(); }}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="p-2 rounded-full hover:bg-white/60 disabled:opacity-30 text-[#424244] transition-colors"
                  >
                    <IconChevronRight />
                  </button>
                </nav>
              )}
            </div>
          </section>
        </>
      )}

      {/* ─── 7. Footer ─── */}
      <footer className="bg-[#424244] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1: Logo + tagline */}
            <div>
              <GreyscaleRGILogo />
              <p className="mt-4 text-[#C9C9C9] text-sm leading-relaxed">
                The Energy Transition Atlas is a project by the Renewables Grid Initiative which aims to break down silos between organisations, sectors, and borders by making successful approaches to a Nature- and People-Positive energy transition discoverable and shareable.
              </p>
            </div>
            {/* Col 2: Contact */}
            <div>
              <h4 className="font-['League_Gothic'] text-[#FFF8E5] text-xl uppercase tracking-widest mb-3">Contact</h4>
              <p className="text-[#C9C9C9] text-sm leading-relaxed">
                Renewables Grid Initiative<br />
                Manfred-von-Richthofen-Str. 4<br />
                12101 Berlin, Germany
              </p>
              <p className="mt-2">
                <a href="mailto:communication@renewables-grid.eu" className="text-[#FFF8E5] text-sm hover:text-white transition-colors">
                  communication@renewables-grid.eu
                </a>
              </p>
            </div>
            {/* Col 3: Links */}
            <div>
              <h4 className="font-['League_Gothic'] text-[#FFF8E5] text-xl uppercase tracking-widest mb-3">Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-[#C9C9C9] text-sm hover:text-white transition-colors">About</a></li>
                <li><a href="#submit" className="text-[#C9C9C9] text-sm hover:text-white transition-colors">Submit a Practice</a></li>
                <li><a href="#contact" className="text-[#C9C9C9] text-sm hover:text-white transition-colors">Contact</a></li>
                <li><a href="https://renewables-grid.eu/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#C9C9C9] text-sm hover:text-white transition-colors">Imprint &amp; Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-[#C9C9C9]/30 text-center">
            <p className="text-[#C9C9C9] text-xs">
              &copy; 2026 Renewables Grid Initiative
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Back to Top Button ─── */}
      {(scrolledPastHero || showBackToTop) && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#58044D] text-white shadow-lg hover:bg-[#58044D]/90 transition-all flex items-center justify-center"
        >
          <IconChevronUp />
        </button>
      )}
    </div>
  );
}
