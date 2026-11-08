# aura (Focus Engine) Implementation Plan

## Master Roadmap
- [x] **Milestone 1: Project Scaffolding & Setup**
  - Next.js App Router, TypeScript strict, Tailwind CSS, Lucide React icons.
- [x] **Milestone 2: Core Timer & State Engine**
  - Precision delta timer, real-time history tracking, web audio chime, notifications.
- [x] **Milestone 3: Official Real-Life Character Logo ("aura")**
  - Replaced vector emblem with the user's authentic photo (hooded martial artist pointing forward with red sparring glove) at `public/aura-logo.png`.
  - Significantly enlarged the logo icon size across the application:
    - Floating Focus pill: enlarged to 48px (`h-12 w-12`) with `ring-2 ring-[#ff4d6d]/40` and lowercase `aura` brand text.
    - Sidebar Header: enlarged to 56px (`h-14 w-14`) with `ring-2 ring-[#ff4d6d]/40`.
    - Profile Overview Avatar: enlarged to 96px (`h-24 w-24`).
- [x] **Milestone 4: Live Theme Previews Beside Theme Names**
  - Revamped Focus Studio's Theme selector.
  - Every theme card now renders an interactive simulated focus screen preview right next to its name, showcasing its custom background gradient/texture, stylized timer digits (`25:00` in the theme's font & color), mini subject pill, and glowing accent timeline.
  - Added aesthetic style tags (e.g. `Signature`, `Mono Terminal`, `Vintage Greens`, `Vinyl Neon`, `Tennis Court`, `Frosted Azure`, `Cobalt Airmail`, `Ink on Parchment`, `Golden Hour`, `Pure Void`).
- [x] **Milestone 5: Audio Drawer & Clean Distraction-Free Engine**
  - Zero hardcoded preset songs; custom user YouTube links only with graceful empty states.
  - Rock-solid event loop and click-outside handling preventing button freezes.
  - Seamless Clean Mode (`[👁]`) and Minimal Mode (`[⤢]`) without audio interruptions.
- [x] **Milestone 6: Production Verification**
  - `npx tsc --noEmit` passed with 0 errors.
  - `npm run lint` passed with 0 errors and 0 warnings.
  - `npm run build` compiled static production output with Turbopack.
  - Live screenshots verified in browser: `aura-newguy-focus.png` and `aura-themes-preview.png`.
- [x] **Milestone 7: Dark Motivation Character Themes & J.A.R.V.I.S Engine**
  - Changed brand subtitle from `focus engine` to `lets go J.A.R.V.I.S`.
  - Implemented 10 distinct character & dark motivation themes inspired by reference cards:
    - Tony Stark (J.A.R.V.I.S HUD with glowing Arc Reactor & cyan telemetry).
    - The Dark Knight (Gotham sonar radar sweep, tactical bat emblem, bat-signal yellow).
    - Fight Club (Tyler Durden debossed pink soap bar, raw taped knuckles, discipline banner).
    - Wall Street (Live candlestick breakout chart, volume bars, Bloomberg terminal green).
    - Monaco Luxe (24K gold bullion sheen, emerald velvet, dollar digits `$ 24:37`).
    - Sakura Aura (Soft aesthetic pink rose, drifting cherry blossom petals, starlight elegance).
    - Waveform Studio (Dynamic DJ audio equalizer spectrum bars, spinning vinyl record).
    - Neon Samurai (Cyberpunk yellow hazard chevrons, target reticle brackets, night city grid).
    - Midnight Void (Sensory deprivation chamber, pure black void, crisp monospace prompt).
    - Classic Default (Photo wallpaper enabled, coral aura ring, clean sans digits).
  - Background Switching Logic: Active themes automatically switch wallpaper to pure solid black; photo wallpapers are exclusively enabled for the Classic default theme.
  - Initialized isolated Git repository inside `nuzz-focus` and committed all changes (`724103d`).
- [x] **Milestone 8: Vercel Hosting & Production Deployment**
  - Linked GitHub remote `https://github.com/Naola021/aura-focus.git`.
  - Pushed `main` branch to GitHub.
  - Vercel automatically triggered production build and deployment (`dpl_6J9tfUi1HiXHB4FNiHGuN9QLcMAJ`).
  - Production deployment status: **READY**.
  - Live production URLs:
    - Primary: `https://aura-focus-tawny.vercel.app`
    - Alias: `https://aura-focus-naola.vercel.app`
    - Git Branch: `https://aura-focus-git-main-naola.vercel.app`
  - Verified live deployment with HTTP 200 checks and headless Edge screenshot (`aura-vercel-live.png`).
- [x] **Milestone 9: YouTube Mixes & Continuous Radio Playback Engine**
  - **Fixed Next (⏭) and Prev (⏮) Controls**: `handleNextTrack` and `handlePrevTrack` now directly call `ytNext()` and `ytPrev()` on the YouTube player so clicking Next skips to the next song inside the active Mix (e.g. from *01 Aster Aweke Gela Gela* to *Ken Bayne*, *Yene Konjo*, etc.) instead of jumping to other bookmarks in Aura.
  - **Real Artist & Cover Metadata**: Replaced generic `"YouTube · Audio Link"` with live `author_name` (e.g. `Aster Aweke`), actual YouTube cover thumbnails, and a `Continuous Mix` badge.
  - **Mix Mode Toggle**: Added a checkbox `[✓] Play as continuous YouTube Mix / Radio (endless queue)` so pasting any music video link automatically turns it into its endless YouTube Mix (`list=RD<videoId>`).
  - Pushed to GitHub and automatically deployed live to Vercel production (`258389b`).
- [x] **Milestone 10: Tony Stark Profile, Weekly Focus Target & Multi-Device Cloud Sync**
  - **Cleaned Placeholder Data**: Completely removed "Erosen", the "Editing" default subject (replaced with "Deep Work"), and prefilled dummy tasks. Existing browsers auto-migrate to clean slate.
  - **Default Name Tony Stark**: Profile name defaults to "Tony Stark" with custom editing capabilities.
  - **Weekly Focus Target**: Added configurable weekly commitment (hours/week) with interactive sliders, milestone tiers, and live weekly progress meter calculating cumulative focus time this week.
  - **Multi-Device Cloud Sync**: Built serverless `/api/sync` engine with global master index. Users can sign in from any device (phone, laptop, tablet, desktop) using an Account ID & Passcode to instantly load and synchronize their name, weekly targets, custom mixes, themes, tasks, and history.
  - **Curated Default Music Saved**: Preloaded curated focus tracks including Aster Aweke *01 Aster Aweke Gela Gela* continuous mix, Lofi Girl Relax & Study Radio, Synthwave Chill Beats, and Deep Focus Ambient Concentration.
  - Deployed live to Vercel production (`905bc1c`).
- [x] **Milestone 11: 100% Offline Opening & PWA Service Worker Engine**
  - **Offline App Shell Caching**: Built a custom Service Worker (`public/sw.js`) that caches the HTML shell, scripts, styles, and assets so Aura opens instantly even with zero internet / airplane mode.
  - **PWA Web App Manifest**: Added `public/manifest.json` enabling installation as a native standalone app on mobile and desktop.
  - **Offline Status & Auto-Sync**: Added `PWARegister` component that notifies users of offline state and automatically triggers cloud synchronization once reconnected.
  - Deployed live to Vercel production (`4d5fd23`).

## Current Trajectory
- Complete: Aura is fully installable as a PWA, opens 100% offline, and syncs across devices when online.

## Squad Status
| Agent | Task | Status |
| --- | --- | --- |
| Senior Product Engineer | 10 Dark Motivation Themes, J.A.R.V.I.S Subtitle, Solid Black Theme Switch, Git Commit | Completed |
| Senior Product Engineer | Vercel Deployment & Live Production Hosting | Completed |
| Senior Product Engineer | YouTube Mix Continuous Playback & Real Artist Metadata Engine | Completed |
| Senior Product Engineer | Tony Stark Profile, Weekly Focus Target & Multi-Device Cloud Sync Engine | Completed |
| Senior Product Engineer | Offline PWA Service Worker & Installable Native App Shell | Completed |
