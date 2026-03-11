import { useState, useMemo, useRef, useEffect } from "react";

/* ──────────────────────────────────────────────────────────────────────────────
   PRACTICE DATA  (34 merged records)
   Schema: { id, title, url, brand, dim, topic, inf, year, country, org, desc, img, award }
   ────────────────────────────────────────────────────────────────────────────── */
const PRACTICES = [
  { id: 1, title: "Vegetation Management in Rights of Way", url: "https://renewables-grid.eu/database/vegetation-management-in-rights-of-way/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2023, country: "Finland", org: "Fingrid", desc: "Fingrid's vegetation management system focuses on careful maintenance of rights of way, creating habitats through artificial snags and decaying wood.", img: "https://renewables-grid.eu/app/uploads/2025/09/Fingrid-IVM_1-644x398-c-default.jpg", award: false },
  { id: 2, title: "VegeLine – Vegetation Management System", url: "https://renewables-grid.eu/database/vegeline-vegetation-management-system/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2023, country: "Slovenia", org: "ELES", desc: "ELES uses optimization tools and asset management software to integrate biodiversity protection with grid expansion and invasive species management.", img: "https://renewables-grid.eu/app/uploads/2025/09/ELES_VegeLine-322x196-c-default.png", award: false },
  { id: 3, title: "Tennet's Inspiration Guide", url: "https://renewables-grid.eu/database/tennets-inspiration-guide/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2023, country: "Germany", org: "TenneT", desc: "56 methods for conserving nature around powerlines — from insect sanctuaries to mowing regimes like sinus management.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT-Guide_1-322x196-c-default.png", award: false },
  { id: 4, title: "Ecological Corridor Management", url: "https://renewables-grid.eu/database/ecological-corridor-management/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2021, country: "Germany", org: "E.ON, Westnetz", desc: "A 13,000km ecological corridor network across Europe, finding 5x more biodiversity in managed grid corridors.", img: "https://renewables-grid.eu/app/uploads/2025/09/IVM-Westnetz_1-322x196-c-default.jpg", award: true },
  { id: 5, title: "Autonomous IoT Device to Repel Birds", url: "https://renewables-grid.eu/database/autonomous-iot-device-to-repel-birds-from-power-lines/", brand: "RGI", dim: "Energy & Nature", topic: "Bird protection", inf: "Grids", year: 2021, country: "Spain", org: "Energiot, Iberdrola", desc: "An innovative IoT solution using sound and light to deter birds from power lines without causing harm.", img: "", award: false },
  { id: 6, title: "Bird Protection System", url: "https://renewables-grid.eu/database/bird-protection-system-2/", brand: "RGI", dim: "Energy & Nature", topic: "Bird protection", inf: "Onshore wind", year: 2024, country: "Poland", org: "Bioseco", desc: "Visual modules and advanced algorithms detect, track and deter birds to minimise mortality at wind farms.", img: "https://renewables-grid.eu/app/uploads/2025/09/BIOSECO_Photo_4-322x196-c-default.jpg", award: true },
  { id: 7, title: "e-faunalert Mobile Application", url: "https://renewables-grid.eu/database/e-faunalert-mobile-application-2/", brand: "RGI", dim: "Energy & Nature", topic: "Bird protection", inf: "Grids", year: 2024, country: "Europe", org: "IUCN", desc: "Mobile app enabling citizen science data collection on power line wildlife interactions across the Mediterranean.", img: "https://renewables-grid.eu/app/uploads/2025/09/IUCN_Photo_1-644x398-c-default.jpg", award: true },
  { id: 8, title: "Environmentally Friendly Bird Protection", url: "https://renewables-grid.eu/database/environmentally-friendly-and-cost-effective-bird-protection/", brand: "RGI", dim: "Energy & Nature", topic: "Bird protection", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "Drones install Firefly wire markers on high-voltage lines to reduce bird collisions in Wageningen.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__Photo_1-min-scaled-644x398-c-default.jpg", award: true },
  { id: 9, title: "LIFE Safe Grid for Burgas", url: "https://renewables-grid.eu/database/life-safe-grid-for-burgas/", brand: "RGI", dim: "Energy & Nature", topic: "Bird protection", inf: "Grids", year: 2024, country: "Bulgaria", org: "Elektrorazpredelenie Yug", desc: "EU LIFE-funded project conserving threatened bird species in the Burgas Lakes region through grid retrofitting.", img: "", award: true },
  { id: 10, title: "Better Biodiversity in Vegetation Contracts", url: "https://renewables-grid.eu/database/better-consideration-of-biodiversity-in-vegetation-management-contracts/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2024, country: "France", org: "RTE", desc: "RTE ceased vegetation activities during sensitive periods (March-August) to protect nesting birds and wildlife.", img: "", award: true },
  { id: 11, title: "Hydrogen-Powered Drill for HV Cable Installation", url: "https://renewables-grid.eu/database/hydrogen-powered-drill-for-emission-free-installation-of-hv-cables/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Circularity and supply chains", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "Emission-free drilling for grid enforcement using hydrogen power in environmentally sensitive areas.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/3/4/csm_TenneT__H2_Photo_1_c1de2ac13e.jpg", award: true },
  { id: 12, title: "Grid Orchards: Heritage 'Ermelo' Oranges", url: "https://renewables-grid.eu/database/grid-orchards-promoting-heritage-ermelo-oranges-in-grid-corridors/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2024, country: "Portugal", org: "REN", desc: "Preserving endangered Ermelo orange trees within powerline corridors, converting them into productive orchards.", img: "", award: true },
  { id: 13, title: "Ecosystems on Princess Elisabeth Island", url: "https://renewables-grid.eu/database/resilient-ecosystems-development-on-princess-elisabeth-island/", brand: "OCEaN", dim: "Energy & Nature", topic: "Offshore energy and nature", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Ocean Ecostructures", desc: "Turning the world's first artificial energy island foundation into a giant artificial reef for marine life.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/4/2/csm_Ocean_Eco_1-min_c2ee8a3c93.png", award: true },
  { id: 14, title: "Nature-Inclusive Design for Energy Island", url: "https://renewables-grid.eu/database/nature-inclusive-design-approach-planned-for-the-princess-elisabeth-island/", brand: "OCEaN", dim: "Energy & Nature", topic: "Offshore energy and nature", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Elia", desc: "A nature-inclusive design approach demonstrating how offshore renewables can coexist with marine biodiversity.", img: "", award: true },
  { id: 15, title: "Virtual Presentation of Grid Projects", url: "https://renewables-grid.eu/database/virtual-presentation-of-grid-projects-and-environmental-constraints/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Spatial optimisation", inf: "Grids", year: 2024, country: "Portugal", org: "REN", desc: "The VeR project revolutionises field visits using augmented reality to visualise grid infrastructure constraints.", img: "", award: true },
  { id: 16, title: "First Grid-Forming 300 MVAr STATCOM", url: "https://renewables-grid.eu/database/first-grid-forming-300-mvar-statcom-in-germany/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Climate adaptation and resilience", inf: "Grids", year: 2024, country: "Germany", org: "Amprion", desc: "Addressing grid stability with reactive power support and grid-forming control, operating nearly silently.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/6/4/csm_Amprion_Photo_3-min_675517bf39.jpg", award: true },
  { id: 17, title: "Open Energy Modelling Initiative", url: "https://renewables-grid.eu/database/open-energy-modelling-initiative-openmod/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Energy system planning", inf: "Energy system", year: 2024, country: "Europe", org: "openmod", desc: "Promoting open science for energy system decarbonisation through transparent data sharing and collaboration.", img: "", award: true },
  { id: 18, title: "SuedLink Digital Portal", url: "https://renewables-grid.eu/database/bye-bye-paper-floods-digital-energy-transition-with-the-suedlink-portal/", brand: "RGI", dim: "Energy & Society", topic: "Public acceptance and engagement", inf: "Grids", year: 2024, country: "Germany", org: "TransnetBW", desc: "Digital communication and contract processing with property owners involved in electricity grid projects.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/b/c/csm_Transnet__Ph2_a89434df99.png", award: true },
  { id: 19, title: "EmPOWER Your Environment", url: "https://renewables-grid.eu/database/empower-your-environment/", brand: "RGI", dim: "Energy & Society", topic: "Public acceptance and engagement", inf: "Grids", year: 2024, country: "Poland", org: "PSE", desc: "Enhancing community well-being and sustainable development near energy infrastructure through direct engagement.", img: "", award: true },
  { id: 20, title: "EirGrid Community Forum", url: "https://renewables-grid.eu/database/eirgrid-community-forum/", brand: "RGI", dim: "Energy & Society", topic: "Public acceptance and engagement", inf: "Grids", year: 2024, country: "Ireland", org: "EirGrid", desc: "Independently facilitated forums fostering early community involvement in grid infrastructure projects.", img: "http://old.renewables-grid.eu/fileadmin/_processed_/a/f/csm_EirGrid_Picture_2_7c7df407b5.jpg", award: true },
  { id: 21, title: "NaturaConnect Ecological Network", url: "https://renewables-grid.eu/database/naturaconnect/", brand: "GINGR", dim: "Energy & Nature", topic: "Nature conservation and restoration", inf: "Energy system", year: 2022, country: "Europe", org: "NaturaConnect", desc: "22 partners from 15 EU countries building a Trans-European Nature Network to connect protected areas.", img: "", award: false },
  { id: 22, title: "SafeLines4Birds Mediterranean", url: "#", brand: "SL4B", dim: "Energy & Nature", topic: "Bird protection", inf: "Grids", year: 2023, country: "Europe", org: "BirdLife", desc: "Reducing bird electrocution and collision through systematic retrofitting of dangerous power line designs.", img: "", award: false },
  { id: 23, title: "XR@TransnetBW Immersive Grid Planning", url: "https://renewables-grid.eu/database/xr-transnetbw/", brand: "RGI", dim: "Energy & Society", topic: "Public acceptance and engagement", inf: "Grids", year: 2023, country: "Germany", org: "TransnetBW", desc: "Extended reality turns infrastructure projects into immersive experiences before they exist.", img: "", award: false },
  { id: 24, title: "e-Gridmap Renewable Connection Tool", url: "https://renewables-grid.eu/database/e-gridmap/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Energy system planning", inf: "Grids", year: 2020, country: "Estonia", org: "Elering", desc: "One-click tool calculating renewable connection costs, reducing the location assessment from 3 months to seconds.", img: "", award: false },
  { id: 25, title: "Moonshot", url: "https://renewables-grid.eu/database/moonshot/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Circularity and supply chains", inf: "Offshore wind", year: 2024, country: "Netherlands", org: "ECHT regie in transitie", desc: "The Moonshot practice fosters collaboration between academia, policy, and industry to enhance sustainability of the wind sector.", img: "https://renewables-grid.eu/app/uploads/2025/09/ECHT_Regie_Photo_1-scaled-644x398-c-default.jpg", award: true },
  { id: 26, title: "Agri-PV", url: "https://renewables-grid.eu/database/agri-pv/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Spatial optimisation", inf: "Solar", year: 2022, country: "USA", org: "Jack's Solar Garden", desc: "Researchers use the land under solar panels to study microclimates and how vegetation grows within the solar array.", img: "https://renewables-grid.eu/app/uploads/2024/11/Database_tech-scaled.png", award: true },
  { id: 27, title: "SPEED-E", url: "https://renewables-grid.eu/database/speed-e/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Energy system planning", inf: "Energy system", year: 2022, country: "Portugal", org: "REN", desc: "World's first EV power supply solution through the very-high voltage network for high power charging.", img: "https://renewables-grid.eu/app/uploads/2025/09/SPEED-E_2-scaled-322x196-c-default.jpg", award: true },
  { id: 28, title: "Bio Transport", url: "https://renewables-grid.eu/database/bio-transport/", brand: "RGI", dim: "Energy & Nature", topic: "Integrated vegetation management", inf: "Grids", year: 2022, country: "Spain", org: "Red Electrica, CSIC", desc: "Scientific evaluation of the potential of the grid to enhance biodiversity.", img: "https://renewables-grid.eu/app/uploads/2025/09/BioTransport-1-digging-322x196-c-default.png", award: true },
  { id: 29, title: "Digital Citizen Information Market", url: "https://renewables-grid.eu/database/digital-citizen-information-market/", brand: "RGI", dim: "Energy & Society", topic: "Creating awareness and capacity building", inf: "Grids", year: 2022, country: "Germany", org: "Amprion", desc: "Stakeholders invited to attend livestream events in virtual space.", img: "https://renewables-grid.eu/app/uploads/2025/09/Digital-Information-Market_Amprion_01-322x196-c-default.jpg", award: true },
  { id: 30, title: "Shaping Our Electricity Future", url: "https://renewables-grid.eu/database/shaping-our-electricity-future/", brand: "RGI", dim: "Energy & Society", topic: "Public acceptance and engagement", inf: "Grids", year: 2022, country: "Ireland", org: "EirGrid, SONI", desc: "Build trust, new relationships, and raise awareness of the need for grid development.", img: "https://renewables-grid.eu/app/uploads/2025/09/Database_social-scaled.png", award: true },
  { id: 31, title: "Kriegers Flak \u2013 Combined Grid Solution", url: "https://renewables-grid.eu/database/x-flex/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Energy system planning", inf: "Offshore wind", year: 2021, country: "Denmark", org: "50Hertz, Energinet", desc: "World's first hybrid interconnector \u2014 effectively manages fluctuations in supply and demand.", img: "https://renewables-grid.eu/app/uploads/2025/09/50Herz__Kriegers_Flak_1-322x196-c-default.jpg", award: true },
  { id: 32, title: "Site Wind Right Tool", url: "https://renewables-grid.eu/database/site-wind-right-tool/", brand: "RGI", dim: "Grids & Energy Systems", topic: "Spatial optimisation", inf: "Onshore wind", year: 2021, country: "USA", org: "The Nature Conservancy", desc: "Highlights areas with lowest potential for conflict, allowing impacts to be avoided to the maximum extent possible.", img: "https://renewables-grid.eu/app/uploads/2025/09/Site_Wind_Right_Map_Screenshot-322x196-c-default.png", award: true },
  { id: 33, title: "Italian Wind Parks Travel Guide", url: "https://renewables-grid.eu/database/italian-wind-parks-travel-guide/", brand: "RGI", dim: "Energy & Society", topic: "Creating awareness and capacity building", inf: "Onshore wind", year: 2021, country: "Italy", org: "Legambiente", desc: "First guide in the world about wind park tourism \u2014 a new positive touristic approach to wind plants.", img: "https://renewables-grid.eu/app/uploads/2025/09/Database_nature-scaled.png", award: true },
  { id: 34, title: "COMPILE: Community Power in Energy Islands", url: "https://renewables-grid.eu/database/compile-integrating-community-power-in-energy-islands/", brand: "RGI", dim: "Energy & Society", topic: "Public acceptance and engagement", inf: "Energy system", year: 2021, country: "Slovenia", org: "University of Ljubljana", desc: "Results obtained by real implementation of the solutions and progress beyond pure research.", img: "https://renewables-grid.eu/app/uploads/2025/09/Database_social-scaled.png", award: true },
];

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

const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   SORT DROPDOWN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "az", label: "A – Z" },
  { value: "za", label: "Z – A" },
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#C9C9C9] text-sm text-[#424244] hover:border-[#58044D] transition-colors bg-white"
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

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */
export default function EnergyTransitionAtlas() {
  /* ── URL param helpers ── */
  const getParam = (key) => new URLSearchParams(window.location.search).get(key) || "";
  const getParamList = (key) => { const v = getParam(key); return v ? v.split(",") : []; };

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

  /* ── sync state → URL ── */
  useEffect(() => {
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
    const url = window.location.pathname + (qs ? "?" + qs : "");
    window.history.replaceState(null, "", url);
  }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, viewMode, sortMode, page]);

  /* ── reset page when filters or sort change ── */
  useEffect(() => { setPage(1); }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, sortMode]);

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
    /* ── sort ── */
    switch (sortMode) {
      case "oldest": results.sort((a, b) => a.year - b.year); break;
      case "az":     results.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za":     results.sort((a, b) => b.title.localeCompare(a.title)); break;
      default:       results.sort((a, b) => b.year - a.year); break; // newest
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
    { label: "Theme", options: allDims, selected: selDims, onChange: setSelDims },
    { label: "Infrastructure", options: allInfra, selected: selInfra, onChange: setSelInfra },
  ];

  /* ── expanded filters ── */
  const expandedFilters = [
    { label: "Theme", options: allDims, selected: selDims, onChange: setSelDims },
    { label: "Infrastructure", options: allInfra, selected: selInfra, onChange: setSelInfra },
    { label: "Year", options: allYears.map(String), selected: selYears.map(String), onChange: (arr) => setSelYears(arr.map(Number)) },
    { label: "Topic", options: allTopics, selected: selTopics, onChange: setSelTopics },
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
    selYears.forEach((v) => chips.push({ label: "Year", value: String(v), onRemove: () => setSelYears((s) => s.filter((x) => x !== v)) }));
    selTopics.forEach((v) => chips.push({ label: "Topic", value: v, onRemove: () => setSelTopics((s) => s.filter((x) => x !== v)) }));
    selCountries.forEach((v) => chips.push({ label: "Location", value: v, onRemove: () => setSelCountries((s) => s.filter((x) => x !== v)) }));
    selOrgs.forEach((v) => chips.push({ label: "Organisation", value: v, onRemove: () => setSelOrgs((s) => s.filter((x) => x !== v)) }));
    selBrands.forEach((v) => chips.push({ label: "Partner", value: v, onRemove: () => setSelBrands((s) => s.filter((x) => x !== v)) }));
    if (awardOnly) chips.push({ label: "Awards", value: "Winners only", onRemove: () => setAwardOnly(false) });
    return chips;
  }, [search, selDims, selInfra, selYears, selTopics, selCountries, selOrgs, selBrands, awardOnly]);

  const clearAllFilters = () => {
    setSearch(""); setSelTopics([]); setSelBrands([]); setSelDims([]);
    setSelCountries([]); setSelYears([]); setSelInfra([]); setSelOrgs([]);
    setAwardOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-['Kantumruy_Pro']">
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=League+Gothic&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');`}</style>

      {/* ─── 1. Brand Bar ─── */}
      <div className="bg-[#424244] px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          <span className="text-white text-xs font-semibold tracking-wider">RGI</span>
          <span className="text-white text-xs font-semibold tracking-wider">OCEaN</span>
          <span className="text-white text-xs font-semibold tracking-wider">GINGR</span>
          <span className="text-white text-xs font-semibold tracking-wider">SL4B</span>
        </div>
      </div>

      {/* ─── 2. Header Bar (sticky) ─── */}
      <header className="sticky top-0 z-40 bg-[#58044D] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-['League_Gothic'] text-[#FFF8E5] text-xl tracking-widest uppercase">
            Energy Transition Atlas
          </h1>
          <button className="border border-[#FFF8E5] text-[#FFF8E5] px-5 py-1.5 rounded-full text-sm font-medium tracking-wide hover:bg-[#FFF8E5] hover:text-[#58044D] transition-colors">
            MENU
          </button>
        </div>
      </header>

      {/* ─── 3. Hero Section ─── */}
      <section className="bg-[#58044D] px-6 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['League_Gothic'] text-white text-5xl lg:text-7xl uppercase tracking-wide leading-tight">
            Energy Transition Atlas
          </h2>
          <p className="mt-4 text-[#FFF8E5] text-lg lg:text-xl font-light max-w-3xl leading-relaxed opacity-90">
            Explore a growing collection of real-world energy transition practices from across organisations and projects — a shared navigator breaking down silos between partners, sectors, and borders.
          </p>
        </div>
      </section>

      {/* ─── 4. Filter Section ─── */}
      <section className="bg-[#FFF8E5] px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#424244] opacity-50">
                <IconSearch />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search practices..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] placeholder:text-[#C9C9C9] focus:outline-none focus:border-[#58044D] transition-colors"
              />
            </div>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg border transition-colors ${
                viewMode === "list"
                  ? "border-[#58044D] text-[#58044D] bg-white"
                  : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
              }`}
              title="List view"
            >
              <IconListView />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg border transition-colors ${
                viewMode === "grid"
                  ? "border-[#58044D] text-[#58044D] bg-white"
                  : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#58044D]"
              }`}
              title="Grid view"
            >
              <IconGridView />
            </button>
            <SortDropdown value={sortMode} onChange={setSortMode} />
            <button
              onClick={() => setMoreOptions(!moreOptions)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C9C9C9] text-sm text-[#424244] hover:border-[#58044D] transition-colors bg-white"
            >
              <IconSettings />
              <span>{moreOptions ? "Less Options" : "More Options"}</span>
            </button>
          </div>

          {/* Filter pills */}
          {!moreOptions ? (
            <div className="flex items-center gap-3 flex-wrap">
              {basicFilters.map((f) => (
                <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
              ))}
            </div>
          ) : (
            <div className="bg-[#FFF8E5] rounded-xl pt-2 pb-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setMoreOptions(false)}
                  className="text-sm text-[#58044D] font-medium hover:underline"
                >
                  Less Options
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {expandedFilters.map((f) => (
                  <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Active Filter Chips ─── */}
      {activeChips.length > 0 && (
        <div className="bg-white border-b border-[#C9C9C9] px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
            {activeChips.map((chip, i) => (
              <span
                key={`${chip.label}-${chip.value}-${i}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58044D]/10 text-[#58044D] text-xs font-medium"
              >
                <span className="opacity-60">{chip.label}:</span> {chip.value}
                <button onClick={chip.onRemove} className="ml-0.5 hover:text-[#58044D]/70 transition-colors">
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
      <section className="flex-1 bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Result count */}
          <p className="text-sm text-[#424244] opacity-60 mb-6">
            {filtered.length} practice{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length === 0 && (
            <div className="text-center py-16">
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
                  <div className="relative">
                    <img
                      src={p.img || placeholderImg}
                      alt={p.title}
                      className="w-full h-48 object-cover rounded-xl bg-[#e2e2e2]"
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
                  className="block py-4 px-3 -mx-3 rounded-lg group hover:bg-[#FFF8E5] transition-colors"
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
            <nav className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-full hover:bg-[#FFF8E5] disabled:opacity-30 text-[#424244] transition-colors"
              >
                <IconChevronLeft />
              </button>
              {paginationNumbers.map((n, i) =>
                n === "..." ? (
                  <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-[#424244] opacity-50">...</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      n === page
                        ? "bg-[#58044D] text-white"
                        : "text-[#424244] hover:bg-[#FFF8E5]"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-full hover:bg-[#FFF8E5] disabled:opacity-30 text-[#424244] transition-colors"
              >
                <IconChevronRight />
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* ─── 7. Footer ─── */}
      <footer className="bg-[#424244] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h4 className="font-['League_Gothic'] text-[#FFF8E5] text-2xl uppercase tracking-widest">
            Energy Transition Atlas
          </h4>
          <p className="mt-4 text-[#FFF8E5] opacity-60 text-sm leading-relaxed max-w-2xl">
            A joint project by the Renewables Grid Initiative (RGI), the Offshore Coalition for Energy and Nature (OCEaN), the Global Initiative for Nature, Grids and Renewables (GINGR), and SafeLines4Birds (SL4B).
          </p>
        </div>
      </footer>
    </div>
  );
}
