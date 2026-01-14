# Kids Timer - Product Roadmap

> A Pomodoro timer designed for children, built with love for families.

## Current Status (v1.0)

A fully functional Pomodoro timer with:
- Profile system with gamification (points, badges, streaks)
- Multiple visual progress indicators (circular, animal path, hourglass, progress bar)
- 6 customizable themes (2 default + 4 unlockable)
- 5 ambient soundscapes (2 default + 3 unlockable)
- Break suggestions in Brazilian Portuguese with educational illustrations
- Audio feedback using Web Audio API
- YouTube integration for custom music
- Classical music educational section
- Settings panel for customization
- Local storage persistence (privacy-first, no cloud)

---

## Security & Privacy Review

### Current Status: SAFE for Children

**Privacy:**
- All data stored locally (localStorage only)
- No user accounts or registration
- No analytics or tracking
- No data sent to external servers
- No personal information collected

**Security:**
- No eval() or innerHTML vulnerabilities
- No external script loading
- YouTube embed uses standard iframe sandbox

**Parental Awareness:**
- YouTube integration allows access to any YouTube content
- Parents should supervise YouTube URL selection
- Consider adding YouTube Kids API or URL whitelist in future

---

## Priority Tasks (Immediate)

### P0: Critical Fixes (Completed)
- [x] Fix button click responsiveness (type="button")
- [x] Fix progress indicator display
- [x] Fix animal path animation offset
- [x] Fix Pomodoro completion timing (end of work, not rest)

### P1: UX Polish (In Progress)
- [x] Rebalance progression pacing (unlock curve)
- [x] Create distinct ambient soundscapes
- [ ] Add more classical music educational content
- [ ] Test on various screen sizes (mobile, tablet)
- [ ] Add haptic feedback on mobile (vibration API)

---

## Feature Roadmap

### Phase 1: Core Polish (High Priority, Low Effort)

| Feature | Effort | Impact | Status |
|---------|--------|--------|--------|
| Profile editing (name, avatar) | Low | High | Planned |
| Skip break option | Low | Medium | Planned |
| Quiet hours setting | Low | Medium | Planned |
| Progress persistence on refresh | Low | High | Planned |
| Better empty states | Low | Medium | Planned |

### Phase 2: Engagement (High Priority, Medium Effort)

| Feature | Effort | Impact | Status |
|---------|--------|--------|--------|
| Daily goals | Medium | High | Planned |
| Weekly summary view | Medium | Medium | Planned |
| Achievement notifications | Low | Medium | Planned |
| Streak recovery (grace period) | Low | High | Planned |
| Sound effect variety | Medium | Medium | Planned |

### Phase 3: Content & Education (Medium Priority)

| Feature | Effort | Impact | Status |
|---------|--------|--------|--------|
| More break activity suggestions | Medium | Medium | Planned |
| Illustration sets (TinTin, Ghibli style) | High | High | Future |
| Music quiz mini-game | Medium | Medium | Future |
| Composer fun facts during music | Low | Low | Planned |
| Breathing exercise guide | Medium | Medium | Future |

### Phase 4: Advanced Features (Lower Priority)

| Feature | Effort | Impact | Status |
|---------|--------|--------|--------|
| Family sharing (sync) | High | Medium | Future |
| Sibling competition mode | High | Medium | Future |
| Custom timer sounds upload | Medium | Low | Future |
| Export stats to PDF | Medium | Low | Future |
| Multiple languages | High | Medium | Future |

---

## App Store Distribution

### PWA (Recommended First Step)
**Effort: Low | Reach: All platforms**

1. Add service worker for offline support
2. Configure web manifest with icons
3. Enable "Add to Home Screen" prompts
4. Host on GitHub Pages or Netlify
5. No store fees, instant updates

### Android (Google Play)
**Effort: Medium | Cost: $25 one-time**

1. Set up Capacitor for native wrapper
2. Configure Android build (icons, splash)
3. Create Google Play Developer account
4. Prepare store listing (PT-BR + EN)
5. Set up app signing
6. Submit for review (1-3 days)

### iOS (Apple App Store)
**Effort: Medium-High | Cost: $99/year**

1. Requires Mac for building
2. Set up Capacitor iOS
3. Create Apple Developer account
4. Handle iOS audio permissions
5. App Store review (1-7 days)

### Windows (Microsoft Store)
**Effort: Low | Cost: Free for individuals**

1. Package as PWA or Electron
2. Create Microsoft Partner account
3. Generate MSIX package
4. Submit for certification (1-3 days)

### macOS (Mac App Store)
**Effort: Medium | Cost: Included with Apple Dev**

1. Electron or Tauri wrapper
2. Code signing + notarization
3. App sandbox entitlements
4. Submit via App Store Connect

---

## Monetization: Donation System

### "Buy Me an Ice Cream" Model

**Philosophy:**
- All features free forever
- Donations purely voluntary
- No features locked behind paywall
- Kid-friendly, pressure-free messaging

### Suggested Amounts by Region

| Region | Amount | Currency |
|--------|--------|----------|
| Brazil | R$ 10 | BRL |
| USA | $3 | USD |
| Europe | €3 | EUR |
| UK | £2.50 | GBP |
| Japan | ¥500 | JPY |

### Implementation Options

**Option 1: Ko-fi (Recommended)**
- No fees for donations
- Easy setup
- Supports multiple currencies
- Link: ko-fi.com

**Option 2: PIX (Brazil-specific)**
- Direct bank transfer
- Extremely popular in Brazil
- Zero fees
- Just need a PIX key (email/phone/random)

**Option 3: GitHub Sponsors**
- Good for open-source projects
- Monthly sponsorship model
- Requires GitHub account

**Option 4: Buy Me a Coffee**
- Similar to Ko-fi
- More established brand
- 5% platform fee

### Setup Steps

1. Create Ko-fi or BMC account
2. Set up payment methods (PayPal, Stripe)
3. Create donation page with kid-friendly message
4. Add "Support" button in app settings
5. Optional: "Thank you" badge for donors

### Messaging Example

```
Gostou do timer? 🍦

Se este app ajuda sua família, considere
nos pagar um sorvete! É totalmente opcional.

[Pagar um Sorvete]
```

---

## Technical Improvements

### Code Quality
- [ ] Add unit tests for stores (Vitest)
- [ ] Add component tests
- [ ] Set up GitHub Actions CI/CD
- [ ] Add error boundary components
- [ ] Implement proper error logging

### Performance
- [ ] Lazy load modals and non-critical components
- [ ] Optimize bundle size (analyze with vite-bundle-visualizer)
- [ ] Add resource hints (preload, prefetch)
- [ ] Test on low-end devices

### Accessibility
- [ ] Screen reader support (ARIA labels)
- [ ] High contrast theme option
- [ ] Reduced motion option
- [ ] Larger text option
- [ ] Keyboard navigation improvements

---

## Open Source Considerations

### If Publishing Source Code

**Recommended License:** MIT

**Repository Structure:**
```
kids-timer/
├── .github/
│   ├── workflows/       # CI/CD
│   └── ISSUE_TEMPLATE/
├── docs/
│   └── plans/           # Design docs
├── public/
├── src/
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── ROADMAP.md
```

**Contribution Guidelines:**
1. Open issue before major changes
2. Follow existing code style
3. Test thoroughly
4. Keep kid-friendly spirit
5. No ads or tracking

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-13 | Vue 3 + Vite | Modern, fast, good DX |
| 2026-01-13 | Local storage only | Privacy for children |
| 2026-01-13 | No accounts | Simplicity, privacy |
| 2026-01-14 | Pomodoro = work end | More intuitive reward |
| 2026-01-14 | Rebalanced costs | Better day-1 experience |

---

## Guiding Principles

1. **Kids first** - Every feature should delight children
2. **Privacy always** - No tracking, no data collection
3. **Simple beats complex** - Avoid feature creep
4. **Parents trust** - No dark patterns, no pressure
5. **Performance matters** - Works on old devices
6. **Test with real kids** - Get actual feedback

---

## Notes for Contributors

- Keep the app simple and fun
- Performance matters on older devices (hand-me-down tablets)
- Privacy first - no analytics, no tracking, all data stays local
- Test with actual children for UX feedback
- Brazilian Portuguese is primary language
- Use emojis thoughtfully (kids love them)
