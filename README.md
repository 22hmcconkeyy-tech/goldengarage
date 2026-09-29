# Carscout Field System

A mobile-first, browser-based car discovery game. Use the device camera to capture a car, then record a simulated identification in a persistent local garage.

## Run

Open `index.html` in a modern browser. No install or build step is required. For camera and location permissions, use a secure context such as `http://localhost` or HTTPS. A Python static server can be started from this folder with:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173`.

## Features

- Camera-only capture with each scout photo saved as its garage card image.
- 15 scan tickets initially; one refills every 15 minutes, with the refill timer persisted between visits.
- Simulated car recognition from a local sample catalog. A Gemini-powered scanner can be enabled by storing a GEMINI_API_KEY in the browser for live vehicle identification.
- Rarity tiers derived from the catalog's rarity index, horsepower, and top speed.
- Scraps for each scan (50 Common, 100 Uncommon, 200 Rare, 350 Exotic, 600 Legendary), plus extra salvage when a duplicate model is found.
- A once-per-local-day free pack with a weighted 100–1,000 scrap reward.
- Four rotating shop cars, one each Uncommon, Rare, Exotic, and Legendary, refreshing every 48 hours at local midnight. Shop cars keep their catalog photo in the garage.
- Garage rarity filters, vehicle stats, collection date, and optional coordinates.
- Garage-score leaderboard with encoded player IDs and sample rival entries.
- Daily and Sunday-reset weekly quests that award XP toward collector levels.
- Local browser storage; there is no account, backend, or shared multiplayer state.

Camera and geolocation access are optional browser permissions; without camera access, scanning is unavailable. To use live Gemini recognition in the browser, set localStorage.setItem('GEMINI_API_KEY', 'your_key') or window.GEMINI_API_KEY = 'your_key'. Catalog specifications and leaderboard rivals are demo data, not authoritative vehicle records.
