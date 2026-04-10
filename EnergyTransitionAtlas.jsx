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
  { id: 5, title: "Biohuts as Nature-Inclusive Design Solutions on Floating Offshore Wind Turbines", url: "https://renewables-grid.eu/database/biohuts-as-nature-inclusive-design-solutions-on-floating-offshore-wind-turbines/", brand: "RGI", dim: "", topic: "Nature Conservation & Restoration", inf: "", year: 2025, country: "Germany", org: "Amprion", desc: "Seeking to align renewable energy development with EU biodiversity goals, Ecocean partnered with Ocean Winds to install 32 biohut ‘fish hotels’ on the platform for a EFGL pilot wind farm off the French Mediterranean coast. Biohuts are steel cages filled with natural materials that mimic habitats for marine life. Representing the first large-scale use of […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 6, title: "Boosting renewable energy integration using grid-enhancing technologies", url: "https://renewables-grid.eu/database/boosting-renewable-energy-integration-using-grid-enhancing-technologies/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2025, country: "France", org: "Artelys", desc: "This project by the data science and modelling company Artelys shows how grid-enhancing technologies (GETs) can support the integration of increasing volumes of renewables while avoiding delays, high costs and public resistance associated with traditional grid expansion. Highlights 01 The project uses advanced simulation tools for accurate grid modelling and security analysis. 02 The project […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Artelys2-644x398-c-default.png", award: false },
  { id: 7, title: "CleanerGrid Competition", url: "https://renewables-grid.eu/database/cleanergrid-competition/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2025, country: "Ireland", org: "EirGrid", desc: "EirGrid’s CleanerGrid competition invites third-level students across Ireland to develop creative solutions supporting the clean energy transition. Participants respond to a themed challenge, present to expert judges, and win prizes for themselves and their universities. By promoting collaboration, awareness, and innovation, the competition builds early engagement between EirGrid, academia, and future energy professionals while highlighting […]", img: "https://renewables-grid.eu/app/uploads/2025/10/EirGrid1-scaled-644x398-c-default.jpg", award: false },
  { id: 8, title: "Community Benefit Fund and The Growspace Network", url: "https://renewables-grid.eu/database/community-benefit-fund/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Scotland", org: "SSEN-D – Scottish and Southern Electricity Networks Distribution", desc: "SSEN Transmission, transmission operator for the North of Scotland, created Community Benefit Funds for each of their projects to support the development of the transmission network while delivering local benefits. Highlights 01 SSEN Transmission created both regional and local funds to ensure a fair distribution among communities. 02 The approach is built on a set […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2025_Database_SSEND_.CommunityBenefitFund1jpg-644x398-c-default.jpg", award: false },
  { id: 9, title: "Community Development Programme for education", url: "https://renewables-grid.eu/database/community-development-programme/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Germany", org: "Amprion", desc: "German TSO Amprion established a Community Development Programme to fund partnerships promoting equal education opportunities in its operational zone. Highlights 01 Collaborations are long-term to deliver lasting impact. 02 Amprion employees dedicate time to the programme’s projects, helping to ensure that the company’s engagement is meaningful for everyone involved. 03 The company organised an activity […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2026_Database_Amprion_CommunityDevelopmentProgramme1-scaled-644x398-c-default.jpg", award: false },
  { id: 10, title: "DSO/TSO Technopedia knowledge sharing platform", url: "https://renewables-grid.eu/database/dso-tso-technopedia/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2025, country: "Belgium", org: "DSO Entity,", desc: "DSO Entity and ENTSO-E have launched a platform for sharing knowledge on technologies and their real-world implementation in the energy system. The platform, Technopedia, provides factsheets on use-cases for distribution and transmission system operators and supports the uptake of technologies for the transition to low-carbon grids. Highlights 01 Provides open and accessible information on technologies […]", img: "https://renewables-grid.eu/app/uploads/2025/10/ENTSO-E_Website-screenshot1-644x398-c-default.png", award: false },
  { id: 11, title: "EDP Networks develops climate adaptation plan to strengthen Iberian power networks against extreme weather", url: "https://renewables-grid.eu/database/edp-networks-climate-adaptation-plan/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2025, country: "Europe", org: "EDP Networks,", desc: "EDP Networks (E-REDES in Portugal and Edp Redes España) developed a comprehensive Climate Adaptation Plan to strengthen the Iberian electricity distribution network against extreme winds, wildfires, floods, and snow. Using IPCC scenarios, the adaptation plan integrates climate risk into planning, operations, and nature-based management to ensure long-term network resilience. Highlights 01 Based on IPCC CMIP5 […]", img: "https://renewables-grid.eu/app/uploads/2025/11/image005-1-644x398-c-default.jpg", award: false },
  { id: 12, title: "EirGrid’s CP1300 Project Improving climate resilience across Ireland’s transmission network", url: "https://renewables-grid.eu/database/eirgrid-cp1300-climate-resilience/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2025, country: "Ireland", org: "EirGrid", desc: "EirGrid’s CP1300 Climate Adaptation Project is a nationwide programme addressing climate risks at substations and along transmission lines in Ireland. The initiative includes capital works flood-resilient infrastrucutre, upgrades of assets’ design standards, and the deployment of dynamic line rating devices. Highlights 01 Nationwide programme to enhance resilience of substations vulnerable to flooding, and other extreme […]", img: "https://renewables-grid.eu/app/uploads/2025/11/EirGrid_Brandmark_Col_RGB-2-1024x491.jpg", award: false },
  { id: 13, title: "ESB Networks builds flood-resilient substations across Ireland", url: "https://renewables-grid.eu/database/esb-networks-flood-resilient-substations/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2025, country: "Ireland", org: "ESB Networks", desc: "ESB Networks, the electricity distribution operator in Ireland, has developed a structured approach to mitigate flood risks for high-voltage (HV) substations. Using future climate projections (RCP 8.5 to 2050 and RCP 4.5 to 2100), the operator aims to enhance the resilience of substations against both pluvial (rain-induced) and fluvial (river-induced) flooding. ESB’s approach includes three […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2025_ESB-Networks_1.png", award: false },
  { id: 14, title: "Going Like the Wind An immersive and interactive exhibition for children", url: "https://renewables-grid.eu/database/going-like-the-wind-an-immersive-interactive-exhibition-for-children/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Offshore wind", year: 2025, country: "Belgium", org: "Elia", desc: "Going Like the Wind was an interactive exhibition at Fort Napoleon in Ostend that enabled children and families to explore how offshore wind energy is generated and transmitted to the mainland. Through storytelling, play frames, and digital displays, it explained the Princess Elisabeth Island and Belgium’s leadership in the blue economy. Its success led to […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Elia-Transmission-Belgium4-644x398-c-default.jpg", award: false },
  { id: 15, title: "Hollandse Kust Zuid SeaLab", url: "https://renewables-grid.eu/database/hollandse-kust-zuid-sealab/", brand: "RGI", dim: "Nature, People", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "Vattenfall", desc: "SeaLab, located at Hollandse Kust Zuid (HKZ) offshore wind farm, works together with scientists, NGOs and university partners on environmental pilot projects combined with strategic communications campaigns and stakeholder engagement. They aim to drive innovative scientific research while presenting offshore wind as a facilitator of biodiversity, circularity, and sustainable marine co-use. Highlights 01 The initiative […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 16, title: "HOPS completes climate risk assessment to guide future grid planning in Croatia", url: "https://renewables-grid.eu/database/hops-climate-risk-assessment-croatia/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2025, country: "Croatia", org: "HOPS", desc: "HOPS, the Croatian transmission system operator, finished its Climate Risk and Vulnerability Assessment (CR&VA) in September 2025. The study looks at how climate change could affect the Croatian transmission grid under two climate scenarios (RCP 4.5 and RCP 8.5) and across three future time periods up to 2100. The assessment identifies where the grid is […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 17, title: "Integrated Vegetation Management Through Resilient and Compatible Flora", url: "https://renewables-grid.eu/database/integrated-vegetation-management-through-resilient-and-compatible-flora/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2025, country: "Portugal", org: "E-REDES", desc: "E-REDES introduced Integrated Vegetation Management (IVM), with the purpose of benefitting biodiversity, delivering ecosystem services and promoting the safeguarding of safety distances between vegetation and lines. Working with CoLAB ForestWISE, the project has identified 107 low-flammability plant species that offer ecological and economic benefits. Supported by digital tools and pilot projects, the IVM activities seek […]", img: "https://renewables-grid.eu/app/uploads/2025/10/E-REDES4-644x398-c-default.jpg", award: false },
  { id: 18, title: "Landowner-stakeholder engagement conversations", url: "https://renewables-grid.eu/database/landowner-stakeholder-engagement-conversations/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Germany", org: "Amprion", desc: "Amprion’s Landowner and Stakeholder Engagement Conversations offer early, one-on-one meetings with landowners affected by grid expansion. Using satellite imagery to discuss tower placement, participants can share feedback that may influence final planning. This confidential dialogue, before formal negotiations, helps identify issues, improve transparency, and reduce potential legal disputes. The approach strengthens trust, respects property rights, […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Amprion4-1-644x398-c-default.jpg", award: false },
  { id: 19, title: "MycoNest Biodegradable insect refuges for solar parks", url: "https://renewables-grid.eu/database/myconest/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Solar", year: 2025, country: "Hungary", org: "MycoNest", desc: "MycoNest is a project launched in Hungary which provides refuges for insects made from mycelium – a root-like structure of fungi – and agricultural residues. The lightweight, biodegradable hooked structures are designed to hang from renewable energy infrastructure such as solar panels, fences, or substations, converting them into hubs for insect biodiversity. Highlights 01 Insects […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 20, title: "Offshore wind toolbox for developers", url: "https://renewables-grid.eu/database/offshore-wind-toolbox-for-developers/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Offshore wind", year: 2025, country: "Belgium", org: "Elia", desc: "Elia group developed a new spatial planning tool and a five-step approach for a financing and funding framework through an offshore investment bank. By discussing and quantifying key levers, the practice supported sound decision making for sustainable offshore wind development. Elia Group also collaborated with over 50+ external stakeholders to enhance impact and ensure effective […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Elia-Group2-644x398-c-default.jpg", award: false },
  { id: 21, title: "Red Eléctrica develops wind map to strengthen Spain’s electricity infrastructure", url: "https://renewables-grid.eu/database/wind-map/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Wind", year: 2025, country: "Spain", org: "REE – Red Eléctrica de España", desc: "Red Eléctrica de España (REE), the Spanish TSO, developed a Wind Map for Spain’s territory to better understand wind-related risks to its electricity infrastructure. The project helps identify areas exposed to strong winds and guides decisions on where to build new lines or reinforce existing ones. By mapping local wind conditions, Red Eléctrica aims to […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 22, title: "Reef Enhancement for Scour Protection (RESP)", url: "https://offshore-coalition.eu/database-project/reef-enhancement-for-scour-protection-resp/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2025, country: "United Kingdom", org: "RWE and ARC marine", desc: "The RESP pilot project by RWE and ARC marine uses eco-engineered Reef cubes® as a 100% alternative to traditional rock scour protection, enhancing marine biodiversity while protecting offshore infrastructure. The target species include encrusting and reef forming species likemolluscs,anemonesandalgae, and associated fauna likecrustaceanandfish.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/12/Image-5.jpeg", award: false },
  { id: 23, title: "RTE raises flandres maritime substation to protect against coastal flooding", url: "https://renewables-grid.eu/database/rte-flandres-substation/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Offshore wind", year: 2025, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE reconstructed the Flandres Maritime substation in northern France with a raised platform to prevent coastal flooding. This measure improves resilience against sea-level rise and storm surges, ensuring the continuity of power supply in a vulnerable coastal area while preparing assets for future climate risks. Highlights 01 Substation platform raised by 60 cm to withstand […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 24, title: "Seeking safe skies for the Bearded Vulture", url: "https://renewables-grid.eu/database/seeking-safe-skies-for-the-bearded-vulture/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2025, country: "Netherlands", org: "REE – Red Eléctrica de España", desc: "The Spanish TSO Red Eléctrica de España and the NGO Foundation for the Conservation of the Bearded Vulture have introduced a project to provide safer habitat for the Bearded Vulture by installing bird diverters on grid infrastructure. The diverters are estimated to reduce collisions by 70%. Highlights 01 The installed bird diverters – rotating and […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Carlos-Sunyer_Red-Electrica-644x398-c-default.jpg", award: false },
  { id: 25, title: "Spanish TSO Red Eléctrica launches new website", url: "https://renewables-grid.eu/database/spanish-tso-red-electrica-launches-new-website/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2025, country: "Netherlands", org: "REE – Red Eléctrica de España", desc: "The TSO Red Eléctrica has launched a new website in Spanish and English aimed at improving its external communication, with features including interactive tools and datasets, and outlining its role in Spain’s energy transition. Web traffic has grown following the launch of the new website. Highlights 01 The new website features interactive tools, including a […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Pantallazo_2_Especial_Operacion_MegaMenuENG-644x398-c-default.png", award: false },
  { id: 26, title: "Strategic Spatial Energy Plan Methodology Planning Great Britain’s energy system", url: "https://renewables-grid.eu/database/strategic-spatial-energy-plan-ssep-methodology/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Offshore wind", year: 2025, country: "United Kingdom", org: "NESO", desc: "NESO’s Strategic Spatial Energy Plan (SSEP) methodology establishes a national framework to plan Great Britain’s energy system from 2030 to 2050. Integrating electricity and hydrogen generation and storage across land and sea, it combines economic, spatial, environmental, and societal modelling. With feedback from over 130 stakeholders, the methodology delivers a transparent, data-driven process for identifying […]", img: "https://renewables-grid.eu/app/uploads/2025/10/B2L-NESO-ControlRoom-21.08.24-215-2-scaled-644x398-c-default.jpg", award: false },
  { id: 27, title: "StromGedacht Empowering citizens to support the energy transition through real-time grid signals", url: "https://renewables-grid.eu/database/stromgedacht-empowering-citizens-to-support-the-energy-transition-through-real-time-grid-signals/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2025, country: "Germany", org: "TransnetBW", desc: "StromGedacht is an app by TransnetBW that informs citizens about the electricity grid’s status in real time using a simple traffic light system. It helps households and smart devices adapt their electricity use to renewable energy availability, stabilising the grid and reducing CO₂ emissions. Through transparency and engagement, it turns passive consumers into active participants […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2009_Database_Elia_ProactiveApproachforRandstad380.png", award: false },
  { id: 28, title: "Supporting biodiversity in the North Sea Fish hotels on offshore high-voltage stations", url: "https://renewables-grid.eu/database/supporting-biodiversity-in-the-north-sea-with-fish-hotels-on-offshore-high-voltage-stations/", brand: "RGI", dim: "", topic: "Nature Conservation & Restoration", inf: "", year: 2025, country: "Netherlands", org: "TenneT", desc: "TenneT is installing ‘fish hotels’ on offshore high-voltage stations (OHVS) to support biodiversity in the North Sea. The structures provide protection from marine predators and foraging areas for juvenile fish of species like cod, pouting, mackerel and pollack. Insights on the success of the fish hotels may be used to assess the feasibility and usefulness […]", img: "https://renewables-grid.eu/app/uploads/2025/10/TenneT3-644x398-c-default.jpg", award: false },
  { id: 29, title: "TenneT strengthens grid resilience to flooding in the Netherlands", url: "https://renewables-grid.eu/database/tennet-grid-resilience-flooding/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "TenneT", desc: "TenneT Netherlands (the Dutch TSO) is strengthening its electricity grid against coastal flooding, fluvial flooding and sea level rise by raising critical parts of substations and designing overhead masts that can handle events of extreme high water-levels. These measures help ensure reliable power even during floods or projected sea-level rise, protecting essential infrastructure in vulnerable […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 30, title: "Terna develops Pole-Mounted Switchgear to improve grid resilience and flexibility", url: "https://renewables-grid.eu/database/terna-pole-mounted-switchgear/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2025, country: "Italy", org: "Terna", desc: "Terna developed Pole-Mounted Switchgear (OMP) to strengthen grid flexibility and resilience, particularly in areas with rigid “T” junctions where traditional connections or new stations are difficult to implement. By integrating compact, remotely controlled switchgear and electrical equipment into a new innovative support, the OMP enables maintenance and fault management without disrupting entire backbone lines, ensuring network […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 31, title: "Undergrounding for communities", url: "https://renewables-grid.eu/database/undergrounding-for-communities/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2025, country: "Spain", org: "I-DE", desc: "For a new electricity line in Osa de la Vega, i-DE opted for undergrounding the line to minimise impact on communities and maximise social and environmental benefits. Highlights 01 Undergrounding allowed to reduce disruptions for residents. 02 Bird electrocutions and forest fires caused by overhead lines were avoided. 03 After the works, the area was […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2025_Database_Iberdrola_UndergroundingforCommunities1-644x398-c-default.jpg", award: false },
  { id: 32, title: "Unlocking 25%+ grid capacity", url: "https://renewables-grid.eu/database/unlocking-25-grid-capacity/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2025, country: "Norway", org: "Arne Brudflad Svendsen and Tørris Digernes", desc: "Arne Brudflad Svendsen and Tørris Digernes have developed a real-time probabilistic forecasting tool, Promaps Realtime, that continuously assesses grid capacity and operational risk, now supporting Norway’s Maksgrid initiative to boost utilisation by 25%. It predicts congestion, faults and weather stress, guiding renewable and flexibility planning. Compatible with existing SCADA systems, it improves TSO-DSO coordination and […]", img: "https://renewables-grid.eu/app/uploads/2025/10/InfiniGrid3-644x398-c-default.png", award: false },
  { id: 33, title: "Using AI for nature-conscious vegetation management below overhead lines", url: "https://renewables-grid.eu/database/using-ai-for-nature-conscious-vegetation-management-below-overhead-lines/", brand: "RGI", dim: "Nature, Technology", topic: "Integrated Vegetation Management, Monitoring & Reporting", inf: "Grids", year: 2025, country: "Germany", org: "Amprion", desc: "SAMS (Sustainable AI-driven Management of Vegetation and Ecological Systems) by E.ON in Sweden focuses on using AI – drawing on GIS-based tools, satellite imagery, species databases and weather APIs – to sustainably manage vegetation in corridors below overhead power lines. The project has supported 400 interventions in corridors and and 100’s of hours of ecological […]", img: "https://renewables-grid.eu/app/uploads/2025/10/E.On3_-644x398-c-default.jpeg", award: false },
  { id: 34, title: "WIMBY Wind Farm Planning and Participation Tools", url: "https://renewables-grid.eu/database/wimby-wind-farm-planning-and-participation-tools/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Offshore wind", year: 2025, country: "Netherlands", org: "Utrecht University,", desc: "WIMBY has developed free, interactive tools to support inclusive planning and public engagement for wind energy projects. Combining an online map, a forum, and an immersive 3D platform, WIMBY enables users to explore impacts such as noise, biodiversity, and visual change. Co-created with stakeholders, the tools foster collaboration, improve understanding, and help identify socially acceptable […]", img: "https://renewables-grid.eu/app/uploads/2025/10/Luis-Ramirez-Camargo1-644x398-c-default.jpg", award: false },
  { id: 35, title: "Better consideration of biodiversity in vegetation management contracts", url: "https://renewables-grid.eu/database/better-consideration-of-biodiversity-in-vegetation-management-contracts/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2024, country: "France", org: "RTE", desc: "RTE aims to reduce the environmental impact of its vegetation management practices by ceasing certain activities during sensitive periods from March to August by 2029. This initiative includes revising contract methodologies, implementing fair compensation systems, and providing supplier support to align business models with new ecological objectives.", img: "https://renewables-grid.eu/app/uploads/2025/09/RTE_Photo_1-644x398-c-default.jpg", award: true },
  { id: 36, title: "Bird Protection System", url: "https://renewables-grid.eu/database/bird-protection-system-2/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Onshore wind", year: 2024, country: "Poland", org: "Bioseco", desc: "The Bioseco Bird Protection System (BPS) minimises bird mortality at wind farms by using visual modules and advanced algorithms. It detects birds, tracks their flight paths, and activates deterrent measures to prevent collisions with turbine blades. This innovative solution helps wind farms operate more sustainably with less risk to avian biodiversity and reduce the need for constant downtime of wind turbines.", img: "https://renewables-grid.eu/app/uploads/2025/09/BIOSECO_Photo_4-644x398-c-default.jpg", award: true },
  { id: 37, title: "Building resilient communities and healthcare through renewables", url: "https://renewables-grid.eu/database/building-resilient-communities-and-healthcare-through-renewables/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2024, country: "Peru", org: "Ecoswell", desc: "EcoSwellis a Peruvian NGO which implements renewable energy projects with vulnerable communities in a participatory way. They take a bottom-up approach to design bespoke systems and train end users for sustainable long-term use. Recently, EcoSwell installed a solar-PV based uninterrupted power supply (UPS) system in a central Medical Centre in Talara, Peru, allowing staff to safeguard vaccines. Other projects include a hybrid micro-grid system, residential energy consultations and PV systems...", img: "https://renewables-grid.eu/app/uploads/2025/09/Ecoswell3-644x398-c-default.jpg", award: true },
  { id: 38, title: "Bye-Bye Paper Floods: Digital Energy Transition with the SuedLink Portal", url: "https://renewables-grid.eu/database/bye-bye-paper-floods-digital-energy-transition-with-the-suedlink-portal/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Germany", org: "TransnetBW", desc: "The SuedLink portal, developed by TransnetBW, enables digital communication and contract processing with property owners involved in electricity grid expansion. The portal reduces paperwork, accelerates procedures, and enhances transparency. This innovation enhances stakeholder engagement and is poised to scale for broader use across other energy projects.", img: "https://renewables-grid.eu/app/uploads/2026/03/2009_Database_Elia_ProactiveApproachforRandstad380.png", award: true },
  { id: 39, title: "e-faunalert Mobile Application", url: "https://renewables-grid.eu/database/e-faunalert-mobile-application-2/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "Europe", org: "IUCN – International Union for Conservation of Nature", desc: "The e-faunalert mobile application, developed by the IUCN Centre for Mediterranean Cooperation, enables users to collect data on power line structures and wildlife mortality. By providing a standardised platform for reporting, the app facilitates identification of high-risk areas and promotes effective conservation strategies to protect wildlife from electrocution and collision with power lines.", img: "https://renewables-grid.eu/app/uploads/2025/09/IUCN_Photo_1-644x398-c-default.jpg", award: true },
  { id: 40, title: "EirGrid Community Forum", url: "https://renewables-grid.eu/database/eirgrid-community-forum/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Ireland", org: "EirGrid", desc: "The EirGrid Community Forums foster early and meaningful community involvement in grid infrastructure projects across Ireland. Independently facilitated and democratically elected, the Forums ensure inclusive representation, transparent dialogue, and shared decision-making from project inception to implementation. This engagement strategy promotes social acceptance, resulting in successful project delivery and long-term community benefits.", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Picture_2-644x398-c-default.jpg", award: true },
  { id: 41, title: "EirGrid’s Community Benefit Fund", url: "https://renewables-grid.eu/database/community-benefit-fund-2/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2024, country: "Ireland", org: "EirGrid", desc: "For each of the EirGrid’s strategic infrastructure projects, the Irish TSO’s Community Benefit Funds delivers lasting benefits to communities by supporting local projects. EirGrid is putting communities at the heart of engagement by delivering a benefit scheme and establishing a community forum to ensure that fund is designed for the local community by the local […]", img: "https://renewables-grid.eu/app/uploads/2020/02/EirGrid-Picture2-644x398-c-default.jpg", award: false },
  { id: 42, title: "EmPOWER Your Environment", url: "https://renewables-grid.eu/database/empower-your-environment/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Poland", org: "PSE", desc: "PSE launched the EmPOWER Your Environment programme in 2019 to support local communities near transmission infrastructure projects in Poland. Through micro-grants to local authorities, NGOs and community groups, the initiative has funded over 1,050 projects across 244 communes in 15 voivodeships, with a budget of approximately EUR 5 million. Projects range from renewable energy installations to educational facility upgrades, fostering environmental stewardship and increasing acceptance of transmission infrastructure.", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 43, title: "Environmentally Friendly and Cost-Effective Bird Protection", url: "https://renewables-grid.eu/database/environmentally-friendly-and-cost-effective-bird-protection/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "TenneT’s project in Wageningen, Netherlands, aims to reduce bird collisions with high-voltage lines by using drones to install Firefly wire markers. This innovative method is more environmentally friendly and cost-effective compared to traditional techniques. An important reason for TenneT to apply bird markings with drones was that this did not affect the soil stability of the ground under the connection.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__Photo_1-min-scaled-644x398-c-default.jpg", award: true },
  { id: 44, title: "First Grid-Forming 300 MVAr STATCOM in Germany", url: "https://renewables-grid.eu/database/first-grid-forming-300-mvar-statcom-in-germany/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Grids", year: 2024, country: "Germany", org: "Amprion", desc: "Amprion’s STATCOM Opladen project addresses future grid stability challenges with reactive power support and grid-forming control. It operates nearly independently of short-circuit power levels, ensuring a stable 400 kV grid under a variety of scenarios. The project sets the foundation for future grid-forming solutions and contributes to the safe and robust integration of renewables into the transmission grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/Amprion_Photo_1-644x398-c-default.jpg", award: true },
  { id: 45, title: "Grid Orchards: Promoting Heritage ‘Ermelo’ Oranges in Grid Corridors", url: "https://renewables-grid.eu/database/grid-orchards-promoting-heritage-ermelo-oranges-in-grid-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2024, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "REN’s project preserves the endangered and culturally important Ermelo orange trees within powerline Right-of-Way corridors, converting them into productive agricultural spaces. This approach mitigates environmental impacts, enhances biodiversity, and strengthens relationships with local communities while promoting sustainable landscape management.", img: "https://renewables-grid.eu/app/uploads/2025/09/REN_Photo_2-min-644x398-c-default.jpg", award: true },
  { id: 46, title: "Grupo Motor: Local Communities Collaborating Towards the Energy Transition", url: "https://renewables-grid.eu/database/grupo-motor/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2024, country: "Spain", org: "Red Eléctrica", desc: "Red Eléctrica, a subsidiary of Redeia, has promoted the creation of the Grupo Motor for Territorial Development of the Energy Transition unites regional organisations to accelerate Spain’s decarbonisation. Through collaboration, the group fosters renewable energy projects, engages local communities, and promotes energy efficiency, aligning with 2030 NECP, Paris Agreement, and EU Green Deal goals.", img: "https://renewables-grid.eu/app/uploads/2025/09/Redeia_Photo_3-644x398-c-default.png", award: true },
  { id: 47, title: "Hydrogen-Powered Drill for Emission-Free Installation of HV Cables", url: "https://renewables-grid.eu/database/hydrogen-powered-drill-for-emission-free-installation-of-hv-cables/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2024, country: "Netherlands", org: "TenneT", desc: "TenneT successfully completed emission-free drilling for a high-voltage grid enforcement project in a sensitive area for nature and people using hydrogen. With this hydrogen drilling pilot, the only nitrogen emissions emitted were those from the trucks that transport the hydrogen to the construction site while disturbances from noise and smell were also minimised.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__H2_Photo_1-scaled-644x398-c-default.jpg", award: true },
  { id: 48, title: "Investing in trust", url: "https://renewables-grid.eu/database/investing-in-trust/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2024, country: "Belgium", org: "Elia", desc: "Following a storm in Mechelen, Belgium, during which pylons fell and damaged houses, Belgian TSO Elia invested in communities to build trust, leading to cooperation with residents to better overcome the incident. Highlights 01 Residents reduced their electricity consumption to support grid restoration works. 02 Elia’s team was present on site to provide information and […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2024_Database_Elia_InvestinginTrust3-644x398-c-default.jpg", award: false },
  { id: 49, title: "LIFE Safe Grid for Burgas", url: "https://renewables-grid.eu/database/life-safe-grid-for-burgas/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "Bulgaria", org: "Elektrorazpredelenie Yug", desc: "The “LIFE Safe Grid for Burgas” project, funded by the LIFE programme of the European Union, aims to conserve threatened bird species in the Burgas Lakes region by preventing unnatural mortality caused by electrocution and collision with power lines. This is achieved through the installation of bird flight diverters, insulating hazardous pylons, and converting overhead power lines to underground cables, reducing bird deaths and power disruptions.", img: "https://renewables-grid.eu/app/uploads/2025/09/LIFE_Burgas_3-644x398-c-default.jpg", award: true },
  { id: 50, title: "Moonshot", url: "https://renewables-grid.eu/database/moonshot/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Offshore wind", year: 2024, country: "Netherlands", org: "ECHT regie in transitie", desc: "The Moonshot practice fosters collaboration between academia, policy, and industry to enhance the sustainability of the wind sector. By using an inclusive approach, it successfully incorporated circularity into offshore wind tenders in the Netherlands and created valuable partnerships. The practice leads to industry-wide change and offers scalability for future applications also in other domains.", img: "https://renewables-grid.eu/app/uploads/2025/09/ECHT_Regie_Photo_1-scaled-644x398-c-default.jpg", award: true },
  { id: 51, title: "Nature-inclusive design approach planned for the Princess Elisabeth Island", url: "https://renewables-grid.eu/database/nature-inclusive-design-approach-planned-for-the-princess-elisabeth-island/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Elia", desc: "Elia’s nature-inclusive design approach (NID) to the Princess Elisabeth Island demonstrates how offshore renewables can be developed hand-in-hand with biodiversity enhancement. Six NID measures, developed with experts, will be installed during the construction of the artificial energy hub to boost marine life around it. The island will advance Europe’s energy goals in a sustainable manner, serving as an example for future electricity infrastructure projects.", img: "https://renewables-grid.eu/app/uploads/2024/11/Elia_Photo-2-644x398-c-default.jpg", award: true },
  { id: 52, title: "Nature4Networks project Examining the value of nature-based solutions for climate hazards in electricity infrastructure", url: "https://renewables-grid.eu/database/the-nature4networks-project/", brand: "RGI", dim: "Nature, Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2024, country: "", org: "SSEN-D – Scottish and Southern Electricity Networks Distribution", desc: "The Scottish and Southern Electricity Networks Distribution (SSEN-D) explored the value and benefits that can be drawn from nature-based solutions (NbS) for electricity distribution infrastructure to tackle climate change hazards, comparing them to benefits from conventional solutions. Highlights 01 Assessing the value (feasibility, costs and benefits) of nature-based solutions compared to conventional (engineered) options for […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2024_database_SSEN-D_Nature4Networks2-644x398-c-default.png", award: false },
  { id: 53, title: "Open Energy Modelling Initiative (openmod)", url: "https://renewables-grid.eu/database/open-energy-modelling-initiative-openmod/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2024, country: "Worldwide", org: "Open Energy Modelling Initiative", desc: "The Open Energy Modelling Initiative (openmod) promotes open science principles, supporting energy system decarbonisation through transparent data sharing, modelling tools, and fostering global research collaboration. Workshops and a 1,400-member forum ensure widespread participation and knowledge exchange.", img: "https://renewables-grid.eu/app/uploads/2025/09/Openmod_Photo_4-644x398-c-default.jpeg", award: true },
  { id: 54, title: "Resilient ecosystems development on Princess Elisabeth Island", url: "https://renewables-grid.eu/database/resilient-ecosystems-development-on-princess-elisabeth-island/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2024, country: "Belgium", org: "Ocean Ecostructures", desc: "The project aims to turn the foundation of Princess Elisabeth Island, the world’s first artificial energy island, into a giant artificial reef. Ocean Ecostructures will install 450 of their Life Boosting Units (LBUs) by 2026, which aim to promote ecosystem formation and boost marine biodiversity with innovative technology and monitoring systems. The number of LBUs could grow to 2.000 in a second phase.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: true },
  { id: 55, title: "Virtual Presentation of Grid Projects and Environmental Constraints", url: "https://renewables-grid.eu/database/virtual-presentation-of-grid-projects-and-environmental-constraints/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Grids", year: 2024, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "The VeR project by REN revolutionises the presentation of grid infrastructure and their environmental constraints during field visits with the use of augmented reality (AR). The mobile application and complementing web application enhance project management, resulting in improved decision-making and increased stakeholder trust through clear, integrated visualisation of project impacts.", img: "https://renewables-grid.eu/app/uploads/2025/09/REN_Photo_2-644x398-c-default.jpg", award: true },
  { id: 56, title: "Visualising Power Line Planning for Stakeholders in 3D", url: "https://renewables-grid.eu/database/visualising-power-line-planning-for-stak/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Grids", year: 2024, country: "Germany", org: "TenneT", desc: "The Fulda-Main-Leitung project uses an innovative 3D mapping application to visualise the planning of power lines, enhancing stakeholder engagement and transparency. The tool integrates geospatial data, making complex planning details accessible to the public and stakeholders, thus improving decision-making and reducing resistance.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT__Photo_1-644x398-c-default.jpeg", award: true },
  { id: 57, title: "ALEGrO Soil Monitoring Approach", url: "https://renewables-grid.eu/database/alegro-soil-monitoring-approach/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "Extra-high voltage (EHV) underground cables are an inherent part of the German energy transition. Still, they are controversial among the public, affected farmers, and organizations due to thermal losses and potential effects on surrounding soils and crop yield. This practice uses the 320 kV-DC-Transmission line “ALEGrO” to measure and evaluate the consequence of the EHV underground cable operation to surrounding soils for the first time under real conditions.", img: "https://renewables-grid.eu/app/uploads/2025/09/Amprion-Alegro1-scaled-644x398-c-default.jpg", award: true },
  { id: 58, title: "AVISTEP – the Avian Sensitivity Tool for Energy Planning", url: "https://renewables-grid.eu/database/avistep-the-avian-sensitivity-tool-for-energy-planning/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Energy system", year: 2023, country: "Worldwide", org: "BirdLife", desc: "AVISTEP, developed by Birdlife International, was unveiled in 2022, emerging as a pivotal tool for global energy system planning, specifically gauging bird sensitivity to RES infrastructure like onshore and offshore wind farms, solar photovoltaic systems, and powerlines (high voltage transmission lines and lower voltage distribution lines). As the largest nature partnership in the world, Birdlife International uses the best available data and local experts to create robust sensitivity maps....", img: "https://renewables-grid.eu/app/uploads/2025/09/Birdlife_AVISTEP_20_PIC_1-644x398-c-default.jpg", award: true },
  { id: 59, title: "BioReef", url: "https://offshore-coalition.eu/database-project/bioreef/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2023, country: "Denmark", org: "Ørsted, DTU Aqua, WWF Denmark", desc: "Develop and scale up methods, tools, and protocols to restore biogenic reefs ofEuropean flat oystersandhorse musselsin Danish waters at historical sites.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/04/IMG_0150-scaled.jpg", award: false },
  { id: 60, title: "Bird Mortality Risk: Conflict Mapping of Birds and the Grid in Hungary", url: "https://renewables-grid.eu/database/bird-mortality-risk-conflict-mapping-of-birds-and-the-grid-in-hungary/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2023, country: "Hungary", org: "MME Hungary", desc: "Among urban and rural landscapes, powerlines (high to low voltages) still cause bird mortality by electrocution or collision. In 2008,MME Hungary, the national TSO, and five other DSOs conducted a study to understand the interaction between birds and powerlines. The outcomes were the development of conflict maps to identify the most critical powerlines and the creation of a timeline to implement those bird-friendly innovations.", img: "https://renewables-grid.eu/app/uploads/2025/09/hungarypic1-644x398-c-default.jpg", award: false },
  { id: 61, title: "Building a resilient ecological network of conserved areas across Europe", url: "https://renewables-grid.eu/database/building-a-resilient-ecological-network-of-conserved-areas-across-europe/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Energy system", year: 2023, country: "Europe", org: "NaturaConnect", desc: "NaturaConnect, anEU Horizon Europefunded project brings together 22 partner institutions from 15 EU countries and the United Kingdom to develop the Trans-European Nature Network (TEN-N). Their work encompasses projects at national, subnational, and transboundary level, with learnings from different case studies being applied to understand the nature conservation targets in EU. The project is jointly coordinated by the International Institute for Applied System Analysis (IIASA), the German...", img: "https://renewables-grid.eu/app/uploads/2025/09/9c210890-5ea1-e351-3ea2-8dd9539f5d97-644x398-c-default.jpg", award: false },
  { id: 62, title: "Cable Protection & Stabilisation with ECOncrete Marine Mattresses", url: "https://offshore-coalition.eu/database-project/cable-protection-stabilisation-with-econcrete-marine-mattresses/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2023, country: "USA", org: "ECOncrete and Prysmian", desc: "To protect and stabilise subsea power cables while creating habitats that support marine biodiversity within offshore wind infrastructure.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/02/2-ECOncrete-Marine-Mattress-Naomie-Lecard.jpeg", award: false },
  { id: 63, title: "CEEweb – Collaborating to advocate for resilient ecosystems", url: "https://renewables-grid.eu/database/ceeweb-collaborating-to-advocate-for-resilient-ecosystems/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2023, country: "Europe", org: "CEEweb for Biodiversity", desc: "CEEweb for Biodiversityis a network spanning across central and eastern Europe countries, focusing on conservation of biodiversity through the promotion of sustainable development. Their work is primarily through advocacy, networking with and influencing decision-makers, implementing national and transnational projects, and carrying out capacity-building and raising awareness activities.", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2023-11-29_at_20.01.41-644x398-c-default.png", award: true },
  { id: 64, title: "Community Liaison Coordinators", url: "https://renewables-grid.eu/database/community-liaison-coordinators/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2023, country: "Spain", org: "REE – Red Eléctrica de España", desc: "In the context of the Salto de Chira infrastructure project in the Canary Islands, Spanish TSO Red Eléctrica provided the impacted communities with multiple types of local benefits. The need for these benefits was identified with the help of Community Liaison Coordinators deployed directly on site. Highlights 01 Community Liaison Coordinators were responsible for communicating […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2026_Database_REE_CommunityLiasonCoordinators1-644x398-c-default.png", award: false },
  { id: 65, title: "Cooperation and new business for grid operators with OneNet Data Connector", url: "https://renewables-grid.eu/database/cooperation-and-new-business-for-grid-operators-with-onenet-data-connector/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "Europe", org: "Fraunhofer Institute for Applied Information Technology", desc: "Considering the increasing need for grid balancing and flexibility, as well as the crucial role digitalisation will play as the energy transition advances, Fraunhofer developed the OneNet Data Connector in partnership with several stakeholders in the energy market. OneNet is an open architecture to integrate innovative markets and grid operation, ensuring economic viability both at TSO and DSO level and enabling a holistic view of the system as integrated infrastructure.", img: "https://renewables-grid.eu/app/uploads/2025/09/Fraunhofer_GRIFOn_Concept_1-644x398-c-default.jpg", award: true },
  { id: 66, title: "Coordinated reactive power exchange between transmission and distribution grid", url: "https://renewables-grid.eu/database/coordinated-reactive-power-exchange-between-transmission-and-distribution-grid/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "German TSO Amprion embarked on a coordinated reactive power exchange with Germany’s biggest DSO E.ON. The aim of the practice is to make a joint contribution to the fundamental transformation of the energy system by quickly and cost-effectively improving voltage stability in the transmission grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/Amprion_power-exchange_1-644x398-c-default.jpg", award: true },
  { id: 67, title: "Decision Support System – Increasing Infrastructure Resilience to Wildfires", url: "https://renewables-grid.eu/database/decision-support-system-increasing-infrastructure-resilience-to-wildfires/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2023, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "This practice is composed of a network of multi-sensorial monitoring systems for the automatic detection of wildfires and a Decision Support System (DSS), which simulates fire spread and alerts where and when it will impact the electric or gas infrastructures. The developed monitoring systems report meteorological data and the detection of wildfires through multi-spectral cameras installed on the top of the electric pylons.", img: "https://renewables-grid.eu/app/uploads/2025/09/REN-Award231-644x398-c-default.jpg", award: true },
  { id: 68, title: "Ecological corridor management in overhead line corridors", url: "https://renewables-grid.eu/database/ecological-corridor-management-in-overhead-line-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Europe", org: "E.ON", desc: "E.ONalready started the implementation of ecological vegetation management in their high-voltage grid corridors a few decades ago, having realised that intensive clear cutting is not the only and not always the most effective way to prevent vegetation interference with power lines. Instead, by selectively removing only fast-growing species of trees and bushes and foster slower-growing ones, they preserve valuable biotopes, promote biodiversity, reduce maintenance costs in the long run, and...", img: "https://renewables-grid.eu/app/uploads/2025/09/EON_IVM-Award4-644x398-c-default.jpg", award: true },
  { id: 69, title: "EconiQ retrofill for gas-insulated lines ELK-3, 420 kV", url: "https://renewables-grid.eu/database/econiq-retrofill-for-gas-insulated-lines-elk-3-420kv/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2023, country: "Switzerland", org: "Hitachi Energy", desc: "Hitachi’s EconiQ retrofill solution replaces sulfur hexafluoride (SF6) in installed high-voltage gas-insulated lines and gas-insulted switchgear with an eco-efficient gas mixture to significantly lower the carbon footprint over the total installation life cycle. EconiQ retrofill eliminates the emissions of SF6 and the associated carbon footprint and avoids the costly decommissioning and replacement of equipment. Highlights […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Hitachi_EconiQ1-scaled-644x398-c-default.jpeg", award: true },
  { id: 70, title: "EconiQ retrofill for gas-insulated lines ELK-3, 420kV", url: "https://renewables-grid.eu/database/econiq-retrofill-for-gas-insulated-lines-elk-3-420kv/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "", year: 2023, country: "Switzerland", org: "Hitachi Energy", desc: "Hitachi’s EconiQ retrofill solution replaces sulfur hexafluoride (SF6) in installed high-voltage gas-insulated lines and gas-insulted switchgear with an eco-efficient gas mixture to significantly lower the carbon footprint over the total installation life cycle. EconiQ retrofill eliminates the emissions of SF6 and the associated carbon footprint and avoids the costly decommissioning and replacement of equipment. Highlights […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Hitachi_EconiQ1-scaled-644x398-c-default.jpeg", award: false },
  { id: 71, title: "EcoWatt", url: "https://renewables-grid.eu/database/ecowatt/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "The French Transmission System Operator (TSO), RTE, developed the EcoWatt system in collaboration with the French Agency for Ecological Transition, ADEME, to reduce instability in the grid. The system signals the level of tension for supply-demand balance within the power system. RTE’s objective is to encourage rapid mobilisation on the most stressful days and hours, by guiding each type of consumer towards the most effective eco-actions, ensuring a secure flow of electricity.", img: "https://renewables-grid.eu/app/uploads/2025/09/RTE_Ecowatt_3-644x398-c-default.jpg", award: true },
  { id: 72, title: "Electrocutions & Collisions of Birds in EU Countries: An Overview Report", url: "https://renewables-grid.eu/database/electrocutions-collisions-of-birds-in-eu-countries-an-overview-report/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Energy system", year: 2023, country: "Europe", org: "NABU – Naturschutzbund Deutschland", desc: "The intersection of powerlines and bird mortality presents a pressing concern within avian conservation. Countless birds die every year through collisions or electrocutions with electricity infrastructure, highlighting the need for bird-friendly designs and an overview of what mitigations measures works best. Therefore, theNature and Biodiversity Conservation Union/Birdlife Germany (NABU)commissioned a meta-analysis of European bird-friendly practices and infrastructure design to address...", img: "https://renewables-grid.eu/app/uploads/2025/09/RPS_Line_Markers-644x398-c-default.jpg", award: false },
  { id: 73, title: "Energy Compass Application", url: "https://renewables-grid.eu/database/energy-compass-application/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2023, country: "Poland", org: "PSE", desc: "Polskie Sieci Elektroenergetyczne’s (PSE), the Polish Transmission System Operator (TSO), developed the Energy Compass project to support users, especially households, to responsibly plan their electricity consumption. It is comprised of a few elements: the app, an educational campaign, the website, and widgets on PSE’s corporate website. Its main goal is to educate users on how to support the operation of the National Power System, by actively adjusting their energy consumption to the...", img: "https://renewables-grid.eu/app/uploads/2025/09/PSE_App1-644x398-c-default.png", award: true },
  { id: 74, title: "Increasing the Rate of Change of Frequency limit to +/– 1 Hz/s", url: "https://renewables-grid.eu/database/increasing-the-rate-of-change-of-frequency-limit-to-1-hz-s/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2023, country: "Ireland", org: "EirGrid", desc: "One of EirGrid’s and SONI’s key tasks as Transmission System Operators is to maintain balance between electricity supply and demand. EirGrid and SONI as TSOs faced a challenge in enabling the growth of renewable energy on the system so they worked to create a technologicially innovative solution. The goal was to increase the instantaneous non-synchronous […]", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Award20232-644x398-c-default.jpg", award: false },
  { id: 75, title: "Increasing the Rate of Change of Frequency limit to ± 1 Hz/s", url: "https://renewables-grid.eu/database/increasing-the-rate-of-change-of-frequency-limit-to-1-hz-s/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "", org: "EirGrid", desc: "One of EirGrid’s and SONI’s key tasks as Transmission System Operators is to maintain balance between electricity supply and demand. EirGrid and SONI as TSOs faced a challenge in enabling the growth of renewable energy on the system so they worked to create a technologicially innovative solution. The goal was to increase the instantaneous non-synchronous renewable generation penetration limit. This is a key enabler for delivering a cleaner energy future.", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Award20232-644x398-c-default.jpg", award: true },
  { id: 76, title: "InterBDL Project Ulm Netze evaluates climate vulnerability of power infrastructure", url: "https://renewables-grid.eu/database/interbdl-project/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2023, country: "Germany", org: "Ulm Netze", desc: "Ulm-Netze is studying how heavy rainfall and surface water affect its medium and low-voltage substations. The project, part of the InterBDL national research initiative on bidirectional electromobility, focuses on assessing infrastructure vulnerability to extreme rainfall events in southern Germany. The goal is to identify risks and prepare adaptation standards for future use across the utility’s […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2025_Database_REN_EnhancingInfrastructureResilience.png", award: false },
  { id: 77, title: "Nature and Species Conservation in Amprion Grids", url: "https://renewables-grid.eu/database/nature-and-species-conservation-in-amprion-grids/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "German TSOAmprionaims to interfere with nature as little as possible, as many of their power lines pass through open landscapes, meadows, and forests. They implement IVM on approximately 9000 hectares, with IVM being applied to all suitable areas in the entire area with Amprion powerlines. Their ecologically driven strategy was initiated around 1994, where they initiated a technically and economically optimised form of ecological route maintenance.", img: "https://renewables-grid.eu/app/uploads/2025/09/Grafik_O__TM_todays-maintenance-principle-644x398-c-default.jpg", award: false },
  { id: 78, title: "Nature-positive cable protection to restore marine biodiversity", url: "https://renewables-grid.eu/database/nature-positive-cable-protection-to-restore-marine-biodiversity/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2023, country: "Spain", org: "Red Eléctrica", desc: "Red Eléctrica, the Spanish Transmission System Operator, used innovative technology to design a submarine cable protection system that allowed the restoration of a natural reef habitat between the islands of Fuerteventura and Lanzarote. The concrete blocks used to protect the subsea cable along a rock trench section were designed by incorporating ECOncrete’s bio-enhancing concrete technology. First results are already overwhelmingly positive and offer strong possibilities to transfer this...", img: "https://renewables-grid.eu/app/uploads/2025/09/Redeia1-644x398-c-default.jpg", award: true },
  { id: 79, title: "NorFlex", url: "https://renewables-grid.eu/database/norflex/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2023, country: "Norway", org: "Å Energi, Glitre Nett, NODES", desc: "On the pathway to meet decarbonisation targets, Norway is already at 50% electrification and facing a strained grid. To reduce this strain on the grid and avoid deploying more costly infrastructure, theNorFlexmarketplace was created to trade flexibility assets. This marketplace pays households and businesses to reduce consumption during peak demand times and sell surplus electricity back onto the grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/Nodes1-644x398-c-default.png", award: true },
  { id: 80, title: "Novel busbar protection scheme for impedance-earthed distribution networks", url: "https://renewables-grid.eu/database/novel-busbar-protection-scheme-for-impedance-earthed-distribution-networks/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2023, country: "Netherlands", org: "Delft University of Technology", desc: "This practice is an example of how existing infrastructure can be used to resolve problems resulting from single-phase-fault currents. Researchers used Impedance-Earthed Distribution (IED) infrastructure, backboned by an IEC 61850 communication, to create a distributed busbar protection scheme against single-phase-to-ground faults in medium-voltage impedance earthed distribution networks. Implemented by the DSO Stedin in the Netherlands, it also includes distributed protection algorithms for...", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: true },
  { id: 81, title: "Offshore Box on the North Sea Island Norderney", url: "https://renewables-grid.eu/database/offshore-box-on-the-north-sea-island-norderney/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2023, country: "Germany", org: "Amprion", desc: "German TSO Amprion transformed a mobile shipping container into an innovative information centre which aimed to provide comprehensive awareness regarding offshore drilling beneath the North Sea Island Norderney island and the need for offshore grid connections. This ‘Offshore Box’ aims to foster a nuanced understanding of the energy transition’s intricacies while also addressing the significance of network expansion projects.", img: "https://renewables-grid.eu/app/uploads/2025/09/Offshore-Box-2023-2-min-scaled-644x398-c-default.jpg", award: true },
  { id: 82, title: "Smart metering solution implementation in JSC ‘Sadales tīkls’", url: "https://renewables-grid.eu/database/smart-metering-solution-implementation-in-jsc-sadales-tikls/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2023, country: "Latvia", org: "Sadales tīkls", desc: "JSC ‘Sadales tīkls’ carried out one of the biggest digitalisation projects in Latvia. Within their smart metering programme, new generation smart electricity meters were installed for all Sadales tīkls’ customers, adding up to more than one million metering points. The data generated via this programme and the smarter energy management it allows, have led to […]", img: "https://renewables-grid.eu/app/uploads/2025/09/JSC-Sadales-tikls1-644x398-c-default.jpg", award: false },
  { id: 83, title: "Tennet’s Inspiration Guide", url: "https://renewables-grid.eu/database/tennets-inspiration-guide/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Germany", org: "TenneT", desc: "Tennet has released an Inspiration Guide, describing 56 different methods of conserving nature around its powerlines. In all these projects, nature-inclusive working is a key principle by respecting, protecting and, where possible, stimulating nature. This initiative has been realized based on the opinions expressed by residents to ensure renewable energy infrastructure doesn’t cause more damage to biodiversity. The Inspiration Guide works as a guide for project workers, authorities, contractors, local stakeholders, and others to ensure nature inclusive operation. The inspiration guide is a follow-up to the Landscape Guide released in 2022, with innovative designs for a qualitative spatial landscape integration of the high voltage grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/TenneT-Guide_1-644x398-c-default.png", award: false },
  { id: 84, title: "Ubiquitous Energy", url: "https://renewables-grid.eu/database/ubiquitous-energy/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2023, country: "United States", org: "Ubiquitous Energy", desc: "Ubiquitous Energy (UE) produces transparent solar windows that integrate renewable energy sources into the facade of homes and buildings in a seamless and aesthetically pleasing way. Their trademark UE Power harvests energy from infrared and ultraviolet light, while visible light passes through, thus making it possible to generate electricity invisibly.", img: "https://renewables-grid.eu/app/uploads/2025/09/Ubiquitous-Energy1-644x398-c-default.jpg", award: true },
  { id: 85, title: "Urban Farming in Power Transmission Networks", url: "https://renewables-grid.eu/database/urban-farming-in-power-transmission-networks/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2023, country: "Brazil", org: "Cities Without Hunger", desc: "Cities Without Hunger is a Brazilian NGO which works with grid operators and local communities to transform the unused areas around power lines into productive agricultural spaces. The lines are located on the poor suburbs of Brazilian cities and employ local people, thus providing jobs, tonnes of organic food at affordable prices, and improving the people’s relationship to the infrastructure.", img: "https://renewables-grid.eu/app/uploads/2025/09/Cities-without-hunger1-644x398-c-default.jpg", award: true },
  { id: 86, title: "VegeLine – Vegetation Management System", url: "https://renewables-grid.eu/database/vegeline-vegetation-management-system/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Slovenia", org: "ELES", desc: "ELES is Slovenia’s national transmission system operator. Their Vegetation Management System includes optimization tools and asset management software to integrate biodiversity protection with grid expansion. The tools help prevent harm to surrounding nature as well as disruption to power lines. Their initiative includes risk management of invasive species, easy integration with enterprise asset management software, and detailed analysis of the vegetation to improve land usage and reduce outages caused by trees near power grids.", img: "https://renewables-grid.eu/app/uploads/2025/09/ELES_VegeLine-644x398-c-default.png", award: false },
  { id: 87, title: "Vegetation Management in Rights of Way", url: "https://renewables-grid.eu/database/vegetation-management-in-rights-of-way/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Finland", org: "Fingrid", desc: "Fingrid Oyj is a Finnish national transmission system operator. Their vegetation management system focuses on careful maintenance of the rights of way with over 6000 hectares being cleared per year. A key initiative of their practice includes examining how to increase the use of decaying wood. Fingrid collaborates with landowners to create artificial snags near border zones where lesser value trees are left to decay, creating a natural habitat and nesting site for various insect and bird species. The project emphasises on maintaining a rights of way with border trees that help preserve natural habitats while protecting their power lines.", img: "https://renewables-grid.eu/app/uploads/2025/09/Fingrid-IVM_1-644x398-c-default.jpg", award: false },
  { id: 88, title: "Wild Bees Under Tension", url: "https://renewables-grid.eu/database/wild-bees-under-tension/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2023, country: "Switzerland", org: "Swissgrid", desc: "Wildbees population is slowly declining due to the lack of rough pastures and areas with thriving plant species. This reduces their food options and nesting possibilities. To increase their population,Swissgridsupports the creation of various habitats and expanding areas under powerlines to provide nesting sites.", img: "https://renewables-grid.eu/app/uploads/2025/04/Swissgrid_1-644x398-c-default.jpg", award: false },
  { id: 89, title: "XR@Transnet", url: "https://renewables-grid.eu/database/xrtransnet/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2023, country: "Germany", org: "TransnetBW", desc: "Using extended reality (XR), German TSO TransnetBW turns infrastructure projects into immersive experiences before they exist. The tool “XR@TransnetBW” can show what TransnetBW is planning, what it will look like and how it will feel once it’s finished. With these assets, the technology makes often abstract plans for infrastructure and its necessity tangible and clear, and therefore more accessible to a broader group of people.", img: "https://renewables-grid.eu/app/uploads/2025/09/XR@Transnet1-scaled-644x398-c-default.jpg", award: true },
  { id: 90, title: "3D-printed reefs to help restore marine biodiversity in the Kattegat, Denmark", url: "https://offshore-coalition.eu/database-project/3d-printed-reefs-kattegat-denmark/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "Denmark", org: "Ørsted and WWF Denmark", desc: "To test how 3D-printed reefs can enhance marine biodiversity, by attracting various marine species, providing refuge and feeding grounds forcod stocks, among others.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/93A6786-scaled.jpg", award: false },
  { id: 91, title: "50Hertz Maintenance Plan for Mahlpfuhler Fenn", url: "https://renewables-grid.eu/database/50hertz-maintenance-plan-for-mahlpfuhler-fenn/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2022, country: "Germany", org: "50Hertz", desc: "The Integrated Vegetation Management Plan of 50Hertz involves a maintenance plan in the EU protected area/FFH area “Mahlpfuhler Fenn” in north of Madgeburg. As a bird sanctuary and natural reserve, the area consists of diverse biotopes, wet meadows, ponds, as well as valuable trees and bushes. 50Hertz mapped various species such as pong frogs, great crested newt, […]", img: "https://renewables-grid.eu/app/uploads/2025/09/50Hz_Practice-2022-scaled-644x398-c-default.jpg", award: false },
  { id: 92, title: "Agri-PV", url: "https://renewables-grid.eu/database/agri-pv/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Solar", year: 2022, country: "United States", org: "Jack’s Solar Garden", desc: "Jack’s Solar Gardenis a 4-acre, 1.2 MW-DC solar array integrating improved land management strategies called agrivoltaics – this entails co-locating agricultural activities within the solar array infrastructure. It became the country’s largest commercial research site for agrivoltaics in the USA in 2021 through research partner collaborations.", img: "https://renewables-grid.eu/app/uploads/2025/09/Jack-Solar-Garden_1-scaled-644x398-c-default.jpg", award: true },
  { id: 93, title: "Bio Transport", url: "https://renewables-grid.eu/database/bio-transport/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2022, country: "Spain", org: "Red Eléctrica, Spanish Council for Scientific Research (CSIC)", desc: "Researchers from theDoñana Biological Station(EBD) of theSpanish National Scientific Research Council(CSIC) analysed if vegetation management within the transmission grids’ bases (shelter rocks, native shrub seedlings) can benefit ecosystems by creating new habitats for certain species. Their findings show positive, transferable and exponential potential of pylons to reconnect ecosystems and support biodiversity, with little management and low costs.", img: "https://renewables-grid.eu/app/uploads/2025/09/CSICSchematic-representation-of-the-study-area-Yellow-zones-are-dry-crops-of-cereals-and-644x398-c-default.jpg", award: false },
  { id: 94, title: "Biodotti", url: "https://renewables-grid.eu/database/biodotti/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2022, country: "Italy", org: "Terna", desc: "The Biodotti project focuses on improving micro-habitats and enhancing biodiversity at the bases ofTernatowers located in agricultural areas between protected “Natura 2000” sites in Italy. The development of natural habitats at the base of 19 power lines will ideally become ecological stepping stones for the movement of wildlife between protected areas.", img: "https://renewables-grid.eu/app/uploads/2025/09/Biodotti_1-1-644x398-c-default.jpg", award: true },
  { id: 95, title: "Circular Economy for the Wind Industry", url: "https://renewables-grid.eu/database/circular-economy-for-the-wind-industry/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Onshore wind", year: 2022, country: "United Kingdom", org: "Renewable Parts", desc: "Renewable Parts (RP)introduces unique circular economy practices into the wind energy industry to improve sustainability of wind energy assets by reducing the emissions of carbon and the amount of waste sent to scrap and landfill. A practice that can and should be utilised across renewable energy and the energy network to ensure green energy is truly sustainable.", img: "https://renewables-grid.eu/app/uploads/2025/09/Renewable-Parts_4-644x398-c-default.jpg", award: false },
  { id: 96, title: "Conserving Threatened Birds in Western Bulgaria", url: "https://renewables-grid.eu/database/conserving-threatened-birds-in-western-bulgaria/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2022, country: "Bulgaria", org: "Bulgarian Society for the Protection of Birds (BSPB), EGD West", desc: "Bulgarian DSO,EGD West, undertook a myriad of measures to protect threatened birds along their lines. By working with stakeholders and the public, EGD West was able to upgrade their lines, improve public awareness of the relationship between electricity infrastructure and birdlife, and reduce bird mortality along the grid.", img: "https://renewables-grid.eu/app/uploads/2025/09/EDG-West_Award22_2-644x398-c-default.jpg", award: true },
  { id: 97, title: "Cooperative Loans", url: "https://renewables-grid.eu/database/cooperative-loans/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Solar", year: 2022, country: "Portugal", org: "Coopérnico", desc: "Coopérnicois a renewable energy cooperative in Portugal whose members invest collectively in solar PV projects, primarily on the roofs of social institutions such as charities, senior residences, and kindergartens. The cooperative manages the normal maintenance of the panels and, at the end of the contract, gives them directly to the institutions – supporting their financial sustainability and promoting renewables uptake.", img: "https://renewables-grid.eu/app/uploads/2025/09/Coopernico_1-644x398-c-default.jpg", award: true },
  { id: 98, title: "Digital Citizen Information Market", url: "https://renewables-grid.eu/database/digital-citizen-information-market/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2022, country: "Germany", org: "Amprion", desc: "Ampriondeveloped a 3D virtual space to present information about grid development projects to stakeholders and the public. Project stakeholders were invited to attend events in the virtual space, where they could read and watch information about grid projects and engage with grid development experts.", img: "https://renewables-grid.eu/app/uploads/2025/09/Digital-Information-Market_Amprion_01-644x398-c-default.jpg", award: true },
  { id: 99, title: "Eco-friendly subsea cable protection in the Canary Islands", url: "https://offshore-coalition.eu/database-project/eco-friendly-subsea-cable-protection/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "Spain", org: "Red Eléctrica and ECOncrete", desc: "This project aims to investigate how eco-friendly concrete trench blocks placed around subsea electricity cables can enhance marine biodiversity. Specifically, the project focuses on stimulating the natural recovery ofreefs(Habitat of Community Interest 1170).", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Econcrete-3-scaled.jpg", award: false },
  { id: 100, title: "ECOncrete Scour Protection: Fisheries and Biodiversity Research Project", url: "https://offshore-coalition.eu/database-project/econcrete-scour-protection-fisheries-and-biodiversity-research-project/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "USA", org: "ECOncrete, Stony Brook University", desc: "The project evaluates the effects of nature-inclusive design (NID) scour protection onmarine biodiversity and fish populationscompared to traditional scour protection methods.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/02/1-ECOncrete-Scour-Protection-Unit-at-installation-Naomie-Lecard-scaled.jpeg", award: false },
  { id: 101, title: "Elia reinforces towers and substations to boost multi-hazard grid resilience", url: "https://renewables-grid.eu/database/elia-grid-resilience/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2022, country: "Germany", org: "50Hertz,", desc: "Elia Group – Elia Transmission Belgium (ETB, Belgium) and 50Hertz Transmission (Germany) – is enhancing the resilience of its electricity infrastructure against multiple climate hazards, including storms, strong winds, flooding, and heatwaves. Measures include reinforcing transmission towers and protecting substations from flooding, improving cooling and heating systems in substations, and using durable materials to ensure […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 102, title: "FARCROSS Modular Power Flow Control Solution", url: "https://renewables-grid.eu/database/farcross-modular-power-flow-control-solution/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Bulgaria", org: "FARCROSS Project Consortium, IPTO – Independent Power Transmission Operator, SmartWires", desc: "The 31-memberFARCROSS Project Consortiumhas begun installing a Modular Power Flow Control (MPFC) solution between Greece and Bulgaria to unlock cross-border capacity on congested lines between the countries without building new overhead lines. The continued expansion of project should increase the utilisation of the electricity network and unlock spare capacity.", img: "https://renewables-grid.eu/app/uploads/2025/09/FARCROSS-IPTO-Smart-Valve-Installation-Sept-2021-2-003-1-scaled-644x398-c-default.jpg", award: true },
  { id: 103, title: "Nature+Energy", url: "https://renewables-grid.eu/database/natureenergy/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Onshore wind", year: 2022, country: "Ireland", org: "Maynooth University (MU), Nature+, Trinity College Dublin (TCD)", desc: "Nature+Energy develops new ways of accounting for the value of nature on onshore wind farms. Their activities include developing a Natural Capital Accounting methodology, environmental monitoring systems for the measurement of biodiversity on onshore wind farms and supporting measures to build human capacity in natural capital accounting.", img: "https://renewables-grid.eu/app/uploads/2025/09/NatureEnergy_1-644x398-c-default.jpg", award: true },
  { id: 104, title: "Nature-Inclusive Design Pilots", url: "https://renewables-grid.eu/database/nature-inclusive-pilots/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2022, country: "Ireland", org: "EirGrid", desc: "With the government of Ireland introducing a biodiversity emergency in 2019, EirGrid has committed to implement nature-inclusive design across their infrastructure. This includes pilot projects on restoration, extensive biodiversity monitoring, and measures to protect birds near powerlines. The projects aim to avoid or reduce negative effects of electricity transmission infrastructure on the environment. EirGrid is funding an […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2022_Database_EirGrid_NatureInclusiveDesignPilots1-644x398-c-default.jpg", award: false },
  { id: 105, title: "New planning practices with an EE1 focus", url: "https://renewables-grid.eu/database/new-planning-practices-with-an-ee1-focus/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Spain", org: "Red Eléctrica", desc: "This practice reflects the energy efficiency first (EE1) principle in a system-wide approach, applying it to all the steps of the transmission network planning. Robust results are obtained using powerful tools enabling the selection of the best alternative with the lowest environmental and economic impact.", img: "https://renewables-grid.eu/app/uploads/2025/09/REE_Award22_3-644x398-c-default.jpg", award: true },
  { id: 106, title: "NordGrid Programme", url: "https://renewables-grid.eu/database/nordgrid-programme/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Europe", org: "Nordic Energy Research", desc: "The platform for cooperative energy research across the Nordics,Nordic Energy Research, worked with TSOs in the region to define research and development needs and launch an open call for funding proposals to achieve the needs of the TSOs. By working together at the Nordic level, research costs are lower, and the impacts of innovation are broader in scope.", img: "https://renewables-grid.eu/app/uploads/2025/09/NordGrid_3-644x398-c-default.jpg", award: true },
  { id: 107, title: "Out-of-Step Protection to Detect Power Swings", url: "https://renewables-grid.eu/database/out-of-step-protection-to-detect-power-swings/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2022, country: "Europe", org: "Delft University of Technology", desc: "A new approach to grid management by using synchrophasor technology that can detect a power swing from a sudden energy unbalance, known as an out-of-step condition, in the grid. The technology provides voltage and phasor measurements in real time, allowing for swift action to prevent a system outage.", img: "https://renewables-grid.eu/app/uploads/2025/09/TU-Delft_5-644x398-c-default.jpeg", award: true },
  { id: 108, title: "Pathfinder", url: "https://renewables-grid.eu/database/pathfinder/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2022, country: "Europe", org: "Gilytics", desc: "Pathfinder is a Geographic Information System (GIS) collaborative decision-making platform which automates and optimises the design, planning and routing of linear infrastructure, including sustainable grid development. It aims to increase transparency, communication and stakeholder engagement by quickly computing alternative routes for new powerlines and displaying them with 2D and 3D visualisations.", img: "https://renewables-grid.eu/app/uploads/2025/09/Pathfinder_Award22_3-644x398-c-default.jpg", award: true },
  { id: 109, title: "Power Academy", url: "https://renewables-grid.eu/database/power-academy/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2022, country: "Poland", org: "PSE", desc: "Power Academy is aPolskie Sieci Elektroenergetyczne’s (PSE)designed educational programme dedicated to primary schools. The main goal of the programme is to familiarise young students with knowledge about electricity, energy production and transmission through simple games and spectacular experiments.", img: "https://renewables-grid.eu/app/uploads/2025/09/PSE1-scaled-644x398-c-default.jpg", award: true },
  { id: 110, title: "Printed Energy", url: "https://renewables-grid.eu/database/printed-energy/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Solar", year: 2022, country: "Australia", org: "Kardinia Energy", desc: "Printed Energy is an energy technology using the sun that is low-cost, high performing, durable, extremely flexible, lightweight, and 100% recyclable. It uses organic photovoltaics which are made from semiconducting polymer materials.", img: "https://renewables-grid.eu/app/uploads/2025/09/Printed-Energy_6-644x398-c-default.jpg", award: true },
  { id: 111, title: "Shaping Our Electricity Future", url: "https://renewables-grid.eu/database/shaping-our-electricity-future/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2022, country: "Ireland", org: "EirGrid, SONI", desc: "EirGridandSONIused a range of innovative, participatory approaches in their consultation ‘Shaping Our Electricity Future’. They asked for views from the public, industry and civil society on their four approaches (generation-led, developer-led, technology-led and demand-led) to achieve Ireland’s renewable ambitions.", img: "https://renewables-grid.eu/app/uploads/2025/09/EirGrid_Award22_1-644x398-c-default.jpg", award: true },
  { id: 112, title: "SPEED-E", url: "https://renewables-grid.eu/database/speed-e/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "SPEED-E provides high power for electric vehicle charging stations directly supplied from the transmission grid. This can help to accelerate the build out of nationwide charging infrastructure in a sustainable way, since it provides a new use for the existing transmission grids.", img: "https://renewables-grid.eu/app/uploads/2025/09/SPEED-E_2-scaled-644x398-c-default.jpg", award: true },
  { id: 113, title: "T-Lab Master’s Programme", url: "https://renewables-grid.eu/database/t-lab-masters-programme/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2022, country: "Italy", org: "Terna", desc: "Italian TSO Terna developed a Master’s programme with three Italian universities on electricity system digitalisation, promoting education and employment opportunities in the region of the company’s Tyrrhenian Link project. Highlights 01 The co-design approach allows to combine academic standards and alignment with industrial needs. 02 The initiative aims to contribute to local education and employability. […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2022_Database_T-Lab-Masters-Programme.png", award: false },
  { id: 114, title: "TIGON", url: "https://renewables-grid.eu/database/tigon/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Europe", org: "CIRCE Foundation, Project consortium", desc: "DC grids have become attractive in recent years due to the high proliferation of renewable energy sources together with the increase in DC loads. The TIGON project demonstrates hybrid microgrid innovations with the aim of enhancing the reliability and resilience of decentralised renewables-based power systems.", img: "https://renewables-grid.eu/app/uploads/2025/09/TIGON_Award22_5-644x398-c-default.jpg", award: true },
  { id: 115, title: "TransMit", url: "https://renewables-grid.eu/database/transmit/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2022, country: "Europe", org: "BirdLife, Convention on Migratory Species (CMS), MAVA Foundation", desc: "TransMit is an interactive toolkit which aims to help those involved in planning, installing, and maintaining grid infrastructure to choose the best measures to minimise avian collisions and electrocutions, based on current scientific evidence.", img: "https://renewables-grid.eu/app/uploads/2025/09/1.-Front-cover-644x398-c-default.jpg", award: true },
  { id: 116, title: "TRINITY", url: "https://renewables-grid.eu/database/trinity/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2022, country: "Europe", org: "ETRA I+D", desc: "TRINITY is a project coordinated byETRA I+Dthat enhances cooperation and coordination among the Transmission System Operators of South-Eastern Europe (SEE) in order to support the integration of the electricity markets in the region, whilst promoting higher penetration of clean energies.", img: "https://renewables-grid.eu/app/uploads/2025/09/TRINITY_3-644x398-c-default.jpg", award: true },
  { id: 117, title: "Virtual model of the Rhine-crossing in the EnLAG 14", url: "https://renewables-grid.eu/database/virtual-model-of-the-rhine-crossing-in-the-enlag-14/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2022, country: "Germany", org: "Amprion", desc: "Ampriondeveloped a virtual model of an underground cable project to allow stakeholders impacted by the project to learn about the building and development process. Users of the virtual model are able to zoom in and out to discover explanatory videos and texts about the project.", img: "https://renewables-grid.eu/app/uploads/2025/09/Virtual-Model-of-crossing-the-rhine-by-cable_Amprion_02-644x398-c-default.jpg", award: true },
  { id: 118, title: "Wilder Humber: Restoring coastal ecosystems", url: "https://offshore-coalition.eu/database-project/wilder-humber/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2022, country: "United Kingdom", org: "Ørsted, Yorkshire Wildlife Trust and Lincolnshire Wildlife Trust", desc: "Improving the health and resiliency of Humber estuary ecosystem by restoringseagrass meadows, saltmarsh, sand dunes, and native oyster reefs", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Picture-1.jpg", award: false },
  { id: 119, title: "Artificial rock reefs bring new life to Hollandse Kust Zuid", url: "https://offshore-coalition.eu/database-project/artificial-rock-reefs-bring-new-life-to-hollandse-kust-zuid/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "Vattenfall, Van Oord, Seaway 7, Wageningen Marine Research, Waardenburg Ecology, Rich North Sea, and Witteveen & Bos", desc: "To investigate whether the deployment of rock reefs, using a rock grading larger than that used for conventional scour protection, offers additional benefits forAtlantic cod and other reef-associated species (fishes, invertebrates).", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/1-Screenshot-2024-10-23-at-18.01.00-1080x678.png", award: false },
  { id: 120, title: "Autonomous IoT device to repel birds from power lines", url: "https://renewables-grid.eu/database/autonomous-iot-device-to-repel-birds-from-power-lines/", brand: "RGI", dim: "Nature, Technology", topic: "Bird Protection", inf: "Grids", year: 2021, country: "Spain", org: "Energiot, Iberdrola", desc: "In response to Iberdrola's StartUp Challenge on Bird Protection on Electricity Grids, Spanish start-up, Energiot has proposed an innovative solution for the protection of birdlife around power lines. They developed a device which uses residual energy from the transmission network to repel birds from power lines through a predator emulator and repellent light emitter, thus reducing risk of electrocution. The practice won the challenge in 2021.", img: "https://renewables-grid.eu/app/uploads/2025/09/Iberdrola_1-644x398-c-default.jpg", award: false },
  { id: 121, title: "Bird-safe energy infrastructure promoted internationally through the Great Ethiopian Run", url: "https://renewables-grid.eu/database/bird-safe-energy-infrastructure-promoted-internationally-through-the-great-ethiopian-run/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2021, country: "Ethiopia", org: "BirdLife Africa, Bulgarian Society for the Protection of Birds (BSPB), Ethiopian Wildlife and Natural History Society (EWNHS)", desc: "In 2021, the EU funded projectEgyptian Vulture New LIFEwas the Message Sponsor of theGreat Ethiopian Run (GER)– Ethiopia’s biggest public event. Diverse communication activities gave huge visibility to the topic of bird electrocution and collision with unsafe or poorly located infrastructure. An MoU was signed between major energy and conservation stakeholders to work together on bird-safe energy infrastructure in Ethiopia.", img: "https://renewables-grid.eu/app/uploads/2025/09/GER_4_credits_Henok_Samson-compressed-scaled-644x398-c-default.jpg", award: false },
  { id: 122, title: "Carbon calculator to estimate CO₂ emissions from excavation and degradation of peatlands", url: "https://renewables-grid.eu/database/solar-allensbach-intelligent-energy-sector-coupling/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Energy system", year: 2021, country: "Norway", org: "Statnett, NINA", desc: "The projectSoLARaims to prove functionality of intelligent sector coupling through the coordination of many flexible devices in a grid cell within a residential development. The cell reacts to the availability of variable renewable energy in real-time and considers actual and forecasted prices, thus allowing each prosumer to decide when to use their devices.", img: "https://renewables-grid.eu/app/uploads/2025/09/Statnett_Carbon_calculator_pic3-644x398-c-default.jpg", award: false },
  { id: 123, title: "COMPILE: Integrating Community Power in Energy Islands", url: "https://renewables-grid.eu/database/compile-integrating-community-power-in-energy-islands/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2021, country: "Slovenia", org: "University of Ljubljana", desc: "TheEU-funded projectshows how energy communities under varying regulatory schemes, leveraging different financing mechanisms and using different technologies can work within grid constraints and find optimisations. The crucial common aspect is cooperation within the community to fully control decentralised local energy systems. This leads to a secure, sustainable and decarbonised energy supply with all actors along the energy value chain engaged.", img: "https://renewables-grid.eu/app/uploads/2025/09/Community_battery_delivery-644x398-c-default.jpg", award: false },
  { id: 124, title: "Construction of an oyster bank in Gemini offshore wind farm", url: "https://offshore-coalition.eu/database-project/construction-of-an-oyster-bank-in-gemini-offshore-wind-farm/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "The Rich North Sea, Waterproof, Wageningen Marine Research, NIOZ and Waardenburg Ecology; Gemini Wind Park- ZeeEnergie.", desc: "To restore a large-scaleEuropean flat oysterreef and enhance biodiversity in the North Sea.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/GEM_0837-scaled.jpg", award: false },
  { id: 125, title: "CROSSBOW Horizon 2020 Project", url: "https://renewables-grid.eu/database/using-mixed-reality-mr-on-the-modular-offshore-grid-mog/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "ETRA I+D", desc: "The use ofmixed reality (MR) remote assistance technologyfor inspecting and maintaining the Modular Offshore Grid (MOG) aims to support the continued integration of renewable energy into the Belgian electricity grid, since it allows maintenance operators to access real-time digital advice and guidance on how to quickly fix issues that arise on the MOG.", img: "https://renewables-grid.eu/app/uploads/2025/09/CROSSBOW_Consortium_in_Constanta__Romania_-compressed-644x398-c-default.jpg", award: true },
  { id: 126, title: "DA/RE: The network security initiative", url: "https://renewables-grid.eu/database/da-re-the-network-security-initiative/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2021, country: "Germany", org: "TransnetBW; Netze BW", desc: "DA/REis an IT-platform that facilitates coordination between TSOs, DSOs, generating units and storage units focused on facilitating participation in the mandatory, state scheme ‘Redispatch 2.0’ for decentralised congestion management. It is led by TSO,TransnetBWand DSO,Netze BWof the German federal state of Baden Württemberg.", img: "https://renewables-grid.eu/app/uploads/2025/09/DA_RE_3-644x398-c-default.png", award: false },
  { id: 127, title: "Digital Terna Incontra", url: "https://renewables-grid.eu/database/digital-terna-incontra/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2021, country: "Italy", org: "Terna", desc: "To facilitate a dialogue about specific grid development projects safely and in line with Covid-19 restrictions,Ternalaunched an open webinar series on their new electricity infrastructure projects, thus engaging various stakeholders in an online public consultation and feeding their views into the development process.", img: "https://renewables-grid.eu/app/uploads/2025/09/Digital_Terna_Incontra_1-644x398-c-default.png", award: false },
  { id: 128, title: "Don’t stop! Digital citizens’ participation in grid expansion in the coronavirus era – and after", url: "https://renewables-grid.eu/database/dont-stop-digital-citizens-participation-in-grid-expansion-in-the-coronavirus-era-and-after/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2021, country: "Europe", org: "TenneT", desc: "The practice offers digital solutions for maximum flexibility and low-threshold participation formats in the approval processes for new construction projects. This includes digital consultation hours, online lectures, studio interviews and interactive digital “info markets” for all new projects – all of which will remain in place in the post-pandemic era to serve as complementary modules of participation.", img: "https://renewables-grid.eu/app/uploads/2025/09/Virtual_TenneT_Information_Market-644x398-c-default.png", award: false },
  { id: 129, title: "Eco-crossings: testing how to boost biodiversity on offshore grids", url: "https://offshore-coalition.eu/database-project/eco-crossings-testing-how-to-boost-biodiversity-on-offshore-grids/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "TenneT, Van Oord, and Waardenburg Ecology", desc: "To understand whether different materials used at offshore cable crossings can boost marine biodiversity, particularly for the European flat oyster and other reef associated species.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/12/1-Copyright-DMP_20230614_Kabelkruising-TenneT_DSC07486-Britte-Schilt-e1765209582822.jpg", award: false },
  { id: 130, title: "Ecological Corridor Management", url: "https://renewables-grid.eu/database/ecological-corridor-management/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2021, country: "Germany", org: "E.ON, Westnetz", desc: "E.ON aims to create a 13,000km network of ecological corridors across their European subsidiary companies of Distribution System Operators. Ecological Corridor Management (ECM) works on promoting biodiversity and restoring ecosystems around grids, while ensuring system security by removing only cutting down fast-growing trees which pose a threat by potentially touching or falling onto power lines. he fast-growing trees are cut down and space left for the existing slower, low-growing trees, creating a habitat for various insects and animals.", img: "https://renewables-grid.eu/app/uploads/2025/09/IVM-Westnetz_1-644x398-c-default.jpg", award: true },
  { id: 131, title: "electricityMap", url: "https://renewables-grid.eu/database/electricitymap/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2021, country: "Worldwide", org: "electricityMap", desc: "TheelectricityMapapp is a public real-time visualisation that shows where electricity is coming from and how much greenhouse gases were emitted to produce it across the world on an hourly basis. The map colours regions and countries based on the carbon intensity of their electricity production and consumption, and displays the breakdown according to different modes, making a distinction between low carbon and renewable sources.", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2021-12-03_at_15.40.10-644x398-c-default.png", award: false },
  { id: 132, title: "EMPOWER", url: "https://renewables-grid.eu/database/futureflow/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Norway", org: "Smart Innovation Norway", desc: "To open balancing and redispatching markets to new competitive sources of flexibility, four Central-Eastern European TSOs (ELESfrom Slovenia,APGfrom Austria,Mavirfrom Hungary andTranselectricafrom Romania) have designed a unique regional cooperation scheme,FutureFlow.", img: "https://renewables-grid.eu/app/uploads/2025/09/app4-644x398-c-default.jpg", award: true },
  { id: 133, title: "Energía4All", url: "https://renewables-grid.eu/database/energia4all/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2021, country: "Spain", org: "Fundación Renovables", desc: "Spanish NGO and RGI Member,Fundación Renovables, created theEnergía4allproject as a tool to provide free, accessible, high-quality information and training around the energy transition which makes participants an active and decisive part in the energy field who can use gained knowledge to actively participate.", img: "https://renewables-grid.eu/app/uploads/2025/09/FR_e4a_5-644x398-c-default.jpg", award: false },
  { id: 134, title: "EUSysFlex", url: "https://renewables-grid.eu/database/crossbow-horizon-2020-project/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "EirGrid", desc: "CROSSBOWis multi-partner consortium aiming to enable higher penetration of RES in South Eastern Europe (SEE) by improving cross-border management of renewable energies and storage units, fostering the shared use of resources and reducing network operational costs through tools and transnational business models. The project offers 9 different tools to foster transmission networks’ cross-border management and a higher penetration of clean energy whilst reducing network operational cost through...", img: "https://renewables-grid.eu/app/uploads/2025/09/EU-Sys-FlexGroup_picture-644x398-c-default.jpg", award: true },
  { id: 135, title: "Fish hotels", url: "https://offshore-coalition.eu/database-project/fish-hotels/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "Ecocean, TenneT", desc: "To enhance biodiversity around TenneT’s offshore high voltage station by creating shelter and safe foraging opportunities for diverse types ofyoung fish and potentially crustaceans.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative2.jpg", award: false },
  { id: 136, title: "FutureFlow", url: "https://renewables-grid.eu/database/iegsa-platform/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "APG, ELES, Mavir, Transelectrica", desc: "The Horizon-2020 fundedINTERRFACEproject designed, developed, and implemented a new Interoperable pan-European Grid Services Architecture (IEGSA), which acts as the interface between the power system (TSO and DSO) and customers, allowing the seamless and coordinated operation of all stakeholders to use and procure common services.", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2021-12-21_at_19-compressed_1_-644x398-c-default.jpg", award: true },
  { id: 137, title: "IEGSA Platform", url: "https://renewables-grid.eu/database/da-re-the-network-security-initiative/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "Project consortium", desc: "DA/REis an IT-platform that facilitates coordination between TSOs, DSOs, generating units and storage units focused on facilitating participation in the mandatory, state scheme ‘Redispatch 2.0’ for decentralised congestion management. It is led by TSO,TransnetBWand DSO,Netze BWof the German federal state of Baden Württemberg.", img: "https://renewables-grid.eu/app/uploads/2025/09/interrface-644x398-c-default.jpg", award: true },
  { id: 138, title: "Incremental Ecological Index (IEI)", url: "https://renewables-grid.eu/database/carbon-calculator-to-estimate-co%e2%82%82-emissions-from-excavation-and-degradation-of-peatlands/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Energy system", year: 2021, country: "Italy", org: "Terna", desc: "Statnett, in cooperation withNINA (The Norwegian Institute for Nature Research),has developed a Carbon Calculator to estimate how different land use plans affect greenhouse gas emission, with a special focus on peatlands. The tool estimates the carbon content in soil that will be affected by excavation and drainage, thereby adding to a better foundation for decision making when planning new grid projects.", img: "https://renewables-grid.eu/app/uploads/2025/09/mascheramento_pitfall_trap-644x398-c-default.jpg", award: false },
  { id: 139, title: "Introducing circular economy practices into the wind industry", url: "https://renewables-grid.eu/database/circular-economy-practices/", brand: "RGI", dim: "Nature", topic: "Circularity & Supply Chains", inf: "Wind", year: 2021, country: "", org: "Renewable Parts", desc: "Renewable Parts(RP) introduces circular economy practices into the wind energy industry to improve sustainability of wind energy assets by reducing the emissions of carbon and the amount of waste sent to scrap and landfill. This is a practice that can and should be utilised across renewable energy and the energy network to ensure green energy is truly sustainable.", img: "https://renewables-grid.eu/app/uploads/2026/03/2021_Database_RenewablesPart_CircularEconomyPractices1-644x398-c-default.jpg", award: false },
  { id: 140, title: "Italian wind parks travel guide", url: "https://renewables-grid.eu/database/italian-wind-parks-travel-guide/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Onshore wind", year: 2021, country: "Italy", org: "Legambiente", desc: "Parchidelvento.itis a touristic guide in Italian and English which offers readers the opportunity to discover the little-known territories of wind parks, which are interesting laboratories for the energy transition. The website contains information on visits to eleven wind farms accompanied by stories and anecdotes recounted by a journalist, Giuliano Malatesta.", img: "https://renewables-grid.eu/app/uploads/2025/09/wp1-644x398-c-default.jpg", award: false },
  { id: 141, title: "Kriegers Flak – Combined Grid Solution", url: "https://renewables-grid.eu/database/x-flex/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Offshore wind", year: 2021, country: "", org: "50Hertz, Energinet", desc: "X-FLEXis an end-user driven project that aims to demonstrate a set of tools, to integrate the emerging decentralised ecosystem of renewable energy sources (RES) and flexibility systems into the existing European energy system, in an efficient and cost-effective manner, to create more stable, secure and sustainable smart grids.", img: "https://renewables-grid.eu/app/uploads/2025/09/50Herz__Kriegers_Flak_1-644x398-c-default.jpg", award: true },
  { id: 142, title: "Kriegers Flak – Combined Grid Solution: World’s first hybrid interconnector", url: "https://renewables-grid.eu/database/kriegers-flak-combined-grid-solution-worlds-first-hybrid-interconnector/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Offshore wind", year: 2021, country: "Europe", org: "50Hertz,", desc: "The ‘Combined Grid Solution’ (CGS) is a hybrid system that interconnects the grid of north-eastern Germany with the Danish island of Zealand utilising the grid connection infrastructure of the German offshore wind farms Baltic 1 and 2 and the Danish offshore windfarm Kriegers Flak. It’s the first of its kind worldwide and will be operational […]", img: "https://renewables-grid.eu/app/uploads/2025/09/50Herz__Kriegers_Flak_1-644x398-c-default.jpg", award: false },
  { id: 143, title: "Large-scale grid flexibility", url: "https://renewables-grid.eu/database/eusysflex/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "Project consortium", desc: "EU-SysFlex is a project run by a consortium of 34 partners from 15 European countries with a view to creating a roadmap to address future system operation challenges associated with the integration of 50% renewables into Europe’s electricity grid by 2030, in order to ensure stability, reliability and resilience, for example through flexibility, market and system services. The project is led by the Irish TSO,EirGrid.", img: "https://renewables-grid.eu/app/uploads/2025/09/20210709_072635-compressed-scaled-644x398-c-default.jpg", award: true },
  { id: 144, title: "Near-infrared study of agricultural yields above a 380 kV underground cable", url: "https://renewables-grid.eu/database/near-infrared-study-of-agricultural-yields-above-a-380-kv/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2021, country: "Germany", org: "Amprion", desc: "To assess how underground cables affect crop yields, near-infrared images taken by drones can be used efficiently to visualise biomass vitality and yield. Amprion has used this technique in a monitoring project in three consecutive years accompanying their underground cable pilot in Raesfeld, North Rhine-Westphalia, Germany. Highlights 01 Visualises and assesses yields of entire fields along underground […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Drone-644x398-c-default.jpg", award: false },
  { id: 145, title: "Pastoreo en red – Grazing under high voltage lines", url: "https://renewables-grid.eu/database/pastoreo-en-red-grazing-under-high-voltage-lines/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2021, country: "Spain", org: "Red Eléctrica", desc: "Red Eléctrica de Españacollaborativepilot scheme ‘Pastoreo en Red’ (network grazing)uses herds of sheep as a nature-based solution to vegetation management in a grid corridor in La Rioja. By moving away from mechanised management and recruiting a local shepherd to graze livestock on the vegetation, this practice benefits local biodiversity and ecosystems, climate resilience, rural populations and the grid operator themselves.  The project is currently being replicated in Aragon, Asturias,...", img: "https://renewables-grid.eu/app/uploads/2025/09/Foto_24-644x398-c-default.jpg", award: false },
  { id: 146, title: "Protocolo Avifauna – Bird protection on distribution lines", url: "https://renewables-grid.eu/database/protocolo-avifauna/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2021, country: "Portugal", org: "SPEA, E‑REDES, Quercus, LPN, INCF", desc: "Portuguese DSO E-REDES, together with NGOs SPEA, QUERCUS and LPN, developed long-term mitigation measures against bird electrocution and collision on power lines. By monitoring more than 1670 km of lines, they identified hotspots and implemented targeted devices such as insulation, cabling, and retrofitting. The initiative strengthens protection for endangered species and builds a collaborative model between grid operators, NGOs, and conservation authorities.", img: "https://www.e-redes.pt/sites/eredes/files/styles/e_redes_564_352/public/2025-03/E-REDES-Sustentabilidade-Avifauna_0.png", award: false },
  { id: 147, title: "ReCoral: Offshore wind turbine foundations providing a new habitat for corals in Taiwan", url: "https://offshore-coalition.eu/database-project/recoral/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Taiwan", org: "Ørsted and the Penghu Marine Biology Research Center", desc: "Testing a new methodology of creatingcoral reefsdirectly on the foundations of wind turbines to improve local and wider ecosystems.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Corrals-at-12-months.jpg", award: false },
  { id: 148, title: "Site Wind Right tool", url: "https://renewables-grid.eu/database/site-wind-right-tool/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Onshore wind", year: 2021, country: "United States", org: "The Nature Conservancy", desc: "TheSite Wind Right (SWR)analysis and online interactive map use GIS technology and >100 data sets on wind resources, wildlife habitat, current land use and infrastructure to help inform wind development siting decisions across 17 states in the Central USA. These states are known as the “Wind Belt” of the USA, accounting for nearly 80% of all existing and planned onshore wind development.", img: "https://renewables-grid.eu/app/uploads/2025/09/South_Dakota_Prairie-644x398-c-default.jpg", award: true },
  { id: 149, title: "SoLAR Allensbach – Intelligent Energy Sector Coupling", url: "https://renewables-grid.eu/database/kriegers-flak-combined-grid-solution-worlds-first-hybrid-interconnector/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2021, country: "Germany", org: "Community of Allensbach, Easy Smart Grid, EIFER", desc: "The ‘Combined Grid Solution’ (CGS) is a hybrid system that interconnects the grid of north-eastern Germany with the Danish island of Zealand utilising the grid connection infrastructure of the German offshore wind farms Baltic 1 and 2 and the Danish offshore windfarm Kriegers Flak. It’s the first of its kind worldwide and will be operational before year-end.", img: "https://renewables-grid.eu/app/uploads/2025/09/SoLAR_14__c__Easy_Smart_Grid-644x398-c-default.jpg", award: true },
  { id: 150, title: "Systemvision 2050", url: "https://renewables-grid.eu/database/systemvision-2050/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Germany", org: "Amprion", desc: "To collaboratively discuss visions of the best possible pathways for infrastructure development towards a decarbonised energy system,Amprionpartnered with diverse stakeholders from policy, industry and civil society for their ‘Systemvision 2050’.", img: "https://renewables-grid.eu/app/uploads/2025/09/Logo-644x398-c-default.png", award: false },
  { id: 151, title: "Using Mixed Reality (MR) on the Modular Offshore Grid (MOG)", url: "https://renewables-grid.eu/database/using-mixed-reality-mr-on-the-modular-offshore-grid-mog/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "", year: 2021, country: "Belgium", org: "Elia", desc: "The use of mixed reality (MR) remote assistance technology for inspecting and maintaining the Modular Offshore Grid (MOG) aims to support the continued integration of renewable energy into the Belgian electricity grid, since it allows maintenance operators to access real-time digital advice and guidance on how to quickly fix issues that arise on the MOG. Highlights 01 […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Training1-scaled-644x398-c-default.jpg", award: false },
  { id: 152, title: "Using Mixed Reality on the Modular Offshore Grid", url: "https://renewables-grid.eu/database/empower/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Offshore wind", year: 2021, country: "", org: "Elia", desc: "TheHorizon2020 projectdeveloped a local electricity trading platform and Norway’s first microgrid in order to prove that significant reduction of greenhouse gas emissions and an increase of energy efficiency require radical changes in our relation to energy, and also to encourage active citizen participation in the electrical system.", img: "https://renewables-grid.eu/app/uploads/2025/09/AR_on_MOG_call1-644x398-c-default.png", award: true },
  { id: 153, title: "Water replenishment holes in turbine foundations", url: "https://offshore-coalition.eu/database-project/water-replenishment-holes-in-turbine-foundations/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2021, country: "Netherlands", org: "Vattenfall, the Rich North Sea, the Royal Netherlands Institute for Sea Research, Wageningen Marine Research, and Waardenburg Ecology", desc: "To investigate how water replenishment holes in turbine foundations can be used byfish and other marine speciesto settle, shelter and be used as a feeding grounds.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/IP_Vattenfall_sea-1280x853-1-e1728921043537.jpg", award: false },
  { id: 154, title: "X-FLEX", url: "https://renewables-grid.eu/database/large-scale-grid-flexibility/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2021, country: "Europe", org: "ETRA I+D", desc: "FLEXITRANSTOREaims to develop a next generation power system flexibility platform, enhance simulation tools and demonstrate innovative grid-flexibility technologies to improve the flexibility resources of the pan-European transmission system. The platform focuses on the integration of Southeast Europe markets, boosts the establishment of a liberalised electricity market and encourages relationship building and knowledge sharing among industry players in the region.", img: "https://renewables-grid.eu/app/uploads/2025/09/scenarios___tools-644x398-c-default.png", award: true },
  { id: 155, title: "ALEGrO: New HVDC link optimized by the market to increase societal value", url: "https://renewables-grid.eu/database/alegro/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "Belgium", org: "Elia", desc: "Belgium’s Elia and Germany’s Amprion are constructing ALEGrO, the first 1GW High Voltage Direct Current (HVDC) interconnector to connect two countries within an Alternating Current (AC) grid, to allow a high integration of renewable energy, maximise market value, and improve security of supply in the two countries and across the Central West European region. objectives […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elia-ALEGRO2-644x398-c-default.png", award: false },
  { id: 156, title: "Creating Acceptance by Transparency on Community level", url: "https://renewables-grid.eu/database/creating-acceptance/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Germany", org: "TransnetBW; Stadt Leingarten", desc: "The city of Leingarten (Baden-Württemberg, Germany) undertook diverse engagement activities around the SuedLink HVDC connection (whose converter will be constructed in Leingarten), in order to support an early, transparent and neutral exchange of information between citizens and the project TSO.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_TransnetBW_CreatingAcceptance1-644x398-c-default.jpg", award: false },
  { id: 157, title: "Development of biodiversity around artificial reefs", url: "https://offshore-coalition.eu/database-project/development-of-biodiversity-around-artificial-reefs/", brand: "OCEaN", dim: "Nature, Technology", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2020, country: "Netherlands", org: "Ørsted, Wageningen Marine Research, and the Rich North Sea", desc: "To investigate the contributions of artificial reefs to marine biodiversity in the North Sea, specifically targetingAtlantic cod and European lobsters.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/NE_lobster.jpg", award: false },
  { id: 158, title: "Dialogue as the beating heart of the process Project support groups", url: "https://renewables-grid.eu/database/project-support-groups/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Belgium", org: "Elia", desc: "For two main grid projects in Flanders and Wallonia, two support groups were formed to discuss the interests and concerns of the project and jointly look for better solutions before project-start and throughout. Highlights 01 Two permanent support groups for civil society created and numerous meetings held 02 Increased involvement of external stakeholders, including citizens […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elia_ProjectSupportGroups1-644x398-c-default.jpg", award: false },
  { id: 159, title: "Digital results conference and dialogue process", url: "https://renewables-grid.eu/database/conference-dialogue-process/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2020, country: "Germany", org: "Deutsche Umwelthilfe,", desc: "Due to COVID19-related restrictions, German TSO, TenneT, Environmental Action Germany (DUH) and the Ministry for Energy Transition, Agriculture, Environment, Nature and Digitalisation in Schleswig Holstein (MELUND), adapted the results conference of the proposed West Coast Line (WCL) to become completely digital. Highlights 01 Developed a digital platform to inform the public and explain decisions and […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Tennet_ConferenceandDialogue1-644x398-c-default.png", award: false },
  { id: 160, title: "e-Gridmap", url: "https://renewables-grid.eu/database/e-gridmap/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "Estonia", org: "Elering", desc: "Elering launched an innovative tool named e-Gridmap that immediately calculates the costs (CapEx and Return on Investment) of connecting a new renewable production facility to the Estonian transmission grid based on the project’s location and capacity, thus simplifying investments in renewable energy.", img: "https://elering.ee/sites/default/files/public/elekter/V%C3%B5rguteenus/Kuvat%C3%B5mmis%202025-08-04%20144035.png", award: false },
  { id: 161, title: "Ecological line maintenance in a nature reserve", url: "https://renewables-grid.eu/database/ecological-line-maintenance/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Germany", org: "NABU; BUND", desc: "Three power lines run through the Ehinger Ried nature reserve in Baden-Württemberg, Germany. As with all power lines, for their maintenance, it is necessary to take steps to intervene and manage the vegetation.", img: "https://renewables-grid.eu/app/uploads/2026/03/2020_Database_NABU_EcologicalLIneMaintenance1-644x398-c-default.png", award: false },
  { id: 162, title: "Energy transition Decentral – connected – together", url: "https://renewables-grid.eu/database/decentral-connected-together/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Germany", org: "The Energy Avantgarde Anhalt e. V.", desc: "To shape the energy transition in Saxony-Anhalt and find future-proof solutions for the region, Energieavantgarde Anhalt (EA) brought together citizens with private and public actors to create a living lab environment, where diverse energy-related topics are handled. Objectives 01 Broadened public engagement by linking climate protection to regional value creation 02 Involves a broad spectrum […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_EnergieavantgardeAnhalt_DecentralConnectedTogether1-644x398-c-default.png", award: false },
  { id: 163, title: "Holistic Approach for Validating Complex Smart Grid Systems", url: "https://renewables-grid.eu/database/validating-grid-systems/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "", org: "ERIGrid consortium (18 partners from 11 European countries)", desc: "ERIGrid is a pan-European Research Infrastructure which supports technology development and the rollout of smart grid solutions by employing a multi-domain approach, with corresponding tools for a systematic testing of smart grid systems.", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_ERIgrid_SmartGridSystems1-644x398-c-default.jpg", award: false },
  { id: 164, title: "Joint initiative for stone reef reconstruction in the German Baltic Sea", url: "https://renewables-grid.eu/database/joint-initiative-for-stone-reef-reconstruction-in-the-german-baltic-sea/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2020, country: "Germany", org: "50Hertz; WWF Germany", desc: "50Hertz and WWF Germany are collaborating on the planning and implementation of stone reef reconstruction in the Baltic Sea. Including various stakeholders, 50Hertz and WWF Germany used the principle of participatory dialogue to integrate multiple perspectives and knowledge when creating conditions for pilot projects.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_50hertz_Jointinitiative1-644x398-c-default.jpg", award: false },
  { id: 165, title: "Mainstreaming soaring birds’ conservation in energy sector in Jordan", url: "https://renewables-grid.eu/database/mainstreaming-soaring-birds/", brand: "RGI", dim: "Nature, People", topic: "Public Acceptance & Engagement", inf: "Offshore wind", year: 2020, country: "Jordan", org: "Royal Society for the Conservation of Nature (RSCN),", desc: "Jordan’s Royal Society for the Conservation of Nature (RSCN) established a national online database to monitor and mitigate migratory bird collisions and electrocution around energy infrastructure. This platform encourages wind energy project planning that supports ecological requirements and bird conservation. Objectives 01 Developed national safeguards for wind farms to protect 37 soaring bird species (of […]", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_Birdlife_MainstreamingSoaringBirds1-644x398-c-default.jpeg", award: false },
  { id: 166, title: "Naturaleza en RED – Vegetation Management under transmission lines", url: "https://renewables-grid.eu/database/naturaleza-en-red/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Spain", org: "Universidad Autónoma de Barcelona,", desc: "Naturaleza en RED is a pilot project by the Universidad Autónoma de Barcelona in collaboration with the Red Eléctrica Group. As part of the initiative, a study was carried out in the Montseny nature reserve to examine the areas under transmission lines, also known as safety corridors to analyse the role of the areas beneath Red Eléctrica de […]", img: "https://renewables-grid.eu/app/uploads/2020/03/2020_Database_REE_NaturalezaenRed-644x398-c-default.jpg", award: false },
  { id: 167, title: "New Public Engagement Strategy and pivoting to Virtual Engagement in response to COVID-19", url: "https://renewables-grid.eu/database/new-public-engagement-strategy-and-pivoting-to-virtual-engagement-in-response-to-covid-19/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Ireland", org: "EirGrid", desc: "In February 2021,EirGridpublished anew public engagement strategyfor a cleaner energy future. The ‘Pandemic Proof Strategy‘ for public engagement is underpinned by experiences of the engagement EirGrid undertook on grid development projects and strategies this past year.", img: "https://renewables-grid.eu/app/uploads/2025/09/deliberative_dialogue_tool-compressed-644x398-c-default.jpg", award: false },
  { id: 168, title: "Oyster Broodstock Structures at the Blauwwind (Borssele III & IV) Offshore Wind Farm", url: "https://offshore-coalition.eu/database-project/oyster-broodstock-structures-at-the-blauwwind-borssele-iii-iv-offshore-wind-farm/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2020, country: "Netherlands", org: "The Rich North Sea, Blauwwind consortium, Van Oord, Bluestream offshore, and Eurofins AquaSense", desc: "To study flat oyster broodstock placement and rock reef development within offshore wind farms, with a particular focus on assessing the potential reproduction of theEuropean flat oyster, as well as the establishment of young oysters.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/2S0A7755-scaled.jpg", award: false },
  { id: 169, title: "Protection of the marine environment thanks to the future offshore substations", url: "https://renewables-grid.eu/database/protection-of-marine-environment/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2020, country: "France", org: "RTE", desc: "French TSO,RTEis designing its future offshore substations to provide different services to the marine environment, such as ecological protection, monitoring of marine biodiversity or serving as test labs for testing innovative renewables prototypes.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_RTE_ProtectionoftheMarineEnvironment2-644x398-c-default.jpg", award: false },
  { id: 170, title: "Reducing the risk of bird collisions with high-voltage power lines in Belgium", url: "https://renewables-grid.eu/database/reducing-the-risk/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2020, country: "Belgium", org: "Natuurpunt,", desc: "Combining the most recent knowledge on bird distribution, Belgian NGOs Natagora and Natuurpunt, together with national TSO, Elia, created a map to quantify the risk of bird collision with power lines for the whole of Belgium, enabling estimations of collision risk anywhere in the country. Highlights 01 Allows to prioritise which power lines should be equipped with mitigation measures […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elia_ReducingtheRiskofBirdCollisions1-644x398-c-default.png", award: false },
  { id: 171, title: "Replacement of SF6 by alternatives in 420 kV", url: "https://renewables-grid.eu/database/gas-insulated-switchgear/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2020, country: "Germany", org: "TransnetBW", desc: "German TSO TransnetBW initiated the first pilot projects worldwide with different manufacturers and research institutes, stimulating the development of 420 kV SF6-free gas-insulated switchgear (GIS), while at the same time allowing for safe grid operation. Highlights 01 First pilot projects worldwide on developing SF6-free GIS at the high voltage level of 420 kV 02 Two […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_TransnetBW_GasInsulatedSwitchgear1-644x398-c-default.png", award: false },
  { id: 172, title: "rePLANT – Management of Forest Fires", url: "https://renewables-grid.eu/database/replant/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2020, country: "Portugal", org: "Rede Electrica Nacional (REN), University of Coimbra, whereness", desc: "‘rePLANT', a collaborative initiative by Portuguese TSO REN, whereness, & University of Coimbra introduces innovative risk management systems that monitor and detect the risk of forest fires. Based on scientific and technological knowledge, the initiative brings new, more efficient and intelligent equipment for the forest that protects the environment from the harmful effects of wildfires, as well as increases the resilience of power lines. rePLANT mobilizes 20 entities, including companies in the forest sector, in a common and coordinated effort to implement 8 Collaborative Strategies. It brings team of experts with over 30 years of experience in fire management to develop technology that detects and mitigates persistent issues of forest fires.", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_REN_rePLANT3-644x398-c-default.jpg", award: false },
  { id: 173, title: "SAGA", url: "https://renewables-grid.eu/database/saga/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2020, country: "Spain", org: "Elewit – technological platform of the Red Eléctrica Group", desc: "SAGA is an advanced information system for electricity grids, which optimises asset management strategies for TSOs and DSOs to extend asset lifespan through smarter, predictive and risk-based maintenance, reducing maintenance safety risks, impact of transmission assets on the surrounding environment and costs, increasing security of supply and creating synergies between workstreams.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_Elewit_SAGA1-644x398-c-default.png", award: false },
  { id: 174, title: "Schafe Unter Strom", url: "https://renewables-grid.eu/database/schafe-unter-strom/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Germany", org: "50Hertz, Technische Universität Dresden, Mitnetz Strom, Landschaftspflegeverband Westsachsen e.V.", desc: "Schafe Unter Strom is a collaborative nature conservation initiative in West Saxony that partners local shepherds with grid operators 50Hertz and Mitnetz Strom to establish pastures beneath high-voltage transmission routes. The project creates habitats for endangered species, supports the shepherding profession through economic opportunities and grazing access, and conducts community education through field excursions and lectures.", img: "https://schafe-unter-strom.de/wp-content/uploads/2021/05/Schafe-unter-Strom_3-scaled.jpg", award: false },
  { id: 175, title: "Stakeholder consultation around the Celtic Interconnector", url: "https://renewables-grid.eu/database/stakeholder-consultation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2020, country: "Ireland", org: "EirGrid", desc: "EirGrid applied its “Six-step approach to grid development” placing importance on stakeholder engagement, open and transparent communication, and acknowledging the social impact of project assessment and decision-making for the Celtic Interconnector project.", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_EirGrid_StakeholderConsultation1-644x398-c-default.jpg", award: false },
  { id: 176, title: "The electricity world at school", url: "https://renewables-grid.eu/database/electricity-world/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2020, country: "Italy", org: "Terna", desc: "Italian TSO,Ternahas developed a series of educational materials for schools with which pupils can learn about the how the electricity system works and the role of electricity transmission and TSOs. The aim is to increase awareness of the need for the electricity grid among youths and local communities.", img: "https://renewables-grid.eu/app/uploads/2026/03/2020_Database_Terna_ElectricityWorldatSchool1-644x398-c-default.png", award: false },
  { id: 177, title: "Virtual public engagement Project’s first visit", url: "https://renewables-grid.eu/database/virtual-engagement/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2020, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "To enable environmental impact assessments at a time where COVID-19 limitations inhibited in-person visits, Portuguese TSO, REN used drone footage and satellite imagery to illustrate the territory of new transmission lines and to draw special attention to environmental constraints. Objectives 01 Produced videos to illustrate territory of new transmission lines 02 Reduced necessity for in-person […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2020_Database_REN_VirtualPublicEngagement1-644x398-c-default.jpg", award: false },
  { id: 178, title: "“Green construction roads” Soil protection during construction", url: "https://renewables-grid.eu/database/green-construction-roads/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2020, country: "Germany", org: "Amprion", desc: "Amprion constructed 43km of underground cable for the German section of the first power bridge between Germany and Belgium: the ALEGrO project. To reduce the project’s invasiveness, Amprion created a comprehensive soil management plan and was the first to utilise the innovative “Green construction road” concept on a large scale project. Objectives 01 Development of […]", img: "https://renewables-grid.eu/app/uploads/2020/02/2020_Database_Amprion_GreenConstructionRoads1-644x398-c-default.jpg", award: false },
  { id: 179, title: "Alerta Tendidos", url: "https://renewables-grid.eu/database/alerta-tendidos/", brand: "RGI", dim: "Nature, People", topic: "Bird Protection", inf: "Grids", year: 2019, country: "Spain", org: "Foundation “Friends of the Iberian Imperial Eagle, Iberian Linx and Private Natural Areas”", desc: "The project “Alerta Tendidos” which means “Powerlines Alert”, consists of the development, dissemination and improvement of a free user-friendly mobile application to engage citizens in the identification of potentially dangerous power lines for birds of prey, specifically for the endangered Iberian Imperial Eagle. Highlights 01 An easy-to-use mobile application allows for engagement of civil society, […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Foundation-22Friends-of-the-Iberian-Imperial-Eagle-Iberian-Linx-and-Private-Natural-Areas22_AlertaTendidos1-644x398-c-default.jpg", award: false },
  { id: 180, title: "Alternative Insulation System for Switchgears", url: "https://renewables-grid.eu/database/alternative-insulation-system/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2019, country: "Germany", org: "Nuventura", desc: "Nuventura develops environmentally-friendly medium voltage (MV) gas insulated switchgear (GIS) – key hardware components found throughout electrical grids and energy infrastructure. Existing GIS technologies use Sulphur Hexafluoride (SF6) – the most potent greenhouse gas (GHG) humanity knows – as their insulating medium. Nuventura replaces SF6 with dry air, thereby helping to tackle global greenhouse gas […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_Nuventura_AlternativeInsulationSystemforSwitchgears1-644x398-c-default.jpg", award: false },
  { id: 181, title: "Biohuts attached to Biodiversity Observation Buoy (BoB)", url: "https://offshore-coalition.eu/database-project/biohuts-attached-to-biodiversity-observation-buoy-bob/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2019, country: "France", org: "ECOCEAN, OW, EFGL, Centre de Recherche sur les Écosystèmes Marins (CREM – UPVD/CNRS)", desc: "To understand the potential of nature-inclusive designs (NIDs) for floating structures to enhance biodiversity in Mediterranean Sea, with a particular focus oncrustaceans, molluscs, andjuvenile and adult fish populationsin the open sea and coastal areas.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/06/Installation-BOB-%C2%A9-Remy-Dubas-4-Gilles-Lecaillon-Gilles-Lecaillon.jpg", award: false },
  { id: 182, title: "Development of a MOOC on power frequency electromagnetic fields", url: "https://renewables-grid.eu/database/mooc-on-power-frequency/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2019, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE France developed a Massive Open Online Course (MOOC) on electromagnetic fields (EMF) caused by power frequency, giving everybody free access to inform themselves about the much debated topic. The MOOC includes information material, videos and a discussion forum. Highlights 01 The platform aims at opening up educational content to as many people as possible without constraints and […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_RTE_Mooc3-644x398-c-default.png", award: false },
  { id: 183, title: "Eco-friendly scour protection at the Borssele offshore wind farm (Site V)", url: "https://offshore-coalition.eu/database-project/eco-friendly-scour-protection/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2019, country: "Netherlands", org: "Van Oord, Wageningen Marine Research, Waardenburg Ecology, Netherlands Institute for Sea Research, HZ University of Applied Sciences, and Roem van Yerseke", desc: "The project aims to enhance natural habitats in offshore wind farms, with a particular focus on theEuropean flat oyster, by developing and testing various eco-friendly scour protection designs and oyster reinstatement methods.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Ecoscour-1-e1728912298917.jpg", award: false },
  { id: 184, title: "GRIDSOL: Smart Renewable Hubs for flexible generation", url: "https://renewables-grid.eu/database/gridsol/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2019, country: "", org: "Cobra Instalaciones y Servicios S.A.", desc: "“Smart Renewable Hubs” combine primary Renewable Energy Sources (RES) and storage technologies under an advanced control system that dispatches the electricity on a single output according to the availability and cost-effectiveness of each technology. Highlights 01 Takes into account the local specificities in deciding which technologies work best to optimise power generation 02 Evaluation of […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_CobraGroup_GRIDSOL2-644x398-c-default.jpg", award: false },
  { id: 185, title: "Nemo link cable road project", url: "https://renewables-grid.eu/database/nemo-link/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2019, country: "Belgium", org: "Elia", desc: "Nemo Link is an electrical subsea interconnector between the UK and Belgium. During its planning and construction phase many new environmentally friendly approaches were taken to keep the environmental impact of Nemo Link as small as possible. Highlights 01 Nemo Link was successfully routed around environmentally sensitive areas. 02 Elia conducted comprehensive studies to be […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_Elia_NemoLink2-644x398-c-default.jpg", award: false },
  { id: 186, title: "Networks Renewed", url: "https://renewables-grid.eu/database/networks-renewed/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Solar", year: 2019, country: "Australia", org: "Institute for Sustainable Futures (ISF),", desc: "Networks Renewed was a $5 million (AUD) trial that aimed to prove that rooftop solar could be an asset, not a problem, for the electricity grid. The trial investigated non-network alternatives for providing voltage support using smart inverters connected to solar PV and battery storage. The project proved that smart inverters have the capability to […]", img: "https://renewables-grid.eu/app/uploads/2019/03/2019_Database_UTS_NetworksRenewed1-644x398-c-default.jpg", award: false },
  { id: 187, title: "Open Innovation Challenge", url: "https://renewables-grid.eu/database/open-innovation-challenge/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2019, country: "Belgium", org: "Elia", desc: "The Open Innovation Challenge (OIC) is an annual competition for start-ups organised by Elia Group. Successful applicants receive funding from Elia Group while the company can leverage ideas that help them improve the operation of their teams and change the internal culture of the company, making it more agile and innovative. Highlights 01 The OIC […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Elia_OpenInnovationChallenge1-644x398-c-default.jpg", award: false },
  { id: 188, title: "Planning Dialogue Borgholzhausen", url: "https://renewables-grid.eu/database/planning-dialogue-borgholzhausen/", brand: "RGI", dim: "People, Planning", topic: "Spatial & Strategic Planning", inf: "Energy system", year: 2019, country: "Germany", org: "Amprion", desc: "The planning dialogue Borgholzhausen is a special form of public participation in the planning of a high voltage underground line. The planning dialogue comprises two formats: public citizen information markets and a non-public stakeholder planning committee. The dialogue was restarted after a deadlock and successfully managed to transform into an inclusive practice. Highlights 01 Restart […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Amprion_PlanningDialogeBorgholzhausen1-644x398-c-default.jpg", award: false },
  { id: 189, title: "REN Biodiversity Chair", url: "https://renewables-grid.eu/database/ren-biodiversity-chair/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2019, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "Portuguese TSO REN is engaged in the ‘Invited Research Chairs’ programme run by the Portuguese Foundation for Science and Technology (FCT) and created a Research Chair at the Research Centre on Biodiversity and Genetic Resources (CIBIO), University of Porto. The research team focuses on assessing the impacts of power lines on biodiversity. Highlights 01 The […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_REN_BiodiversityChair1-644x398-c-default.jpg", award: false },
  { id: 190, title: "Sinus Mowing Methods in Netherlands and Germany", url: "https://renewables-grid.eu/database/sinus-mowing-methods/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2019, country: "Germany", org: "TenneT", desc: "TenneT, a transmission system operator in the Netherlands and in parts of Germany has collaborated with De Vlinderstichting (Dutch Butterfly Conservation) to convert voltage substations into suitable habitats for butterflies and invertebrates. Their pilot project in Netherlands uses the innovative method of sinus mowing, where grass is cut in phases and some parts are left uncut. Through […]", img: "https://renewables-grid.eu/app/uploads/2025/09/2019_Database_Tennet_SinusMowing1-644x398-c-default.png", award: false },
  { id: 191, title: "Underground Cable Information Center", url: "https://renewables-grid.eu/database/underground-cable-center/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2019, country: "Germany", org: "TenneT", desc: "This practice revolves around a pilot underground cable information centre called “Voltage under the Earth“, designed and built next to a TenneT cable construction site, to inform about the technology and increase local and regional acceptance. Highlights 01 “Voltage under the Earth” is a permanent offer of a mix of information, touchable technology and a look “behind […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2019_Database_Tennet_UndergroundCableInformationCenter1-644x398-c-default.jpg", award: false },
  { id: 192, title: "3D Decision Support System (3D DSS) for planning power lines", url: "https://renewables-grid.eu/database/3d-support-system/", brand: "RGI", dim: "Planning", topic: "Spatial & Strategic Planning", inf: "Grids", year: 2018, country: "Switzerland", org: "Swissgrid & ETH Zurich", desc: "The 3D DSS considers the interests of different stakeholders and supports decision-makers in finding a consensus solution for determining the optimal route for a new power transmission line. This can increase support of affected citizens and shortens the time needed for the approval procedure, which in turn, accelerates the grid modernisation required for the European energy transition.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_Swissgrid_3DDSS1-644x398-c-default.png", award: false },
  { id: 193, title: "CECOVEL (Electric Vehicle Control Centre)", url: "https://renewables-grid.eu/database/cecovel/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Spain", org: "Red Eléctrica de España", desc: "CECOVEL (Electric Vehicle Control Centre) is Red Eléctrica’s control centre for the monitoring and control of electricity demand for the recharging of electric vehicles. Since January 2017, CECOVEL allows the safe and efficient integration of electric vehicles, even in scenarios of massive implementation.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_REE_CECOVEL1-644x398-c-default.png", award: false },
  { id: 194, title: "CompactLine", url: "https://renewables-grid.eu/database/compactline/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Germany", org: "50Hertz", desc: "Development of a compact 380kV overhead line that minimises the impact on the surroundings and allows continuous operation during maintenance.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_50Hertz_CompactLine1-644x398-c-default.png", award: false },
  { id: 195, title: "District energy efficient retrofitting", url: "https://renewables-grid.eu/database/efficient-retrofitting/", brand: "RGI", dim: "People", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Spain", org: "CARTIF", desc: "Renovation of the district heating system, facade retrofitting, and deployment of a monitoring platform.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_Cartiff_Retrofitting1-644x398-c-default.png", award: false },
  { id: 196, title: "DS3 System Services", url: "https://renewables-grid.eu/database/ds3-system-services/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Ireland", org: "EirGrid", desc: "This programme byEirGridoffers financial incentives for conventional and renewable generation to provide flexible services in order to meet the challenges of operating the electrical system in a secure manner while achieving Ireland’s 2020 renewable electricity targets.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_EirGrid_DS31-644x398-c-default.png", award: false },
  { id: 197, title: "Dynamic Line Rating (DLR)", url: "https://renewables-grid.eu/database/dlr/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Grids", year: 2018, country: "Belgium", org: "Ampacimon", desc: "Ampacimon developed Dynamic Line Rating technology using direct physical measurements to assess actual thermal ratings of transmission lines. Deployed on Elia's interconnectors in Belgium, the approach increased import/export capacity by approximately 10%, resolved congestion issues, and reduced operational costs related to redispatching and curtailment.", img: "https://renewables-grid.eu/app/uploads/2026/03/2018_Database_VSD_IntegratedVegetationManagement2.png", award: false },
  { id: 198, title: "eGreen Community Solar Project", url: "https://renewables-grid.eu/database/egreen/", brand: "RGI", dim: "People, Technology", topic: "Public Acceptance & Engagement, Circularity & Supply Chains", inf: "Grids", year: 2018, country: "United States", org: "Citizens Energy Corporation", desc: "In California, the Citizens Energy Corporation, under the leadership of former Congressman Joseph P. Kennedy II, has developed a unique model to reduce electricity bills for low-income households to a cost of 2 cents per kilowatt-hour, using profits from a commercial transmission line. The model includes a partnership with the local utility to integrate more renewables into the grid while cutting down on fossil-fuel emissions and help those that are less fortunate.", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_CEC_eGreen2-644x398-c-default.jpg", award: false },
  { id: 199, title: "ElectriCITY – an Educational Package for Schools", url: "https://renewables-grid.eu/database/electricity/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2018, country: "Belgium", org: "Elia in cooperation with Flemish DSOs", desc: "ElectriCITY is a school package designed by Belgian TSO, Elia to educate primary and secondary students on the importance of the energy transition.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_Elia_Electricity1-644x398-c-default.png", award: false },
  { id: 200, title: "EntreREDes an Educational Game for Schools", url: "https://renewables-grid.eu/database/entreredes/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2018, country: "Spain", org: "REE – Red Eléctrica de España", desc: "EntreREDes (Education from Childhood Towards a Sustainable Energy Model and Responsible Consumption) is a digital education platform which acts as a question and answer game that allows children to work out concepts related to the function, needs and challenges of the energy system in a playful and entertaining manner. Highlights 01 The game has over […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2018_database_REE_entreredes_2-644x398-c-default.jpg", award: false },
  { id: 201, title: "Implementation of a Comprehensive Green-Area-Concept", url: "https://renewables-grid.eu/database/green-area-concept/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2018, country: "Germany", org: "Amprion", desc: "The creation and implementation of a comprehensive green-area-concept as part of a dialogue driven participation and planning process for a new substation between the TSO and citizens.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_Amprion_GreenAreaConcept1-644x398-c-default.png", award: false },
  { id: 202, title: "Integrated Vegetation Management with a team of Biologists", url: "https://renewables-grid.eu/database/integrated-vegetation-vsd/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2018, country: "Slovakia", org: "VSD", desc: "Slovakian DSOVSDcollaborates with a central team of biologists to maintain vegetation in their high voltage and medium voltage corridors.", img: "https://renewables-grid.eu/app/uploads/2018/03/2018_Database_VSD_IntegratedVegetationManagement1-644x398-c-default.png", award: false },
  { id: 203, title: "MIGRATE TSO research project", url: "https://renewables-grid.eu/database/migrate/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "", org: "Project consortium", desc: "MIGRATE is the largest TSO research project on European level including twelve TSOs from eleven different countries with the objective of developing and validating solutions for managing a pan-European High Voltage Alternate Current (HVAC) transmission system with a high penetration of power electronic devices.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_ProjectConsortium_MIGRATE1-644x398-c-default.png", award: false },
  { id: 204, title: "Natural High-Tech: The Great Scallop as an Environmental Sensor", url: "https://renewables-grid.eu/database/natural-high-tech/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2018, country: "France", org: "RTE, TBM Environment", desc: "This project is assessing whether temporarily increased turbidity and noise levels caused by the installation of new subsea cables have an impact on seabed ecosystems.", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_RTE_NaturalHighTech1-1-644x398-c-default.png", award: false },
  { id: 205, title: "Nobel Grid End User Engagement Strategy", url: "https://renewables-grid.eu/database/nobel-grid/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2018, country: "", org: "Carbon Co-op", desc: "A comprehensive end user engagement strategy with a variety of different engagement tools empowering consumers and putting them at the centre of the Nobel Grid project.", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_CooP_NobelGrid1-644x398-c-default.jpeg", award: false },
  { id: 206, title: "Oyster Broodstock Structures in Eneco Luchterduinen offshore wind farm", url: "https://offshore-coalition.eu/database-project/oyster-broodstock-structures-in-eneco-luchterduinen-offshore-wind-farm/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2018, country: "Netherlands", org: "The Rich North Sea, Eneco, and Van Oord", desc: "To test several outplacement methods and identify key success factors for enhancing marine ecosystems within offshore wind farms through the restoration ofEuropean flat oysters.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/1920_luchterduinenmissie-28-3.jpg", award: false },
  { id: 207, title: "Plataforma Tejo investment platform", url: "https://renewables-grid.eu/database/plataforma-tejo/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2018, country: "Portugal", org: "MédioTejo21", desc: "Plataforma Tejo is an investment mechanism used to facilitate sustainability projects in the Médio Tejo region in Portugal. The programme works as a tool to pair investors with investment opportunities in the renewable energy sector, while creating relationships between citizens and promoting the development of the region with respect to sustainability and renewable energy.", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_MedioTejo21_PlatformaTejo1-644x398-c-default.jpg", award: false },
  { id: 208, title: "Recovering Posidonia oceanica seagrass meadows in Bay of Pollença", url: "https://offshore-coalition.eu/database-project/recovering-seagrass-meadows-pollenca/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2018, country: "Spain", org: "Red Eléctrica, Mediterranean Institute for Advanced Studies (IMEDEA), Regional Ministry of the Environment and Territory, Ministry of Defense and the Pollensa Military Air Base", desc: "The project aims to restore two hectares ofPosidonia oceanicaseagrass meadows in the Bay of Pollença.", img: "https://offshore-coalition.eu/wp-content/uploads/2024/10/Posidonia-14-scaled.jpg", award: false },
  { id: 209, title: "Smart Island Giglio Archipelago", url: "https://renewables-grid.eu/database/smart-island/", brand: "RGI", dim: "Technology", topic: "Spatial Optimisation", inf: "Solar", year: 2018, country: "Italy", org: "Terna", desc: "Redevelopment of a landfill into a green area for renewable energy power production on Giannutri Island in Italy. Highlights 01 Creation of photovoltaic fields to reduce the impact of humans on the island and reduce the dependence on diesel fuel 02 Implementation of an automatic cover system in order to eliminate solar reflective glare in […]", img: "https://renewables-grid.eu/app/uploads/2018/02/2018_Database_Terna_SmartIsland1-644x398-c-default.jpg", award: false },
  { id: 210, title: "SmartNet TSO-DSO coordination", url: "https://renewables-grid.eu/database/smartnet/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2018, country: "Italy", org: "Project consortium", desc: "A simulation platform to compare TSO-DSO coordination schemes that enables the participation of distribution network resources to ancillary services markets plus three technological pilots experimenting concrete technical solutions to enable ancillary services provision from distribution networks. Highlights 01 Development of a simulation platform with 2030 scenarios for Italy, Denmark and Spain 02 Cost-Benefit Assessment (CBA) […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2018_Database_SmartNet1-644x398-c-default.png", award: false },
  { id: 211, title: "Biohut NIDs attached to a Floating Offshore Wind 10 MW Windfloat Turbine", url: "https://offshore-coalition.eu/database-project/biohut-nids-attached-to-a-floating-offshore-wind-10-mw-windfloat-turbine/", brand: "OCEaN", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Offshore wind", year: 2017, country: "France", org: "Ecocean & OCEAN WINDS", desc: "To increase the ecological function of floating offshore wind farms by installing artificial plug-in Biohuts®, targetingcrustaceans, molluscs and fish.", img: "https://offshore-coalition.eu/wp-content/uploads/2025/06/EFG1-Septembre-2025-%C2%A9RD-HD-14-scaled.jpg", award: false },
  { id: 212, title: "Enhancing infrastructure resilience against wildfires and extreme storms in Portugal", url: "https://renewables-grid.eu/database/enhancing-infrastructure-resilience/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2017, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "REN, the Portuguese Transmission System Operator (TSO), developed a set of monitoring instruments tailored to different climate hazards, such as wildfires, storms and extreme temperature before and during these events occur. Managing of these events is backed by smart (artificial intelligence – AI) decision support system. Nature-based and community-oriented solutions are implemented to prevent future […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2017_REN_Picture-644x398-c-default.png", award: false },
  { id: 213, title: "Greenconnector – low impact high voltage underground cable systems", url: "https://renewables-grid.eu/database/greenconnector/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Energy system", year: 2017, country: "Italy", org: "Greenconnector", desc: "Worldenergy is developing the Greenconnector, an underground HVDC cross-border interconnector between Italy (Lombardy) and Switzerland (Graubünden). By reusing existing infrastructure, including an out-of-service oil pipeline and lakebed cable laying, the project aims to expand renewable electricity exchange across the Alps while reducing environmental impacts.", img: "https://renewables-grid.eu/app/uploads/2017/02/2017_Database_Greenconnector1-644x398-c-default.png", award: false },
  { id: 214, title: "Innovative Public Participation for SuedLink", url: "https://renewables-grid.eu/database/innovative-public-participation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2017, country: "Germany", org: "TransnetBW; TenneT", desc: "Innovative and transparent public participation in Germany’s central electricity grid project, SuedLink. The process, which was co-developed with local governments and other stakeholders, included various engagement formats, such as an online platform and info as well as landowner forums.", img: "https://renewables-grid.eu/app/uploads/2026/02/2017_Database_Transnet_InnovativePublicParticipation1-644x398-c-default.jpg", award: false },
  { id: 215, title: "PCI permitting one stop shop for Vikinglink interconnector", url: "https://renewables-grid.eu/database/one-stop-shop/", brand: "RGI", dim: "Planning, People", topic: "Grid Development Planning, Public Acceptance & Engagement", inf: "Grids", year: 2017, country: "United Kingdom", org: "National Grid Viking Link Limited & Energinet.dk", desc: "National Grid Viking Link Limited and Energinet.dk are developing a cross-border interconnector (Viking Link) between UK and Denmark. It is one of the most multi-jurisdictional infrastructure projects in Europe to fully apply the “one stop shop”, a permitting and participation approach introduced in the European Commission's TEN-E regulation.", img: "https://renewables-grid.eu/app/uploads/2017/02/2017_Database_Energienet_PCI-644x398-c-default.png", award: false },
  { id: 216, title: "Radar monitoring on the Strait of Messina", url: "https://renewables-grid.eu/database/radar-monitoring/", brand: "RGI", dim: "Nature", topic: "Bird Protection, Monitoring & Reporting", inf: "Energy system", year: 2017, country: "Italy", org: "Terna", desc: "Italian TSO Terna monitors migratory birdlife between the region of Calabria and the island of Sicily in order to assess the impact of a new overhead line (OHL). Two radars were used to collect scientific and measured evidence of the number of birds passing the corridor line, their migratory routes and their flying height.", img: "https://renewables-grid.eu/app/uploads/2026/02/2017_Database_Terna_RadarMonitoring1-644x398-c-default.jpg", award: false },
  { id: 217, title: "Regulation on Cost Benefit Analysis (CBA) methodology for the Italian transmission network development plan", url: "https://renewables-grid.eu/database/regulation-on-cba/", brand: "RGI", dim: "Planning, People", topic: "Grid Development Planning, Creating Awareness & Capacity Building", inf: "Grids", year: 2017, country: "Italy", org: "Italian Regulatory Authority for Energy and Water (AEEGSI)", desc: "AEEGSI conducted a series of public consultations and workshops leading to an improved CBA for new grid infrastructure projects. It became a national regulation and was already applied to Italy’s Network Development Plan (NDP) in 2017.", img: "https://renewables-grid.eu/app/uploads/2026/02/2017_Database_AEEGSI_CBA1-644x398-c-default.png", award: false },
  { id: 218, title: "Strengthening energy infrastructure against weather hazards in Finland", url: "https://renewables-grid.eu/database/strengthening-energy-infrastructure/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: 2017, country: "Finland", org: "Elenia", desc: "Elenia, an electricity distributor in Finland, is replacing overhead power lines with underground cables. This transition aims to reduce potential risk for power outages caused by storms, heavy snow and other climate-related hazards. The goal is to make the electricity network more stable and better prepared for increasing frequency of extreme weather events. Highlights 01 […]", img: "https://renewables-grid.eu/app/uploads/2025/12/2017_Elenia_Picture2-644x398-c-default.jpg", award: false },
  { id: 219, title: "WiseGRID – Wide scale demonstration of integrated solutions and business models for the European smart grid", url: "https://renewables-grid.eu/database/wisegrid/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2017, country: "Spain", org: "ETRA I+D", desc: "The WiseGRID project provides a set of solutions, technologies and business models which increase the smartness, stability and security of an open, consumer-centric European energy grid and provide cleaner and more affordable energy for European citizens, through an enhanced use of storage technologies and electromobility and a highly increased share of RES. It aims to […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2017_Database_Etra_WiseGRID-644x398-c-default.png", award: false },
  { id: 220, title: "Animated video Clean Energy Mini-Grid", url: "https://renewables-grid.eu/database/animated-video/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2016, country: "Mozambique", org: "EDP Networks", desc: "Portuguese utilities company, EDP developed an animated video called “Clean Energy Mini-Grid”, which visualises the implementation of electricity production from biomass in a remote village in Mozambique. Objectives 01 Communicate clearly and effectively to both the local population, including illiterate citizens, and to other stakeholders about the Clean Energy Mini-Grid project 02 Attract funding for the Mini-Grid […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_EDP_AnimatedVideo-644x398-c-default.png", award: false },
  { id: 221, title: "Close and personal dialogue: development of a Mobile Citizen’s Office for public participation", url: "https://renewables-grid.eu/database/close-personal-dialogue/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2016, country: "Germany", org: "50Hertz", desc: "German TSO 50Hertz developed a Mobile Citizen’s Office (DialogMobil), intended for public participation and communication purposes. Through the DialogMobil, 50Hertz informs and engages with residents in a direct conversation on the energy transition and planned grid development activities. Highlights 01 Accessing local knowledge and gathering relevant information early via direct contact between locals and […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_50Hertz_Closeandpersonaldialogue1-644x398-c-default.png", award: false },
  { id: 222, title: "Close to the citizen, close to home, on an equal footing", url: "https://renewables-grid.eu/database/close-to-citizen/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Germany", org: "Schleswig‑Holstein Ministry of Energy, Agriculture, the Environment and Rural Areas; TenneT", desc: "The government of the German state of Schleswig-Holstein, the TSO TenneT and the local districts of Dithmarschen and Nordfriesland developed an informal dialogue procedure for a new transmission line along Northern Germany’s West coast, which was implemented in close cooperation in 2013. Corridor options and technology alternatives were discussed with local citizens, municipalities and associations before the permission phase of the project and as a sort of substitute for the formal spatial planning procedure.", img: "https://renewables-grid.eu/app/uploads/2016/03/2016_Database_Tennet_Closetothecitizens1-644x398-c-default.png", award: false },
  { id: 223, title: "Communication and Participation Concept", url: "https://renewables-grid.eu/database/communication-and-participation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Germany", org: "Amprion", desc: "Amprion developed a comprehensive communication approach for the routing of the interconnector project “ALEGrO” linking Belgium and Germany, aiming to inform and involve the public early, gather valuable feedback, adapt routing accordingly, and increase acceptance of the interconnector route.", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_Amprion-CommandPartConcept1-644x398-c-default.png", award: false },
  { id: 224, title: "Early involvement of landowners", url: "https://renewables-grid.eu/database/involvement-of-landowners/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Denmark", org: "Energinet.dk", desc: "Danish TSO Energinet applied a communication methodology to involve landowners affected by a 150 kV cable project in the early planning stages – before and during the authority permitting procedures. The approach aimed to integrate local knowledge, increase transparency, and give landowners the possibility to influence the project.", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 225, title: "Educational Material on History of Electricity", url: "https://renewables-grid.eu/database/educational-material/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2016, country: "Lithuania", org: "LitGrid", desc: "Litgrid, the Lithuanian transmission operator, created an educational website to explain the history of electricity in Lithuania and the functioning of the national grid to the general public. The website increases understanding of electricity production, delivery, and grid management, inspiring interest in electrical engineering.", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_LitGrid_EduMaterial2-644x398-c-default.jpg", award: false },
  { id: 226, title: "EirGrid Community Support Fund", url: "https://renewables-grid.eu/database/eirgrid-community-support-fund/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2016, country: "Ireland", org: "EirGrid", desc: "EirGrid developed a Community Support Fund in order to provide compensation to local communities who are located closest to new transmission infrastructure. The fund recognises the importance of local communities and voluntary organisations aiming to address issues that those particular communities are facing and provides them with compensation in the form of grants.", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_EirGrid_CommunitySupportFund1-644x398-c-default.jpg", award: false },
  { id: 227, title: "ID4AL Project: Hierarchical and distributed automation for medium voltage (MV) and low voltage (LV) grids", url: "https://renewables-grid.eu/database/id4al/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2016, country: "Finland", org: "IDE4L", desc: "The EU-funded IDE4L project demonstrated a system of distribution network automation, IT systems, and functions enabling active network management. The distributed decision-making architecture improves real-time monitoring and controllability of MV and LV grids, efficiently integrating renewable energy and new loads without compromising reliability.", img: "https://renewables-grid.eu/app/uploads/2016/02/2016_Database_ID4AL_MVandLVGrids-644x398-c-default.png", award: false },
  { id: 228, title: "MARES Real Time Automatic Control for PSH in Small Isolated Systems", url: "https://renewables-grid.eu/database/mares/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Spain", org: "Red Eléctrica de España", desc: "Red Eléctrica de España (REE)’s real-time monitoring tool MARES enables safe, high-level renewable energy integration on the island of El Hierro. Designed for isolated grids, MARES helps balance wind energy and pumped hydro storage, reducing diesel dependency and ensuring grid stability.", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_REE_MARES3-644x398-c-default.jpg", award: false },
  { id: 229, title: "Objective Osprey", url: "https://renewables-grid.eu/database/objective-osprey/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2016, country: "France", org: "RTE", desc: "Launched in 2016 during RTE’s Nature Festival, the Objective Osprey project brings together ONF, Loiret Nature Environnement, RTE and the City of Orléans. It aims to preserve and improve knowledge of the osprey, a rare and vulnerable bird of prey in France, through cameras, observatories, research and public awareness.", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_RTE_ObjectiveOsprey1-644x398-c-default.png", award: false },
  { id: 230, title: "Promotion of biogas systems in rural Kenya", url: "https://renewables-grid.eu/database/biogas-systems/", brand: "RGI", dim: "People", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Kenya", org: "Namalere Forest Conservation Group", desc: "The Namalere Forest Conservation Group (NFCYG) promotes off-grid solutions combined with biogas as an alternative source of energy in Kenya to improve social welfare. This includes better living conditions and health for inhabitants, environmental protection, and sustainability through an efficient and cost-saving approach.", img: "https://renewables-grid.eu/app/uploads/2016/01/2016_Database_Namalere_BiogasSystems1-644x398-c-default.png", award: false },
  { id: 231, title: "Public Consultation Your Grid, Your Views, Your Tomorrow", url: "https://renewables-grid.eu/database/public-consultation/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2016, country: "Ireland", org: "EirGrid", desc: "EirGrid carried out a national public consultation on its strategy to develop Ireland’s grid in the future. Entitled “Your Grid, Your Views, Your Tomorrow”, this engagement initiative was the first of its kind, with an emphasis on the citizen’s role in how Ireland’s grid is developed. The initiative was welcomed by the Irish government. Objectives 01 Enhancing public […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_EirGrid_PublicConsultation-644x398-c-default.png", award: false },
  { id: 232, title: "PV energy data service", url: "https://renewables-grid.eu/database/pv-energy-data/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2016, country: "Germany", org: "SMA Solar Technology & TenneT", desc: "SMA Solar Technology AG uses near-time data from small and medium-sized photovoltaic (PV) systems in the TenneT grid area to create precise, geographically detailed PV generation extrapolations and forecasts. This practice helps make solar energy more predictable, reducing the need for expensive control reserves and supporting grid reliability.", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_SMATennet_PVenergy-644x398-c-default.png", award: false },
  { id: 233, title: "Real-time technology for the effective integration of distributed energy resources", url: "https://renewables-grid.eu/database/real-time-technology/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Switzerland", org: "Alpiq", desc: "Alpiq developed a real-time data-to-decision platform that offers products and services to its customers and partners for all aspects around energy and flexibility markets. The self-learning algorithms deployed in the cloud platform catalyse the effective integration of Distributed Energy Resources (DER) through the optimal dispatch of flexible generation and load.", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_Alpiq_RTT1-644x398-c-default.png", award: false },
  { id: 234, title: "Recovery of Posidonia Oceanica seagrass meadows", url: "https://renewables-grid.eu/database/recovery-of-posidonia-oceanica-seagrass-meadows/", brand: "RGI", dim: "", topic: "Nature Conservation & Restoration", inf: "", year: 2016, country: "Spain", org: "REE – Red Eléctrica de España", desc: "Posidonia Oceanica is a seagrass species that provides essential functions to the Mediterranean ecosystem, most notably it acts as a natural carbon sink. Spanish TSO, Red Eléctrica de España (REE) has developed and applied a methodological guide to restore large-scale degraded areas and ensure the non-invasive recovery of Posidonia Oceanica, according to R&D results. Highlights 01 […]", img: "https://renewables-grid.eu/app/uploads/2025/09/Screenshot_2022-01-04_at_17-compressed-644x398-c-default.jpg", award: false },
  { id: 235, title: "Tests to prove reliability of large-scale solar PV", url: "https://renewables-grid.eu/database/reliability-large-scale-solar-pv/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Solar", year: 2016, country: "United States", org: "California ISO, First Solar, National Renewable Energy Laboratory (NREL)", desc: "California ISO - CAISO, the US National Renewable Energy Laboratory - NREL and solar PV solutions company, First Solar demonstrated how large-scale solar resources can provide essential reliability services to the grid, which have traditionally been offered by conventional power plants. A series of technical tests conducted on a 300 MW PV plant showcased the role of advanced controls in leveraging the solar energy’s value and contributing to grid stability.", img: "https://renewables-grid.eu/app/uploads/2025/11/2016_Database_CAISO_Tests-to-prove-reliability-of-large-scale-solar-PV-644x398-c-default.png", award: false },
  { id: 236, title: "Underground high voltage cables (UGCs) – Environmental research and on-site development of innovative solutions", url: "https://renewables-grid.eu/database/underground-high-voltage-cables/", brand: "RGI", dim: "Nature", topic: "Monitoring & Reporting", inf: "Grids", year: 2016, country: "Germany", org: "Amprion", desc: "Amprion has been conducting a long-term ecological research programme in rural areas, consisting of 20 years of field experiments, and of validation of experimental findings through monitoring of an UGC project in Germany. Through this project, Amprion aims to increase the understanding of UGCs’ thermal and hydrological impact on the soil, and of any resulting […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_Amprion_UGCs1-644x398-c-default.png", award: false },
  { id: 237, title: "Virtual Power Plant Next Pool", url: "https://renewables-grid.eu/database/virtual-power-plant/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2016, country: "Germany", org: "Next Kraftwerke", desc: "Next Kraftwerke developed a Virtual Power Plant (VPP) that uses cloud-computing technology to integrate the flexibility of both power producers and consumers, particularly decentralised renewable energy plants. By aggregating their output, the VPP can provide control reserve to balance fluctuations in the electricity grid.", img: "https://renewables-grid.eu/app/uploads/2026/01/2016_Database_NextKraftwerke_VirtualPowerPlant1-644x398-c-default.png", award: false },
  { id: 238, title: "VVMplus Research Project", url: "https://renewables-grid.eu/database/vvmplus-research-project/", brand: "RGI", dim: "People, Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2016, country: "Denmark", org: "The Danish Centre for Environmental Assessment at Aalborg University", desc: "The project aims to increase social acceptance of renewable energy projects through improvements in the Environmental Impact Assessment (EIA) process by enabling dialogue and including communities in the process.", img: "https://renewables-grid.eu/app/uploads/2026/02/2016_Database_AalborgUniversity_VVMplus1-644x398-c-default.png", award: false },
  { id: 239, title: "Animated videos for grid expansion", url: "https://renewables-grid.eu/database/animated-videos/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2015, country: "Germany", org: "BNetzA", desc: "The Bundesnetzagentur developed animated online videos to provide the public with accessible, comprehensive, and reliable information about the five steps in Germany’s complex legislative procedure for grid expansion.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_BNetzA_AnimatedVideos1-644x398-c-default.png", award: false },
  { id: 240, title: "Application éCO2mix", url: "https://renewables-grid.eu/database/eco2mix/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2015, country: "France", org: "RTE", desc: "éCO2mix is a public online application developed by RTE to provide transparent, real-time electricity data in France. It helps users of all backgrounds understand the power system, track renewable integration, and monitor consumption, production, and emissions.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_RTE_eCO2-644x398-c-default.png", award: false },
  { id: 241, title: "BALANCE – Power grid game application", url: "https://renewables-grid.eu/database/balance/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: 2015, country: "Norway", org: "Statnett", desc: "Statnett developed a gaming app for mobile devices dealing with the topic of grid expansion in order to increase knowledge of and interest in energy, electricity, the power system, the green electric future and related topics among the general public and stakeholders.", img: "https://renewables-grid.eu/app/uploads/2026/02/2015_Database_Statnett_Balance1-644x398-c-default.png", award: false },
  { id: 242, title: "Birds and electricity transmission lines: mapping of flight paths", url: "https://renewables-grid.eu/database/mapping-of-flight-paths/", brand: "RGI", dim: "Nature", topic: "Bird Protection, Monitoring & Reporting", inf: "Grids", year: 2015, country: "Spain", org: "Red Eléctrica de España", desc: "Red Eléctrica de España (REE) is developing a GIS-based tool to integrate bird flight path data across Spain. This enables planning and construction of power lines with minimal environmental impact and prioritises mitigation actions on existing lines to protect endangered species.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_REE_MappingFlightPath2-644x398-c-default.jpg", award: false },
  { id: 243, title: "DS3 Advisory Council", url: "https://renewables-grid.eu/database/ds3-advisory-council/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2015, country: "Ireland", org: "EirGrid", desc: "Eirgrid‘s DS3 Advisory Council was established in 2011 to provide a forum to discuss the views and concerns of the DS3 Programme’s wide range of stakeholders on issues which impact on the successful implementation of the programme (DS3 = “Delivering a Secure, Sustainable Electricity System”).2014 Objectives 01 Discuss, review and ultimately help facilitate the progress of the […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_EirGrid_DS3_1-644x398-c-default.jpg", award: false },
  { id: 244, title: "East Iceland Clean Energy Connections", url: "https://renewables-grid.eu/database/clean-energy-connections/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2015, country: "Iceland", org: "Landsnet", desc: "Landsnet applied load control schemes to the existing grid infrastructure in order to connect fish factories in East Iceland to the main grid using synchronised real-time measurements. This connection enabled the factories to replace crude oil for their energy consumption needs with renewable-sourced electricity from the main grid.", img: "https://renewables-grid.eu/app/uploads/2026/02/2015_Database_Landsnet_CleanEnergyConnections1-644x398-c-default.png", award: false },
  { id: 245, title: "Empowerment of citizens via crowd funding", url: "https://renewables-grid.eu/database/empowerment-via-crowd-funding/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2015, country: "France", org: "RTE", desc: "RTE uses crowdfunding to enhance public acceptability of new power lines. Through the My territorial projects platform, local initiatives receive co-funding from citizens, RTE, and the PAP (Plan d’Accompagnement de Projet), fostering sustainable development in communities affected by grid projects.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_RTE_EmpowermentCrowdFunding1-644x398-c-default.png", award: false },
  { id: 246, title: "EnergizAIR", url: "https://renewables-grid.eu/database/energizair/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2015, country: "Belgium", org: "APERe", desc: "EnergizAIR is an international initiative providing easy-to-understand indicators that show the current capacity for renewable energy production across Europe.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_APERe_EnergizAIR2-644x398-c-default.jpg", award: false },
  { id: 247, title: "Green Corridors – Restoration of wildlife corridors under overhead lines in Belgium and France", url: "https://renewables-grid.eu/database/green-corridors/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2015, country: "Belgium", org: "LIFE Elia-RTE; Elia; RTE; Ecofirst", desc: "LIFE Elia-RTE was a 2011–2017 project combining grid safety with biodiversity-friendly vegetation management under high-voltage lines in Belgium and France. By creating green corridors through a multi-partner approach, it enhanced biodiversity, improved public perception, and proved more cost-effective than conventional vegetation management.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_LIFEElia-RTE_Greencorridors1-644x398-c-default.png", award: false },
  { id: 248, title: "HV Voltage Source Converter for Skagerrak 4 Interconnector", url: "https://renewables-grid.eu/database/converter-for-skagerrak/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2015, country: "Denmark", org: "Statnett", desc: "Skagerrak 4 is a subsea interconnector between Norway and Denmark using Voltage Source Converter (VSC) technology to strengthen grid stability, enable black-start capability, reduce harmonic distortion, and integrate wind and hydro generation while enhancing electricity supply security.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_Statnett_HVVoltageConverter1-644x398-c-default.png", award: false },
  { id: 249, title: "Joint public power line planning", url: "https://renewables-grid.eu/database/joint-power-line/", brand: "RGI", dim: "Planning, People", topic: "Grid Development Planning, Public Acceptance & Engagement", inf: "Grids", year: 2015, country: "Germany", org: "TenneT; Küstenwelten Institute (KWI)", desc: "TenneT, in cooperation with KWI (Institute for Advanced Study in the Humanities, Essen), developed and implemented a new set of participation concepts to enhance early citizen involvement in grid expansion planning. The approach aimed to identify route corridors together with citizens, ensure transparency and accountability, and integrate local knowledge into the official planning process.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_Tennet_Jointpublicpowerline1-644x398-c-default.png", award: false },
  { id: 250, title: "Man-made nest programme", url: "https://renewables-grid.eu/database/nest-programme/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2015, country: "Hungary", org: "Mavir", desc: "MAVIR installed and monitored man-made nests on power pylons to protect the endangered Saker Falcon, reducing mortality and power interruptions.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_database_mavir_nestprogramme1-644x398-c-default.png", award: false },
  { id: 251, title: "Minimise cable impact on marine ecosystem", url: "https://renewables-grid.eu/database/minimise-cable-impact/", brand: "RGI", dim: "Nature", topic: "Nature Conservation & Restoration", inf: "Grids", year: 2015, country: "Italy", org: "Terna", desc: "Terna developed an innovative methodology for laying submarine cables that minimizes environmental impacts and protects sensitive habitats such as the endangered seagrass Posidonia oceanica. Applied to the Malta–Sicily interconnector, this practice ensures sustainable construction while supporting renewable energy integration in Malta’s electricity system.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_Terna_MinimiseCableImpact1-644x398-c-default.png", award: false },
  { id: 252, title: "Net demand ramping variability", url: "https://renewables-grid.eu/database/ramping-variability/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Grids", year: 2015, country: "United States", org: "California ISO", desc: "The California Independent System Operator (CAISO) introduced a real-time measurement system for net demand ramping variability, improving grid reliability amid growing renewable energy integration. This approach allows better planning, faster response, and compliance with operating standards.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_CaiSO_NetDemand1-644x398-c-default.png", award: false },
  { id: 253, title: "Preventing Electrocution of Endangered Birds", url: "https://renewables-grid.eu/database/preventing-electrocution-of-birds/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2015, country: "Bulgaria", org: "BirdLife,", desc: "Cooperation between NGOs, industry and governments to prevent electrocution of endangered birds on distribution power lines in Bulgaria and Sudan, led by the Bulgarian Society for the Protection of Birds (BSPB) and the BirdLife International – UNDP/GEF Migratory Soaring Birds Project. Objectives 01 Identifies power lines that are a threat to bird species. 02 Replaces […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_Birdlife_PreventingElectrocution1-644x398-c-default.png", award: false },
  { id: 254, title: "The future of energy Turning young people into aware citizens", url: "https://renewables-grid.eu/database/the-future-of-energy/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2015, country: "Germany", org: "50Hertz", desc: "In cooperation with its nature conservation partners, 50Hertz is implementing a range of both fun and informative communication activities that specifically target young adolescents and the communities in which they live. Objectives 01 Convey the challenges of the energy transition and of grid development to young people 02 Establish a strong network within the affected […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_50Hertz_Thefutureofenergy1-644x398-c-default.png", award: false },
  { id: 255, title: "The Variable Ratio Distribution Transformer (VRDT)", url: "https://renewables-grid.eu/database/the-vrdt/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2015, country: "Germany", org: "Avacon", desc: "The Variable Ratio Distribution Transformer (VRDT) is a simple, cost-efficient alternative to conventional low-voltage grid expansion. By decoupling low voltage from medium voltage, it releases unused capacity in the medium voltage grid, enabling better integration of renewable energy without major infrastructure expansion.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_Avacon_VRDT1-644x398-c-default.jpg", award: false },
  { id: 256, title: "Transparent transmission grid planning", url: "https://renewables-grid.eu/database/transparent-grid/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2015, country: "Germany", org: "Germanwatch", desc: "Germanwatch, a German climate and environment organization, closely monitored the implementation of new legislation on transmission grid planning and actively participated in expert discussions. Their focus was on ensuring that grid planning aligns with ambitious climate and energy targets, is transparent and participative, and adheres to high environmental standards.", img: "https://renewables-grid.eu/app/uploads/2015/01/2015_Database_Germanwatch_TransparentTransmissionGrid1-644x398-c-default.jpg", award: false },
  { id: 257, title: "Équilibre Pylon design", url: "https://renewables-grid.eu/database/equilibre/", brand: "RGI", dim: "People, Technology", topic: "Public Acceptance & Engagement, Circularity & Supply Chains", inf: "Grids", year: 2015, country: "France", org: "RTE", desc: "The Équilibre Pylon is an innovative 400 kV pylon design created for the replacement of an existing line. Developed by RTE with public involvement, it combines aesthetic integration into the landscape with technical improvements, enhancing social acceptance and functionality.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_RTE_EquilibrePylonDesign1-644x398-c-default.png", award: false },
  { id: 258, title: "CHP Accumulator System", url: "https://renewables-grid.eu/database/chp-accumulator-system/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2014, country: "Germany", org: "Fernwärme Ulm", desc: "The practice used a water-based system as a heat accumulator – and essentially, also an electricity accumulator – in order to respond to heat consumption peaks and increase the general efficiency of the region’s combined heat and power (CHP) plant. The heat accumulator used in the project is a steel tank containing 2.400 m3 of water. Objectives […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_FernwarmeUlm_CHPAccumulationSystem1-644x398-c-default.png", award: false },
  { id: 259, title: "Community Dialogue for Suedlink", url: "https://renewables-grid.eu/database/community-dialogue-suedlink/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2014, country: "Germany", org: "TenneT", desc: "TenneT’s “Community dialogue for SuedLink” is a communication strategy encompassing local participation in the form of info-marts that allow for on-the-ground dialogue and involve citizens in the planning of SuedLink. Objectives 01 Build an “equal-to-equal” communication strategy in order to manage the high levels of opposition to the project. 02 Increase acceptability among local people. […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_Tennet_Suedlink1-644x398-c-default.png", award: false },
  { id: 260, title: "DER Integration System", url: "https://renewables-grid.eu/database/der-integration-system/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2014, country: "Italy", org: "Enel", desc: "The “DER Integration system” is a system developed by the Italian branch of the ENEL Group, that, combining various technological measures, increases hosting capacity for distributed generation and ensures operation security, allowing for voltage and power flow control in a smart grid architecture. objectives 01 Solve the main problems arising in active grids including hosting capacity, […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_Enel_DER1-644x398-c-default.png", award: false },
  { id: 261, title: "Eagle Pylon", url: "https://renewables-grid.eu/database/eagle-pylon/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2014, country: "Denmark", org: "Bystrup", desc: "Bystrup developed the Eagle Pylon, an innovative design for electricity pylons, providing an alternative to classic lattice towers. It addresses visual amenity concerns, is easier to produce, transport, install, and maintain, and creates a positive image while ensuring efficiency in transmission.", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_Bystrup_EaglePylon1-644x398-c-default.png", award: false },
  { id: 262, title: "Experience Orchard", url: "https://renewables-grid.eu/database/experience-orchard/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2014, country: "Germany", org: "50Hertz", desc: "Development of an orchard area as part of the mitigation and compensation measures portfolio of 50Herts that combined both environmental and social aspects. objectives 01 Integrate social activities and cooperation on a regular basis into the compensatory measures process 02 Utilize the orchard area with a larger social impact and a larger participation of stakeholders […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_50Hertz_ExperienceOrchard-644x398-c-default.png", award: false },
  { id: 263, title: "New power grids and nature conservation", url: "https://renewables-grid.eu/database/new-power-grids/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2014, country: "Germany", org: "NABU", desc: "NABU’s power grids and nature conservation project promotes an energy transition sensitive to environmental concerns by enhancing the involvement of conservation organisations in grid projects through diverse engagement and communication efforts.", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_database_NABU_NewPowerGrids1-644x398-c-default.png", award: false },
  { id: 264, title: "Pulse Heating", url: "https://renewables-grid.eu/database/pulse-heating/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Solar", year: 2014, country: "Denmark", org: "ESCSH", desc: "ESCSH developed a district heating system using both pulse heat and solar panels in order to reduce heat losses in supply pipes and supply low-energy houses in an energy efficient way.", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_ESCSH_PulseHeating1-644x398-c-default.jpg", award: false },
  { id: 265, title: "Stork Platform Campaign", url: "https://renewables-grid.eu/database/stork-platform-campaign/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2014, country: "Bulgaria", org: "EVN", desc: "EVN Bulgaria’s Stork Platform Campaign installs artificial nesting platforms on distribution power poles to protect white storks from electrocution and improve grid reliability. The platforms maintain safe distances between nests and electric parts, reducing bird mortality while safeguarding infrastructure.", img: "https://renewables-grid.eu/app/uploads/2026/01/2015_Database_LIFEElia-RTE_Greencorridors3-644x398-c-default.jpg", award: false },
  { id: 266, title: "T-Pylon", url: "https://renewables-grid.eu/database/t-pylon/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2014, country: "United Kingdom", org: "National Grid", desc: "Development of an innovative design concept for electrical pylons in order to provide an alternative to classic lattice pylons. Objectives 01 Create a pylon that addresses visual amenity concerns 02 Create a family of pylons in order to cover the range of classic lattice pylons 03 Meet the technical safety and reliability requirements Main Information […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2014_Database_NationalGrid_Pylon1-644x398-c-default.png", award: false },
  { id: 267, title: "Wildlife Protection along the LitPol Link Route", url: "https://renewables-grid.eu/database/wildlife-protection-litpol/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2014, country: "Lithuania", org: "", desc: "“Wildlife protection along the LitPol Link route” is a campaign with the intention of protecting wildlife habitats along the route of the Lithuania-Poland power link, LitPol Link. Objectives 01 Ensure an ecologically worthwhile way of protecting any rare wildlife species that may be inhabiting the route 02 Minimise the environmental impact of the LitPol Link […]", img: "https://renewables-grid.eu/app/uploads/2014/01/2014_Database_Litgrid_LitPol1-644x398-c-default.png", award: false },
  { id: 268, title: "3D Virtual Reality used before court", url: "https://renewables-grid.eu/database/3d-virtual-reality/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Netherlands", org: "TenneT", desc: "TenneT has developed a 3D virtual reality (3D VR) animation for the Randstad380 project. This animation has not only served its purpose in providing stakeholders and the public with information but it has also been proved useful before court. The 3D VR has helped people that had raised objections to the project by giving them […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 269, title: "Advisory group during spatial planning", url: "https://renewables-grid.eu/database/advisory-group-spatial-planning/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2013, country: "Switzerland", org: "Swiss Federal Office of Energy (SFOE) (leading role);Swissgrid;Federal Office for Spatial Development (ARE);Federal Office for the Environment (FOEN);Federal Inspectorate for Heavy Current Installations (ESTI);Federal Office of Transport (FOT);Electricity Industry;Swiss Federal Railways;Swiss organizations for environmental protection;Project engineer;Local associations for environmental protection;Concerned canton", desc: "The sectoral plan for transmission lines is the overriding planning instrument for new power lines in Switzerland. During this procedure, possible conflicts are identified, solutions developed and in the end the best possible corridor for the new line is determined. Throughout the process, an advisory group is regularly consulted.During discussions, project specific knowledge is exchanged and possible areas of conflicts are identified. Together with the group, a scoping document for the Environmental Impact Assessment, which is conducted during the next stage, the plan approval procedure, is compiled.", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 270, title: "Citizens Transmission", url: "https://renewables-grid.eu/database/citizens-transmission/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Grids", year: 2013, country: "United States", org: "Citizens Energy Corporation", desc: "The Citizens Transmission project, created by Joseph P. Kennedy II, dedicates 50% of profits from high-voltage transmission lines to charitable energy assistance programmes for low-income households. By combining infrastructure investment with social impact, the initiative delivers renewable energy while supporting vulnerable communities.", img: "https://renewables-grid.eu/app/uploads/2026/01/2013_Database_CitizensTransmission_CitizensEnergyCorporation-644x398-c-default.png", award: false },
  { id: 271, title: "Citizens’ bonds (“Bürgeranleihe”)", url: "https://renewables-grid.eu/database/citizens-bonds/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "In the summer of 2013, TenneT realized the first pilot project for financial participation of affected citizens of a transmission line in the region Schleswig-Holstein, in the Northern part of Germany. 15% of the investment sum of the “West-coast line” was made available for investment via so-called citizens’ bonds (“Bürgeranleihe”). People living within a radius […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 272, title: "Continuous stakeholder dialogue for project Wahle-Mecklar", url: "https://renewables-grid.eu/database/dialogue-for-wahle-mecklar/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "For the project “Wahle-Mecklar”, TenneT has organised a multitude of events and meetings before the official permitting procedure, totalling more than 150 events. In addition, working groups meant to accompany the planning have been established. These groups are compiled of representatives from nature conservation authorities, districts, citizen action groups, forest authorities and the like. During […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 273, title: "Cooperation agreement with the German federal state of Brandenburg", url: "https://renewables-grid.eu/database/cooperation-agreement-with-brandenburg/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "The state of Brandenburg in North-Eastern Germany has signed a cooperation agreement with 50Hertz for greater transparency surrounding grid expansion projects. It was signed within the context of an expert forum with participants from citizen action groups, environmental NGOs, industry, authorities and municipal associations. 50Hertz and the state government aimed at complementing current planning legislation […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 274, title: "Cooperation with school on nature trail: engaging youngsters", url: "https://renewables-grid.eu/database/cooperation-with-school/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "Main Information On his own initiative, a teacher had contacted 50Hertz with regards to a nature trail that is located near a power line, for which the TSO had some compensation measures planned. Subsequently, 50Hertz entered into a dialogue with the school on the subject of the nature trail, discussing different measures that could be […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 275, title: "Dedication of resources for grid issues from NGOs", url: "https://renewables-grid.eu/database/dedication-of-resources/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2013, country: "Germany", org: "RSPB,", desc: "New legal and political procedures create different options for input from NGOs and the public. These require considerable resources from NGOs in case they want to give substantial input. Some NGOs have thus started to allocate additional resources. Germanwatch and RSPB have both established new positions for a policy officer who deals with electricity and grids. This gives […]", img: "https://renewables-grid.eu/app/uploads/2013/03/2013_Database_GermanWatch_DedicationofResources-644x398-c-default.png", award: false },
  { id: 276, title: "Evaluation scheme for underground cables vs. overhead lines", url: "https://renewables-grid.eu/database/evaluation-scheme/", brand: "RGI", dim: "Planning", topic: "Grid Development Planning", inf: "Grids", year: 2013, country: "Switzerland", org: "Swissgrid", desc: "Whether transmission lines are to be constructed overhead or placed underground in Switzerland is being decided on a case-by-case basis and in accordance with objective criteria. For this purpose, the Swiss Federal Office of Energy (SFOE) has developed a \"transmission lines evaluation model”.", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 277, title: "Expert workshops on scenarios and sensitivities of grid development planning", url: "https://renewables-grid.eu/database/expert-workshops-on-scenarios/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2013, country: "Germany", org: "50Hertz,", desc: "During the discussions on the German national grid development plan, TSOs have initiated a continuous dialogue with expert stakeholders, such as NGOs. So far, discussions have focused, among other things, on the analysis of sensitivities in order to get a better understanding about the impact of a certain parameter (e.g. capping some renewable production peaks) […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 278, title: "Explaining the need for new grids to the public", url: "https://renewables-grid.eu/database/explaining-to-public/", brand: "RGI", dim: "People", topic: "Fair & Inclusive Energy Transition", inf: "", year: 2013, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "In order to explain the broader picture and the need for new grids, RTE is considering developing a video game, in which one can “play” dispatcher, take control over load flows, and have a budget, etc. The idea of the game is to show in an easy and understandable format why the strengthening or expansion […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 279, title: "Financing information material on stakeholder opinions", url: "https://renewables-grid.eu/database/material-stakeholder-opinions/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2013, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "During the public debate at the beginning of each new grid expansion project, RTE has to pay for publications of opinions of different stakeholder groups. In a four-pager, everyone opposing or supporting the project can explain why they think the line should be built, how it should be built or why it should not be built. […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 280, title: "HCCP Interactive Consultation", url: "https://renewables-grid.eu/database/hccp-interactive-consultation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "United Kingdom", org: "National Grid", desc: "Taking the form of a comprehensive and transferable PC-to-PC 3D model, the “HCCP Interactive Consultation” is a communication tool that aims at effectively implementing new grid projects and achieving public acceptability. Objectives 01 Provide an effective, portable and user friendly communication tool 02 Provide the public with accurate and comprehensive information 03 Test the transferability […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2013_Database_Nationalgrid_HCCPInteractive-644x398-c-default.png", award: false },
  { id: 281, title: "Independent feasibility studies for underground cables", url: "https://renewables-grid.eu/database/studies-underground-cables/", brand: "RGI", dim: "Planning", topic: "Spatial Optimisation", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "At a cross-border project between the Netherlands and Germany, people kept asking to explore the possibility of building the new power line underground. When they understood that an underground AC cable would not be possible, they focused their demands on a DC cable. A previously conducted study on the technical feasibility of undergrounding in the […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 282, title: "Information and learning exhibitions in schools: learning about the energy transition", url: "https://renewables-grid.eu/database/information-and-learning-exhibitions/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "Together with the Independent Institute for Environmental Issues, 50Hertz organises educational events at primary schools every year. Pupils and their parents are informed on the energy transition, for example, and can discuss this topic with representatives from politics, authorities, and industry. In an interactive exhibition that was designed for children to join in and gain […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 283, title: "Internal restructuring for improved engagement", url: "https://renewables-grid.eu/database/internal-restructuring/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "TenneT", desc: "During the past year, TenneT has restructured its entire department for onshore projects. This process included an expansion of resources for stakeholder dialogue. TenneT has divided its grid operation territory into four clusters and has dedicated two so-called ‘citizen officers’ to each region. Spread out in different regions, they serve as TenneT’s main contact points […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 284, title: "Market place style information event", url: "https://renewables-grid.eu/database/market-place-style/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Switzerland", org: "Swissgrid", desc: "In summer 2013, Swissgrid organized the first information events concerning the first expansion project with partial cabling of 380 kV in Switzerland. On the line between Beznau and Birr, four of the five segments have already been approved and completed for 2×380 kilovolts. Main Information The present project only deals with one segment, for which, […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 285, title: "Multi-stakeholder working groups", url: "https://renewables-grid.eu/database/multi-stakeholder/", brand: "RGI", dim: "Planning", topic: "Advocating for Optimised Grids", inf: "Grids", year: 2013, country: "Germany", org: "50Hertz,", desc: "To solve some of these challenges that arise with the implemenation of the new legislation on electricity grids in Germany, different working groups have been established. First of all, there is an overarching communication group at federal level, which consists of all four TSOs plus the regulator/permitting authority. In addition, groups for specific projects have […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 286, title: "New method to calculate EMF zones", url: "https://renewables-grid.eu/database/new-method-for-emf/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "Energy system", year: 2013, country: "Netherlands", org: "TenneT", desc: "In the coming years, TenneT will have to build several new power lines next to already existing lines in order to increase the overall capacity. By bundling the two lines in one corridor, the impact on the landscape will be lessened. The previous method in calculating the magnitude of electromagnetic fields would not sufficiently take […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 287, title: "Newspaper supplements", url: "https://renewables-grid.eu/database/newspaper-supplements/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "In the past year, 50Hertz has had good experiences with their information flyers that they had inserted into local newspapers. These flyers are meant to introduce specific aspects of grid projects and provide the public with topical information. Different surveys commissioned by 50Hertz have shown that people living in areas where new power lines are […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 288, title: "Rationalisation of urban areas", url: "https://renewables-grid.eu/database/rationalisation-of-urban-areas/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2013, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE is installing and producing live videos of ospreys living in nests located on top of RTE pylons in order to conduct ornithological studies. Objectives 01 Provide visual information about feeding, mortality, predation and nest life habits of ospreys 02 Raise awareness of the need of osprey protection 03 Demonstrate RTE’s active involvement in the […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2013_Database_Terna_RationalisationUrbanAreas-644x398-c-default.png", award: false },
  { id: 289, title: "Route Planning Game", url: "https://renewables-grid.eu/database/route-planning-game/", brand: "RGI", dim: "Planning, People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2013, country: "Germany", org: "50Hertz", desc: "50Hertz developed a computer game that makes the difficulties of finding the best route for a new power line more tangible. Players need to identify a possible option for building a new power line while considering impacts on costs, social compatibility, nature and landscape. Only if all of these impacts are considered in an acceptable […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 290, title: "Stakeholder dialogue to determine route corridors", url: "https://renewables-grid.eu/database/stakeholder-dialogue/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2013, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "In France, the Préfet decides on the participation of stakeholders in different committees, the number and themes of the committees and the number and format of the meetings. Participants normally include mayors, local associations and authorities. Usually, the non-organised public is not involved in the stakeholder dialogue unless the Préfet decides to organise public meetings. […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 291, title: "Strategic approach for stakeholder engagement", url: "https://renewables-grid.eu/database/strategic-approach/", brand: "RGI", dim: "Planning, People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2013, country: "Switzerland", org: "Swissgrid", desc: "At the beginning of a new project, the project manager (as part of the asset management team) draws up a plan on when and with whom Swissgrid will communicate proactively. This is done in close cooperation with the communication department. Certain milestones of the project and a comprehensive stakeholder mapping form the basis for this […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 292, title: "Augmented reality app", url: "https://renewables-grid.eu/database/augmented-reality-app/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2012, country: "Switzerland", org: "Swissgrid", desc: "Main Information Swissgrid developed an augmented reality app, which addresses recent discussions about overhead lines or underground cabling in the transmission grid. Animated, three-dimensional graphics present both technologies and their individual effects on the environment in a virtual landscape. explore more practices", img: "https://www.swissgrid.ch/.imaging/mte/swissgrid-theme/embeddedmedia-desktop/dam/swissgrid/about-us/newsroom/blog/2021/ar-bild-01.jpg/jcr:content/ar-bild-01.jpg", award: false },
  { id: 293, title: "Early and general grid information by 50Hertz", url: "https://renewables-grid.eu/database/grid-information/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2012, country: "Germany", org: "50Hertz", desc: "To overcome the lack of knowledge about the need for grids and the permitting procedure, more general information events for the public were organised by 50Hertz without direct relation to a specific expansion project. Local NGOs, or the regional divisions of the Chamber of Commerce, have taken the initiative in some regions. 50Hertz has been […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 294, title: "Early stakeholder involvement for regional peculiarities", url: "https://renewables-grid.eu/database/early-stakeholder-involvement/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2012, country: "Germany", org: "50Hertz", desc: "To generally get a better understanding of the concerns and requests of the local population at the beginning of a grid expansion project, 50Hertz collected information on regions with the help of different tools. On the one hand, contacts to regional authorities and stakeholders, such as industry associations, were initiated at the beginning of the […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 295, title: "EMF Road Show", url: "https://renewables-grid.eu/database/emf-road-show/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "Germany", org: "50Hertz", desc: "In summer 2012, 50Hertz went on a road show to address citizens’ concerns about the negative health effects of a project and to inform about the current status of the “Uckermark-line”. Highlights 01 Electromagnetic fields was one of the most discussed concerns 02 50Hertz installed a mobile information office in a region where the new […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_50Hertz_EMFRoadShow-644x398-c-default.png", award: false },
  { id: 296, title: "Environmental Educational formats for communities", url: "https://renewables-grid.eu/database/environmental-educational-formats/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "Germany", org: "50Hertz", desc: "German TSO 50Hertz collaborates with the NGO UfU to develop educational formats on the energy transition and grid development. These activities are used in areas located around grid projects to enhance young students’ education on these topics and promote participation in the energy transition. Highlights 01 50Hertz directly contributes to local education efforts on the […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_50Hertz_EnovironmentalEducationFormats2-644x398-c-default.jpg", award: false },
  { id: 297, title: "Establishment of Stakeholders and Environment Department", url: "https://renewables-grid.eu/database/stakeholders-environment-department/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2012, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "RTE recently initiated a reorganisation of its departments on a national level. This led to the creation of a “Département Concertation et Environnement” (DCE – Stakeholders and Environment department), which is specialised in cooperation with stakeholders. This department is at the centre of the development and engineering department, so that environmental and social matters are taken […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 298, title: "Green Corridors – Lake creation in Siebendörfer Moor Landscape Protection Area", url: "https://renewables-grid.eu/database/green-corridors-2/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "", year: 2012, country: "Germany", org: "50Hertz", desc: "To compensate for some of the disruption caused by the construction of the 380 kV overhead line linking Krümmel and Görries, 50Hertz has earmarked an area covering 10 ha to create new habitats and improve sites used by migrating birds. The creation of five new lakes (total investment: EUR 100,000) returns some of the original […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2021_Database_SPEA-E-REDES-Quercus-LPN-INCF_ProtocoloAvifauna1.png", award: false },
  { id: 299, title: "Grid Perspectives Committee", url: "https://renewables-grid.eu/database/grid-perspectives-committee/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "In France, RTE has to develop a 10-year-investment plan every year. In order to fulfill this task properly, RTE has established a ‘Grid Perspectives committee’ which consists of representatives of RTE customers (producers, distributors, large industrial consumers, traders, etc.), as well as NGO representatives (France Nature Environment, Comité de Liaison Energies Renouvelables, négaWatt Association, etc.) and public institutions (e.g. […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 300, title: "Informational joint event", url: "https://renewables-grid.eu/database/informational-joint-event/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2012, country: "Germany", org: "50Hertz", desc: "At the “Uckermark”-line, in the course of regular common activities with the Ministry for Economics of the Federal State of Brandenburg, 50Hertz organised an information event together with a citizen action group and the Ministry. Several employees of the permitting authority and representatives of environmental NGOs were present as well. Main Information The event was […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 301, title: "Internal mechanism for fast response The 48 hour rule", url: "https://renewables-grid.eu/database/internal-mechanism/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "", year: 2012, country: "Germany", org: "50Hertz", desc: "50Hertz has introduced an internal 48-hour rule for responding to external requests. While complex questions can normally not be answered within this period of time, the rule prescribes to give a personalised answer showing that the question has been received and indicating a time when a sufficient answer can be expected. Internally, the rule helps to […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 302, title: "Joint field trips to show NGOs and authorities their environmental work", url: "https://renewables-grid.eu/database/joint-field-trips/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2012, country: "Germany", org: "50Hertz", desc: "50Hertz organised a one-day site visit of its ecological corridor management pilot project in the forests of Thuringia. Highlights 01 50Hertz organised a one-day field trip to an aisle management pilot project in Thuringia, Germany 02 Participants included Birdlife Germany, forest authorities and the Ministry of Environment 03 They showed new cutting methods based on […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2012_Database_50Hertz_JointFieldTrips-644x398-c-default.png", award: false },
  { id: 303, title: "MeRegio – Minimum Emission Region", url: "https://renewables-grid.eu/database/meregio/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2012, country: "Germany", org: "EnBW", desc: "In the MeRegio project a smart grid provides a transparent and flexible tariff system for optimised renewable energy integration into the grid. The solution was by energy company, EnBW (Energie Baden-Württemberg) developed in cooperation with ABB, SAP, IBM, Systemplan and the Karlsruhe Institute of Technology (KIT). objectives 01 Provide transparency to optimise the link between generation and the use of renewable […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2012_Database_EnBW_MeRegio1-644x398-c-default.png", award: false },
  { id: 304, title: "Online information platform to soften peaks in energy consumption", url: "https://renewables-grid.eu/database/online-information-platform/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2012, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "In past years, RTE recognised that in order to achieve acceptance of single power lines, it has to consider the energy system and its impacts on society. For example, in 2021 they began to engage in activities to cushion peaks in electricity demand by actively involving consumers. In the regions of Brittany and Provence – Côte d’azur, […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 305, title: "Personalised feedback", url: "https://renewables-grid.eu/database/personalised-feedback/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: 2012, country: "Norway", org: "TenneT", desc: "Around 600 comments were submitted for the Southring, and another 142 for the Northring of the Randstad380 project during the public consultation of the official spatial planning and permitting procedure. Highlights 01 Combines personal feedback with general feedback report 02 Participants receive a personal letter plus a unique number 03 In the general feedback report […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_TenneT_PersonalisedFeedback1-644x398-c-default.png", award: false },
  { id: 306, title: "Publication of load flow data", url: "https://renewables-grid.eu/database/publication-load-flow-data/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2012, country: "Germany", org: "50Hertz", desc: "In Germany, one continuous topic of discontent in discussions with stakeholders has been that load flow data is not publicly available. Both environmental NGOs and citizens pointed out that they could not judge the need of a new line or the connection between the expansion of renewables and new grids if the data was not […]", img: "https://renewables-grid.eu/app/uploads/2025/11/2012_database_50Hertz_Publication-of-load-flow-data_1-644x398-c-default.png", award: false },
  { id: 307, title: "Study on public acceptance", url: "https://renewables-grid.eu/database/study-on-public-acceptance/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2012, country: "Germany", org: "Germanwatch", desc: "For the project “Thüringer Strombrücke” planned by 50Hertz, together with two local foundations, Germanwatch has commissioned a study on public involvement during the planning and permitting process of this power line. With the help of media analyses, the analysis of political and legal documents and interviews with involved actors, a 50 page report has been developed. The authors […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2012_Database_Germanwatch_StudyonPublicAcceptance1-644x398-c-default.png", award: false },
  { id: 308, title: "Early cooperation with regional politics in Schleswig-Holstein", url: "https://renewables-grid.eu/database/early-cooperation/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2011, country: "Germany", org: "TenneT", desc: "Besides its activities to involve political stakeholders very early during a grid expansion in Schleswig-Holstein, TenneT and the regional government implemented a variety of public information activities. To inform the public, a website was established by the government, and public events were organised. In each county, at least one event took place. The Ministry of […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 309, title: "Early information events for the public", url: "https://renewables-grid.eu/database/information-events/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2011, country: "Belgium", org: "Elia", desc: "For the consultation of the SEA scoping document of the Stevin project in Belgium, Elia decided to hold information meetings. Citizens were invited by direct mailings. Main Information Meetings were divided into two parts: In the first part, people could have a direct one-on-one dialogue with employees to talk about specific issues. The second part was a plenary session […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2009_Database_Elia_ProactiveApproachforRandstad380-644x398-c-default.png", award: false },
  { id: 310, title: "Info-Moments – Public meetings to explain route decision for Stevin project", url: "https://renewables-grid.eu/database/info-moments/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2011, country: "Belgium", org: "Elia", desc: "Following the approval of the spatial plan from the Stevin project by the Flemish government, Belgian TSO, Elia decided to go beyond legal requirements on participation and implemented a second round of public meetings. Main Information The “info-moments” were organised together with the spatial planning authority. They aimed at explaining the governmental routing decision, while providing opportunities for the […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2011_Database_Elia_Info-Moments-644x398-c-default.png", award: false },
  { id: 311, title: "Multi-Criteria Analysis", url: "https://renewables-grid.eu/database/multi-criteria-analysis/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "", year: 2011, country: "United Kingdom", org: "National Grid", desc: "Through a multi-criteria analysis approach, advantages and disadvantages of different technically-feasible options are evaluated by National Grid. Main Information They consider environmental, socio-economic and technical issues alongside capital and lifetime costs. These categories do not have a strict hierarchy. Rather, they are evaluated on a case-by-case basis. The methodology of appraising the various options only […]", img: "https://renewables-grid.eu/app/uploads/2026/02/2011_Database_NationalGrid_Multi-CriteriaAnalysis1-644x398-c-default.png", award: false },
  { id: 312, title: "Personal contact point for public", url: "https://renewables-grid.eu/database/personal-contact-point/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2011, country: "Germany", org: "50Hertz", desc: "On 50Hertz’s project websites, which normally go online when the Planning Approval Procedure is initiated, personal contact details of the project manager or the project communication manager are published together with a photo of the person. The idea is to help people (e.g. during information events) since they then know whom to approach. Links explore […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 313, title: "Regional Committees in the Cotentin-Maine project", url: "https://renewables-grid.eu/database/cotentin-maine-project/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2011, country: "France", org: "RTE – Réseau de Transport d’Electricité", desc: "To inform local stakeholders about the on-going process, two regional committees were established by the Préfet during the Cotentin-Maine project. Members included NGOs, the chamber of commerce, citizen action groups, local politicians and other relevant stakeholders. The Préfet invited them approximately twice a year and RTE had the chance to report what had been done […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 314, title: "Stakeholder workshop on need evaluation", url: "https://renewables-grid.eu/database/stakeholder-workshop/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2011, country: "Norway", org: "Statnett", desc: "In past projects, the discussion on the need for grid developments has proven to be difficult, therefore Statnett began a new approach in the Nettplan Stor-Oslo project. This included involving external stakeholders early in the evaluation. Highlights 01 Public event together with municipality, industry and Friends of the Earth Norway (Norges Naturvernforbund) 02 Discussions on the need for […]", img: "https://renewables-grid.eu/app/uploads/2026/04/2011_Database_Stattnet_StakeholderWorkshoponNeedEvaluation1-644x398-c-default.png", award: false },
  { id: 315, title: "Underground cabling meta-study", url: "https://renewables-grid.eu/database/underground-meta-study/", brand: "RGI", dim: "Technology", topic: "Energy System Optimisation", inf: "Energy system", year: 2011, country: "Switzerland", org: "Swissgrid", desc: "Main Information Swissgrid commissioned a meta-study, which aimed at examining and summarising current findings on ‘characteristics of over head lines and underground cabling’. This was a first step towards creating a scientifically sound basis which reflects state-of-the-art science and technology and which allows for an overview at a factually neutral level. The Technical University of […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 316, title: "Wintrack pylon", url: "https://renewables-grid.eu/database/wintrack-pylon/", brand: "RGI", dim: "Technology", topic: "Circularity & Supply Chains", inf: "", year: 2011, country: "Netherlands", org: "TenneT", desc: "TenneT has developed a new kind of pylon, which was implemented for the first time for the Randstad380 project. Since then, wintrack pylon has been used in the Randstad 380 kV South and North Ring projects and in the Doetinchem-Wesel project. Highlights 01 Innovative new pylon 02 Minimalist design 03 Unobtrusive presence in the landscape 04 […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2011_Database_Tennet_WintrackPylon1-644x398-c-default.jpg", award: false },
  { id: 317, title: "Communication materials to address concerns on EMF", url: "https://renewables-grid.eu/database/communication-materials/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2010, country: "", org: "RTE – Réseau de Transport d’Electricité", desc: "To respond to the concerns of citizens about the potential negative health impacts of EMF, RTE undertook several educational measures. Main Information First of all, a website has been established. Under the name “la clef des champs” (the key to the fields), RTE produces information for different interests. With the help of video clips, illustrations […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2010_Database_RTE_CommunicationMaterials1-644x398-c-default.png", award: false },
  { id: 318, title: "Communication training of Elia employees", url: "https://renewables-grid.eu/database/communication-training/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2010, country: "Belgium", org: "Elia", desc: "Elia decided to give employees the opportunity to attend communication trainings. Highlights 01 Trainings to prepare Elia staff for interactions with the public and the media 02 Communication agency shows how to talk to laymen or face emotional opposition 03 Answers to FAQs are prepared in a non-technical language Main Information Elia representatives that attended the […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 319, title: "Dual formats for continuous stakeholder involvement", url: "https://renewables-grid.eu/database/dual-formats/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "Energy system", year: 2010, country: "United Kingdom", org: "National Grid", desc: "National Grid employs dual formats for stakeholder involvement, community forums and thematic groups.2010 Main Information Community Forums are divided into two types: Strategic Community Forum (SCF) Local Community Forums (LCF) In order to be eligible for either the SCF or LCF, members need to be genuine representatives of local groups or organisations of more than […]", img: "https://renewables-grid.eu/app/uploads/2026/01/2010_Database_NationalGrid_DualFormats1-644x398-c-default.png", award: false },
  { id: 320, title: "Early involvement of local politicians and authorities in Schleswig-Holstein", url: "https://renewables-grid.eu/database/early-involvement/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2010, country: "Germany", org: "TenneT", desc: "Within the new approach of TenneT, the involvement of stakeholders has been shifted to the pre-application phase. After an acceleration agreement had been signed with the government, TenneT took part in sessions organised by county councils. TenneT would present the rough concept to local politicians and authorities without having a clear decision on possible route […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 321, title: "Management of Green Corridors in Portugal – Protection from Forest Fires", url: "https://renewables-grid.eu/database/management-of-green-corridors-in-portugal-protection-from-forest-fires/", brand: "RGI", dim: "Nature", topic: "Integrated Vegetation Management", inf: "Grids", year: 2010, country: "Portugal", org: "REN – Rede Eléctrica Nacional", desc: "Portuguese TSO,RENdeveloped an active approach to the vegetation management of buffer strips under overhead lines, maximising the services provided by the ecosystem and introducing new approaches to its conservation and restoration. The practice aims to add value to the land and the species themselves through the plantation of native trees and shrubs. As a result, the abandonment of these corridors can be avoided while protecting them from forest fires and enabling them to become income...", img: "https://renewables-grid.eu/app/uploads/2025/09/REN_1-644x398-c-default.jpg", award: false },
  { id: 322, title: "Scientific study to confirm need", url: "https://renewables-grid.eu/database/scientific-study/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2010, country: "Germany", org: "TenneT", desc: "Recognising that sound scientific proof is necessary to convince affected populations of the need for a specific power line, TenneT initiated a new approach on the western coast of the federal state, Schleswig-Holstein before the NABEG was introduced. In 2010, local distribution network operators commissioned an institute to conduct a scientific capacity study, which resulted […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 323, title: "The role of the German Environmental Aid (DUH) on the ground", url: "https://renewables-grid.eu/database/role-of-duh/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "", year: 2010, country: "Germany", org: "Deutsche Umwelthilfe,", desc: "In addition to its activities to support the need and general grid expansion discussions, the DUH plays a role in projects “on the ground”. It organises information events, which deal with the grid discussion in general as well as planning procedures for specific corridors. In addition, both the state Lower-Saxony and municipalities in Schleswig-Holstein invite […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2009_Database_Elia_ProactiveApproachforRandstad380.png", award: false },
  { id: 324, title: "Collaborative sustainability memorandum between Terna and NGOs", url: "https://renewables-grid.eu/database/sustainability-memorandum/", brand: "RGI", dim: "Nature", topic: "Bird Protection", inf: "", year: 2009, country: "Italy", org: "Terna", desc: "In 2009, WWF Italy and Terna signed a three-year cooperation agreement focused on a more sustainable development of the Italian grid. Highlights 01 Terna and WWF Italy work together for a more sustainable development of the grid 02 Common projects within 3 of WWF’s protected areas (e.g. anti-collision spirals, nesting boxes on pylons) 03 Exhibitions […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2009_Database_Terna-CollaborativeSustainabilityMemorandum-644x398-c-default.png", award: false },
  { id: 325, title: "Proactive approach in involving local authorities for Randstad380", url: "https://renewables-grid.eu/database/randstad380/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2009, country: "", org: "Elia", desc: "For the Stevin project, Elia decided to meet the mayors of the concerned municipalities ahead of the mandatory public consultations. Main Information The agenda was to discuss relevant formats for public information and dialogue, which would accompany the official public consultation. For this, Elia got in touch with the concerned municipalities, explained the ideas and decided jointly on […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2009_Database_Elia_ProactiveApproachforRandstad380-644x398-c-default.png", award: false },
  { id: 326, title: "An environmental NGO as moderator: the role of the German Environmental Aid (DUH)", url: "https://renewables-grid.eu/database/ngo-as-moderator/", brand: "RGI", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: 2008, country: "Germany", org: "Deutsche Umwelthilfe", desc: "In 2008, the German Environmental Aid (DUH) founded the “Forum Netzintegration Erneuerbare Energien” (Forum for the Integration of Renewable Energies), a discussion platform for different stakeholder groups which are affected directly or indirectly by power lines. Main Information This was the first German initiative that has brought together TSOs, environmental NGOs, industry associations, citizen action groups, and […]", img: "https://renewables-grid.eu/app/uploads/2026/03/2008_Database_DeutscheUmweltHilfe_An-environmental-NGO-as-moderator-644x398-c-default.png", award: false },
  { id: 327, title: "\"Cookstove-Biochar Ecosystems\" for Clean Cooking and Soil Restoration in Bangladesh", url: "https://panorama.solutions/en/solution/cookstove-biochar-ecosystems-clean-cooking-and-soil-restoration-bangladesh", brand: "Panorama", dim: "Nature", topic: "Energy Access", inf: "", year: null, country: "Dhaka, Bangladesh", org: "", desc: "Bangladesh faces harsh challenges as it loses land to rising sea levels. However, the impact can be buffered if we raise the productivity of inland soils. Presently, yield is being limited by low soil organic matter.  We can increase soil humus by applying biochar fertilizers.  We have seen drama...", img: "https://panorama.solutions/sites/default/files/styles/large/public/img_20170330_115937_1800x1080.jpg", award: false },
  { id: 328, title: "Affordable Access to Solar Powered Cold Storages", url: "https://panorama.solutions/en/solution/affordable-access-solar-powered-cold-storages", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "Solar", year: null, country: "Himachal Pradesh, Indien", org: "", desc: "Apple farmers in India face high post-harvest losses and market volatility. While cold storages and processing infrastructure have the potential to significantly reduce the amount of produce going to waste and improve market linkages, it is out of reach for most Indian farmers due to high initial...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2025-06/Picture%202.png", award: false },
  { id: 329, title: "Biogas Initiative for Agriculture in Indonesia funded by carbon offset", url: "https://panorama.solutions/en/solution/biogas-initiative-agriculture-indonesia-funded-carbon-offset", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Indonesia", org: "", desc: "Farmers in rural Indonesia are vulnerable to climate change and lack access to clean renewable energy. Meanwhile, Indonesia has to accelerate renewable energy uptake to achieve its national NDCs.", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/org_dsc06117.jpg", award: false },
  { id: 330, title: "BNetzA Meets Science", url: "https://renewables-grid.eu/database/bnetza-meets-science/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Grids", year: null, country: "Germany", org: "BNetzA", desc: "“BNetzA meets science” is a two-day interdisciplinary dialogue and networking event fostering collaboration, knowledge transfer, and intergenerational exchange between stakeholders engaged in the research and development of current and future grids.", img: "https://renewables-grid.eu/app/uploads/2026/01/Year_Database_BNetzA_MeetsScience1-644x398-c-default.png", award: false },
  { id: 331, title: "Climate mitigation using renewable energy through participatory approaches in Bipindi, Cameroon", url: "https://panorama.solutions/en/solution/climate-mitigation-using-renewable-energy-through-participatory-approaches-bipindi", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "", year: null, country: "Lokoundjé, South, Cameroon", org: "", desc: "The \"Strengthening Access to Solar Energy for the Bagyeli Indigenous Communities\" project in South Cameroon addresses the Bagyeli's climate change challenges, such as variable rainfall and temperature, which affect their livelihoods. These communities face poverty and vulnerability due to limited...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2024-08/FEDEC%201%20png.png", award: false },
  { id: 332, title: "E-Distribuzione strengthens Italy’s power grid resilience", url: "https://renewables-grid.eu/database/strengthening-italian-electricity-networks-against-heatwaves/", brand: "RGI", dim: "Technology", topic: "Climate Adaptation & Resilience", inf: "Energy system", year: null, country: "", org: "", desc: "E-distribuzione, an electricity distributor in Italy, is implementing a resilience plan to prepare for extreme heatwaves in Sicily and other high-risk areas in the country. The initiative follows a past extreme heat event, caused by record high temperatures exceeding 40°C that severely affected underground cables and disrupted electricity supply. This initiative strengthens the electricity network’s […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 333, title: "EMF – High threshold values and information material", url: "https://renewables-grid.eu/database/emf-high-threshold-values/", brand: "RGI", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Energy system", year: null, country: "Switzerland", org: "Swissgrid", desc: "Main Information The threshold values for electromagnetic fields in Switzerland are relatively high. In general, there is an emission value of 100 microtesla, which may not be exceeded. However, the value for areas with sensitive usage is much lower and cannot exceed 1 microtesla. This applies to areas where people are subject to radiation for […]", img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Electricity_pylons_march_across_the_landscape_-_geograph.org.uk_-_3384498.jpg", award: false },
  { id: 334, title: "Expansion of Renewable Energy Solutions in Agriculture", url: "https://panorama.solutions/en/solution/expansion-renewable-energy-solutions-agriculture", brand: "Panorama", dim: "People", topic: "Public Acceptance & Engagement", inf: "", year: null, country: "Dushanbe, Tajikistan", org: "", desc: "The proposed green energy solutions are focused on agriculture in Tajikistan, addressing critical irrigation and energy access issues. Established in 2016, the company 'Tekhnologiyahoi Sabz' (Green Technologies) installs solar-powered pumps and irrigation systems to overcome water shortages, freq...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2024-11/Solar%20irrigation.jpg", award: false },
  { id: 335, title: "General meeting with NGO", url: "https://renewables-grid.eu/database/general-meeting/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "", year: null, country: "", org: "", desc: "Main Information As an element of transparent and open communication, Swissgrid invited representatives of the most important Swiss NGOs to participate in general discussions on grid development. One aim of this meeting was to evaluate possible future collaborations. Greenpeace, WWF, Pro Natura and the Swiss Energy Foundation attended the meeting, during which Swissgrid presented not […]", img: "https://renewables-grid.eu/app/uploads/2025/08/newsletter_spring.png", award: false },
  { id: 336, title: "HandyHeroes: Low-Carbon Revitalization of Aging Communities", url: "https://panorama.solutions/en/solution/handyheroes-low-carbon-revitalization-aging-communities", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "", year: null, country: "China", org: "", desc: "The HandyHeroes Project leverages the idea of \"small repairs, big impact\" through three key innovations: activating community-based talent (technician training), integrating community service with market mechanisms, and standardizing carbon reduction. These innovations address challenges such as ...", img: "https://panorama.solutions/sites/default/files/styles/auto_small_width/public/2025-11/1376ec91ef384f7a114385a91f00831b_0.jpg?itok=or9o_k7X", award: false },
  { id: 337, title: "Namibian Bush Biomass: An Ecosystem Restoration Solution", url: "https://panorama.solutions/en/solution/namibian-bush-biomass-ecosystem-restoration-solution", brand: "Panorama", dim: "Nature", topic: "Bioenergy", inf: "", year: null, country: "Namibia", org: "", desc: "Namibia's savanna ecosystem witnesses the expansion and densification of shrubs, a phenomenon globally known as woody plant encroachment. This is attributed to various factors, including overgrazing, the exclusion of larger mammals and browsers, and wildfire suppression. Climate change is an acce...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/otjiwa_mariaan_214_red_cropped_0.jpg", award: false },
  { id: 338, title: "New role in explaining energy policy", url: "https://renewables-grid.eu/database/explaining-energy-policy/", brand: "RGI", dim: "Planning", topic: "Public Acceptance & Engagement", inf: "Energy system", year: null, country: "United Kingdom", org: "National Grid", desc: "National Grid has perceived a change in its role within the bigger picture of energy policy – independent from specific projects. Main Information The company understands that explaining the context and consequences of political decisions is becoming increasingly more necessary if it aims to succeed in achieving social acceptance of specific projects. National Grid reported […]", img: "https://renewables-grid.eu/app/uploads/2026/01/Year_Database_NationalGrid_EnergyPolicy1-644x398-c-default.png", award: false },
  { id: 339, title: "Niassa biogas project", url: "https://panorama.solutions/en/solution/niassa-biogas-project", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Niassa, Mozambique", org: "", desc: "We are testing biotech nano 500 biodigesters in conservation zones to prevent people from systematically using trees and plants in protected areas to produce energy for cooking and other necessities. This method prevent them from using fuels that are harmful to health and the environment within t...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/img-20210424-wa0006.jpg", award: false },
  { id: 340, title: "Organic Solid Waste Treatment and Biogas Energy Use in Brazil", url: "https://panorama.solutions/en/solution/organic-solid-waste-treatment-and-biogas-energy-use-brazil", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Rio de Janeiro, Rio de Janeiro, Brazil", org: "", desc: "The organic waste methanization and biogas energy recovery unit is a 100% Brazilian technology implemented in the city of Rio de Janeiro. The system was developed to treat the organic fraction of municipal solid waste (FORSU) and organic waste segregated at the source (e.g., from large generators...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/methanum_1.png", award: false },
  { id: 341, title: "Perovskite solar panels supporting life lasting animal telemetry", url: "https://panorama.solutions/en/solution/perovskite-solar-panels-supporting-life-lasting-animal-telemetry", brand: "Panorama", dim: "People", topic: "Monitoring & Reporting", inf: "Solar", year: null, country: "Brody, Lviv, Ukraine", org: "", desc: "Telemetry collars with flexible perovskite solar panels are created to support the life-lasting monitoring of animals. Collars consist of injecting printed perovskite solar panels covered by transparent epoxide and combined with a GPS fixing chip and LoRa data transmitter. Two innovative collars ...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/photo-2021-03-05-14-40-23_1.jpg", award: false },
  { id: 342, title: "Power Generation in a Landfill Biogas-Fueled Thermoelectric Power Plant", url: "https://panorama.solutions/en/solution/power-generation-landfill-biogas-fueled-thermoelectric-power-plant", brand: "Panorama", dim: "People", topic: "Bioenergy", inf: "", year: null, country: "Caieiras, São Paulo, Brazil", org: "", desc: "Termoverde Caieiras generates electricity from the biogas of Urban Solid Waste (USW) deposited in the landfill, making it the largest thermoelectric plant powered by landfill biogas in Brazil, one of the largest in the world, with an installed capacity of 29.5 MW and occupying an area of 15,000 m...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/caieiras_1.png", award: false },
  { id: 343, title: "Solar street furniture dedicated to the collection of recyclable packaging", url: "https://panorama.solutions/en/solution/solar-street-furniture-dedicated-collection-recyclable-packaging", brand: "Panorama", dim: "People", topic: "Circularity & Supply Chains", inf: "Solar", year: null, country: "France", org: "", desc: "Plastic pollution is a major problem on island territories which often lack infrastructure for processing recyclable materials. They are either buried or incinerated while a circular economy is possible.", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/visuel_sunbox_avec_toiture_solaire_2.jpg", award: false },
  { id: 344, title: "Toolbox on Solar Powered Irrigation Systems (SPIS): Information and Tools for Advising on Solar Water Pumping and Irrigation", url: "https://panorama.solutions/en/solution/toolbox-solar-powered-irrigation-systems-spis-information-and-tools-advising-solar-water", brand: "Panorama", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Solar", year: null, country: "Kenya", org: "", desc: "Solar pumps have become an economical, technically and environmentally viable alternative to conventional pumping systems powered by engines run on fossil fuels (diesel, petrol, gas) or electricity from the grid, even in the rural areas with limited or no electricity supply.", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/jbo_ken19_1298.jpg", award: false },
  { id: 345, title: "Transitioning to Low Carbon Sea Transport in the Marshall Islands", url: "https://panorama.solutions/en/solution/transitioning-low-carbon-sea-transport-marshall-islands", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "", year: null, country: "Marshall Islands", org: "", desc: "The Republic of the Marshall Islands (RMI) relies on maritime transport for economic activity, connectivity and resilience. Connectivity, especially for the remote islands and atolls, is vital for access to services and socioeconomic opportunities for citizens. Sea transport ensures the delivery ...", img: "https://panorama.solutions/sites/default/files/styles/square_x_large/public/183125942_487990629287596_2025901807770086604_n.jpg?h=a1e1a043&itok=j8Jp4Ihe", award: false },
  { id: 346, title: "Use of Solar Bio-Fermenters for Nutrition and Soil Health Management", url: "https://panorama.solutions/en/solution/use-solar-bio-fermenters-nutrition-and-soil-health-management", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "Solar", year: null, country: "Himachal Pradesh, Indien", org: "", desc: "Declining soil health and biodiversity loss, rising input costs, and decreasing fertilizer effectiveness all point to a common potential solution: a transition to more sustainable systems of agriculture, with reduced dependence on chemical-based inputs.A key enabler in this transition can be the ...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2025-06/333A4107_LowRes.jpg", award: false },
  { id: 347, title: "Using Solar Dryers for Value Addition and the Reduction of Post Harvest Loss", url: "https://panorama.solutions/en/solution/using-solar-dryers-value-addition-and-reduction-post-harvest-loss", brand: "Panorama", dim: "People", topic: "Climate Adaptation & Resilience", inf: "Solar", year: null, country: "India", org: "", desc: "The perishability of agricultural products combined with high market volatility and limited infrastructure for handling fresh produce, pose serious challenges for smallholder farmers and result in high post-harvest losses. The Green Innovation Centre - India (GIC) and Science 4 Society (S4S) tech...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/2025-06/01%20RAW%20MATERIAL.jpg", award: false },
  { id: 348, title: "Working on solar powered education in the Netherlands", url: "https://panorama.solutions/en/solution/working-solar-powered-education-netherlands", brand: "Panorama", dim: "People", topic: "Creating Awareness & Capacity Building", inf: "Solar", year: null, country: "Amsterdam, North Holland, Netherlands", org: "", desc: "Schooldakrevolutie, or School Roof Revolution is an independent organisation working on solar-powered education in the Netherlands. We advise school boards in the decisionmaking process towards the installation of solar panels on school roofs by, for example, providing detailed business cases. Ad...", img: "https://panorama.solutions/sites/default/files/styles/cover_small/public/dji_0051-1.jpg", award: false },
  { id: 349, title: "GPS-Tracking of Black Storks in France to identify high-risk areas near grid infrastructure", url: "https://www.safelines4birds.eu/post/gps-tracking-of-black-storks-in-france-to-identify-high-risk-areas-near-grid-infrastructure", brand: "SL4B", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2024, country: "France", org: "LPO", desc: "As a protected species, the Black Stork is sensitive to human disturbance, particularly in instances like forestry operations near nesting sites, as well as the risks associated with power lines, namely electrocution and collision. These threats increase during the dispersal of young storks and the pre- and post-nuptial migrations between Europe and West Africa. Despite electrocution and collision being the primary causes of Black Stork mortality in Europe, there is a scarcity of available infor", img: "https://static.wixstatic.com/media/0928d6_45e508ced81d4f6c9f7c2a8a66a6f4ba~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/0928d6_45e508ced81d4f6c9f7c2a8a66a6f4ba~mv2.jpg", award: false },
  { id: 350, title: "Passing knowledge to protect bird species: LPO PACA’s training initiatives for distribution and transmission grid operators in France", url: "https://www.safelines4birds.eu/post/passing-knowledge-to-protect-bird-species-lpo-paca-s-training-initiatives-for-distribution-and-tran", brand: "SL4B", dim: "Nature", topic: "Bird Protection, Creating Awareness & Capacity Building", inf: "Grids", year: 2024, country: "France", org: "RTE", desc: "Understanding and addressing environmental issues through training is essential for effective conservation of bird species around electricity grid infrastructure. Our partner LPO PACA has long been at the forefront, providing specialised training for employees of ENEDIS (French distribution system operator) and RTE (French transmission system operator). The SafeLines4Birds project further enhances this mission, aiming to consolidate and disseminate vital knowledge among stakeholders.One of the p", img: "https://static.wixstatic.com/media/a1dabf_07f3a5ca80ef417ebbbbd3d83e640211~mv2.jpg/v1/fill/w_1000,h_729,al_c,q_85,usm_0.66_1.00_0.01/a1dabf_07f3a5ca80ef417ebbbbd3d83e640211~mv2.jpg", award: false },
  { id: 351, title: "RTE equips six kilometres of overhead power lines with bird flight diverters in the Verdon, France", url: "https://www.safelines4birds.eu/post/rte-equips-six-kilometres-of-overhead-power-lines-with-bird-flight-diverters-in-the-verdon-france", brand: "SL4B", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2025, country: "France", org: "RTE", desc: "In the Verdon, in the heart of the Provence Alpes Côte d'Azur region, the village of Rougon is traversed by very high voltage power lines that play a key role in transporting electricity across the area. The same landscape is also home to several vulture species, whose wide wingspan and flight behaviour make them particularly vulnerable to collisions with barely visible cables.As part of our project, our partners RTE and LPO PACA have worked together to reduce this risk by marking 17 spans of th", img: "https://static.wixstatic.com/media/a1dabf_8ff7c6278b024be481b951fb32a3d123~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/a1dabf_8ff7c6278b024be481b951fb32a3d123~mv2.jpg", award: false },
  { id: 352, title: "Our actions to protect Black Storks along power lines", url: "https://www.safelines4birds.eu/post/black-storks-power-lines", brand: "SL4B", dim: "Nature", topic: "Bird Protection, Monitoring & Reporting", inf: "Grids", year: 2025, country: "France, Belgium", org: "LPO", desc: "In 2024 and 2025, the LIFE programme funded 89 GPS tags deployed on young Black Storks. In France, this tagging project is coordinated under ringing programme no. 320 (CRBPO), in partnership with LPO France, ACETAM, ONF, Natagora, Nature Nièvre, and the Parc National de Forêts.Since 2020, this collaborative effort has made it possible to monitor 162 young storks in France and 25 in Belgium, an unprecedented tracking effort for this discreet and vulnerable species.Until now, juvenile mortality ha", img: "https://static.wixstatic.com/media/7b4c46_a0c95c16f96c463bac8ed669eae88a17~mv2.png/v1/fill/w_1000,h_861,al_c,q_90,usm_0.66_1.00_0.01/7b4c46_a0c95c16f96c463bac8ed669eae88a17~mv2.png", award: false },
  { id: 353, title: "Ensuring safe nesting for birds: Installation of nesting platforms for White storks in Portugal", url: "https://www.safelines4birds.eu/post/ensuring-safe-nesting-for-birds-installation-of-nesting-platforms-in-portugal-for-white-storks", brand: "SL4B", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2025, country: "Portugal", org: "E-REDES", desc: "Nesting on electricity pylons presents a significant risk to certain bird species, particularly large birds such as white Storks and Ospreys. Not only does it increase the likelihood of electrocution, but it can also lead to infrastructure damage and outages, posing operational challenges for electricity grid operators. Addressing this issue requires a balance between bird conservation and ensuring the safe functioning of energy networks.As part of our SafeLines4Birds project, targeted mitigatio", img: "https://static.wixstatic.com/media/a1dabf_9e9e55c73f604ce3822559ef2a93c0ac~mv2.png/v1/fill/w_975,h_1000,al_c,q_90,usm_0.66_1.00_0.01/a1dabf_9e9e55c73f604ce3822559ef2a93c0ac~mv2.png", award: false },
  { id: 354, title: "Using sensitivity maps to identify the risks of collision and electrocution for birds in France", url: "https://www.safelines4birds.eu/post/using-sensitivity-maps-to-identify-the-risks-of-collision-and-electrocution-for-birds-in-france", brand: "SL4B", dim: "Nature", topic: "Bird Protection, Monitoring & Reporting", inf: "Grids", year: 2025, country: "France", org: "RTE", desc: "Whitin the framework of our project, our partner LPO France has developed a new set of sensitivity maps to help French transmission system operator RTE and distribution system operator Enedis plan and manage the electricity grid in ways that better respect biodiversity. With more than 800,000 km of overhead power lines spanning France, the grid can pose a significant risk to birds through both collisions and electrocution. Identifying the areas where sensitive species are most located is therefo", img: "https://static.wixstatic.com/media/7b4c46_c49a3f13d0ba4a138359f6a87de89159~mv2.jpg/v1/fill/w_707,h_1000,al_c,q_85,usm_0.66_1.00_0.01/7b4c46_c49a3f13d0ba4a138359f6a87de89159~mv2.jpg", award: false },
  { id: 355, title: "SafeLines4Birds at joint workshop for Ukrainian grid operators on bird protection", url: "https://www.safelines4birds.eu/post/safelines4birds-at-joint-workshop-for-ukrainian-grid-operators-on-bird-protection", brand: "SL4B", dim: "Nature", topic: "Bird Protection", inf: "Grids", year: 2023, country: "Ukraine, UK", org: "LIFE", desc: "On 11 May 2023, our partner the Renewables Grid Initiative (RGI) – in collaboration with Ukrainian energy company, DTEK – held a half-day hybrid workshop for colleagues from Ukrainian grid operators on the topic of bird protection around electricity infrastructure, and the importance of this for security of supply.​Although this topic may seem like a surprising priority, given the ongoing war in Ukraine, it actually is highly relevant also in this setting: interactions between animals and the gr", img: "https://static.wixstatic.com/media/0928d6_9022fb6448734c3d9dc9bf8bd1315e31~mv2.png/v1/fill/w_1000,h_563,al_c,q_90,usm_0.66_1.00_0.01/0928d6_9022fb6448734c3d9dc9bf8bd1315e31~mv2.png", award: false },
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
const PURPLE   = "#6B21A8";
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
  return c ? `${c.bg} ${c.text} ${c.border}` : "bg-white text-[#6B21A8] border-[#6B21A8]";
}

/* ── Truncate long text for preview cards (full text shown in modal) ── */
const truncateText = (text, maxLen = 40) => {
  if (!text || text.length <= maxLen) return text;
  const trimmed = text.slice(0, maxLen);
  const lastComma = trimmed.lastIndexOf(",");
  if (lastComma > maxLen * 0.4) {
    const remaining = text.slice(lastComma).split(",").length - 1;
    return trimmed.slice(0, lastComma).trim() + ` & ${remaining} more`;
  }
  return trimmed.trimEnd().replace(/,\s*$/, "") + "\u2026";
};

/* Country normalization (UI-layer only — CSV untouched) */
const COUNTRY_NORMALIZE = {
  "Amsterdam, North Holland, Netherlands": "Netherlands",
  "Brody, Lviv, Ukraine": "Ukraine",
  "Caieiras, São Paulo, Brazil": "Brazil",
  "Rio de Janeiro, Rio de Janeiro, Brazil": "Brazil",
  "Dhaka, Bangladesh": "Bangladesh",
  "Dushanbe, Tajikistan": "Tajikistan",
  "Himachal Pradesh, Indien": "India",
  "Lokoundjé, South, Cameroon": "Cameroon",
  "Niassa, Mozambique": "Mozambique",
  "Scotland": "United Kingdom",
  "USA": "United States",
};
const normalizeCountry = (c) => COUNTRY_NORMALIZE[c] || c;

/* Region groupings for Location filter */
const COUNTRY_REGIONS = {
  "Northern Europe": ["Denmark", "Estonia", "Finland", "Iceland", "Ireland", "Latvia", "Lithuania", "Norway", "Sweden", "United Kingdom"],
  "Western Europe": ["Austria", "Belgium", "France", "Germany", "Luxembourg", "Netherlands", "Switzerland"],
  "Southern Europe": ["Bulgaria", "Croatia", "Hungary", "Italy", "Poland", "Portugal", "Slovakia", "Slovenia", "Spain"],
  "Asia & Pacific": ["Australia", "Bangladesh", "Cambodia", "China", "India", "Indonesia", "Japan", "Jordan", "Marshall Islands", "Tajikistan", "Taiwan"],
  "Africa": ["Cameroon", "Ethiopia", "Kenya", "Mozambique", "Namibia"],
  "Americas": ["Brazil", "Peru", "United States"],
  "Multi-country": ["Europe", "Worldwide"],
};

/* Organisation normalization (UI-layer only — CSV untouched) */
const ORG_NORMALIZE = {
  /* Trailing punctuation */
  "50Hertz,": "50Hertz",
  "BirdLife,": "BirdLife",
  "DSO Entity,": "DSO Entity",
  "Deutsche Umwelthilfe,": "Deutsche Umwelthilfe",
  "EDP Networks,": "EDP Networks",
  "Institute for Sustainable Futures (ISF),": "Institute for Sustainable Futures (ISF)",
  "Natuurpunt,": "Natuurpunt",
  "Royal Society for the Conservation of Nature (RSCN),": "Royal Society for the Conservation of Nature (RSCN)",
  "Universidad Autónoma de Barcelona,": "Universidad Autónoma de Barcelona",
  "Utrecht University,": "Utrecht University",
  /* Red Eléctrica variants */
  "Red Eléctrica": "Red Eléctrica de España",
  "REE – Red Eléctrica de España": "Red Eléctrica de España",
  "Elewit – technological platform of the Red Eléctrica Group": "Red Eléctrica de España",
  "Red Eléctrica and ECOncrete": "Red Eléctrica de España",
  "Red Eléctrica, Mediterranean Institute for Advanced Studies (IMEDEA), Regional Ministry of the Environment and Territory, Ministry of Defense and the Pollensa Military Air Base": "Red Eléctrica de España",
  "Red Eléctrica, Spanish Council for Scientific Research (CSIC)": "Red Eléctrica de España",
  /* RTE variants */
  "RTE": "RTE – Réseau de Transport d\u2019Electricité",
  "RTE, TBM Environment": "RTE – Réseau de Transport d\u2019Electricité",
  /* REN variant */
  "Rede Electrica Nacional (REN), University of Coimbra, whereness": "REN – Rede Eléctrica Nacional",
  /* NABU variants */
  "NABU – Naturschutzbund Deutschland": "NABU",
  "NABU; BUND": "NABU",
  /* 50Hertz consortiums */
  "50Hertz, Energinet": "50Hertz",
  "50Hertz, Technische Universität Dresden, Mitnetz Strom, Landschaftspflegeverband Westsachsen e.V.": "50Hertz",
  "50Hertz; WWF Germany": "50Hertz",
  /* TenneT consortiums */
  "TenneT, Van Oord, and Waardenburg Ecology": "TenneT",
  "TenneT; Küstenwelten Institute (KWI)": "TenneT",
  "SMA Solar Technology & TenneT": "TenneT",
  "Schleswig\u2011Holstein Ministry of Energy, Agriculture, the Environment and Rural Areas; TenneT": "TenneT",
  "Ecocean, TenneT": "TenneT",
  /* TransnetBW consortiums */
  "TransnetBW; Netze BW": "TransnetBW",
  "TransnetBW; Stadt Leingarten": "TransnetBW",
  "TransnetBW; TenneT": "TransnetBW",
  /* Ørsted consortiums */
  "Ørsted and WWF Denmark": "Ørsted",
  "Ørsted and the Penghu Marine Biology Research Center": "Ørsted",
  "Ørsted, DTU Aqua, WWF Denmark": "Ørsted",
  "Ørsted, Wageningen Marine Research, and the Rich North Sea": "Ørsted",
  "Ørsted, Yorkshire Wildlife Trust and Lincolnshire Wildlife Trust": "Ørsted",
  /* Vattenfall consortiums */
  "Vattenfall, Van Oord, Seaway 7, Wageningen Marine Research, Waardenburg Ecology, Rich North Sea, and Witteveen & Bos": "Vattenfall",
  "Vattenfall, the Rich North Sea, the Royal Netherlands Institute for Sea Research, Wageningen Marine Research, and Waardenburg Ecology": "Vattenfall",
  /* The Rich North Sea consortiums */
  "The Rich North Sea, Blauwwind consortium, Van Oord, Bluestream offshore, and Eurofins AquaSense": "The Rich North Sea",
  "The Rich North Sea, Eneco, and Van Oord": "The Rich North Sea",
  "The Rich North Sea, Waterproof, Wageningen Marine Research, NIOZ and Waardenburg Ecology; Gemini Wind Park- ZeeEnergie.": "The Rich North Sea",
  /* Elia consortiums */
  "LIFE Elia-RTE; Elia; RTE; Ecofirst": "Elia",
  "Elia in cooperation with Flemish DSOs": "Elia",
  /* Other consortiums → lead org */
  "EirGrid, SONI": "EirGrid",
  "E.ON, Westnetz": "E.ON",
  "Statnett, NINA": "Statnett",
  "Swissgrid & ETH Zurich": "Swissgrid",
  "Swiss Federal Office of Energy (SFOE) (leading role);Swissgrid;Federal Office for Spatial Development (ARE);Federal Office for the Environment (FOEN);Federal Inspectorate for Heavy Current Installations (ESTI);Federal Office of Transport (FOT);Electricity Industry;Swiss Federal Railways;Swiss organizations for environmental protection;Project engineer;Local associations for environmental protection;Concerned canton": "Swissgrid",
  "California ISO, First Solar, National Renewable Energy Laboratory (NREL)": "California ISO",
  "National Grid Viking Link Limited & Energinet.dk": "National Grid",
  "BirdLife Africa, Bulgarian Society for the Protection of Birds (BSPB), Ethiopian Wildlife and Natural History Society (EWNHS)": "BirdLife",
  "BirdLife, Convention on Migratory Species (CMS), MAVA Foundation": "BirdLife",
  "Bulgarian Society for the Protection of Birds (BSPB), EGD West": "BSPB",
  "SPEA, E\u2011REDES, Quercus, LPN, INCF": "SPEA",
  "APG, ELES, Mavir, Transelectrica": "APG",
  "CIRCE Foundation, Project consortium": "CIRCE Foundation",
  "ECOncrete and Prysmian": "ECOncrete",
  "ECOncrete, Stony Brook University": "ECOncrete",
  "ECOCEAN, OW, EFGL, Centre de Recherche sur les Écosystèmes Marins (CREM – UPVD/CNRS)": "Ecocean",
  "Ecocean & OCEAN WINDS": "Ecocean",
  "Energiot, Iberdrola": "Iberdrola",
  "FARCROSS Project Consortium, IPTO – Independent Power Transmission Operator, SmartWires": "IPTO",
  "Maynooth University (MU), Nature+, Trinity College Dublin (TCD)": "Maynooth University",
  "Community of Allensbach, Easy Smart Grid, EIFER": "Community of Allensbach",
  "Van Oord, Wageningen Marine Research, Waardenburg Ecology, Netherlands Institute for Sea Research, HZ University of Applied Sciences, and Roem van Yerseke": "Van Oord",
  "ERIGrid consortium (18 partners from 11 European countries)": "ERIGrid",
  "Å Energi, Glitre Nett, NODES": "Å Energi",
};
const normalizeOrg = (o) => ORG_NORMALIZE[o] || o;

/* Derived filter option lists (filter out empty/null values) */
const allTopics    = [...new Set(PRACTICES.flatMap(p => p.topic ? p.topic.split(", ") : []))].filter(Boolean).sort();
const allBrands    = [...new Set(PRACTICES.map(p => p.brand))].filter(Boolean).sort();
const allDims      = [...new Set(PRACTICES.flatMap(p => p.dim ? p.dim.split(", ") : []))].filter(Boolean).sort();
const allCountries = [...new Set(PRACTICES.map(p => normalizeCountry(p.country)))].filter(Boolean).sort();
const allYears     = [...new Set(PRACTICES.map(p => p.year))].filter(y => y != null).sort((a, b) => b - a);
const allInfra     = [...new Set(PRACTICES.map(p => p.inf))].filter(Boolean).sort();
const allOrgs      = [...new Set(PRACTICES.map(p => normalizeOrg(p.org)))].filter(Boolean).sort();

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
const IconSort = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h12M3 18h6" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   HERO ANIMATED GRAPHIC (desktop only)
   ══════════════════════════════════════════════════════════════════════════════ */
function HeroGraphic() {
  return (
    <div className="relative w-full max-w-[340px] mx-auto" style={{ aspectRatio: "1" }}>
      <style>{`
        @keyframes hero-bird-float { 0%,100% { transform: translate(0,0); } 25% { transform: translate(6px,-4px); } 75% { transform: translate(-4px,-2px); } }
        @keyframes hero-bird-float-2 { 0%,100% { transform: translate(0,0); } 30% { transform: translate(3px,-3px); } 70% { transform: translate(-2px,-1px); } }
        @keyframes hero-cloud-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
        @media (prefers-reduced-motion: no-preference) {
          .hero-bird { animation: hero-bird-float 6s ease-in-out infinite; }
          .hero-bird-2 { animation: hero-bird-float-2 8s ease-in-out infinite 2s; }
          .hero-cloud { animation: hero-cloud-drift 15s ease-in-out infinite; }
        }
      `}</style>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">

        {/* Distant hills */}
        <path d="M0,290 Q45,270 95,282 Q150,295 200,275 Q250,260 310,278 Q360,290 400,272" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />

        {/* Clouds */}
        <g className="hero-cloud" opacity="0.28">
          <path d="M52,58 Q58,42 72,44 Q78,32 92,38 Q102,30 112,40 Q120,36 124,46 Q132,44 130,56" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="hero-cloud" opacity="0.2" style={{ animationDelay: "5s" }}>
          <path d="M280,42 Q286,30 296,34 Q302,26 312,32 Q318,28 322,38 Q328,36 326,46" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Left pylon — taller, foreground */}
        <g opacity="0.85">
          {/* Legs */}
          <path d="M78,320 Q80,230 84,145" fill="none" stroke="#FFF8E5" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M108,320 Q106,232 102,145" fill="none" stroke="#FFF8E5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Cross braces */}
          <path d="M82,180 Q93,177 104,180" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
          <path d="M80,220 Q93,217 106,220" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
          <path d="M79,260 Q93,257 107,260" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
          {/* X braces */}
          <path d="M82,180 Q94,200 106,220" fill="none" stroke="#FFF8E5" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M104,180 Q92,200 80,220" fill="none" stroke="#FFF8E5" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M80,220 Q94,240 107,260" fill="none" stroke="#FFF8E5" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M106,220 Q92,240 79,260" fill="none" stroke="#FFF8E5" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          {/* Top piece */}
          <path d="M84,145 Q93,138 102,145" fill="none" stroke="#FFF8E5" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M93,138 Q92,128 93,120" fill="none" stroke="#FFF8E5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Arms */}
          <path d="M62,142 Q72,138 84,145" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M102,145 Q114,138 124,142" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
          {/* Insulators */}
          <path d="M62,142 Q63,148 62,152" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M124,142 Q123,148 124,152" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Right pylon — shorter, background perspective */}
        <g opacity="0.7">
          {/* Legs */}
          <path d="M298,322 Q300,252 302,192" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M322,322 Q320,254 318,192" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
          {/* Cross braces */}
          <path d="M300,225 Q310,222 320,225" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M299,260 Q310,257 321,260" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M298,295 Q310,292 322,295" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
          {/* X braces */}
          <path d="M300,225 Q310,243 321,260" fill="none" stroke="#FFF8E5" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
          <path d="M320,225 Q310,243 299,260" fill="none" stroke="#FFF8E5" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
          {/* Top piece */}
          <path d="M302,192 Q310,186 318,192" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M310,186 Q309,178 310,172" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
          {/* Arms */}
          <path d="M286,190 Q294,186 302,192" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
          <path d="M318,192 Q326,186 334,190" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
          {/* Insulators */}
          <path d="M286,190 Q287,195 286,198" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M334,190 Q333,195 334,198" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Power lines — catenary curves between pylons */}
        <path d="M62,152 Q180,215 286,198" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        <path d="M124,152 Q210,220 334,198" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <path d="M93,120 Q200,170 310,172" fill="none" stroke="#FFF8E5" strokeWidth="1.3" strokeLinecap="round" opacity="0.4" />

        {/* Secondary bird — smaller, background */}
        <g className="hero-bird-2" opacity="0.45">
          <g transform="translate(270, 68)">
            <path d="M-14,5 Q-6,-3 0,0 Q6,-3 14,5" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="1" r="1" fill="#FFF8E5" />
          </g>
        </g>

        {/* Primary bird — larger, foreground */}
        <g className="hero-bird" opacity="0.85">
          <g transform="translate(195, 95)">
            <path d="M-24,9 Q-12,-5 0,0 Q12,-5 24,9" fill="none" stroke="#FFF8E5" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="1.5" r="1.8" fill="#FFF8E5" />
          </g>
        </g>

        {/* Third bird — tiny, far away */}
        <g className="hero-bird-2" opacity="0.3" style={{ animationDelay: "4s" }}>
          <g transform="translate(155, 55)">
            <path d="M-8,3 Q-4,-2 0,0 Q4,-2 8,3" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Walking people — three figures on the ground */}
        <g opacity="0.8">
          {/* Person 1 — front, larger, mid-stride */}
          <g transform="translate(165, 295)">
            <circle cx="0" cy="-18" r="5.5" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M0,-12.5 Q1,-4 0,4" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M0,4 Q-5,14 -9,22" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,4 Q6,14 10,22" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,-6 Q-7,-2 -11,2" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,-6 Q8,0 12,4" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Person 2 — slightly behind, walking */}
          <g transform="translate(200, 300)">
            <circle cx="0" cy="-15" r="4.5" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,-10.5 Q-1,-3 0,3" fill="none" stroke="#FFF8E5" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,3 Q-4,12 -7,18" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M0,3 Q5,12 8,18" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M0,-5 Q-6,0 -9,3" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M0,-5 Q5,-2 9,2" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Person 3 — smaller, further back */}
          <g transform="translate(232, 306)" opacity="0.65">
            <circle cx="0" cy="-12" r="3.5" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M0,-8.5 Q0,-3 0,2" fill="none" stroke="#FFF8E5" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M0,2 Q-3,9 -5,14" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0,2 Q4,9 6,14" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0,-3 Q-4,0 -7,2" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0,-3 Q5,-1 7,1" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Ground line — wobbly horizon */}
        <path d="M0,324 Q30,319 65,322 Q100,326 140,320 Q180,316 220,322 Q260,327 300,320 Q340,315 370,322 Q390,326 400,321" fill="none" stroke="#FFF8E5" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
        <path d="M0,332 Q40,328 80,330 Q130,334 180,328 Q230,324 280,330 Q330,335 380,328 Q395,326 400,329" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />

        {/* Grass tufts */}
        <g opacity="0.4">
          <path d="M30,322 Q28,312 32,306" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M33,321 Q36,313 34,305" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M36,322 Q40,314 38,308" fill="none" stroke="#FFF8E5" strokeWidth="1.3" strokeLinecap="round" />

          <path d="M140,319 Q138,311 141,305" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M143,318 Q146,312 144,306" fill="none" stroke="#FFF8E5" strokeWidth="1.3" strokeLinecap="round" />

          <path d="M260,324 Q258,316 261,310" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M264,323 Q267,316 264,310" fill="none" stroke="#FFF8E5" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M267,324 Q270,317 268,312" fill="none" stroke="#FFF8E5" strokeWidth="1.2" strokeLinecap="round" />

          <path d="M350,320 Q348,312 351,307" fill="none" stroke="#FFF8E5" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M354,319 Q356,312 353,306" fill="none" stroke="#FFF8E5" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function PracticeDetailModal({ practice, onClose, themeClasses: getThemeClasses }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") { onClose(); return; }
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

  const p = practice;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-modal-title"
        tabIndex={-1}
        className="bg-[#FFF8E5] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-3">
          <h2 id="practice-modal-title" className="font-['League_Gothic'] text-[#6B21A8] text-2xl lg:text-3xl uppercase tracking-wide pr-4">{p.title}</h2>
          <button onClick={onClose} className="ml-4 mt-1 text-[#424244] hover:text-[#6B21A8] hover:bg-[#424244]/10 transition-colors text-2xl leading-none flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full" aria-label="Close">×</button>
        </div>
        <div className="px-6 pb-6">
          {/* Theme + ALL topic badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {p.dim.split(", ").map(d => (
              <span key={d} className={`text-xs border rounded-full px-3 py-0.5 ${getThemeClasses(d)}`}>{d}</span>
            ))}
            {p.topic && p.topic.split(", ").map(t => (
              <span key={t} className="text-xs border border-[#6B21A8]/30 text-[#6B21A8] rounded-full px-3 py-0.5">{t}</span>
            ))}
          </div>
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[#424244] mb-4">
            {p.country && <div className="flex items-center gap-1.5"><IconPin /><span>{p.country}</span></div>}
            {p.year && <div className="flex items-center gap-1.5"><IconCalendar /><span>{p.year}</span></div>}
            {p.org && <div className="flex items-center gap-1.5"><IconBuilding /><span>{p.org}</span></div>}
            {p.inf && <div className="flex items-center gap-1.5"><IconLayers /><span>{p.inf}</span></div>}
          </div>
          {p.award && <div className="flex items-center gap-1.5 text-[#6B21A8] text-sm font-medium mb-4"><IconAward /><span>RGI Grid Awards: Good Practice of the Year{p.year ? ` (${p.year})` : ""}</span></div>}
          {/* Description */}
          {p.desc ? (
            <p className="text-sm text-[#424244] leading-relaxed mb-4">{p.desc}</p>
          ) : (
            <p className="text-sm text-[#767676] italic mb-4">No description available.</p>
          )}
          {/* Atlas Partner */}
          {p.brand && (
            <p className="text-xs text-[#6B6B6D] mb-6">
              Atlas Partner: <a href={BRAND_LINKS[p.brand]} target="_blank" rel="noopener noreferrer" className="text-[#6B21A8] font-medium hover:underline">{{ RGI: "Renewables Grid Initiative (RGI)", OCEaN: "Offshore Coalition for Energy and Nature (OCEaN)", Panorama: "IUCN PANORAMA – Solutions for a Healthy Planet", SL4B: "Safe Lines for Birds (SL4B)" }[p.brand] || p.brand}</a>
            </p>
          )}
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-[#C9C9C9] text-[#424244] text-sm font-medium hover:border-[#6B21A8] transition-colors">Close</button>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-[#6B21A8] text-white text-sm font-medium hover:bg-[#6B21A8]/90 transition-colors inline-flex items-center gap-2">
              Go to practice <IconChevronRight />
            </a>
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
      alt="GINGR (Global Initiative for Nature, Grids and Renewables)"
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
  { value: "az", label: "A - Z" },
  { value: "za", label: "Z - A" },
];

function SortDropdown({ value, onChange, compact }) {
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
        className={compact
          ? "p-2.5 rounded-full border border-[#C9C9C9] text-[#424244] hover:border-[#6B21A8] transition-colors bg-white"
          : "flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C9C9C9] text-sm text-[#424244] hover:border-[#6B21A8] transition-colors bg-white"
        }
      >
        {compact ? <IconSort /> : <><span>{current.label}</span><IconChevronDown /></>}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                opt.value === value
                  ? "text-[#6B21A8] font-medium bg-[#FFF8E5]"
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
function FilterDropdown({ label, options, selected, onChange, groups, searchable }) {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const ref = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { if (!open) setFilterText(""); }, [open]);

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

  const toggleGroup = (groupOptions) => {
    const available = groupOptions.filter(o => options.includes(o));
    const allSelected = available.every(o => selected.includes(o));
    if (allSelected) {
      onChange(selected.filter(s => !available.includes(s)));
    } else {
      onChange([...new Set([...selected, ...available])]);
    }
  };

  const filteredOptions = searchable && filterText
    ? options.filter(o => String(o).toLowerCase().includes(filterText.toLowerCase()))
    : options;

  const renderOption = (opt) => (
    <label
      key={String(opt)}
      role="option"
      aria-selected={selected.includes(opt)}
      className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#FFF8E5] cursor-pointer text-sm text-[#424244]"
    >
      <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="accent-[#6B21A8] w-4 h-4" />
      <span>{String(opt)}</span>
    </label>
  );

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-label={`Filter by ${label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
          active
            ? "bg-[#6B21A8] text-white border-[#6B21A8]"
            : "bg-white text-[#6B21A8] border-[#6B21A8]"
        }`}
      >
        <span className="truncate">{label}{active ? ` (${selected.length})` : ""}</span>
        {active ? (
          <span className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); onChange([]); }}><IconX /></span>
        ) : (
          <span className="flex-shrink-0"><IconPlus /></span>
        )}
      </button>
      {open && (
        <div role="listbox" aria-label={`${label} options`} className="absolute z-50 mt-2 w-72 max-h-72 overflow-y-auto rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
          {searchable && (
            <div className="px-3 py-2 border-b border-[#C9C9C9]/50">
              <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full px-3 py-1.5 text-xs border border-[#C9C9C9] rounded-full focus:outline-none focus:border-[#6B21A8]" />
            </div>
          )}
          {groups && !filterText ? (
            Object.entries(groups).map(([region, members]) => {
              const available = members.filter(m => options.includes(m));
              if (available.length === 0) return null;
              const allSel = available.every(m => selected.includes(m));
              return (
                <div key={region}>
                  <button
                    onClick={() => toggleGroup(available)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider ${allSel ? "text-[#6B21A8] bg-[#6B21A8]/5" : "text-[#6B6B6D]"} hover:bg-[#FFF8E5] transition-colors`}
                  >
                    {region} ({available.length})
                  </button>
                  {available.map(renderOption)}
                </div>
              );
            })
          ) : (
            filteredOptions.map(renderOption)
          )}
          {searchable && filterText && filteredOptions.length === 0 && (
            <p className="px-4 py-2 text-xs text-[#767676] italic">No matches</p>
          )}
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

  /* ── UI states ── */
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [siteConfig, setSiteConfig] = useState(null);

  /* ── Load editable site config ── */
  useEffect(() => {
    fetch("admin-config.json")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSiteConfig(data); })
      .catch(() => {});
  }, []);

  const aboutConfig = siteConfig?.about || null;
  const contactConfig = siteConfig?.contact || null;
  const submitConfig = siteConfig?.submit || null;
  const partnersConfig = siteConfig?.partners || null;
  const brandBarConfig = siteConfig?.brandBar || null;

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
      if (selCountries.length && !selCountries.includes(normalizeCountry(p.country))) return false;
      if (selYears.length && !selYears.includes(p.year)) return false;
      if (selInfra.length) {
        const pInfra = p.inf ? p.inf.split(/[;,]\s*/) : [];
        if (!pInfra.some(i => selInfra.includes(i))) return false;
      }
      if (selOrgs.length && !selOrgs.includes(normalizeOrg(p.org))) return false;
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
    { label: selDims.length ? `Topic (${selDims.join(", ")})` : "Topic", options: availableTopics, selected: selTopics, onChange: setSelTopics, searchable: true },
  ];

  /* ── expanded filters ── */
  const expandedFilters = [
    { label: "Year", options: allYears.map(String), selected: selYears.map(String), onChange: (arr) => setSelYears(arr.map(Number)) },
    { label: "Location", options: allCountries, selected: selCountries, onChange: setSelCountries, groups: COUNTRY_REGIONS, searchable: true },
    { label: "Organisation", options: allOrgs, selected: selOrgs, onChange: setSelOrgs, searchable: true },
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

  const exportFilteredCSV = useCallback(() => {
    const headers = ["title","url","brand","theme","topic","infrastructure","year","country","organisation","description","award"];
    const rows = filtered.map(p => [
      p.title, p.url, p.brand, p.dim, p.topic, p.inf, p.year || "", p.country, p.org, p.desc,
      p.award ? "Yes" : "No"
    ]);
    const csv = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `energy-transition-atlas-${filtered.length}-practices.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = useCallback((hash) => {
    window.location.hash = hash;
    setMenuOpen(false);
  }, []);

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

      {/* ─── 1. Brand Bar (desktop only) ─── */}
      <div className="hidden md:block bg-[#424244] px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <span className="text-[#C9C9C9] text-xs whitespace-nowrap flex-shrink-0">A platform by</span>
          {(brandBarConfig?.owners || [
            { name: "GINGR", url: BRAND_LINKS.GINGR },
            { name: "RGI", url: BRAND_LINKS.RGI },
            { name: "IUCN", url: BRAND_LINKS.IUCN },
          ]).map(b => (
            <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" className="text-[#C9C9C9] text-xs font-medium hover:text-white transition-colors whitespace-nowrap flex-shrink-0">
              {b.name}
            </a>
          ))}
          <span className="text-[#C9C9C9]/50 text-xs mx-1 flex-shrink-0">|</span>
          <span className="text-[#C9C9C9] text-xs whitespace-nowrap flex-shrink-0">with</span>
          {(brandBarConfig?.partners || [
            { name: "OCEaN", url: BRAND_LINKS.OCEaN },
            { name: "SL4B", url: BRAND_LINKS.SL4B },
            { name: "Panorama", url: BRAND_LINKS.Panorama },
          ]).map(b => (
            <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" className="text-[#C9C9C9] text-xs font-medium hover:text-white transition-colors whitespace-nowrap flex-shrink-0">
              {b.name}
            </a>
          ))}
        </div>
      </div>

      {/* ─── 2. Header Bar (sticky) ─── */}
      <header className="sticky top-0 z-40 bg-[#6B21A8] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className={`font-['League_Gothic'] text-[#FFF8E5] text-lg sm:text-xl tracking-wide sm:tracking-widest uppercase transition-opacity duration-300 cursor-pointer min-w-0 ${
              scrolledPastHero ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
              else navigateTo("#/");
            }}
          >
            Energy Transition Atlas
          </h1>
          <div ref={menuRef} className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Navigation menu"
              className="border border-[#FFF8E5] text-[#FFF8E5] px-5 py-1.5 rounded-full text-sm font-medium tracking-wide hover:bg-[#FFF8E5] hover:text-[#6B21A8] transition-colors"
            >
              MENU
            </button>
            {/* Desktop dropdown */}
            {menuOpen && (
              <div className="hidden md:block absolute right-0 z-50 mt-2 w-48 rounded-xl bg-white shadow-lg border border-[#C9C9C9] py-2">
                <button onClick={() => navigateTo("#/")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">Home</button>
                <button onClick={() => navigateTo("#about")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">About</button>
                <button onClick={() => navigateTo("#submit")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">Submit a Practice</button>
                <button onClick={() => navigateTo("#contact")} className="block w-full text-left px-4 py-2 text-sm text-[#424244] hover:bg-[#FFF8E5] transition-colors">Contact</button>
              </div>
            )}
            {/* Mobile slide-out panel */}
            {menuOpen && (
              <>
                <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)} />
                <div className="md:hidden fixed top-0 right-0 z-50 h-full w-72 bg-[#6B21A8] shadow-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                      <span className="font-['League_Gothic'] text-[#FFF8E5] text-xl uppercase tracking-widest">Menu</span>
                      <button onClick={() => setMenuOpen(false)} className="text-[#FFF8E5] text-2xl leading-none" aria-label="Close menu">×</button>
                    </div>
                    <nav className="space-y-1">
                      {[
                        { label: "Home", hash: "#/" },
                        { label: "About", hash: "#about" },
                        { label: "Submit a Practice", hash: "#submit" },
                        { label: "Contact", hash: "#contact" },
                      ].map(item => (
                        <button key={item.hash} onClick={() => navigateTo(item.hash)}
                          className={`block w-full text-left px-4 py-3 rounded-lg text-[#FFF8E5] text-lg font-medium transition-colors ${
                            currentPage === item.hash ? "bg-white/10" : "hover:bg-white/5"
                          }`}>
                          {item.label}
                        </button>
                      ))}
                    </nav>
                    <div className="mt-8">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFF8E5]/60"><IconSearch /></span>
                        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); navigateTo("#/"); }}
                          placeholder="Search practices..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-[#FFF8E5] text-sm placeholder:text-[#FFF8E5]/40 focus:outline-none focus:border-white/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ���── 3. Hero Section ─── */}
      <section ref={heroRef} className="bg-[#6B21A8] px-6 py-8 lg:py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          {/* Graphic — behind text on mobile, beside text on desktop */}
          <div className="absolute inset-0 flex items-center justify-end opacity-20 lg:opacity-100 lg:relative lg:hidden pointer-events-none">
            <div className="w-64 sm:w-72"><HeroGraphic /></div>
          </div>
          <div className="flex items-center lg:justify-between">
            <div className="relative z-10 lg:w-7/12">
              <h2
                className={`font-['League_Gothic'] text-white text-5xl sm:text-6xl lg:text-7xl uppercase tracking-wide leading-[0.95] ${!isHome ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`}
                onClick={() => { if (!isHome) navigateTo("#/"); }}
              >
                Energy Transition Atlas
              </h2>
              <p className="mt-3 lg:mt-4 text-[#FFF8E5] text-sm sm:text-base lg:text-xl font-light max-w-xl lg:max-w-3xl leading-relaxed opacity-90">
                Explore proven practices for decarbonising energy, protecting nature, and improving lives, shared by a growing network of partners.
              </p>
            </div>
            <div className="hidden lg:block lg:w-5/12">
              <HeroGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
         PAGE ROUTING
         ═══════════════════════════════════════════════════════════════════════ */}

      {/* ─── ABOUT PAGE ─── */}
      {currentPage === "#about" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#6B21A8] text-4xl lg:text-5xl uppercase tracking-wide mb-8">About the Atlas</h2>
            <nav className="mb-8 p-4 bg-white rounded-xl border border-[#C9C9C9]" aria-label="About page sections">
              <p className="text-xs text-[#6B6B6D] uppercase tracking-wider font-medium mb-2">On this page</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Vision", id: "about-vision" },
                  { label: "Mission", id: "about-mission" },
                  { label: "Values", id: "about-values" },
                  { label: "How We Collect", id: "about-collection" },
                  { label: "RGI Grid Awards", id: "about-award" },
                  { label: "Partners", id: "about-partners" },
                ].map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
                    className="px-3 py-2 rounded-full border border-[#6B21A8]/30 text-[#6B21A8] text-xs font-medium hover:bg-[#6B21A8] hover:text-white transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            </nav>
            <div className="space-y-6 text-[#424244] leading-relaxed">
              {(aboutConfig?.intro || [
                "The Energy Transition Atlas is a shared platform that brings together proven best practices from across the energy transition. It serves as a navigator and search hub, providing a single access point for practices contributed by multiple organisations and initiatives.",
                "Rather than hosting full content, the Atlas links out to the source websites of each practice, keeping content management decentralised while offering unified discovery, filtering, and search.",
                'The Atlas is owned and managed by the <a href="https://gingr.org" target="_blank" rel="noopener noreferrer">Global Initiative for Nature, Grids and Renewables (GINGR)</a>, a joint initiative of the Renewables Grid Initiative (RGI) and the International Union for Conservation of Nature (IUCN).',
              ]).map((text, i) => (
                <p key={i} className={i === 2 ? "text-[#424244] [&_a]:text-[#6B21A8] [&_a]:underline [&_a:hover]:text-[#6B21A8]/80 [&_strong]:font-bold" : ""}
                  dangerouslySetInnerHTML={{ __html: text }} />
              ))}
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mt-8 scroll-mt-24" id="about-vision">Our Vision</h3>
              <p>{aboutConfig?.vision || "A decarbonised world powered by clean energy, where the shift to renewables strengthens communities, restores nature, and leaves no one behind."}</p>
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mt-8 scroll-mt-24" id="about-mission">Our Mission</h3>
              <p>{aboutConfig?.mission || "The Energy Transition Atlas brings together a growing network of partners who document and share what works in renewable energy and grid development. By collecting these practices in one searchable platform, we help practitioners, policymakers, and communities put proven approaches to work."}</p>
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mt-8 scroll-mt-24" id="about-values">Our Values</h3>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {(aboutConfig?.values || [
                  { title: "Collaboration", text: "The Atlas is built by many hands. We welcome new partners because sharing knowledge across organisations and borders gets us to a clean energy system faster." },
                  { title: "Openness", text: "All practices in the Atlas are freely accessible. Each one links back to the source organisation, while the Atlas provides search and discovery in one place." },
                  { title: "Evidence-Based", text: "Every practice in the Atlas comes from real-world implementation. We focus on what has been tested and measured, so others can learn from actual results." },
                ]).map((v, i) => {
                  const colors = [
                    { border: "border-[#6B21A8]", text: "text-[#6B21A8]" },
                    { border: "border-sky-500", text: "text-sky-700" },
                    { border: "border-emerald-500", text: "text-emerald-700" },
                  ];
                  const c = colors[i] || colors[0];
                  return (
                    <div key={i} className={`p-4 bg-white rounded-xl border-l-4 ${c.border}`}>
                      <span className={`${c.text} font-bold text-lg`}>{v.title}</span>
                      <p className="text-sm text-[#424244] mt-1 leading-relaxed">{v.text}</p>
                    </div>
                  );
                })}
              </div>
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mt-8 scroll-mt-24" id="about-collection">How Practices Are Collected</h3>
              <p>{aboutConfig?.collection?.intro || "The Atlas draws on several complementary sources, each bringing a unique perspective to the energy transition:"}</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                {(aboutConfig?.collection?.sources || [
                  "RGI's Good Practice Database has documented best practices in grid development and renewable energy since 2010, contributing the largest share of practices covering stakeholder engagement, nature protection, technology innovation, and spatial planning across Europe.",
                  "IUCN's PANORAMA platform contributes nature-based and community-focused solutions relevant to the energy transition, drawn from a global repository of conservation and sustainable development approaches.",
                  "OCEaN brings enhancement and restoration projects from the offshore wind sector, showing how offshore energy and marine conservation can work together.",
                ]).map((src, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: src }} />
                ))}
              </ul>
              <p className="text-sm text-[#6B6B6D]">{aboutConfig?.collection?.cta || "The collection keeps growing. New partners and practices are added on a rolling basis."} {" "}<a href="#contact" onClick={(e) => { e.preventDefault(); setCurrentPage("#contact"); window.scrollTo(0, 0); }} className="text-[#6B21A8] underline hover:text-[#6B21A8]/80">Get in touch</a>.</p>

              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mt-8 scroll-mt-24" id="about-award">RGI Grid Awards</h3>
              <div className="flex items-start gap-4 mt-4 p-5 bg-white rounded-xl border border-[#C9C9C9]">
                <div>
                  <p className="text-sm leading-relaxed">The <span className="inline-flex items-center align-middle"><IconAward /><span className="sr-only">star</span></span> icon on practice cards marks winners of the <strong>RGI Grid Awards: Good Practice of the Year</strong>, an annual recognition by the Renewables Grid Initiative. Winners are selected in three categories: Technological Innovation &amp; System Integration, Communication &amp; Engagement, and Environmental Protection. They receive the <strong>Golden Pylon</strong> trophy at a ceremony during the PCI Energy Days in Brussels. {PRACTICES.filter(p => p.award).length} practices in the Atlas hold this award.</p>
                  <a href="https://renewables-grid.eu/award/" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-[#6B21A8] underline hover:text-[#6B21A8]/80">Learn more about the RGI Grid Awards</a>
                </div>
              </div>

              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mt-8 scroll-mt-24" id="about-partners">Contributing Partners</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {(partnersConfig || [
                  { name: "GINGR", url: BRAND_LINKS.GINGR, desc: "The Global Initiative for Nature, Grids and Renewables is a joint initiative of RGI and IUCN that owns and manages the Energy Transition Atlas." },
                  { name: "RGI", url: BRAND_LINKS.RGI, desc: "The Renewables Grid Initiative brings together NGOs and transmission system operators to promote transparent and environmentally sensitive grid development across Europe." },
                  { name: "IUCN", url: BRAND_LINKS.IUCN, desc: "The International Union for Conservation of Nature drives global action on nature-positive energy through its Green, Just Energy Transition programme and co-founded GINGR." },
                  { name: "OCEaN", url: BRAND_LINKS.OCEaN, desc: "The Offshore Coalition for Energy and Nature works to ensure offshore renewable energy and marine nature conservation develop in harmony." },
                  { name: "SL4B", url: BRAND_LINKS.SL4B, desc: "Safe Lines for Birds promotes bird-safe practices for power line infrastructure, reducing avian collision and electrocution risks." },
                  { name: "Panorama", url: BRAND_LINKS.Panorama, desc: "PANORAMA \u2013 Solutions for a Healthy Planet is an IUCN-hosted platform showcasing nature-based solutions worldwide. Energy-relevant practices from Panorama are featured in the Atlas." },
                ]).map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-white rounded-xl border border-[#C9C9C9] hover:border-[#6B21A8] hover:shadow-md transition-all"
                  >
                    <span className="text-[#6B21A8] font-bold text-lg">{partner.name}</span>
                    <p className="text-sm text-[#424244] mt-1 leading-relaxed">{partner.desc}</p>
                    <span className="block text-xs text-[#6B6B6D] mt-2">{partner.url}</span>
                  </a>
                ))}
              </div>
              <div className="mt-10 text-center">
                <p className="text-[#6B6B6D] text-lg mb-4">{aboutConfig?.partnerCTA || "Interested in becoming a contributing partner?"}</p>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); setCurrentPage("#contact"); window.scrollTo(0, 0); }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#6B21A8] text-[#6B21A8] text-sm font-medium hover:bg-[#6B21A8] hover:text-white transition-colors"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── SUBMIT PAGE ─── */}
      {currentPage === "#submit" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#6B21A8] text-4xl lg:text-5xl uppercase tracking-wide mb-4">Submit a Practice</h2>
            <p className="text-[#424244] text-base leading-relaxed mb-8 max-w-3xl">
              Practices in the Energy Transition Atlas are contributed by our Atlas Partners. To have a practice featured, submit it directly to one of the partner platforms below. Each partner reviews submissions against their own criteria and may add approved practices to the Atlas.
            </p>

            {/* ── Submission Criteria ── */}
            <div className="mb-10">
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mb-4">Submission Criteria</h3>
              <p className="text-[#424244] text-sm leading-relaxed mb-4">
                The Energy Transition Atlas is a curated resource. To maintain quality and relevance, all practices are reviewed jointly by <strong>RGI</strong> and <strong>IUCN</strong> before publication. Submissions should meet the following criteria:
              </p>
              <ol className="space-y-3">
                {(submitConfig?.criteria || [
                  { title: "Publicly documented", desc: "The practice must be accessible via a public URL: a webpage, case study, report, or guidance document that others can view and reference." },
                  { title: "Relevance to energy infrastructure", desc: "The practice must relate to electricity grids, solar, onshore wind, offshore wind, or broader energy systems." },
                  { title: "Nature- or People-positive focus", desc: "The practice must demonstrably address biodiversity, landscape integration, community engagement, social acceptance, or other environmental and social dimensions of the energy transition." },
                  { title: "Replicability", desc: "The approach should be transferable to other projects, organisations, or geographies beyond the original context." },
                  { title: "Demonstrated outcomes", desc: "Preference is given to practices with measurable, documented, or independently verified results, though emerging and innovative approaches are also considered." },
                  { title: "Recency", desc: "Practices should generally date from 2000 onwards and reflect current standards and regulatory contexts." },
                  { title: "Joint approval by RGI and IUCN", desc: "All submissions are reviewed by the Renewables Grid Initiative (RGI) and the International Union for Conservation of Nature (IUCN). Both organisations must approve a practice before it is published in the Atlas.", highlight: true },
                ]).map((item, i) => (
                  <li key={i} className={`flex gap-4 p-4 rounded-xl ${item.highlight ? "bg-[#6B21A8]/8 border border-[#6B21A8]/20" : "bg-white border border-[#C9C9C9]/60"}`}>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${item.highlight ? "bg-[#6B21A8] text-white" : "bg-[#C9C9C9]/40 text-[#424244]"}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold mb-0.5 ${item.highlight ? "text-[#6B21A8]" : "text-[#424244]"}`}>{item.title}</p>
                      <p className="text-sm text-[#424244] opacity-80 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* ── Partner Submission Pathways ── */}
            <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mb-4">Where to Submit</h3>
            <p className="text-[#424244] text-sm leading-relaxed mb-6">Each Atlas Partner maintains its own submission process. Choose the platform that best fits your practice:</p>
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {(submitConfig?.pathways || [
                { name: "RGI Good Practice Database", url: BRAND_LINKS.RGI, desc: "RGI\u2019s Good Practice Database has documented best practices in grid development and renewable energy since 2010, covering stakeholder engagement, nature protection, technology innovation, and spatial planning across Europe. Contact RGI to submit a practice.", color: "border-l-[#6B21A8]" },
                { name: "IUCN PANORAMA", url: BRAND_LINKS.Panorama, desc: "PANORAMA \u2013 Solutions for a Healthy Planet is an IUCN-hosted platform showcasing nature-based solutions worldwide. Submit energy-relevant practices directly through the Panorama platform. Practices are reviewed for conservation relevance and documented outcomes.", color: "border-l-emerald-500" },
                { name: "OCEaN", url: BRAND_LINKS.OCEaN, desc: "The Offshore Coalition for Energy and Nature focuses on enhancement and restoration projects in the offshore wind sector, demonstrating how offshore energy and marine conservation can work together. Contact OCEaN to feature your offshore practice.", color: "border-l-sky-500" },
                { name: "RGI Grid Awards", url: "https://renewables-grid.eu/award/", desc: "The RGI Grid Awards recognise outstanding Good Practices of the Year with the Golden Pylon trophy. Winners are selected in three categories: Technological Innovation & System Integration, Communication & Engagement, and Environmental Protection. Award-winning practices are featured in the Atlas.", color: "border-l-amber-500" },
              ]).map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-5 bg-white rounded-xl border border-[#C9C9C9] border-l-4 ${partner.color} hover:shadow-md hover:border-[#6B21A8] transition-all`}
                >
                  <span className="text-[#6B21A8] font-bold text-lg">{partner.name}</span>
                  <p className="text-sm text-[#424244] mt-2 leading-relaxed">{partner.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs text-[#6B21A8] font-medium">
                    Visit website
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </span>
                </a>
              ))}
            </div>

            {/* ── Partner CTA ── */}
            <div className="text-center py-8 border-t border-[#C9C9C9]/40">
              <p className="text-[#6B6B6D] text-lg mb-4">Want to become a contributing partner?</p>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); navigateTo("#contact"); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#6B21A8] text-[#6B21A8] text-sm font-medium hover:bg-[#6B21A8] hover:text-white transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACT PAGE ─── */}
      {currentPage === "#contact" && (
        <section className="flex-1 bg-[#FFF8E5] px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-['League_Gothic'] text-[#6B21A8] text-4xl lg:text-5xl uppercase tracking-wide mb-4">Contact</h2>
            <div className="mb-8 p-5 bg-white rounded-xl border border-[#C9C9C9]">
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mb-2">Export Data</h3>
              <p className="text-[#424244] text-sm mb-4">Download the currently filtered practices as a CSV file for offline analysis.</p>
              <button
                onClick={exportFilteredCSV}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#6B21A8] text-[#6B21A8] text-sm font-medium hover:bg-[#6B21A8] hover:text-white transition-colors"
              >
                Download {filtered.length} practices as CSV
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#C9C9C9] p-8">
              <h3 className="font-['League_Gothic'] text-[#6B21A8] text-2xl uppercase tracking-wide mb-4">{contactConfig?.orgName || "GINGR Secretariat"}</h3>
              <p className="text-[#424244] text-sm mb-6">{contactConfig?.orgSubline || "For questions about the Atlas, submitting practices, or partnership enquiries:"}</p>
              <a
                href={`mailto:${contactConfig?.email || "info@gingr.org"}`}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#6B21A8] text-white font-medium hover:bg-[#6B21A8]/90 transition-colors text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {contactConfig?.email || "info@gingr.org"}
              </a>
              <div className="mt-6 pt-6 border-t border-[#C9C9C9]/50 text-[#424244] text-sm leading-relaxed">
                {(contactConfig?.address || "c/o Renewables Grid Initiative\nManfred-von-Richthofen-Str. 4\n12101 Berlin, Germany").split("\n").map((line, i, arr) => (
                  <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                ))}
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
                  <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} groups={f.groups} searchable={f.searchable} />
                ))}
                <button
                  onClick={() => setAwardOnly(!awardOnly)}
                  aria-label="Toggle award winners only"
                  aria-pressed={awardOnly}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                    awardOnly
                      ? "bg-[#6B21A8] text-white border-[#6B21A8]"
                      : "bg-white text-[#6B21A8] border-[#6B21A8]"
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
                      ? "bg-[#6B21A8] text-white border-[#6B21A8]"
                      : "border-[#C9C9C9] text-[#424244] hover:border-[#6B21A8] bg-white"
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
                      ? "border-[#6B21A8] text-[#6B21A8] bg-white"
                      : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#6B21A8]"
                  }`}
                >
                  <IconListView />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-2.5 rounded-full border transition-colors ${
                    viewMode === "grid"
                      ? "border-[#6B21A8] text-[#6B21A8] bg-white"
                      : "border-[#C9C9C9] text-[#424244] bg-white hover:border-[#6B21A8]"
                  }`}
                >
                  <IconGridView />
                </button>
                <div className="flex-1 relative min-w-[140px] max-w-[280px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]">
                    <IconSearch />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search practices..."
                    aria-label="Search practices"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] placeholder:text-[#C9C9C9] focus:outline-none focus:border-[#6B21A8] transition-colors"
                  />
                </div>
              </div>

              {/* Desktop: Expanded filters — left-aligned, compact */}
              {moreOptions && (
                <div className="hidden md:flex items-center gap-3 flex-wrap">
                  {expandedFilters.map((f) => (
                    <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} groups={f.groups} searchable={f.searchable} />
                  ))}
                </div>
              )}

              {/* Mobile: Single row — Infrastructure, Theme, More, Sort */}
              <div className="md:hidden">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  {[basicFilters[0], basicFilters[1]].map((f) => (
                    <div key={f.label}>
                      <FilterDropdown label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} groups={f.groups} searchable={f.searchable} />
                    </div>
                  ))}
                  <button
                    onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                    aria-label="Toggle additional filters"
                    className={`flex-shrink-0 p-2.5 rounded-full border text-sm font-medium transition-colors ${
                      filterPanelOpen
                        ? "bg-[#6B21A8] text-white border-[#6B21A8]"
                        : "bg-white text-[#6B21A8] border-[#6B21A8]"
                    }`}
                  >
                    <IconSettings />
                  </button>
                  <SortDropdown value={sortMode} onChange={setSortMode} compact />
                </div>
              </div>

              {/* Mobile: Expanded filter panel (Search, Topic, Awards, expanded filters, view) */}
              {filterPanelOpen && (
                <div className="md:hidden flex flex-col gap-2">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#C9C9C9] bg-white text-sm text-[#424244] placeholder:text-[#C9C9C9] focus:outline-none focus:border-[#6B21A8] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 [&>.relative]:w-full [&>.relative>button]:w-full">
                    <FilterDropdown label={basicFilters[2].label} options={basicFilters[2].options} selected={basicFilters[2].selected} onChange={basicFilters[2].onChange} searchable={basicFilters[2].searchable} />
                    <button
                      onClick={() => setAwardOnly(!awardOnly)}
                      aria-label="Toggle award winners only"
                      aria-pressed={awardOnly}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full border text-sm font-medium transition-colors w-full ${
                        awardOnly
                          ? "bg-[#6B21A8] text-white border-[#6B21A8]"
                          : "bg-white text-[#6B21A8] border-[#6B21A8]"
                      }`}
                    >
                      <IconAward />
                      <span>Awards</span>
                    </button>
                    {expandedFilters.map((f) => (
                      <FilterDropdown key={f.label} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} groups={f.groups} searchable={f.searchable} />
                    ))}
                    <div className="col-span-2 flex items-center gap-2">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
                          viewMode === "list"
                            ? "bg-[#6B21A8] text-white border-[#6B21A8]"
                            : "bg-white text-[#424244] border-[#C9C9C9] hover:border-[#6B21A8]"
                        }`}
                      >
                        <IconListView />
                        <span>List</span>
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-colors ${
                          viewMode === "grid"
                            ? "bg-[#6B21A8] text-white border-[#6B21A8]"
                            : "bg-white text-[#424244] border-[#C9C9C9] hover:border-[#6B21A8]"
                        }`}
                      >
                        <IconGridView />
                        <span>Grid</span>
                      </button>
                    </div>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B21A8]/10 text-[#6B21A8] text-xs font-medium"
                  >
                    <span className="text-[#6B21A8]/60">{chip.label}:</span> {chip.value}
                    <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter: ${chip.value}`} className="ml-0.5 hover:text-[#6B21A8]/70 transition-colors">
                      <IconX />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#6B21A8] font-medium hover:underline ml-2"
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
                  <div className="w-16 h-16 rounded-full bg-[#6B21A8]/10 flex items-center justify-center mx-auto mb-4 text-[#6B21A8]">
                    <IconSearch />
                  </div>
                  <p className="text-[#767676] text-lg">No practices match your current filters.</p>
                  {activeChips.length > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                      {activeChips.map((chip, i) => (
                        <button
                          key={`${chip.label}-${chip.value}-${i}`}
                          onClick={chip.onRemove}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B21A8]/10 text-[#6B21A8] text-xs font-medium hover:bg-[#6B21A8]/20 transition-colors"
                        >
                          <span className="text-[#6B21A8]/60">{chip.label}:</span> {chip.value}
                          <IconX />
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={clearAllFilters} className="mt-4 text-sm text-[#6B21A8] font-medium hover:underline">
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Grid / Picture View */}
              {viewMode === "grid" && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pageItems.map((p) => (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPractice(p)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedPractice(p); } }}
                      className="group block cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B21A8]"
                    >
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={p.img || placeholderImg}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-48 object-cover bg-[#e2e2e2] transition-transform duration-300 group-hover:scale-105"
                        />
                        {p.award && (
                          <span className="absolute top-2.5 right-2.5 bg-[#6B21A8] text-[#FFF8E5] rounded-full p-1.5 shadow-md" title="RGI Grid Awards Winner">
                            <IconAward />
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-[#6B6B6D] flex-wrap">
                        {p.country && <span className="flex items-center gap-1"><IconPin />{truncateText(p.country)}</span>}
                        {p.year && <span className="flex items-center gap-1"><IconCalendar />{p.year}</span>}
                        {p.org && <span className="flex items-center gap-1"><IconBuilding />{truncateText(p.org)}</span>}
                        {p.inf && <span className="flex items-center gap-1"><IconLayers />{p.inf}</span>}
                      </div>
                      <h3 className="mt-2 text-base font-bold text-[#424244] group-hover:text-[#6B21A8] transition-colors leading-snug">
                        {p.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {p.dim.split(", ").map(d => (
                          <span key={d} className={`text-xs border rounded-full px-3 py-0.5 ${themeClasses(d)}`}>
                            {d}
                          </span>
                        ))}
                        {p.topic && <span className="text-xs border border-[#6B21A8]/30 text-[#6B21A8] rounded-full px-3 py-0.5">
                          {p.topic.split(", ")[0]}
                        </span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && filtered.length > 0 && (
                <div className="divide-y divide-[#C9C9C9]">
                  {pageItems.map((p) => (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPractice(p)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedPractice(p); } }}
                      className="block py-4 px-3 -mx-3 rounded-lg group cursor-pointer hover:bg-white/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B21A8]"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#424244] group-hover:text-[#6B21A8] transition-colors">
                          {p.title}
                        </h3>
                        {p.award && (
                          <span className="text-[#6B21A8]" title="RGI Grid Awards Winner"><IconAward /></span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-4 text-xs text-[#6B6B6D] flex-wrap">
                        {p.country && <span className="flex items-center gap-1"><IconPin />{truncateText(p.country)}</span>}
                        {p.year && <span className="flex items-center gap-1"><IconCalendar />{p.year}</span>}
                        {p.org && <span className="flex items-center gap-1"><IconBuilding />{truncateText(p.org)}</span>}
                        {p.inf && <span className="flex items-center gap-1"><IconLayers />{p.inf}</span>}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {p.dim.split(", ").map(d => (
                          <span key={d} className={`text-xs border rounded-full px-2.5 py-0.5 ${themeClasses(d)}`}>
                            {d}
                          </span>
                        ))}
                        {p.topic && <span className="text-xs border border-[#6B21A8]/30 text-[#6B21A8] rounded-full px-2.5 py-0.5">
                          {p.topic.split(", ")[0]}
                        </span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── 6. Load More ─── */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount(prev => prev + LOAD_MORE_INCREMENT)}
                    className="px-8 py-3 rounded-full border-2 border-[#6B21A8] text-[#6B21A8] font-semibold hover:bg-[#6B21A8] hover:text-white transition-colors"
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
                The Energy Transition Atlas is managed by GINGR, a joint initiative of RGI and IUCN. It collects proven practices from a growing network of partners and makes them easy to find and share.
              </p>
            </div>
            {/* Col 2: Contact */}
            <div>
              <h4 className="font-['League_Gothic'] text-[#FFF8E5] text-xl uppercase tracking-widest mb-3">Contact</h4>
              <p className="text-[#C9C9C9] text-sm leading-relaxed">
                {contactConfig?.orgName || "GINGR Secretariat"}<br />
                {(contactConfig?.address || "c/o Renewables Grid Initiative\nManfred-von-Richthofen-Str. 4\n12101 Berlin, Germany").split("\n").map((line, i, arr) => (
                  <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                ))}
              </p>
              <p className="mt-2">
                <a href={`mailto:${contactConfig?.email || "info@gingr.org"}`} className="text-[#FFF8E5] text-sm hover:text-white transition-colors">
                  {contactConfig?.email || "info@gingr.org"}
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
              &copy; 2026 GINGR (Global Initiative for Nature, Grids and Renewables)
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Practice Detail Modal ─── */}
      {selectedPractice && <PracticeDetailModal practice={selectedPractice} onClose={() => setSelectedPractice(null)} themeClasses={themeClasses} />}

      {/* ─── Back to Top Button ─── */}
      {(scrolledPastHero || showBackToTop) && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#6B21A8] text-white shadow-lg hover:bg-[#6B21A8]/90 transition-all flex items-center justify-center"
        >
          <IconChevronUp />
        </button>
      )}
    </div>
  );
}
