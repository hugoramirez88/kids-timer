# Changelog

All notable changes to the Kids Timer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
