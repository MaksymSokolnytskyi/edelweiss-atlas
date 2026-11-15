# Edelweiss: an atlas of the moving ground

NASA Space Apps Challenge 2026, challenge *Dancing with the SARs*. A team from Dnipro, Ukraine.

Plates of surface change seen by the NISAR radar, drawn as 19th-century engraved hachures; each plate says how sure it is. Open the site and start from the title page.

This repository only holds the built web pages. It is published from the team's working repository by `scripts/publish_site.py`; do not edit it by hand.

## Data and credits

- NISAR L2 GUNW (interferograms): NASA/JPL and ISRO, distributed by the Alaska Satellite Facility DAAC (NASA Earthdata).
- Copernicus DEM GLO-30: © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by
  the European Union and ESA.
- ESA WorldCover 10 m 2021 (CC BY 4.0): © ESA WorldCover project / contains modified Copernicus Sentinel data (2021).
- OpenStreetMap (ODbL): © OpenStreetMap contributors.
- Mexico City context (lakebed zone, mapped cracks): Atlas de Riesgos de la Ciudad de México.
- GNSS station series (Mexico, Reykjanes): Nevada Geodetic Laboratory.
- Kakhovka, Wisconsin and Bakota tests (`notes/experiments.md`, sections K, W, WS and B): contains modified Copernicus Sentinel-2 data
  (2025–2026), via Element 84
  Earth Search; Open-Meteo historical weather (CC BY 4.0); USDA NASS Cropland Data Layer 2025 (public domain);
  U.S. Fish and Wildlife Service National Wetlands Inventory (public domain); CODE (AIUB, University of Bern) final global
  ionosphere maps, IGS products via NASA CDDIS.
- Reykjanes plate (`web/reykjanes-scroll.html`): Copernicus Sentinel-1 interferograms of November 2023 processed by ASF HyP3
  (dike check only); NASA FIRMS VIIRS 375 m active fires; NASA HLS (LP DAAC) vents; ASTER GDEM v3 (NASA/METI) for the FE model; reference values from Sigmundsson et al.
  2024, Science 383:1228 (doi 10.1126/science.adn2838).
- Ostrava–Karviná study (`scripts/ostrava/`): NISAR L2 GUNW PROVISIONAL (NASA/JPL and ISRO, ASF DAAC); OpenStreetMap
  (ODbL) via the Overpass API and osmnx.

NASA does not endorse any non-U.S. Government entity. Each non-NASA source is used under its own terms.
