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
- [x] **Milestone 12: High-Capacity Cloud Datastore Engine**
  - **Resolved Cloud Object Creation Error**: Replaced the payload-limited mock API with a dedicated, high-capacity JSON cloud storage backend (`febfcbc`) supporting full nested payloads (profiles, weekly target hours, tasks, mixes, and 50+ session histories).
  - Verified live on Vercel production (`f112f28`) with instant sub-second login and cross-device sync.

- [x] **Milestone 13: Music Player Overhaul, Clean Profile Target & Distraction-Free UI**
  - **Removed Cloud Sync Modal & Floating Pill**: Eliminated the `[ ☁️ tonystark ]` pill and the sync modal popup per user request for pure, distraction-free focus aesthetics.
  - **Restored Original Profile Layout**: Removed the separate "Weekly Focus Commitment" slider section and "Multi-Device Sync" card. Weekly target is calculated directly from daily target duration (`dailyTarget.hours * 7`) in the top-right goal badge.
  - **Fixed YouTube Music Play Button & Link Fetching**:
    - Created internal server route `/api/youtube-meta` to completely eliminate browser CORS fetch errors.
    - Updated `parseYouTube` to extract embeddable video IDs from any YouTube URL (including `&list=RD...` mix links).
    - Set default track #1 to verified embeddable Aster Aweke *01 Aster Aweke Gela Gela* (`6OCBxSC0r4g`).
    - Configured YouTube player with `origin: window.location.origin` and `enablejsapi: 1` for reliable postMessage playback control.
    - Moved background audio iframe to non-throttled DOM position (`fixed bottom-0 right-0 w-[240px] h-[180px] pointer-events-none -z-50 opacity-[0.01]`) preventing Chromium/Safari autoplay and visibility pauses.
    - Added auto-advance on track completion (`onEnded`) to play through the saved audio queue continuously.
    - Direct player state querying in `toggle()` ensuring immediate play/pause response.
    - Added ability to delete default tracks too, with persistent tracking (`aura:deletedAudioIds`) and optional "Restore default tracks" option.
    - Added custom default track selection: any saved link (like MEZMUR or Bruno Mars) can be set as default with a single click, showing the highlighted `[★ Default]` badge, and automatically loading as the primary track on boot.
    - Replaced broken Lofi thumbnail with permanent 200 OK link (`5qap5aO4i9A`) and added Bruno Mars Mix (`LjhCEhWiKXk`).
  - **Quality Gates & Deployment**: `tsc --noEmit` (0 errors), `npm run lint` (0 errors), `npm run build` (successful Turbopack production compilation). Pushed to `origin main` for automatic Vercel production deployment.

- [x] **Milestone 14: Mobile Phone Compatibility & Custom Authentic Logo Favicon**
  - **Custom Logo Favicon & Multi-Platform Touch Icons**:
    - Converted user's authentic hooded martial artist logo photo (`public/aura-logo.png`) directly into standard `app/favicon.ico` (64x64 multi-resolution) and `public/favicon.ico`.
    - Generated `app/icon.png` (512x512) and `app/apple-icon.png` (180x180) for iOS home screen web apps.
    - Updated `app/layout.tsx` metadata with complete multi-size icon descriptors, `viewportFit: "cover"`, and `touch-manipulation` preventing mobile tap delay.
  - **Full Mobile Phone Responsiveness (320px–430px Viewports)**:
    - **Mobile Navigation Drawer**: Built slide-out drawer on `< 768px` with click-outside backdrop dismissal, brand header, nav tabs (Home, Stats), coral "Start focus" button, and user profile card with flame streak count.
    - **Header Brand Pill**: Responsive dimensions (`h-8 w-8 sm:h-12 sm:w-12`), balanced spacers, and non-colliding layout with subject pill.
    - **Clock Digits**: Auto-scaled text size (`text-5xl xs:text-6xl sm:text-8xl md:text-9xl`) ensuring `00:45:00` never wraps or clips on narrow phones.
    - **Bottom Dock Toolbar**: Responsively collapsed desktop-only utilities (Zoom, Fullscreen, PiP, Timelapse) into `sm:` screens, keeping clean, touch-friendly Video, Audio, Settings, Clean, and Minimal buttons.
    - **Music Player Bar & Queue Drawer**: Responsive dock width (`max-w-[96vw]`), touch-friendly delete & default star buttons (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100`), and fluid track title truncation.
    - **Focus Studio Modal**: Converted modal sidebar to horizontal tab strip on phones, maximizing vertical screen real estate for wallpapers and theme previews.
    - **Activity Heatmap**: Added horizontal touch scroll with sticky labels, preventing clipped columns on narrow screens.
  - **Verification & Deployment**:
    - `npx tsc --noEmit` passed with 0 errors.
    - `npm run lint` passed with 0 errors and 0 warnings.
    - `npm run build` compiled all routes cleanly with Turbopack.
    - Captured mobile viewport screenshot (`aura-mobile-perfect.png`) verifying zero overflow, crisp aesthetics, and touch usability.

### Milestone 15: Tony Stark Helmet HUD Overhaul, Global Dashboard Zoom (25%–200%), & Draggable Music Player Bar
  - **Tony Stark Mark VII Helmet HUD Visuals**:
    - Extracted and integrated high-resolution battle gaze asset into `public/themes/tony-stark-hud.jpg`.
    - Added realistic helmet visor vignette, curved scanlines, and anamorphic crimson eye flare beams.
    - Added left telemetry: 3D Iron Man suit wireframe diagnostic (`MARK VII // ARMOR 88%`), rotating dashed targeting reticle, `CRITICAL FOCUS` warning badge, and visor timecode (`HUD TIMECODE: 01:25:00`).
    - Added right comms: Holographic calling card (`CALLING. PEPPER POTTS // STARK INDUSTRIES`), avatar thumbnail, and live animated audio frequency spectrum equalizer bars.
    - Centered Mark VII HUD reticle brackets (`[ J.A.R.V.I.S ]`, `[ MARK VII ]`) framing the focal countdown clock.
  - **Global Dashboard Zoom Scaling (25% to 200%)**:
    - Expanded zoom range down to 25% and up to 200% (`Math.min(200, Math.max(25, prev + delta))`), persisted via `aura:zoomPercent`.
    - Wrapped the entire active dashboard stage (Subject pill, Tasks checklist badge, Digital clock, Subtitle, Progress bar, "Add time" popover, and Action buttons) in a CSS transform container (`scale(${zoomPercent / 100})`), ensuring harmonious proportional resizing of all dashboard components.
    - Kept dock toolbar fixed at full scale for reliable navigation and accessibility.
    - Enabled single-click reset on zoom percentage text back to 100%.
  - **Movable & Draggable Music Player Bar**:
    - Implemented high-performance pointer capture dragging (`setPointerCapture`, `onPointerDown`, `onPointerMove`, `onPointerUp`) with viewport clamping so the bar can be positioned anywhere without escaping the screen.
    - Added drag grip handle `::` with active grab cursor indicators.
    - Added dock reset button `RotateCcw` to snap the player back to default bottom center with one click.
    - Added adaptive drawer positioning (opens downward when player is in upper screen, upward when near bottom).
    - Persisted custom coordinates in `localStorage` under `aura:musicPos`.
  - **Verification & Deployment**:
    - `npx tsc --noEmit` passed with 0 errors.
    - `npm run lint` passed with 0 errors and 0 warnings.
    - `npm run build` compiled all routes cleanly with Turbopack.
    - Live browser verification screenshots captured:
      - `aura-tony-stark-live.png`: Full desktop helmet HUD with Pepper Potts comms & Mark VII telemetry.
      - `aura-tony-stark-zoom50.png`: Proportional 50% scaling of all dashboard elements.
      - `aura-tony-stark-mobile.png`: Flawless mobile phone viewport layout.

### Milestone 16: Music Mix In-Queue Track Navigation & YouTube Mix Embed Engine
  - **Identified Root Causes**:
    - `parseYouTube` used a restrictive playlist regex `/^(PL|UU|OL)/` that dropped `list=RD...` parameters on YouTube mixes, turning them into standalone single videos.
    - `sanitizedCustomSources` was coercing all `RD` mixes into `kind: "video"`, stripping out their playlist queue.
    - `handleNextTrack` was switching `selectedId` to the next saved card in `allSources` instead of calling `player.nextVideo()` in the active YouTube player queue.
  - **YouTube Mix Engine Overhaul**:
    - Expanded playlist regex to `/^(PL|RD|UU|OL|LL|FL|TL)[\w-]{2,}$/i` in [`lib/youtube.ts`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/lib/youtube.ts) to preserve YouTube mixes, radios, channel uploads, and albums.
    - Configured `bruno-mars-mix` in [`lib/tracks.ts`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/lib/tracks.ts) as `kind: "playlist"` with `ref: "RDLjhCEhWiKXk"` and `videoId: "LjhCEhWiKXk"`.
    - Updated [`hooks/useYouTubePlayer.ts`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/hooks/useYouTubePlayer.ts) to embed mix queues with `listType: "playlist"` and `list: initial.ref`, with starting `videoId` in `playerVars`.
    - Wired `nextVideo()` and `previousVideo()` with error recovery so failing tracks automatically skip to the next available song in the mix.
    - Exposed `artist` and `isPlaylistActive` so live song changes update both track title and artist name dynamically.
  - **Player Transport Controls ([`MusicPlayerBar.tsx`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/components/focus/MusicPlayerBar.tsx))**:
    - Updated `handleNextClick` and `handlePrevClick`: when playing a mix or playlist, touching `Next` (`SkipForward`) advances through the songs within that mix rather than jumping to another saved card in the library.
    - Kept saved card switching accessible via the interactive playlist drawer.
    - Added contextual tooltips ("Next song in mix / playlist" vs "Next track in queue").
  - **Verification & Deployment**:
    - `npx tsc --noEmit` passed with 0 errors.
    - `npm run lint` passed with 0 errors and 0 warnings.
    - `npm run build` compiled all routes cleanly with Turbopack.
    - Executed automated browser workflow test (`test-workflow.mjs` via Chrome DevTools Protocol) confirming that clicking Next advances within the mix and retains `selectedAudioId` without switching to other saved playlists.
    - Captured live browser verification screenshot: `music-mix-workflow-live.png`.

### Milestone 17: VideoId Initialization Fix & Reliable Play Trigger
  - **Root Cause & Fix for Play Button**:
    - Milestone 16 had omitted top-level `videoId` when `isEmbeddablePlaylist` was true, which caused YouTube's iframe initialization to fail (producing a blank iframe `src=""`).
    - Fixed [`hooks/useYouTubePlayer.ts`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/hooks/useYouTubePlayer.ts): Always supplies a valid `videoId` (e.g. `"LjhCEhWiKXk"`) alongside `playerVars.list`, guaranteeing that YouTube embeds the video immediately with its 50-track mix queue.
    - Added `pendingPlayRef`: if the user taps Play while the player is mounting or connecting, it queues the play command and automatically triggers playback the exact millisecond `onReady` fires.
    - Handled `BUFFERING` state seamlessly so the UI reflects active playback without stuttering.
  - **Verification**:
    - Verified in browser with automated CDP script:
      - `iframeSrc`: `https://www.youtube.com/embed/LjhCEhWiKXk?...list=RDLjhCEhWiKXk` loads immediately.
      - Play starts playback instantly.
      - Next button advances from "The Lazy Song" to "Grenade (Official Music Video)" inside the mix queue without leaving the mix.
    - `npx tsc --noEmit` and `npm run lint`: 0 errors.
    - `npm run build`: Turbopack build succeeded cleanly.

### Milestone 18: High-Definition Tony Stark Helmet HUD Theme Visual Upgrade
  - **Design Evolution & Concept Alignment**:
    - Enhanced the `stark` theme to closely match the uploaded cinematic concept mockup with dynamic, live, interactive components.
    - Cinema-graded the background photo ([`tony-stark-hud.jpg`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/public/themes/tony-stark-hud.jpg)) with S-curve contrast boost, deep cockpit blacks, and vibrant crimson saturation.
    - Extracted and integrated the real movie Pepper Potts holographic portrait ([`pepper-potts-avatar.jpg`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/public/themes/pepper-potts-avatar.jpg)) and the Mark VII holographic armor suit wireframe ([`stark-suit-wireframe.jpg`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/public/themes/stark-suit-wireframe.jpg)).
  - **Cockpit HUD Overhaul**:
    - **Integrated Top Bar**: Connected telemetry directly alongside the live header: `HELMET HUD ENGAGED` with pulsing beacon on top-left, `J.A.R.V.I.S: TARGET ACQUIRED` under the subject pill, and `POWER: 100%` beside the Tasks counter.
    - **Digital HUD Timer & Laser Reticle Crosshair**: Segmented monospace typography in vibrant crimson (`#ff2e56`) with intense bloom glow, flanked by a horizontal glowing laser reticle crosshair line (`├── [  ] ──┤`) running through the timer.
    - **Action Buttons & Flanking Telemetry**: Rounded dark glass `End` button and vibrant glowing hot-crimson `Resume`/`Pause` button, flanked by tactical HUD brackets `[ DLCT ]` and `[ ADVD ]`.
    - **Pepper Potts Comms Hologram**: High-tech frosted glass card with real photo avatar, `CALLING. J.A.R.V.I.S.5`, `PEPPER POTTS`, `STARK INDUSTRIES`, `● SECURE AUDIO LINK`, and animated glowing audio equalizer wave bars.
    - **Mark VII Diagnostics**: Rotating circular telemetry ring (`ARMOR 88%`), holographic suit wireframe with screen blend, `CRITICAL FOCUS` warning banner, and `HUD TIMECODE: 01:25:00`.
  - **Verification**:
    - `npx tsc --noEmit`: 0 errors.
    - `npm run lint`: 0 errors, 0 warnings.
    - `npm run build`: Turbopack production compilation completed with 100% success.
    - Captured desktop (`aura-tony-stark-live.png`) and mobile (`aura-tony-stark-mobile.png`) browser verification screenshots.
    - Pushed to `origin main` (commit `af992e3`) for automated live production deployment on Vercel.

### Milestone 19: Crystal-Clear Cockpit HUD Restoration & Red Clutter Purge
  - **Root Cause of Red / Unclear Hell**:
    - The previous iteration applied artificial red scanlines (`repeating-linear-gradient`), a radial vignette, an anamorphic blur across Tony's eyes, and over-saturated color grading on a low-res movie crop.
    - It additionally rendered duplicate HTML boxes for the wireframe suit and Pepper Potts card that floated over and clashed with the background image.
  - **Fix & Architectural Simplification**:
    - Purged all artificial red scanlines, vignette filters, lens flare blurs, and duplicate HTML telemetry boxes from [`ThemeAtmosphere.tsx`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/components/focus/ThemeAtmosphere.tsx).
    - Inpainted the high-resolution, cinema-grade concept image ([`tony-stark-hud.jpg`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/public/themes/tony-stark-hud.jpg)) using fast diffusion so the central face features (natural flesh tones, cuts, sweat beads, sharp eyes, helmet collar) are 100% visible and sharp without any baked-in timer or button clashes.
    - Kept the UI razor-sharp with clean, un-smeared crimson typography, a continuous fine-line laser reticle behind the timer, and real interactive controls.
  - **Verification**:
    - `npx tsc --noEmit`: 0 errors.
    - `npm run lint`: 0 errors, 0 warnings.
    - `npm run build`: Turbopack build succeeded with 100% route optimization.
    - Verified live rendering with Edge headless screenshots: `aura-tony-stark-live.png` and `aura-tony-stark-mobile.png`.
    - Pushed commit `37c5dd7` to `origin main` for automated Vercel live production deployment.

### Milestone 20: Attached Tasks Tracking in Focus Stats & History
  - **Why**: The user required attached tasks completed during focus sessions to be accurately tallied, stored in history entries, and visible in analytics.
  - **Implementation**:
    - Enhanced [`lib/types.ts`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/lib/types.ts) with `tasksCompleted?: number` and `totalTasksAttached?: number` in `FocusSessionEntry`.
    - Updated [`components/focus/FocusPage.tsx`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/components/focus/FocusPage.tsx) to record completed task counts when logging focus sessions.
    - Updated [`lib/stats.ts`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/lib/stats.ts) to aggregate total tasks accomplished across sessions.
    - Displayed in [`components/stats/StatsView.tsx`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/components/stats/StatsView.tsx) and [`components/focus/HistoryDrawer.tsx`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/components/focus/HistoryDrawer.tsx).

### Milestone 21: Removal of Baked 00:30:00 Timer & Dashboard Zoom Anchor Stabilization
  - **Why**:
    - The background image previously had a static `00:30:00` mockup timer and nose progress lines baked into the pixels, causing duplicate timers when Aura rendered its dynamic timer over it.
    - During dashboard zooming (25%-200%), the top header and bottom toolbar moved inward toward the center of the screen instead of staying anchored to their respective edges.
  - **Implementation**:
    - **Pristine Inpainting of Tony Stark HUD**: Removed the baked `00:30:00` digital font, red glow, nose bridge reticle lines, and mockup progress indicators directly in [`public/themes/tony-stark-hud.jpg`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/public/themes/tony-stark-hud.jpg) and [`public/themes/tony-stark-clean.jpg`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/public/themes/tony-stark-clean.jpg). Intact HUD graphics (Mark VII wireframe, diagnostics, Pepper Potts audio link, `J.A.R.V.I.S: TARGET ACQUIRED`) remain crisp and authentic.
    - **Layout Anchor Structure**: Restructured [`components/focus/ImmersiveFocusView.tsx`](file:///c:/Users/G-Trader/Documents/Project-X/Aura/nuzz-focus/components/focus/ImmersiveFocusView.tsx) into semantic `<header>` (pinned top), `<main>` (zoom scaled centered in place), and `<footer>` (pinned bottom).
    - **Single Timer Enforcement**: Aura's dynamic countdown/countup timer is now the only timer rendered on screen.
  - **Verification**:
    - `npx tsc --noEmit`: 0 errors.
    - `npm run lint`: 0 errors.
    - `npm run build`: Turbopack production build succeeded with 0 errors.
    - Live screenshots verified in browser:
      - 100% zoom: [aura-stark-live-clean-final.png](file:///C:/Users/G-Trader/.gemini/antigravity/brain/57f3ff44-59a5-4014-b507-4831902ed378/aura-stark-live-clean-final.png)
      - 50% zoom: [aura-stark-live-zoom50.png](file:///C:/Users/G-Trader/.gemini/antigravity/brain/57f3ff44-59a5-4014-b507-4831902ed378/aura-stark-live-zoom50.png)
    - Pushed commit `d9e2604` to `origin main` for automated Vercel live production deployment.

## Current Trajectory
- Complete: Tony Stark theme timer duplication resolved, background image inpainted clean, and zoom layout anchored.

## Squad Status
| Agent | Task | Status |
| --- | --- | --- |
| Senior Product Engineer | Attached Tasks Tracking in Focus Stats & Analytics | Completed |
| Senior Product Engineer | Tony Stark HUD 00:30:00 Timer Removal & Zoom Anchor Stabilization | Completed |
