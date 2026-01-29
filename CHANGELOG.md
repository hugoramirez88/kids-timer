# Changelog

All notable changes to the Kids Timer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.0] - 2026-01-29

### Added
- Android app support via Capacitor
- `capacitor.config.json` for native app configuration
- npm scripts: `build:android` and `android:open` for Android builds
- `android/` directory with native Android project

### Changed
- `vite.config.js` now uses conditional base path: `/` for Capacitor builds, `/kids-timer/` for web
- `index.html` asset paths changed from absolute to relative (Vite prepends BASE_URL automatically)
- `src/main.js` service worker registration uses `import.meta.env.BASE_URL` for environment awareness
- `public/sw.js` detects Capacitor environment and sets BASE_PATH accordingly
- Service worker cache version bumped to v3

## [1.5.1] - 2026-01-29

### Fixed
- Avatar and break suggestion images not loading on GitHub Pages (paths now use BASE_URL)

## [1.5.0] - 2026-01-29

### Added
- PWA (Progressive Web App) support: app can now be installed on any device
- Web app manifest with app metadata and icons
- Service worker for offline caching (network-first strategy)
- Kid-friendly tomato icon (192x192 and 512x512 PNG)
- Favicon for browser tabs
- Apple mobile web app meta tags for iOS home screen
- GitHub Pages deployment with automatic CI/CD via GitHub Actions
- Live at: https://hugoramirez88.github.io/kids-timer/

### Changed
- Vite base path set to `/kids-timer/` for GitHub Pages subfolder deployment
- Manifest paths changed to relative (`./`) for portability
- Service worker updated with base path for correct caching on GitHub Pages

## [1.4.2] - 2026-01-29

### Fixed
- Alert settings (1 minute, 5 minutes, 50%, 25% warnings) now persist across page reload
- Event listener memory leaks: cleanup functions added for visibilitychange and timer events
- Progress color consistency: AnimalPath now shows warning colors at 50%/75% like other indicators

### Changed
- Progress color logic extracted to shared `useProgressColor` composable (DRY improvement)
- Default unlocked items centralized in `src/data/defaults.js` (single source of truth)

### Added
- ErrorBoundary component wraps critical sections to prevent white screen on errors

## [1.4.1] - 2026-01-29

### Fixed
- Progress indicator setting (hourglass, animal path, etc.) now persists after page reload
- Settings button touch target increased to 44x44px (WCAG minimum) for better mobile accessibility
- Minor horizontal overflow on 375px mobile viewport fixed with overflow-x: hidden

### Changed
- Removed xfail markers from test_pr06_persistence and test_a01_touch_targets_minimum_size tests

## [1.4.0] - 2026-01-25

### Added
- Comprehensive Playwright E2E test suite with 97 test cases across 10 test files
- Test infrastructure: conftest.py, config.py, port_detector.py, storage_helpers.py
- Profile CRUD tests (P01-P08): create, select, switch, edit, logout, persistence
- Timer functionality tests (T01-T10): start, presets, pause/resume, stop, completion, points
- Progress indicator tests (PR01-PR06): all 4 indicators, settings, persistence
- Music player tests (M01-M08): enable, play, pause, volume, locked tracks
- Rewards shop tests (R01-R08): open, buy, insufficient points, select items
- Settings panel tests (S01-S10): themes, toggles, volume, music, dev mode
- Badge system tests (B01-B05): display, earned/locked states, earning via pomodoro
- Responsive design tests: mobile (375px), tablet (768px), desktop (1024px) viewports
- Visual states tests (VS01-VS08): button states, theme states, timer states
- Accessibility tests (A01-A05): touch targets, focus management, labels, keyboard nav
- npm test scripts: `npm run test`, `npm run test:headed`, `npm run test:report`
- IDEAS.md for capturing improvement ideas during development

### Discovered Issues
- Progress indicator setting not restored from profile on page reload (xfail)
- Settings button touch target below 44px minimum on mobile (xfail)
- Minor horizontal overflow (5px) on 375px mobile viewport

## [1.3.0] - 2026-01-23

### Added
- Energetic music section ("Música Animada") for kids who prefer upbeat music during focus
- 5 upbeat tracks from Archive.org CC0 collection: Ukulele Feliz, Tema de Aventura, Batidas Divertidas, Dia Ensolarado, Festa Dançante
- 2 free default tracks + 3 unlockable with stars
- Energetic tracks purchasable in Rewards Shop

## [1.2.0] - 2026-01-23

### Added
- Haptic feedback (vibration) on timer events for mobile devices
- New "Vibração" toggle in Sound settings to enable/disable haptic feedback
- Vibration patterns: 3 short pulses on start, 2 medium pulses on break, celebration pattern on complete, alert pattern on warning

## [1.1.0] - 2026-01-23

### Added
- Progress persistence: timer state now survives page refresh
- Saves timer state (status, time remaining, durations) to localStorage
- Automatically restores running/paused timers on page load
- Handles edge cases: expired timers trigger completion with awards
- Profile editing feature: edit profile name and change avatar from header
- Edit button (✏️) next to profile badge in header
- Modal to edit profile name (max 20 chars) and select from unlocked avatars
- Skip break option: "Pular" button during breaks for eager kids

### Fixed
- Meditação Zen, Sonho Tranquilo, and Foco Suave soundscapes not playing (fixed redirect URLs)

## [1.0.1] - 2026-01-23

### Changed
- Increased max-width of AnimalPath component from 450px to 675px for better visibility
- Increased max-width of ProgressBar component from 450px to 1350px for better visibility

### Added
- CLAUDE.md with development environment documentation and workflow guidelines
- CHANGELOG.md for tracking project changes

## [1.0.0] - Initial Release

### Added
- Vue 3 + Vite + Pinia project setup
- Timer functionality with Pomodoro-style sessions
- Progress indicator components (ProgressBar, AnimalPath)
- Settings store for customization
- Kid-friendly UI with animal themes
