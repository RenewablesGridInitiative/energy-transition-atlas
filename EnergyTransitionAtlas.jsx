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
   PRACTICE DATA  (309 records from master CSV)
   Schema: { id, title, url, brand, dim, topic, inf, year, country, org, desc, img, award }
   ────────────────────────────────────────────────────────────────────────────── */
const PRACTICES = [
  { id: 1, title: "Regional investments for onshore high voltage energy infrastructure", url: "https://renewables-grid.eu/database/dutch-scheme/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2026, country: "Netherlands", org: "MINEZK", desc: "To support the expansion of the national extra high voltage grid in the upcoming years, the Dutch Ministry of Climate Policy and Green Growth actively invests in improving the quality of life in communities affected by high-voltage grid projects in the Netherlands. Highlights 01 The amount of funding received by communities will depend on the […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2026_Database_Minezk_RegionalInvestments1-644x398-c-default.png", award: false },
  { id: 2, title: "A collaborative step toward grid resilience with recycled aluminium", url: "https://renewables-grid.eu/database/a-collaborative-step-toward-grid-resilience-with-recycled-aluminium/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2025, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE pioneered a circular approach to grid renewal by recycling aluminium from decommissioned conductors into new high-performance lines. This innovation reduces carbon emissions, strengthens supply chain resilience, and proves that recycled materials can meet technical standards, setting a model for sustainable and resource-efficient energy infrastructure. Highlights 01 Recycled 40 kilometres of ageing conductors, producing high-performance […]", img: "https://renewables-grid.eu/app/uploads/2025/10/RTE1-644x398-c-default.jpg", award: false },
  { id: 3, title: "AI-based detection of nesting boxes on electricity transmission infrastructure", url: "https://renewables-grid.eu/database/ai-based-detection-of-nesting-boxes-on-electricity-transmission-infrastructure/", brand: "RGI", dim: "Nature, Technology", topic: "Bird Protection", inf: "Grids", year: 2025, country: "Germany", org: "Amprion", desc: "This project focuses on using AI to detect bird boxes on electricity transmission infrastructure, enhancing ecological oversight while supporting compliance with environmental legislation and infrastructure maintenance. Amprion’s analysis shows strong performance by the models in identifying bird boxes in images. Highlights 01 Amprion applies deep learning models to existing aerial images to detect the location […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Amprion1-2-scaled-644x398-c-default.jpg", award: false },
  { id: 4, title: "AquaSol for Equity Solar Innovation to Solve Water Insecurity", url: "https://renewables-grid.eu/database/aquasol-for-equity-solar-innovation-to-solve-water-insecurity/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Solar", year: 2025, country: "Cambodia", org: "Green Hope Foundation", desc: "Green Hope Foundation’s AquaSol for Equity provides clean water to Cambodia’s floating villages using solar-powered distillation. Each modular unit produces 100–125 litres of drinking water daily, benefiting around 900 people. The initiative combines technology with youth-led WASH education, improving health, school attendance, and climate resilience. By reducing waterborne diseases by 50% and CO₂ emissions by […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Green-Hope-1-644x398-c-default.jpg", award: false },
  { id: 5, title: "Biohuts as Nature-Inclusive Design Solutions on Floating Offshore Wind Turbines", url: "https://renewables-grid.eu/database/biohuts-as-nature-inclusive-design-solutions-on-floating-offshore-wind-turbines/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2025, country: "Germany", org: "Amprion", desc: "Seeking to align renewable energy development with EU biodiversity goals, Ecocean partnered with Ocean Winds to install 32 biohut ‘fish hotels’ on the platform for a EFGL pilot wind farm off the French Mediterranean coast. Biohuts are steel cages filled with natural materials that mimic habitats for marine life. Representing the first large-scale use of […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 6, title: "Boosting renewable energy integration using grid-enhancing technologies", url: "https://renewables-grid.eu/database/boosting-renewable-energy-integration-using-grid-enhancing-technologies/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2025, country: "France", org: "Artelys", desc: "This project by the data science and modelling company Artelys shows how grid-enhancing technologies (GETs) can support the integration of increasing volumes of renewables while avoiding delays, high costs and public resistance associated with traditional grid expansion. Highlights 01 The project uses advanced simulation tools for accurate grid modelling and security analysis. 02 The project […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Artelys2-644x398-c-default.png", award: false },
  { id: 7, title: "CleanerGrid Competition", url: "https://renewables-grid.eu/database/cleanergrid-competition/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2025, country: "Ireland", org: "EirGrid", desc: "EirGrid’s CleanerGrid competition invites third-level students across Ireland to develop creative solutions supporting the clean energy transition. Participants respond to a themed challenge, present to expert judges, and win prizes for themselves and their universities. By promoting collaboration, awareness, and innovation, the competition builds early engagement between EirGrid, academia, and future energy professionals while highlighting […]", img: "https://renewables-grid.eu/app/uploads/2025/10/EirGrid1-scaled-644x398-c-default.jpg", award: false },
  { id: 8, title: "Community Benefit Fund and The Growspace Network", url: "https://renewables-grid.eu/database/community-benefit-fund/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Scotland", org: "SSEN-D – Scottish and Southern Electricity Networks Distribution", desc: "SSEN Transmission, transmission operator for the North of Scotland, created Community Benefit Funds for each of their projects to support the development of the transmission network while delivering local benefits. Highlights 01 SSEN Transmission created both regional and local funds to ensure a fair distribution among communities. 02 The approach is built on a set […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2025_Database_SSEND_.CommunityBenefitFund1jpg-644x398-c-default.jpg", award: false },
  { id: 9, title: "Community Development Programme for education", url: "https://renewables-grid.eu/database/community-development-programme/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Germany", org: "Amprion", desc: "German TSO Amprion established a Community Development Programme to fund partnerships promoting equal education opportunities in its operational zone. Highlights 01 Collaborations are long-term to deliver lasting impact. 02 Amprion employees dedicate time to the programme’s projects, helping to ensure that the company’s engagement is meaningful for everyone involved. 03 The company organised an activity […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2026_Database_Amprion_CommunityDevelopmentProgramme1-scaled-644x398-c-default.jpg", award: false },
  { id: 10, title: "DSO/TSO Technopedia knowledge sharing platform", url: "https://renewables-grid.eu/database/dso-tso-technopedia/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2025, country: "Belgium", org: "DSO Entity,", desc: "DSO Entity and ENTSO-E have launched a platform for sharing knowledge on technologies and their real-world implementation in the energy system. The platform, Technopedia, provides factsheets on use-cases for distribution and transmission system operators and supports the uptake of technologies for the transition to low-carbon grids. Highlights 01 Provides open and accessible information on technologies […]", img: "https://renewables-grid.eu/app/uploads/2025/10/ENTSO-E_Website-screenshot1-644x398-c-default.png", award: false },
  { id: 11, title: "EDP Networks develops climate adaptation plan to strengthen Iberian power networks against extreme weather", url: "https://renewables-grid.eu/database/edp-networks-climate-adaptation-plan/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2025, country: "Europe", org: "EDP Networks,", desc: "EDP Networks (E-REDES in Portugal and Edp Redes España) developed a comprehensive Climate Adaptation Plan to strengthen the Iberian electricity distribution network against extreme winds, wildfires, floods, and snow. Using IPCC scenarios, the adaptation plan integrates climate risk into planning, operations, and nature-based management to ensure long-term network resilience. Highlights 01 Based on IPCC CMIP5 […]", img: "https://renewables-grid.eu/app/uploads/2025/11/image005-1-644x398-c-default.jpg", award: false },
  { id: 12, title: "EirGrid’s CP1300 Project Improving climate resilience across Ireland’s transmission network", url: "https://renewables-grid.eu/database/eirgrid-cp1300-climate-resilience/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2025, country: "Ireland", org: "EirGrid", desc: "EirGrid’s CP1300 Climate Adaptation Project is a nationwide programme addressing climate risks at substations and along transmission lines in Ireland. The initiative includes capital works flood-resilient infrastrucutre, upgrades of assets’ design standards, and the deployment of dynamic line rating devices. Highlights 01 Nationwide programme to enhance resilience of substations vulnerable to flooding, and other extreme […]", img: "https://renewables-grid.eu/app/uploads/2025/11/EirGrid_Brandmark_Col_RGB-2-1024x491.jpg", award: false },
  { id: 13, title: "ESB Networks builds flood-resilient substations across Ireland", url: "https://renewables-grid.eu/database/esb-networks-flood-resilient-substations/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2025, country: "Ireland", org: "ESB Networks", desc: "ESB Networks, the electricity distribution operator in Ireland, has developed a structured approach to mitigate flood risks for high-voltage (HV) substations. Using future climate projections (RCP 8.5 to 2050 and RCP 4.5 to 2100), the operator aims to enhance the resilience of substations against both pluvial (rain-induced) and fluvial (river-induced) flooding. ESB’s approach includes three […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2025_ESB-Networks_1.png", award: false },
  { id: 14, title: "Going Like the Wind An immersive and interactive exhibition for children", url: "https://renewables-grid.eu/database/going-like-the-wind-an-immersive-interactive-exhibition-for-children/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Offshore wind", year: 2025, country: "Belgium", org: "Elia", desc: "Going Like the Wind was an interactive exhibition at Fort Napoleon in Ostend that enabled children and families to explore how offshore wind energy is generated and transmitted to the mainland. Through storytelling, play frames, and digital displays, it explained the Princess Elisabeth Island and Belgium’s leadership in the blue economy. Its success led to […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Elia-Transmission-Belgium4-644x398-c-default.jpg", award: false },
  { id: 15, title: "Hollandse Kust Zuid SeaLab", url: "https://renewables-grid.eu/database/hollandse-kust-zuid-sealab/", brand: "RGI", dim: "Nature, People", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "Vattenfall", desc: "SeaLab, located at Hollandse Kust Zuid (HKZ) offshore wind farm, works together with scientists, NGOs and university partners on environmental pilot projects combined with strategic communications campaigns and stakeholder engagement. They aim to drive innovative scientific research while presenting offshore wind as a facilitator of biodiversity, circularity, and sustainable marine co-use. Highlights 01 The initiative […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 16, title: "HOPS completes climate risk assessment to guide future grid planning in Croatia", url: "https://renewables-grid.eu/database/hops-climate-risk-assessment-croatia/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2025, country: "Croatia", org: "HOPS", desc: "HOPS, the Croatian transmission system operator, finished its Climate Risk and Vulnerability Assessment (CR&VA) in September 2025. The study looks at how climate change could affect the Croatian transmission grid under two climate scenarios (RCP 4.5 and RCP 8.5) and across three future time periods up to 2100. The assessment identifies where the grid is […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 17, title: "Integrated Vegetation Management Through Resilient and Compatible Flora", url: "https://renewables-grid.eu/database/integrated-vegetation-management-through-resilient-and-compatible-flora/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2025, country: "Portugal", org: "E-REDES", desc: "E-REDES introduced Integrated Vegetation Management (IVM), with the purpose of benefitting biodiversity, delivering ecosystem services and promoting the safeguarding of safety distances between vegetation and lines. Working with CoLAB ForestWISE, the project has identified 107 low-flammability plant species that offer ecological and economic benefits. Supported by digital tools and pilot projects, the IVM activities seek […]", img: "https://renewables-grid.eu/app/uploads/2025/10/E-REDES4-644x398-c-default.jpg", award: false },
  { id: 18, title: "Landowner-stakeholder engagement conversations", url: "https://renewables-grid.eu/database/landowner-stakeholder-engagement-conversations/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Germany", org: "Amprion", desc: "Amprion’s Landowner and Stakeholder Engagement Conversations offer early, one-on-one meetings with landowners affected by grid expansion. Using satellite imagery to discuss tower placement, participants can share feedback that may influence final planning. This confidential dialogue, before formal negotiations, helps identify issues, improve transparency, and reduce potential legal disputes. The approach strengthens trust, respects property rights, […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Amprion4-1-644x398-c-default.jpg", award: false },
  { id: 19, title: "MycoNest Biodegradable insect refuges for solar parks", url: "https://renewables-grid.eu/database/myconest/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Solar", year: 2025, country: "Hungary", org: "MycoNest", desc: "MycoNest is a project launched in Hungary which provides refuges for insects made from mycelium – a root-like structure of fungi – and agricultural residues. The lightweight, biodegradable hooked structures are designed to hang from renewable energy infrastructure such as solar panels, fences, or substations, converting them into hubs for insect biodiversity. Highlights 01 Insects […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 20, title: "Offshore wind toolbox for developers", url: "https://renewables-grid.eu/database/offshore-wind-toolbox-for-developers/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Offshore wind", year: 2025, country: "Belgium", org: "Elia", desc: "Elia group developed a new spatial planning tool and a five-step approach for a financing and funding framework through an offshore investment bank. By discussing and quantifying key levers, the practice supported sound decision making for sustainable offshore wind development. Elia Group also collaborated with over 50+ external stakeholders to enhance impact and ensure effective […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Elia-Group2-644x398-c-default.jpg", award: false },
  { id: 21, title: "Red Eléctrica develops wind map to strengthen Spain’s electricity infrastructure", url: "https://renewables-grid.eu/database/wind-map/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Wind", year: 2025, country: "Spain", org: "REE – Red Eléctrica de España", desc: "Red Eléctrica de España (REE), the Spanish TSO, developed a Wind Map for Spain’s territory to better understand wind-related risks to its electricity infrastructure. The project helps identify areas exposed to strong winds and guides decisions on where to build new lines or reinforce existing ones. By mapping local wind conditions, Red Eléctrica aims to […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 22, title: "RTE raises flandres maritime substation to protect against coastal flooding", url: "https://renewables-grid.eu/database/rte-flandres-substation/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Offshore wind", year: 2025, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE reconstructed the Flandres Maritime substation in northern France with a raised platform to prevent coastal flooding. This measure improves resilience against sea-level rise and storm surges, ensuring the continuity of power supply in a vulnerable coastal area while preparing assets for future climate risks. Highlights 01 Substation platform raised by 60 cm to withstand […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 23, title: "Seeking safe skies for the Bearded Vulture", url: "https://renewables-grid.eu/database/seeking-safe-skies-for-the-bearded-vulture/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2025, country: "Netherlands", org: "REE – Red Eléctrica de España", desc: "The Spanish TSO Red Eléctrica de España and the NGO Foundation for the Conservation of the Bearded Vulture have introduced a project to provide safer habitat for the Bearded Vulture by installing bird diverters on grid infrastructure. The diverters are estimated to reduce collisions by 70%. Highlights 01 The installed bird diverters – rotating and […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Carlos-Sunyer_Red-Electrica-644x398-c-default.jpg", award: false },
  { id: 24, title: "Spanish TSO Red Eléctrica launches new website", url: "https://renewables-grid.eu/database/spanish-tso-red-electrica-launches-new-website/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2025, country: "Netherlands", org: "REE – Red Eléctrica de España", desc: "The TSO Red Eléctrica has launched a new website in Spanish and English aimed at improving its external communication, with features including interactive tools and datasets, and outlining its role in Spain’s energy transition. Web traffic has grown following the launch of the new website. Highlights 01 The new website features interactive tools, including a […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Pantallazo_2_Especial_Operacion_MegaMenuENG-644x398-c-default.png", award: false },
  { id: 25, title: "Strategic Spatial Energy Plan Methodology Planning Great Britain’s energy system", url: "https://renewables-grid.eu/database/strategic-spatial-energy-plan-ssep-methodology/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Offshore wind", year: 2025, country: "United Kingdom", org: "NESO", desc: "NESO’s Strategic Spatial Energy Plan (SSEP) methodology establishes a national framework to plan Great Britain’s energy system from 2030 to 2050. Integrating electricity and hydrogen generation and storage across land and sea, it combines economic, spatial, environmental, and societal modelling. With feedback from over 130 stakeholders, the methodology delivers a transparent, data-driven process for identifying […]", img: "https://renewables-grid.eu/app/uploads/2025/10/B2L-NESO-ControlRoom-21.08.24-215-2-scaled-644x398-c-default.jpg", award: false },
  { id: 26, title: "StromGedacht Empowering citizens to support the energy transition through real-time grid signals", url: "https://renewables-grid.eu/database/stromgedacht-empowering-citizens-to-support-the-energy-transition-through-real-time-grid-signals/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2025, country: "Germany", org: "TransnetBW", desc: "StromGedacht is an app by TransnetBW that informs citizens about the electricity grid’s status in real time using a simple traffic light system. It helps households and smart devices adapt their electricity use to renewable energy availability, stabilising the grid and reducing CO₂ emissions. Through transparency and engagement, it turns passive consumers into active participants […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 27, title: "Supporting biodiversity in the North Sea Fish hotels on offshore high-voltage stations", url: "https://renewables-grid.eu/database/supporting-biodiversity-in-the-north-sea-with-fish-hotels-on-offshore-high-voltage-stations/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "TenneT", desc: "TenneT is installing ‘fish hotels’ on offshore high-voltage stations (OHVS) to support biodiversity in the North Sea. The structures provide protection from marine predators and foraging areas for juvenile fish of species like cod, pouting, mackerel and pollack. Insights on the success of the fish hotels may be used to assess the feasibility and usefulness […]", img: "https://renewables-grid.eu/app/uploads/2025/10/TenneT3-644x398-c-default.jpg", award: false },
  { id: 28, title: "TenneT strengthens grid resilience to flooding in the Netherlands", url: "https://renewables-grid.eu/database/tennet-grid-resilience-flooding/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "TenneT", desc: "TenneT Netherlands (the Dutch TSO) is strengthening its electricity grid against coastal flooding, fluvial flooding and sea level rise by raising critical parts of substations and designing overhead masts that can handle events of extreme high water-levels. These measures help ensure reliable power even during floods or projected sea-level rise, protecting essential infrastructure in vulnerable […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 29, title: "Terna develops Pole-Mounted Switchgear to improve grid resilience and flexibility", url: "https://renewables-grid.eu/database/terna-pole-mounted-switchgear/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2025, country: "Italy", org: "Terna", desc: "Terna developed Pole-Mounted Switchgear (OMP) to strengthen grid flexibility and resilience, particularly in areas with rigid “T” junctions where traditional connections or new stations are difficult to implement. By integrating compact, remotely controlled switchgear and electrical equipment into a new innovative support, the OMP enables maintenance and fault management without disrupting entire backbone lines, ensuring network […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 30, title: "Undergrounding for communities", url: "https://renewables-grid.eu/database/undergrounding-for-communities/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Spain", org: "I-DE", desc: "For a new electricity line in Osa de la Vega, i-DE opted for undergrounding the line to minimise impact on communities and maximise social and environmental benefits. Highlights 01 Undergrounding allowed to reduce disruptions for residents. 02 Bird electrocutions and forest fires caused by overhead lines were avoided. 03 After the works, the area was […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2025_Database_Iberdrola_UndergroundingforCommunities1-644x398-c-default.jpg", award: false },
  { id: 31, title: "Unlocking 25%+ grid capacity", url: "https://renewables-grid.eu/database/unlocking-25-grid-capacity/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2025, country: "Norway", org: "Arne Brudflad Svendsen and Tørris Digernes", desc: "Arne Brudflad Svendsen and Tørris Digernes have developed a real-time probabilistic forecasting tool, Promaps Realtime, that continuously assesses grid capacity and operational risk, now supporting Norway’s Maksgrid initiative to boost utilisation by 25%. It predicts congestion, faults and weather stress, guiding renewable and flexibility planning. Compatible with existing SCADA systems, it improves TSO-DSO coordination and […]", img: "https://renewables-grid.eu/app/uploads/2025/10/InfiniGrid3-644x398-c-default.png", award: false },
  { id: 32, title: "Using AI for nature-conscious vegetation management below overhead lines", url: "https://renewables-grid.eu/database/using-ai-for-nature-conscious-vegetation-management-below-overhead-lines/", brand: "RGI", dim: "Nature, Technology", topic: "Integrated Vegetation Management, Monitoring & Reporting", inf: "Grids", year: 2025, country: "Germany", org: "Amprion", desc: "SAMS (Sustainable AI-driven Management of Vegetation and Ecological Systems) by E.ON in Sweden focuses on using AI – drawing on GIS-based tools, satellite imagery, species databases and weather APIs – to sustainably manage vegetation in corridors below overhead power lines. The project has supported 400 interventions in corridors and and 100’s of hours of ecological […]", img: "https://renewables-grid.eu/app/uploads/2025/10/E.On3_-644x398-c-default.jpeg", award: false },
  { id: 33, title: "WIMBY Wind Farm Planning and Participation Tools", url: "https://renewables-grid.eu/database/wimby-wind-farm-planning-and-participation-tools/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "Utrecht University,", desc: "WIMBY has developed free, interactive tools to support inclusive planning and public engagement for wind energy projects. Combining an online map, a forum, and an immersive 3D platform, WIMBY enables users to explore impacts such as noise, biodiversity, and visual change. Co-created with stakeholders, the tools foster collaboration, improve understanding, and help identify socially acceptable […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Luis-Ramirez-Camargo1-644x398-c-default.jpg", award: false },
  { id: 34, title: "Better consideration of biodiversity in vegetation management contracts", url: "https://renewables-grid.eu/database/better-consideration-of-biodiversity-in-vegetation-management-contracts/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2024, country: "France", org: "RTE", desc: "RTE aims to reduce the environmental impact of its vegetation management practices by ceasing certain activities during sensitive periods from March to August by 2029. This initiative includes revising contract methodologies, implementing fair compensation systems, and providing supplier support to align business models with new ecological objectives.", img: "https://renewables-grid.eu/app/uploads/2025/09/RTE_Photo_1-644x398-c-default.jpg", award: true },
  { id: 35, title: "Bird Protection System", url: "https://renewables-grid.eu/database/bird-protection-system-2/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Onshore wind", year: 2024, country: "Poland", org: "Bioseco", desc: "The Bioseco Bird Protection System (BPS) minimises bird mortality at wind farms by using visual modules and advanced algorithms. It detects birds, tracks their flight paths, and activates deterrent measures to prevent collisions with turbine blades. This innovative solution helps wind farms operate more sustainably with less risk to avian biodiversity and reduce the need for constant downtime of wind turbines.", img: "https://renewables-grid.eu/app/uploads/2025/09/BIOSECO_Photo_4-644x398-c-default.jpg", award: true },
  { id: 36, title: "Building resilient communities and healthcare through renewables", url: "https://renewables-grid.eu/database/building-resilient-communities-and-healthcare-through-renewables/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2024, country: "Peru", org: "Ecoswell", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Ecoswell3-644x398-c-default.jpg", award: true },
  { id: 37, title: "Bye-Bye Paper Floods: Digital Energy Transition with the SuedLink Portal", url: "https://renewables-grid.eu/database/bye-bye-paper-floods-digital-energy-transition-with-the-suedlink-portal/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Germany", org: "TransnetBW", desc: "The SuedLink portal, developed by TransnetBW, enables digital communication and contract processing with property owners involved in electricity grid expansion. The portal reduces paperwork, accelerates procedures, and enhances transparency. This innovation enhances stakeholder engagement and is poised to scale for broader use across other energy projects.", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: true },
  { id: 38, title: "e-faunalert Mobile Application", url: "https://renewables-grid.eu/database/e-faunalert-mobile-application-2/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "Europe", org: "IUCN – International Union for Conservation of Nature", desc: "The e-faunalert mobile application, developed by the IUCN Centre for Mediterranean Cooperation, enables users to collect data on power line structures and wildlife mortality. By providing a standardised platform for reporting, the app facilitates identification of high-risk areas and promotes effective conservation strategies to protect wildlife from electrocution and collision with power lines.", img: "https://renewables-grid.eu/app/uploads/2025/09/IUCN_Photo_1-644x398-c-default.jpg", award: true },
  { id: 39, title: "EirGrid Community Forum", url: "https://renewables-grid.eu/database/eirgrid-community-forum/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Ireland", org: "EirGrid", desc: "The EirGrid Community Forums foster early and meaningful community involvement in grid infrastructure projects across Ireland. Independently facilitated and democratically elected, the Forums ensure inclusive representation, transparent dialogue, and shared decision-making from project inception to implementation. This engagement strategy promotes social acceptance, resulting in successful project delivery and long-term community benefits.", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Picture_2-644x398-c-default.jpg", award: true },
  { id: 40, title: "EirGrid’s Community Benefit Fund", url: "https://renewables-grid.eu/database/community-benefit-fund-2/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2024, country: "Ireland", org: "EirGrid", desc: "For each of the EirGrid’s strategic infrastructure projects, the Irish TSO’s Community Benefit Funds delivers lasting benefits to communities by supporting local projects. EirGrid is putting communities at the heart of engagement by delivering a benefit scheme and establishing a community forum to ensure that fund is designed for the local community by the local […]", img: "https://renewables-grid.eu/app/uploads/2020/02/EirGrid-Picture2-644x398-c-default.jpg", award: false },
  { id: 41, title: "EmPOWER Your Environment", url: "https://renewables-grid.eu/database/empower-your-environment/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Poland", org: "PSE", desc: "The “EmPOWER Your Environment” initiative aims to enhance community well-being and support sustainable development in areas affected by PSE’s energy projects. Through micro-grants, it encourages local projects focused on social, environmental, educational, and health improvements. Over 1,050 projects have been implemented since 2019, benefiting communities in 244 communes across Poland.", img: "https://renewables-grid.eu/app/uploads/2025/09/PSE_Photo_1-644x398-c-default.jpg", award: true },
  { id: 42, title: "Environmentally Friendly and Cost-Effective Bird Protection", url: "https://renewables-grid.eu/database/environmentally-friendly-and-cost-effective-bird-protection/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "TenneT’s project in Wageningen, Netherlands, aims to reduce bird collisions with high-voltage lines by using drones to install Firefly wire markers. This innovative method is more environmentally friendly and cost-effective compared to traditional techniques. An important reason for TenneT to apply bird markings with drones was that this did not affect the soil stability of the ground under the connection.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__Photo_1-min-scaled-644x398-c-default.jpg", award: true },
  { id: 43, title: "First Grid-Forming 300 MVAr STATCOM in Germany", url: "https://renewables-grid.eu/database/first-grid-forming-300-mvar-statcom-in-germany/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Grids", year: 2024, country: "Germany", org: "Amprion", desc: "Amprion’s STATCOM Opladen project addresses future grid stability challenges with reactive power support and grid-forming control. It operates nearly independently of short-circuit power levels, ensuring a stable 400 kV grid under a variety of scenarios. The project sets the foundation for future grid-forming solutions and contributes to the safe and robust integration of renewables into the transmission grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/Amprion_Photo_1-644x398-c-default.jpg", award: true },
  { id: 44, title: "Grid Orchards: Promoting Heritage ‘Ermelo’ Oranges in Grid Corridors", url: "https://renewables-grid.eu/database/grid-orchards-promoting-heritage-ermelo-oranges-in-grid-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2024, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "REN’s project preserves the endangered and culturally important Ermelo orange trees within powerline Right-of-Way corridors, converting them into productive agricultural spaces. This approach mitigates environmental impacts, enhances biodiversity, and strengthens relationships with local communities while promoting sustainable landscape management.", img: "https://renewables-grid.eu/app/uploads/2025/09/REN_Photo_2-min-644x398-c-default.jpg", award: true },
  { id: 45, title: "Grupo Motor: Local Communities Collaborating Towards the Energy Transition", url: "https://renewables-grid.eu/database/grupo-motor/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Spain", org: "Red Eléctrica", desc: "Red Eléctrica, a subsidiary of Redeia, has promoted the creation of the Grupo Motor for Territorial Development of the Energy Transition unites regional organisations to accelerate Spain’s decarbonisation. Through collaboration, the group fosters renewable energy projects, engages local communities, and promotes energy efficiency, aligning with 2030 NECP, Paris Agreement, and EU Green Deal goals.", img: "https://renewables-grid.eu/app/uploads/2025/09/Redeia_Photo_3-644x398-c-default.png", award: true },
  { id: 46, title: "Hydrogen-Powered Drill for Emission-Free Installation of HV Cables", url: "https://renewables-grid.eu/database/hydrogen-powered-drill-for-emission-free-installation-of-hv-cables/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "TenneT successfully completed emission-free drilling for a high-voltage grid enforcement project in a sensitive area for nature and people using hydrogen. With this hydrogen drilling pilot, the only nitrogen emissions emitted were those from the trucks that transport the hydrogen to the construction site while disturbances from noise and smell were also minimised.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__H2_Photo_1-scaled-644x398-c-default.jpg", award: true },
  { id: 47, title: "Investing in trust", url: "https://renewables-grid.eu/database/investing-in-trust/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2024, country: "Belgium", org: "Elia", desc: "Following a storm in Mechelen, Belgium, during which pylons fell and damaged houses, Belgian TSO Elia invested in communities to build trust, leading to cooperation with residents to better overcome the incident. Highlights 01 Residents reduced their electricity consumption to support grid restoration works. 02 Elia’s team was present on site to provide information and […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2024_Database_Elia_InvestinginTrust3-644x398-c-default.jpg", award: false },
  { id: 48, title: "LIFE Safe Grid for Burgas", url: "https://renewables-grid.eu/database/life-safe-grid-for-burgas/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "Bulgaria", org: "Elektrorazpredelenie Yug", desc: "The “LIFE Safe Grid for Burgas” project, funded by the LIFE programme of the European Union, aims to conserve threatened bird species in the Burgas Lakes region by preventing unnatural mortality caused by electrocution and collision with power lines. This is achieved through the installation of bird flight diverters, insulating hazardous pylons, and converting overhead power lines to underground cables, reducing bird deaths and power disruptions.", img: "https://renewables-grid.eu/app/uploads/2025/09/LIFE_Burgas_3-644x398-c-default.jpg", award: true },
  { id: 49, title: "Moonshot", url: "https://renewables-grid.eu/database/moonshot/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Offshore wind", year: 2024, country: "Netherlands", org: "ECHT regie in transitie", desc: "The Moonshot practice fosters collaboration between academia, policy, and industry to enhance the sustainability of the wind sector. By using an inclusive approach, it successfully incorporated circularity into offshore wind tenders in the Netherlands and created valuable partnerships. The practice leads to industry-wide change and offers scalability for future applications also in other domains.", img: "https://renewables-grid.eu/app/uploads/2025/09/ECHT_Regie_Photo_1-scaled-644x398-c-default.jpg", award: true },
  { id: 50, title: "Nature-inclusive design approach planned for the Princess Elisabeth Island", url: "https://renewables-grid.eu/database/nature-inclusive-design-approach-planned-for-the-princess-elisabeth-island/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Elia", desc: "Elia’s nature-inclusive design approach (NID) to the Princess Elisabeth Island demonstrates how offshore renewables can be developed hand-in-hand with biodiversity enhancement. Six NID measures, developed with experts, will be installed during the construction of the artificial energy hub to boost marine life around it. The island will advance Europe’s energy goals in a sustainable manner, serving as an example for future electricity infrastructure projects.", img: "https://renewables-grid.eu/app/uploads/2024/11/Elia_Photo-2-644x398-c-default.jpg", award: true },
  { id: 51, title: "Nature4Networks project Examining the value of nature-based solutions for climate hazards in electricity infrastructure", url: "https://renewables-grid.eu/database/the-nature4networks-project/", brand: "RGI", dim: "Nature, Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2024, country: "", org: "SSEN-D – Scottish and Southern Electricity Networks Distribution", desc: "The Scottish and Southern Electricity Networks Distribution (SSEN-D) explored the value and benefits that can be drawn from nature-based solutions (NbS) for electricity distribution infrastructure to tackle climate change hazards, comparing them to benefits from conventional solutions. Highlights 01 Assessing the value (feasibility, costs and benefits) of nature-based solutions compared to conventional (engineered) options for […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2024_database_SSEN-D_Nature4Networks2-644x398-c-default.png", award: false },
  { id: 52, title: "Open Energy Modelling Initiative (openmod)", url: "https://renewables-grid.eu/database/open-energy-modelling-initiative-openmod/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2024, country: "Worldwide", org: "Open Energy Modelling Initiative", desc: "The Open Energy Modelling Initiative (openmod) promotes open science principles, supporting energy system decarbonisation through transparent data sharing, modelling tools, and fostering global research collaboration. Workshops and a 1,400-member forum ensure widespread participation and knowledge exchange.", img: "https://renewables-grid.eu/app/uploads/2025/09/Openmod_Photo_4-644x398-c-default.jpeg", award: true },
  { id: 53, title: "Resilient ecosystems development on Princess Elisabeth Island", url: "https://renewables-grid.eu/database/resilient-ecosystems-development-on-princess-elisabeth-island/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Ocean Ecostructures", desc: "The project aims to turn the foundation of Princess Elisabeth Island, the world’s first artificial energy island, into a giant artificial reef. Ocean Ecostructures will install 450 of their Life Boosting Units (LBUs) by 2026, which aim to promote ecosystem formation and boost marine biodiversity with innovative technology and monitoring systems. The number of LBUs could grow to 2.000 in a second phase.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: true },
  { id: 54, title: "Virtual Presentation of Grid Projects and Environmental Constraints", url: "https://renewables-grid.eu/database/virtual-presentation-of-grid-projects-and-environmental-constraints/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Grids", year: 2024, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "The VeR project by REN revolutionises the presentation of grid infrastructure and their environmental constraints during field visits with the use of augmented reality (AR). The mobile application and complementing web application enhance project management, resulting in improved decision-making and increased stakeholder trust through clear, integrated visualisation of project impacts.", img: "https://renewables-grid.eu/app/uploads/2025/09/REN_Photo_2-644x398-c-default.jpg", award: true },
  { id: 55, title: "Visualising Power Line Planning for Stakeholders in 3D", url: "https://renewables-grid.eu/database/visualising-power-line-planning-for-stak/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Grids", year: 2024, country: "Germany", org: "TenneT", desc: "The Fulda-Main-Leitung project uses an innovative 3D mapping application to visualise the planning of power lines, enhancing stakeholder engagement and transparency. The tool integrates geospatial data, making complex planning details accessible to the public and stakeholders, thus improving decision-making and reducing resistance.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__Photo_1-644x398-c-default.jpeg", award: true },
  { id: 56, title: "ALEGrO Soil Monitoring Approach", url: "https://renewables-grid.eu/database/alegro-soil-monitoring-approach/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Amprion-Alegro1-scaled-644x398-c-default.jpg", award: true },
  { id: 57, title: "AVISTEP – the Avian Sensitivity Tool for Energy Planning", url: "https://renewables-grid.eu/database/avistep-the-avian-sensitivity-tool-for-energy-planning/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Energy system", year: 2023, country: "Worldwide", org: "BirdLife", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Birdlife_AVISTEP_20_PIC_1-644x398-c-default.jpg", award: true },
  { id: 58, title: "Bird Mortality Risk: Conflict Mapping of Birds and the Grid in Hungary", url: "https://renewables-grid.eu/database/bird-mortality-risk-conflict-mapping-of-birds-and-the-grid-in-hungary/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2023, country: "Hungary", org: "MME Hungary", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/hungarypic1-644x398-c-default.jpg", award: false },
  { id: 59, title: "Building a resilient ecological network of conserved areas across Europe", url: "https://renewables-grid.eu/database/building-a-resilient-ecological-network-of-conserved-areas-across-europe/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Energy system", year: 2023, country: "Europe", org: "NaturaConnect", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/9c210890-5ea1-e351-3ea2-8dd9539f5d97-644x398-c-default.jpg", award: false },
  { id: 60, title: "CEEweb – Collaborating to advocate for resilient ecosystems", url: "https://renewables-grid.eu/database/ceeweb-collaborating-to-advocate-for-resilient-ecosystems/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2023, country: "Europe", org: "CEEweb for Biodiversity", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2023-11-29_at_20.01.41-644x398-c-default.png", award: true },
  { id: 61, title: "Community Liaison Coordinators", url: "https://renewables-grid.eu/database/community-liaison-coordinators/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2023, country: "Spain", org: "REE – Red Eléctrica de España", desc: "In the context of the Salto de Chira infrastructure project in the Canary Islands, Spanish TSO Red Eléctrica provided the impacted communities with multiple types of local benefits. The need for these benefits was identified with the help of Community Liaison Coordinators deployed directly on site. Highlights 01 Community Liaison Coordinators were responsible for communicating […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2026_Database_REE_CommunityLiasonCoordinators1-644x398-c-default.png", award: false },
  { id: 62, title: "Cooperation and new business for grid operators with OneNet Data Connector", url: "https://renewables-grid.eu/database/cooperation-and-new-business-for-grid-operators-with-onenet-data-connector/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "Europe", org: "Fraunhofer Institute for Applied Information Technology", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Fraunhofer_GRIFOn_Concept_1-644x398-c-default.jpg", award: true },
  { id: 63, title: "Coordinated reactive power exchange between transmission and distribution grid", url: "https://renewables-grid.eu/database/coordinated-reactive-power-exchange-between-transmission-and-distribution-grid/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Amprion_power-exchange_1-644x398-c-default.jpg", award: true },
  { id: 64, title: "Decision Support System – Increasing Infrastructure Resilience to Wildfires", url: "https://renewables-grid.eu/database/decision-support-system-increasing-infrastructure-resilience-to-wildfires/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2023, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/REN-Award231-644x398-c-default.jpg", award: true },
  { id: 65, title: "Ecological corridor management in overhead line corridors", url: "https://renewables-grid.eu/database/ecological-corridor-management-in-overhead-line-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Europe", org: "E.ON", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/EON_IVM-Award4-644x398-c-default.jpg", award: true },
  { id: 66, title: "EconiQ retrofill for gas-insulated lines ELK-3, 420 kV", url: "https://renewables-grid.eu/database/econiq-retrofill-for-gas-insulated-lines-elk-3-420kv/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2023, country: "Switzerland", org: "Hitachi Energy", desc: "Hitachi’s EconiQ retrofill solution replaces sulfur hexafluoride (SF6) in installed high-voltage gas-insulated lines and gas-insulted switchgear with an eco-efficient gas mixture to significantly lower the carbon footprint over the total installation life cycle. EconiQ retrofill eliminates the emissions of SF6 and the associated carbon footprint and avoids the costly decommissioning and replacement of equipment. Highlights […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Hitachi_EconiQ1-scaled-644x398-c-default.jpeg", award: true },
  { id: 68, title: "EcoWatt", url: "https://renewables-grid.eu/database/ecowatt/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/RTE_Ecowatt_3-644x398-c-default.jpg", award: true },
  { id: 69, title: "Electrocutions & Collisions of Birds in EU Countries: An Overview Report", url: "https://renewables-grid.eu/database/electrocutions-collisions-of-birds-in-eu-countries-an-overview-report/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Energy system", year: 2023, country: "Europe", org: "NABU – Naturschutzbund Deutschland", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/RPS_Line_Markers-644x398-c-default.jpg", award: false },
  { id: 70, title: "Energy Compass Application", url: "https://renewables-grid.eu/database/energy-compass-application/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2023, country: "Poland", org: "PSE", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/PSE_App1-644x398-c-default.png", award: true },
  { id: 71, title: "Increasing the Rate of Change of Frequency limit to +/– 1 Hz/s", url: "https://renewables-grid.eu/database/increasing-the-rate-of-change-of-frequency-limit-to-1-hz-s/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2023, country: "Ireland", org: "EirGrid", desc: "One of EirGrid’s and SONI’s key tasks as Transmission System Operators is to maintain balance between electricity supply and demand. EirGrid and SONI as TSOs faced a challenge in enabling the growth of renewable energy on the system so they worked to create a technologicially innovative solution. The goal was to increase the instantaneous non-synchronous […]", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Award20232-644x398-c-default.jpg", award: false },
  { id: 72, title: "Increasing the Rate of Change of Frequency limit to ± 1 Hz/s", url: "https://renewables-grid.eu/database/increasing-the-rate-of-change-of-frequency-limit-to-1-hz-s/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "", org: "EirGrid", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Award20232-644x398-c-default.jpg", award: true },
  { id: 73, title: "InterBDL Project Ulm Netze evaluates climate vulnerability of power infrastructure", url: "https://renewables-grid.eu/database/interbdl-project/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2023, country: "Germany", org: "Ulm Netze", desc: "Ulm-Netze is studying how heavy rainfall and surface water affect its medium and low-voltage substations. The project, part of the InterBDL national research initiative on bidirectional electromobility, focuses on assessing infrastructure vulnerability to extreme rainfall events in southern Germany. The goal is to identify risks and prepare adaptation standards for future use across the utility’s […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2025_Database_REN_EnhancingInfrastructureResilience.png", award: false },
  { id: 74, title: "Nature and Species Conservation in Amprion Grids", url: "https://renewables-grid.eu/database/nature-and-species-conservation-in-amprion-grids/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Grafik_O__TM_todays-maintenance-principle-644x398-c-default.jpg", award: false },
  { id: 75, title: "Nature-positive cable protection to restore marine biodiversity", url: "https://renewables-grid.eu/database/nature-positive-cable-protection-to-restore-marine-biodiversity/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2023, country: "Spain", org: "Red Eléctrica", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Redeia1-644x398-c-default.jpg", award: true },
  { id: 76, title: "NorFlex", url: "https://renewables-grid.eu/database/norflex/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "Norway", org: "Å Energi, Glitre Nett, NODES", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Nodes1-644x398-c-default.png", award: true },
  { id: 77, title: "Novel busbar protection scheme for impedance-earthed distribution networks", url: "https://renewables-grid.eu/database/novel-busbar-protection-scheme-for-impedance-earthed-distribution-networks/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2023, country: "Netherlands", org: "Delft University of Technology", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: true },
  { id: 78, title: "Offshore Box on the North Sea Island Norderney", url: "https://renewables-grid.eu/database/offshore-box-on-the-north-sea-island-norderney/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Offshore-Box-2023-2-min-scaled-644x398-c-default.jpg", award: true },
  { id: 79, title: "Smart metering solution implementation in JSC ‘Sadales tīkls’", url: "https://renewables-grid.eu/database/smart-metering-solution-implementation-in-jsc-sadales-tikls/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2023, country: "Latvia", org: "Sadales tīkls", desc: "JSC ‘Sadales tīkls’ carried out one of the biggest digitalisation projects in Latvia. Within their smart metering programme, new generation smart electricity meters were installed for all Sadales tīkls’ customers, adding up to more than one million metering points. The data generated via this programme and the smarter energy management it allows, have led to […]", img: "https://renewables-grid.eu/app/uploads/2025/09/JSC-Sadales-tikls1-644x398-c-default.jpg", award: false },
  { id: 80, title: "Tennet’s Inspiration Guide", url: "https://renewables-grid.eu/database/tennets-inspiration-guide/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Germany", org: "TenneT", desc: "Tennet has released an Inspiration Guide, describing 56 different methods of conserving nature around its powerlines. In all these projects, nature-inclusive working is a key principle by respecting, protecting and, where possible, stimulating nature. This initiative has been realized based on the opinions expressed by residents to ensure renewable energy infrastructure doesn’t cause more damage to biodiversity. The Inspiration Guide works as a guide for project workers, authorities, contractors, local stakeholders, and others to ensure nature inclusive operation. The inspiration guide is a follow-up to the Landscape Guide released in 2022, with innovative designs for a qualitative spatial landscape integration of the high voltage grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT-Guide_1-644x398-c-default.png", award: false },
  { id: 81, title: "Ubiquitous Energy", url: "https://renewables-grid.eu/database/ubiquitous-energy/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2023, country: "United States", org: "Ubiquitous Energy", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Ubiquitous-Energy1-644x398-c-default.jpg", award: true },
  { id: 82, title: "Urban Farming in Power Transmission Networks", url: "https://renewables-grid.eu/database/urban-farming-in-power-transmission-networks/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2023, country: "Brazil", org: "Cities Without Hunger", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Cities-without-hunger1-644x398-c-default.jpg", award: true },
  { id: 83, title: "VegeLine – Vegetation Management System", url: "https://renewables-grid.eu/database/vegeline-vegetation-management-system/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Slovenia", org: "ELES", desc: "ELES is Slovenia’s national transmission system operator. Their Vegetation Management System includes optimization tools and asset management software to integrate biodiversity protection with grid expansion. The tools help prevent harm to surrounding nature as well as disruption to power lines. Their initiative includes risk management of invasive species, easy integration with enterprise asset management software, and detailed analysis of the vegetation to improve land usage and reduce outages caused by trees near power grids.", img: "https://renewables-grid.eu/app/uploads/2025/09/ELES_VegeLine-644x398-c-default.png", award: false },
  { id: 84, title: "Vegetation Management in Rights of Way", url: "https://renewables-grid.eu/database/vegetation-management-in-rights-of-way/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Finland", org: "Fingrid", desc: "Fingrid Oyj is a Finnish national transmission system operator. Their vegetation management system focuses on careful maintenance of the rights of way with over 6000 hectares being cleared per year. A key initiative of their practice includes examining how to increase the use of decaying wood. Fingrid collaborates with landowners to create artificial snags near border zones where lesser value trees are left to decay, creating a natural habitat and nesting site for various insect and bird species. The project emphasises on maintaining a rights of way with border trees that help preserve natural habitats while protecting their power lines.", img: "https://renewables-grid.eu/app/uploads/2025/09/Fingrid-IVM_1-644x398-c-default.jpg", award: false },
  { id: 85, title: "Wild Bees Under Tension", url: "https://renewables-grid.eu/database/wild-bees-under-tension/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Switzerland", org: "Swissgrid", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/04/Swissgrid_1-644x398-c-default.jpg", award: false },
  { id: 86, title: "XR@Transnet", url: "https://renewables-grid.eu/database/xrtransnet/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2023, country: "Germany", org: "TransnetBW", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/XR@Transnet1-scaled-644x398-c-default.jpg", award: true },
  { id: 87, title: "50Hertz Maintenance Plan for Mahlpfuhler Fenn", url: "https://renewables-grid.eu/database/50hertz-maintenance-plan-for-mahlpfuhler-fenn/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2022, country: "Germany", org: "50Hertz", desc: "The Integrated Vegetation Management Plan of 50Hertz involves a maintenance plan in the EU protected area/FFH area “Mahlpfuhler Fenn” in north of Madgeburg. As a bird sanctuary and natural reserve, the area consists of diverse biotopes, wet meadows, ponds, as well as valuable trees and bushes. 50Hertz mapped various species such as pong frogs, great crested newt, […]", img: "https://renewables-grid.eu/app/uploads/2025/09/50Hz_Practice-2022-scaled-644x398-c-default.jpg", award: false },
  { id: 88, title: "Agri-PV", url: "https://renewables-grid.eu/database/agri-pv/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Solar", year: 2022, country: "United States", org: "Jack’s Solar Garden", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Jack-Solar-Garden_1-scaled-644x398-c-default.jpg", award: true },
  { id: 89, title: "Bio Transport", url: "https://renewables-grid.eu/database/bio-transport/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2022, country: "Spain", org: "Red Eléctrica, Spanish Council for Scientific Research (CSIC)", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/CSICSchematic-representation-of-the-study-area-Yellow-zones-are-dry-crops-of-cereals-and-644x398-c-default.jpg", award: false },
  { id: 90, title: "Biodotti", url: "https://renewables-grid.eu/database/biodotti/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2022, country: "Italy", org: "Terna", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Biodotti_1-1-644x398-c-default.jpg", award: true },
  { id: 91, title: "Circular Economy for the Wind Industry", url: "https://renewables-grid.eu/database/circular-economy-for-the-wind-industry/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Onshore wind", year: 2022, country: "United Kingdom", org: "Renewable Parts", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Renewable-Parts_4-644x398-c-default.jpg", award: false },
  { id: 92, title: "Conserving Threatened Birds in Western Bulgaria", url: "https://renewables-grid.eu/database/conserving-threatened-birds-in-western-bulgaria/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2022, country: "Bulgaria", org: "Bulgarian Society for the Protection of Birds (BSPB), EGD West", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/EDG-West_Award22_2-644x398-c-default.jpg", award: true },
  { id: 93, title: "Cooperative Loans", url: "https://renewables-grid.eu/database/cooperative-loans/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Solar", year: 2022, country: "Portugal", org: "Coopérnico", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Coopernico_1-644x398-c-default.jpg", award: true },
  { id: 94, title: "Digital Citizen Information Market", url: "https://renewables-grid.eu/database/digital-citizen-information-market/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2022, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Digital-Information-Market_Amprion_01-644x398-c-default.jpg", award: true },
  { id: 95, title: "Elia reinforces towers and substations to boost multi-hazard grid resilience", url: "https://renewables-grid.eu/database/elia-grid-resilience/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2022, country: "Germany", org: "50Hertz,", desc: "Elia Group – Elia Transmission Belgium (ETB, Belgium) and 50Hertz Transmission (Germany) – is enhancing the resilience of its electricity infrastructure against multiple climate hazards, including storms, strong winds, flooding, and heatwaves. Measures include reinforcing transmission towers and protecting substations from flooding, improving cooling and heating systems in substations, and using durable materials to ensure […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 96, title: "FARCROSS Modular Power Flow Control Solution", url: "https://renewables-grid.eu/database/farcross-modular-power-flow-control-solution/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Bulgaria", org: "FARCROSS Project Consortium, IPTO – Independent Power Transmission Operator, SmartWires", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/FARCROSS-IPTO-Smart-Valve-Installation-Sept-2021-2-003-1-scaled-644x398-c-default.jpg", award: true },
  { id: 97, title: "Nature+Energy", url: "https://renewables-grid.eu/database/natureenergy/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Onshore wind", year: 2022, country: "Ireland", org: "Maynooth University (MU), Nature+, Trinity College Dublin (TCD)", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/NatureEnergy_1-644x398-c-default.jpg", award: true },
  { id: 98, title: "Nature-Inclusive Design Pilots", url: "https://renewables-grid.eu/database/nature-inclusive-pilots/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2022, country: "Ireland", org: "EirGrid", desc: "With the government of Ireland introducing a biodiversity emergency in 2019, EirGrid has committed to implement nature-inclusive design across their infrastructure. This includes pilot projects on restoration, extensive biodiversity monitoring, and measures to protect birds near powerlines. The projects aim to avoid or reduce negative effects of electricity transmission infrastructure on the environment. EirGrid is funding an […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2022_Database_EirGrid_NatureInclusiveDesignPilots1-644x398-c-default.jpg", award: false },
  { id: 99, title: "New planning practices with an EE1 focus", url: "https://renewables-grid.eu/database/new-planning-practices-with-an-ee1-focus/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Spain", org: "Red Eléctrica", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/REE_Award22_3-644x398-c-default.jpg", award: true },
  { id: 100, title: "NordGrid Programme", url: "https://renewables-grid.eu/database/nordgrid-programme/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Europe", org: "Nordic Energy Research", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/NordGrid_3-644x398-c-default.jpg", award: true },
  { id: 101, title: "Out-of-Step Protection to Detect Power Swings", url: "https://renewables-grid.eu/database/out-of-step-protection-to-detect-power-swings/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2022, country: "Europe", org: "Delft University of Technology", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/TU-Delft_5-644x398-c-default.jpeg", award: true },
  { id: 102, title: "Pathfinder", url: "https://renewables-grid.eu/database/pathfinder/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2022, country: "Europe", org: "Gilytics", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Pathfinder_Award22_3-644x398-c-default.jpg", award: true },
  { id: 103, title: "Power Academy", url: "https://renewables-grid.eu/database/power-academy/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2022, country: "Poland", org: "PSE", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/PSE1-scaled-644x398-c-default.jpg", award: true },
  { id: 104, title: "Printed Energy", url: "https://renewables-grid.eu/database/printed-energy/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Solar", year: 2022, country: "Australia", org: "Kardinia Energy", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Printed-Energy_6-644x398-c-default.jpg", award: true },
  { id: 105, title: "Shaping Our Electricity Future", url: "https://renewables-grid.eu/database/shaping-our-electricity-future/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2022, country: "Ireland", org: "EirGrid, SONI", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Award22_1-644x398-c-default.jpg", award: true },
  { id: 106, title: "SPEED-E", url: "https://renewables-grid.eu/database/speed-e/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/SPEED-E_2-scaled-644x398-c-default.jpg", award: true },
  { id: 107, title: "T-Lab Master’s Programme", url: "https://renewables-grid.eu/database/t-lab-masters-programme/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2022, country: "Italy", org: "Terna", desc: "Italian TSO Terna developed a Master’s programme with three Italian universities on electricity system digitalisation, promoting education and employment opportunities in the region of the company’s Tyrrhenian Link project. Highlights 01 The co-design approach allows to combine academic standards and alignment with industrial needs. 02 The initiative aims to contribute to local education and employability. […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 108, title: "TIGON", url: "https://renewables-grid.eu/database/tigon/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Europe", org: "CIRCE Foundation, Project consortium", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/TIGON_Award22_5-644x398-c-default.jpg", award: true },
  { id: 109, title: "TransMit", url: "https://renewables-grid.eu/database/transmit/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2022, country: "Europe", org: "BirdLife, Convention on Migratory Species (CMS), MAVA Foundation", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/1.-Front-cover-644x398-c-default.jpg", award: true },
  { id: 110, title: "TRINITY", url: "https://renewables-grid.eu/database/trinity/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Europe", org: "ETRA I+D", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/TRINITY_3-644x398-c-default.jpg", award: true },
  { id: 111, title: "Virtual model of the Rhine-crossing in the EnLAG 14", url: "https://renewables-grid.eu/database/virtual-model-of-the-rhine-crossing-in-the-enlag-14/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2022, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Virtual-Model-of-crossing-the-rhine-by-cable_Amprion_02-644x398-c-default.jpg", award: true },
  { id: 112, title: "Autonomous IoT device to repel birds from power lines", url: "https://renewables-grid.eu/database/autonomous-iot-device-to-repel-birds-from-power-lines/", brand: "RGI", dim: "Nature, Technology", topic: "Bird Protection", inf: "Grids", year: 2021, country: "Spain", org: "Energiot, Iberdrola", desc: "In response to Iberdrola's StartUp Challenge on Bird Protection on Electricity Grids, Spanish start-up, Energiot has proposed an innovative solution for the protection of birdlife around power lines. They developed a device which uses residual energy from the transmission network to repel birds from power lines through a predator emulator and repellent light emitter, thus reducing risk of electrocution. The practice won the challenge in 2021.", img: "https://renewables-grid.eu/app/uploads/2025/09/Iberdrola_1-644x398-c-default.jpg", award: false },
  { id: 113, title: "Bird-safe energy infrastructure promoted internationally through the Great Ethiopian Run", url: "https://renewables-grid.eu/database/bird-safe-energy-infrastructure-promoted-internationally-through-the-great-ethiopian-run/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2021, country: "Ethiopia", org: "BirdLife Africa, Bulgarian Society for the Protection of Birds (BSPB), Ethiopian Wildlife and Natural History Society (EWNHS)", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/GER_4_credits_Henok_Samson-compressed-scaled-644x398-c-default.jpg", award: false },
  { id: 114, title: "Carbon calculator to estimate CO₂ emissions from excavation and degradation of peatlands", url: "https://renewables-grid.eu/database/solar-allensbach-intelligent-energy-sector-coupling/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Energy system", year: 2021, country: "Norway", org: "Statnett, NINA", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Statnett_Carbon_calculator_pic3-644x398-c-default.jpg", award: false },
  { id: 115, title: "COMPILE: Integrating Community Power in Energy Islands", url: "https://renewables-grid.eu/database/compile-integrating-community-power-in-energy-islands/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2021, country: "Slovenia", org: "University of Ljubljana", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Community_battery_delivery-644x398-c-default.jpg", award: false },
  { id: 116, title: "CROSSBOW Horizon 2020 Project", url: "https://renewables-grid.eu/database/using-mixed-reality-mr-on-the-modular-offshore-grid-mog/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "ETRA I+D", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/CROSSBOW_Consortium_in_Constanta__Romania_-compressed-644x398-c-default.jpg", award: true },
  { id: 117, title: "DA/RE: The network security initiative", url: "https://renewables-grid.eu/database/da-re-the-network-security-initiative/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2021, country: "Germany", org: "TransnetBW; Netze BW", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/c/8/csm_dare_1.jpg, https://renewables-grid.eu/fileadmin/_processed_/f/5/csm_dare_2.jpg, https://renewables-grid.eu/fileadmin/_processed_/1/6/csm_dare_3.jpg", award: false },
  { id: 118, title: "Digital Terna Incontra", url: "https://renewables-grid.eu/database/digital-terna-incontra/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2021, country: "Italy", org: "Terna", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Digital_Terna_Incontra_1-644x398-c-default.png", award: false },
  { id: 119, title: "Don’t stop! Digital citizens’ participation in grid expansion in the coronavirus era – and after", url: "https://renewables-grid.eu/database/dont-stop-digital-citizens-participation-in-grid-expansion-in-the-coronavirus-era-and-after/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2021, country: "Europe", org: "TenneT", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Virtual_TenneT_Information_Market-644x398-c-default.png", award: false },
  { id: 120, title: "Ecological Corridor Management", url: "https://renewables-grid.eu/database/ecological-corridor-management/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2021, country: "Germany", org: "E.ON, Westnetz", desc: "E.ON aims to create a 13,000km network of ecological corridors across their European subsidiary companies of Distribution System Operators. Ecological Corridor Management (ECM) works on promoting biodiversity and restoring ecosystems around grids, while ensuring system security by removing only cutting down fast-growing trees which pose a threat by potentially touching or falling onto power lines. he fast-growing trees are cut down and space left for the existing slower, low-growing trees, creating a habitat for various insects and animals.", img: "https://renewables-grid.eu/app/uploads/2025/09/IVM-Westnetz_1-644x398-c-default.jpg", award: true },
  { id: 121, title: "electricityMap", url: "https://renewables-grid.eu/database/electricitymap/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2021, country: "Worldwide", org: "electricityMap", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2021-12-03_at_15.40.10-644x398-c-default.png", award: false },
  { id: 122, title: "EMPOWER", url: "https://renewables-grid.eu/database/futureflow/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Norway", org: "Smart Innovation Norway", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/app4-644x398-c-default.jpg", award: true },
  { id: 123, title: "Energía4All", url: "https://renewables-grid.eu/database/energia4all/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2021, country: "Spain", org: "Fundación Renovables", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/FR_e4a_5-644x398-c-default.jpg", award: false },
  { id: 124, title: "EUSysFlex", url: "https://renewables-grid.eu/database/crossbow-horizon-2020-project/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "EirGrid", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/EU-Sys-FlexGroup_picture-644x398-c-default.jpg", award: true },
  { id: 125, title: "Fish hotels", url: "https://offshore-coalition.eu/database-project/fish-hotels/", brand: "OCEaN", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "Ecocean, TenneT", desc: "To enhance biodiversity around TenneT’s offshore high voltage station by creating shelter and safe foraging opportunities for diverse types ofyoung fish and potentially crustaceans.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 126, title: "FutureFlow", url: "https://renewables-grid.eu/database/iegsa-platform/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "APG, ELES, Mavir, Transelectrica", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2021-12-21_at_19-compressed_1_-644x398-c-default.jpg", award: true },
  { id: 127, title: "IEGSA Platform", url: "https://renewables-grid.eu/database/da-re-the-network-security-initiative/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "Project consortium", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/interrface-644x398-c-default.jpg", award: true },
  { id: 128, title: "Incremental Ecological Index (IEI)", url: "https://renewables-grid.eu/database/carbon-calculator-to-estimate-co%e2%82%82-emissions-from-excavation-and-degradation-of-peatlands/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Energy system", year: 2021, country: "Italy", org: "Terna", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/mascheramento_pitfall_trap-644x398-c-default.jpg", award: false },
  { id: 129, title: "Introducing circular economy practices into the wind industry", url: "https://renewables-grid.eu/database/circular-economy-practices/", brand: "RGI", dim: "Nature", topic: "Circularity & Supply Chains", inf: "Wind", year: 2021, country: "", org: "Renewable Parts", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/6/1/csm__c_Chris_Watt_Photography_333_bd78af5272.jpg, https://renewables-grid.eu/fileadmin/_processed_/3/9/csm__c_Chris_Watt_Photography_343_009a31e842.jpg", award: false },
  { id: 130, title: "Italian wind parks travel guide", url: "https://renewables-grid.eu/database/italian-wind-parks-travel-guide/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Onshore wind", year: 2021, country: "Italy", org: "Legambiente", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/wp1-644x398-c-default.jpg", award: false },
  { id: 131, title: "Kriegers Flak – Combined Grid Solution", url: "https://renewables-grid.eu/database/x-flex/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Offshore wind", year: 2021, country: "", org: "50Hertz, Energinet", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/50Herz__Kriegers_Flak_1-644x398-c-default.jpg", award: true },
  { id: 132, title: "Kriegers Flak – Combined Grid Solution: World’s first hybrid interconnector", url: "https://renewables-grid.eu/database/kriegers-flak-combined-grid-solution-worlds-first-hybrid-interconnector/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Offshore wind", year: 2021, country: "Europe", org: "50Hertz,", desc: "The ‘Combined Grid Solution’ (CGS) is a hybrid system that interconnects the grid of north-eastern Germany with the Danish island of Zealand utilising the grid connection infrastructure of the German offshore wind farms Baltic 1 and 2 and the Danish offshore windfarm Kriegers Flak. It’s the first of its kind worldwide and will be operational […]", img: "https://renewables-grid.eu/app/uploads/2025/09/50Herz__Kriegers_Flak_1-644x398-c-default.jpg", award: false },
  { id: 133, title: "Large-scale grid flexibility", url: "https://renewables-grid.eu/database/eusysflex/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "Project consortium", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/20210709_072635-compressed-scaled-644x398-c-default.jpg", award: true },
  { id: 134, title: "Near-infrared study of agricultural yields above a 380 kV underground cable", url: "https://renewables-grid.eu/database/near-infrared-study-of-agricultural-yields-above-a-380-kv/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2021, country: "Germany", org: "Amprion", desc: "To assess how underground cables affect crop yields, near-infrared images taken by drones can be used efficiently to visualise biomass vitality and yield. Amprion has used this technique in a monitoring project in three consecutive years accompanying their underground cable pilot in Raesfeld, North Rhine-Westphalia, Germany. Highlights 01 Visualises and assesses yields of entire fields along underground […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Drone-644x398-c-default.jpg", award: false },
  { id: 135, title: "Pastoreo en red – Grazing under high voltage lines", url: "https://renewables-grid.eu/database/pastoreo-en-red-grazing-under-high-voltage-lines/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2021, country: "Spain", org: "Red Eléctrica", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Foto_24-644x398-c-default.jpg", award: false },
  { id: 136, title: "Protocolo Avifauna – Bird protection on distribution lines", url: "https://renewables-grid.eu/activities/best-practices/database.html?detail=175", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2021, country: "", org: "SPEA, E‑REDES, Quercus, LPN, INCF", desc: "Portuguese DSO E-REDES, together with NGOs SPEA, QUERCUS and LPN, developed long-term mitigation measures against bird electrocution and collision on power lines. By monitoring more than 1670 km of lines, they identified hotspots and implemented targeted devices such as insulation, cabling, and retrofitting. The initiative strengthens protection for endangered species and builds a collaborative model between grid operators, NGOs, and conservation authorities.", img: "https://renewables-grid.eu/fileadmin/_processed_/5/9/csm_Screen_Shot_2019-06-06_at_16.31.22_8bf1987af2.png", award: false },
  { id: 137, title: "Site Wind Right tool", url: "https://renewables-grid.eu/database/site-wind-right-tool/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Onshore wind", year: 2021, country: "United States", org: "The Nature Conservancy", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/South_Dakota_Prairie-644x398-c-default.jpg", award: true },
  { id: 138, title: "SoLAR Allensbach – Intelligent Energy Sector Coupling", url: "https://renewables-grid.eu/database/kriegers-flak-combined-grid-solution-worlds-first-hybrid-interconnector/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2021, country: "Germany", org: "Community of Allensbach, Easy Smart Grid, EIFER", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/SoLAR_14__c__Easy_Smart_Grid-644x398-c-default.jpg", award: true },
  { id: 139, title: "Systemvision 2050", url: "https://renewables-grid.eu/database/systemvision-2050/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Logo-644x398-c-default.png", award: false },
  { id: 141, title: "Using Mixed Reality on the Modular Offshore Grid", url: "https://renewables-grid.eu/database/empower/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Offshore wind", year: 2021, country: "", org: "Elia", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/AR_on_MOG_call1-644x398-c-default.png", award: true },
  { id: 142, title: "X-FLEX", url: "https://renewables-grid.eu/database/large-scale-grid-flexibility/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "ETRA I+D", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/scenarios___tools-644x398-c-default.png", award: true },
  { id: 144, title: "ALEGrO: New HVDC link optimized by the market to increase societal value", url: "https://renewables-grid.eu/database/alegro/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "Belgium", org: "Elia", desc: "Belgium’s Elia and Germany’s Amprion are constructing ALEGrO, the first 1GW High Voltage Direct Current (HVDC) interconnector to connect two countries within an Alternating Current (AC) grid, to allow a high integration of renewable energy, maximise market value, and improve security of supply in the two countries and across the Central West European region. objectives […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elia-ALEGRO2-644x398-c-default.png", award: false },
  { id: 145, title: "Creating Acceptance by Transparency on Community level", url: "https://renewables-grid.eu/database/creating-acceptance/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Germany", org: "TransnetBW; Stadt Leingarten", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/csm_Leingarten_public_event_-compressed_ebd32edc7c.jpg, https://renewables-grid.eu/fileadmin/_processed_/csm_Leingarten_news_copy_b2f471f53b.png", award: false },
  { id: 146, title: "Dialogue as the beating heart of the process Project support groups", url: "https://renewables-grid.eu/database/project-support-groups/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Belgium", org: "Elia", desc: "For two main grid projects in Flanders and Wallonia, two support groups were formed to discuss the interests and concerns of the project and jointly look for better solutions before project-start and throughout. Highlights 01 Two permanent support groups for civil society created and numerous meetings held 02 Increased involvement of external stakeholders, including citizens […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elia_ProjectSupportGroups1-644x398-c-default.jpg", award: false },
  { id: 148, title: "Digital results conference and dialogue process", url: "https://renewables-grid.eu/database/conference-dialogue-process/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2020, country: "Germany", org: "Deutsche Umwelthilfe,", desc: "Due to COVID19-related restrictions, German TSO, TenneT, Environmental Action Germany (DUH) and the Ministry for Energy Transition, Agriculture, Environment, Nature and Digitalisation in Schleswig Holstein (MELUND), adapted the results conference of the proposed West Coast Line (WCL) to become completely digital. Highlights 01 Developed a digital platform to inform the public and explain decisions and […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Tennet_ConferenceandDialogue1-644x398-c-default.png", award: false },
  { id: 149, title: "e-Gridmap", url: "https://renewables-grid.eu/database/e-gridmap/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "Estonia", org: "Elering", desc: "", img: "https://renewables-grid.eu/fileadmin/user_upload/Elering_Map.png", award: false },
  { id: 150, title: "Ecological line maintenance in a nature reserve", url: "https://renewables-grid.eu/database/ecological-line-maintenance/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Germany", org: "NABU; BUND", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/csm_Screen_Shot_2021-03-26_at_10.25.51_880eb593ae.png, https://renewables-grid.eu/fileadmin/_processed_/csm_Screen_Shot_2021-04-06_at_16.19.24_8bca621bdf.png, https://renewables-grid.eu/fileadmin/_processed_/Screen_Shot_2021-04-06_at_16.19.35.png", award: false },
  { id: 151, title: "EmPower Your Environment grant programme", url: "https://renewables-grid.eu/activities/best-practices/database.html?detail=209", brand: "RGI", dim: "People", topic: "", inf: "Energy system", year: 2020, country: "", org: "PSE", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/csm_Niemce_commune_2_a039bbea99.jpg", award: false },
  { id: 152, title: "Energy transition Decentral – connected – together", url: "https://renewables-grid.eu/database/decentral-connected-together/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Germany", org: "The Energy Avantgarde Anhalt e. V.", desc: "To shape the energy transition in Saxony-Anhalt and find future-proof solutions for the region, Energieavantgarde Anhalt (EA) brought together citizens with private and public actors to create a living lab environment, where diverse energy-related topics are handled. Objectives 01 Broadened public engagement by linking climate protection to regional value creation 02 Involves a broad spectrum […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_EnergieavantgardeAnhalt_DecentralConnectedTogether1-644x398-c-default.png", award: false },
  { id: 153, title: "Holistic Approach for Validating Complex Smart Grid Systems", url: "https://renewables-grid.eu/database/validating-grid-systems/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "", org: "ERIGrid consortium (18 partners from 11 European countries)", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/d/3/csm_ERIGrid_labs_51c1c01736.jpg,https://renewables-grid.eu/fileadmin/_processed_/7/3/csm_ERIGrid_facts_46ea3ae602.jpg", award: false },
  { id: 154, title: "Joint initiative for stone reef reconstruction in the German Baltic Sea", url: "https://renewables-grid.eu/database/joint-initiative-for-stone-reef-reconstruction-in-the-german-baltic-sea/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2020, country: "Germany", org: "50Hertz; WWF Germany", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/csm_50Hertz_Optimized-BoulderMytilusBalt_007_b5e3f0e900.jpg, https://renewables-grid.eu/fileadmin/_processed_/csm_50Hertz_Optimized-FindlingAlgSurenDorf_008_50f2b76204.jpg", award: false },
  { id: 155, title: "Mainstreaming soaring birds’ conservation in energy sector in Jordan", url: "https://renewables-grid.eu/database/mainstreaming-soaring-birds/", brand: "RGI", dim: "Nature, People", topic: "Public Acceptance & Engagement", inf: "Offshore wind", year: 2020, country: "Jordan", org: "Royal Society for the Conservation of Nature (RSCN),", desc: "Jordan’s Royal Society for the Conservation of Nature (RSCN) established a national online database to monitor and mitigate migratory bird collisions and electrocution around energy infrastructure. This platform encourages wind energy project planning that supports ecological requirements and bird conservation. Objectives 01 Developed national safeguards for wind farms to protect 37 soaring bird species (of […]", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_Birdlife_MainstreamingSoaringBirds1-644x398-c-default.jpeg", award: false },
  { id: 156, title: "Naturaleza en RED – Vegetation Management under transmission lines", url: "https://renewables-grid.eu/database/naturaleza-en-red/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Spain", org: "Universidad Autónoma de Barcelona,", desc: "Naturaleza en RED is a pilot project by the Universidad Autónoma de Barcelona in collaboration with the Red Eléctrica Group. As part of the initiative, a study was carried out in the Montseny nature reserve to examine the areas under transmission lines, also known as safety corridors to analyse the role of the areas beneath Red Eléctrica de […]", img: "https://renewables-grid.eu/app/uploads/2020/03/2020_Database_REE_NaturalezaenRed-644x398-c-default.jpg", award: false },
  { id: 157, title: "New Public Engagement Strategy and pivoting to Virtual Engagement in response to COVID-19", url: "https://renewables-grid.eu/database/new-public-engagement-strategy-and-pivoting-to-virtual-engagement-in-response-to-covid-19/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Ireland", org: "EirGrid", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/d/e/csm_deliberative_dialogue_tool-compressed_7468e8bbf3.jpg, https://renewables-grid.eu/fileadmin/_processed_/7/2/csm_nyci-eirgrid-youth-assembly_6560264196.png, https://renewables-grid.eu/fileadmin/_processed_/9/5/csm_eirgrid-soef-options_e23bdb5f5f.jpg", award: false },
  { id: 158, title: "Protection of the marine environment thanks to the future offshore substations", url: "https://renewables-grid.eu/database/protection-of-marine-environment/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2020, country: "France", org: "RTE", desc: "", img: "https://renewables-grid.eu/fileadmin/user_upload/RTE_site_visit.png, https://renewables-grid.eu/fileadmin/_processed_/csm_RTE_Illustration_Plateforme_RTE_2018_571f4529f9.jpg, https://renewables-grid.eu/fileadmin/_processed_/csm_Rte_-_Sea_energy-compressed_2__13bbf70ad0.jpg", award: false },
  { id: 159, title: "Reducing the risk of bird collisions with high-voltage power lines in Belgium", url: "https://renewables-grid.eu/database/reducing-the-risk/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2020, country: "Belgium", org: "Natuurpunt,", desc: "Combining the most recent knowledge on bird distribution, Belgian NGOs Natagora and Natuurpunt, together with national TSO, Elia, created a map to quantify the risk of bird collision with power lines for the whole of Belgium, enabling estimations of collision risk anywhere in the country. Highlights 01 Allows to prioritise which power lines should be equipped with mitigation measures […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elia_ReducingtheRiskofBirdCollisions1-644x398-c-default.png", award: false },
  { id: 160, title: "Replacement of SF6 by alternatives in 420 kV", url: "https://renewables-grid.eu/database/gas-insulated-switchgear/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2020, country: "Germany", org: "TransnetBW", desc: "German TSO TransnetBW initiated the first pilot projects worldwide with different manufacturers and research institutes, stimulating the development of 420 kV SF6-free gas-insulated switchgear (GIS), while at the same time allowing for safe grid operation. Highlights 01 First pilot projects worldwide on developing SF6-free GIS at the high voltage level of 420 kV 02 Two […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_TransnetBW_GasInsulatedSwitchgear1-644x398-c-default.png", award: false },
  { id: 162, title: "rePLANT – Management of Forest Fires", url: "https://renewables-grid.eu/database/replant/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2020, country: "Portugal", org: "Rede Electrica Nacional (REN), University of Coimbra, whereness", desc: "‘rePLANT', a collaborative initiative by Portuguese TSO REN, whereness, & University of Coimbra introduces innovative risk management systems that monitor and detect the risk of forest fires. Based on scientific and technological knowledge, the initiative brings new, more efficient and intelligent equipment for the forest that protects the environment from the harmful effects of wildfires, as well as increases the resilience of power lines. rePLANT mobilizes 20 entities, including companies in the forest sector, in a common and coordinated effort to implement 8 Collaborative Strategies. It brings team of experts with over 30 years of experience in fire management to develop technology that detects and mitigates persistent issues of forest fires.", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_REN_rePLANT3-644x398-c-default.jpg", award: false },
  { id: 163, title: "SAGA", url: "https://renewables-grid.eu/database/saga/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "Spain", org: "Elewit – technological platform of the Red Eléctrica Group", desc: "", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elewit_SAGA1-644x398-c-default.png", award: false },
  { id: 164, title: "Schafe Unter Strom", url: "https://renewables-grid.eu/activities/best-practices/database.html?detail=292", brand: "RGI", dim: "Nature", topic: "", inf: "Energy system", year: 2020, country: "", org: "50Hertz, Technische Universität Dresden, Mitnetz Strom, Landschaftspflegeverband Westsachsen e.V.", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/3/8/csm_Screenshot_2023-09-10_at_21-58-17_Schafe-unter-Strom-Hauptmotiv-.png, https://renewables-grid.eu/fileadmin/_processed_/b/2/csm_projektgebiet_74967b9a0a.png, https://renewables-grid.eu/fileadmin/_processed_/4/4/csm_Leo_fokus-natur-32099-Schaefer_4e3cd77fc0.jpg", award: false },
  { id: 165, title: "Stakeholder consultation around the Celtic Interconnector", url: "https://renewables-grid.eu/database/stakeholder-consultation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Ireland", org: "EirGrid", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/e/1/csm_Eirgrid_3D_software_visual_2-compressed_9552f289f6.jpg,https://renewables-grid.eu/fileadmin/_processed_/e/1/csm_Eirgrid_public_event_e40cc59e12.png", award: false },
  { id: 166, title: "The electricity world at school", url: "https://renewables-grid.eu/database/electricity-world/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2020, country: "Italy", org: "Terna", desc: "", img: "https://renewables-grid.eu/fileadmin/user_upload/Terna_Comic.png, https://renewables-grid.eu/fileadmin/user_upload/Terna_Game.png", award: false },
  { id: 167, title: "Virtual public engagement Project’s first visit", url: "https://renewables-grid.eu/database/virtual-engagement/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2020, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "To enable environmental impact assessments at a time where COVID-19 limitations inhibited in-person visits, Portuguese TSO, REN used drone footage and satellite imagery to illustrate the territory of new transmission lines and to draw special attention to environmental constraints. Objectives 01 Produced videos to illustrate territory of new transmission lines 02 Reduced necessity for in-person […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_REN_VirtualPublicEngagement1-644x398-c-default.jpg", award: false },
  { id: 168, title: "“Green construction roads” Soil protection during construction", url: "https://renewables-grid.eu/database/green-construction-roads/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Germany", org: "Amprion", desc: "Amprion constructed 43km of underground cable for the German section of the first power bridge between Germany and Belgium: the ALEGrO project. To reduce the project’s invasiveness, Amprion created a comprehensive soil management plan and was the first to utilise the innovative “Green construction road” concept on a large scale project. Objectives 01 Development of […]", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_Amprion_GreenConstructionRoads1-644x398-c-default.jpg", award: false },
  { id: 169, title: "Alerta Tendidos", url: "https://renewables-grid.eu/database/alerta-tendidos/", brand: "RGI", dim: "Nature, People", topic: "Bird Protection", inf: "Grids", year: 2019, country: "Spain", org: "Foundation “Friends of the Iberian Imperial Eagle, Iberian Linx and Private Natural Areas”", desc: "The project “Alerta Tendidos” which means “Powerlines Alert”, consists of the development, dissemination and improvement of a free user-friendly mobile application to engage citizens in the identification of potentially dangerous power lines for birds of prey, specifically for the endangered Iberian Imperial Eagle. Highlights 01 An easy-to-use mobile application allows for engagement of civil society, […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Foundation-22Friends-of-the-Iberian-Imperial-Eagle-Iberian-Linx-and-Private-Natural-Areas22_AlertaTendidos1-644x398-c-default.jpg", award: false },
  { id: 170, title: "Alternative Insulation System for Switchgears", url: "https://renewables-grid.eu/database/alternative-insulation-system/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2019, country: "Germany", org: "Nuventura", desc: "Nuventura develops environmentally-friendly medium voltage (MV) gas insulated switchgear (GIS) – key hardware components found throughout electrical grids and energy infrastructure. Existing GIS technologies use Sulphur Hexafluoride (SF6) – the most potent greenhouse gas (GHG) humanity knows – as their insulating medium. Nuventura replaces SF6 with dry air, thereby helping to tackle global greenhouse gas […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_Nuventura_AlternativeInsulationSystemforSwitchgears1-644x398-c-default.jpg", award: false },
  { id: 171, title: "Development of a MOOC on power frequency electromagnetic fields", url: "https://renewables-grid.eu/database/mooc-on-power-frequency/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2019, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE France developed a Massive Open Online Course (MOOC) on electromagnetic fields (EMF) caused by power frequency, giving everybody free access to inform themselves about the much debated topic. The MOOC includes information material, videos and a discussion forum. Highlights 01 The platform aims at opening up educational content to as many people as possible without constraints and […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_RTE_Mooc3-644x398-c-default.png", award: false },
  { id: 172, title: "GRIDSOL: Smart Renewable Hubs for flexible generation", url: "https://renewables-grid.eu/database/gridsol/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2019, country: "", org: "Cobra Instalaciones y Servicios S.A.", desc: "“Smart Renewable Hubs” combine primary Renewable Energy Sources (RES) and storage technologies under an advanced control system that dispatches the electricity on a single output according to the availability and cost-effectiveness of each technology. Highlights 01 Takes into account the local specificities in deciding which technologies work best to optimise power generation 02 Evaluation of […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_CobraGroup_GRIDSOL2-644x398-c-default.jpg", award: false },
  { id: 173, title: "Nemo link cable road project", url: "https://renewables-grid.eu/database/nemo-link/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2019, country: "Belgium", org: "Elia", desc: "Nemo Link is an electrical subsea interconnector between the UK and Belgium. During its planning and construction phase many new environmentally friendly approaches were taken to keep the environmental impact of Nemo Link as small as possible. Highlights 01 Nemo Link was successfully routed around environmentally sensitive areas. 02 Elia conducted comprehensive studies to be […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_Elia_NemoLink2-644x398-c-default.jpg", award: false },
  { id: 174, title: "Networks Renewed", url: "https://renewables-grid.eu/database/networks-renewed/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Solar", year: 2019, country: "Australia", org: "Institute for Sustainable Futures (ISF),", desc: "Networks Renewed was a $5 million (AUD) trial that aimed to prove that rooftop solar could be an asset, not a problem, for the electricity grid. The trial investigated non-network alternatives for providing voltage support using smart inverters connected to solar PV and battery storage. The project proved that smart inverters have the capability to […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_UTS_NetworksRenewed1-644x398-c-default.jpg", award: false },
  { id: 175, title: "Open Innovation Challenge", url: "https://renewables-grid.eu/database/open-innovation-challenge/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2019, country: "Belgium", org: "Elia", desc: "The Open Innovation Challenge (OIC) is an annual competition for start-ups organised by Elia Group. Successful applicants receive funding from Elia Group while the company can leverage ideas that help them improve the operation of their teams and change the internal culture of the company, making it more agile and innovative. Highlights 01 The OIC […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Elia_OpenInnovationChallenge1-644x398-c-default.jpg", award: false },
  { id: 176, title: "Planning Dialogue Borgholzhausen", url: "https://renewables-grid.eu/database/planning-dialogue-borgholzhausen/", brand: "RGI", dim: "People, Planning", topic: "Spatial & Strategic Planning", inf: "Energy system", year: 2019, country: "Germany", org: "Amprion", desc: "The planning dialogue Borgholzhausen is a special form of public participation in the planning of a high voltage underground line. The planning dialogue comprises two formats: public citizen information markets and a non-public stakeholder planning committee. The dialogue was restarted after a deadlock and successfully managed to transform into an inclusive practice. Highlights 01 Restart […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Amprion_PlanningDialogeBorgholzhausen1-644x398-c-default.jpg", award: false },
  { id: 177, title: "REN Biodiversity Chair", url: "https://renewables-grid.eu/database/ren-biodiversity-chair/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2019, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "Portuguese TSO REN is engaged in the ‘Invited Research Chairs’ programme run by the Portuguese Foundation for Science and Technology (FCT) and created a Research Chair at the Research Centre on Biodiversity and Genetic Resources (CIBIO), University of Porto. The research team focuses on assessing the impacts of power lines on biodiversity. Highlights 01 The […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_REN_BiodiversityChair1-644x398-c-default.jpg", award: false },
  { id: 178, title: "Sinus Mowing Methods in Netherlands and Germany", url: "https://renewables-grid.eu/database/sinus-mowing-methods/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2019, country: "Germany", org: "TenneT", desc: "TenneT, a transmission system operator in the Netherlands and in parts of Germany has collaborated with De Vlinderstichting (Dutch Butterfly Conservation) to convert voltage substations into suitable habitats for butterflies and invertebrates. Their pilot project in Netherlands uses the innovative method of sinus mowing, where grass is cut in phases and some parts are left uncut. Through […]", img: "https://renewables-grid.eu/app/uploads/2025/09/2019_Database_Tennet_SinusMowing1-644x398-c-default.png", award: false },
  { id: 179, title: "Underground Cable Information Center", url: "https://renewables-grid.eu/database/underground-cable-center/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2019, country: "Germany", org: "TenneT", desc: "This practice revolves around a pilot underground cable information centre called “Voltage under the Earth“, designed and built next to a TenneT cable construction site, to inform about the technology and increase local and regional acceptance. Highlights 01 “Voltage under the Earth” is a permanent offer of a mix of information, touchable technology and a look “behind […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Tennet_UndergroundCableInformationCenter1-644x398-c-default.jpg", award: false },
  { id: 180, title: "3D Decision Support System (3D DSS) for planning power lines", url: "https://renewables-grid.eu/database/3d-support-system/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Grids", year: 2018, country: "Switzerland", org: "Swissgrid & ETH Zurich", desc: "The 3D DSS considers the interests of different stakeholders and supports decision-makers in finding a consensus solution for determining the optimal route for a new power transmission line. This can increase support of affected citizens and shortens the time needed for the approval procedure, which in turn, accelerates the grid modernisation required for the European energy transition.", img: "https://renewables-grid.eu/fileadmin/_processed_/d/a/csm_Plattform_180131_3_copy_2377b613f1.png", award: false },
  { id: 181, title: "CECOVEL (Electric Vehicle Control Centre)", url: "https://renewables-grid.eu/database/cecovel/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Spain", org: "Red Eléctrica de España", desc: "", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_REE_CECOVEL1-644x398-c-default.png", award: false },
  { id: 182, title: "CompactLine", url: "https://renewables-grid.eu/database/compactline/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Germany", org: "50Hertz", desc: "", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_50Hertz_CompactLine1-644x398-c-default.png", award: false },
  { id: 183, title: "District energy efficient retrofitting", url: "https://renewables-grid.eu/database/efficient-retrofitting/", brand: "RGI", dim: "People", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Spain", org: "CARTIF", desc: "", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_Cartiff_Retrofitting1-644x398-c-default.png", award: false },
  { id: 184, title: "DS3 System Services", url: "https://renewables-grid.eu/database/ds3-system-services/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Ireland", org: "EirGrid", desc: "", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_EirGrid_DS31-644x398-c-default.png", award: false },
  { id: 185, title: "Dynamic Line Rating (DLR)", url: "https://renewables-grid.eu/database/dlr/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Belgium", org: "Ampacimon", desc: "Demonstration of Ampacimon’s suite of products on Elia’s interconnectors, assessing the thermal rating of transmission lines by direct physical measurements and increasing their available capacity. Highlights 01 Extracting more value from existing grid infrastructure and enhancing their utilisation 02 Foreseeing congestion issues and addressing them through low cost configuration options – as opposed to construction […]", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_Ampacimon_DLR1-644x398-c-default.png", award: false },
  { id: 186, title: "Dynamic Line Rating demonstration on interconnectors", url: "https://renewables-grid.eu/activities/best-practices/database.html?detail=198", brand: "RGI", dim: "Technology", topic: "", inf: "Energy system", year: 2018, country: "", org: "Ampacimon", desc: "", img: "", award: false },
  { id: 187, title: "eGreen Community Solar Project", url: "https://renewables-grid.eu/database/egreen/", brand: "RGI", dim: "People, Technology", topic: "Public Acceptance & Engagement, Circularity & Supply Chains", inf: "Grids", year: 2018, country: "United States", org: "Citizens Energy Corporation", desc: "In California, the Citizens Energy Corporation, under the leadership of former Congressman Joseph P. Kennedy II, has developed a unique model to reduce electricity bills for low-income households to a cost of 2 cents per kilowatt-hour, using profits from a commercial transmission line. The model includes a partnership with the local utility to integrate more renewables into the grid while cutting down on fossil-fuel emissions and help those that are less fortunate.", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_CEC_eGreen2-644x398-c-default.jpg", award: false },
  { id: 188, title: "ElectriCITY – an Educational Package for Schools", url: "https://renewables-grid.eu/database/electricity/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2018, country: "Belgium", org: "Elia in cooperation with Flemish DSOs", desc: "ElectriCITY is a school package designed by Belgian TSO, Elia to educate primary and secondary students on the importance of the energy transition.", img: "https://renewables-grid.eu/fileadmin/_processed_/7/f/csm_Elia_2__e32d579e71.png", award: false },
  { id: 189, title: "EntreREDes an Educational Game for Schools", url: "https://renewables-grid.eu/database/entreredes/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2018, country: "Spain", org: "REE – Red Eléctrica de España", desc: "EntreREDes (Education from Childhood Towards a Sustainable Energy Model and Responsible Consumption) is a digital education platform which acts as a question and answer game that allows children to work out concepts related to the function, needs and challenges of the energy system in a playful and entertaining manner. Highlights 01 The game has over […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2018_database_REE_entreredes_2-644x398-c-default.jpg", award: false },
  { id: 190, title: "Implementation of a Comprehensive Green-Area-Concept", url: "https://renewables-grid.eu/database/green-area-concept/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2018, country: "Germany", org: "Amprion", desc: "", img: "https://renewables-grid.eu/fileadmin/user_upload/Screen_Shot_2018-05-02_at_11.34.55.png, https://renewables-grid.eu/fileadmin/user_upload/Screen_Shot_2018-05-02_at_11.34.39.png", award: false },
  { id: 191, title: "Integrated Vegetation Management with a team of Biologists", url: "https://renewables-grid.eu/database/integrated-vegetation-vsd/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2018, country: "Slovakia", org: "VSD", desc: "", img: "https://renewables-grid.eu/fileadmin/_processed_/a/4/csm_image_32_8da623c77b.png,https://renewables-grid.eu/fileadmin/user_upload/Nature/image_38.png", award: false },
  { id: 192, title: "MIGRATE TSO research project", url: "https://renewables-grid.eu/database/migrate/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "", org: "Project consortium", desc: "", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_ProjectConsortium_MIGRATE1-644x398-c-default.png", award: false },
  { id: 193, title: "Natural High-Tech: The Great Scallop as an Environmental Sensor", url: "https://renewables-grid.eu/database/natural-high-tech/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2018, country: "France", org: "RTE, TBM Environment", desc: "", img: "https://renewables-grid.eu/fileadmin/user_upload/Screen_Shot_2018-05-02_at_13.00.15.png\nhttps://renewables-grid.eu/fileadmin/_processed_/c/5/csm_Screen_Shot_2018-05-02_at_12.16.46_bef7efea35.\nhttps://renewables-grid.eu/fileadmin/_processed_/7/b/csm_Screen_Shot_2019-06-13_at_10.43.57_01_7fa5703c7c.png", award: false },
  { id: 194, title: "Nobel Grid End User Engagement Strategy", url: "https://renewables-grid.eu/database/nobel-grid/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2018, country: "", org: "Carbon Co-op", desc: "A comprehensive end user engagement strategy with a variety of different engagement tools empowering consumers and putting them at the centre of the Nobel Grid project.", img: "https://renewables-grid.eu/fileadmin/_processed_/8/4/csm_Carbon_coopenergize-stand6_preview_copy_dd9c0ff705.jpeg", award: false },
  { id: 195, title: "Plataforma Tejo investment platform", url: "https://renewables-grid.eu/database/plataforma-tejo/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2018, country: "Portugal", org: "MédioTejo21", desc: "Plataforma Tejo is an investment mechanism used to facilitate sustainability projects in the Médio Tejo region in Portugal. The programme works as a tool to pair investors with investment opportunities in the renewable energy sector, while creating relationships between citizens and promoting the development of the region with respect to sustainability and renewable energy.", img: "https://renewables-grid.eu/fileadmin/_processed_/6/0/csm_DSCF8264_copy_250a6fc78b.jpg", award: false },
  { id: 196, title: "Smart Island Giglio Archipelago", url: "https://renewables-grid.eu/database/smart-island/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Solar", year: 2018, country: "Italy", org: "Terna", desc: "Redevelopment of a landfill into a green area for renewable energy power production on Giannutri Island in Italy. Highlights 01 Creation of photovoltaic fields to reduce the impact of humans on the island and reduce the dependence on diesel fuel 02 Implementation of an automatic cover system in order to eliminate solar reflective glare in […]", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_Terna_SmartIsland1-644x398-c-default.jpg", award: false },
  { id: 197, title: "SmartNet TSO-DSO coordination", url: "https://renewables-grid.eu/database/smartnet/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Italy", org: "Project consortium", desc: "A simulation platform to compare TSO-DSO coordination schemes that enables the participation of distribution network resources to ancillary services markets plus three technological pilots experimenting concrete technical solutions to enable ancillary services provision from distribution networks. Highlights 01 Development of a simulation platform with 2030 scenarios for Italy, Denmark and Spain 02 Cost-Benefit Assessment (CBA) […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_SmartNet1-644x398-c-default.png", award: false },
  { id: 198, title: "Enhancing infrastructure resilience against wildfires and extreme storms in Portugal", url: "https://renewables-grid.eu/database/enhancing-infrastructure-resilience/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2017, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "REN, the Portuguese Transmission System Operator (TSO), developed a set of monitoring instruments tailored to different climate hazards, such as wildfires, storms and extreme temperature before and during these events occur. Managing of these events is backed by smart (artificial intelligence – AI) decision support system. Nature-based and community-oriented solutions are implemented to prevent future […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2017_REN_Picture-644x398-c-default.png", award: false },
  { id: 199, title: "Greenconnector – low impact high voltage underground cable systems", url: "https://renewables-grid.eu/database/greenconnector/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2017, country: "Italy", org: "Greenconnector", desc: "Worldenergy is developing the Greenconnector, an underground HVDC cross-border interconnector between Italy (Lombardy) and Switzerland (Graubünden). By reusing existing infrastructure, including an out-of-service oil pipeline and lakebed cable laying, the project aims to expand renewable electricity exchange across the Alps while reducing environmental impacts.", img: "https://renewables-grid.eu/fileadmin/_processed_/c/1/csm_Screen_Shot_2019-06-06_at_16.34.05_0fdca018cd.png", award: false },
  { id: 200, title: "Innovative Public Participation for SuedLink", url: "https://renewables-grid.eu/database/innovative-public-participation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2017, country: "Germany", org: "TransnetBW; TenneT", desc: "Innovative and transparent public participation in Germany’s central electricity grid project, SuedLink. The process, which was co-developed with local governments and other stakeholders, included various engagement formats, such as an online platform and info as well as landowner forums.", img: "https://renewables-grid.eu/fileadmin/_processed_/5/d/csm_SuedLink_Online_Participation_Platform_1_copy_7690c249b1.jpg", award: false },
  { id: 201, title: "PCI permitting one stop shop for Vikinglink interconnector", url: "https://renewables-grid.eu/database/one-stop-shop/", brand: "RGI", dim: "Planning, People", topic: "Grid Development Planning, Public Acceptance & Engagement", inf: "Grids", year: 2017, country: "United Kingdom", org: "National Grid Viking Link Limited & Energinet.dk", desc: "National Grid Viking Link Limited and Energinet.dk are developing a cross-border interconnector (Viking Link) between UK and Denmark. It is one of the most multi-jurisdictional infrastructure projects in Europe to fully apply the “one stop shop”, a permitting and participation approach introduced in the European Commission's TEN-E regulation.", img: "https://renewables-grid.eu/fileadmin/_processed_/c/e/csm_NG2_24606c5976.png", award: false },
  { id: 202, title: "Radar monitoring on the Strait of Messina", url: "https://renewables-grid.eu/database/radar-monitoring/", brand: "RGI", dim: "Nature", topic: "Bird Protection, Monitoring & Reporting", inf: "Energy system", year: 2017, country: "Italy", org: "Terna", desc: "Italian TSO Terna monitors migratory birdlife between the region of Calabria and the island of Sicily in order to assess the impact of a new overhead line (OHL). Two radars were used to collect scientific and measured evidence of the number of birds passing the corridor line, their migratory routes and their flying height.", img: "https://renewables-grid.eu/fileadmin/_processed_/f/4/csm_DSCF8298_683086555c.jpg", award: false },
  { id: 203, title: "Regulation on Cost Benefit Analysis (CBA) methodology for the Italian transmission network development plan", url: "https://renewables-grid.eu/database/regulation-on-cba/", brand: "RGI", dim: "Planning, People", topic: "Grid Development Planning, Creating Awareness & Capacity Building", inf: "Grids", year: 2017, country: "Italy", org: "Italian Regulatory Authority for Energy and Water (AEEGSI)", desc: "AEEGSI conducted a series of public consultations and workshops leading to an improved CBA for new grid infrastructure projects. It became a national regulation and was already applied to Italy’s Network Development Plan (NDP) in 2017.", img: "https://renewables-grid.eu/fileadmin/_processed_/f/b/csm_Picture1_29724da275.png", award: false },
  { id: 204, title: "Strengthening energy infrastructure against weather hazards in Finland", url: "https://renewables-grid.eu/database/strengthening-energy-infrastructure/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2017, country: "Finland", org: "Elenia", desc: "Elenia, an electricity distributor in Finland, is replacing overhead power lines with underground cables. This transition aims to reduce potential risk for power outages caused by storms, heavy snow and other climate-related hazards. The goal is to make the electricity network more stable and better prepared for increasing frequency of extreme weather events. Highlights 01 […]", img: "https://renewables-grid.eu/app/uploads/2025/12/2017_Elenia_Picture2-644x398-c-default.jpg", award: false },
  { id: 205, title: "WiseGRID – Wide scale demonstration of integrated solutions and business models for the European smart grid", url: "https://renewables-grid.eu/database/wisegrid/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2017, country: "Spain", org: "ETRA I+D", desc: "The WiseGRID project provides a set of solutions, technologies and business models which increase the smartness, stability and security of an open, consumer-centric European energy grid and provide cleaner and more affordable energy for European citizens, through an enhanced use of storage technologies and electromobility and a highly increased share of RES. It aims to […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2017_Database_Etra_WiseGRID-644x398-c-default.png", award: false },
  { id: 206, title: "Animated video Clean Energy Mini-Grid", url: "https://renewables-grid.eu/database/animated-video/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2016, country: "Mozambique", org: "EDP Networks", desc: "Portuguese utilities company, EDP developed an animated video called “Clean Energy Mini-Grid”, which visualises the implementation of electricity production from biomass in a remote village in Mozambique. Objectives 01 Communicate clearly and effectively to both the local population, including illiterate citizens, and to other stakeholders about the Clean Energy Mini-Grid project 02 Attract funding for the Mini-Grid […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_EDP_AnimatedVideo-644x398-c-default.png", award: false },
  { id: 207, title: "Close and personal dialogue: development of a Mobile Citizen’s Office for public participation", url: "https://renewables-grid.eu/database/close-personal-dialogue/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2016, country: "Germany", org: "50Hertz", desc: "German TSO 50Hertz developed a Mobile Citizen’s Office (DialogMobil), intended for public participation and communication purposes. Through the DialogMobil, 50Hertz informs and engages with residents in a direct conversation on the energy transition and planned grid development activities. Highlights 01 Accessing local knowledge and gathering relevant information early via direct contact between locals and […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_50Hertz_Closeandpersonaldialogue1-644x398-c-default.png", award: false },
  { id: 208, title: "Close to the citizen, close to home, on an equal footing", url: "https://renewables-grid.eu/database/close-to-citizen/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Germany", org: "Schleswig‑Holstein Ministry of Energy, Agriculture, the Environment and Rural Areas; TenneT", desc: "The government of the German state of Schleswig-Holstein, the TSO TenneT and the local districts of Dithmarschen and Nordfriesland developed an informal dialogue procedure for a new transmission line along Northern Germany’s West coast, which was implemented in close cooperation in 2013. Corridor options and technology alternatives were discussed with local citizens, municipalities and associations before the permission phase of the project and as a sort of substitute for the formal spatial planning procedure.", img: "https://renewables-grid.eu/fileadmin/_processed_/7/9/csm_Picture1_02_20468e8222.png", award: false },
  { id: 209, title: "Communication and Participation Concept", url: "https://renewables-grid.eu/database/communication-and-participation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Germany", org: "Amprion", desc: "Amprion developed a comprehensive communication approach for the routing of the interconnector project “ALEGrO” linking Belgium and Germany, aiming to inform and involve the public early, gather valuable feedback, adapt routing accordingly, and increase acceptance of the interconnector route.", img: "https://renewables-grid.eu/fileadmin/_processed_/d/4/csm_Screen_Shot_2019-06-06_at_17.33.25_2ccb58761c.png", award: false },
  { id: 210, title: "Early involvement of landowners", url: "https://renewables-grid.eu/database/involvement-of-landowners/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Denmark", org: "Energinet.dk", desc: "Danish TSO Energinet applied a communication methodology to involve landowners affected by a 150 kV cable project in the early planning stages – before and during the authority permitting procedures. The approach aimed to integrate local knowledge, increase transparency, and give landowners the possibility to influence the project.", img: "https://renewables-grid.eu/fileadmin/_processed_/5/9/csm_Screen_Shot_2019-06-06_at_17.23.03_174ab1dbf0.png", award: false },
  { id: 211, title: "Educational Material on History of Electricity", url: "https://renewables-grid.eu/database/educational-material/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2016, country: "Lithuania", org: "LitGrid", desc: "Litgrid, the Lithuanian transmission operator, created an educational website to explain the history of electricity in Lithuania and the functioning of the national grid to the general public. The website increases understanding of electricity production, delivery, and grid management, inspiring interest in electrical engineering.", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_LitGrid_EduMaterial2-644x398-c-default.jpg", award: false },
  { id: 212, title: "EirGrid Community Support Fund", url: "https://renewables-grid.eu/database/eirgrid-community-support-fund/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Ireland", org: "EirGrid", desc: "EirGrid developed a Community Support Fund in order to provide compensation to local communities who are located closest to new transmission infrastructure. The fund recognises the importance of local communities and voluntary organisations aiming to address issues that those particular communities are facing and provides them with compensation in the form of grants.", img: "https://renewables-grid.eu/fileadmin/_processed_/3/0/csm_Launch_of_EirGrid_Community_Fund_Initiative_May_2016_06b97d2ce1.jpg", award: false },
  { id: 213, title: "ID4AL Project: Hierarchical and distributed automation for medium voltage (MV) and low voltage (LV) grids", url: "https://renewables-grid.eu/database/id4al/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2016, country: "Finland", org: "IDE4L", desc: "The EU-funded IDE4L project demonstrated a system of distribution network automation, IT systems, and functions enabling active network management. The distributed decision-making architecture improves real-time monitoring and controllability of MV and LV grids, efficiently integrating renewable energy and new loads without compromising reliability.", img: "https://renewables-grid.eu/fileadmin/_processed_/8/c/csm_Picture1_05_9362e8ffa9.png", award: false },
  { id: 214, title: "MARES Real Time Automatic Control for PSH in Small Isolated Systems", url: "https://renewables-grid.eu/database/mares/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Spain", org: "Red Eléctrica de España", desc: "Red Eléctrica de España (REE)’s real-time monitoring tool MARES enables safe, high-level renewable energy integration on the island of El Hierro. Designed for isolated grids, MARES helps balance wind energy and pumped hydro storage, reducing diesel dependency and ensuring grid stability.", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_REE_MARES3-644x398-c-default.jpg", award: false },
  { id: 215, title: "Objective Osprey", url: "https://renewables-grid.eu/database/objective-osprey/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2016, country: "France", org: "RTE", desc: "Launched in 2016 during RTE’s Nature Festival, the Objective Osprey project brings together ONF, Loiret Nature Environnement, RTE and the City of Orléans. It aims to preserve and improve knowledge of the osprey, a rare and vulnerable bird of prey in France, through cameras, observatories, research and public awareness.", img: "https://renewables-grid.eu/fileadmin/_processed_/9/7/csm_Screen_Shot_2019-06-06_at_17.11.25_0b890523b9.png", award: false },
  { id: 216, title: "PAS System for Bird-Friendly Grid", url: "https://renewables-grid.eu/activities/best-practices/database.html?detail=158", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2016, country: "", org: "EVN", desc: "EVN Bulgaria implemented bird-friendly power lines by insulating grid components and adding protective elements to overhead lines. The practice, part of the EU-funded Life for Safe Grid project, prevents electrocution and collisions of the Imperial Eagle and other bird species, while also enhancing grid security and reducing electricity supply disruptions.", img: "https://renewables-grid.eu/fileadmin/_processed_/4/4/csm_Screen_Shot_2019-06-06_at_17.14.45_99d4e286a6.png", award: false },
  { id: 217, title: "Promotion of biogas systems in rural Kenya", url: "https://renewables-grid.eu/database/biogas-systems/", brand: "RGI", dim: "People", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Kenya", org: "Namalere Forest Conservation Group", desc: "The Namalere Forest Conservation Group (NFCYG) promotes off-grid solutions combined with biogas as an alternative source of energy in Kenya to improve social welfare. This includes better living conditions and health for inhabitants, environmental protection, and sustainability through an efficient and cost-saving approach.", img: "https://renewables-grid.eu/fileadmin/_processed_/9/4/csm_Screen_Shot_2019-06-13_at_12.02.28_c3b4eb6575.png", award: false },
  { id: 218, title: "Public Consultation Your Grid, Your Views, Your Tomorrow", url: "https://renewables-grid.eu/database/public-consultation/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2016, country: "Ireland", org: "EirGrid", desc: "EirGrid carried out a national public consultation on its strategy to develop Ireland’s grid in the future. Entitled “Your Grid, Your Views, Your Tomorrow”, this engagement initiative was the first of its kind, with an emphasis on the citizen’s role in how Ireland’s grid is developed. The initiative was welcomed by the Irish government. Objectives 01 Enhancing public […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_EirGrid_PublicConsultation-644x398-c-default.png", award: false },
  { id: 219, title: "PV energy data service", url: "https://renewables-grid.eu/database/pv-energy-data/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2016, country: "Germany", org: "SMA Solar Technology & TenneT", desc: "SMA Solar Technology AG uses near-time data from small and medium-sized photovoltaic (PV) systems in the TenneT grid area to create precise, geographically detailed PV generation extrapolations and forecasts. This practice helps make solar energy more predictable, reducing the need for expensive control reserves and supporting grid reliability.", img: "https://renewables-grid.eu/fileadmin/_processed_/2/3/csm_Screen_Shot_2019-06-06_at_16.59.53_57536b0505.png", award: false },
  { id: 220, title: "Real-time technology for the effective integration of distributed energy resources", url: "https://renewables-grid.eu/database/real-time-technology/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Switzerland", org: "Alpiq", desc: "Alpiq developed a real-time data-to-decision platform that offers products and services to its customers and partners for all aspects around energy and flexibility markets. The self-learning algorithms deployed in the cloud platform catalyse the effective integration of Distributed Energy Resources (DER) through the optimal dispatch of flexible generation and load.", img: "https://renewables-grid.eu/fileadmin/_processed_/8/5/csm_Screen_Shot_2019-06-06_at_16.13.08_99cbb32681.png", award: false },
  { id: 221, title: "Recovery of Posidonia Oceanica seagrass meadows", url: "https://renewables-grid.eu/database/recovery-of-posidonia-oceanica-seagrass-meadows/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2016, country: "Spain", org: "Red Eléctrica", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2022-01-04_at_17-compressed-644x398-c-default.jpg", award: true },
  { id: 222, title: "Tests to prove reliability of large-scale solar PV", url: "https://renewables-grid.eu/database/reliability-large-scale-solar-pv/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2016, country: "United States", org: "California ISO, First Solar, National Renewable Energy Laboratory (NREL)", desc: "California ISO - CAISO, the US National Renewable Energy Laboratory - NREL and solar PV solutions company, First Solar demonstrated how large-scale solar resources can provide essential reliability services to the grid, which have traditionally been offered by conventional power plants. A series of technical tests conducted on a 300 MW PV plant showcased the role of advanced controls in leveraging the solar energy’s value and contributing to grid stability.", img: "https://renewables-grid.eu/fileadmin/_processed_/7/2/csm_Screen_Shot_2019-06-13_at_11.27.52_fc26f75164.png", award: false },
  { id: 223, title: "Underground high voltage cables (UGCs) – Environmental research and on-site development of innovative solutions", url: "https://renewables-grid.eu/database/underground-high-voltage-cables/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2016, country: "Germany", org: "Amprion", desc: "Amprion has been conducting a long-term ecological research programme in rural areas, consisting of 20 years of field experiments, and of validation of experimental findings through monitoring of an UGC project in Germany. Through this project, Amprion aims to increase the understanding of UGCs’ thermal and hydrological impact on the soil, and of any resulting […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_Amprion_UGCs1-644x398-c-default.png", award: false },
  { id: 224, title: "Virtual Power Plant Next Pool", url: "https://renewables-grid.eu/database/virtual-power-plant/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Germany", org: "Next Kraftwerke", desc: "Next Kraftwerke developed a Virtual Power Plant (VPP) that uses cloud-computing technology to integrate the flexibility of both power producers and consumers, particularly decentralised renewable energy plants. By aggregating their output, the VPP can provide control reserve to balance fluctuations in the electricity grid.", img: "https://renewables-grid.eu/fileadmin/_processed_/1/2/csm_Screen_Shot_2019-06-06_at_16.52.00_9c41d58d3f.png", award: false },
  { id: 225, title: "VVMplus Research Project", url: "https://renewables-grid.eu/database/vvmplus-research-project/", brand: "RGI", dim: "People, Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2016, country: "Denmark", org: "The Danish Centre for Environmental Assessment at Aalborg University", desc: "The project aims to increase social acceptance of renewable energy projects through improvements in the Environmental Impact Assessment (EIA) process by enabling dialogue and including communities in the process.", img: "https://renewables-grid.eu/fileadmin/_processed_/6/5/csm_Screen_Shot_2018-03-21_at_17.21.23_5799479ccd.png", award: false },
  { id: 226, title: "Animated videos for grid expansion", url: "https://renewables-grid.eu/database/animated-videos/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2015, country: "Germany", org: "BNetzA", desc: "The Bundesnetzagentur developed animated online videos to provide the public with accessible, comprehensive, and reliable information about the five steps in Germany’s complex legislative procedure for grid expansion.", img: "https://renewables-grid.eu/fileadmin/_processed_/5/9/csm_Screen_Shot_2019-06-11_at_15.52.38_b109dd36dc.png", award: false },
  { id: 227, title: "Application éCO2mix", url: "https://renewables-grid.eu/database/eco2mix/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2015, country: "France", org: "RTE", desc: "éCO2mix is a public online application developed by RTE to provide transparent, real-time electricity data in France. It helps users of all backgrounds understand the power system, track renewable integration, and monitor consumption, production, and emissions.", img: "https://renewables-grid.eu/fileadmin/user_upload/Screen_Shot_2019-06-13_at_12.09.21.png", award: false },
  { id: 228, title: "BALANCE – Power grid game application", url: "https://renewables-grid.eu/database/balance/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2015, country: "Norway", org: "Statnett", desc: "Statnett developed a gaming app for mobile devices dealing with the topic of grid expansion in order to increase knowledge of and interest in energy, electricity, the power system, the green electric future and related topics among the general public and stakeholders.", img: "https://renewables-grid.eu/fileadmin/_processed_/2/5/csm_1400_Statnett_Balanse_Trailer_v13_Film1_YouTube-_0_0001_Layer-11_fb557474ca.png", award: false },
  { id: 229, title: "Birds and electricity transmission lines: mapping of flight paths", url: "https://renewables-grid.eu/database/mapping-of-flight-paths/", brand: "RGI", dim: "Nature", topic: "Bird Protection, Monitoring & Reporting", inf: "Grids", year: 2015, country: "Spain", org: "Red Eléctrica de España", desc: "Red Eléctrica de España (REE) is developing a GIS-based tool to integrate bird flight path data across Spain. This enables planning and construction of power lines with minimal environmental impact and prioritises mitigation actions on existing lines to protect endangered species.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_REE_MappingFlightPath2-644x398-c-default.jpg", award: false },
  { id: 230, title: "DS3 Advisory Council", url: "https://renewables-grid.eu/database/ds3-advisory-council/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2015, country: "Ireland", org: "EirGrid", desc: "Eirgrid‘s DS3 Advisory Council was established in 2011 to provide a forum to discuss the views and concerns of the DS3 Programme’s wide range of stakeholders on issues which impact on the successful implementation of the programme (DS3 = “Delivering a Secure, Sustainable Electricity System”).2014 Objectives 01 Discuss, review and ultimately help facilitate the progress of the […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_EirGrid_DS3_1-644x398-c-default.jpg", award: false },
  { id: 231, title: "East Iceland Clean Energy Connections", url: "https://renewables-grid.eu/database/clean-energy-connections/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2015, country: "Iceland", org: "Landsnet", desc: "Landsnet applied load control schemes to the existing grid infrastructure in order to connect fish factories in East Iceland to the main grid using synchronised real-time measurements. This connection enabled the factories to replace crude oil for their energy consumption needs with renewable-sourced electricity from the main grid.", img: "https://renewables-grid.eu/fileadmin/_processed_/2/4/csm_Landsnet2_7885e8d3b3.png", award: false },
  { id: 232, title: "Empowerment of citizens via crowd funding", url: "https://renewables-grid.eu/database/empowerment-via-crowd-funding/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2015, country: "France", org: "RTE", desc: "RTE uses crowdfunding to enhance public acceptability of new power lines. Through the My territorial projects platform, local initiatives receive co-funding from citizens, RTE, and the PAP (Plan d’Accompagnement de Projet), fostering sustainable development in communities affected by grid projects.", img: "https://renewables-grid.eu/fileadmin/_processed_/3/8/csm_Screen_Shot_2019-06-06_at_17.29.44_dd476a1722.png", award: false },
  { id: 233, title: "EnergizAIR", url: "https://renewables-grid.eu/database/energizair/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2015, country: "Belgium", org: "APERe", desc: "EnergizAIR is an international initiative providing easy-to-understand indicators that show the current capacity for renewable energy production across Europe.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_APERe_EnergizAIR2-644x398-c-default.jpg", award: false },
  { id: 234, title: "Green Corridors – Restoration of wildlife corridors under overhead lines in Belgium and France", url: "https://renewables-grid.eu/database/green-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2015, country: "Belgium", org: "LIFE Elia-RTE; Elia; RTE; Ecofirst", desc: "LIFE Elia-RTE was a 2011–2017 project combining grid safety with biodiversity-friendly vegetation management under high-voltage lines in Belgium and France. By creating green corridors through a multi-partner approach, it enhanced biodiversity, improved public perception, and proved more cost-effective than conventional vegetation management.", img: "https://renewables-grid.eu/fileadmin/user_upload/2_01.png", award: false },
  { id: 235, title: "HV Voltage Source Converter for Skagerrak 4 Interconnector", url: "https://renewables-grid.eu/database/converter-for-skagerrak/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2015, country: "Denmark", org: "Statnett", desc: "Skagerrak 4 is a subsea interconnector between Norway and Denmark using Voltage Source Converter (VSC) technology to strengthen grid stability, enable black-start capability, reduce harmonic distortion, and integrate wind and hydro generation while enhancing electricity supply security.", img: "https://renewables-grid.eu/fileadmin/_processed_/f/2/csm_Screen_Shot_2019-06-11_at_15.35.37_01_2fd3cdd72f.png", award: false },
  { id: 236, title: "Joint public power line planning", url: "https://renewables-grid.eu/database/joint-power-line/", brand: "RGI", dim: "Planning, People", topic: "Grid Development Planning, Public Acceptance & Engagement", inf: "Grids", year: 2015, country: "Germany", org: "TenneT; Küstenwelten Institute (KWI)", desc: "TenneT, in cooperation with KWI (Institute for Advanced Study in the Humanities, Essen), developed and implemented a new set of participation concepts to enhance early citizen involvement in grid expansion planning. The approach aimed to identify route corridors together with citizens, ensure transparency and accountability, and integrate local knowledge into the official planning process.", img: "https://renewables-grid.eu/fileadmin/_processed_/1/c/csm_Screen_Shot_2019-06-11_at_15.58.02_3730bf25de.png", award: false },
  { id: 237, title: "Man-made nest programme", url: "https://renewables-grid.eu/database/nest-programme/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2015, country: "Hungary", org: "Mavir", desc: "MAVIR installed and monitored man-made nests on power pylons to protect the endangered Saker Falcon, reducing mortality and power interruptions.", img: "https://renewables-grid.eu/fileadmin/user_upload/Screen_Shot_2019-06-11_at_15.43.33_01.png", award: false },
  { id: 238, title: "Minimise cable impact on marine ecosystem", url: "https://renewables-grid.eu/database/minimise-cable-impact/", brand: "RGI", dim: "Nature", topic: "Offshore Energy & Nature", inf: "Grids", year: 2015, country: "Italy", org: "Terna", desc: "Terna developed an innovative methodology for laying submarine cables that minimizes environmental impacts and protects sensitive habitats such as the endangered seagrass Posidonia oceanica. Applied to the Malta–Sicily interconnector, this practice ensures sustainable construction while supporting renewable energy integration in Malta’s electricity system.", img: "https://renewables-grid.eu/fileadmin/_processed_/c/a/csm_Screen_Shot_2019-06-06_at_17.05.24_bc49c28727.png", award: false },
  { id: 239, title: "Net demand ramping variability", url: "https://renewables-grid.eu/database/ramping-variability/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2015, country: "United States", org: "California ISO", desc: "The California Independent System Operator (CAISO) introduced a real-time measurement system for net demand ramping variability, improving grid reliability amid growing renewable energy integration. This approach allows better planning, faster response, and compliance with operating standards.", img: "https://renewables-grid.eu/fileadmin/_processed_/9/0/csm_Screen_Shot_2019-06-13_at_11.44.58_b3085f1924.png", award: false },
  { id: 240, title: "Preventing Electrocution of Endangered Birds", url: "https://renewables-grid.eu/database/preventing-electrocution-of-birds/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2015, country: "Bulgaria", org: "BirdLife,", desc: "Cooperation between NGOs, industry and governments to prevent electrocution of endangered birds on distribution power lines in Bulgaria and Sudan, led by the Bulgarian Society for the Protection of Birds (BSPB) and the BirdLife International – UNDP/GEF Migratory Soaring Birds Project. Objectives 01 Identifies power lines that are a threat to bird species. 02 Replaces […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_Birdlife_PreventingElectrocution1-644x398-c-default.png", award: false },
  { id: 241, title: "The future of energy Turning young people into aware citizens", url: "https://renewables-grid.eu/database/the-future-of-energy/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2015, country: "Germany", org: "50Hertz", desc: "In cooperation with its nature conservation partners, 50Hertz is implementing a range of both fun and informative communication activities that specifically target young adolescents and the communities in which they live. Objectives 01 Convey the challenges of the energy transition and of grid development to young people 02 Establish a strong network within the affected […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_50Hertz_Thefutureofenergy1-644x398-c-default.png", award: false },
  { id: 242, title: "The Variable Ratio Distribution Transformer (VRDT)", url: "https://renewables-grid.eu/database/the-vrdt/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2015, country: "Germany", org: "Avacon", desc: "The Variable Ratio Distribution Transformer (VRDT) is a simple, cost-efficient alternative to conventional low-voltage grid expansion. By decoupling low voltage from medium voltage, it releases unused capacity in the medium voltage grid, enabling better integration of renewable energy without major infrastructure expansion.", img: "https://renewables-grid.eu/fileadmin/_processed_/e/f/csm_Avacon-21_08_14_074_9d5068a432.jpg", award: false },
  { id: 243, title: "Transparent transmission grid planning", url: "https://renewables-grid.eu/database/transparent-grid/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2015, country: "Germany", org: "Germanwatch", desc: "Germanwatch, a German climate and environment organization, closely monitored the implementation of new legislation on transmission grid planning and actively participated in expert discussions. Their focus was on ensuring that grid planning aligns with ambitious climate and energy targets, is transparent and participative, and adheres to high environmental standards.", img: "https://renewables-grid.eu/fileadmin/_processed_/6/f/csm_20141104_095007_resized_bf517ae06c.jpg", award: false },
  { id: 244, title: "Équilibre Pylon design", url: "https://renewables-grid.eu/database/equilibre/", brand: "RGI", dim: "People, Technology", topic: "Public Acceptance & Engagement, Circularity & Supply Chains", inf: "Grids", year: 2015, country: "France", org: "RTE", desc: "The Équilibre Pylon is an innovative 400 kV pylon design created for the replacement of an existing line. Developed by RTE with public involvement, it combines aesthetic integration into the landscape with technical improvements, enhancing social acceptance and functionality.", img: "https://renewables-grid.eu/fileadmin/_processed_/2/6/csm_Screen_Shot_2019-06-13_at_12.16.15_0c42f76136.png", award: false },
  { id: 245, title: "CHP Accumulator System", url: "https://renewables-grid.eu/database/chp-accumulator-system/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2014, country: "Germany", org: "Fernwärme Ulm", desc: "The practice used a water-based system as a heat accumulator – and essentially, also an electricity accumulator – in order to respond to heat consumption peaks and increase the general efficiency of the region’s combined heat and power (CHP) plant. The heat accumulator used in the project is a steel tank containing 2.400 m3 of water. Objectives […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_FernwarmeUlm_CHPAccumulationSystem1-644x398-c-default.png", award: false },
  { id: 246, title: "Community Dialogue for Suedlink", url: "https://renewables-grid.eu/database/community-dialogue-suedlink/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2014, country: "Germany", org: "TenneT", desc: "TenneT’s “Community dialogue for SuedLink” is a communication strategy encompassing local participation in the form of info-marts that allow for on-the-ground dialogue and involve citizens in the planning of SuedLink. Objectives 01 Build an “equal-to-equal” communication strategy in order to manage the high levels of opposition to the project. 02 Increase acceptability among local people. […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_Tennet_Suedlink1-644x398-c-default.png", award: false },
  { id: 247, title: "DER Integration System", url: "https://renewables-grid.eu/database/der-integration-system/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2014, country: "Italy", org: "Enel", desc: "The “DER Integration system” is a system developed by the Italian branch of the ENEL Group, that, combining various technological measures, increases hosting capacity for distributed generation and ensures operation security, allowing for voltage and power flow control in a smart grid architecture. objectives 01 Solve the main problems arising in active grids including hosting capacity, […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_Enel_DER1-644x398-c-default.png", award: false },
  { id: 248, title: "Eagle Pylon", url: "https://renewables-grid.eu/database/eagle-pylon/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2014, country: "Denmark", org: "Bystrup", desc: "Bystrup developed the Eagle Pylon, an innovative design for electricity pylons, providing an alternative to classic lattice towers. It addresses visual amenity concerns, is easier to produce, transport, install, and maintain, and creates a positive image while ensuring efficiency in transmission.", img: "https://renewables-grid.eu/fileadmin/_processed_/b/9/csm_Screen_Shot_2019-06-11_at_16.09.05_7d51bd3c45.png", award: false },
  { id: 249, title: "Experience Orchard", url: "https://renewables-grid.eu/database/experience-orchard/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2014, country: "Germany", org: "50Hertz", desc: "Development of an orchard area as part of the mitigation and compensation measures portfolio of 50Herts that combined both environmental and social aspects. objectives 01 Integrate social activities and cooperation on a regular basis into the compensatory measures process 02 Utilize the orchard area with a larger social impact and a larger participation of stakeholders […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_50Hertz_ExperienceOrchard-644x398-c-default.png", award: false },
  { id: 250, title: "New power grids and nature conservation", url: "https://renewables-grid.eu/database/new-power-grids/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2014, country: "Germany", org: "NABU", desc: "NABU’s power grids and nature conservation project promotes an energy transition sensitive to environmental concerns by enhancing the involvement of conservation organisations in grid projects through diverse engagement and communication efforts.", img: "https://renewables-grid.eu/fileadmin/_processed_/3/c/csm_Screen_Shot_2019-06-11_at_15.45.04_89199fe3bb.png", award: false },
  { id: 251, title: "Pulse Heating", url: "https://renewables-grid.eu/database/pulse-heating/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Solar", year: 2014, country: "Denmark", org: "ESCSH", desc: "ESCSH developed a district heating system using both pulse heat and solar panels in order to reduce heat losses in supply pipes and supply low-energy houses in an energy efficient way.", img: "https://renewables-grid.eu/fileadmin/_processed_/5/f/csm_Hjortshoej_houses_with_solar_collectors_238842f038.jpg", award: false },
  { id: 252, title: "Stork Platform Campaign", url: "https://renewables-grid.eu/database/stork-platform-campaign/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2014, country: "Bulgaria", org: "EVN", desc: "EVN Bulgaria’s Stork Platform Campaign installs artificial nesting platforms on distribution power poles to protect white storks from electrocution and improve grid reliability. The platforms maintain safe distances between nests and electric parts, reducing bird mortality while safeguarding infrastructure.", img: "https://renewables-grid.eu/fileadmin/_processed_/b/2/csm_EVN_employee_rescuing_a_stork_fallen_from_the_nest_484b2e59ff.jpg", award: false },
  { id: 253, title: "T-Pylon", url: "https://renewables-grid.eu/database/t-pylon/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2014, country: "United Kingdom", org: "National Grid", desc: "Development of an innovative design concept for electrical pylons in order to provide an alternative to classic lattice pylons. Objectives 01 Create a pylon that addresses visual amenity concerns 02 Create a family of pylons in order to cover the range of classic lattice pylons 03 Meet the technical safety and reliability requirements Main Information […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_NationalGrid_Pylon1-644x398-c-default.png", award: false },
  { id: 254, title: "Wildlife Protection along the LitPol Link Route", url: "https://renewables-grid.eu/database/wildlife-protection-litpol/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2014, country: "Lithuania", org: "", desc: "“Wildlife protection along the LitPol Link route” is a campaign with the intention of protecting wildlife habitats along the route of the Lithuania-Poland power link, LitPol Link. Objectives 01 Ensure an ecologically worthwhile way of protecting any rare wildlife species that may be inhabiting the route 02 Minimise the environmental impact of the LitPol Link […]", img: "https://renewables-grid.eu/app/uploads/2014/01/2014_Database_Litgrid_LitPol1-644x398-c-default.png", award: false },
  { id: 255, title: "3D Virtual Reality used before court", url: "https://renewables-grid.eu/database/3d-virtual-reality/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Netherlands", org: "TenneT", desc: "TenneT has developed a 3D virtual reality (3D VR) animation for the Randstad380 project. This animation has not only served its purpose in providing stakeholders and the public with information but it has also been proved useful before court. The 3D VR has helped people that had raised objections to the project by giving them […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 256, title: "Advisory group during spatial planning", url: "https://renewables-grid.eu/database/advisory-group-spatial-planning/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2013, country: "Switzerland", org: "Swiss Federal Office of Energy (SFOE) (leading role);Swissgrid;Federal Office for Spatial Development (ARE);Federal Office for the Environment (FOEN);Federal Inspectorate for Heavy Current Installations (ESTI);Federal Office of Transport (FOT);Electricity Industry;Swiss Federal Railways;Swiss organizations for environmental protection;Project engineer;Local associations for environmental protection;Concerned canton", desc: "The sectoral plan for transmission lines is the overriding planning instrument for new power lines in Switzerland. During this procedure, possible conflicts are identified, solutions developed and in the end the best possible corridor for the new line is determined. Throughout the process, an advisory group is regularly consulted.During discussions, project specific knowledge is exchanged and possible areas of conflicts are identified. Together with the group, a scoping document for the Environmental Impact Assessment, which is conducted during the next stage, the plan approval procedure, is compiled.", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 257, title: "Citizens Transmission", url: "https://renewables-grid.eu/database/citizens-transmission/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2013, country: "United States", org: "Citizens Energy Corporation", desc: "The Citizens Transmission project, created by Joseph P. Kennedy II, dedicates 50% of profits from high-voltage transmission lines to charitable energy assistance programmes for low-income households. By combining infrastructure investment with social impact, the initiative delivers renewable energy while supporting vulnerable communities.", img: "https://renewables-grid.eu/fileadmin/_processed_/5/d/csm_Screen_Shot_2019-06-06_at_17.27.22_e2cd6c21cd.png", award: false },
  { id: 258, title: "Citizens’ bonds (“Bürgeranleihe”)", url: "https://renewables-grid.eu/database/citizens-bonds/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "In the summer of 2013, TenneT realized the first pilot project for financial participation of affected citizens of a transmission line in the region Schleswig-Holstein, in the Northern part of Germany. 15% of the investment sum of the “West-coast line” was made available for investment via so-called citizens’ bonds (“Bürgeranleihe”). People living within a radius […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 259, title: "Continuous stakeholder dialogue for project Wahle-Mecklar", url: "https://renewables-grid.eu/database/dialogue-for-wahle-mecklar/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "For the project “Wahle-Mecklar”, TenneT has organised a multitude of events and meetings before the official permitting procedure, totalling more than 150 events. In addition, working groups meant to accompany the planning have been established. These groups are compiled of representatives from nature conservation authorities, districts, citizen action groups, forest authorities and the like. During […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 260, title: "Cooperation agreement with the German federal state of Brandenburg", url: "https://renewables-grid.eu/database/cooperation-agreement-with-brandenburg/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "The state of Brandenburg in North-Eastern Germany has signed a cooperation agreement with 50Hertz for greater transparency surrounding grid expansion projects. It was signed within the context of an expert forum with participants from citizen action groups, environmental NGOs, industry, authorities and municipal associations. 50Hertz and the state government aimed at complementing current planning legislation […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 261, title: "Cooperation with school on nature trail: engaging youngsters", url: "https://renewables-grid.eu/database/cooperation-with-school/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "Main Information On his own initiative, a teacher had contacted 50Hertz with regards to a nature trail that is located near a power line, for which the TSO had some compensation measures planned. Subsequently, 50Hertz entered into a dialogue with the school on the subject of the nature trail, discussing different measures that could be […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 262, title: "Evaluation scheme for underground cables vs. overhead lines", url: "https://renewables-grid.eu/database/evaluation-scheme/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2013, country: "Switzerland", org: "Swissgrid", desc: "Whether transmission lines are to be constructed overhead or placed underground in Switzerland is being decided on a case-by-case basis and in accordance with objective criteria. For this purpose, the Swiss Federal Office of Energy (SFOE) has developed a \"transmission lines evaluation model”.", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 263, title: "Expert workshops on scenarios and sensitivities of grid development planning", url: "https://renewables-grid.eu/database/expert-workshops-on-scenarios/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2013, country: "Germany", org: "50Hertz,", desc: "During the discussions on the German national grid development plan, TSOs have initiated a continuous dialogue with expert stakeholders, such as NGOs. So far, discussions have focused, among other things, on the analysis of sensitivities in order to get a better understanding about the impact of a certain parameter (e.g. capping some renewable production peaks) […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 264, title: "HCCP Interactive Consultation", url: "https://renewables-grid.eu/database/hccp-interactive-consultation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "United Kingdom", org: "National Grid", desc: "Taking the form of a comprehensive and transferable PC-to-PC 3D model, the “HCCP Interactive Consultation” is a communication tool that aims at effectively implementing new grid projects and achieving public acceptability. Objectives 01 Provide an effective, portable and user friendly communication tool 02 Provide the public with accurate and comprehensive information 03 Test the transferability […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2013_Database_Nationalgrid_HCCPInteractive-644x398-c-default.png", award: false },
  { id: 265, title: "Independent feasibility studies for underground cables", url: "https://renewables-grid.eu/database/studies-underground-cables/", brand: "RGI", dim: "Planning", topic: "Spatial Optimisation", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "At a cross-border project between the Netherlands and Germany, people kept asking to explore the possibility of building the new power line underground. When they understood that an underground AC cable would not be possible, they focused their demands on a DC cable. A previously conducted study on the technical feasibility of undergrounding in the […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 266, title: "Information and learning exhibitions in schools: learning about the energy transition", url: "https://renewables-grid.eu/database/information-and-learning-exhibitions/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "Together with the Independent Institute for Environmental Issues, 50Hertz organises educational events at primary schools every year. Pupils and their parents are informed on the energy transition, for example, and can discuss this topic with representatives from politics, authorities, and industry. In an interactive exhibition that was designed for children to join in and gain […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 267, title: "Internal restructuring for improved engagement", url: "https://renewables-grid.eu/database/internal-restructuring/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "During the past year, TenneT has restructured its entire department for onshore projects. This process included an expansion of resources for stakeholder dialogue. TenneT has divided its grid operation territory into four clusters and has dedicated two so-called ‘citizen officers’ to each region. Spread out in different regions, they serve as TenneT’s main contact points […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 268, title: "Market place style information event", url: "https://renewables-grid.eu/database/market-place-style/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Switzerland", org: "Swissgrid", desc: "In summer 2013, Swissgrid organized the first information events concerning the first expansion project with partial cabling of 380 kV in Switzerland. On the line between Beznau and Birr, four of the five segments have already been approved and completed for 2×380 kilovolts. Main Information The present project only deals with one segment, for which, […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 269, title: "Multi-stakeholder working groups", url: "https://renewables-grid.eu/database/multi-stakeholder/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2013, country: "Germany", org: "50Hertz,", desc: "To solve some of these challenges that arise with the implemenation of the new legislation on electricity grids in Germany, different working groups have been established. First of all, there is an overarching communication group at federal level, which consists of all four TSOs plus the regulator/permitting authority. In addition, groups for specific projects have […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 270, title: "New method to calculate EMF zones", url: "https://renewables-grid.eu/database/new-method-for-emf/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2013, country: "Netherlands", org: "TenneT", desc: "In the coming years, TenneT will have to build several new power lines next to already existing lines in order to increase the overall capacity. By bundling the two lines in one corridor, the impact on the landscape will be lessened. The previous method in calculating the magnitude of electromagnetic fields would not sufficiently take […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 271, title: "Newspaper supplements", url: "https://renewables-grid.eu/database/newspaper-supplements/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "In the past year, 50Hertz has had good experiences with their information flyers that they had inserted into local newspapers. These flyers are meant to introduce specific aspects of grid projects and provide the public with topical information. Different surveys commissioned by 50Hertz have shown that people living in areas where new power lines are […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 272, title: "Rationalisation of urban areas", url: "https://renewables-grid.eu/database/rationalisation-of-urban-areas/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2013, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE is installing and producing live videos of ospreys living in nests located on top of RTE pylons in order to conduct ornithological studies. Objectives 01 Provide visual information about feeding, mortality, predation and nest life habits of ospreys 02 Raise awareness of the need of osprey protection 03 Demonstrate RTE’s active involvement in the […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2013_Database_Terna_RationalisationUrbanAreas-644x398-c-default.png", award: false },
  { id: 273, title: "Route Planning Game", url: "https://renewables-grid.eu/database/route-planning-game/", brand: "RGI", dim: "Planning, People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "50Hertz developed a computer game that makes the difficulties of finding the best route for a new power line more tangible. Players need to identify a possible option for building a new power line while considering impacts on costs, social compatibility, nature and landscape. Only if all of these impacts are considered in an acceptable […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 274, title: "Strategic approach for stakeholder engagement", url: "https://renewables-grid.eu/database/strategic-approach/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Switzerland", org: "Swissgrid", desc: "At the beginning of a new project, the project manager (as part of the asset management team) draws up a plan on when and with whom Swissgrid will communicate proactively. This is done in close cooperation with the communication department. Certain milestones of the project and a comprehensive stakeholder mapping form the basis for this […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 275, title: "Augmented reality app", url: "https://renewables-grid.eu/database/augmented-reality-app/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2012, country: "Switzerland", org: "Swissgrid", desc: "Main Information Swissgrid developed an augmented reality app, which addresses recent discussions about overhead lines or underground cabling in the transmission grid. Animated, three-dimensional graphics present both technologies and their individual effects on the environment in a virtual landscape. explore more practices", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 276, title: "EMF Road Show", url: "https://renewables-grid.eu/database/emf-road-show/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "Germany", org: "50Hertz", desc: "In summer 2012, 50Hertz went on a road show to address citizens’ concerns about the negative health effects of a project and to inform about the current status of the “Uckermark-line”. Highlights 01 Electromagnetic fields was one of the most discussed concerns 02 50Hertz installed a mobile information office in a region where the new […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_50Hertz_EMFRoadShow-644x398-c-default.png", award: false },
  { id: 277, title: "Environmental Educational formats for communities", url: "https://renewables-grid.eu/database/environmental-educational-formats/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "Germany", org: "50Hertz", desc: "German TSO 50Hertz collaborates with the NGO UfU to develop educational formats on the energy transition and grid development. These activities are used in areas located around grid projects to enhance young students’ education on these topics and promote participation in the energy transition. Highlights 01 50Hertz directly contributes to local education efforts on the […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_50Hertz_EnovironmentalEducationFormats2-644x398-c-default.jpg", award: false },
  { id: 278, title: "Grid Perspectives Committee", url: "https://renewables-grid.eu/database/grid-perspectives-committee/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "In France, RTE has to develop a 10-year-investment plan every year. In order to fulfill this task properly, RTE has established a ‘Grid Perspectives committee’ which consists of representatives of RTE customers (producers, distributors, large industrial consumers, traders, etc.), as well as NGO representatives (France Nature Environment, Comité de Liaison Energies Renouvelables, négaWatt Association, etc.) and public institutions (e.g. […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 279, title: "MeRegio – Minimum Emission Region", url: "https://renewables-grid.eu/database/meregio/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2012, country: "Germany", org: "EnBW", desc: "In the MeRegio project a smart grid provides a transparent and flexible tariff system for optimised renewable energy integration into the grid. The solution was by energy company, EnBW (Energie Baden-Württemberg) developed in cooperation with ABB, SAP, IBM, Systemplan and the Karlsruhe Institute of Technology (KIT). objectives 01 Provide transparency to optimise the link between generation and the use of renewable […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2012_Database_EnBW_MeRegio1-644x398-c-default.png", award: false },
  { id: 280, title: "Personalised feedback", url: "https://renewables-grid.eu/database/personalised-feedback/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2012, country: "Norway", org: "TenneT", desc: "Around 600 comments were submitted for the Southring, and another 142 for the Northring of the Randstad380 project during the public consultation of the official spatial planning and permitting procedure. Highlights 01 Combines personal feedback with general feedback report 02 Participants receive a personal letter plus a unique number 03 In the general feedback report […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_TenneT_PersonalisedFeedback1-644x398-c-default.png", award: false },
  { id: 281, title: "Publication of load flow data", url: "https://renewables-grid.eu/database/publication-load-flow-data/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2012, country: "Germany", org: "50Hertz", desc: "In Germany, one continuous topic of discontent in discussions with stakeholders has been that load flow data is not publicly available. Both environmental NGOs and citizens pointed out that they could not judge the need of a new line or the connection between the expansion of renewables and new grids if the data was not […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2012_database_50Hertz_Publication-of-load-flow-data_1-644x398-c-default.png", award: false },
  { id: 282, title: "Study on public acceptance", url: "https://renewables-grid.eu/database/study-on-public-acceptance/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "Germany", org: "Germanwatch", desc: "For the project “Thüringer Strombrücke” planned by 50Hertz, together with two local foundations, Germanwatch has commissioned a study on public involvement during the planning and permitting process of this power line. With the help of media analyses, the analysis of political and legal documents and interviews with involved actors, a 50 page report has been developed. The authors […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_Germanwatch_StudyonPublicAcceptance1-644x398-c-default.png", award: false },
  { id: 283, title: "Underground cabling meta-study", url: "https://renewables-grid.eu/database/underground-meta-study/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2011, country: "Switzerland", org: "Swissgrid", desc: "Main Information Swissgrid commissioned a meta-study, which aimed at examining and summarising current findings on ‘characteristics of over head lines and underground cabling’. This was a first step towards creating a scientifically sound basis which reflects state-of-the-art science and technology and which allows for an overview at a factually neutral level. The Technical University of […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 284, title: "Dual formats for continuous stakeholder involvement", url: "https://renewables-grid.eu/database/dual-formats/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2010, country: "United Kingdom", org: "National Grid", desc: "National Grid employs dual formats for stakeholder involvement, community forums and thematic groups.2010 Main Information Community Forums are divided into two types: Strategic Community Forum (SCF) Local Community Forums (LCF) In order to be eligible for either the SCF or LCF, members need to be genuine representatives of local groups or organisations of more than […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2010_Database_NationalGrid_DualFormats1-644x398-c-default.png", award: false },
  { id: 285, title: "Management of Green Corridors in Portugal – Protection from Forest Fires", url: "https://renewables-grid.eu/database/management-of-green-corridors-in-portugal-protection-from-forest-fires/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2010, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "", img: "https://renewables-grid.eu/app/uploads/2025/09/REN_1-644x398-c-default.jpg", award: false },
  { id: 286, title: "BNetzA Meets Science", url: "https://renewables-grid.eu/database/bnetza-meets-science/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: null, country: "Germany", org: "BNetzA", desc: "“BNetzA meets science” is a two-day interdisciplinary dialogue and networking event fostering collaboration, knowledge transfer, and intergenerational exchange between stakeholders engaged in the research and development of current and future grids.", img: "https://renewables-grid.eu/fileadmin/_processed_/f/3/csm_Screen_Shot_2019-06-11_at_16.07.38_9e24087d77.png", award: false },
  { id: 287, title: "E-Distribuzione strengthens Italy’s power grid resilience", url: "https://renewables-grid.eu/database/strengthening-italian-electricity-networks-against-heatwaves/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: null, country: "", org: "", desc: "E-distribuzione, an electricity distributor in Italy, is implementing a resilience plan to prepare for extreme heatwaves in Sicily and other high-risk areas in the country. The initiative follows a past extreme heat event, caused by record high temperatures exceeding 40°C that severely affected underground cables and disrupted electricity supply. This initiative strengthens the electricity network’s […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 288, title: "EMF – High threshold values and information material", url: "https://renewables-grid.eu/database/emf-high-threshold-values/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: null, country: "Switzerland", org: "Swissgrid", desc: "Main Information The threshold values for electromagnetic fields in Switzerland are relatively high. In general, there is an emission value of 100 microtesla, which may not be exceeded. However, the value for areas with sensitive usage is much lower and cannot exceed 1 microtesla. This applies to areas where people are subject to radiation for […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 289, title: "General meeting with NGO", url: "https://renewables-grid.eu/database/general-meeting/", brand: "RGI", dim: "Planning", topic: "Implementing RGI Declarations", inf: "Grids", year: null, country: "", org: "", desc: "Main Information As an element of transparent and open communication, Swissgrid invited representatives of the most important Swiss NGOs to participate in general discussions on grid development. One aim of this meeting was to evaluate possible future collaborations. Greenpeace, WWF, Pro Natura and the Swiss Energy Foundation attended the meeting, during which Swissgrid presented not […]", img: "https://renewables-grid.eu/app/uploads/2024/02/2024_Database_EirGrids-Community-Benefit-Fund.png", award: false },
  { id: 290, title: "New role in explaining energy policy", url: "https://renewables-grid.eu/database/explaining-energy-policy/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: null, country: "United Kingdom", org: "National Grid", desc: "National Grid has perceived a change in its role within the bigger picture of energy policy – independent from specific projects. Main Information The company understands that explaining the context and consequences of political decisions is becoming increasingly more necessary if it aims to succeed in achieving social acceptance of specific projects. National Grid reported […]", img: "https://renewables-grid.eu/app/uploads/2026/01/Year_Database_NationalGrid_EnergyPolicy1-644x398-c-default.png", award: false },
  { id: 291, title: "Namibian Bush Biomass: An Ecosystem Restoration Solution", url: "https://panorama.solutions/en/solution/namibian-bush-biomass-ecosystem-restoration-solution", brand: "Panorama", dim: "Nature", topic: "Bioenergy", inf: "", year: null, country: "Namibia", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/otjiwa_mariaan_214_red_cropped_0.jpg", award: false },
  { id: 292, title: "Organic Solid Waste Treatment and Biogas Energy Use in Brazil", url: "https://panorama.solutions/en/solution/organic-solid-waste-treatment-and-biogas-energy-use-brazil", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Rio de Janeiro, Rio de Janeiro, Brazil", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/methanum_1.png", award: false },
  { id: 293, title: "Power Generation in a Landfill Biogas-Fueled Thermoelectric Power Plant", url: "https://panorama.solutions/en/solution/power-generation-landfill-biogas-fueled-thermoelectric-power-plant", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Caieiras, São Paulo, Brazil", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/caieiras_1.png", award: false },
  { id: 294, title: "Working on solar powered education in the Netherlands", url: "https://panorama.solutions/en/solution/working-solar-powered-education-netherlands", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "Amsterdam, North Holland, Netherlands", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/dji_0051-1.jpg", award: false },
  { id: 295, title: "Toolbox on Solar Powered Irrigation Systems (SPIS): Information and Tools for Advising on Solar Water Pumping and Irrigation", url: "https://panorama.solutions/en/solution/toolbox-solar-powered-irrigation-systems-spis-information-and-tools-advising-solar-water", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "Kenya", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/jbo_ken19_1298.jpg", award: false },
  { id: 296, title: "Niassa biogas project", url: "https://panorama.solutions/en/solution/niassa-biogas-project", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Niassa, Mozambique", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/img-20210424-wa0006.jpg", award: false },
  { id: 297, title: "\"Cookstove-Biochar Ecosystems\" for Clean Cooking and Soil Restoration in Bangladesh", url: "https://panorama.solutions/en/solution/cookstove-biochar-ecosystems-clean-cooking-and-soil-restoration-bangladesh", brand: "Panorama", dim: "Nature", topic: "Energy Access", inf: "", year: null, country: "Dhaka, Bangladesh", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/large/public/img_20170330_115937_1800x1080.jpg", award: false },
  { id: 298, title: "Perovskite solar panels supporting life lasting animal telemetry", url: "https://panorama.solutions/en/solution/perovskite-solar-panels-supporting-life-lasting-animal-telemetry", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "Brody, Lviv, Ukraine", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/photo-2021-03-05-14-40-23_1.jpg", award: false },
  { id: 299, title: "Transitioning to Low Carbon Sea Transport in the Marshall Islands", url: "https://panorama.solutions/en/solution/transitioning-low-carbon-sea-transport-marshall-islands", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "", year: null, country: "Marshall Islands", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/square_x_large/public/183125942_487990629287596_2025901807770086604_n.jpg?h=a1e1a043&itok=j8Jp4Ihe", award: false },
  { id: 301, title: "Solar street furniture dedicated to the collection of recyclable packaging", url: "https://panorama.solutions/en/solution/solar-street-furniture-dedicated-collection-recyclable-packaging", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "France", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/visuel_sunbox_avec_toiture_solaire_2.jpg", award: false },
  { id: 302, title: "Biogas Initiative for Agriculture in Indonesia funded by carbon offset", url: "https://panorama.solutions/en/solution/biogas-initiative-agriculture-indonesia-funded-carbon-offset", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Indonesia", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/org_dsc06117.jpg", award: false },
  { id: 303, title: "Climate mitigation using renewable energy through participatory approaches in Bipindi, Cameroon", url: "https://panorama.solutions/en/solution/climate-mitigation-using-renewable-energy-through-participatory-approaches-bipindi", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "", year: null, country: "Lokoundjé, South, Cameroon", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2024-08/FEDEC%201%20png.png", award: false },
  { id: 304, title: "Expansion of Renewable Energy Solutions in Agriculture", url: "https://panorama.solutions/en/solution/expansion-renewable-energy-solutions-agriculture", brand: "Panorama", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: null, country: "Dushanbe, Tajikistan", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2024-11/Solar%20irrigation.jpg", award: false },
  { id: 305, title: "Affordable Access to Solar Powered Cold Storages", url: "https://panorama.solutions/en/solution/affordable-access-solar-powered-cold-storages", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "Himachal Pradesh, Indien", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2025-06/Picture%202.png", award: false },
  { id: 306, title: "Using Solar Dryers for Value Addition and the Reduction of Post Harvest Loss", url: "https://panorama.solutions/en/solution/using-solar-dryers-value-addition-and-reduction-post-harvest-loss", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "India", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2025-06/01%20RAW%20MATERIAL.jpg", award: false },
  { id: 307, title: "Use of Solar Bio-Fermenters for Nutrition and Soil Health Management", url: "https://panorama.solutions/en/solution/use-solar-bio-fermenters-nutrition-and-soil-health-management", brand: "Panorama", dim: "People", topic: "Solar Energy", inf: "Solar", year: null, country: "Himachal Pradesh, Indien", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2025-06/333A4107_LowRes.jpg", award: false },
  { id: 308, title: "HandyHeroes: Low-Carbon Revitalization of Aging Communities", url: "https://panorama.solutions/en/solution/handyheroes-low-carbon-revitalization-aging-communities", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "", year: null, country: "China", org: "", desc: "", img: "https://panorama.solutions/sites/default/files/styles/auto_small_width/public/2025-11/1376ec91ef384f7a114385a91f00831b_0.jpg?itok=or9o_k7X", award: false },
  { id: 309, title: "Eco-friendly subsea cable protection in the Canary Islands", url: "https://offshore-coalition.eu/database-project/eco-friendly-subsea-cable-protection/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "Spain", org: "Red Eléctrica and ECOncrete", desc: "This project aims to investigate how eco-friendly concrete trench blocks placed around subsea electricity cables can enhance marine biodiversity. Specifically, the project focuses on stimulating the natural recovery ofreefs(Habitat of Community Interest 1170).", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Econcrete-3-scaled.jpg", award: false },
  { id: 310, title: "Wilder Humber: Restoring coastal ecosystems", url: "https://offshore-coalition.eu/database-project/wilder-humber/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "United Kingdom", org: "Ørsted, Yorkshire Wildlife Trust and Lincolnshire Wildlife Trust", desc: "Improving the health and resiliency of Humber estuary ecosystem by restoringseagrass meadows, saltmarsh, sand dunes, and native oyster reefs", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Picture-1.jpg", award: false },
  { id: 311, title: "3D-printed reefs to help restore marine biodiversity in the Kattegat, Denmark", url: "https://offshore-coalition.eu/database-project/3d-printed-reefs-kattegat-denmark/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "Denmark", org: "Ørsted and WWF Denmark", desc: "To test how 3D-printed reefs can enhance marine biodiversity, by attracting various marine species, providing refuge and feeding grounds forcod stocks, among others.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/93A6786-scaled.jpg", award: false },
  { id: 312, title: "Water replenishment holes in turbine foundations", url: "https://offshore-coalition.eu/database-project/water-replenishment-holes-in-turbine-foundations/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "Vattenfall, the Rich North Sea, the Royal Netherlands Institute for Sea Research, Wageningen Marine Research, and Waardenburg Ecology", desc: "To investigate how water replenishment holes in turbine foundations can be used byfish and other marine speciesto settle, shelter and be used as a feeding grounds.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/IP_Vattenfall_sea-1280x853-1-e1728921043537.jpg", award: false },
  { id: 313, title: "Biohuts attached to Biodiversity Observation Buoy (BoB)", url: "https://offshore-coalition.eu/database-project/biohuts-attached-to-biodiversity-observation-buoy-bob/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2019, country: "France", org: "ECOCEAN, OW, EFGL, Centre de Recherche sur les Écosystèmes Marins (CREM – UPVD/CNRS)", desc: "To understand the potential of nature-inclusive designs (NIDs) for floating structures to enhance biodiversity in Mediterranean Sea, with a particular focus oncrustaceans, molluscs, andjuvenile and adult fish populationsin the open sea and coastal areas.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/06/Installation-BOB-©-Remy-Dubas-4-Gilles-Lecaillon-Gilles-Lecaillon.jpg", award: false },
  { id: 314, title: "Recovering Posidonia oceanica seagrass meadows in Bay of Pollença", url: "https://offshore-coalition.eu/database-project/recovering-seagrass-meadows-pollenca/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2018, country: "Spain", org: "Red Eléctrica, Mediterranean Institute for Advanced Studies (IMEDEA), Regional Ministry of the Environment and Territory, Ministry of Defense and the Pollensa Military Air Base", desc: "The project aims to restore two hectares ofPosidonia oceanicaseagrass meadows in the Bay of Pollença.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Posidonia-14-scaled.jpg", award: false },
  { id: 315, title: "ECOncrete Scour Protection: Fisheries and Biodiversity Research Project", url: "https://offshore-coalition.eu/database-project/econcrete-scour-protection-fisheries-and-biodiversity-research-project/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "USA", org: "ECOncrete, Stony Brook University", desc: "The project evaluates the effects of nature-inclusive design (NID) scour protection onmarine biodiversity and fish populationscompared to traditional scour protection methods.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/02/1-ECOncrete-Scour-Protection-Unit-at-installation-Naomie-Lecard-scaled.jpeg", award: false },
  { id: 316, title: "BioReef", url: "https://offshore-coalition.eu/database-project/bioreef/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2023, country: "Denmark", org: "Ørsted, DTU Aqua, WWF Denmark", desc: "Develop and scale up methods, tools, and protocols to restore biogenic reefs ofEuropean flat oystersandhorse musselsin Danish waters at historical sites.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/04/IMG_0150-scaled.jpg", award: false },
  { id: 317, title: "Oyster Broodstock Structures at the Blauwwind (Borssele III & IV) Offshore Wind Farm", url: "https://offshore-coalition.eu/database-project/oyster-broodstock-structures-at-the-blauwwind-borssele-iii-iv-offshore-wind-farm/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2020, country: "Netherlands", org: "The Rich North Sea, Blauwwind consortium, Van Oord, Bluestream offshore, and Eurofins AquaSense", desc: "To study flat oyster broodstock placement and rock reef development within offshore wind farms, with a particular focus on assessing the potential reproduction of theEuropean flat oyster, as well as the establishment of young oysters.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/2S0A7755-scaled.jpg", award: false },
  { id: 318, title: "Construction of an oyster bank in Gemini offshore wind farm", url: "https://offshore-coalition.eu/database-project/construction-of-an-oyster-bank-in-gemini-offshore-wind-farm/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "The Rich North Sea, Waterproof, Wageningen Marine Research, NIOZ and Waardenburg Ecology; Gemini Wind Park- ZeeEnergie.", desc: "To restore a large-scaleEuropean flat oysterreef and enhance biodiversity in the North Sea.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/GEM_0837-scaled.jpg", award: false },
  { id: 319, title: "ReCoral: Offshore wind turbine foundations providing a new habitat for corals in Taiwan", url: "https://offshore-coalition.eu/database-project/recoral/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Taiwan", org: "Ørsted and the Penghu Marine Biology Research Center", desc: "Testing a new methodology of creatingcoral reefsdirectly on the foundations of wind turbines to improve local and wider ecosystems.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Corrals-at-12-months.jpg", award: false },
  { id: 320, title: "Cable Protection & Stabilisation with ECOncrete Marine Mattresses", url: "https://offshore-coalition.eu/database-project/cable-protection-stabilisation-with-econcrete-marine-mattresses/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2023, country: "USA", org: "ECOncrete and Prysmian", desc: "To protect and stabilise subsea power cables while creating habitats that support marine biodiversity within offshore wind infrastructure.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/02/2-ECOncrete-Marine-Mattress-Naomie-Lecard.jpeg", award: false },
  { id: 321, title: "Oyster Broodstock Structures in Eneco Luchterduinen offshore wind farm", url: "https://offshore-coalition.eu/database-project/oyster-broodstock-structures-in-eneco-luchterduinen-offshore-wind-farm/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2018, country: "Netherlands", org: "The Rich North Sea, Eneco, and Van Oord", desc: "To test several outplacement methods and identify key success factors for enhancing marine ecosystems within offshore wind farms through the restoration ofEuropean flat oysters.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/1920_luchterduinenmissie-28-3.jpg", award: false },
  { id: 322, title: "Artificial rock reefs bring new life to Hollandse Kust Zuid", url: "https://offshore-coalition.eu/database-project/artificial-rock-reefs-bring-new-life-to-hollandse-kust-zuid/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "Vattenfall, Van Oord, Seaway 7, Wageningen Marine Research, Waardenburg Ecology, Rich North Sea, and Witteveen & Bos", desc: "To investigate whether the deployment of rock reefs, using a rock grading larger than that used for conventional scour protection, offers additional benefits forAtlantic cod and other reef-associated species (fishes, invertebrates).", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/1-Screenshot-2024-10-23-at-18.01.00-1080x678.png", award: false },
  { id: 323, title: "Eco-friendly scour protection at the Borssele offshore wind farm (Site V)", url: "https://offshore-coalition.eu/database-project/eco-friendly-scour-protection/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2019, country: "Netherlands", org: "Van Oord, Wageningen Marine Research, Waardenburg Ecology, Netherlands Institute for Sea Research, HZ University of Applied Sciences, and Roem van Yerseke", desc: "The project aims to enhance natural habitats in offshore wind farms, with a particular focus on theEuropean flat oyster, by developing and testing various eco-friendly scour protection designs and oyster reinstatement methods.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Ecoscour-1-e1728912298917.jpg", award: false },
  { id: 324, title: "Biohut NIDs attached to a Floating Offshore Wind 10 MW Windfloat Turbine", url: "https://offshore-coalition.eu/database-project/biohut-nids-attached-to-a-floating-offshore-wind-10-mw-windfloat-turbine/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2017, country: "France", org: "Ecocean & OCEAN WINDS", desc: "To increase the ecological function of floating offshore wind farms by installing artificial plug-in Biohuts®, targetingcrustaceans, molluscs and fish.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/06/EFG1-Septembre-2025-©RD-HD-14-scaled.jpg", award: false },
  { id: 325, title: "Eco-crossings: testing how to boost biodiversity on offshore grids", url: "https://offshore-coalition.eu/database-project/eco-crossings-testing-how-to-boost-biodiversity-on-offshore-grids/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "TenneT, Van Oord, and Waardenburg Ecology", desc: "To understand whether different materials used at offshore cable crossings can boost marine biodiversity, particularly for the European flat oyster and other reef associated species.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/12/1-Copyright-DMP_20230614_Kabelkruising-TenneT_DSC07486-Britte-Schilt-e1765209582822.jpg", award: false },
  { id: 326, title: "Development of biodiversity around artificial reefs", url: "https://offshore-coalition.eu/database-project/development-of-biodiversity-around-artificial-reefs/", brand: "OCEaN", dim: "Nature, Technology", topic: "Offshore Energy & Nature", inf: "Offshore wind", year: 2020, country: "Netherlands", org: "Ørsted, Wageningen Marine Research, and the Rich North Sea", desc: "To investigate the contributions of artificial reefs to marine biodiversity in the North Sea, specifically targetingAtlantic cod and European lobsters.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/NE_lobster.jpg", award: false },
  { id: 327, title: "Reef Enhancement for Scour Protection (RESP)", url: "https://offshore-coalition.eu/database-project/reef-enhancement-for-scour-protection-resp/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2025, country: "United Kingdom", org: "RWE and ARC marine", desc: "The RESP pilot project by RWE and ARC marine uses eco-engineered Reef cubes® as a 100% alternative to traditional rock scour protection, enhancing marine biodiversity while protecting offshore infrastructure. The target species include encrusting and reef forming species likemolluscs,anemonesandalgae, and associated fauna likecrustaceanandfish.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/12/Image-5.jpeg", award: false },
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

/* ── Dimension-to-Topics mapping (derived from data) ── */
const DIMENSION_TOPICS = {};
PRACTICES.forEach(p => {
  if (!p.dim || !p.topic) return;
  p.dim.split(", ").forEach(dim => {
    if (!DIMENSION_TOPICS[dim]) DIMENSION_TOPICS[dim] = new Set();
    p.topic.split(", ").forEach(t => DIMENSION_TOPICS[dim].add(t));
  });
});
Object.keys(DIMENSION_TOPICS).forEach(k => {
  DIMENSION_TOPICS[k] = [...DIMENSION_TOPICS[k]].sort();
});

/* ── Brand links ── */
const BRAND_LINKS = {
  RGI: "https://renewables-grid.eu",
  OCEaN: "https://offshore-coalition.eu",
  GINGR: "https://gingr.org",
  SL4B: "https://safelines4birds.eu",
  IUCN: "https://www.iucn.org/our-work/topic/green-just-energy-transition",
  Panorama: "https://panorama.solutions/en",
};

/* ══════════════════════════════════════════════════════════════════════════════
   COLOUR TOKENS  (from Figma branding frame)
   ══════════════════════════════════════════════════════════════════════════════ */
const PURPLE   = "#58044D";
const CREAM    = "#FFF8E5";
const CHARCOAL = "#424244";
const LTGREY   = "#C9C9C9";
const INITIAL_ITEMS = 21;
const LOAD_MORE_INCREMENT = 21;

/* ── Theme colour map for badge styling ── */
const THEME_COLORS = {
  People:     { bg: "bg-amber-50",   text: "text-amber-800",   border: "border-amber-600" },
  Nature:     { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-600" },
  Technology: { bg: "bg-sky-50",     text: "text-sky-800",     border: "border-sky-600" },
  Planning:   { bg: "bg-violet-50",  text: "text-violet-800",  border: "border-violet-600" },
};
function themeClasses(dim) {
  const c = THEME_COLORS[dim];
  return c ? `${c.bg} ${c.text} ${c.border}` : "bg-white text-[#58044D] border-[#58044D]";
}

/* Derived filter option lists (filter out empty/null values) */
const allTopics    = [...new Set(PRACTICES.flatMap(p => p.topic ? p.topic.split(", ") : []))].filter(Boolean).sort();
const allBrands    = [...new Set(PRACTICES.map(p => p.brand))].filter(Boolean).sort();
const allDims      = [...new Set(PRACTICES.flatMap(p => p.dim ? p.dim.split(", ") : []))].filter(Boolean).sort();
const allCountries = [...new Set(PRACTICES.map(p => p.country))].filter(Boolean).sort();
const allYears     = [...new Set(PRACTICES.map(p => p.year))].filter(y => y != null).sort((a, b) => b - a);
const allInfra     = [...new Set(PRACTICES.map(p => p.inf))].filter(Boolean).sort();
const allOrgs      = [...new Set(PRACTICES.map(p => p.org))].filter(Boolean).sort();

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
    <svg className="w-[130px] h-auto opacity-80" viewBox="0 0 15905.4 4798.3" xmlns="http://www.w3.org/2000/svg">
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

function SubmissionCriteriaModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const criteria = [
    {
      title: "Publicly documented",
      desc: "The practice must be accessible via a public URL — a webpage, case study, report, or guidance document that others can view and reference.",
    },
    {
      title: "Relevance to energy infrastructure",
      desc: "The practice must relate to electricity grids, solar, onshore wind, offshore wind, or broader energy systems.",
    },
    {
      title: "Nature- or People-positive focus",
      desc: "The practice must demonstrably address biodiversity, landscape integration, community engagement, social acceptance, or other environmental and social dimensions of the energy transition.",
    },
    {
      title: "Replicability",
      desc: "The approach should be transferable — applicable to other projects, organisations, or geographies beyond the original context.",
    },
    {
      title: "Demonstrated outcomes",
      desc: "Preference is given to practices with measurable, documented, or independently verified results, though emerging and innovative approaches are also considered.",
    },
    {
      title: "Recency",
      desc: "Practices should generally date from 2000 onwards and reflect current standards and regulatory contexts.",
    },
    {
      title: "Joint approval by RGI and GINGR",
      desc: "All submissions are reviewed by the Renewables Grid Initiative (RGI) and the Global Initiative for Nature, Grids and Renewables (GINGR). Both organisations must approve a practice before it is published in the Atlas. Submissions that do not meet the criteria may be declined or returned for revision.",
      highlight: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="criteria-modal-title" tabIndex={-1} className="bg-[#FFF8E5] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl outline-none">
        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-4">
          <h2 id="criteria-modal-title" className="font-['League_Gothic'] text-[#58044D] text-3xl lg:text-4xl uppercase tracking-wide">Submission Criteria</h2>
          <button
            onClick={onClose}
            className="ml-4 mt-1 text-[#424244] hover:text-[#58044D] transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="px-8 pb-8">
          <p className="text-[#424244] text-sm leading-relaxed mb-6">
            The Energy Transition Atlas is a curated resource. To maintain quality and relevance, all practices are reviewed jointly by <strong>RGI</strong> and <strong>GINGR</strong> before publication. Submissions should meet the following criteria:
          </p>
          <ol className="space-y-4">
            {criteria.map((item, i) => (
              <li key={i} className={`flex gap-4 p-4 rounded-xl ${item.highlight ? "bg-[#58044D]/8 border border-[#58044D]/20" : "bg-white border border-[#C9C9C9]/60"}`}>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${item.highlight ? "bg-[#58044D] text-white" : "bg-[#C9C9C9]/40 text-[#424244]"}`}>
                  {i + 1}
                </span>
                <div>
                  <p className={`text-sm font-semibold mb-0.5 ${item.highlight ? "text-[#58044D]" : "text-[#424244]"}`}>{item.title}</p>
                  <p className="text-sm text-[#424244] opacity-80 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#58044D] text-white text-sm font-medium hover:bg-[#58044D]/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GreyscaleGINGRLogo() {
  return (
    <img
      src="gingr-logo-grey.svg"
      alt="GINGR – Global Initiative for Nature, Grids and Renewables"
      className="h-[44px] w-auto opacity-80"
    />
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
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  const active = selected.length > 0;

  const toggle = (val) => {
    const next = selected.includes(val)
      ? selected.filter((s) => s !== val)
      : [...selected, val];
    onChange(next);
  };

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-label={`Filter by ${label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
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
        <div role="listbox" aria-label={`${label} options`} className="absolute z-50 mt-2 w-64 max-h-60 overflow-y-auto rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
          {options.map((opt) => (
            <label
              key={String(opt)}
              role="option"
              aria-selected={selected.includes(opt)}
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);

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
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
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
    const qs = p.toString();
    const url = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, viewMode, sortMode, currentPage]);

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

  /* ── reset visible count when filters or sort change ── */
  useEffect(() => { setVisibleCount(INITIAL_ITEMS); }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, sortMode]);

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
        const hay = `${p.title} ${p.desc} ${p.org} ${p.topic} ${p.country} ${p.dim}`.toLowerCase();
        const tokens = q.split(/\s+/).filter(Boolean);
        if (!tokens.every(tok => hay.includes(tok))) return false;
      }
      if (selTopics.length) {
        const pTopics = p.topic ? p.topic.split(", ") : [];
        if (!pTopics.some(t => selTopics.includes(t))) return false;
      }
      if (selBrands.length && !selBrands.includes(p.brand)) return false;
      if (selDims.length) {
        const pDims = p.dim ? p.dim.split(", ") : [];
        if (!pDims.some(d => selDims.includes(d))) return false;
      }
      if (selCountries.length && !selCountries.includes(p.country)) return false;
      if (selYears.length && !selYears.includes(p.year)) return false;
      if (selInfra.length) {
        const pInfra = p.inf ? p.inf.split(/[;,]\s*/) : [];
        if (!pInfra.some(i => selInfra.includes(i))) return false;
      }
      if (selOrgs.length && !selOrgs.includes(p.org)) return false;
      if (awardOnly && !p.award) return false;
      return true;
    });
    switch (sortMode) {
      case "oldest": results.sort((a, b) => (a.year ?? 0) - (b.year ?? 0)); break;
      case "az":     results.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za":     results.sort((a, b) => b.title.localeCompare(a.title)); break;
      default:       results.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)); break;
    }
    return results;
  }, [search, selTopics, selBrands, selDims, selCountries, selYears, selInfra, selOrgs, awardOnly, sortMode]);

  const pageItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = filtered.length - visibleCount;

  /* ── basic filters (always visible) ── */
  const basicFilters = [
    { label: "Infrastructure", options: allInfra, selected: selInfra, onChange: setSelInfra },
    { label: "Theme", options: allDims, selected: selDims, onChange: setSelDims },
    { label: selDims.length ? `Topic (${selDims.join(", ")})` : "Topic", options: availableTopics, selected: selTopics, onChange: setSelTopics },
  ];

  /* ── expanded filters ── */
  const expandedFilters = [
    { label: "Year", options: allYears.map(String), selected: selYears.map(String), onChange: (arr) => setSelYears(arr.map(Number)) },
    { label: "Location", options: allCountries, selected: selCountries, onChange: setSelCountries },
    { label: "Organisation", options: allOrgs, selected: selOrgs, onChange: setSelOrgs },
    { label: "Atlas Partner", options: allBrands, selected: selBrands, onChange: setSelBrands },
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=League+Gothic&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap');
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

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
              <p>The Atlas is owned and managed by the <strong>Global Initiative for Nature, Grids and Renewables (GINGR)</strong>, a joint initiative of the <a href="https://renewables-grid.eu" target="_blank" rel="noopener noreferrer" className="text-[#58044D] underline hover:text-[#58044D]/80">Renewables Grid Initiative (RGI)</a> and the <a href="https://www.iucn.org" target="_blank" rel="noopener noreferrer" className="text-[#58044D] underline hover:text-[#58044D]/80">International Union for Conservation of Nature (IUCN)</a>.</p>
              <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide mt-8">Our Vision</h3>
              <p>A rapid energy transition enabled by wind, solar and electricity grids that embraces Nature- and People-Positive goals.</p>
              <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide mt-8">Our Mission</h3>
              <p>We facilitate Nature- and People-Positive renewable energy and grid deployment by establishing an industry-supported and government-endorsed monitoring and reporting framework on a global scale.</p>
              <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide mt-8">Our Values</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white rounded-xl border-l-4 border-emerald-500">
                  <span className="text-emerald-700 font-bold text-lg">Nature-Positive</span>
                  <p className="text-sm text-[#424244] mt-1 leading-relaxed">In recognition of the established Nature-Positive definition, we work to identify the specific contributions of the wind, solar and electricity grid sectors to the targets set by the Kunming-Montreal Global Biodiversity Framework.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border-l-4 border-amber-500">
                  <span className="text-amber-700 font-bold text-lg">People-Positive</span>
                  <p className="text-sm text-[#424244] mt-1 leading-relaxed">We recognise the undeniable need to involve, respect and engage communities where wind, solar and electricity grids will be built. We aim to quantify progress in co-creating local, sustainable and long-term benefits.</p>
                </div>
              </div>
              <h3 className="font-['League_Gothic'] text-[#58044D] text-2xl uppercase tracking-wide mt-8">Contributing Partners</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { name: "GINGR", url: BRAND_LINKS.GINGR, desc: "The Global Initiative for Nature, Grids and Renewables is a joint initiative of RGI and IUCN that owns and manages the Energy Transition Atlas, extending the mission of nature-positive energy infrastructure to a global scale." },
                  { name: "RGI", url: BRAND_LINKS.RGI, desc: "The Renewables Grid Initiative brings together NGOs and transmission system operators to promote transparent and environmentally sensitive grid development across Europe." },
                  { name: "IUCN", url: BRAND_LINKS.IUCN, desc: "The International Union for Conservation of Nature drives global action on nature-positive energy through its Green, Just Energy Transition programme and co-founded GINGR." },
                  { name: "OCEaN", url: BRAND_LINKS.OCEaN, desc: "The Offshore Coalition for Energy and Nature works to ensure offshore renewable energy and marine nature conservation develop in harmony." },
                  { name: "SL4B", url: BRAND_LINKS.SL4B, desc: "Safe Lines for Birds promotes bird-safe practices for power line infrastructure, reducing avian collision and electrocution risks." },
                  { name: "Panorama", url: BRAND_LINKS.Panorama, desc: "PANORAMA – Solutions for a Healthy Planet is an IUCN-hosted platform showcasing nature-based solutions worldwide. Energy-relevant practices from Panorama are featured in the Atlas." },
                ].map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-white rounded-xl border border-[#C9C9C9] hover:border-[#58044D] hover:shadow-md transition-all"
                  >
                    <span className="text-[#58044D] font-bold text-lg">{partner.name}</span>
                    <p className="text-sm text-[#424244] mt-1 leading-relaxed">{partner.desc}</p>
                    <span className="block text-xs text-[#6B6B6D] mt-2">{partner.url}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── SUBMIT PAGE ─── */}
      {currentPage === "#submit" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#58044D] text-4xl lg:text-5xl uppercase tracking-wide mb-4">Submit a Practice</h2>
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-sm text-amber-800">
              <strong>Preview:</strong> This form is a demo and does not submit data. To submit a practice, please contact <a href="mailto:info@gingr.org" className="underline font-medium">info@gingr.org</a>.
            </div>
            <div className="mb-6">
              <button
                onClick={() => setShowCriteriaModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#58044D] text-[#58044D] text-sm font-medium hover:bg-[#58044D] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Submission Criteria
              </button>
            </div>
            {showCriteriaModal && <SubmissionCriteriaModal onClose={() => setShowCriteriaModal(false)} />}
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
                    <p className="text-xs text-[#6B6B6D] mb-2">The organisation or website where this practice is published</p>
                    <input type="text" required value={submitForm.brand} onChange={(e) => setSubmitForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. TenneT, RTE, IUCN..." className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#424244] mb-1">Theme</label>
                    <select required value={submitForm.dim} onChange={(e) => setSubmitForm(f => ({ ...f, dim: e.target.value, topic: "" }))} className="w-full px-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] focus:outline-none focus:border-[#58044D] focus:ring-2 focus:ring-[#58044D]/20 transition-colors">
                      <option value="">Select...</option>
                      <option value="Nature">Nature</option>
                      <option value="Technology">Technology</option>
                      <option value="People">People</option>
                      <option value="Planning">Planning</option>
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
            <h2 className="font-['League_Gothic'] text-[#58044D] text-4xl lg:text-5xl uppercase tracking-wide mb-4">Contact</h2>
            <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-300 text-sm text-amber-800">
              <strong>Preview:</strong> This contact form is a demo and does not send messages. Please email <a href="mailto:info@gingr.org" className="underline font-medium">info@gingr.org</a> directly.
            </div>
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
                  <a href="mailto:info@gingr.org" className="text-[#58044D] font-medium hover:underline">
                    info@gingr.org
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
                  onClick={() => setAwardOnly(!awardOnly)}
                  aria-label="Toggle award winners only"
                  aria-pressed={awardOnly}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    awardOnly
                      ? "bg-[#58044D] text-white border-[#58044D]"
                      : "bg-white text-[#58044D] border-[#58044D]"
                  }`}
                >
                  <IconAward />
                  <span>Awards</span>
                </button>
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">
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

              {/* Mobile: Infrastructure + Theme + Topic + Award + More Filters + Search icon + Sort */}
              <div className="flex md:hidden items-center gap-2">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                  {basicFilters.map((f) => (
                    <div key={f.label} className="flex-shrink-0">
                      <FilterDropdown label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
                    </div>
                  ))}
                  <button
                    onClick={() => setAwardOnly(!awardOnly)}
                    aria-label="Toggle award winners only"
                    aria-pressed={awardOnly}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
                      awardOnly
                        ? "bg-[#58044D] text-white border-[#58044D]"
                        : "bg-white text-[#58044D] border-[#58044D]"
                    }`}
                  >
                    <IconAward />
                  </button>
                  <button
                    onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                    aria-label="Toggle additional filters"
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      filterPanelOpen
                        ? "bg-[#58044D] text-white border-[#58044D]"
                        : "bg-white text-[#58044D] border-[#58044D]"
                    }`}
                  >
                    <IconSettings />
                    <span>More</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">
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

              {/* Mobile: Expanded filter panel (expanded filters + view toggles) */}
              {filterPanelOpen && (
                <div className="md:hidden flex flex-col gap-3">
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
                    <span className="text-[#58044D]/60">{chip.label}:</span> {chip.value}
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
              <p className="text-sm text-[#6B6B6D] mb-6" aria-live="polite">
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} practice{filtered.length !== 1 ? "s" : ""}
              </p>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#58044D]/10 flex items-center justify-center mx-auto mb-4 text-[#58044D]">
                    <IconSearch />
                  </div>
                  <p className="text-[#767676] text-lg">No practices match your current filters.</p>
                  {activeChips.length > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                      {activeChips.map((chip, i) => (
                        <button
                          key={`${chip.label}-${chip.value}-${i}`}
                          onClick={chip.onRemove}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58044D]/10 text-[#58044D] text-xs font-medium hover:bg-[#58044D]/20 transition-colors"
                        >
                          <span className="text-[#58044D]/60">{chip.label}:</span> {chip.value}
                          <IconX />
                        </button>
                      ))}
                    </div>
                  )}
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
                      <div className="mt-3 flex items-center gap-4 text-xs text-[#6B6B6D] flex-wrap">
                        {p.country && <span className="flex items-center gap-1"><IconPin />{p.country}</span>}
                        {p.year && <span className="flex items-center gap-1"><IconCalendar />{p.year}</span>}
                        {p.org && <span className="flex items-center gap-1"><IconBuilding />{p.org}</span>}
                        {p.inf && <span className="flex items-center gap-1"><IconLayers />{p.inf}</span>}
                      </div>
                      <h3 className="mt-2 text-base font-bold text-[#424244] group-hover:text-[#58044D] transition-colors leading-snug">
                        {p.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {p.dim.split(", ").map(d => (
                          <span key={d} className={`text-xs border rounded-full px-3 py-0.5 ${themeClasses(d)}`}>
                            {d}
                          </span>
                        ))}
                        {p.topic && <span className="text-xs border border-[#58044D]/30 text-[#58044D] rounded-full px-3 py-0.5">
                          {p.topic.split(", ")[0]}
                        </span>}
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
                      <div className="mt-1.5 flex items-center gap-4 text-xs text-[#6B6B6D] flex-wrap">
                        {p.country && <span className="flex items-center gap-1"><IconPin />{p.country}</span>}
                        {p.year && <span className="flex items-center gap-1"><IconCalendar />{p.year}</span>}
                        {p.org && <span className="flex items-center gap-1"><IconBuilding />{p.org}</span>}
                        {p.inf && <span className="flex items-center gap-1"><IconLayers />{p.inf}</span>}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {p.dim.split(", ").map(d => (
                          <span key={d} className={`text-xs border rounded-full px-2.5 py-0.5 ${themeClasses(d)}`}>
                            {d}
                          </span>
                        ))}
                        {p.topic && <span className="text-xs border border-[#58044D]/30 text-[#58044D] rounded-full px-2.5 py-0.5">
                          {p.topic.split(", ")[0]}
                        </span>}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* ─── 6. Load More ─── */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount(prev => prev + LOAD_MORE_INCREMENT)}
                    className="px-8 py-3 rounded-full border-2 border-[#58044D] text-[#58044D] font-semibold hover:bg-[#58044D] hover:text-white transition-colors"
                  >
                    Show More Practices ({remaining} remaining)
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ─── 7. Footer ─── */}
      <footer className="bg-[#424244] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1: Logos + tagline */}
            <div>
              <div className="flex flex-nowrap items-center gap-4">
                <GreyscaleGINGRLogo />
              </div>
              <p className="mt-3 text-[#C9C9C9] text-sm leading-relaxed">
                The Energy Transition Atlas is owned and managed by the Global Initiative for Nature, Grids and Renewables (GINGR), a joint initiative of the Renewables Grid Initiative (RGI) and the International Union for Conservation of Nature (IUCN). It aims to break down silos between organisations, sectors, and borders by making successful approaches to a Nature- and People-Positive energy transition discoverable and shareable.
              </p>
            </div>
            {/* Col 2: Contact */}
            <div>
              <h4 className="font-['League_Gothic'] text-[#FFF8E5] text-xl uppercase tracking-widest mb-3">Contact</h4>
              <p className="text-[#C9C9C9] text-sm leading-relaxed">
                GINGR Secretariat<br />
                c/o Renewables Grid Initiative<br />
                Manfred-von-Richthofen-Str. 4<br />
                12101 Berlin, Germany
              </p>
              <p className="mt-2">
                <a href="mailto:info@gingr.org" className="text-[#FFF8E5] text-sm hover:text-white transition-colors">
                  info@gingr.org
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
              &copy; 2026 GINGR &ndash; Global Initiative for Nature, Grids and Renewables
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
