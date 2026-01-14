# Kids Timer - Roadmap

## Current Status

A working Pomodoro timer for children with:
- Profile system with gamification (points, badges, streaks)
- Multiple visual progress indicators (circular, animal path, hourglass, progress bar)
- Customizable themes (Divertido, Minimalista)
- Break suggestions in Brazilian Portuguese with illustrations
- Audio feedback using Web Audio API
- Settings panel for customization
- Local storage persistence

---

## Phase 1: Core Improvements (In Progress)

### Bug Fixes
- [x] Fix button click responsiveness
- [x] Fix progress indicator dynamic switching
- [ ] Test all progress indicators thoroughly
- [ ] Ensure theme switching works correctly

### Remaining Features from Initial Plan
- [ ] Classical music player with educational info
- [ ] YouTube integration for custom music
- [ ] Rewards shop (spend points to unlock items)
- [ ] Badges display screen
- [ ] Celebration animations on pomodoro completion
- [ ] Unlockable themes (Floresta, Espaço, Oceano, Doces)

---

## Phase 2: Profile Enhancements

### Edit Profile (Priority: High)
- [ ] Allow changing profile name
- [ ] Allow changing avatar to another animal
- [ ] Allow uploading custom avatar from local file
- [ ] Profile deletion confirmation

### Profile Stats
- [ ] Detailed statistics view (weekly, monthly charts)
- [ ] Export stats to PDF/image

---

## Phase 3: Illustration Sets

### Art Style Packs
Create two distinct illustration sets for break suggestions:

1. **"Aventuras Claras"** (TinTin-inspired)
   - Clean line art
   - Bold, clear colors
   - Expressive characters
   - Adventure/exploration feel

2. **"Sonhos Encantados"** (Studio Ghibli-inspired)
   - Soft, watercolor-like tones
   - Warm, gentle aesthetics
   - Whimsical, magical feel
   - Nature-focused elements

### Implementation
- [ ] Create ~25 illustrations per set
- [ ] Add set selector in settings
- [ ] Store preference per profile
- [ ] Consider commissioning artist or using AI-assisted generation

---

## Phase 4: App Store Distribution

### Android (Google Play Store)
- [ ] Set up Capacitor or Cordova for native wrapper
- [ ] Configure Android build with proper icons and splash screens
- [ ] Create Google Play Developer account ($25 one-time)
- [ ] Prepare store listing (screenshots, description in Portuguese/English)
- [ ] Set up app signing
- [ ] Submit for review

### iOS (Apple App Store)
- [ ] Set up Capacitor/Cordova iOS build
- [ ] Create Apple Developer account ($99/year)
- [ ] Configure app icons and launch screens
- [ ] Handle iOS-specific audio permissions
- [ ] Submit for TestFlight, then App Store review

### Windows (Microsoft Store)
- [ ] Package as PWA or Electron app
- [ ] Create Microsoft Partner Center account
- [ ] Generate MSIX package
- [ ] Submit for certification

### macOS (Mac App Store)
- [ ] Create Electron or Tauri wrapper
- [ ] Configure code signing and notarization
- [ ] Prepare app sandbox entitlements
- [ ] Submit via App Store Connect

### Alternative: PWA Distribution
- [ ] Add service worker for offline support
- [ ] Configure web app manifest
- [ ] Enable "Add to Home Screen" prompts
- [ ] This works on all platforms without store fees

---

## Phase 5: Monetization (Donations)

### "Buy Me an Ice Cream" Feature
Suggested donation amounts by region:
- Brazil: R$ 10,00
- USA: $3.00
- Europe: €3,00
- UK: £2.50
- Japan: ¥500
- Other: Auto-detect or let user choose

### Implementation Options
1. **Ko-fi** - Simple, no fees for donations
2. **Buy Me a Coffee** - Popular, easy setup
3. **GitHub Sponsors** - Good for open-source
4. **Stripe** - Direct payments, more control
5. **PIX (Brazil)** - Direct bank transfer, very popular

### Features
- [ ] Donation button in settings/about screen
- [ ] "Thank you" badge for donors (optional, privacy-respecting)
- [ ] No features locked behind paywall - purely voluntary
- [ ] Clear message: "If this app helps your family, consider buying us an ice cream!"

---

## Phase 6: Additional Features (Future)

### Educational Enhancements
- [ ] Add more classical music pieces
- [ ] Music quiz mini-game during breaks
- [ ] Instrument recognition game
- [ ] Composer fun facts

### Social Features (Optional)
- [ ] Family sharing (sync between devices)
- [ ] Friendly competition between siblings
- [ ] Share achievements on social media

### Accessibility
- [ ] Screen reader support
- [ ] High contrast theme
- [ ] Reduced motion option
- [ ] Larger text option

### Localization
- [ ] English translation
- [ ] Spanish translation
- [ ] Other languages based on demand

---

## Technical Debt & Improvements

- [ ] Add unit tests for stores
- [ ] Add component tests
- [ ] Set up CI/CD with GitHub Actions
- [ ] Optimize bundle size
- [ ] Add error boundary components
- [ ] Implement proper error logging

---

## Contributing

This is a family project, but contributions are welcome! Please:
1. Open an issue to discuss major changes
2. Follow existing code style
3. Test your changes thoroughly
4. Keep the kid-friendly spirit

---

## Notes

- Keep the app simple and fun - avoid feature creep
- Performance matters on older devices (kids often use hand-me-down tablets)
- Privacy first - no analytics, no tracking, all data stays local
- Test with actual children for UX feedback
