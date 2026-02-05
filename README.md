# StreamFinder

A responsive, mobile-first web app that lets you search for movies and TV shows and see exactly where they're streaming — filtered to the services **you** actually subscribe to.

Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

---

## Quick Start

### 1. Prerequisites

- **Node.js 18+** (22 recommended)
- **npm** (comes with Node)

### 2. Clone / download this project

```bash
cd streamfinder
npm install
```

### 3. Get a free TMDB API key

StreamFinder uses [The Movie Database (TMDB)](https://www.themoviedb.org/) API to fetch movie/TV data and streaming availability.  The free tier is more than sufficient.

1. Go to **<https://www.themoviedb.org/>** and create a free account.
2. Navigate to **Settings → API** (direct link: <https://www.themoviedb.org/settings/api>).
3. Click **Create** → choose **Developer** (free).
4. Fill out the short form (app name, description — anything works; homepage can be `http://localhost:3000`).
5. After submission you'll be taken to your app's dashboard.  Copy the **API Key (v3 auth)** value.

> Free-tier rate limit: ~1 000 requests per 10 minutes — plenty for personal use.

### 4. Create `.env.local`

In the project root, create a file called `.env.local` (there is already a `.env.local.example` you can copy):

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder with your key:

```
TMDB_API_KEY=your_actual_key_here
```

**This file is never committed** — it is automatically ignored by Next.js.

### 5. Run the development server

```bash
npm run dev
```

Open **<http://localhost:3000>** in your browser.  The app should greet you with the onboarding screen.

### 6. Production build (optional)

```bash
npm run build   # compile
npm start       # run the production server
```

---

## Adding to your iPhone home screen (PWA)

1. Open the app in **Safari** on your iPhone.
2. Tap the **share** button (box with arrow) at the bottom of the screen.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**.

The app will now appear as a full-screen icon on your home screen, behaving like a native app.

> **Icon note:** The app ships a single SVG icon.  iOS may fall back to a screenshot if it cannot render the SVG as a home-screen icon.  To fix this, replace `public/icons/icon.svg` with a 512×512 PNG and update the `icons` array in `public/manifest.json` accordingly.

---

## How the app works

| Layer | What it does |
|---|---|
| **Onboarding** | First-time users pick their streaming services. The selection is saved to `localStorage`. |
| **Search bar** | A debounced (400 ms) input triggers a server-side fetch. |
| **`/api/search` route** | Proxies requests to TMDB (keeps the API key out of the browser). Runs the movie *and* TV search in parallel, then fetches streaming providers for every result — also in parallel. |
| **Client filtering** | Results come back with *all* providers; the browser filters them to only the user's selected services.  This means toggling a service in Settings updates the list instantly — no extra API call. |
| **Settings modal** | A bottom-sheet on mobile / centred card on desktop.  Uses the same `ServiceCard` component as onboarding. |

---

## Project structure

```
streamfinder/
├── app/
│   ├── layout.tsx            # Root layout — PWA meta tags, Tailwind import
│   ├── page.tsx              # Thin server wrapper → renders <App />
│   ├── globals.css           # Tailwind entry + custom animations
│   └── api/
│       └── search/
│           └── route.ts      # TMDB proxy (server-side, keeps API key secret)
├── components/
│   ├── App.tsx               # Top-level client component — owns all state
│   ├── Header.tsx            # Logo + settings gear
│   ├── OnboardingScreen.tsx  # First-visit service selection
│   ├── SearchBar.tsx         # Debounced search input
│   ├── ServiceCard.tsx       # Reusable toggle card for a streaming service
│   ├── ResultsList.tsx       # Loading / error / empty / results states
│   ├── ResultCard.tsx        # A single movie-or-TV result row
│   └── SettingsModal.tsx     # Bottom-sheet / modal for editing services
├── lib/
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── streaming-services.ts # Service catalogue + TMDB provider-ID mapping
│   └── hooks/
│       └── useDebounce.ts    # Generic debounce hook
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/
│       └── icon.svg          # App icon
├── .env.local.example        # Template for the TMDB API key
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## Customisation tips

| What | Where |
|---|---|
| Add / remove a streaming service | `lib/streaming-services.ts` — add an entry with the correct TMDB provider ID |
| Change the debounce delay | `components/App.tsx` — second argument to `useDebounce` |
| Switch to a different country's providers | `app/api/search/route.ts` — change the `US` key in `usFlat()` to e.g. `GB` |
| Swap the accent colours | Search for `purple-600` / `pink-600` in the components directory |

---

## Future ideas (not yet implemented)

- Browse by genre / trending
- Movie vs. TV filter toggle
- Rating / year range filters
- Recommendations based on watch history
- Offline support / service-worker caching
