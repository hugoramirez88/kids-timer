# Kids Timer - Roadmap

> A Pomodoro timer designed for children, built with love for families.

## Completed (v1.0)

- Profile system with gamification (points, badges)
- 4 visual progress indicators (circular, animal path, hourglass, progress bar)
- 6 customizable themes (2 default + 4 unlockable)
- 5 ambient soundscapes (2 default + 3 unlockable)
- Break suggestions in Brazilian Portuguese with educational illustrations
- Audio feedback using Web Audio API
- YouTube integration for custom music
- Classical music educational section
- Settings panel for customization
- Local storage persistence (privacy-first, no cloud)

## Recent Fixes

- Jan 2026: Fixed paid soundscape URLs (404 errors)
- Jan 2026: Hidden dev mode behind 7-tap gesture
- Jan 2026: Fixed Pomodoro completion timing (end of work, not rest)
- Jan 2026: Fixed animal path animation offset
- Jan 2026: Rebalanced progression pacing (unlock curve)

---

## Next Features

### High Impact | Low Effort

| Feature | Description |
|---------|-------------|
| Larger progress indicators | Caminho 1.5x, Barra 3x visual size |
| ~~Profile editing~~ | ~~Change name/avatar~~ ✅ |
| ~~Skip break option~~ | ~~Quick skip for eager kids~~ ✅ |
| ~~Progress persistence~~ | ~~Survive page refresh~~ ✅ |
| ~~Haptic feedback (mobile)~~ | ~~Vibration on timer events~~ ✅ |

### High Impact | Medium Effort

| Feature | Description |
|---------|-------------|
| Ghibli-style illustrations | Whimsical art style for break suggestions (unlockable) |
| TinTin-style illustrations | Adventure art style for break suggestions (unlockable) |
| ~~Energetic music options~~ | ~~Upbeat/stimulating music for kids who prefer it~~ ✅ |
| Achievement notifications | Toast when badge earned |

### Medium Impact

| Feature | Description |
|---------|-------------|
| More break activities | Expand suggestion variety |
| Quiet hours | Disable sounds during certain times |
| Breathing exercises | Guided relaxation during breaks |

### Future Considerations

- Family sharing/sync
- Multiple languages
- Custom sound uploads

### Explicitly NOT Adding

- ~~Daily goals~~ - creates pressure to do more
- ~~Streaks/streak recovery~~ - encourages over-use
- ~~Weekly summary~~ - feels like surveillance

---

## Technical Debt

- ~~Add unit tests for stores (Vitest)~~ ✅ (Playwright E2E tests added)
- ~~Fix alerts settings persistence~~ ✅
- ~~Fix event listener memory leaks~~ ✅
- ~~Create useProgressColor composable~~ ✅
- ~~Centralize default unlock items~~ ✅
- ~~Add error boundary component~~ ✅
- Set up GitHub Actions CI/CD
- Lazy load modals and non-critical components
- Screen reader support (ARIA labels)
- High contrast and reduced motion options

---

## Distribution

See [DISTRIBUTION.md](DISTRIBUTION.md) for app store publishing details.

---

## Guiding Principles

1. **Kids first** - Every feature should delight children
2. **Privacy always** - No tracking, no data collection
3. **Simple beats complex** - Avoid feature creep
4. **Parents trust** - No dark patterns, no pressure
5. **No over-use incentives** - Avoid streaks, daily goals, competition, or anything that pressures kids to use the app more
6. **Performance matters** - Works on old devices
7. **Test with real kids** - Get actual feedback
