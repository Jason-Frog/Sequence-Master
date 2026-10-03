# Changelog

All notable changes to **Sequence Master** are documented in this file.
Versioning follows semantic versioning; game-core module APIs stay backward compatible across every release.

## [1.0.0] - 2026-10-04

First stable release. Ships all three platforms from one codebase.

### Added
- Android app (Tauri 2): signed universal APK covering 4 ABIs, `minSdk 24` (Android 7.0+), offline-capable
- Native Android status-bar safe area (edge-to-edge WindowInsets handling in `MainActivity`)
- Responsive header: compact typography below 640 px logical pixels, full size on larger screens
- Download landing page with Android card wired to Gitee (primary, CN-fast) and GitHub (fallback) APK links

### Changed
- Windows desktop window is now fixed at 1000×720: resizing and maximizing disabled
- "Download" entry hidden inside desktop/mobile clients (web-only)
- Android launcher icons regenerated from the app master icon

## [0.5.0] - 2026-10-03

### Added
- Gitee mirror repository as a domestic (China) fast-channel distribution point; download page Windows card switched to Gitee primary + GitHub fallback

### Changed
- Download page hero icon downscaled 1024px → 192px (300 KB → 66 KB) for faster first paint on slow networks

## [0.4.0] - 2026-10-03

### Added
- Windows desktop app (Tauri 2): MSI installer + NSIS setup wizard, bundled via GitHub Actions release workflow on `v*` tags
- Platform icon set generated from a single master icon (Windows / Android / web favicon)

### Fixed
- Blank Tauri window: Vite `base` now switches per target (`./` for Tauri, `/Sequence-Master/` for GitHub Pages)

## [0.3.0] - 2026-10-03

### Added
- Vite MPA build (`index.html` + `download.html`) with PostCSS-compiled Tailwind
- GitHub Pages deployment workflow; public site live
- Standalone download landing page (placeholder stage) and favicon

## [0.2.0] - 2026-10-03

### Added
- Full playable UI: mode tabs, basic/advanced setup panels, guess board with slot/pool interaction, per-round feedback, history list, result modal
- Event-bus wiring between UI and core; Tailwind styling precompiled locally

### Notes
- Requires a local HTTP server to run (ES module CORS restriction under `file://`)

## [0.1.0] - 2026-10-02

### Added
- Advanced mode core: `validateAdvancedConfig`, `generateAdvancedAnswer` (valid items + distractors drawn in one Fisher-Yates pass)
- Two-dimension feedback (exact / misplaced) verified against advanced scenarios; win/lose rules reuse the basic-mode session state machine unchanged

### Notes
- Zero changes to stage-1 modules; pure additive extension

## [0.0.0] - 2026-10-01

### Added
- Project skeleton: zero-dependency HTML5 + native ES modules, sentinel constants in `appMeta.js`
- Core engine modules: parameter validation (`validate`), item pool (`itemPool`, 12 frozen emoji items), answer generation (`answerGen`, Fisher-Yates, no repeats), feedback comparison (`compare`, exact + consumption-based misplaced), game session state (`gameState`, illegal submissions never consume a round), immutable history (`history`)
- Command-line debug harnesses with built-in expected values for every core module
