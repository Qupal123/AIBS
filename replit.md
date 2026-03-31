# BrawlDraft - Ranked Draft Helper

## Overview
BrawlDraft is a Brawl Stars Ranked Draft Helper — a Progressive Web App (PWA) that recommends brawler picks, bans, and alternatives during the draft phase of ranked matches.

## Tech Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript (no framework, no build step)
- **Server**: Node.js static file server (`server.js`, port 5000)
- **PWA**: `manifest.json` + `service-worker.js` for offline support

## Project Structure
```
index.html          # Main SPA entry point
style.css           # Styling and animations
app.js              # Application logic and navigation
data.js             # Game data: brawlers, maps, modes, meta weights
version.json        # Required app version — bump to force update screen
server.js           # Static file server (Node.js, port 5000)
manifest.json       # PWA manifest
service-worker.js   # PWA offline caching
icons/              # PWA and UI icons
images/brawlers/    # Brawler portraits
images/maps/        # Map previews
proxy/              # API proxy scripts (Cloudflare Worker + local Node.js)
```

## Features

### Force Update Screen
- Shown when `version.json → requiredVersion` > `APP_VERSION` in `app.js`
- To force users to update: bump `requiredVersion` in `version.json` (e.g. "3.0")
- To stop showing: ensure `requiredVersion <= APP_VERSION`
- Two buttons: "Обновить в Рустор" (opens RuStore) + "Закрыть приложение"
- **RuStore URL**: set `RUSTORE_APP_URL` constant in `app.js`

### Home Screen Mode Selection
- "Ранговый бой" → full ranked draft flow (rank → mode → map → order → recs)
- "Обычные карты" → coming soon screen (placeholder for future update)

### Multi-window / Compact Mode
- On first launch: modal asks "Компактный режим" or "Полный экран"
- Choice saved to localStorage (`brawldraft-window-mode`)
- Can be reopened via "⊞ Режим окна" button on home screen

## Running
```
node server.js
```
Listens on `0.0.0.0:5000`.

## Deployment
Configured as a **static** deployment.

## Optional: Brawl Stars API Proxy
`proxy/token-proxy.js` proxies Brawl Stars API. Set `BRAWL_TOKEN` env var and run on port 8787.
